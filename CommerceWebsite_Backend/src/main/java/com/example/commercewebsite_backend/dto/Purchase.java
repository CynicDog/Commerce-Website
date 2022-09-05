package com.example.commercewebsite_backend.dto;

import com.example.commercewebsite_backend.domain.Address;
import com.example.commercewebsite_backend.domain.Customer;
import com.example.commercewebsite_backend.domain.Order;
import com.example.commercewebsite_backend.domain.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
