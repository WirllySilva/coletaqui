package br.com.coletaqui.backend.content;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppContentRepository extends JpaRepository<AppContent, UUID> {
	List<AppContent> findAllByOrderByDisplayOrderAscCreatedAtDesc();

	List<AppContent> findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
}
