package br.com.coletaqui.backend.support;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/support")
@Tag(name = "Suporte", description = "Contato publico de suporte do projeto")
public class SupportContactController {
	private final SupportContactService supportContactService;

	public SupportContactController(SupportContactService supportContactService) {
		this.supportContactService = supportContactService;
	}

	@GetMapping("/contact")
	@Operation(summary = "Retorna o WhatsApp de atendimento do projeto")
	public ResponseEntity<SupportContactResponse> contact() {
		return ResponseEntity.ok(supportContactService.contact());
	}
}
