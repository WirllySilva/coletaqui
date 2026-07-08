package br.com.coletaqui.backend.collectionpoint;

import br.com.coletaqui.backend.collectionpoint.dto.CollectionPointResponse;
import br.com.coletaqui.backend.collectionpoint.dto.UpsertCollectionPointRequest;
import br.com.coletaqui.backend.user.CollectorServiceType;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import org.springframework.beans.factory.annotation.Value;
import java.util.Locale;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CollectionPointService {
	private final CollectionPointRepository collectionPointRepository;
	private final UserRepository userRepository;
	private final String defaultAreaCode;

	public CollectionPointService(
		CollectionPointRepository collectionPointRepository,
		UserRepository userRepository,
		@Value("${app.phone.default-area-code:81}") String defaultAreaCode
	) {
		this.collectionPointRepository = collectionPointRepository;
		this.userRepository = userRepository;
		this.defaultAreaCode = defaultAreaCode;
	}

	@Transactional(readOnly = true)
	public List<CollectionPointResponse> listActive() {
		return collectionPointRepository.findByActiveTrueOrderByNameAsc().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<CollectionPointResponse> listAll() {
		return collectionPointRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
	}

	@Transactional
	public CollectionPointResponse create(UpsertCollectionPointRequest request) {
		var point = new CollectionPoint();
		apply(point, request);
		return toResponse(collectionPointRepository.save(point));
	}

	@Transactional
	public CollectionPointResponse update(UUID pointId, UpsertCollectionPointRequest request) {
		var point = collectionPointRepository.findById(pointId)
			.orElseThrow(() -> new IllegalArgumentException("Ponto de recebimento nao encontrado."));
		apply(point, request);
		return toResponse(point);
	}

	@Transactional
	public CollectionPointResponse toggle(UUID pointId) {
		var point = collectionPointRepository.findById(pointId)
			.orElseThrow(() -> new IllegalArgumentException("Ponto de recebimento nao encontrado."));
		point.setActive(!point.isActive());
		return toResponse(point);
	}

	private void apply(CollectionPoint point, UpsertCollectionPointRequest request) {
		point.setName(request.name().trim());
		point.setDescription(blankToNull(request.description()));
		point.setAddress(request.address().trim());
		point.setCity(blankToDefault(request.city(), "Aracoiaba"));
		point.setState(blankToDefault(request.state(), "PE").toUpperCase());
		point.setMaterials(blankToNull(request.materials()));
		point.setOpeningHours(blankToNull(request.openingHours()));
		point.setResponsibleCollector(resolveResponsibleCollector(request.responsiblePhone(), point));
		point.setLatitude(request.latitude());
		point.setLongitude(request.longitude());
		point.setActive(request.active());
	}

	private CollectionPointResponse toResponse(CollectionPoint point) {
		var responsible = point.getResponsibleCollector();
		return new CollectionPointResponse(
			point.getId(),
			point.getName(),
			point.getDescription(),
			point.getAddress(),
			point.getCity(),
			point.getState(),
			point.getMaterials(),
			point.getOpeningHours(),
			responsible == null ? null : responsible.getId(),
			responsible == null ? null : responsible.getName(),
			responsible == null ? null : responsible.getPhone(),
			point.getLatitude(),
			point.getLongitude(),
			point.isActive(),
			point.getCreatedAt(),
			point.getUpdatedAt()
		);
	}

	private String blankToDefault(String value, String fallback) {
		return value == null || value.isBlank() ? fallback : value.trim();
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	private User resolveResponsibleCollector(String phone, CollectionPoint point) {
		if (phone == null || phone.isBlank()) {
			return null;
		}

		var normalizedPhone = normalizePhone(phone);
		var existing = userRepository.findByPhone(normalizedPhone);
		if (existing.isPresent()) {
			var user = existing.get();
			if (user.getRole() != UserRole.COLLECTOR) {
				throw new IllegalArgumentException("Telefone do responsavel ja pertence a um morador ou administrador.");
			}
			user.setStatus(UserStatus.ACTIVE);
			user.setProfileComplete(true);
			user.setCollectorServiceType(collectorServiceTypeFor(user));
			if (isBlank(user.getName())) {
				user.setName(point.getName());
			}
			user.setRegion("Aracoiaba/PE");
			user.setMaterials(blankToDefault(point.getMaterials(), "Materiais reciclaveis"));
			user.setAvailability(blankToDefault(point.getOpeningHours(), "Horario do ponto"));
			return user;
		}

		var user = new User();
		user.setPhone(normalizedPhone);
		user.setName(point.getName());
		user.setRole(UserRole.COLLECTOR);
		user.setStatus(UserStatus.ACTIVE);
		user.setProfileComplete(true);
		user.setRegion("Aracoiaba/PE");
		user.setMaterials(blankToDefault(point.getMaterials(), "Materiais reciclaveis"));
		user.setAvailability(blankToDefault(point.getOpeningHours(), "Horario do ponto"));
		user.setCollectorServiceType(CollectorServiceType.DROP_OFF_POINT);
		return userRepository.save(user);
	}

	private CollectorServiceType collectorServiceTypeFor(User user) {
		if (user.getCollectorServiceType() == CollectorServiceType.HOME_COLLECTION_AND_DROP_OFF) {
			return CollectorServiceType.HOME_COLLECTION_AND_DROP_OFF;
		}
		return CollectorServiceType.DROP_OFF_POINT;
	}

	private String normalizePhone(String phone) {
		var digits = phone.replaceAll("\\D", "");
		if (digits.length() == 13 && digits.startsWith("55")) {
			digits = digits.substring(2);
		}

		if (digits.length() == 9 && digits.startsWith("9")) {
			digits = defaultAreaCode + digits;
		}

		if (!digits.matches("[1-9]\\d9\\d{8}")) {
			throw new IllegalArgumentException("Telefone do responsavel invalido.");
		}

		return digits;
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}
}
