package com.instantmeal.foodiesApi.config;

import com.instantmeal.foodiesApi.entity.UserEntity;
import com.instantmeal.foodiesApi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createAdmin() {

        return args -> {

            String adminEmail = "admin@instantmeal.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                UserEntity admin = UserEntity.builder()
                        .name("InstantMeal Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("Admin@123"))
                        .role("ADMIN")
                        .build();

                userRepository.save(admin);

                System.out.println("======================================");
                System.out.println("InstantMeal Admin created successfully");
                System.out.println("Email: admin@instantmeal.com");
                System.out.println("Password: Admin@123");
                System.out.println("======================================");
            }
        };
    }
}