package com.instantmeal.foodiesApi.controller;

import com.instantmeal.foodiesApi.entity.UserEntity;
import com.instantmeal.foodiesApi.io.UserRequest;
import com.instantmeal.foodiesApi.io.UserResponse;
import com.instantmeal.foodiesApi.repository.UserRepository;
import com.instantmeal.foodiesApi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request) {
        return userService.registerUser(request);
    }

    @GetMapping("/users/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {

        UserEntity user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole();

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                List.of("ROLE_" + role)
        );
    }

    public record UserProfileResponse(
            String id,
            String name,
            String email,
            List<String> roles
    ) {}
}