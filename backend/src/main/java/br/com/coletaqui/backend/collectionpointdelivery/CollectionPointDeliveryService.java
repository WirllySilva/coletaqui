package br.com.coletaqui.backend.collectionpointdelivery;

import br.com.coletaqui.backend.collectionpoint.CollectionPointRepository;
import br.com.coletaqui.backend.collectionpointdelivery.dto.CollectionPointDeliveryResponse;
import br.com.coletaqui.backend.collectionpointdelivery.dto.CreateCollectionPointDeliveryRequest;
import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.material.MaterialTypeRepository;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CollectionPointDeliveryService {
	private final CollectionPointDeliveryRepository deliveryRepository;
	private final CollectionPointRepository collectionPointRepository;
	private final MaterialTypeRepository materialTypeRepository;
	private final UserRepository userRepository;

	public CollectionPointDeliveryService(
		CollectionPointDeliveryRepository deliveryRepository,
		CollectionPointRepository collectionPointRepository,
		MaterialTypeRepository materialTypeRepository,
		UserRepository userRepository
	) {
		this.deliveryRepository = deliveryRepository;
		this.collectionPointRepository = collectionPointRepository;
		this.materialTypeRepository = materialTypeRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public CollectionPointDeliveryResponse create(UUID userId, CreateCollectionPointDeliveryRequest request) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (user.getRole() != UserRole.COMMON_USER || user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Apenas moradores ativos podem registrar entrega em ponto de coleta.");
		}

		var point = collectionPointRepository.findById(request.collectionPointId())
			.filter(collectionPoint -> collectionPoint.isActive())
			.orElseThrow(() -> new IllegalArgumentException("Ponto de coleta nao encontrado ou inativo."));
		if (point.getResponsibleCollector() == null) {
			throw new IllegalArgumentException("Este ponto ainda nao confirma entregas pelo app.");
		}

		if (request.plannedDate().isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("Data desejada nao pode ser anterior a hoje.");
		}

		var materials = materialTypeRepository.findByIdIn(request.materialTypeIds());
		if (materials.size() != request.materialTypeIds().size()) {
			throw new IllegalArgumentException("Um ou mais materiais nao foram encontrados.");
		}
		if (materials.stream().anyMatch(material -> !pointAcceptsMaterial(point.getMaterials(), material))) {
			throw new IllegalArgumentException("O ponto selecionado nao recebe um ou mais materiais informados.");
		}

		var delivery = new CollectionPointDelivery();
		delivery.setUser(user);
		delivery.setCollectionPoint(point);
		delivery.setMaterials(new LinkedHashSet<>(materials));
		delivery.setPlannedDate(request.plannedDate());
		delivery.setPreferredPeriod(request.preferredPeriod().trim());
		delivery.setNotes(blankToNull(request.notes()));
		delivery.setStatus(CollectionPointDeliveryStatus.PLANNED);

		return toResponse(deliveryRepository.save(delivery));
	}

	@Transactional(readOnly = true)
	public List<CollectionPointDeliveryResponse> listMine(UUID userId) {
		return deliveryRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<CollectionPointDeliveryResponse> listForCollector(UUID collectorId) {
		ensureCollector(collectorId);
		return deliveryRepository.findByCollectionPointResponsibleCollectorIdOrderByCreatedAtDesc(collectorId).stream().map(this::toResponse).toList();
	}

	@Transactional
	public CollectionPointDeliveryResponse confirm(UUID collectorId, UUID deliveryId) {
		ensureCollector(collectorId);
		var delivery = deliveryRepository.findById(deliveryId)
			.orElseThrow(() -> new IllegalArgumentException("Entrega nao encontrada."));
		var responsible = delivery.getCollectionPoint().getResponsibleCollector();
		if (responsible == null || !responsible.getId().equals(collectorId)) {
			throw new IllegalArgumentException("Esta entrega pertence a outro ponto de coleta.");
		}
		if (delivery.getStatus() == CollectionPointDeliveryStatus.CANCELED) {
			throw new IllegalArgumentException("Entrega cancelada nao pode ser confirmada.");
		}
		if (delivery.getStatus() != CollectionPointDeliveryStatus.CONFIRMED) {
			delivery.setStatus(CollectionPointDeliveryStatus.CONFIRMED);
			delivery.setConfirmedAt(OffsetDateTime.now());
		}
		return toResponse(delivery);
	}

	private CollectionPointDeliveryResponse toResponse(CollectionPointDelivery delivery) {
		var point = delivery.getCollectionPoint();
		return new CollectionPointDeliveryResponse(
			delivery.getId(),
			delivery.getUser().getName(),
			delivery.getUser().getPhone(),
			point.getId(),
			point.getName(),
			"%s, %s/%s".formatted(point.getAddress(), point.getCity(), point.getState()),
			delivery.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
			delivery.getPlannedDate(),
			delivery.getPreferredPeriod(),
			delivery.getNotes(),
			delivery.getStatus(),
			delivery.getCreatedAt(),
			delivery.getConfirmedAt(),
			delivery.getCanceledAt()
		);
	}

	private void ensureCollector(UUID collectorId) {
		var collector = userRepository.findById(collectorId)
			.orElseThrow(() -> new IllegalArgumentException("Coletor nao encontrado."));
		if (collector.getRole() != UserRole.COLLECTOR || collector.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Apenas coletores ativos podem confirmar entregas em ponto.");
		}
	}

	private String blankToNull(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}
		return value.trim();
	}

	private boolean pointAcceptsMaterial(String acceptedMaterials, MaterialType material) {
		if (acceptedMaterials == null || acceptedMaterials.isBlank()) {
			return true;
		}

		var accepted = normalize(acceptedMaterials);
		var materialName = normalize(material.getName());
		var materialSlug = normalize(material.getSlug()).replace("-", " ");

		if (accepted.contains(materialName) || accepted.contains(materialSlug) || materialName.contains(accepted) || materialSlug.contains(accepted)) {
			return true;
		}

		for (var token : accepted.split("\\s+|,")) {
			if (token.length() > 3 && (materialName.contains(token) || materialSlug.contains(token))) {
				return true;
			}
		}

		for (var token : materialSlug.split("\\s+")) {
			if (token.length() > 3 && accepted.contains(token)) {
				return true;
			}
		}

		return false;
	}

	private String normalize(String value) {
		return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
			.replaceAll("\\p{M}", "")
			.toLowerCase(Locale.ROOT)
			.trim();
	}
}
