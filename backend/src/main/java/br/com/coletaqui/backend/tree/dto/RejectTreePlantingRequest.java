package br.com.coletaqui.backend.tree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectTreePlantingRequest(
	@NotBlank(message = "Motivo da rejeicao e obrigatorio.")
	@Size(max = 500, message = "Motivo deve ter no maximo 500 caracteres.")
	String reason
) {
}
