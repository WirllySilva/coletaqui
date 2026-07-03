package br.com.coletaqui.backend.user.dto;

import java.util.UUID;

public record CollectorResponse(
	UUID id,
	String name,
	String phone,
	String region,
	String materials,
	String availability,
	String collectorServiceType,
	String address
) {
}
