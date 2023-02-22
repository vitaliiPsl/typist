package com.example.typist.service;

import com.example.typist.model.User;

/**
 * Jwt service
 */
public interface JwtService {

    /**
     * Build jwt token for given principal
     *
     * @param user subject of the token
     * @return jwt token
     */
    String createToken(User user);

    /**
     * Build jwt token for given principal
     *
     * @param user              subject of the token
     * @param expirationTimeMin expiration time in minutes
     * @return jwt token
     */
    String createToken(User user, long expirationTimeMin);

    /**
     * Decode jwt token
     *
     * @param token jwt token
     * @return id of the subject user
     */
    String decodeToken(String token);
}
