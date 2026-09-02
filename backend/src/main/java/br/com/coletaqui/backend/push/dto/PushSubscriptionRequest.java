package br.com.coletaqui.backend.push.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PushSubscriptionRequest(
	@NotBlank(message = "Endpoint da inscricao push e obrigatorio.")
	String endpoint,
	@Valid
	@NotNull(message = "Chaves da inscricao push sao obrigatorias.")
	PushKeysRequest keys
) {
}
