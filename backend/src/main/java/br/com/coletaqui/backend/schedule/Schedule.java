package br.com.coletaqui.backend.schedule;

import br.com.coletaqui.backend.material.MaterialType;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.address.UserAddress;
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
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "schedules")
public class Schedule {
	@Id
	@GeneratedValue
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "collector_id")
	private User collector;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "address_id", nullable = false)
	private UserAddress address;

	@ManyToMany
	@JoinTable(
		name = "schedule_materials",
		joinColumns = @JoinColumn(name = "schedule_id"),
		inverseJoinColumns = @JoinColumn(name = "material_type_id")
	)
	private Set<MaterialType> materials = new LinkedHashSet<>();

	@Column(nullable = false, length = 255)
	private String addressSnapshot;

	@Column(nullable = false, length = 120)
	private String preferredPeriod;

	@Column(length = 500)
	private String notes;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private ScheduleStatus status;

	private OffsetDateTime acceptedAt;

	private OffsetDateTime completedAt;

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

	public User getCollector() {
		return collector;
	}

	public void setCollector(User collector) {
		this.collector = collector;
	}

	public UserAddress getAddress() {
		return address;
	}

	public void setAddress(UserAddress address) {
		this.address = address;
	}

	public Set<MaterialType> getMaterials() {
		return materials;
	}

	public void setMaterials(Set<MaterialType> materials) {
		this.materials = materials;
	}

	public String getAddressSnapshot() {
		return addressSnapshot;
	}

	public void setAddressSnapshot(String addressSnapshot) {
		this.addressSnapshot = addressSnapshot;
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

	public ScheduleStatus getStatus() {
		return status;
	}

	public void setStatus(ScheduleStatus status) {
		this.status = status;
	}

	public OffsetDateTime getAcceptedAt() {
		return acceptedAt;
	}

	public void setAcceptedAt(OffsetDateTime acceptedAt) {
		this.acceptedAt = acceptedAt;
	}

	public OffsetDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(OffsetDateTime completedAt) {
		this.completedAt = completedAt;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
