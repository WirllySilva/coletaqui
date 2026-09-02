package br.com.coletaqui.backend.support;

public record SupportContactResponse(
	String name,
	String phone,
	String whatsappUrl,
	String message
) {
}
