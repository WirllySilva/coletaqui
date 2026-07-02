package br.com.coletaqui.backend.user.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpsertUserAddressRequest(
	@NotBlank(message = "Identificacao do endereco e obrigatoria")
	@Size(max = 80)
	String label,

	@NotBlank(message = "Rua e obrigatoria")
	@Size(max = 160)
	String street,

	@Size(max = 20)
	String number,

	@Size(max = 120)
	String complement,

	@NotBlank(message = "Bairro e obrigatorio")
	@Size(max = 120)
	String neighborhood,

	@NotBlank(message = "Cidade e obrigatoria")
	@Size(max = 100)
	String city,

	@NotBlank(message = "UF e obrigatoria")
	@Size(min = 2, max = 2)
	String state,

	@Size(max = 12)
	String zipCode,

	BigDecimal latitude,
	BigDecimal longitude,
	boolean defaultAddress
) {
}
