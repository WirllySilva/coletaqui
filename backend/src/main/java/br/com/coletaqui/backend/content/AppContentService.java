package br.com.coletaqui.backend.content;

import br.com.coletaqui.backend.content.dto.AppContentResponse;
import br.com.coletaqui.backend.content.dto.UpsertAppContentRequest;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AppContentService {
	private final AppContentRepository appContentRepository;
	private final AppContentImageStorage appContentImageStorage;

	public AppContentService(AppContentRepository appContentRepository, AppContentImageStorage appContentImageStorage) {
		this.appContentRepository = appContentRepository;
		this.appContentImageStorage = appContentImageStorage;
	}

	@Transactional(readOnly = true)
	public List<AppContentResponse> active() {
		var now = OffsetDateTime.now();
		return appContentRepository.findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc()
			.stream()
			.filter(content -> content.getExpiresAt() == null || content.getExpiresAt().isAfter(now))
			.map(this::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	public AppContentResponse publicById(UUID contentId) {
		var content = find(contentId);
		if (!content.isActive() || isExpired(content)) {
			throw new IllegalArgumentException("Conteudo nao encontrado.");
		}
		return toResponse(content);
	}

	@Transactional(readOnly = true)
	public List<AppContentResponse> all() {
		return appContentRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
			.stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional
	public AppContentResponse create(UpsertAppContentRequest request) {
		var content = new AppContent();
		apply(content, request);
		return toResponse(appContentRepository.save(content));
	}

	@Transactional
	public AppContentResponse update(UUID contentId, UpsertAppContentRequest request) {
		var content = find(contentId);
		apply(content, request);
		return toResponse(content);
	}

	@Transactional
	public AppContentResponse toggle(UUID contentId) {
		var content = find(contentId);
		content.setActive(!content.isActive());
		return toResponse(content);
	}

	@Transactional
	public void delete(UUID contentId) {
		var content = find(contentId);
		deleteStoredImage(content);
		appContentRepository.delete(content);
	}

	@Transactional
	public AppContentResponse uploadImage(UUID contentId, MultipartFile image) {
		var content = find(contentId);
		deleteStoredImage(content);
		var storedImage = appContentImageStorage.store(image);
		content.setImageUrl(storedImage.url());
		content.setImagePath(storedImage.path());
		return toResponse(content);
	}

	@Transactional
	public AppContentResponse removeImage(UUID contentId) {
		var content = find(contentId);
		deleteStoredImage(content);
		content.setImageUrl(null);
		content.setImagePath(null);
		return toResponse(content);
	}

	private AppContent find(UUID contentId) {
		return appContentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("Conteudo nao encontrado."));
	}

	private boolean isExpired(AppContent content) {
		return content.getExpiresAt() != null && !content.getExpiresAt().isAfter(OffsetDateTime.now());
	}

	private void apply(AppContent content, UpsertAppContentRequest request) {
		var imageUrl = blankToNull(request.imageUrl());
		if (content.getImagePath() != null && !Objects.equals(content.getImageUrl(), imageUrl)) {
			deleteStoredImage(content);
			content.setImagePath(null);
		}
		content.setTitle(request.title().trim());
		content.setSummary(request.summary().trim());
		content.setType(request.type());
		content.setLinkUrl(blankToNull(request.linkUrl()));
		content.setInternalRoute(normalizeInternalRoute(request.internalRoute()));
		content.setImageUrl(imageUrl);
		content.setBody(blankToNull(request.body()));
		content.setDisplayOrder(request.displayOrder());
		content.setActive(request.active());
		content.setExpiresAt(request.expiresAt());
	}

	private AppContentResponse toResponse(AppContent content) {
		return new AppContentResponse(
			content.getId(),
			content.getTitle(),
			content.getSummary(),
			content.getType(),
			content.getLinkUrl(),
			content.getInternalRoute(),
			content.getImageUrl(),
			content.getBody(),
			content.getDisplayOrder(),
			content.isActive(),
			content.getExpiresAt(),
			content.getCreatedAt(),
			content.getUpdatedAt()
		);
	}

	private String normalizeInternalRoute(String value) {
		var route = blankToNull(value);
		if (route == null) {
			return null;
		}
		return route.startsWith("/") ? route : "/" + route;
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	private void deleteStoredImage(AppContent content) {
		appContentImageStorage.delete(content.getImagePath());
	}
}
