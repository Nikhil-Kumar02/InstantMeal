package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.entity.FoodEntity;
import com.instantmeal.foodiesApi.io.FoodRequest;
import com.instantmeal.foodiesApi.io.FoodResponse;
import com.instantmeal.foodiesApi.repository.FoodRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
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

@Service
public class FoodServiceImpl implements FoodService {

//    @Autowired
//    private S3Client s3Client;

    @Autowired
    private FoodRepository foodRepository;

//    @Value("${aws.s3.bucketname}")
//    private String bucketName;

//    @Override
//    public String uploadFile(MultipartFile file) {
//        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
//        String key = UUID.randomUUID().toString() + "." +filenameExtension;
//
//        try {
//            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                    .bucket(bucketName)
//                    .key(key)
//                    .acl("public-read")
//                    .contentType(file.getContentType())
//                    .build();
//
//            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
//
//            if(response.sdkHttpResponse().isSuccessful()) {
//                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
//            } else {
//                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed....");
//            }
//        } catch(IOException ex) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while uploading the file....");
//        }
//    }

//    @Override
//    public FoodResponse addFood(FoodRequest request) {
//        FoodEntity newFoodEntity = convertToEntity(request);
//        newFoodEntity = foodRepository.save(newFoodEntity);
//
//        return convertToResponse(newFoodEntity);
//    }

    @Override
    public FoodResponse addFood(FoodRequest request) {

        FoodEntity newFoodEntity = convertToEntity(request);

        newFoodEntity = foodRepository.save(newFoodEntity);

        System.out.println("Saved ID : " + newFoodEntity.getId());

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
        FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException(("Food not found for the id: " + id)));
        return convertToResponse(existingFood);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request) {
        // Check if food exists
        FoodEntity foodEntity = foodRepository.findById(id).orElse(null);
        if (foodEntity == null) {
            return null; // or throw new ResourceNotFoundException("Food not found with id " + id);
        }

        // Update fields from request
        foodEntity.setName(request.getName());
        foodEntity.setDescription(request.getDescription());
        foodEntity.setImageUrl(request.getImageUrl());
        foodEntity.setPrice(request.getPrice());
        foodEntity.setCategory(request.getCategory()); // if category is part of request

        // Save updated entity
        FoodEntity updatedFood = foodRepository.save(foodEntity);

        // Convert to response DTO
        FoodResponse response = new FoodResponse();
        response.setId(updatedFood.getId());
        response.setName(updatedFood.getName());
        response.setDescription(updatedFood.getDescription());
        response.setImageUrl(updatedFood.getImageUrl());
        response.setPrice(updatedFood.getPrice());
        response.setCategory(updatedFood.getCategory());

        return response;
    }



//    @Override
//    public boolean deleteFile(String filename) {
//        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
//                .bucket(bucketName)
//                .key(filename)
//                .build();
//
//        s3Client.deleteObject(deleteObjectRequest);
//        return true;
//    }

//    @Override
//    public void deleteFood(String id) {
//        FoodResponse response = getFood(id);
//        String imageUrl = response.getImageUrl();
//        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
//
//        boolean isFileDeleted = deleteFile(filename);
//
//        if(isFileDeleted) {
//            foodRepository.deleteById(response.getId());
//        }
//    }

    @Override
    public boolean deleteFood(String id) {
        try {
            foodRepository.deleteById(id);
            return true; // deletion succeeded
        } catch (EmptyResultDataAccessException e) {
            return false; // nothing to delete
        }
    }

    @Override
    public long countFoods() {
        return foodRepository.count();
    }

//    @Override
//    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
//        FoodEntity newFoodEntity = convertToEntity(request);
//        String imageUrl = uploadFile(file);
//        newFoodEntity.setImageUrl(imageUrl);
//        newFoodEntity = foodRepository.save(newFoodEntity);
//
//        return convertToResponse(newFoodEntity);
//    }

//    private FoodEntity convertToEntity(FoodRequest request) {
//        return FoodEntity.builder()
//                .name(request.getName())
//                .description(request.getDescription())
//                .category(request.getCategory())
//                .price(request.getPrice())
//                .build();
//    }

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
