package br.com.coletaqui.backend.user;

import br.com.coletaqui.backend.user.dto.UpdateUserProfileRequest;
import br.com.coletaqui.backend.user.dto.UserProfileResponse;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public UserProfileResponse getProfile(UUID userId) {
		return userRepository.findById(userId)
			.map(this::toResponse)
			.orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
	}

	@Transactional
	public UserProfileResponse updateProfile(UUID userId, UpdateUserProfileRequest request) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

		user.setName(request.name().trim());
		user.setRegion(blankToNull(request.region()));
		user.setMaterials(blankToNull(request.materials()));
		user.setAvailability(blankToNull(request.availability()));
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
			user.getCreatedAt(),
			user.getUpdatedAt()
		);
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
