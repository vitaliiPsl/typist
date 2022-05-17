package com.example.typist.service;

import com.example.typist.model.entities.Test;
import com.example.typist.model.entities.User;
import com.example.typist.persistence.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestService {
    private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public Test save(Test test){
        return testRepository.save(test);
    }

    public Optional<Test> getById(long id){
        return testRepository.findById(id);
    }

    public List<Test> getByUser(User user){
        return testRepository.findByUser(user);
    }
}
