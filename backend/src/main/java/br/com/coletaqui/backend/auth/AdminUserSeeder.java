package br.com.coletaqui.backend.auth;

import br.com.coletaqui.backend.user.User;
import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.UserRole;
import br.com.coletaqui.backend.user.UserStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminUserSeeder implements CommandLineRunner {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final String email;
	private final String password;
	private final String name;
	private final String phone;

	public AdminUserSeeder(
		UserRepository userRepository,
		PasswordEncoder passwordEncoder,
		@Value("${app.admin.email:admin@coletaqui.local}") String email,
		@Value("${app.admin.password:admin123}") String password,
		@Value("${app.admin.name:Administrador Coletaqui}") String name,
		@Value("${app.admin.phone:00000000000}") String phone
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.email = email;
		this.password = password;
		this.name = name;
		this.phone = phone;
	}

	@Override
	@Transactional
	public void run(String... args) {
		var normalizedEmail = email.trim().toLowerCase();
		var admin = userRepository.findByEmailIgnoreCase(normalizedEmail).orElseGet(this::newAdmin);

		admin.setEmail(normalizedEmail);
		admin.setRole(UserRole.ADMIN);
		admin.setStatus(UserStatus.ACTIVE);
		admin.setProfileComplete(true);

		if (isBlank(admin.getName())) {
			admin.setName(name);
		}

		if (isBlank(admin.getPasswordHash())) {
			admin.setPasswordHash(passwordEncoder.encode(password));
		}

		userRepository.save(admin);
	}

	private User newAdmin() {
		var admin = new User();
		admin.setPhone(phone);
		admin.setName(name);
		return admin;
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}
}
