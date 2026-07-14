package br.com.coletaqui.backend.content;

import br.com.coletaqui.backend.content.dto.AppContentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contents")
@Tag(name = "Conteudos", description = "Conteudos educativos e noticias exibidos no app")
public class AppContentController {
	private final AppContentService appContentService;

	public AppContentController(AppContentService appContentService) {
		this.appContentService = appContentService;
	}

	@GetMapping
	@Operation(summary = "Lista conteudos ativos para o app")
	public ResponseEntity<List<AppContentResponse>> active() {
		return ResponseEntity.ok(appContentService.active());
	}

	@GetMapping("/{contentId}")
	@Operation(summary = "Exibe conteudo ativo")
	public ResponseEntity<AppContentResponse> show(@PathVariable UUID contentId) {
		return ResponseEntity.ok(appContentService.publicById(contentId));
	}
}
