package br.com.coletaqui.backend.schedule;

import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.material.MaterialTypeRepository;
import br.com.coletaqui.backend.schedule.dto.CreateScheduleRequest;
import br.com.coletaqui.backend.schedule.dto.ImpactDashboardResponse;
import br.com.coletaqui.backend.schedule.dto.ImpactMetricResponse;
import br.com.coletaqui.backend.schedule.dto.ScheduleResponse;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import br.com.coletaqui.backend.user.address.UserAddress;
import br.com.coletaqui.backend.user.address.UserAddressRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleService {
	private final ScheduleRepository scheduleRepository;
	private final UserRepository userRepository;
	private final UserAddressRepository userAddressRepository;
	private final MaterialTypeRepository materialTypeRepository;

	public ScheduleService(
		ScheduleRepository scheduleRepository,
		UserRepository userRepository,
		UserAddressRepository userAddressRepository,
		MaterialTypeRepository materialTypeRepository
	) {
		this.scheduleRepository = scheduleRepository;
		this.userRepository = userRepository;
		this.userAddressRepository = userAddressRepository;
		this.materialTypeRepository = materialTypeRepository;
	}

	@Transactional
	public ScheduleResponse create(UUID userId, CreateScheduleRequest request) {
		var user = user(userId);
		if (user.getRole() == UserRole.COLLECTOR) {
			throw new IllegalArgumentException("Coletor nao pode criar solicitacao como usuario comum.");
		}

		var address = userAddressRepository.findByIdAndUserId(request.addressId(), userId)
			.orElseThrow(() -> new IllegalArgumentException("Endereco nao encontrado."));
		var materials = materialTypeRepository.findByIdIn(request.materialTypeIds());

		if (materials.size() != request.materialTypeIds().size()) {
			throw new IllegalArgumentException("Um ou mais materiais nao foram encontrados.");
		}

		if (request.desiredDate().isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("Data desejada nao pode ser anterior a hoje.");
		}

		var schedule = new Schedule();
		schedule.setUser(user);
		schedule.setAddress(address);
		schedule.setMaterials(new LinkedHashSet<>(materials));
		schedule.setAddressSnapshot(addressSnapshot(address));
		schedule.setDesiredDate(request.desiredDate());
		schedule.setPreferredPeriod(request.preferredPeriod().trim());
		schedule.setNotes(blankToNull(request.notes()));
		schedule.setStatus(ScheduleStatus.REQUESTED);

		return toResponse(scheduleRepository.save(schedule));
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> listMine(UUID userId) {
		return scheduleRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public ScheduleResponse get(UUID userId, UUID scheduleId) {
		var user = user(userId);
		var schedule = scheduleRepository.findById(scheduleId)
			.orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));
		ensureCanView(user, schedule);
		return toResponse(schedule);
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> listOpen(UUID collectorId) {
		ensureCollector(collectorId);
		return scheduleRepository.findByStatusOrderByCreatedAtDesc(ScheduleStatus.REQUESTED).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> listCollectorSchedule(UUID collectorId) {
		ensureCollector(collectorId);
		return scheduleRepository.findByCollectorIdOrderByUpdatedAtDesc(collectorId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> listAllForAdmin(UUID adminId) {
		ensureAdmin(adminId);
		return scheduleRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
	}

	@Transactional
	public ScheduleResponse accept(UUID collectorId, UUID scheduleId) {
		var collector = ensureCollector(collectorId);
		var schedule = scheduleRepository.findById(scheduleId)
			.orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

		if (schedule.getStatus() != ScheduleStatus.REQUESTED) {
			throw new IllegalArgumentException("Solicitacao nao esta disponivel para aceite.");
		}

		schedule.setCollector(collector);
		schedule.setStatus(ScheduleStatus.ACCEPTED);
		schedule.setAcceptedAt(OffsetDateTime.now());
		return toResponse(schedule);
	}

	@Transactional
	public ScheduleResponse complete(UUID collectorId, UUID scheduleId) {
		ensureCollector(collectorId);
		var schedule = scheduleRepository.findById(scheduleId)
			.orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

		if (schedule.getCollector() == null || !schedule.getCollector().getId().equals(collectorId)) {
			throw new IllegalArgumentException("Solicitacao nao pertence a este coletor.");
		}

		if (schedule.getStatus() != ScheduleStatus.ACCEPTED) {
			throw new IllegalArgumentException("Somente coletas aceitas podem ser concluidas.");
		}

		schedule.setStatus(ScheduleStatus.COMPLETED);
		schedule.setCompletedAt(OffsetDateTime.now());
		return toResponse(schedule);
	}

	@Transactional
	public ScheduleResponse cancel(UUID userId, UUID scheduleId) {
		var user = user(userId);
		var schedule = scheduleRepository.findById(scheduleId)
			.orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

		if (schedule.getUser() == null || !schedule.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Somente o solicitante pode cancelar esta coleta.");
		}

		if (schedule.getStatus() != ScheduleStatus.REQUESTED) {
			throw new IllegalArgumentException("Somente solicitacoes ainda nao aceitas podem ser canceladas.");
		}

		schedule.setStatus(ScheduleStatus.CANCELED);
		schedule.setCanceledAt(OffsetDateTime.now());
		return toResponse(schedule);
	}

	@Transactional(readOnly = true)
	public ImpactDashboardResponse impact(UUID userId) {
		var user = user(userId);
		if (user.getRole() == UserRole.COLLECTOR && user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Cadastro de coletor ainda nao esta ativo.");
		}
		var schedules = switch (user.getRole()) {
			case ADMIN -> scheduleRepository.findAllByOrderByCreatedAtDesc();
			case COLLECTOR -> scheduleRepository.findByCollectorIdOrderByUpdatedAtDesc(user.getId());
			default -> throw new IllegalArgumentException("Indicadores disponiveis apenas para coletores e administradores.");
		};
		var requested = schedules.stream().filter(schedule -> schedule.getStatus() == ScheduleStatus.REQUESTED).count();
		var accepted = schedules.stream().filter(schedule -> schedule.getStatus() == ScheduleStatus.ACCEPTED).count();
		var completed = schedules.stream().filter(schedule -> schedule.getStatus() == ScheduleStatus.COMPLETED).count();
		var canceled = schedules.stream().filter(schedule -> schedule.getStatus() == ScheduleStatus.CANCELED).count();

		return new ImpactDashboardResponse(
			requested,
			accepted,
			completed,
			canceled,
			schedules.size(),
			topMetrics(materialCounts(schedules)),
			topMetrics(neighborhoodCounts(schedules)),
			topMetrics(collectorCounts(schedules))
		);
	}

	private User user(UUID userId) {
		return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
	}

	private User ensureCollector(UUID userId) {
		var user = user(userId);
		if (user.getRole() != UserRole.COLLECTOR) {
			throw new IllegalArgumentException("Acesso permitido apenas para coletores.");
		}
		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Cadastro de coletor ainda nao esta ativo.");
		}
		return user;
	}

	private User ensureAdmin(UUID userId) {
		var user = user(userId);
		if (user.getRole() != UserRole.ADMIN) {
			throw new IllegalArgumentException("Acesso permitido apenas para administradores.");
		}
		return user;
	}

	private void ensureCanView(User user, Schedule schedule) {
		if (user.getRole() == UserRole.COLLECTOR) {
			if (schedule.getStatus() == ScheduleStatus.REQUESTED) {
				return;
			}
			if (schedule.getCollector() != null && schedule.getCollector().getId().equals(user.getId())) {
				return;
			}
			throw new IllegalArgumentException("Solicitacao nao pertence a este coletor.");
		}

		if (schedule.getUser() == null || !schedule.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Solicitacao nao pertence a este usuario.");
		}
	}

	private ScheduleResponse toResponse(Schedule schedule) {
		var collector = schedule.getCollector();
		return new ScheduleResponse(
			schedule.getId(),
			schedule.getUser().getName(),
			schedule.getUser().getPhone(),
			collector == null ? null : collector.getName(),
			collector == null ? null : collector.getPhone(),
			schedule.getAddressSnapshot(),
			schedule.getDesiredDate(),
			schedule.getPreferredPeriod(),
			schedule.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
			schedule.getNotes(),
			schedule.getStatus(),
			schedule.getCreatedAt(),
			schedule.getAcceptedAt(),
			schedule.getCompletedAt(),
			schedule.getCanceledAt()
		);
	}

	private Map<String, Long> materialCounts(List<Schedule> schedules) {
		var counts = new LinkedHashMap<String, Long>();
		schedules.stream()
			.filter(schedule -> schedule.getStatus() == ScheduleStatus.COMPLETED)
			.flatMap(schedule -> schedule.getMaterials().stream())
			.map(MaterialType::getName)
			.forEach(name -> counts.merge(name, 1L, Long::sum));
		return counts;
	}

	private Map<String, Long> neighborhoodCounts(List<Schedule> schedules) {
		var counts = new LinkedHashMap<String, Long>();
		schedules.stream()
			.filter(schedule -> schedule.getStatus() != ScheduleStatus.CANCELED)
			.map(schedule -> neighborhood(schedule.getAddressSnapshot()))
			.filter(value -> value != null && !value.isBlank())
			.forEach(name -> counts.merge(name, 1L, Long::sum));
		return counts;
	}

	private Map<String, Long> collectorCounts(List<Schedule> schedules) {
		var counts = new LinkedHashMap<String, Long>();
		schedules.stream()
			.filter(schedule -> schedule.getStatus() == ScheduleStatus.COMPLETED)
			.map(Schedule::getCollector)
			.filter(collector -> collector != null && collector.getName() != null)
			.map(User::getName)
			.forEach(name -> counts.merge(name, 1L, Long::sum));
		return counts;
	}

	private List<ImpactMetricResponse> topMetrics(Map<String, Long> counts) {
		return counts.entrySet().stream()
			.sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry.comparingByKey()))
			.limit(5)
			.map(entry -> new ImpactMetricResponse(entry.getKey(), entry.getValue()))
			.toList();
	}

	private String neighborhood(String addressSnapshot) {
		if (addressSnapshot == null || addressSnapshot.isBlank()) {
			return null;
		}
		var parts = addressSnapshot.split(",");
		if (parts.length < 2) {
			return null;
		}
		return parts[parts.length - 2].trim();
	}

	private String addressSnapshot(UserAddress address) {
		var number = address.getNumber() == null ? "" : ", " + address.getNumber();
		var complement = address.getComplement() == null ? "" : " - " + address.getComplement();
		return "%s%s%s, %s, %s/%s".formatted(
			address.getStreet(),
			number,
			complement,
			address.getNeighborhood(),
			address.getCity(),
			address.getState()
		);
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
