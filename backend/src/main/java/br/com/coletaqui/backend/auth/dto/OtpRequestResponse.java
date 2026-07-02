package br.com.coletaqui.backend.auth.dto;

import java.time.OffsetDateTime;

public record OtpRequestResponse(
	String message,
	String phone,
	String channel,
	OffsetDateTime expiresAt,
	String devOtp
) {
}
