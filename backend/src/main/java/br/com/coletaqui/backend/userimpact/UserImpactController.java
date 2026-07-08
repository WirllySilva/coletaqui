package br.com.coletaqui.backend.userimpact;

import br.com.coletaqui.backend.userimpact.dto.UserImpactSummaryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user-impact")
@Tag(name = "Impacto do morador", description = "Historico consolidado de coletas e entregas do morador")
@SecurityRequirement(name = "bearerAuth")
public class UserImpactController {
	private final UserImpactService userImpactService;

	public UserImpactController(UserImpactService userImpactService) {
		this.userImpactService = userImpactService;
	}

	@GetMapping("/me")
	@Operation(summary = "Resumo consolidado do impacto do morador")
	public ResponseEntity<UserImpactSummaryResponse> mine(Authentication authentication) {
		return ResponseEntity.ok(userImpactService.mine(UUID.fromString(authentication.getName())));
	}
}
