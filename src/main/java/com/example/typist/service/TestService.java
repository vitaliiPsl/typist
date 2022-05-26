package com.example.typist.service;

import com.example.typist.model.entities.Test;
import com.example.typist.model.entities.User;
import com.example.typist.persistence.TestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TestService {
    private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public Test save(Test test) {
        return testRepository.save(test);
    }

    public Optional<Test> getById(long id) {
        return testRepository.findById(id);
    }

    public List<Test> getByUser(User user) {
        return testRepository.findByUser(user);
    }

    public void deleteByUser(User user){
        testRepository.deleteAllByUser(user);
    }

    public List<Test> getTodayTopTests() {
        LocalDateTime todayMidnight = getTodayMidnight();

        List<Test> tests = testRepository.findAllByTestDateBetweenOrderByWpm(todayMidnight, LocalDateTime.now());
        Map<User, Test> userTestMap = getUserTopTest(tests);

        return new ArrayList<>(userTestMap.values());
    }

    private Map<User, Test> getUserTopTest(List<Test> tests) {
        return tests.stream().collect(
                Collectors.toMap(
                        Test::getUser,
                        Function.identity(),
                        (test, existing) -> test.getWpm() > existing.getWpm() ? test : existing
                )
        );
    }

    private LocalDateTime getTodayMidnight() {
        LocalTime midnight = LocalTime.MIDNIGHT;
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        return LocalDateTime.of(today, midnight);
    }
}
