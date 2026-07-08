package br.com.coletaqui.backend.schedule.dto;

import java.util.UUID;

public record RankingEntryResponse(
	int position,
	UUID userId,
	String name,
	long points,
	long completedCollections,
	boolean currentUser
) {}
