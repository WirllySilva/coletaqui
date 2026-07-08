package br.com.coletaqui.backend.dropoff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record CreateDropOffDeliveryRequest(
	@NotBlank(message = "Telefone do morador e obrigatorio.")
	String userPhone,

	@NotEmpty(message = "Informe pelo menos um material recebido.")
	List<UUID> materialTypeIds,

	@Size(max = 500, message = "Observacao deve ter ate 500 caracteres.")
	String notes
) {}
