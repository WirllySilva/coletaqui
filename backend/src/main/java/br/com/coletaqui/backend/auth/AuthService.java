package br.com.coletaqui.backend.auth;

import br.com.coletaqui.backend.auth.dto.AuthResponse;
import br.com.coletaqui.backend.auth.dto.AdminLoginRequest;
import br.com.coletaqui.backend.auth.dto.CompleteProfileRequest;
import br.com.coletaqui.backend.auth.dto.OtpRequest;
import br.com.coletaqui.backend.auth.dto.OtpRequestResponse;
import br.com.coletaqui.backend.auth.dto.OtpVerifyRequest;
import br.com.coletaqui.backend.user.CollectorServiceType;
import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Random;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
	private static final String TERMS_VERSION = "2026-07-08";
	private static final String PRIVACY_VERSION = "2026-07-08";

	private final OtpCodeRepository otpCodeRepository;
	private final UserRepository userRepository;
	private final OtpSender otpSender;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final Random random = new Random();
	private final long otpExpirationMinutes;
	private final int maxAttempts;
	private final boolean exposeDevCode;
	private final String channel;
	private final String defaultAreaCode;

	public AuthService(
		OtpCodeRepository otpCodeRepository,
		UserRepository userRepository,
		OtpSender otpSender,
		JwtService jwtService,
		PasswordEncoder passwordEncoder,
		@Value("${app.otp.expiration-minutes}") long otpExpirationMinutes,
		@Value("${app.otp.max-attempts}") int maxAttempts,
		@Value("${app.otp.expose-dev-code}") boolean exposeDevCode,
		@Value("${app.otp.channel}") String channel,
		@Value("${app.phone.default-area-code:81}") String defaultAreaCode
	) {
		this.otpCodeRepository = otpCodeRepository;
		this.userRepository = userRepository;
		this.otpSender = otpSender;
		this.jwtService = jwtService;
		this.passwordEncoder = passwordEncoder;
		this.otpExpirationMinutes = otpExpirationMinutes;
		this.maxAttempts = maxAttempts;
		this.exposeDevCode = exposeDevCode;
		this.channel = channel;
		this.defaultAreaCode = defaultAreaCode.replaceAll("\\D", "");
	}

	@Transactional(readOnly = true)
	public AuthResponse adminLogin(AdminLoginRequest request) {
		var email = normalizeEmail(request.email());
		var user = userRepository
			.findByEmailIgnoreCase(email)
			.orElseThrow(() -> new IllegalArgumentException("Credenciais invalidas."));

		if (user.getRole() != UserRole.ADMIN || user.getStatus() != UserStatus.ACTIVE || isBlank(user.getPasswordHash())) {
			throw new IllegalArgumentException("Credenciais invalidas.");
		}

		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new IllegalArgumentException("Credenciais invalidas.");
		}

		return toAuthResponse(user);
	}

	@Transactional
	public OtpRequestResponse requestOtp(OtpRequest request) {
		var phone = normalizePhone(request.phone());
		invalidateActiveOtps(phone);

		var code = "%06d".formatted(random.nextInt(1_000_000));
		var otp = new OtpCode();
		otp.setPhone(phone);
		otp.setCodeHash(hash(code));
		otp.setChannel(channel);
		otp.setExpiresAt(OffsetDateTime.now().plusMinutes(otpExpirationMinutes));
		otpCodeRepository.save(otp);
		otpSender.send(phone, code);

		return new OtpRequestResponse(
			"Código enviado por WhatsApp.",
			phone,
			channel,
			otp.getExpiresAt(),
			exposeDevCode ? code : null
		);
	}

	@Transactional
	public AuthResponse verifyOtp(OtpVerifyRequest request) {
		var phone = normalizePhone(request.phone());
		var requestedRole = requireRole(request.role());
		var otp = otpCodeRepository
			.findFirstByPhoneAndUsedAtIsNullAndInvalidatedFalseOrderByCreatedAtDesc(phone)
			.orElseThrow(() -> new IllegalArgumentException("OTP não encontrado ou já utilizado."));

		validateOtp(otp, request.code());
		otp.setUsedAt(OffsetDateTime.now());

		var user = userRepository.findByPhone(phone).orElseGet(() -> createIncompleteUser(phone, requestedRole));
		if (user.getRole() != requestedRole && !user.isProfileComplete()) {
			user.setRole(requestedRole);
			user.setStatus(statusForRole(requestedRole));
		}
		if (user.getStatus() == UserStatus.BLOCKED || user.getStatus() == UserStatus.INACTIVE) {
			throw new IllegalArgumentException("Usuario sem permissao para acessar o sistema.");
		}

		return toAuthResponse(user);
	}

	@Transactional
	public AuthResponse completeProfile(UUID userId, CompleteProfileRequest request) {
		var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
		if (!Boolean.TRUE.equals(request.termsAccepted()) || !Boolean.TRUE.equals(request.privacyAccepted())) {
			throw new IllegalArgumentException("Aceite os Termos de Uso e a Politica de Privacidade para concluir o cadastro.");
		}
		user.setName(request.name().trim());

		if (user.getRole() == UserRole.COLLECTOR) {
			if (isBlank(request.region()) || isBlank(request.materials()) || isBlank(request.availability()) || isBlank(request.collectorServiceType())) {
				throw new IllegalArgumentException("Catador/coletor deve informar região, materiais coletados e disponibilidade.");
			}
			user.setRegion(request.region().trim());
			user.setMaterials(request.materials().trim());
			user.setAvailability(request.availability().trim());
			user.setCollectorServiceType(parseCollectorServiceType(request.collectorServiceType()));
			user.setStatus(UserStatus.PENDING_APPROVAL);
		} else {
			user.setStatus(UserStatus.ACTIVE);
		}

		user.setProfileComplete(true);
		user.setTermsAcceptedAt(OffsetDateTime.now());
		user.setTermsVersion(TERMS_VERSION);
		user.setPrivacyAcceptedAt(OffsetDateTime.now());
		user.setPrivacyVersion(PRIVACY_VERSION);
		return toAuthResponse(user);
	}

	private void validateOtp(OtpCode otp, String code) {
		if (otp.getExpiresAt().isBefore(OffsetDateTime.now())) {
			throw new IllegalArgumentException("OTP expirado.");
		}
		if (otp.getAttempts() >= maxAttempts) {
			throw new IllegalArgumentException("Limite de tentativas excedido.");
		}

		otp.setAttempts(otp.getAttempts() + 1);
		if (!otp.getCodeHash().equals(hash(code))) {
			throw new IllegalArgumentException("OTP inválido.");
		}
	}

	private void invalidateActiveOtps(String phone) {
		otpCodeRepository.findByPhoneAndUsedAtIsNullAndInvalidatedFalse(phone).forEach(otp -> otp.setInvalidated(true));
	}

	private User createIncompleteUser(String phone, UserRole role) {
		var user = new User();
		user.setPhone(phone);
		user.setRole(role);
		user.setStatus(statusForRole(role));
		user.setProfileComplete(false);
		return userRepository.save(user);
	}

	private UserStatus statusForRole(UserRole role) {
		return role == UserRole.COLLECTOR ? UserStatus.PENDING_APPROVAL : UserStatus.ACTIVE;
	}

	private UserRole requireRole(UserRole role) {
		if (role == null) {
			throw new IllegalArgumentException("Perfil é obrigatório.");
		}
		return role;
	}

	private CollectorServiceType parseCollectorServiceType(String value) {
		try {
			return CollectorServiceType.valueOf(value.trim().toUpperCase());
		} catch (RuntimeException exception) {
			throw new IllegalArgumentException("Tipo de atendimento do coletor invalido.");
		}
	}

	private AuthResponse toAuthResponse(User user) {
		return new AuthResponse(
			jwtService.generate(user),
			user.getId(),
			user.getPhone(),
			user.getRole(),
			user.getStatus(),
			user.isProfileComplete(),
			user.getName(),
			user.getCollectorServiceType() == null ? null : user.getCollectorServiceType().name()
		);
	}

	private String normalizePhone(String phone) {
		if (phone == null || phone.isBlank()) {
			throw new IllegalArgumentException("Telefone invalido.");
		}

		var digits = phone.replaceAll("\\D", "");
		if (digits.length() == 13 && digits.startsWith("55")) {
			digits = digits.substring(2);
		}
		if (digits.length() == 9 && digits.startsWith("9")) {
			digits = defaultAreaCode + digits;
		}
		if (!digits.matches("[1-9]\\d9\\d{8}")) {
			throw new IllegalArgumentException("Telefone inválido.");
		}
		return digits;
	}

	private String normalizeEmail(String email) {
		if (email == null || email.isBlank()) {
			throw new IllegalArgumentException("E-mail e obrigatorio.");
		}
		return email.trim().toLowerCase();
	}

	private String hash(String value) {
		try {
			var digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(digest);
		} catch (Exception exception) {
			throw new IllegalStateException("Não foi possível gerar hash.", exception);
		}
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}
}
