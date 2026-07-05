package com.instantmeal.foodiesApi.service;

import com.instantmeal.foodiesApi.io.OrderRequest;
import com.instantmeal.foodiesApi.io.OrderResponse;
import com.razorpay.RazorpayException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface OrderService {
    OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;

    void verifyPayment(Map<String, String> paymentData, String status);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);
}
