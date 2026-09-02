package br.com.coletaqui.backend.push.dto;

import jakarta.validation.constraints.NotBlank;

public record PushKeysRequest(
	@NotBlank(message = "Chave p256dh e obrigatoria.")
	String p256dh,
	@NotBlank(message = "Chave auth e obrigatoria.")
	String auth
) {
}
