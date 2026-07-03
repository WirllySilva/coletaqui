package br.com.coletaqui.backend.user;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByPhone(String phone);

	List<User> findByRoleAndProfileCompleteTrue(UserRole role);
}
