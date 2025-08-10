package com.ablens.ticket_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/**
 * Configuration CORS pour permettre les requêtes cross-origin
 * Autorise le frontend React à communiquer avec le backend Spring Boot
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configure les règles CORS pour les endpoints API
     * Autorise les requêtes depuis les ports de développement React
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000") // Ports de développement React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes HTTP autorisées
                .allowedHeaders("*") // Tous les headers autorisés
                .allowCredentials(true) // Autorise l'envoi de cookies/tokens
                .maxAge(3600); // Cache les pre-flight requests pendant 1 heure
    }

    /**
     * Bean Spring pour la configuration CORS avancée
     * Utilisé par Spring Security pour la gestion des requêtes cross-origin
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); // Frontend React
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Méthodes autorisées
        configuration.setAllowedHeaders(Arrays.asList("*")); // Tous les headers
        configuration.setAllowCredentials(true); // Autorise les credentials
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); // Applique aux endpoints API
        return source;
    }
}
