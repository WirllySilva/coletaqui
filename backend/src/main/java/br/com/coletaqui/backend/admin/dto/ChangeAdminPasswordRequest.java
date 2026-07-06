package br.com.coletaqui.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeAdminPasswordRequest(
	@NotBlank(message = "Senha atual e obrigatoria.")
	String currentPassword,

	@NotBlank(message = "Nova senha e obrigatoria.")
	@Size(min = 6, message = "Nova senha deve ter pelo menos 6 caracteres.")
	String newPassword
) {}
