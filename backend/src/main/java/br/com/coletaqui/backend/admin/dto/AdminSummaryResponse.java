package br.com.coletaqui.backend.admin.dto;

public record AdminSummaryResponse(
	long users,
	long commonUsers,
	long collectors,
	long pendingCollectors,
	long collectionPoints,
	long activeCollectionPoints,
	long schedules,
	long openSchedules,
	long completedSchedules,
	long canceledSchedules,
	long pointDeliveries,
	long confirmedPointDeliveries,
	long directDropOffDeliveries,
	long treePlantings,
	long validatedTreePlantings,
	long pendingTreePlantings
) {
}
