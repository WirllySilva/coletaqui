package br.com.coletaqui.backend.user;

import br.com.coletaqui.backend.user.dto.UpdateUserProfileRequest;
import br.com.coletaqui.backend.user.dto.UserProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@Tag(name = "Usuários", description = "Perfil do usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	@Operation(summary = "Consulta meu perfil")
	public ResponseEntity<UserProfileResponse> getMyProfile(Authentication authentication) {
		return ResponseEntity.ok(userService.getProfile(userId(authentication)));
	}

	@PutMapping("/me")
	@Operation(summary = "Atualiza meu perfil")
	public ResponseEntity<UserProfileResponse> updateMyProfile(
		Authentication authentication,
		@Valid @RequestBody UpdateUserProfileRequest request
	) {
		return ResponseEntity.ok(userService.updateProfile(userId(authentication), request));
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
