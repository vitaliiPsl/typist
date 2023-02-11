package com.example.typist.service;

import com.example.typist.payload.TextDto;

/**
 * Text service. Generates text for tests
 */
public interface TextService {

    /**
     * Get list of random words
     * @param count number of words to return
     * @return WordsDto containing list of random words
     */
    TextDto getRandomWords(int count);
}
