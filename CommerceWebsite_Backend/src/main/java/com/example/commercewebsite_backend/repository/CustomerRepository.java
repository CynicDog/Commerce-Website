package com.example.commercewebsite_backend.repository;

import com.example.commercewebsite_backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
