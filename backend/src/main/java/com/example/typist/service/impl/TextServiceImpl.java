package com.example.typist.service.impl;

import com.example.typist.payload.TextDto;
import com.example.typist.service.TextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TextServiceImpl implements TextService {

    private final ResourceLoader resourceLoader;

    @Value("${words.path}")
    private String wordsPath;

    @Value("${words.min-count-per-request}")
    private int minWordsCountPerRequest;

    @Value("${words.max-count-per-request}")
    private int maxWordsCountPerRequest;

    @Override
    public TextDto getRandomWords(int count, String language) {
        log.debug("Get {} random {} words", count, language);

        if (count < minWordsCountPerRequest || count > maxWordsCountPerRequest) {
            log.error("Requested invalid number of words: {}. Must be between {} and {}", count, minWordsCountPerRequest, maxWordsCountPerRequest);
            throw new IllegalStateException(
                    String.format("Invalid requested words count. Min words per request: %s. Max words per request: %s", minWordsCountPerRequest, maxWordsCountPerRequest)
            );
        }

        // read words from file
        List<String> words = loadWords(wordsPath, language);

        // shuffle
        Collections.shuffle(words);

        // get requested number
        List<String> sublist = words.subList(0, count);

        return TextDto.builder()
                .count(count)
                .language(language)
                .words(sublist)
                .build();
    }

    private List<String> loadWords(String path, String language) {
        log.debug("Read {} words from: {}", language, path);

        // build resource path
        Path resourcePath = Path.of(path, language);

        // check if resource exist
        Resource resource = resourceLoader.getResource("classpath:" + resourcePath);
        if (!resource.exists()) {
            log.error("Resource {} doesn't exist", resourcePath);
            throw new IllegalStateException("Couldn't load words in " + language);
        }

        return loadWords(resource);
    }

    private List<String> loadWords(Resource resource) {
        try {
            return Files.readAllLines(resource.getFile().toPath());
        } catch (IOException e) {
            log.error("Exception while loading words", e);
            throw new IllegalStateException("Couldn't load words", e);
        }
    }
}
