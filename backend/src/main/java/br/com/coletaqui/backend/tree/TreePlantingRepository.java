package br.com.coletaqui.backend.tree;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreePlantingRepository extends JpaRepository<TreePlanting, UUID> {
	@EntityGraph(attributePaths = "user")
	List<TreePlanting> findByUserIdOrderByPlantedDateDesc(UUID userId);

	@EntityGraph(attributePaths = "user")
	List<TreePlanting> findAllByOrderByCreatedAtDesc();

	@EntityGraph(attributePaths = "user")
	List<TreePlanting> findByStatusOrderByCreatedAtDesc(TreePlantingStatus status);

	@EntityGraph(attributePaths = "user")
	List<TreePlanting> findByStatusOrderByPlantedDateDesc(TreePlantingStatus status);

	long countByStatus(TreePlantingStatus status);
}
