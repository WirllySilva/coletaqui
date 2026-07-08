package br.com.coletaqui.backend.dropoff;

import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "drop_off_deliveries")
public class DropOffDelivery {
	@Id
	@GeneratedValue
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "collector_id", nullable = false)
	private User collector;

	@ManyToMany
	@JoinTable(
		name = "drop_off_delivery_materials",
		joinColumns = @JoinColumn(name = "drop_off_delivery_id"),
		inverseJoinColumns = @JoinColumn(name = "material_type_id")
	)
	private Set<MaterialType> materials = new LinkedHashSet<>();

	@Column(length = 500)
	private String notes;

	@Column(nullable = false)
	private OffsetDateTime confirmedAt;

	@PrePersist
	void prePersist() {
		confirmedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public User getCollector() {
		return collector;
	}

	public void setCollector(User collector) {
		this.collector = collector;
	}

	public Set<MaterialType> getMaterials() {
		return materials;
	}

	public void setMaterials(Set<MaterialType> materials) {
		this.materials = materials;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public OffsetDateTime getConfirmedAt() {
		return confirmedAt;
	}
}
