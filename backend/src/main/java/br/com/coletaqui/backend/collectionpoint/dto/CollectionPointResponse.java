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
	boolean active,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {}
