package br.com.coletaqui.backend.material;

import br.com.coletaqui.backend.material.dto.MaterialTypeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/materials")
@Tag(name = "Materiais", description = "Tipos de materiais aceitos pelo Coletaqui")
@SecurityRequirement(name = "bearerAuth")
public class MaterialTypeController {
	private final MaterialTypeService materialTypeService;

	public MaterialTypeController(MaterialTypeService materialTypeService) {
		this.materialTypeService = materialTypeService;
	}

	@GetMapping
	@Operation(summary = "Lista materiais ativos")
	public ResponseEntity<List<MaterialTypeResponse>> list() {
		return ResponseEntity.ok(materialTypeService.listActive());
	}
}
