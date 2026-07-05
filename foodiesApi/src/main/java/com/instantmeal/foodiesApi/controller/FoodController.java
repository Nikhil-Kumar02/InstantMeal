package com.instantmeal.foodiesApi.controller;

import com.instantmeal.foodiesApi.io.FoodRequest;
import com.instantmeal.foodiesApi.io.FoodResponse;
import com.instantmeal.foodiesApi.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    public FoodResponse addFood(@RequestBody FoodRequest request) {
        return foodService.addFood(request);
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
    public FoodResponse updateFood(@PathVariable String id, @RequestBody FoodRequest request) {
        return foodService.updateFood(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteFood(@PathVariable String id) {
        return foodService.deleteFood(id);
    }

//    @GetMapping("/count")
//    public long count() {
//        return foodService.countFoods();
//    }
//
//    @GetMapping("/db")
//    public String db(MongoTemplate mongoTemplate) {
//        return mongoTemplate.getDb().getName();
//    }

//    @PostMapping
//    public FoodResponse addFood(@RequestPart("food") String foodString, @RequestPart("file") MultipartFile file) {
//        ObjectMapper objectMapper = new ObjectMapper();
//        FoodRequest request = null;
//
//        try {
//            request = objectMapper.readValue(foodString, FoodRequest.class);
//        } catch (Exception ex) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format....");
//        }
//
//        FoodResponse response = foodService.addFood(request, file);
//        return response;
//    }
}
