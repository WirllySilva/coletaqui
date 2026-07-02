package br.com.coletaqui.backend.user.address;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {
	List<UserAddress> findByUserIdOrderByDefaultAddressDescCreatedAtDesc(UUID userId);

	Optional<UserAddress> findByIdAndUserId(UUID id, UUID userId);

	long countByUserId(UUID userId);
}
