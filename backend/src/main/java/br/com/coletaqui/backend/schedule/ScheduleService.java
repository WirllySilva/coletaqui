package br.com.coletaqui.backend.schedule;

import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.material.MaterialTypeRepository;
import br.com.coletaqui.backend.schedule.dto.CreateScheduleRequest;
import br.com.coletaqui.backend.schedule.dto.ScheduleResponse;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.address.UserAddress;
import br.com.coletaqui.backend.user.address.UserAddressRepository;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
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

		var schedule = new Schedule();
		schedule.setUser(user);
		schedule.setAddress(address);
		schedule.setMaterials(new LinkedHashSet<>(materials));
		schedule.setAddressSnapshot(addressSnapshot(address));
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
	public List<ScheduleResponse> listOpen(UUID collectorId) {
		ensureCollector(collectorId);
		return scheduleRepository.findByStatusOrderByCreatedAtDesc(ScheduleStatus.REQUESTED).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> listCollectorSchedule(UUID collectorId) {
		ensureCollector(collectorId);
		return scheduleRepository.findByCollectorIdOrderByUpdatedAtDesc(collectorId).stream().map(this::toResponse).toList();
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

	private User user(UUID userId) {
		return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
	}

	private User ensureCollector(UUID userId) {
		var user = user(userId);
		if (user.getRole() != UserRole.COLLECTOR) {
			throw new IllegalArgumentException("Acesso permitido apenas para coletores.");
		}
		return user;
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
			schedule.getPreferredPeriod(),
			schedule.getMaterials().stream().map(MaterialType::getName).sorted().toList(),
			schedule.getNotes(),
			schedule.getStatus(),
			schedule.getCreatedAt(),
			schedule.getAcceptedAt(),
			schedule.getCompletedAt()
		);
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
