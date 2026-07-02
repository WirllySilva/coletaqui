package br.com.coletaqui.backend.auth.dto;

import br.com.coletaqui.backend.user.UserRole;
import jakarta.validation.constraints.NotBlank;

public record OtpRequest(
	@NotBlank(message = "Telefone é obrigatório")
	String phone,
	UserRole role
) {
}
