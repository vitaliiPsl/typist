package com.example.typist.service.impl;

import com.example.typist.model.Test;
import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.repository.TestRepository;
import com.example.typist.service.TestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
    public List<TestDto> getTestsByUseId(String userId) {
        log.debug("Get test by id of the user: {}", userId);

        List<Test> tests = testRepository.findByUser_Id(userId);

        return tests.stream().map(this::mapTestToTestDto).collect(Collectors.toList());
    }

    @Override
    public void deleteTests(String userId) {
        log.debug("Delete tests of the user {}", userId);

        testRepository.deleteByUser_Id(userId);
    }

    private TestDto mapTestToTestDto(Test test) {
        return mapper.map(test, TestDto.class);
    }
}
