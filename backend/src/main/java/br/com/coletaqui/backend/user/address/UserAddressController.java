package br.com.coletaqui.backend.user.address;

import br.com.coletaqui.backend.user.address.dto.UpsertUserAddressRequest;
import br.com.coletaqui.backend.user.address.dto.UserAddressResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/me/addresses")
@Tag(name = "Enderecos do usuario", description = "Enderecos vinculados ao usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class UserAddressController {
	private final UserAddressService userAddressService;

	public UserAddressController(UserAddressService userAddressService) {
		this.userAddressService = userAddressService;
	}

	@GetMapping
	@Operation(summary = "Lista meus enderecos")
	public ResponseEntity<List<UserAddressResponse>> list(Authentication authentication) {
		return ResponseEntity.ok(userAddressService.list(userId(authentication)));
	}

	@PostMapping
	@Operation(summary = "Cadastra um endereco")
	public ResponseEntity<UserAddressResponse> create(
		Authentication authentication,
		@Valid @RequestBody UpsertUserAddressRequest request
	) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userAddressService.create(userId(authentication), request));
	}

	@PutMapping("/{addressId}")
	@Operation(summary = "Atualiza um endereco")
	public ResponseEntity<UserAddressResponse> update(
		Authentication authentication,
		@PathVariable UUID addressId,
		@Valid @RequestBody UpsertUserAddressRequest request
	) {
		return ResponseEntity.ok(userAddressService.update(userId(authentication), addressId, request));
	}

	@DeleteMapping("/{addressId}")
	@Operation(summary = "Remove um endereco")
	public ResponseEntity<Void> delete(Authentication authentication, @PathVariable UUID addressId) {
		userAddressService.delete(userId(authentication), addressId);
		return ResponseEntity.noContent().build();
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
