package br.com.coletaqui.backend.push;

import br.com.coletaqui.backend.push.dto.PushPublicKeyResponse;
import br.com.coletaqui.backend.push.dto.PushSubscriptionRequest;
import br.com.coletaqui.backend.push.dto.PushSubscriptionResponse;
import br.com.coletaqui.backend.push.dto.PushTestRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/push")
@Tag(name = "Notificacoes Push", description = "Inscricao de dispositivos PWA para notificacoes")
@SecurityRequirement(name = "bearerAuth")
public class PushNotificationController {
	private final PushNotificationService pushNotificationService;

	public PushNotificationController(PushNotificationService pushNotificationService) {
		this.pushNotificationService = pushNotificationService;
	}

	@GetMapping("/public-key")
	@Operation(summary = "Retorna chave publica VAPID")
	public ResponseEntity<PushPublicKeyResponse> publicKey() {
		return ResponseEntity.ok(pushNotificationService.publicKey());
	}

	@GetMapping("/subscriptions")
	@Operation(summary = "Lista dispositivos inscritos do usuario autenticado")
	public ResponseEntity<List<PushSubscriptionResponse>> mine(Authentication authentication) {
		return ResponseEntity.ok(pushNotificationService.mine(userId(authentication)));
	}

	@PostMapping("/subscriptions")
	@Operation(summary = "Inscreve dispositivo para receber push")
	public ResponseEntity<PushSubscriptionResponse> subscribe(
		Authentication authentication,
		@Valid @RequestBody PushSubscriptionRequest request,
		HttpServletRequest servletRequest
	) {
		return ResponseEntity.ok(pushNotificationService.subscribe(
			userId(authentication),
			request,
			servletRequest.getHeader("User-Agent")
		));
	}

	@DeleteMapping("/subscriptions")
	@Operation(summary = "Desativa inscricao push do dispositivo")
	public ResponseEntity<Void> unsubscribe(Authentication authentication, @Valid @RequestBody PushSubscriptionRequest request) {
		pushNotificationService.unsubscribe(userId(authentication), request);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/test")
	@Operation(summary = "Envia notificacao de teste para o usuario autenticado")
	public ResponseEntity<Void> test(Authentication authentication, @RequestBody(required = false) PushTestRequest request) {
		pushNotificationService.sendTest(userId(authentication), request == null ? new PushTestRequest(null, null, null) : request);
		return ResponseEntity.noContent().build();
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
