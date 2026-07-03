package br.com.coletaqui.backend.material;

import br.com.coletaqui.backend.material.dto.MaterialTypeResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaterialTypeService {
	private final MaterialTypeRepository materialTypeRepository;

	public MaterialTypeService(MaterialTypeRepository materialTypeRepository) {
		this.materialTypeRepository = materialTypeRepository;
	}

	@Transactional(readOnly = true)
	public List<MaterialTypeResponse> listActive() {
		return materialTypeRepository.findByActiveTrueOrderByNameAsc()
			.stream()
			.map(this::toResponse)
			.toList();
	}

	private MaterialTypeResponse toResponse(MaterialType materialType) {
		return new MaterialTypeResponse(
			materialType.getId(),
			materialType.getName(),
			materialType.getSlug(),
			materialType.getDescription(),
			materialType.isHazardous()
		);
	}
}
