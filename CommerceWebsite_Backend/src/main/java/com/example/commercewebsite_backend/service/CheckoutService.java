package com.example.commercewebsite_backend.service;

import com.example.commercewebsite_backend.dto.PaymentInfo;
import com.example.commercewebsite_backend.dto.Purchase;
import com.example.commercewebsite_backend.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
