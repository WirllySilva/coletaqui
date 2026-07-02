package br.com.coletaqui.backend.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {
	List<OtpCode> findByPhoneAndUsedAtIsNullAndInvalidatedFalse(String phone);

	Optional<OtpCode> findFirstByPhoneAndUsedAtIsNullAndInvalidatedFalseOrderByCreatedAtDesc(String phone);
}
