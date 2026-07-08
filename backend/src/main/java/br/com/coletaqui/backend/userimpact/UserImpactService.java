package br.com.coletaqui.backend.userimpact;

import br.com.coletaqui.backend.collectionpointdelivery.CollectionPointDeliveryRepository;
import br.com.coletaqui.backend.collectionpointdelivery.CollectionPointDeliveryStatus;
import br.com.coletaqui.backend.dropoff.DropOffDeliveryRepository;
import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.schedule.ScheduleRepository;
import br.com.coletaqui.backend.schedule.ScheduleStatus;
import br.com.coletaqui.backend.tree.TreePlantingRepository;
import br.com.coletaqui.backend.tree.TreePlantingStatus;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.userimpact.dto.UserImpactItemResponse;
import br.com.coletaqui.backend.userimpact.dto.UserImpactSummaryResponse;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserImpactService {
	private final UserRepository userRepository;
	private final ScheduleRepository scheduleRepository;
	private final CollectionPointDeliveryRepository collectionPointDeliveryRepository;
	private final DropOffDeliveryRepository dropOffDeliveryRepository;
	private final TreePlantingRepository treePlantingRepository;

	public UserImpactService(
		UserRepository userRepository,
		ScheduleRepository scheduleRepository,
		CollectionPointDeliveryRepository collectionPointDeliveryRepository,
		DropOffDeliveryRepository dropOffDeliveryRepository,
		TreePlantingRepository treePlantingRepository
	) {
		this.userRepository = userRepository;
		this.scheduleRepository = scheduleRepository;
		this.collectionPointDeliveryRepository = collectionPointDeliveryRepository;
		this.dropOffDeliveryRepository = dropOffDeliveryRepository;
		this.treePlantingRepository = treePlantingRepository;
	}

	@Transactional(readOnly = true)
	public UserImpactSummaryResponse mine(UUID userId) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (user.getRole() != UserRole.COMMON_USER) {
			throw new IllegalArgumentException("Impacto pessoal disponivel apenas para moradores.");
		}

		var items = new ArrayList<UserImpactItemResponse>();
		var points = new long[] {0};
		var completed = new long[] {0};
		var planned = new long[] {0};

		scheduleRepository.findByUserIdOrderByCreatedAtDesc(userId).forEach(schedule -> {
			var done = schedule.getStatus() == ScheduleStatus.COMPLETED;
			if (done) {
				completed[0]++;
				points[0] += 10 + materialPoints(schedule.getMaterials().stream().toList());
			} else if (schedule.getStatus() != ScheduleStatus.CANCELED) {
				planned[0]++;
			}

			items.add(new UserImpactItemResponse(
				schedule.getId().toString(),
				"Coleta domiciliar",
				done ? "Coleta domiciliar concluida" : "Coleta domiciliar " + statusLabel(schedule.getStatus()).toLowerCase(),
				schedule.getAddressSnapshot(),
				schedule.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
				statusLabel(schedule.getStatus()),
				dateOf(schedule.getDesiredDate(), schedule.getCreatedAt()),
				schedule.getNotes()
			));
		});

		collectionPointDeliveryRepository.findByUserIdOrderByCreatedAtDesc(userId).forEach(delivery -> {
			var done = delivery.getStatus() == CollectionPointDeliveryStatus.CONFIRMED;
			if (done) {
				completed[0]++;
				points[0] += 8 + materialPoints(delivery.getMaterials().stream().toList());
			} else if (delivery.getStatus() != CollectionPointDeliveryStatus.CANCELED) {
				planned[0]++;
			}

			items.add(new UserImpactItemResponse(
				delivery.getId().toString(),
				"Entrega em ponto",
				done ? "Entrega confirmada no ponto" : "Entrega avisada no ponto",
				delivery.getCollectionPoint().getName(),
				delivery.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
				statusLabel(delivery.getStatus()),
				dateOf(delivery.getPlannedDate(), delivery.getCreatedAt()),
				delivery.getNotes()
			));
		});

		dropOffDeliveryRepository.findByUserIdOrderByConfirmedAtDesc(userId).forEach(delivery -> {
			completed[0]++;
			points[0] += 8 + materialPoints(delivery.getMaterials().stream().toList());
			items.add(new UserImpactItemResponse(
				delivery.getId().toString(),
				"Entrega direta",
				"Entrega confirmada pelo ponto",
				delivery.getCollector().getName(),
				delivery.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
				"Confirmada",
				delivery.getConfirmedAt(),
				delivery.getNotes()
			));
		});

		treePlantingRepository.findByUserIdOrderByPlantedDateDesc(userId).forEach(planting -> {
			if (planting.getStatus() == TreePlantingStatus.VALIDATED) {
				completed[0]++;
			} else if (planting.getStatus() == TreePlantingStatus.REGISTERED) {
				planned[0]++;
			}

			items.add(new UserImpactItemResponse(
				planting.getId().toString(),
				"Árvore plantada",
				planting.getStatus() == TreePlantingStatus.VALIDATED ? "Árvore validada" : "Árvore registrada",
				planting.getNeighborhood(),
				List.of(planting.getSpecies()),
				statusLabel(planting.getStatus()),
				dateOf(planting.getPlantedDate(), planting.getCreatedAt()),
				planting.getTreeName()
			));
		});

		var orderedItems = items.stream()
			.sorted(Comparator.comparing(UserImpactItemResponse::date, Comparator.nullsLast(Comparator.reverseOrder())))
			.toList();

		return new UserImpactSummaryResponse(
			orderedItems.size(),
			completed[0],
			planned[0],
			points[0],
			orderedItems
		);
	}

	private OffsetDateTime dateOf(LocalDate date, OffsetDateTime fallback) {
		return date == null ? fallback : date.atStartOfDay().atOffset(ZoneOffset.of("-03:00"));
	}

	private String statusLabel(ScheduleStatus status) {
		return switch (status) {
			case REQUESTED -> "Solicitada";
			case ACCEPTED -> "Aceita";
			case COMPLETED -> "Concluida";
			case CANCELED -> "Cancelada";
		};
	}

	private String statusLabel(CollectionPointDeliveryStatus status) {
		return switch (status) {
			case PLANNED -> "Avisada";
			case CONFIRMED -> "Confirmada";
			case CANCELED -> "Cancelada";
		};
	}

	private String statusLabel(TreePlantingStatus status) {
		return switch (status) {
			case REGISTERED -> "Registrada";
			case VALIDATED -> "Validada";
			case REJECTED -> "Rejeitada";
		};
	}

	private long materialPoints(List<MaterialType> materials) {
		return materials.stream().mapToLong(this::materialScore).sum();
	}

	private long materialScore(MaterialType material) {
		var slug = material.getSlug();
		if (slug.contains("oleo") || slug.contains("pilha") || slug.contains("bateria")) {
			return 8;
		}
		if (slug.contains("vidro")) {
			return 4;
		}
		if (slug.contains("plastico") || slug.contains("metal")) {
			return 3;
		}
		if (slug.contains("papel") || slug.contains("organico")) {
			return 2;
		}
		return material.isHazardous() ? 8 : 2;
	}
}
