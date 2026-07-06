package br.com.coletaqui.backend.material.dto;

import java.util.UUID;

public record MaterialTypeResponse(
	UUID id,
	String name,
	String slug,
	String description,
	boolean hazardous,
	boolean active
) {
}
