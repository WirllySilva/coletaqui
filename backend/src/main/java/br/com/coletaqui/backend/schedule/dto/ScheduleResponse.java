package br.com.coletaqui.backend.schedule.dto;

import br.com.coletaqui.backend.schedule.ScheduleStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ScheduleResponse(
	UUID id,
	String requesterName,
	String requesterPhone,
	String collectorName,
	String collectorPhone,
	String address,
	LocalDate desiredDate,
	String preferredPeriod,
	List<String> materials,
	String notes,
	ScheduleStatus status,
	OffsetDateTime createdAt,
	OffsetDateTime acceptedAt,
	OffsetDateTime completedAt,
	OffsetDateTime canceledAt
) {
}
