package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.io.CartRequest;
import com.instantmeal.foodiesApi.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
