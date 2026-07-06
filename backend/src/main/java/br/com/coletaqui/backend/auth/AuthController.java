package br.com.coletaqui.backend.auth;

import br.com.coletaqui.backend.auth.dto.AuthResponse;
import br.com.coletaqui.backend.auth.dto.AdminLoginRequest;
import br.com.coletaqui.backend.auth.dto.CompleteProfileRequest;
import br.com.coletaqui.backend.auth.dto.OtpRequest;
import br.com.coletaqui.backend.auth.dto.OtpRequestResponse;
import br.com.coletaqui.backend.auth.dto.OtpVerifyRequest;
import br.com.coletaqui.backend.user.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Login e cadastro com OTP por WhatsApp")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/request-otp")
	@Operation(summary = "Solicita OTP por WhatsApp", description = "Envia um código OTP para iniciar login ou cadastro.")
	public ResponseEntity<OtpRequestResponse> requestOtp(@Valid @RequestBody OtpRequest request) {
		return ResponseEntity.ok(authService.requestOtp(request));
	}

	@PostMapping("/verify-otp")
	@Operation(summary = "Valida OTP", description = "Valida o código recebido por WhatsApp e retorna JWT.")
	public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
		return ResponseEntity.ok(authService.verifyOtp(request));
	}

	@PostMapping("/common/request-otp")
	@Operation(summary = "Solicita OTP para usuário comum")
	public ResponseEntity<OtpRequestResponse> requestCommonOtp(@Valid @RequestBody OtpRequest request) {
		return ResponseEntity.ok(authService.requestOtp(new OtpRequest(request.phone(), UserRole.COMMON_USER)));
	}

	@PostMapping("/common/verify-otp")
	@Operation(summary = "Valida OTP de usuário comum")
	public ResponseEntity<AuthResponse> verifyCommonOtp(@Valid @RequestBody OtpVerifyRequest request) {
		return ResponseEntity.ok(authService.verifyOtp(new OtpVerifyRequest(request.phone(), request.code(), UserRole.COMMON_USER)));
	}

	@PostMapping("/collector/request-otp")
	@Operation(summary = "Solicita OTP para catador/coletor")
	public ResponseEntity<OtpRequestResponse> requestCollectorOtp(@Valid @RequestBody OtpRequest request) {
		return ResponseEntity.ok(authService.requestOtp(new OtpRequest(request.phone(), UserRole.COLLECTOR)));
	}

	@PostMapping("/collector/verify-otp")
	@Operation(summary = "Valida OTP de catador/coletor")
	public ResponseEntity<AuthResponse> verifyCollectorOtp(@Valid @RequestBody OtpVerifyRequest request) {
		return ResponseEntity.ok(authService.verifyOtp(new OtpVerifyRequest(request.phone(), request.code(), UserRole.COLLECTOR)));
	}

	@PostMapping("/admin/login")
	@Operation(summary = "Login administrativo", description = "Autentica administradores com e-mail e senha.")
	public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
		return ResponseEntity.ok(authService.adminLogin(request));
	}

	@PostMapping("/complete-profile")
	@SecurityRequirement(name = "bearerAuth")
	@Operation(summary = "Completa cadastro", description = "Completa o perfil depois da validação do OTP.")
	public ResponseEntity<AuthResponse> completeProfile(
		Authentication authentication,
		@Valid @RequestBody CompleteProfileRequest request
	) {
		var userId = UUID.fromString(authentication.getName());
		return ResponseEntity.ok(authService.completeProfile(userId, request));
	}
}
