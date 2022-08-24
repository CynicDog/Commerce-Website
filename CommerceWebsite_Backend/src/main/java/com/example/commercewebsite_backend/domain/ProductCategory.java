package com.example.commercewebsite_backend.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
@Table(name = "product_category")
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    // A category has many products
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    @Column(name = "products")
    private Set<Product> products;
}
