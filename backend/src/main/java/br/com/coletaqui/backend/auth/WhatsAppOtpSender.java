package br.com.coletaqui.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class WhatsAppOtpSender implements OtpSender {
	private static final Logger log = LoggerFactory.getLogger(WhatsAppOtpSender.class);
	private final RestClient restClient;
	private final boolean enabled;
	private final String accountSid;
	private final String authToken;
	private final String verifyServiceSid;
	private final String locale;

	public WhatsAppOtpSender(
		@Value("${app.twilio.verify.enabled:false}") boolean enabled,
		@Value("${app.twilio.account-sid:}") String accountSid,
		@Value("${app.twilio.auth-token:}") String authToken,
		@Value("${app.twilio.verify-service-sid:}") String verifyServiceSid,
		@Value("${app.twilio.verify.locale:pt-BR}") String locale
	) {
		this.restClient = RestClient.builder().baseUrl("https://verify.twilio.com").build();
		this.enabled = enabled;
		this.accountSid = accountSid;
		this.authToken = authToken;
		this.verifyServiceSid = verifyServiceSid;
		this.locale = locale;
	}

	@Override
	public void send(String phone, String code) {
		if (!enabled) {
			log.info("OTP WhatsApp em modo desenvolvimento para {}: {}", phone, code);
			return;
		}

		validateConfiguration();

		try {
			restClient.post()
				.uri("/v2/Services/{serviceSid}/Verifications", verifyServiceSid.trim())
				.headers(headers -> headers.setBasicAuth(accountSid.trim(), authToken.trim()))
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.body(twilioPayload(phone, code))
				.retrieve()
				.toBodilessEntity();
		} catch (RestClientResponseException exception) {
			log.warn("Falha ao enviar OTP por WhatsApp via Twilio. status={}, body={}", exception.getStatusCode(), exception.getResponseBodyAsString());
			throw new IllegalStateException("Não foi possível enviar o código pelo WhatsApp.", exception);
		} catch (RuntimeException exception) {
			log.warn("Falha ao enviar OTP por WhatsApp via Twilio.", exception);
			throw new IllegalStateException("Não foi possível enviar o código pelo WhatsApp.", exception);
		}
	}

	private MultiValueMap<String, String> twilioPayload(String phone, String code) {
		var payload = new LinkedMultiValueMap<String, String>();
		payload.add("To", toE164Brazil(phone));
		payload.add("Channel", "whatsapp");
		payload.add("CustomCode", code);

		if (!isBlank(locale)) {
			payload.add("Locale", locale.trim());
		}

		return payload;
	}

	private String toE164Brazil(String phone) {
		var digits = phone.replaceAll("\\D", "");
		if (digits.length() == 13 && digits.startsWith("55")) {
			return "+" + digits;
		}
		if (digits.length() == 11) {
			return "+55" + digits;
		}
		throw new IllegalArgumentException("Telefone inválido para envio por WhatsApp.");
	}

	private void validateConfiguration() {
		if (isBlank(accountSid) || isBlank(authToken) || isBlank(verifyServiceSid)) {
			throw new IllegalStateException("Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_VERIFY_SERVICE_SID para enviar OTP por WhatsApp.");
		}
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}
}
