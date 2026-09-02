package br.com.coletaqui.backend.admin;

import br.com.coletaqui.backend.admin.dto.AdminSummaryResponse;
import br.com.coletaqui.backend.admin.dto.ChangeAdminPasswordRequest;
import br.com.coletaqui.backend.admin.dto.UpdateAdminContactRequest;
import br.com.coletaqui.backend.collectionpoint.CollectionPointRepository;
import br.com.coletaqui.backend.collectionpointdelivery.CollectionPointDeliveryRepository;
import br.com.coletaqui.backend.collectionpointdelivery.CollectionPointDeliveryStatus;
import br.com.coletaqui.backend.dropoff.DropOffDeliveryRepository;
import br.com.coletaqui.backend.schedule.ScheduleRepository;
import br.com.coletaqui.backend.schedule.ScheduleStatus;
import br.com.coletaqui.backend.schedule.dto.ScheduleResponse;
import br.com.coletaqui.backend.schedule.ScheduleService;
import br.com.coletaqui.backend.tree.TreePlantingRepository;
import br.com.coletaqui.backend.tree.TreePlantingStatus;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import br.com.coletaqui.backend.user.dto.UserProfileResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
	private final UserRepository userRepository;
	private final ScheduleRepository scheduleRepository;
	private final ScheduleService scheduleService;
	private final CollectionPointRepository collectionPointRepository;
	private final CollectionPointDeliveryRepository collectionPointDeliveryRepository;
	private final DropOffDeliveryRepository dropOffDeliveryRepository;
	private final TreePlantingRepository treePlantingRepository;
	private final PasswordEncoder passwordEncoder;
	private final String defaultAreaCode;

	public AdminService(
		UserRepository userRepository,
		ScheduleRepository scheduleRepository,
		ScheduleService scheduleService,
		CollectionPointRepository collectionPointRepository,
		CollectionPointDeliveryRepository collectionPointDeliveryRepository,
		DropOffDeliveryRepository dropOffDeliveryRepository,
		TreePlantingRepository treePlantingRepository,
		PasswordEncoder passwordEncoder,
		@Value("${app.phone.default-area-code:81}") String defaultAreaCode
	) {
		this.userRepository = userRepository;
		this.scheduleRepository = scheduleRepository;
		this.scheduleService = scheduleService;
		this.collectionPointRepository = collectionPointRepository;
		this.collectionPointDeliveryRepository = collectionPointDeliveryRepository;
		this.dropOffDeliveryRepository = dropOffDeliveryRepository;
		this.treePlantingRepository = treePlantingRepository;
		this.passwordEncoder = passwordEncoder;
		this.defaultAreaCode = defaultAreaCode.replaceAll("\\D", "");
	}

	@Transactional(readOnly = true)
	public UserProfileResponse me(UUID adminId) {
		return toUserProfile(admin(adminId));
	}

	@Transactional
	public void changePassword(UUID adminId, ChangeAdminPasswordRequest request) {
		var admin = admin(adminId);
		if (admin.getPasswordHash() == null || !passwordEncoder.matches(request.currentPassword(), admin.getPasswordHash())) {
			throw new IllegalArgumentException("Senha atual invalida.");
		}
		admin.setPasswordHash(passwordEncoder.encode(request.newPassword()));
	}

	@Transactional
	public UserProfileResponse updateContact(UUID adminId, UpdateAdminContactRequest request) {
		var admin = admin(adminId);
		var phone = normalizePhone(request.phone());
		userRepository.findByPhone(phone)
			.filter(user -> !user.getId().equals(adminId))
			.ifPresent(user -> {
				throw new IllegalArgumentException("Este telefone ja esta cadastrado em outra conta.");
			});
		admin.setPhone(phone);
		return toUserProfile(admin);
	}

	@Transactional(readOnly = true)
	public AdminSummaryResponse summary(UUID adminId) {
		ensureAdmin(adminId);
		return new AdminSummaryResponse(
			userRepository.count(),
			userRepository.countByRole(UserRole.COMMON_USER),
			userRepository.countByRole(UserRole.COLLECTOR),
			userRepository.countByRoleAndStatus(UserRole.COLLECTOR, UserStatus.PENDING_APPROVAL),
			collectionPointRepository.count(),
			collectionPointRepository.countByActiveTrue(),
			scheduleRepository.count(),
			scheduleRepository.countByStatus(ScheduleStatus.REQUESTED),
			scheduleRepository.countByStatus(ScheduleStatus.COMPLETED),
			scheduleRepository.countByStatus(ScheduleStatus.CANCELED),
			collectionPointDeliveryRepository.count(),
			collectionPointDeliveryRepository.countByStatus(CollectionPointDeliveryStatus.CONFIRMED),
			dropOffDeliveryRepository.count(),
			treePlantingRepository.count(),
			treePlantingRepository.countByStatus(TreePlantingStatus.VALIDATED),
			treePlantingRepository.countByStatus(TreePlantingStatus.REGISTERED)
		);
	}

	@Transactional(readOnly = true)
	public List<UserProfileResponse> users(UUID adminId) {
		ensureAdmin(adminId);
		return userRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toUserProfile).toList();
	}

	@Transactional(readOnly = true)
	public List<UserProfileResponse> pendingCollectors(UUID adminId) {
		ensureAdmin(adminId);
		return userRepository.findByRoleAndStatusOrderByCreatedAtDesc(UserRole.COLLECTOR, UserStatus.PENDING_APPROVAL)
			.stream()
			.map(this::toUserProfile)
			.toList();
	}

	@Transactional(readOnly = true)
	public List<UserProfileResponse> collectors(UUID adminId) {
		ensureAdmin(adminId);
		return userRepository.findByRoleOrderByCreatedAtDesc(UserRole.COLLECTOR)
			.stream()
			.map(this::toUserProfile)
			.toList();
	}

	@Transactional
	public UserProfileResponse approveCollector(UUID adminId, UUID collectorId) {
		ensureAdmin(adminId);
		var collector = collector(collectorId);
		collector.setStatus(UserStatus.ACTIVE);
		return toUserProfile(collector);
	}

	@Transactional
	public UserProfileResponse blockCollector(UUID adminId, UUID collectorId) {
		ensureAdmin(adminId);
		var collector = collector(collectorId);
		collector.setStatus(UserStatus.BLOCKED);
		return toUserProfile(collector);
	}

	@Transactional
	public UserProfileResponse reactivateCollector(UUID adminId, UUID collectorId) {
		ensureAdmin(adminId);
		var collector = collector(collectorId);
		collector.setStatus(UserStatus.ACTIVE);
		return toUserProfile(collector);
	}

	@Transactional
	public UserProfileResponse blockUser(UUID adminId, UUID userId) {
		ensureAdmin(adminId);
		var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (user.getId().equals(adminId)) {
			throw new IllegalArgumentException("Administrador nao pode bloquear a propria conta.");
		}
		user.setStatus(UserStatus.BLOCKED);
		return toUserProfile(user);
	}

	@Transactional(readOnly = true)
	public List<ScheduleResponse> schedules(UUID adminId) {
		ensureAdmin(adminId);
		return scheduleService.listAllForAdmin(adminId);
	}

	private void ensureAdmin(UUID adminId) {
		ensureAdminAccess(adminId);
	}

	public void ensureAdminAccess(UUID adminId) {
		admin(adminId);
	}

	private br.com.coletaqui.backend.user.User admin(UUID adminId) {
		var admin = userRepository.findById(adminId).orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		if (admin.getRole() != UserRole.ADMIN) {
			throw new IllegalArgumentException("Acesso permitido apenas para administradores.");
		}
		return admin;
	}

	private br.com.coletaqui.backend.user.User collector(UUID collectorId) {
		var collector = userRepository.findById(collectorId)
			.orElseThrow(() -> new IllegalArgumentException("Coletor nao encontrado."));
		if (collector.getRole() != UserRole.COLLECTOR) {
			throw new IllegalArgumentException("Usuario informado nao e coletor.");
		}
		return collector;
	}

	private UserProfileResponse toUserProfile(br.com.coletaqui.backend.user.User user) {
		return new UserProfileResponse(
			user.getId(),
			user.getPhone(),
			user.getName(),
			user.getRole(),
			user.getStatus(),
			user.isProfileComplete(),
			user.getRegion(),
			user.getMaterials(),
			user.getAvailability(),
			user.getCollectorServiceType() == null ? null : user.getCollectorServiceType().name(),
			user.getCreatedAt(),
			user.getUpdatedAt()
		);
	}

	private String normalizePhone(String phone) {
		if (phone == null || phone.isBlank()) {
			throw new IllegalArgumentException("Telefone invalido.");
		}

		var digits = phone.replaceAll("\\D", "");
		if (digits.length() == 13 && digits.startsWith("55")) {
			digits = digits.substring(2);
		}
		if (digits.length() == 9 && digits.startsWith("9")) {
			digits = defaultAreaCode + digits;
		}
		if (!digits.matches("[1-9]\\d9\\d{8}")) {
			throw new IllegalArgumentException("Telefone invalido. Use DDD + numero, ou apenas o numero com 9 na frente para DDD 81.");
		}
		return digits;
	}
}
