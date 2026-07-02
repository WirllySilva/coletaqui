package br.com.coletaqui.backend.auth.dto;

import br.com.coletaqui.backend.user.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(
	@NotBlank(message = "Telefone é obrigatório")
	String phone,
	@NotBlank(message = "Código OTP é obrigatório")
	@Pattern(regexp = "\\d{6}", message = "OTP deve conter 6 dígitos")
	String code,
	UserRole role
) {
}
