package br.com.coletaqui.backend.push.dto;

public record PushTestRequest(
	String title,
	String body,
	String url
) {
}
