package br.com.coletaqui.backend.userimpact.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record UserImpactItemResponse(
	String id,
	String type,
	String title,
	String location,
	List<String> materials,
	String status,
	OffsetDateTime date,
	String notes
) {
}
