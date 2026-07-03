package br.com.coletaqui.backend.schedule;

import br.com.coletaqui.backend.schedule.dto.CreateScheduleRequest;
import br.com.coletaqui.backend.schedule.dto.ScheduleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/schedules")
@Tag(name = "Agendamentos", description = "Solicitacoes e atendimento de coleta")
@SecurityRequirement(name = "bearerAuth")
public class ScheduleController {
	private final ScheduleService scheduleService;

	public ScheduleController(ScheduleService scheduleService) {
		this.scheduleService = scheduleService;
	}

	@PostMapping
	@Operation(summary = "Cria uma solicitacao de coleta")
	public ResponseEntity<ScheduleResponse> create(Authentication authentication, @Valid @RequestBody CreateScheduleRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(scheduleService.create(userId(authentication), request));
	}

	@GetMapping("/me")
	@Operation(summary = "Lista minhas solicitacoes")
	public ResponseEntity<List<ScheduleResponse>> listMine(Authentication authentication) {
		return ResponseEntity.ok(scheduleService.listMine(userId(authentication)));
	}

	@GetMapping("/open")
	@Operation(summary = "Lista solicitacoes abertas para coletores")
	public ResponseEntity<List<ScheduleResponse>> listOpen(Authentication authentication) {
		return ResponseEntity.ok(scheduleService.listOpen(userId(authentication)));
	}

	@GetMapping("/collector")
	@Operation(summary = "Lista agenda do coletor")
	public ResponseEntity<List<ScheduleResponse>> listCollector(Authentication authentication) {
		return ResponseEntity.ok(scheduleService.listCollectorSchedule(userId(authentication)));
	}

	@PostMapping("/{scheduleId}/accept")
	@Operation(summary = "Aceita uma solicitacao de coleta")
	public ResponseEntity<ScheduleResponse> accept(Authentication authentication, @PathVariable UUID scheduleId) {
		return ResponseEntity.ok(scheduleService.accept(userId(authentication), scheduleId));
	}

	@PostMapping("/{scheduleId}/complete")
	@Operation(summary = "Conclui uma coleta aceita")
	public ResponseEntity<ScheduleResponse> complete(Authentication authentication, @PathVariable UUID scheduleId) {
		return ResponseEntity.ok(scheduleService.complete(userId(authentication), scheduleId));
	}

	private UUID userId(Authentication authentication) {
		return UUID.fromString(authentication.getName());
	}
}
