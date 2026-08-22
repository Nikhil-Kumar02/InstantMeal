package com.instantmeal.foodiesApi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instantmeal.foodiesApi.io.FoodRequest;
import com.instantmeal.foodiesApi.io.FoodResponse;
import com.instantmeal.foodiesApi.service.FoodService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public FoodResponse addFood(@RequestBody @Valid FoodRequest request) {
        return foodService.addFood(request);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FoodResponse addFoodWithUpload(
            @RequestPart("food") String foodString,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request;
        try {
            request = objectMapper.readValue(foodString, FoodRequest.class);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format for food data.");
        }

        // Validate the deserialized object
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food name is required");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food description is required");
        }
        if (request.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be greater than zero");
        }
        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }

        return foodService.addFood(request, file);
    }

    @GetMapping
    public List<FoodResponse> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse getFood(@PathVariable String id) {
        return foodService.getFood(id);
    }

    @PutMapping("/{id}")
    public FoodResponse updateFood(@PathVariable String id, @RequestBody @Valid FoodRequest request) {
        return foodService.updateFood(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteFood(@PathVariable String id) {
        return foodService.deleteFood(id);
    }
}
