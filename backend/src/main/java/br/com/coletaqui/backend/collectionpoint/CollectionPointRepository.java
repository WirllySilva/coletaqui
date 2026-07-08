package br.com.coletaqui.backend.collectionpoint;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionPointRepository extends JpaRepository<CollectionPoint, UUID> {
	List<CollectionPoint> findAllByOrderByCreatedAtDesc();

	List<CollectionPoint> findByActiveTrueOrderByNameAsc();

	long countByActiveTrue();
}
