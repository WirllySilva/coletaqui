package br.com.coletaqui.backend.user.address;

import br.com.coletaqui.backend.user.UserRepository;
import br.com.coletaqui.backend.user.address.dto.UpsertUserAddressRequest;
import br.com.coletaqui.backend.user.address.dto.UserAddressResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAddressService {
	private final UserRepository userRepository;
	private final UserAddressRepository userAddressRepository;

	public UserAddressService(UserRepository userRepository, UserAddressRepository userAddressRepository) {
		this.userRepository = userRepository;
		this.userAddressRepository = userAddressRepository;
	}

	@Transactional(readOnly = true)
	public List<UserAddressResponse> list(UUID userId) {
		return userAddressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId)
			.stream()
			.map(this::toResponse)
			.toList();
	}

	@Transactional
	public UserAddressResponse create(UUID userId, UpsertUserAddressRequest request) {
		var user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

		var address = new UserAddress();
		address.setUser(user);
		apply(address, request);

		if (request.defaultAddress() || userAddressRepository.countByUserId(userId) == 0) {
			clearDefaultAddress(userId);
			address.setDefaultAddress(true);
		}

		return toResponse(userAddressRepository.save(address));
	}

	@Transactional
	public UserAddressResponse update(UUID userId, UUID addressId, UpsertUserAddressRequest request) {
		var address = userAddressRepository.findByIdAndUserId(addressId, userId)
			.orElseThrow(() -> new IllegalArgumentException("Endereco nao encontrado."));

		apply(address, request);

		if (request.defaultAddress()) {
			clearDefaultAddress(userId);
			address.setDefaultAddress(true);
		}

		return toResponse(address);
	}

	@Transactional
	public void delete(UUID userId, UUID addressId) {
		var address = userAddressRepository.findByIdAndUserId(addressId, userId)
			.orElseThrow(() -> new IllegalArgumentException("Endereco nao encontrado."));
		var wasDefault = address.isDefaultAddress();

		userAddressRepository.delete(address);
		userAddressRepository.flush();

		if (wasDefault) {
			userAddressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId)
				.stream()
				.findFirst()
				.ifPresent(nextAddress -> nextAddress.setDefaultAddress(true));
		}
	}

	private void apply(UserAddress address, UpsertUserAddressRequest request) {
		address.setLabel(required(request.label()));
		address.setStreet(required(request.street()));
		address.setNumber(blankToNull(request.number()));
		address.setComplement(blankToNull(request.complement()));
		address.setNeighborhood(required(request.neighborhood()));
		address.setCity(required(request.city()));
		address.setState(required(request.state()).toUpperCase());
		address.setZipCode(blankToNull(request.zipCode()));
		address.setLatitude(request.latitude());
		address.setLongitude(request.longitude());
		address.setDefaultAddress(request.defaultAddress());
	}

	private void clearDefaultAddress(UUID userId) {
		userAddressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId)
			.forEach(address -> address.setDefaultAddress(false));
	}

	private UserAddressResponse toResponse(UserAddress address) {
		return new UserAddressResponse(
			address.getId(),
			address.getLabel(),
			address.getStreet(),
			address.getNumber(),
			address.getComplement(),
			address.getNeighborhood(),
			address.getCity(),
			address.getState(),
			address.getZipCode(),
			address.getLatitude(),
			address.getLongitude(),
			address.isDefaultAddress(),
			address.getCreatedAt(),
			address.getUpdatedAt()
		);
	}

	private String required(String value) {
		return value.trim();
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
