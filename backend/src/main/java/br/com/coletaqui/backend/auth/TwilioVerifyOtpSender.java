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
public class TwilioVerifyOtpSender implements OtpSender {
	private static final Logger log = LoggerFactory.getLogger(TwilioVerifyOtpSender.class);
	private final RestClient restClient;
	private final boolean enabled;
	private final String accountSid;
	private final String authToken;
	private final String verifyServiceSid;
	private final String verifyChannel;
	private final String locale;

	public TwilioVerifyOtpSender(
		@Value("${app.twilio.verify.enabled:false}") boolean enabled,
		@Value("${app.twilio.account-sid:}") String accountSid,
		@Value("${app.twilio.auth-token:}") String authToken,
		@Value("${app.twilio.verify-service-sid:}") String verifyServiceSid,
		@Value("${app.twilio.verify.channel:sms}") String verifyChannel,
		@Value("${app.twilio.verify.locale:auto}") String locale
	) {
		this.restClient = RestClient.builder().baseUrl("https://verify.twilio.com").build();
		this.enabled = enabled;
		this.accountSid = accountSid;
		this.authToken = authToken;
		this.verifyServiceSid = verifyServiceSid;
		this.verifyChannel = normalizeVerifyChannel(verifyChannel);
		this.locale = locale;
	}

	@Override
	public void send(String phone, String code) {
		if (!enabled) {
			log.info("OTP {} em modo desenvolvimento para {}: {}", verifyChannel.toUpperCase(), phone, code);
			return;
		}

		validateConfiguration();

		try {
			restClient.post()
				.uri("/v2/Services/{serviceSid}/Verifications", verifyServiceSid.trim())
				.headers(headers -> headers.setBasicAuth(accountSid.trim(), authToken.trim()))
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.body(twilioPayload(phone))
				.retrieve()
				.toBodilessEntity();
		} catch (RestClientResponseException exception) {
			log.warn("Falha ao enviar OTP por {} via Twilio. status={}, body={}", verifyChannel, exception.getStatusCode(), exception.getResponseBodyAsString());
			throw new IllegalStateException("Não foi possível enviar o código por " + displayChannel() + ".", exception);
		} catch (RuntimeException exception) {
			log.warn("Falha ao enviar OTP por {} via Twilio.", verifyChannel, exception);
			throw new IllegalStateException("Não foi possível enviar o código por " + displayChannel() + ".", exception);
		}
	}

	@Override
	public boolean verify(String phone, String code) {
		if (!enabled) {
			return true;
		}

		validateConfiguration();

		try {
			var response = restClient.post()
				.uri("/v2/Services/{serviceSid}/VerificationCheck", verifyServiceSid.trim())
				.headers(headers -> headers.setBasicAuth(accountSid.trim(), authToken.trim()))
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.body(twilioCheckPayload(phone, code))
				.retrieve()
				.body(TwilioVerificationCheckResponse.class);

			return response != null && "approved".equalsIgnoreCase(response.status());
		} catch (RestClientResponseException exception) {
			log.warn("Falha ao validar OTP por {} via Twilio. status={}, body={}", verifyChannel, exception.getStatusCode(), exception.getResponseBodyAsString());
			return false;
		} catch (RuntimeException exception) {
			log.warn("Falha ao validar OTP por {} via Twilio.", verifyChannel, exception);
			return false;
		}
	}

	@Override
	public boolean isExternalVerificationEnabled() {
		return enabled;
	}

	private MultiValueMap<String, String> twilioPayload(String phone) {
		var payload = new LinkedMultiValueMap<String, String>();
		payload.add("To", toE164Brazil(phone));
		payload.add("Channel", verifyChannel);

		if (!shouldUseAutomaticLocale()) {
			payload.add("Locale", locale.trim());
		}

		return payload;
	}

	private MultiValueMap<String, String> twilioCheckPayload(String phone, String code) {
		var payload = new LinkedMultiValueMap<String, String>();
		payload.add("To", toE164Brazil(phone));
		payload.add("Code", code);
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
		throw new IllegalArgumentException("Telefone inválido para envio por " + displayChannel() + ".");
	}

	private void validateConfiguration() {
		if (isBlank(accountSid) || isBlank(authToken) || isBlank(verifyServiceSid)) {
			throw new IllegalStateException("Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_VERIFY_SERVICE_SID para enviar OTP por " + displayChannel() + ".");
		}
	}

	private String normalizeVerifyChannel(String value) {
		if (isBlank(value)) {
			return "sms";
		}
		var normalized = value.trim().toLowerCase();
		if (!normalized.equals("sms") && !normalized.equals("whatsapp")) {
			throw new IllegalArgumentException("Canal Twilio Verify inválido. Use sms ou whatsapp.");
		}
		return normalized;
	}

	private String displayChannel() {
		return verifyChannel.equals("sms") ? "SMS" : "WhatsApp";
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}

	private boolean shouldUseAutomaticLocale() {
		return isBlank(locale) || "auto".equalsIgnoreCase(locale.trim());
	}

	private record TwilioVerificationCheckResponse(String status) {}
}
