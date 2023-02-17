package com.example.typist.repository;

import com.example.typist.model.Test;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends MongoRepository<Test, String> {
    List<Test> findByUser_Id(String userId);

    void deleteByUser_Id(String userId);
}
