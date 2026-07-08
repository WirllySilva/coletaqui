package br.com.coletaqui.backend.collectionpoint;

import br.com.coletaqui.backend.collectionpoint.dto.CollectionPointResponse;
import br.com.coletaqui.backend.collectionpoint.dto.UpsertCollectionPointRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CollectionPointService {
	private final CollectionPointRepository collectionPointRepository;

	public CollectionPointService(CollectionPointRepository collectionPointRepository) {
		this.collectionPointRepository = collectionPointRepository;
	}

	@Transactional(readOnly = true)
	public List<CollectionPointResponse> listActive() {
		return collectionPointRepository.findByActiveTrueOrderByNameAsc().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<CollectionPointResponse> listAll() {
		return collectionPointRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
	}

	@Transactional
	public CollectionPointResponse create(UpsertCollectionPointRequest request) {
		var point = new CollectionPoint();
		apply(point, request);
		return toResponse(collectionPointRepository.save(point));
	}

	@Transactional
	public CollectionPointResponse update(UUID pointId, UpsertCollectionPointRequest request) {
		var point = collectionPointRepository.findById(pointId)
			.orElseThrow(() -> new IllegalArgumentException("Ponto de recebimento nao encontrado."));
		apply(point, request);
		return toResponse(point);
	}

	@Transactional
	public CollectionPointResponse toggle(UUID pointId) {
		var point = collectionPointRepository.findById(pointId)
			.orElseThrow(() -> new IllegalArgumentException("Ponto de recebimento nao encontrado."));
		point.setActive(!point.isActive());
		return toResponse(point);
	}

	private void apply(CollectionPoint point, UpsertCollectionPointRequest request) {
		point.setName(request.name().trim());
		point.setDescription(blankToNull(request.description()));
		point.setAddress(request.address().trim());
		point.setCity(blankToDefault(request.city(), "Aracoiaba"));
		point.setState(blankToDefault(request.state(), "PE").toUpperCase());
		point.setMaterials(blankToNull(request.materials()));
		point.setOpeningHours(blankToNull(request.openingHours()));
		point.setLatitude(request.latitude());
		point.setLongitude(request.longitude());
		point.setActive(request.active());
	}

	private CollectionPointResponse toResponse(CollectionPoint point) {
		return new CollectionPointResponse(
			point.getId(),
			point.getName(),
			point.getDescription(),
			point.getAddress(),
			point.getCity(),
			point.getState(),
			point.getMaterials(),
			point.getOpeningHours(),
			point.getLatitude(),
			point.getLongitude(),
			point.isActive(),
			point.getCreatedAt(),
			point.getUpdatedAt()
		);
	}

	private String blankToDefault(String value, String fallback) {
		return value == null || value.isBlank() ? fallback : value.trim();
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
