package br.com.coletaqui.backend.material;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "material_types")
public class MaterialType {
	@Id
	@GeneratedValue
	private UUID id;

	@Column(nullable = false, unique = true, length = 80)
	private String name;

	@Column(nullable = false, unique = true, length = 80)
	private String slug;

	@Column(length = 255)
	private String description;

	@Column(nullable = false)
	private boolean hazardous;

	@Column(nullable = false)
	private boolean active = true;

	@Column(nullable = false)
	private OffsetDateTime createdAt;

	@Column(nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void prePersist() {
		var now = OffsetDateTime.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void preUpdate() {
		updatedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isHazardous() {
		return hazardous;
	}

	public void setHazardous(boolean hazardous) {
		this.hazardous = hazardous;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}
