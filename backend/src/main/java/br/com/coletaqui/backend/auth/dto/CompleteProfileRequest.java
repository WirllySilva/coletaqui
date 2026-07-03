package br.com.coletaqui.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record CompleteProfileRequest(
	@NotBlank(message = "Nome é obrigatório")
	String name,
	String region,
	String materials,
	String availability,
	String collectorServiceType
) {
}
