package com.example.typist.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.typist.model.User;
import com.example.typist.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@RequiredArgsConstructor
@Service
public class JwtServiceImpl implements JwtService {
    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.token-expiration-time-min}")
    private long expirationTimeMin;

    @Override
    public String createToken(Authentication authentication) {
        log.debug("Create jwt token for authentication: {}", authentication);

        Algorithm algorithm = Algorithm.HMAC256(secret);

        User user = (User) authentication.getPrincipal();
        String userId = String.valueOf(user.getId());

        Instant expiresAt = getExpirationInstant();

        return JWT.create()
                .withSubject(userId)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
    }

    @Override
    public String decodeToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm).build();

            DecodedJWT decodedToken = verifier.verify(token);

            return decodedToken.getSubject();
        } catch (JWTVerificationException e) {
            log.error("Invalid JWT token: {}", token);
            throw new IllegalStateException("Invalid jwt token");
        } catch (Exception e) {
            log.error("Exception while decoding jwt token");
            throw new IllegalStateException("Exception while decoding jwt token");
        }
    }

    private Instant getExpirationInstant() {
        return LocalDateTime.now()
                .plusMinutes(expirationTimeMin)
                .atZone(ZoneId.systemDefault()).toInstant();
    }
}
