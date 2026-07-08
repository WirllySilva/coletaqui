package br.com.coletaqui.backend.collectionpointdelivery;

import br.com.coletaqui.backend.collectionpoint.CollectionPoint;
import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "collection_point_deliveries")
public class CollectionPointDelivery {
	@Id
	@GeneratedValue
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "collection_point_id", nullable = false)
	private CollectionPoint collectionPoint;

	@ManyToMany
	@JoinTable(
		name = "collection_point_delivery_materials",
		joinColumns = @JoinColumn(name = "delivery_id"),
		inverseJoinColumns = @JoinColumn(name = "material_type_id")
	)
	private Set<MaterialType> materials = new LinkedHashSet<>();

	private LocalDate plannedDate;

	@Column(nullable = false, length = 120)
	private String preferredPeriod;

	@Column(length = 500)
	private String notes;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private CollectionPointDeliveryStatus status = CollectionPointDeliveryStatus.PLANNED;

	private OffsetDateTime confirmedAt;

	private OffsetDateTime canceledAt;

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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public CollectionPoint getCollectionPoint() {
		return collectionPoint;
	}

	public void setCollectionPoint(CollectionPoint collectionPoint) {
		this.collectionPoint = collectionPoint;
	}

	public Set<MaterialType> getMaterials() {
		return materials;
	}

	public void setMaterials(Set<MaterialType> materials) {
		this.materials = materials;
	}

	public LocalDate getPlannedDate() {
		return plannedDate;
	}

	public void setPlannedDate(LocalDate plannedDate) {
		this.plannedDate = plannedDate;
	}

	public String getPreferredPeriod() {
		return preferredPeriod;
	}

	public void setPreferredPeriod(String preferredPeriod) {
		this.preferredPeriod = preferredPeriod;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public CollectionPointDeliveryStatus getStatus() {
		return status;
	}

	public void setStatus(CollectionPointDeliveryStatus status) {
		this.status = status;
	}

	public OffsetDateTime getConfirmedAt() {
		return confirmedAt;
	}

	public void setConfirmedAt(OffsetDateTime confirmedAt) {
		this.confirmedAt = confirmedAt;
	}

	public OffsetDateTime getCanceledAt() {
		return canceledAt;
	}

	public void setCanceledAt(OffsetDateTime canceledAt) {
		this.canceledAt = canceledAt;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
