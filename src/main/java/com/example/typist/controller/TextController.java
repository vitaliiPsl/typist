package com.example.typist.controller;

import com.example.typist.payload.TextDto;
import com.example.typist.service.TextService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/text")
public class TextController {
    private final TextService textService;

    @GetMapping
    public TextDto getTestText(
            @RequestParam(value = "count", defaultValue = "300") int count,
            @RequestParam(value = "language", defaultValue = "english") String language
    ) {
        return textService.getRandomWords(count, language);
    }
}
