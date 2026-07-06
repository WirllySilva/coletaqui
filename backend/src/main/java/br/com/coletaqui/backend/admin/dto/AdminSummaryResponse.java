package br.com.coletaqui.backend.admin.dto;

public record AdminSummaryResponse(
	long users,
	long commonUsers,
	long collectors,
	long pendingCollectors,
	long schedules,
	long openSchedules,
	long completedSchedules,
	long canceledSchedules
) {
}
