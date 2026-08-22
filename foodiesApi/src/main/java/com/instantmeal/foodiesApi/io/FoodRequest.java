package com.instantmeal.foodiesApi.io;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodRequest {

    @NotBlank(message = "Food name is required")
    private String name;

    @NotBlank(message = "Food description is required")
    private String description;

    @Positive(message = "Price must be greater than zero")
    private double price;

    @NotBlank(message = "Category is required")
    private String category;

    private String imageUrl;
}
