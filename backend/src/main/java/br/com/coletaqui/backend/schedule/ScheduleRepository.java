package br.com.coletaqui.backend.schedule;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<Schedule> findByUserIdOrderByCreatedAtDesc(UUID userId);

	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<Schedule> findByCollectorIdOrderByUpdatedAtDesc(UUID collectorId);

	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<Schedule> findByStatusOrderByCreatedAtDesc(ScheduleStatus status);

	@Override
	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	Optional<Schedule> findById(UUID id);

	@EntityGraph(attributePaths = {"materials", "user", "collector"})
	List<Schedule> findAllByOrderByCreatedAtDesc();

	long countByStatus(ScheduleStatus status);
}
