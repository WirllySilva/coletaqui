package br.com.coletaqui.backend.admin;

import br.com.coletaqui.backend.admin.dto.AdminSummaryResponse;
import br.com.coletaqui.backend.admin.dto.ChangeAdminPasswordRequest;
import br.com.coletaqui.backend.collectionpoint.CollectionPointService;
import br.com.coletaqui.backend.collectionpoint.dto.CollectionPointResponse;
import br.com.coletaqui.backend.collectionpoint.dto.UpsertCollectionPointRequest;
import br.com.coletaqui.backend.material.MaterialTypeService;
import br.com.coletaqui.backend.material.dto.MaterialTypeResponse;
import br.com.coletaqui.backend.material.dto.UpsertMaterialTypeRequest;
import br.com.coletaqui.backend.schedule.dto.ImpactDashboardResponse;
import br.com.coletaqui.backend.schedule.dto.ScheduleResponse;
import br.com.coletaqui.backend.schedule.ScheduleService;
import br.com.coletaqui.backend.user.dto.UserProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@Tag(name = "Administracao", description = "Painel administrativo desktop")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
	private final AdminService adminService;
	private final ScheduleService scheduleService;
	private final MaterialTypeService materialTypeService;
	private final CollectionPointService collectionPointService;

	public AdminController(
		AdminService adminService,
		ScheduleService scheduleService,
		MaterialTypeService materialTypeService,
		CollectionPointService collectionPointService
	) {
		this.adminService = adminService;
		this.scheduleService = scheduleService;
		this.materialTypeService = materialTypeService;
		this.collectionPointService = collectionPointService;
	}

	@GetMapping("/summary")
	@Operation(summary = "Resumo administrativo")
	public ResponseEntity<AdminSummaryResponse> summary(Authentication authentication) {
		return ResponseEntity.ok(adminService.summary(userId(authentication)));
	}

	@GetMapping("/me")
	@Operation(summary = "Dados do administrador autenticado")
	public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
		return ResponseEntity.ok(adminService.me(userId(authentication)));
	}

	@PostMapping("/me/change-password")
	@Operation(summary = "Altera senha do administrador autenticado")
	public ResponseEntity<Void> changePassword(Authentication authentication, @Valid @RequestBody ChangeAdminPasswordRequest request) {
		adminService.changePassword(userId(authentication), request);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/impact")
	@Operation(summary = "Indicadores gerais da plataforma")
	public ResponseEntity<ImpactDashboardResponse> impact(Authentication authentication) {
		return ResponseEntity.ok(scheduleService.impact(userId(authentication)));
	}

	@GetMapping("/users")
	@Operation(summary = "Lista usuarios")
	public ResponseEntity<List<UserProfileResponse>> users(Authentication authentication) {
		return ResponseEntity.ok(adminService.users(userId(authentication)));
	}

	@GetMapping("/collectors/pending")
	@Operation(summary = "Lista coletores pendentes")
	public ResponseEntity<List<UserProfileResponse>> pendingCollectors(Authentication authentication) {
		return ResponseEntity.ok(adminService.pendingCollectors(userId(authentication)));
	}

	@GetMapping("/collectors")
	@Operation(summary = "Lista coletores")
	public ResponseEntity<List<UserProfileResponse>> collectors(Authentication authentication) {
		return ResponseEntity.ok(adminService.collectors(userId(authentication)));
	}

	@PostMapping("/collectors/{collectorId}/approve")
	@Operation(summary = "Aprova coletor")
	public ResponseEntity<UserProfileResponse> approveCollector(Authentication authentication, @PathVariable UUID collectorId) {
		return ResponseEntity.ok(adminService.approveCollector(userId(authentication), collectorId));
	}

	@PostMapping("/collectors/{collectorId}/block")
	@Operation(summary = "Bloqueia coletor")
	public ResponseEntity<UserProfileResponse> blockCollector(Authentication authentication, @PathVariable UUID collectorId) {
		return ResponseEntity.ok(adminService.blockCollector(userId(authentication), collectorId));
	}

	@PostMapping("/collectors/{collectorId}/reactivate")
	@Operation(summary = "Reativa coletor")
	public ResponseEntity<UserProfileResponse> reactivateCollector(Authentication authentication, @PathVariable UUID collectorId) {
		return ResponseEntity.ok(adminService.reactivateCollector(userId(authentication), collectorId));
	}

	@PostMapping("/users/{targetUserId}/block")
	@Operation(summary = "Bloqueia usuario")
	public ResponseEntity<UserProfileResponse> blockUser(Authentication authentication, @PathVariable UUID targetUserId) {
		return ResponseEntity.ok(adminService.blockUser(userId(authentication), targetUserId));
	}

	@GetMapping("/schedules")
	@Operation(summary = "Lista todas as coletas")
	public ResponseEntity<List<ScheduleResponse>> schedules(Authentication authentication) {
		return ResponseEntity.ok(adminService.schedules(userId(authentication)));
	}

	@GetMapping("/materials")
	@Operation(summary = "Lista todos os materiais")
	public ResponseEntity<List<MaterialTypeResponse>> materials(Authentication authentication) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(materialTypeService.listAll());
	}

	@PostMapping("/materials")
	@Operation(summary = "Cria material")
	public ResponseEntity<MaterialTypeResponse> createMaterial(Authentication authentication, @Valid @RequestBody UpsertMaterialTypeRequest request) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(materialTypeService.create(request));
	}

	@PutMapping("/materials/{materialId}")
	@Operation(summary = "Atualiza material")
	public ResponseEntity<MaterialTypeResponse> updateMaterial(
		Authentication authentication,
		@PathVariable UUID materialId,
		@Valid @RequestBody UpsertMaterialTypeRequest request
	) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(materialTypeService.update(materialId, request));
	}

	@PostMapping("/materials/{materialId}/toggle")
	@Operation(summary = "Ativa ou desativa material")
	public ResponseEntity<MaterialTypeResponse> toggleMaterial(Authentication authentication, @PathVariable UUID materialId) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(materialTypeService.toggle(materialId));
	}

	@GetMapping("/collection-points")
	@Operation(summary = "Lista todos os pontos de recebimento")
	public ResponseEntity<List<CollectionPointResponse>> collectionPoints(Authentication authentication) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(collectionPointService.listAll());
	}

	@PostMapping("/collection-points")
	@Operation(summary = "Cria ponto de recebimento")
	public ResponseEntity<CollectionPointResponse> createCollectionPoint(Authentication authentication, @Valid @RequestBody UpsertCollectionPointRequest request) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(collectionPointService.create(request));
	}

	@PutMapping("/collection-points/{pointId}")
	@Operation(summary = "Atualiza ponto de recebimento")
	public ResponseEntity<CollectionPointResponse> updateCollectionPoint(
		Authentication authentication,
		@PathVariable UUID pointId,
		@Valid @RequestBody UpsertCollectionPointRequest request
	) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(collectionPointService.update(pointId, request));
	}

	@PostMapping("/collection-points/{pointId}/toggle")
	@Operation(summary = "Ativa ou desativa ponto de recebimento")
	public ResponseEntity<CollectionPointResponse> toggleCollectionPoint(Authentication authentication, @PathVariable UUID pointId) {
		adminService.ensureAdminAccess(userId(authentication));
		return ResponseEntity.ok(collectionPointService.toggle(pointId));
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
