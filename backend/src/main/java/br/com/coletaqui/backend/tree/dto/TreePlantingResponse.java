package br.com.coletaqui.backend.tree.dto;

import br.com.coletaqui.backend.tree.TreePlantingStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TreePlantingResponse(
	UUID id,
	UUID userId,
	String userName,
	String treeName,
	String species,
	LocalDate plantedDate,
	String locationType,
	String neighborhood,
	String locationDescription,
	String notes,
	String rejectionReason,
	String photoUrl,
	Double latitude,
	Double longitude,
	TreePlantingStatus status,
	OffsetDateTime createdAt,
	OffsetDateTime validatedAt
) {
}
