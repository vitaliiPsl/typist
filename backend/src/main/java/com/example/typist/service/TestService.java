package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
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
     * Get list of tests
     *
     * @param userId id of the user
     * @param after test after given date
     * @param limit number of tests to return
     * @param sortBy property to sort by
     * @param direction sort direction
     * @return list of retrieved tests
     */
    List<TestDto> getTests(String userId, LocalDateTime after, int limit, String sortBy, Sort.Direction direction);

    /**
     * Delete tests of given user
     *
     * @param userId id of the user
     */
    void deleteTests(String userId);
}
