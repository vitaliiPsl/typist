package com.example.typist.repository;

import com.example.typist.model.Test;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestRepository extends MongoRepository<Test, String> {
    List<Test> findByUser_Id(String userId, Pageable pageable);

    List<Test> findByTimestampAfter(LocalDateTime timestamp, Pageable pageable);

    List<Test> findByUser_IdAndTimestampAfter(String userId, LocalDateTime timestamp, Pageable pageable);

    void deleteByUser_Id(String userId);
}
