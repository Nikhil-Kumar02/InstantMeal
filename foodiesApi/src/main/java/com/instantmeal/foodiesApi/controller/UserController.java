package com.instantmeal.foodiesApi.controller;

import com.instantmeal.foodiesApi.entity.UserEntity;
import com.instantmeal.foodiesApi.io.UserProfileUpdateRequest;
import com.instantmeal.foodiesApi.io.UserRequest;
import com.instantmeal.foodiesApi.io.UserResponse;
import com.instantmeal.foodiesApi.repository.UserRepository;
import com.instantmeal.foodiesApi.service.AppUserDetailsService;
import com.instantmeal.foodiesApi.service.UserService;
import com.instantmeal.foodiesApi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AppUserDetailsService userDetailsService;

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

    @PutMapping("/users/me")
    public UserProfileUpdateResponse updateCurrentUser(
            @Valid @RequestBody UserProfileUpdateRequest request) {

        UserResponse updatedUser =
                userService.updateProfile(request);

        var userDetails =
                userDetailsService.loadUserByUsername(
                        updatedUser.getEmail()
                );

        String newToken =
                jwtUtil.generateToken(userDetails);

        return new UserProfileUpdateResponse(
                updatedUser,
                newToken
        );
    }

    public record UserProfileResponse(
            String id,
            String name,
            String email,
            List<String> roles
    ) {}

    public record UserProfileUpdateResponse(
            UserResponse user,
            String token
    ) {}
}