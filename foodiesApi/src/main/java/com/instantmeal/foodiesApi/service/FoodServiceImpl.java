package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.entity.FoodEntity;
import com.instantmeal.foodiesApi.io.FoodRequest;
import com.instantmeal.foodiesApi.io.FoodResponse;
import com.instantmeal.foodiesApi.repository.FoodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FoodServiceImpl implements FoodService {

    @Autowired(required = false)
    private S3Client s3Client;

    @Autowired
    private FoodRepository foodRepository;

    @Value("${aws.s3.bucketname:}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        if (s3Client == null || bucketName == null || bucketName.trim().isEmpty() || bucketName.startsWith("${")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "S3 file upload is not configured on the server. Please enter an image URL instead.");
        }
        
        String originalName = file.getOriginalFilename();
        String filenameExtension = "";
        if (originalName != null && originalName.contains(".")) {
            filenameExtension = originalName.substring(originalName.lastIndexOf(".") + 1);
        } else {
            filenameExtension = "jpg";
        }
        
        String key = UUID.randomUUID().toString() + "." + filenameExtension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if (response.sdkHttpResponse().isSuccessful()) {
                String region = s3Client.serviceClientConfiguration().region().id();
                return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed.");
            }
        } catch (IOException ex) {
            log.error("Error reading upload file: ", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while uploading the file.");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request) {
        FoodEntity newFoodEntity = convertToEntity(request);
        newFoodEntity = foodRepository.save(newFoodEntity);
        log.info("Saved food item with ID: {}", newFoodEntity.getId());
        return convertToResponse(newFoodEntity);
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadFile(file);
            newFoodEntity.setImageUrl(imageUrl);
        }
        newFoodEntity = foodRepository.save(newFoodEntity);
        log.info("Saved food item with uploaded file, ID: {}", newFoodEntity.getId());
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public FoodResponse getFood(String id) {
        FoodEntity existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found for the id: " + id));
        return convertToResponse(existingFood);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request) {
        FoodEntity foodEntity = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found with id " + id));

        foodEntity.setName(request.getName());
        foodEntity.setDescription(request.getDescription());
        foodEntity.setPrice(request.getPrice());
        foodEntity.setCategory(request.getCategory());
        
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            foodEntity.setImageUrl(request.getImageUrl());
        }

        FoodEntity updatedFood = foodRepository.save(foodEntity);
        return convertToResponse(updatedFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        if (s3Client == null || bucketName == null || bucketName.trim().isEmpty() || bucketName.startsWith("${")) {
            return false;
        }
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", filename, e);
            return false;
        }
    }

    @Override
    public boolean deleteFood(String id) {
        try {
            FoodEntity existingFood = foodRepository.findById(id).orElse(null);
            if (existingFood == null) {
                return false;
            }
            
            String imageUrl = existingFood.getImageUrl();
            if (imageUrl != null && bucketName != null && !bucketName.trim().isEmpty() && imageUrl.contains(bucketName)) {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                deleteFile(filename);
            }
            
            foodRepository.deleteById(id);
            log.info("Deleted food item with ID: {}", id);
            return true;
        } catch (Exception e) {
            log.error("Failed to delete food item: {}", id, e);
            return false;
        }
    }

    @Override
    public long countFoods() {
        return foodRepository.count();
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}
