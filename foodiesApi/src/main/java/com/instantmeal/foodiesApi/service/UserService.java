package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.io.UserRequest;
import com.instantmeal.foodiesApi.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
