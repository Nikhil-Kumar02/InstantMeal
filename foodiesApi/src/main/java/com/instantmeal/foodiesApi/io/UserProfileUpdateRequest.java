package com.instantmeal.foodiesApi.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserProfileUpdateRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email")
        String email,

        String currentPassword,

        String newPassword
) {
}