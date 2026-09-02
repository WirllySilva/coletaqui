package br.com.coletaqui.backend.push.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PushSubscriptionResponse(
	UUID id,
	String endpoint,
	boolean active,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {
}
