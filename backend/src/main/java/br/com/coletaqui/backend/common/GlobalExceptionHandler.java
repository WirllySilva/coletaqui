package br.com.coletaqui.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException exception, HttpServletRequest request) {
		return build(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
		var message = exception.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(error -> error.getDefaultMessage())
			.orElse("Requisição inválida.");
		return build(HttpStatus.BAD_REQUEST, message, request);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiError> handleUploadLimit(MaxUploadSizeExceededException exception, HttpServletRequest request) {
		return build(HttpStatus.PAYLOAD_TOO_LARGE, "Foto muito grande. Envie uma imagem com no maximo 10 MB.", request);
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiError> handleIllegalState(IllegalStateException exception, HttpServletRequest request) {
		return build(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
	}

	private ResponseEntity<ApiError> build(HttpStatus status, String message, HttpServletRequest request) {
		return ResponseEntity.status(status).body(new ApiError(
			OffsetDateTime.now(),
			status.value(),
			status.getReasonPhrase(),
			message,
			request.getRequestURI()
		));
	}
}
