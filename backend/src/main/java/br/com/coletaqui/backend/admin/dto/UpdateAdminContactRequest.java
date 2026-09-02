package br.com.coletaqui.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateAdminContactRequest(
	@NotBlank(message = "Telefone do WhatsApp e obrigatorio.")
	String phone
) {
}
