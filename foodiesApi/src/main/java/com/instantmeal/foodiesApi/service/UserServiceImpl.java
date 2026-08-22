package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.entity.UserEntity;
import com.instantmeal.foodiesApi.exception.EmailAlreadyExistsException;
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