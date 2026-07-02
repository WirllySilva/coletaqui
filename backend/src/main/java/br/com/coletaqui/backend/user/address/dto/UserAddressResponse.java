package br.com.coletaqui.backend.user.address.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record UserAddressResponse(
	UUID id,
	String label,
	String street,
	String number,
	String complement,
	String neighborhood,
	String city,
	String state,
	String zipCode,
	BigDecimal latitude,
	BigDecimal longitude,
	boolean defaultAddress,
	OffsetDateTime createdAt,
	OffsetDateTime updatedAt
) {
}
