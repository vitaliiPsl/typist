package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.TestDto;

import java.util.List;

public interface TestService {

    /**
     * Save given test
     *
     * @param testDto test to save
     * @param actor   authenticated user
     * @return saved test
     */
    TestDto saveTest(TestDto testDto, User actor);

    /**
     * Get test of user with given id
     *
     * @param userId id of the user
     * @return list of retrieved tests
     */
    List<TestDto> getTestsByUseId(String userId);
}
