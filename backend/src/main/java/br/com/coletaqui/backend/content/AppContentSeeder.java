package br.com.coletaqui.backend.content;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AppContentSeeder implements CommandLineRunner {
	private final AppContentRepository appContentRepository;

	public AppContentSeeder(AppContentRepository appContentRepository) {
		this.appContentRepository = appContentRepository;
	}

	@Override
	public void run(String... args) {
		if (appContentRepository.count() > 0) {
			return;
		}

		appContentRepository.saveAll(List.of(
			seed("Como separar materiais recicláveis", "Aprenda a separar corretamente os materiais recicláveis.", AppContentType.TIP, "/howtoseparate", 1),
			seed("Dicas para lavar recipientes", "Saiba como lavar recipientes antes de reciclar.", AppContentType.TIP, "/plastic", 2),
			seed("Tipos de plásticos", "Evite misturar diferentes tipos de plásticos.", AppContentType.TIP, "/plastic", 3),
			seed("Doação de objetos reutilizáveis", "Doe objetos em vez de descartá-los.", AppContentType.CAMPAIGN, "/infobanner", 4)
		));
	}

	private AppContent seed(String title, String summary, AppContentType type, String route, int order) {
		var content = new AppContent();
		content.setTitle(title);
		content.setSummary(summary);
		content.setType(type);
		content.setInternalRoute(route);
		content.setDisplayOrder(order);
		content.setActive(true);
		return content;
	}
}
