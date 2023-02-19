package com.example.typist.service.impl;

import com.example.typist.model.Test;
import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.repository.TestRepository;
import com.example.typist.service.TestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class TestServiceImpl implements TestService {
    private final TestRepository testRepository;
    private final ModelMapper mapper;

    @Override
    public TestDto saveTest(TestDto testDto, User actor) {
        log.debug("Save test {} taken by user {}", testDto, actor);

        Test test = Test.builder()
                .user(actor)
                .wpm(testDto.getWpm())
                .rawWpm(testDto.getRawWpm())
                .accuracy(testDto.getAccuracy())
                .duration(testDto.getDuration())
                .timestamp(LocalDateTime.now())
                .build();

        test = testRepository.save(test);
        return mapTestToTestDto(test);
    }

    @Override
    public void deleteTests(String userId) {
        log.debug("Delete tests of the user {}", userId);

        testRepository.deleteByUser_Id(userId);
    }

    @Override
    public List<TestDto> getTests(String userId, LocalDateTime after, int limit, String sortBy, Sort.Direction direction) {
        log.debug("Get test. User id: {}. After timestamp: {}. Limit: {}", userId, after, limit);

        if (limit < 0) {
            log.error("Invalid limit argument: {}.", limit);
            throw new IllegalStateException("Limit must be greater or equal to 0");
        }

        PageRequest pageRequest = limit == 0 ? PageRequest.ofSize(Integer.MAX_VALUE) : PageRequest.ofSize(limit);
        pageRequest = pageRequest.withSort(direction, sortBy);

        List<Test> tests;
        if (userId == null && after == null) {
            tests = testRepository.findAll(pageRequest).toList();
        } else if (after == null) {
            tests = findByUserId(userId, pageRequest);
        } else if (userId == null) {
            tests = findByTimestampAfter(after, pageRequest);
        } else {
            tests = findByUserIdAndTimestampAfter(userId, after, pageRequest);
        }

        return tests.stream().map(this::mapTestToTestDto).collect(Collectors.toList());
    }

    private List<Test> findByUserIdAndTimestampAfter(String userId, LocalDateTime after, Pageable pageable) {
        log.debug("Find by user id {} and timestamp after {} with pagination: {}", userId, after, pageable);

        return testRepository.findByUser_IdAndTimestampAfter(userId, after, pageable);
    }

    private List<Test> findByUserId(String userId, Pageable pageable) {
        log.debug("Find by user id {} with pagination: {}", userId, pageable);

        return testRepository.findByUser_Id(userId, pageable);
    }

    private List<Test> findByTimestampAfter(LocalDateTime after, Pageable pageable) {
        log.debug("Find by timestamp after {} with pagination: {}", after, pageable);

        return testRepository.findByTimestampAfter(after, pageable);
    }

    private TestDto mapTestToTestDto(Test test) {
        return mapper.map(test, TestDto.class);
    }
}
