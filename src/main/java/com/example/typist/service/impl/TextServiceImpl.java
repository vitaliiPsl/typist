package com.example.typist.service.impl;

import com.example.typist.payload.TextDto;
import com.example.typist.service.TextService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class TextServiceImpl implements TextService {

    @Value("${words.default-file}")
    private String wordsFile;


    @Value("${words.min-count-per-request}")
    private int minWordsCountPerRequest;

    @Value("${words.max-count-per-request}")
    private int maxWordsCountPerRequest;

    @Override
    public TextDto getRandomWords(int count) {
        log.debug("Get {} random words", count);

        if (count < minWordsCountPerRequest || count > maxWordsCountPerRequest) {
            log.error("Requested invalid number of words: {}. Must be between {} and {}", count, minWordsCountPerRequest, maxWordsCountPerRequest);
            throw new IllegalStateException(
                    String.format("Invalid requested words count. Min words per request: %s. Max words per request: %s", minWordsCountPerRequest, maxWordsCountPerRequest)
            );
        }

        // read words from file
        List<String> words = loadWords(wordsFile);

        // shuffle
        Collections.shuffle(words);

        // get requested number
        List<String> sublist = words.subList(0, count);

        return new TextDto(count, sublist);
    }

    private List<String> loadWords(String file) {
        log.debug("Read words from: {}", file);

        try {
            File resource = new ClassPathResource(file).getFile();

            return Files.readAllLines(resource.toPath());
        } catch (IOException e) {
            log.error("Exception while loading words from {}", file, e);
            throw new IllegalStateException("Couldn't load words", e);
        }
    }

}
