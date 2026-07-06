package br.com.coletaqui.backend.user;

import br.com.coletaqui.backend.user.address.UserAddress;
import br.com.coletaqui.backend.user.address.UserAddressRepository;
import br.com.coletaqui.backend.user.dto.CollectorResponse;
import br.com.coletaqui.backend.user.dto.UpdateUserProfileRequest;
import br.com.coletaqui.backend.user.dto.UserProfileResponse;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final UserAddressRepository userAddressRepository;

	public UserService(UserRepository userRepository, UserAddressRepository userAddressRepository) {
		this.userRepository = userRepository;
		this.userAddressRepository = userAddressRepository;
	}

	@Transactional(readOnly = true)
	public UserProfileResponse getProfile(UUID userId) {
		return userRepository.findById(userId)
			.map(this::toResponse)
			.orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
	}

	@Transactional(readOnly = true)
	public List<CollectorResponse> listCollectors() {
		return userRepository.findByRoleAndProfileCompleteTrue(UserRole.COLLECTOR)
			.stream()
			.filter(user -> user.getStatus() == UserStatus.ACTIVE)
			.sorted(Comparator.comparing(user -> user.getName() == null ? "" : user.getName()))
			.map(this::toCollectorResponse)
			.toList();
	}

	@Transactional
	public UserProfileResponse updateProfile(UUID userId, UpdateUserProfileRequest request) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

		user.setName(request.name().trim());
		user.setRegion(blankToNull(request.region()));
		user.setMaterials(blankToNull(request.materials()));
		user.setAvailability(blankToNull(request.availability()));
		if (user.getRole() == UserRole.COLLECTOR) {
			user.setCollectorServiceType(parseCollectorServiceType(request.collectorServiceType()));
		}
		user.setProfileComplete(true);

		return toResponse(user);
	}

	private UserProfileResponse toResponse(User user) {
		return new UserProfileResponse(
			user.getId(),
			user.getPhone(),
			user.getName(),
			user.getRole(),
			user.getStatus(),
			user.isProfileComplete(),
			user.getRegion(),
			user.getMaterials(),
			user.getAvailability(),
			user.getCollectorServiceType() == null ? null : user.getCollectorServiceType().name(),
			user.getCreatedAt(),
			user.getUpdatedAt()
		);
	}

	private CollectorResponse toCollectorResponse(User user) {
		var serviceType = user.getCollectorServiceType() == null
			? CollectorServiceType.HOME_COLLECTION
			: user.getCollectorServiceType();
		var address = shouldShowAddress(serviceType)
			? userAddressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(user.getId())
				.stream()
				.findFirst()
				.map(this::addressLine)
				.orElse(null)
			: null;

		return new CollectorResponse(
			user.getId(),
			user.getName(),
			user.getPhone(),
			user.getRegion(),
			user.getMaterials(),
			user.getAvailability(),
			serviceType.name(),
			address
		);
	}

	private boolean shouldShowAddress(CollectorServiceType serviceType) {
		return serviceType == CollectorServiceType.DROP_OFF_POINT
			|| serviceType == CollectorServiceType.HOME_COLLECTION_AND_DROP_OFF;
	}

	private String addressLine(UserAddress address) {
		var number = address.getNumber() == null || address.getNumber().isBlank() ? "" : ", " + address.getNumber();
		var complement = address.getComplement() == null || address.getComplement().isBlank() ? "" : " - " + address.getComplement();
		var zipCode = address.getZipCode() == null || address.getZipCode().isBlank() ? "" : ", CEP " + address.getZipCode();

		return "%s%s%s, %s, %s/%s%s".formatted(
			address.getStreet(),
			number,
			complement,
			address.getNeighborhood(),
			address.getCity(),
			address.getState(),
			zipCode
		);
	}

	private CollectorServiceType parseCollectorServiceType(String value) {
		if (value == null || value.isBlank()) {
			return CollectorServiceType.HOME_COLLECTION;
		}

		try {
			return CollectorServiceType.valueOf(value.trim().toUpperCase());
		} catch (RuntimeException exception) {
			throw new IllegalArgumentException("Tipo de atendimento do coletor invalido.");
		}
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
