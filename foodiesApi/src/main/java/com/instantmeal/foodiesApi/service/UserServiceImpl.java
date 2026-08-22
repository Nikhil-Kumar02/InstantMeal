package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.entity.UserEntity;
import com.instantmeal.foodiesApi.exception.EmailAlreadyExistsException;
import com.instantmeal.foodiesApi.io.UserProfileUpdateRequest;
import com.instantmeal.foodiesApi.io.UserRequest;
import com.instantmeal.foodiesApi.io.UserResponse;
import com.instantmeal.foodiesApi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(
                    "Email " + request.getEmail() + " is already registered."
            );
        }

        UserEntity newUser = convertToEntity(request);

        newUser = userRepository.save(newUser);

        return convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {

        String loggedInUserEmail =
                authenticationFacade.getAuthentication().getName();

        UserEntity loggedInUser =
                userRepository.findByEmail(loggedInUserEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found")
                        );

        return loggedInUser.getId();
    }

    @Override
    public UserResponse getProfile() {

        String loggedInUserEmail =
                authenticationFacade.getAuthentication().getName();

        UserEntity loggedInUser =
                userRepository.findByEmail(loggedInUserEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found")
                        );

        return convertToResponse(loggedInUser);
    }

    @Override
    public UserResponse updateProfile(UserProfileUpdateRequest request) {

        String loggedInUserEmail =
                authenticationFacade.getAuthentication().getName();

        UserEntity user = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        String requestedName = request.name().trim();
        String requestedEmail = request.email().trim().toLowerCase();

        boolean emailChanged =
                !user.getEmail().equalsIgnoreCase(requestedEmail);

        boolean passwordChanged =
                request.newPassword() != null &&
                        !request.newPassword().isBlank();

        /*
         * Current password is required whenever the user
         * changes email or password.
         */
        if (emailChanged || passwordChanged) {

            if (request.currentPassword() == null ||
                    request.currentPassword().isBlank()) {

                throw new IllegalArgumentException(
                        "Current password is required"
                );
            }

            if (!passwordEncoder.matches(
                    request.currentPassword(),
                    user.getPassword())) {

                throw new IllegalArgumentException(
                        "Current password is incorrect"
                );
            }
        }

        /*
         * Check whether another user already owns
         * the requested email.
         */
        if (emailChanged) {

            userRepository.findByEmail(requestedEmail)
                    .ifPresent(existingUser -> {

                        if (!existingUser.getId().equals(user.getId())) {
                            throw new EmailAlreadyExistsException(
                                    "Email " + requestedEmail +
                                            " is already registered."
                            );
                        }
                    });

            user.setEmail(requestedEmail);
        }

        /*
         * Update name.
         */
        user.setName(requestedName);

        /*
         * Update password only when requested.
         */
        if (passwordChanged) {
            user.setPassword(
                    passwordEncoder.encode(request.newPassword())
            );
        }

        /*
         * IMPORTANT:
         * We deliberately do NOT modify user.getRole().
         */
        UserEntity updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    private UserEntity convertToEntity(UserRequest request) {

        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role("USER")
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser) {

        return UserResponse.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .roles(
                        registeredUser.getRole() == null
                                ? List.of("ROLE_USER")
                                : List.of("ROLE_" + registeredUser.getRole())
                )
                .build();
    }
}