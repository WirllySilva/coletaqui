package br.com.coletaqui.backend.tree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateTreePlantingRequest(
	@Size(max = 120)
	String treeName,

	@NotBlank(message = "Especie e obrigatoria.")
	@Size(max = 120)
	String species,

	@NotNull(message = "Data de plantio e obrigatoria.")
	LocalDate plantedDate,

	@NotBlank(message = "Tipo de local e obrigatorio.")
	@Size(max = 60)
	String locationType,

	@NotBlank(message = "Bairro e obrigatorio.")
	@Size(max = 120)
	String neighborhood,

	@Size(max = 255)
	String locationDescription,

	@Size(max = 500)
	String notes,

	Double latitude,

	Double longitude
) {
}
