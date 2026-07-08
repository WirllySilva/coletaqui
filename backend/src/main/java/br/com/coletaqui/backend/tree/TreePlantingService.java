package br.com.coletaqui.backend.tree;

import br.com.coletaqui.backend.tree.dto.CreateTreePlantingRequest;
import br.com.coletaqui.backend.tree.dto.TreePlantingResponse;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TreePlantingService {
	private final TreePlantingRepository treePlantingRepository;
	private final UserRepository userRepository;
	private final TreePhotoStorage treePhotoStorage;

	public TreePlantingService(TreePlantingRepository treePlantingRepository, UserRepository userRepository, TreePhotoStorage treePhotoStorage) {
		this.treePlantingRepository = treePlantingRepository;
		this.userRepository = userRepository;
		this.treePhotoStorage = treePhotoStorage;
	}

	@Transactional
	public TreePlantingResponse create(UUID userId, CreateTreePlantingRequest request, MultipartFile photo) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (user.getRole() != UserRole.COMMON_USER) {
			throw new IllegalArgumentException("Apenas moradores podem registrar arvores plantadas.");
		}
		if (request.plantedDate().isAfter(LocalDate.now())) {
			throw new IllegalArgumentException("Data de plantio nao pode ser futura.");
		}
		validateCoordinates(request.latitude(), request.longitude());
		var storedPhoto = treePhotoStorage.store(photo);

		var planting = new TreePlanting();
		planting.setUser(user);
		planting.setTreeName(blankToNull(request.treeName()));
		planting.setSpecies(request.species().trim());
		planting.setPlantedDate(request.plantedDate());
		planting.setLocationType(request.locationType().trim());
		planting.setNeighborhood(request.neighborhood().trim());
		planting.setLocationDescription(blankToNull(request.locationDescription()));
		planting.setNotes(blankToNull(request.notes()));
		planting.setPhotoUrl(storedPhoto.url());
		planting.setPhotoPath(storedPhoto.path());
		planting.setLatitude(request.latitude());
		planting.setLongitude(request.longitude());
		planting.setStatus(TreePlantingStatus.REGISTERED);
		return toResponse(treePlantingRepository.save(planting));
	}

	@Transactional(readOnly = true)
	public List<TreePlantingResponse> mine(UUID userId) {
		return treePlantingRepository.findByUserIdOrderByPlantedDateDesc(userId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<TreePlantingResponse> community() {
		return treePlantingRepository.findByStatusOrderByPlantedDateDesc(TreePlantingStatus.VALIDATED).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<TreePlantingResponse> allForAdmin(UUID adminId) {
		ensureAdmin(adminId);
		return treePlantingRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
	}

	@Transactional
	public TreePlantingResponse validate(UUID adminId, UUID plantingId) {
		ensureAdmin(adminId);
		var planting = planting(plantingId);
		planting.setStatus(TreePlantingStatus.VALIDATED);
		planting.setValidatedAt(OffsetDateTime.now());
		planting.setRejectionReason(null);
		deletePhoto(planting);
		return toResponse(planting);
	}

	@Transactional
	public TreePlantingResponse reject(UUID adminId, UUID plantingId, String reason) {
		ensureAdmin(adminId);
		if (reason == null || reason.isBlank()) {
			throw new IllegalArgumentException("Motivo da rejeicao e obrigatorio.");
		}
		var planting = planting(plantingId);
		planting.setStatus(TreePlantingStatus.REJECTED);
		planting.setValidatedAt(null);
		planting.setRejectionReason(reason.trim());
		deletePhoto(planting);
		return toResponse(planting);
	}

	private TreePlanting planting(UUID plantingId) {
		return treePlantingRepository.findById(plantingId)
			.orElseThrow(() -> new IllegalArgumentException("Registro de arvore nao encontrado."));
	}

	private void ensureAdmin(UUID adminId) {
		var user = userRepository.findById(adminId)
			.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (user.getRole() != UserRole.ADMIN) {
			throw new IllegalArgumentException("Acesso permitido apenas para administradores.");
		}
	}

	private TreePlantingResponse toResponse(TreePlanting planting) {
		return new TreePlantingResponse(
			planting.getId(),
			planting.getUser().getId(),
			planting.getUser().getName(),
			planting.getTreeName(),
			planting.getSpecies(),
			planting.getPlantedDate(),
			planting.getLocationType(),
			planting.getNeighborhood(),
			planting.getLocationDescription(),
			planting.getNotes(),
			planting.getRejectionReason(),
			planting.getPhotoUrl(),
			planting.getLatitude(),
			planting.getLongitude(),
			planting.getStatus(),
			planting.getCreatedAt(),
			planting.getValidatedAt()
		);
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	private void validateCoordinates(Double latitude, Double longitude) {
		if (latitude == null && longitude == null) {
			return;
		}
		if (latitude == null || longitude == null) {
			throw new IllegalArgumentException("Informe latitude e longitude do plantio.");
		}
		if (latitude < -7.835 || latitude > -7.745 || longitude < -35.140 || longitude > -35.045) {
			throw new IllegalArgumentException("Localizacao deve estar dentro da area de Aracoiaba.");
		}
	}

	private void deletePhoto(TreePlanting planting) {
		treePhotoStorage.delete(planting.getPhotoPath());
		planting.setPhotoPath(null);
		planting.setPhotoUrl(null);
	}
}
