package br.com.coletaqui.backend.collectionpoint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertCollectionPointRequest(
	@NotBlank(message = "Nome e obrigatorio.")
	@Size(max = 120, message = "Nome deve ter ate 120 caracteres.")
	String name,

	@Size(max = 255, message = "Descricao deve ter ate 255 caracteres.")
	String description,

	@NotBlank(message = "Endereco e obrigatorio.")
	@Size(max = 255, message = "Endereco deve ter ate 255 caracteres.")
	String address,

	@Size(max = 100, message = "Cidade deve ter ate 100 caracteres.")
	String city,

	@Size(max = 2, message = "UF deve ter 2 caracteres.")
	String state,

	@Size(max = 255, message = "Materiais deve ter ate 255 caracteres.")
	String materials,

	@Size(max = 120, message = "Horario deve ter ate 120 caracteres.")
	String openingHours,

	boolean active
) {}
