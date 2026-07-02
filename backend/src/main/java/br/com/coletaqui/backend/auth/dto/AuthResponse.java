package br.com.coletaqui.backend.auth.dto;

import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.util.UUID;

public record AuthResponse(
	String token,
	UUID userId,
	String phone,
	UserRole role,
	UserStatus status,
	boolean profileComplete,
	String name
) {
}
