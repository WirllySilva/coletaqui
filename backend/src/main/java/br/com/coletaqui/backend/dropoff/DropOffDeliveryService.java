package br.com.coletaqui.backend.dropoff;

import br.com.coletaqui.backend.dropoff.dto.CreateDropOffDeliveryRequest;
import br.com.coletaqui.backend.dropoff.dto.DropOffDeliveryResponse;
import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.material.MaterialTypeRepository;
import br.com.coletaqui.backend.user.CollectorServiceType;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DropOffDeliveryService {
	private final DropOffDeliveryRepository dropOffDeliveryRepository;
	private final UserRepository userRepository;
	private final MaterialTypeRepository materialTypeRepository;
	private final String defaultAreaCode;

	public DropOffDeliveryService(
		DropOffDeliveryRepository dropOffDeliveryRepository,
		UserRepository userRepository,
		MaterialTypeRepository materialTypeRepository,
		@Value("${app.phone.default-area-code:81}") String defaultAreaCode
	) {
		this.dropOffDeliveryRepository = dropOffDeliveryRepository;
		this.userRepository = userRepository;
		this.materialTypeRepository = materialTypeRepository;
		this.defaultAreaCode = defaultAreaCode.replaceAll("\\D", "");
	}

	@Transactional
	public DropOffDeliveryResponse confirm(UUID collectorId, CreateDropOffDeliveryRequest request) {
		var collector = ensureDropOffCollector(collectorId);
		var userPhone = normalizePhone(request.userPhone());
		var user = userRepository.findByPhone(userPhone)
			.orElseThrow(() -> new IllegalArgumentException("Morador nao encontrado. Ele precisa ter cadastro no Coletaqui."));

		if (user.getRole() != UserRole.COMMON_USER || user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Entrega so pode ser confirmada para morador ativo.");
		}

		var materials = materialTypeRepository.findByIdIn(request.materialTypeIds());
		if (materials.size() != request.materialTypeIds().size()) {
			throw new IllegalArgumentException("Um ou mais materiais nao foram encontrados.");
		}

		var delivery = new DropOffDelivery();
		delivery.setCollector(collector);
		delivery.setUser(user);
		delivery.setMaterials(new LinkedHashSet<>(materials));
		delivery.setNotes(blankToNull(request.notes()));
		return toResponse(dropOffDeliveryRepository.save(delivery));
	}

	@Transactional(readOnly = true)
	public List<DropOffDeliveryResponse> listMine(UUID collectorId) {
		ensureDropOffCollector(collectorId);
		return dropOffDeliveryRepository.findByCollectorIdOrderByConfirmedAtDesc(collectorId).stream().map(this::toResponse).toList();
	}

	private User ensureDropOffCollector(UUID collectorId) {
		var collector = userRepository.findById(collectorId).orElseThrow(() -> new IllegalArgumentException("Coletor nao encontrado."));
		if (collector.getRole() != UserRole.COLLECTOR || collector.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Acesso permitido apenas para coletores ativos.");
		}
		if (collector.getCollectorServiceType() != CollectorServiceType.DROP_OFF_POINT
			&& collector.getCollectorServiceType() != CollectorServiceType.HOME_COLLECTION_AND_DROP_OFF) {
			throw new IllegalArgumentException("Este perfil nao esta configurado para receber entregas no local.");
		}
		return collector;
	}

	private DropOffDeliveryResponse toResponse(DropOffDelivery delivery) {
		return new DropOffDeliveryResponse(
			delivery.getId(),
			delivery.getUser().getName(),
			delivery.getUser().getPhone(),
			delivery.getCollector().getName(),
			delivery.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
			delivery.getNotes(),
			delivery.getConfirmedAt()
		);
	}

	private String normalizePhone(String phone) {
		if (phone == null || phone.isBlank()) {
			throw new IllegalArgumentException("Telefone invalido.");
		}
		var digits = phone.replaceAll("\\D", "");
		if (digits.length() == 13 && digits.startsWith("55")) {
			digits = digits.substring(2);
		}
		if (digits.length() == 9 && digits.startsWith("9")) {
			digits = defaultAreaCode + digits;
		}
		if (!digits.matches("[1-9]\\d9\\d{8}")) {
			throw new IllegalArgumentException("Telefone invalido. Informe um celular com 9 digitos, com ou sem DDD.");
		}
		return digits;
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
