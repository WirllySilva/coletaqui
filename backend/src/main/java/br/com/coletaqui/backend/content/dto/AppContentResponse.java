package br.com.coletaqui.backend.content.dto;

import br.com.coletaqui.backend.content.AppContentType;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AppContentResponse(
	UUID id,
	String title,
	String summary,
	AppContentType type,
	String linkUrl,
	String internalRoute,
	String imageUrl,
	String body,
	int displayOrder,
	boolean active,
	OffsetDateTime expiresAt,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {}
