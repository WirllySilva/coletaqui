package br.com.coletaqui.backend.push;

import br.com.coletaqui.backend.push.dto.PushPublicKeyResponse;
import br.com.coletaqui.backend.push.dto.PushSubscriptionRequest;
import br.com.coletaqui.backend.push.dto.PushSubscriptionResponse;
import br.com.coletaqui.backend.push.dto.PushTestRequest;
import br.com.coletaqui.backend.user.UserRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.security.Security;
import java.util.List;
import java.util.UUID;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PushNotificationService {
	private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

	private final PushSubscriptionRepository pushSubscriptionRepository;
	private final UserRepository userRepository;
	private final ObjectMapper objectMapper;
	private final String publicKey;
	private final String privateKey;
	private final String subject;
	private PushService pushService;

	public PushNotificationService(
		PushSubscriptionRepository pushSubscriptionRepository,
		UserRepository userRepository,
		ObjectMapper objectMapper,
		@Value("${app.push.vapid.public-key:}") String publicKey,
		@Value("${app.push.vapid.private-key:}") String privateKey,
		@Value("${app.push.vapid.subject:}") String subject
	) {
		this.pushSubscriptionRepository = pushSubscriptionRepository;
		this.userRepository = userRepository;
		this.objectMapper = objectMapper;
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		this.subject = subject;
	}

	@PostConstruct
	void init() {
		if (!configured()) {
			log.warn("Push notifications sem chaves VAPID configuradas.");
			return;
		}
		if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
			Security.addProvider(new BouncyCastleProvider());
		}
		try {
			pushService = new PushService(publicKey, privateKey, subject);
		} catch (Exception exception) {
			log.warn("Nao foi possivel iniciar o servico de push.", exception);
		}
	}

	public PushPublicKeyResponse publicKey() {
		return new PushPublicKeyResponse(publicKey, configured());
	}

	@Transactional
	public PushSubscriptionResponse subscribe(UUID userId, PushSubscriptionRequest request, String userAgent) {
		var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
		var subscription = pushSubscriptionRepository.findByEndpoint(request.endpoint()).orElseGet(PushSubscription::new);
		subscription.setUser(user);
		subscription.setEndpoint(request.endpoint());
		subscription.setP256dh(request.keys().p256dh());
		subscription.setAuth(request.keys().auth());
		subscription.setUserAgent(truncate(userAgent, 255));
		subscription.setActive(true);
		return toResponse(pushSubscriptionRepository.save(subscription));
	}

	@Transactional
	public void unsubscribe(UUID userId, PushSubscriptionRequest request) {
		pushSubscriptionRepository.findByEndpoint(request.endpoint())
			.filter(subscription -> subscription.getUser().getId().equals(userId))
			.ifPresent(subscription -> subscription.setActive(false));
	}

	@Transactional(readOnly = true)
	public List<PushSubscriptionResponse> mine(UUID userId) {
		return pushSubscriptionRepository.findByUserIdAndActiveTrue(userId).stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional
	public void sendTest(UUID userId, PushTestRequest request) {
		var title = blankToDefault(request.title(), "Coletaqui Araçoiaba");
		var body = blankToDefault(request.body(), "Notificações ativadas neste dispositivo.");
		var url = blankToDefault(request.url(), "/home");
		sendToUser(userId, title, body, url);
	}

	@Transactional
	public void sendToUser(UUID userId, String title, String body, String url) {
		if (pushService == null) {
			throw new IllegalStateException("Push ainda nao esta configurado no backend.");
		}

		var subscriptions = pushSubscriptionRepository.findByUserIdAndActiveTrue(userId);
		if (subscriptions.isEmpty()) {
			throw new IllegalArgumentException("Nenhum dispositivo inscrito para receber notificacoes.");
		}

		for (var subscription : subscriptions) {
			send(subscription, title, body, url);
		}
	}

	private void send(PushSubscription subscription, String title, String body, String url) {
		try {
			var payload = objectMapper.writeValueAsString(new AngularPushPayload(
				new AngularPushNotification(
					title,
					body,
					"/icons/icon-192x192.png",
					"/icons/icon-72x72.png",
					new AngularPushData(new AngularPushClickActions(new AngularPushClickAction("openWindow", url)))
				)
			));
			var notification = new Notification(subscription.getEndpoint(), subscription.getP256dh(), subscription.getAuth(), payload);
			HttpResponse response = pushService.send(notification);
			var status = response.getStatusLine().getStatusCode();
			if (status == 404 || status == 410) {
				subscription.setActive(false);
			}
			if (status < 200 || status >= 300) {
				log.warn("Falha ao enviar push. status={}, endpoint={}", status, subscription.getEndpoint());
			}
		} catch (Exception exception) {
			log.warn("Falha ao enviar push para endpoint={}", subscription.getEndpoint(), exception);
		}
	}

	private boolean configured() {
		return publicKey != null && !publicKey.isBlank()
			&& privateKey != null && !privateKey.isBlank()
			&& subject != null && !subject.isBlank();
	}

	private PushSubscriptionResponse toResponse(PushSubscription subscription) {
		return new PushSubscriptionResponse(
			subscription.getId(),
			subscription.getEndpoint(),
			subscription.isActive(),
			subscription.getCreatedAt(),
			subscription.getUpdatedAt()
		);
	}

	private String truncate(String value, int maxLength) {
		if (value == null || value.length() <= maxLength) {
			return value;
		}
		return value.substring(0, maxLength);
	}

	private String blankToDefault(String value, String fallback) {
		return value == null || value.isBlank() ? fallback : value.trim();
	}

	private record AngularPushPayload(AngularPushNotification notification) {
	}

	private record AngularPushNotification(String title, String body, String icon, String badge, AngularPushData data) {
	}

	private record AngularPushData(AngularPushClickActions onActionClick) {
	}

	private record AngularPushClickActions(@JsonProperty("default") AngularPushClickAction defaultAction) {
	}

	private record AngularPushClickAction(String operation, String url) {
	}
}
