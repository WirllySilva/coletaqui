package br.com.coletaqui.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class WhatsAppOtpSender implements OtpSender {
	private static final Logger log = LoggerFactory.getLogger(WhatsAppOtpSender.class);

	@Override
	public void send(String phone, String code) {
		// TODO: integrar provedor real de WhatsApp Business API.
		log.info("OTP WhatsApp para {}: {}", phone, code);
	}
}
