package br.com.coletaqui.backend.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "otp_codes")
public class OtpCode {
	@Id
	@GeneratedValue
	private UUID id;

	@Column(nullable = false, length = 20)
	private String phone;

	@Column(nullable = false, length = 255)
	private String codeHash;

	@Column(nullable = false, length = 30)
	private String channel;

	@Column(nullable = false)
	private OffsetDateTime expiresAt;

	private OffsetDateTime usedAt;

	@Column(nullable = false)
	private int attempts;

	@Column(nullable = false)
	private boolean invalidated;

	@Column(nullable = false)
	private OffsetDateTime createdAt;

	@PrePersist
	void prePersist() {
		createdAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCodeHash() {
		return codeHash;
	}

	public void setCodeHash(String codeHash) {
		this.codeHash = codeHash;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public OffsetDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(OffsetDateTime expiresAt) {
		this.expiresAt = expiresAt;
	}

	public OffsetDateTime getUsedAt() {
		return usedAt;
	}

	public void setUsedAt(OffsetDateTime usedAt) {
		this.usedAt = usedAt;
	}

	public int getAttempts() {
		return attempts;
	}

	public void setAttempts(int attempts) {
		this.attempts = attempts;
	}

	public boolean isInvalidated() {
		return invalidated;
	}

	public void setInvalidated(boolean invalidated) {
		this.invalidated = invalidated;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
}
