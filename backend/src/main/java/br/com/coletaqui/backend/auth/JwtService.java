package br.com.coletaqui.backend.auth;

import br.com.coletaqui.backend.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final String secret;
	private final long expirationMinutes;

	public JwtService(
		@Value("${app.jwt.secret}") String secret,
		@Value("${app.jwt.expiration-minutes}") long expirationMinutes
	) {
		this.secret = secret;
		this.expirationMinutes = expirationMinutes;
	}

	public String generate(User user) {
		var now = Instant.now();
		var header = Map.of("alg", "HS256", "typ", "JWT");
		var payload = new LinkedHashMap<String, Object>();
		payload.put("sub", user.getId().toString());
		payload.put("phone", user.getPhone());
		payload.put("role", user.getRole().name());
		payload.put("iat", now.getEpochSecond());
		payload.put("exp", now.plusSeconds(expirationMinutes * 60).getEpochSecond());

		var unsignedToken = encode(header) + "." + encode(payload);
		return unsignedToken + "." + sign(unsignedToken);
	}

	public Map<String, Object> validate(String token) {
		var parts = token.split("\\.");
		if (parts.length != 3) {
			throw new IllegalArgumentException("Token inválido");
		}

		var unsignedToken = parts[0] + "." + parts[1];
		if (!sign(unsignedToken).equals(parts[2])) {
			throw new IllegalArgumentException("Assinatura inválida");
		}

		var payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
		try {
			var payload = objectMapper.readValue(payloadJson, new TypeReference<Map<String, Object>>() {});
			var exp = ((Number) payload.get("exp")).longValue();
			if (Instant.now().getEpochSecond() > exp) {
				throw new IllegalArgumentException("Token expirado");
			}
			return payload;
		} catch (Exception exception) {
			throw new IllegalArgumentException("Token inválido", exception);
		}
	}

	private String encode(Object value) {
		try {
			var bytes = objectMapper.writeValueAsBytes(value);
			return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
		} catch (Exception exception) {
			throw new IllegalStateException("Não foi possível gerar JWT", exception);
		}
	}

	private String sign(String value) {
		try {
			var mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception exception) {
			throw new IllegalStateException("Não foi possível assinar JWT", exception);
		}
	}
}
