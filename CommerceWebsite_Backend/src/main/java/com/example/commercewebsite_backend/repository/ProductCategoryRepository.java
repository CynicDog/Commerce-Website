package com.example.commercewebsite_backend.repository;

import com.example.commercewebsite_backend.domain.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel = "productCategory", path = "productCategory")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

}
