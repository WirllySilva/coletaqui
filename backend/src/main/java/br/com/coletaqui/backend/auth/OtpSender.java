package br.com.coletaqui.backend.auth;

public interface OtpSender {
	void send(String phone, String code);

	boolean verify(String phone, String code);

	boolean isExternalVerificationEnabled();
}
