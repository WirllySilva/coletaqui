package br.com.coletaqui.backend.auth;

public interface OtpSender {
	void send(String phone, String code);
}
