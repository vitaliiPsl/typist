package com.example.typist.service;

import org.springframework.security.core.Authentication;

/**
 * Jwt service
 */
public interface JwtService {

    /**
     * Build jwt token from the user authentication
     *
     * @param authentication user authentication
     * @return jwt token
     */
    String createToken(Authentication authentication);

    /**
     * Decode jwt token
     *
     * @param token jwt token
     * @return id of the subject user
     */
    String decodeToken(String token);
}
