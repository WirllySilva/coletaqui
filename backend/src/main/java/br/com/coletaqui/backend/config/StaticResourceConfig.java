package br.com.coletaqui.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
	private final String localUploadDir;
	private final String contentImageDir;

	public StaticResourceConfig(
		@Value("${app.upload.local-dir:uploads/tree-plantings}") String localUploadDir,
		@Value("${app.content-image.local-dir:uploads/content-images}") String contentImageDir
	) {
		this.localUploadDir = localUploadDir;
		this.contentImageDir = contentImageDir;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/uploads/tree-plantings/**")
			.addResourceLocations("file:" + java.nio.file.Path.of(localUploadDir).toAbsolutePath().normalize() + "/");
		registry
			.addResourceHandler("/uploads/content-images/**")
			.addResourceLocations("file:" + java.nio.file.Path.of(contentImageDir).toAbsolutePath().normalize() + "/");
	}
}
