package com.example.commercewebsite_backend.configuration;

import com.example.commercewebsite_backend.domain.Country;
import com.example.commercewebsite_backend.domain.Product;
import com.example.commercewebsite_backend.domain.ProductCategory;
import com.example.commercewebsite_backend.domain.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.ExposureConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import javax.persistence.metamodel.EntityType;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public RestConfig(EntityManager _entityManager) {
        entityManager = _entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

        // Set Read-Only configuration by disabling basic methods other than `HttpMethod.GET`
        HttpMethod[] unsupportedActions = {
                HttpMethod.DELETE,
                HttpMethod.POST,
                HttpMethod.PUT
        };

//        disableHttpMethods(Product.class, config, unsupportedActions);
//        disableHttpMethods(ProductCategory.class, config, unsupportedActions);
//        disableHttpMethods(Country.class, config, unsupportedActions);
//        disableHttpMethods(State.class, config, unsupportedActions);
        List.of(Product.class,
                ProductCategory.class,
                Country.class,
                State.class).forEach(_class -> disableHttpMethods(_class, config, unsupportedActions));

        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entity: entities) { entityClasses.add(entity.getJavaType()); }
        Class[] domainType = entityClasses.toArray(new Class[0]);

        config.exposeIdsFor(domainType);
    }

    private void disableHttpMethods(Class class_, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(class_)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}

