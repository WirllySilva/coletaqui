package br.com.coletaqui.backend.push.dto;

public record PushPublicKeyResponse(
	String publicKey,
	boolean configured
) {
}
