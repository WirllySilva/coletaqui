package br.com.coletaqui.backend.material;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MaterialTypeSeeder implements CommandLineRunner {
	private final MaterialTypeRepository materialTypeRepository;

	public MaterialTypeSeeder(MaterialTypeRepository materialTypeRepository) {
		this.materialTypeRepository = materialTypeRepository;
	}

	@Override
	public void run(String... args) {
		List.of(
			seed("Papel", "papel", "Papéis limpos e secos.", false),
			seed("Plástico", "plastico", "Embalagens plásticas recicláveis.", false),
			seed("Vidro", "vidro", "Garrafas, potes e recipientes de vidro.", false),
			seed("Metal", "metal", "Latas e outros metais recicláveis.", false),
			seed("Óleo de cozinha usado", "oleo-cozinha", "Óleo usado armazenado em garrafa fechada.", true),
			seed("Pilhas e baterias", "pilhas-baterias", "Materiais que exigem descarte especial.", true),
			seed("Orgânico", "organico", "Resíduos orgânicos reaproveitáveis.", false)
		).forEach(material -> {
			if (!materialTypeRepository.existsBySlug(material.getSlug())) {
				materialTypeRepository.save(material);
			}
		});
	}

	private MaterialType seed(String name, String slug, String description, boolean hazardous) {
		var materialType = new MaterialType();
		materialType.setName(name);
		materialType.setSlug(slug);
		materialType.setDescription(description);
		materialType.setHazardous(hazardous);
		materialType.setActive(true);
		return materialType;
	}
}
