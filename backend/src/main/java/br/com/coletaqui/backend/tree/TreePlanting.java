package br.com.coletaqui.backend.tree;

import br.com.coletaqui.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tree_plantings")
public class TreePlanting {
	@Id
	@GeneratedValue
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(length = 120)
	private String treeName;

	@Column(nullable = false, length = 120)
	private String species;

	@Column(nullable = false)
	private LocalDate plantedDate;

	@Column(nullable = false, length = 60)
	private String locationType;

	@Column(nullable = false, length = 120)
	private String neighborhood;

	@Column(length = 255)
	private String locationDescription;

	@Column(length = 500)
	private String notes;

	@Column(length = 500)
	private String rejectionReason;

	@Column(length = 600)
	private String photoUrl;

	@Column(length = 300)
	private String photoPath;

	private Double latitude;

	private Double longitude;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private TreePlantingStatus status = TreePlantingStatus.REGISTERED;

	private OffsetDateTime validatedAt;

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

	public String getTreeName() {
		return treeName;
	}

	public void setTreeName(String treeName) {
		this.treeName = treeName;
	}

	public String getSpecies() {
		return species;
	}

	public void setSpecies(String species) {
		this.species = species;
	}

	public LocalDate getPlantedDate() {
		return plantedDate;
	}

	public void setPlantedDate(LocalDate plantedDate) {
		this.plantedDate = plantedDate;
	}

	public String getLocationType() {
		return locationType;
	}

	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}

	public String getNeighborhood() {
		return neighborhood;
	}

	public void setNeighborhood(String neighborhood) {
		this.neighborhood = neighborhood;
	}

	public String getLocationDescription() {
		return locationDescription;
	}

	public void setLocationDescription(String locationDescription) {
		this.locationDescription = locationDescription;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getRejectionReason() {
		return rejectionReason;
	}

	public void setRejectionReason(String rejectionReason) {
		this.rejectionReason = rejectionReason;
	}

	public String getPhotoUrl() {
		return photoUrl;
	}

	public void setPhotoUrl(String photoUrl) {
		this.photoUrl = photoUrl;
	}

	public String getPhotoPath() {
		return photoPath;
	}

	public void setPhotoPath(String photoPath) {
		this.photoPath = photoPath;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public TreePlantingStatus getStatus() {
		return status;
	}

	public void setStatus(TreePlantingStatus status) {
		this.status = status;
	}

	public OffsetDateTime getValidatedAt() {
		return validatedAt;
	}

	public void setValidatedAt(OffsetDateTime validatedAt) {
		this.validatedAt = validatedAt;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
