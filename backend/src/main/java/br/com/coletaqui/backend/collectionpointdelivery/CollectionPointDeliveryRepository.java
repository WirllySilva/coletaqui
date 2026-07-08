package br.com.coletaqui.backend.collectionpointdelivery;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionPointDeliveryRepository extends JpaRepository<CollectionPointDelivery, UUID> {
	@EntityGraph(attributePaths = {"collectionPoint", "materials", "user"})
	List<CollectionPointDelivery> findByUserIdOrderByCreatedAtDesc(UUID userId);

	@EntityGraph(attributePaths = {"collectionPoint", "materials", "user"})
	List<CollectionPointDelivery> findByCollectionPointResponsibleCollectorIdOrderByCreatedAtDesc(UUID collectorId);

	@EntityGraph(attributePaths = {"collectionPoint", "materials", "user"})
	List<CollectionPointDelivery> findAllByOrderByCreatedAtDesc();

	long countByStatus(CollectionPointDeliveryStatus status);
}
