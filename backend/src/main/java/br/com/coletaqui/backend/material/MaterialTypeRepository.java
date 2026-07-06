package br.com.coletaqui.backend.material;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialTypeRepository extends JpaRepository<MaterialType, UUID> {
	List<MaterialType> findAllByOrderByNameAsc();

	List<MaterialType> findByActiveTrueOrderByNameAsc();

	List<MaterialType> findByIdIn(Collection<UUID> ids);

	boolean existsBySlug(String slug);
}
