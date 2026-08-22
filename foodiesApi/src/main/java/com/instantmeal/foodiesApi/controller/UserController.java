package com.instantmeal.foodiesApi.controller;

import com.instantmeal.foodiesApi.io.UserRequest;
import com.instantmeal.foodiesApi.io.UserResponse;
import com.instantmeal.foodiesApi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody @jakarta.validation.Valid UserRequest request) {
        return userService.registerUser(request);
    }

    @GetMapping("/users/me")
    public UserResponse getProfile() {
        return userService.getProfile();
    }
}
