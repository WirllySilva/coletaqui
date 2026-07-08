package br.com.coletaqui.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
	private final String localUploadDir;

	public StaticResourceConfig(@Value("${app.upload.local-dir:uploads/tree-plantings}") String localUploadDir) {
		this.localUploadDir = localUploadDir;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/uploads/tree-plantings/**")
			.addResourceLocations("file:" + java.nio.file.Path.of(localUploadDir).toAbsolutePath().normalize() + "/");
	}
}
