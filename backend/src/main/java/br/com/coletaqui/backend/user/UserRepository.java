package br.com.coletaqui.backend.user;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByPhone(String phone);

	Optional<User> findByEmailIgnoreCase(String email);

	List<User> findByRoleAndProfileCompleteTrue(UserRole role);

	List<User> findByRoleOrderByCreatedAtDesc(UserRole role);

	List<User> findAllByOrderByCreatedAtDesc();

	List<User> findByRoleAndStatusOrderByCreatedAtDesc(UserRole role, UserStatus status);

	long countByRole(UserRole role);

	long countByRoleAndStatus(UserRole role, UserStatus status);
}
