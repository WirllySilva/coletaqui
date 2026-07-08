package br.com.coletaqui.backend.collectionpointdelivery.dto;

import br.com.coletaqui.backend.collectionpointdelivery.CollectionPointDeliveryStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record CollectionPointDeliveryResponse(
	UUID id,
	String userName,
	String userPhone,
	UUID collectionPointId,
	String collectionPointName,
	String collectionPointAddress,
	List<String> materials,
	LocalDate plannedDate,
	String preferredPeriod,
	String notes,
	CollectionPointDeliveryStatus status,
	OffsetDateTime createdAt,
	OffsetDateTime confirmedAt,
	OffsetDateTime canceledAt
) {
}
