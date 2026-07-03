package br.com.coletaqui.backend.user.dto;

import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record UserProfileResponse(
	UUID id,
	String phone,
	String name,
	UserRole role,
	UserStatus status,
	boolean profileComplete,
	String region,
	String materials,
	String availability,
	String collectorServiceType,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {
}
