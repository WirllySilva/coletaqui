package br.com.coletaqui.backend.dropoff;

import br.com.coletaqui.backend.dropoff.dto.CreateDropOffDeliveryRequest;
import br.com.coletaqui.backend.dropoff.dto.DropOffDeliveryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/drop-offs")
@Tag(name = "Entregas em ponto de coleta", description = "Confirmacao de materiais entregues em pontos de recebimento")
@SecurityRequirement(name = "bearerAuth")
public class DropOffDeliveryController {
	private final DropOffDeliveryService dropOffDeliveryService;

	public DropOffDeliveryController(DropOffDeliveryService dropOffDeliveryService) {
		this.dropOffDeliveryService = dropOffDeliveryService;
	}

	@PostMapping
	@Operation(summary = "Confirma entrega em ponto de coleta")
	public ResponseEntity<DropOffDeliveryResponse> confirm(Authentication authentication, @Valid @RequestBody CreateDropOffDeliveryRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(dropOffDeliveryService.confirm(userId(authentication), request));
	}

	@GetMapping("/collector")
	@Operation(summary = "Lista entregas confirmadas pelo ponto de coleta")
	public ResponseEntity<List<DropOffDeliveryResponse>> listMine(Authentication authentication) {
		return ResponseEntity.ok(dropOffDeliveryService.listMine(userId(authentication)));
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
