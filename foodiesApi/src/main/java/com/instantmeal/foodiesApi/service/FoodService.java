package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.io.FoodRequest;
import com.instantmeal.foodiesApi.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

//    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request);

    List<FoodResponse> getAllFoods();

    FoodResponse getFood(String id);

//    boolean deleteFile(String filename);
//    void deleteFood(String id);

    FoodResponse updateFood (String id, FoodRequest request);

    boolean deleteFood(String id);

    long countFoods();
//    FoodResponse addFood(FoodRequest request, MultipartFile file);
}
