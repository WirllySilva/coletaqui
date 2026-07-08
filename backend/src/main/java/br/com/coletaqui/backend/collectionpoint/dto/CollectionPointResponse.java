package br.com.coletaqui.backend.collectionpoint.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CollectionPointResponse(
	UUID id,
	String name,
	String description,
	String address,
	String city,
	String state,
	String materials,
	String openingHours,
	UUID responsibleCollectorId,
	String responsibleName,
	String responsiblePhone,
	Double latitude,
	Double longitude,
	boolean active,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {}
