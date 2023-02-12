package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.TestDto;

public interface TestService {

    /**
     * Save given test
     *
     * @param testDto test to save
     * @param actor   authenticated user
     * @return saved test
     */
    TestDto saveTest(TestDto testDto, User actor);
}
