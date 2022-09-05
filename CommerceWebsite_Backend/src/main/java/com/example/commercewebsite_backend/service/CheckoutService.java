package com.example.commercewebsite_backend.service;

import com.example.commercewebsite_backend.dto.Purchase;
import com.example.commercewebsite_backend.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
