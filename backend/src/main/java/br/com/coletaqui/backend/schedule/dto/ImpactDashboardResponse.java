package br.com.coletaqui.backend.schedule.dto;

import java.util.List;

public record ImpactDashboardResponse(
	long requested,
	long accepted,
	long completed,
	long canceled,
	long total,
	List<ImpactMetricResponse> materials,
	List<ImpactMetricResponse> neighborhoods,
	List<ImpactMetricResponse> collectors
) {
}
