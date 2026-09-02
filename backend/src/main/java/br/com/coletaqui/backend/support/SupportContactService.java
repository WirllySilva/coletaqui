package br.com.coletaqui.backend.support;

import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupportContactService {
	private final UserRepository userRepository;
	private final String defaultMessage;

	public SupportContactService(
		UserRepository userRepository,
		@Value("${app.support.whatsapp-message:Ola! Preciso de ajuda com o Coletaqui Aracoiaba.}") String defaultMessage
	) {
		this.userRepository = userRepository;
		this.defaultMessage = defaultMessage;
	}

	@Transactional(readOnly = true)
	public SupportContactResponse contact() {
		var admin = userRepository.findByRoleAndStatusOrderByCreatedAtDesc(UserRole.ADMIN, UserStatus.ACTIVE)
			.stream()
			.filter(user -> user.getPhone() != null && user.getPhone().replaceAll("\\D", "").matches("[1-9]\\d9\\d{8}"))
			.findFirst()
			.orElse(null);

		if (admin == null) {
			return new SupportContactResponse(null, null, null, "WhatsApp de atendimento ainda nao configurado.");
		}

		var phoneWithCountryCode = "55" + admin.getPhone().replaceAll("\\D", "");
		var encodedMessage = URLEncoder.encode(defaultMessage, StandardCharsets.UTF_8);
		return new SupportContactResponse(
			admin.getName(),
			admin.getPhone(),
			"https://wa.me/" + phoneWithCountryCode + "?text=" + encodedMessage,
			"Atendimento pelo WhatsApp disponivel."
		);
	}
}
