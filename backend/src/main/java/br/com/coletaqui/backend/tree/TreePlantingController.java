package br.com.coletaqui.backend.tree;

import br.com.coletaqui.backend.tree.dto.CreateTreePlantingRequest;
import br.com.coletaqui.backend.tree.dto.TreePlantingResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tree-plantings")
@Tag(name = "Plantio de arvores", description = "Registro comunitario de arvores plantadas")
@SecurityRequirement(name = "bearerAuth")
public class TreePlantingController {
	private final TreePlantingService treePlantingService;

	public TreePlantingController(TreePlantingService treePlantingService) {
		this.treePlantingService = treePlantingService;
	}

	@PostMapping(consumes = "multipart/form-data")
	@Operation(summary = "Registra arvore plantada pelo morador")
	public ResponseEntity<TreePlantingResponse> create(
		Authentication authentication,
		@RequestParam(required = false) String treeName,
		@RequestParam String species,
		@RequestParam java.time.LocalDate plantedDate,
		@RequestParam String locationType,
		@RequestParam String neighborhood,
		@RequestParam(required = false) String locationDescription,
		@RequestParam(required = false) String notes,
		@RequestParam(required = false) Double latitude,
		@RequestParam(required = false) Double longitude,
		@RequestParam MultipartFile photo
	) {
		var request = new CreateTreePlantingRequest(treeName, species, plantedDate, locationType, neighborhood, locationDescription, notes, latitude, longitude);
		return ResponseEntity.status(HttpStatus.CREATED).body(treePlantingService.create(userId(authentication), request, photo));
	}

	@GetMapping("/me")
	@Operation(summary = "Lista arvores registradas pelo morador")
	public ResponseEntity<List<TreePlantingResponse>> mine(Authentication authentication) {
		return ResponseEntity.ok(treePlantingService.mine(userId(authentication)));
	}

	@GetMapping("/community")
	@Operation(summary = "Lista arvores validadas da comunidade")
	public ResponseEntity<List<TreePlantingResponse>> community() {
		return ResponseEntity.ok(treePlantingService.community());
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
