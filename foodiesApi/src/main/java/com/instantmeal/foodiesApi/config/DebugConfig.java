package com.instantmeal.foodiesApi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DebugConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    CommandLineRunner printMongoUri() {
        return args -> System.out.println("Mongo URI = " + mongoUri);
    }

    @Bean
    CommandLineRunner verify(MongoTemplate mongoTemplate) {
        return args -> {
            System.out.println("Database Name = " +
                    mongoTemplate.getDb().getName());
        };
    }
}
