package br.com.coletaqui.backend.content;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AppContentImageStorage {
	private final Path localDirectory;
	private final String publicBaseUrl;

	public AppContentImageStorage(
		@Value("${app.content-image.local-dir:uploads/content-images}") String localDirectory,
		@Value("${app.content-image.public-base-url:/uploads/content-images}") String publicBaseUrl
	) {
		this.localDirectory = Path.of(localDirectory).toAbsolutePath().normalize();
		this.publicBaseUrl = publicBaseUrl;
	}

	public StoredContentImage store(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Imagem e obrigatoria.");
		}
		if (file.getSize() > 5 * 1024 * 1024) {
			throw new IllegalArgumentException("Imagem deve ter no maximo 5 MB.");
		}
		var contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
		if (!contentType.startsWith("image/")) {
			throw new IllegalArgumentException("Arquivo deve ser uma imagem.");
		}

		var objectPath = "%s.%s".formatted(UUID.randomUUID(), extension(contentType));
		try {
			Files.createDirectories(localDirectory);
			var target = localDirectory.resolve(objectPath).normalize();
			file.transferTo(target);
			return new StoredContentImage("%s/%s".formatted(publicBaseUrl.replaceAll("/$", ""), objectPath), objectPath);
		} catch (IOException exception) {
			throw new IllegalStateException("Nao foi possivel salvar a imagem do conteudo.");
		}
	}

	public void delete(String path) {
		if (path == null || path.isBlank()) {
			return;
		}
		try {
			Files.deleteIfExists(localDirectory.resolve(path).normalize());
		} catch (Exception ignored) {
			// A exclusao do conteudo nao deve falhar se a imagem antiga nao puder ser removida.
		}
	}

	private String extension(String contentType) {
		if (contentType.contains("png")) {
			return "png";
		}
		if (contentType.contains("webp")) {
			return "webp";
		}
		return "jpg";
	}

	public record StoredContentImage(String url, String path) {
	}
}
