package com.example.typist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableMongoRepositories
@SpringBootApplication
public class TypistApplication {

    public static void main(String[] args) {
        SpringApplication.run(TypistApplication.class, args);
    }

}
