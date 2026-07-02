package br.com.coletaqui.backend.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserProfileRequest(
	@NotBlank(message = "Nome é obrigatório")
	String name,
	String region,
	String materials,
	String availability
) {
}
