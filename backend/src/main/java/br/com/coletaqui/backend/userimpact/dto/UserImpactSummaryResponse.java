package br.com.coletaqui.backend.userimpact.dto;

import java.util.List;

public record UserImpactSummaryResponse(
	long totalActions,
	long completedActions,
	long plannedActions,
	long points,
	List<UserImpactItemResponse> items
) {
}
