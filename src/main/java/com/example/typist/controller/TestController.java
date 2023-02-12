package com.example.typist.controller;

import com.example.typist.model.User;
import com.example.typist.payload.TestDto;
import com.example.typist.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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
    public List<TestDto> getTests(@RequestParam(name = "userId") long userId) {
        return testService.getTestsByUseId(userId);
    }
}
