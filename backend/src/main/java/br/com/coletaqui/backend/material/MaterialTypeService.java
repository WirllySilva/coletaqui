package br.com.coletaqui.backend.material;

import br.com.coletaqui.backend.material.dto.MaterialTypeResponse;
import br.com.coletaqui.backend.material.dto.UpsertMaterialTypeRequest;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
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

	@Transactional(readOnly = true)
	public List<MaterialTypeResponse> listAll() {
		return materialTypeRepository.findAllByOrderByNameAsc()
			.stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional
	public MaterialTypeResponse create(UpsertMaterialTypeRequest request) {
		var material = new MaterialType();
		apply(material, request);
		return toResponse(materialTypeRepository.save(material));
	}

	@Transactional
	public MaterialTypeResponse update(UUID materialId, UpsertMaterialTypeRequest request) {
		var material = materialTypeRepository.findById(materialId)
			.orElseThrow(() -> new IllegalArgumentException("Material nao encontrado."));
		apply(material, request);
		return toResponse(material);
	}

	@Transactional
	public MaterialTypeResponse toggle(UUID materialId) {
		var material = materialTypeRepository.findById(materialId)
			.orElseThrow(() -> new IllegalArgumentException("Material nao encontrado."));
		material.setActive(!material.isActive());
		return toResponse(material);
	}

	private void apply(MaterialType material, UpsertMaterialTypeRequest request) {
		material.setName(request.name().trim());
		material.setSlug(slug(request.name()));
		material.setDescription(blankToNull(request.description()));
		material.setHazardous(request.hazardous());
		material.setActive(request.active());
	}

	private MaterialTypeResponse toResponse(MaterialType materialType) {
		return new MaterialTypeResponse(
			materialType.getId(),
			materialType.getName(),
			materialType.getSlug(),
			materialType.getDescription(),
			materialType.isHazardous(),
			materialType.isActive()
		);
	}

	private String slug(String value) {
		var normalized = Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
			.replaceAll("\\p{M}", "");
		return normalized.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
