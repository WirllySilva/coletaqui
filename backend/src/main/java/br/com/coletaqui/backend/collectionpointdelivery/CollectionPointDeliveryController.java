package br.com.coletaqui.backend.collectionpointdelivery;

import br.com.coletaqui.backend.collectionpointdelivery.dto.CollectionPointDeliveryResponse;
import br.com.coletaqui.backend.collectionpointdelivery.dto.CreateCollectionPointDeliveryRequest;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/collection-point-deliveries")
@Tag(name = "Entregas em pontos fixos", description = "Avisos de entrega planejada em pontos fixos de coleta")
@SecurityRequirement(name = "bearerAuth")
public class CollectionPointDeliveryController {
	private final CollectionPointDeliveryService deliveryService;

	public CollectionPointDeliveryController(CollectionPointDeliveryService deliveryService) {
		this.deliveryService = deliveryService;
	}

	@PostMapping
	@Operation(summary = "Registra aviso de entrega em ponto fixo")
	public ResponseEntity<CollectionPointDeliveryResponse> create(Authentication authentication, @Valid @RequestBody CreateCollectionPointDeliveryRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.create(userId(authentication), request));
	}

	@GetMapping("/me")
	@Operation(summary = "Lista entregas em ponto fixo do morador")
	public ResponseEntity<List<CollectionPointDeliveryResponse>> listMine(Authentication authentication) {
		return ResponseEntity.ok(deliveryService.listMine(userId(authentication)));
	}

	@GetMapping("/collector")
	@Operation(summary = "Lista entregas registradas para pontos do coletor")
	public ResponseEntity<List<CollectionPointDeliveryResponse>> listForCollector(Authentication authentication) {
		return ResponseEntity.ok(deliveryService.listForCollector(userId(authentication)));
	}

	@PostMapping("/{deliveryId}/confirm")
	@Operation(summary = "Confirma entrega registrada em ponto fixo")
	public ResponseEntity<CollectionPointDeliveryResponse> confirm(Authentication authentication, @PathVariable UUID deliveryId) {
		return ResponseEntity.ok(deliveryService.confirm(userId(authentication), deliveryId));
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
