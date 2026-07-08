package br.com.coletaqui.backend.tree;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TreePhotoStorage {
	private final Path localDirectory;
	private final String publicBaseUrl;
	private final String supabaseUrl;
	private final String supabaseServiceKey;
	private final String supabaseBucket;
	private final HttpClient httpClient = HttpClient.newHttpClient();

	public TreePhotoStorage(
		@Value("${app.upload.local-dir:uploads/tree-plantings}") String localDirectory,
		@Value("${app.upload.public-base-url:/uploads/tree-plantings}") String publicBaseUrl,
		@Value("${app.supabase.url:}") String supabaseUrl,
		@Value("${app.supabase.service-key:}") String supabaseServiceKey,
		@Value("${app.supabase.tree-bucket:tree-plantings}") String supabaseBucket
	) {
		this.localDirectory = Path.of(localDirectory).toAbsolutePath().normalize();
		this.publicBaseUrl = publicBaseUrl;
		this.supabaseUrl = supabaseUrl == null ? "" : supabaseUrl.strip();
		this.supabaseServiceKey = supabaseServiceKey == null ? "" : supabaseServiceKey.strip();
		this.supabaseBucket = supabaseBucket;
	}

	public StoredTreePhoto store(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Foto do plantio e obrigatoria.");
		}
		if (file.getSize() > 10 * 1024 * 1024) {
			throw new IllegalArgumentException("Foto deve ter no maximo 10 MB.");
		}
		var contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
		if (!contentType.startsWith("image/")) {
			throw new IllegalArgumentException("Arquivo deve ser uma imagem.");
		}

		var extension = extension(contentType);
		var objectPath = "%s.%s".formatted(UUID.randomUUID(), extension);
		return isSupabaseConfigured()
			? storeSupabase(file, objectPath, contentType)
			: storeLocal(file, objectPath);
	}

	public void delete(String path) {
		if (path == null || path.isBlank()) {
			return;
		}
		try {
			if (path.startsWith("supabase:")) {
				deleteSupabase(path.substring("supabase:".length()));
				return;
			}
			Files.deleteIfExists(localDirectory.resolve(path).normalize());
		} catch (Exception ignored) {
			// Validation must not fail because a temporary evidence photo could not be deleted.
		}
	}

	private StoredTreePhoto storeLocal(MultipartFile file, String objectPath) {
		try {
			Files.createDirectories(localDirectory);
			var target = localDirectory.resolve(objectPath).normalize();
			file.transferTo(target);
			return new StoredTreePhoto("%s/%s".formatted(publicBaseUrl.replaceAll("/$", ""), objectPath), objectPath);
		} catch (IOException exception) {
			throw new IllegalStateException("Nao foi possivel salvar a foto do plantio.");
		}
	}

	private StoredTreePhoto storeSupabase(MultipartFile file, String objectPath, String contentType) {
		try {
			var uri = "%s/storage/v1/object/%s/%s".formatted(supabaseUrl.replaceAll("/$", ""), supabaseBucket, objectPath);
			var request = HttpRequest.newBuilder(URI.create(uri))
				.header("Authorization", "Bearer " + supabaseServiceKey)
				.header("apikey", supabaseServiceKey)
				.header("Content-Type", contentType)
				.POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
				.build();
			var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() < 200 || response.statusCode() >= 300) {
				throw new IllegalStateException("Supabase recusou upload da foto.");
			}
			var publicUrl = "%s/storage/v1/object/public/%s/%s".formatted(supabaseUrl.replaceAll("/$", ""), supabaseBucket, objectPath);
			return new StoredTreePhoto(publicUrl, "supabase:" + objectPath);
		} catch (IOException exception) {
			throw new IllegalStateException("Nao foi possivel ler a foto enviada.");
		} catch (InterruptedException exception) {
			Thread.currentThread().interrupt();
			throw new IllegalStateException("Upload da foto foi interrompido.");
		}
	}

	private void deleteSupabase(String objectPath) throws IOException, InterruptedException {
		if (!isSupabaseConfigured()) {
			return;
		}
		var uri = "%s/storage/v1/object/%s/%s".formatted(supabaseUrl.replaceAll("/$", ""), supabaseBucket, objectPath);
		var request = HttpRequest.newBuilder(URI.create(uri))
			.header("Authorization", "Bearer " + supabaseServiceKey)
			.header("apikey", supabaseServiceKey)
			.DELETE()
			.build();
		httpClient.send(request, HttpResponse.BodyHandlers.discarding());
	}

	private boolean isSupabaseConfigured() {
		return !supabaseUrl.isBlank() && !supabaseServiceKey.isBlank() && !supabaseBucket.isBlank();
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

	public record StoredTreePhoto(String url, String path) {
	}
}
