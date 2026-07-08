package br.com.coletaqui.backend.dropoff;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DropOffDeliveryRepository extends JpaRepository<DropOffDelivery, UUID> {
	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<DropOffDelivery> findByCollectorIdOrderByConfirmedAtDesc(UUID collectorId);

	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<DropOffDelivery> findByUserIdOrderByConfirmedAtDesc(UUID userId);

	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<DropOffDelivery> findAllByOrderByConfirmedAtDesc();
}
