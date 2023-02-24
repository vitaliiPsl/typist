package com.example.typist.controller;

import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("api/tests")
public class TestController {
    private final TestService testService;

    @PostMapping
    public TestDto saveTest(@Valid @RequestBody TestDto testDto, @AuthenticationPrincipal User actor) {
        return testService.saveTest(testDto, actor);
    }

    @GetMapping
    public List<TestDto> getTests(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) LocalDateTime after,
            @RequestParam(defaultValue = "0", required = false) int limit,
            @RequestParam(defaultValue = "wpm", required = false) String sortBy,
            @RequestParam(defaultValue = "ASC", required = false) Sort.Direction direction
            ) {
        return testService.getTests(userId, after, limit, sortBy, direction);
    }
}
