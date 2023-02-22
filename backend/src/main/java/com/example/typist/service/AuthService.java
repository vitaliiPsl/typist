package com.example.typist.service;

import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

/**
 * Authentication service
 */
public interface AuthService {
    /**
     * Authenticate the user with given credentials
     *
     * @param request credentials of the user
     * @return sign in response that contains the JWT token
     */
    SignInResponse signIn(SignInRequest request);

    /**
     * Register a new user
     *
     * @param userDto user to register
     * @return registered user
     */
    UserDto signUp(UserDto userDto);

    /**
     * Confirm email address
     *
     * @param token confirmation token
     */
    ResponseEntity<Void> confirmEmail(String token);

    /**
     * Exchange jwt token for user authentication
     *
     * @param token jwt token to exchange
     * @return authentication object that contains user to whom token belongs
     */
    Authentication exchangeToken(String token);
}
