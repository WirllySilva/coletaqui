package br.com.coletaqui.backend.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertMaterialTypeRequest(
	@NotBlank(message = "Nome e obrigatorio.")
	@Size(max = 80, message = "Nome deve ter ate 80 caracteres.")
	String name,

	@Size(max = 255, message = "Descricao deve ter ate 255 caracteres.")
	String description,

	boolean hazardous,

	boolean active
) {}
