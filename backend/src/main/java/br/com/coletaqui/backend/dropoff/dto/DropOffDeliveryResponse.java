package br.com.coletaqui.backend.dropoff.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record DropOffDeliveryResponse(
	UUID id,
	String userName,
	String userPhone,
	String collectorName,
	List<String> materials,
	String notes,
	OffsetDateTime confirmedAt
) {}
