package br.com.coletaqui.backend.collectionpointdelivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateCollectionPointDeliveryRequest(
	@NotNull(message = "Ponto de coleta e obrigatorio")
	UUID collectionPointId,

	@NotEmpty(message = "Informe pelo menos um material")
	List<UUID> materialTypeIds,

	@NotNull(message = "Data desejada e obrigatoria")
	LocalDate plannedDate,

	@NotBlank(message = "Periodo preferido e obrigatorio")
	@Size(max = 120)
	String preferredPeriod,

	@Size(max = 500)
	String notes
) {
}
