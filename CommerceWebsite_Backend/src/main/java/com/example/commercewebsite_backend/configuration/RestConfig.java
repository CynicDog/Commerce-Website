package com.example.commercewebsite_backend.configuration;

import com.example.commercewebsite_backend.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

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
                HttpMethod.PUT,
                HttpMethod.PATCH
        };

        List.of(Product.class,
                ProductCategory.class,
                Country.class,
                State.class,
                Order.class).forEach(_class -> disableHttpMethods(_class, config, unsupportedActions));

        exposeIds(config);

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
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

