package br.com.coletaqui.backend.content.dto;

import br.com.coletaqui.backend.content.AppContentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record UpsertAppContentRequest(
	@NotBlank(message = "Titulo e obrigatorio.")
	@Size(max = 120, message = "Titulo deve ter ate 120 caracteres.")
	String title,

	@NotBlank(message = "Resumo e obrigatorio.")
	@Size(max = 255, message = "Resumo deve ter ate 255 caracteres.")
	String summary,

	@NotNull(message = "Tipo e obrigatorio.")
	AppContentType type,

	@Size(max = 500, message = "Link deve ter ate 500 caracteres.")
	String linkUrl,

	@Size(max = 160, message = "Rota interna deve ter ate 160 caracteres.")
	String internalRoute,

	@Size(max = 500, message = "URL da imagem deve ter ate 500 caracteres.")
	String imageUrl,

	String body,

	@Min(value = 0, message = "Ordem deve ser maior ou igual a zero.")
	int displayOrder,

	boolean active,

	OffsetDateTime expiresAt
) {}
