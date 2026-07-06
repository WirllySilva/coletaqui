package br.com.coletaqui.backend.collectionpoint;

import br.com.coletaqui.backend.collectionpoint.dto.CollectionPointResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/collection-points")
@Tag(name = "Pontos de recebimento", description = "Pontos fixos de recebimento de materiais")
@SecurityRequirement(name = "bearerAuth")
public class CollectionPointController {
	private final CollectionPointService collectionPointService;

	public CollectionPointController(CollectionPointService collectionPointService) {
		this.collectionPointService = collectionPointService;
	}

	@GetMapping
	@Operation(summary = "Lista pontos ativos")
	public ResponseEntity<List<CollectionPointResponse>> list() {
		return ResponseEntity.ok(collectionPointService.listActive());
	}
}
