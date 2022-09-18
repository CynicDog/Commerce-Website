package com.example.commercewebsite_backend.dto;

import lombok.Data;

@Data
public class PaymentInfo {

    // Stripe uses the lowest denomination of a currency
    private int amount;
    private String currency;
}
