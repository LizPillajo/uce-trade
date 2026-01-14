package UCE_Trade.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitamos CSRF porque usaremos JWT y es una API REST
            .csrf(AbstractHttpConfigurer::disable)
            // Activamos CORS para que tu React (puerto 5173 o 3000) pueda conectarse
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Configuramos las rutas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // ¡Rutas públicas! (Login/Registro)
                .anyRequest().authenticated() // Lo demás requiere token
            );

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // IMPORTANTE: Aquí pones la URL de tu Frontend
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
