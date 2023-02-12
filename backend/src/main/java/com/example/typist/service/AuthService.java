package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import org.springframework.security.core.Authentication;

/**
 * Authentication service
 */
public interface AuthService {
    /**
     * Register a new user
     *
     * @param userDto user to register
     * @return registered user
     */
    UserDto signUp(UserDto userDto);

    /**
     * Authenticate the user with given credentials
     *
     * @param request credentials of the user
     * @return sign in response that contains the JWT token
     */
    SignInResponse signIn(SignInRequest request);

    /**
     * Exchange jwt token for user authentication
     * @param token jwt token to exchange
     * @return authentication object that contains user to whom token belongs
     */
    Authentication exchangeToken(String token);

    /**
     * Maps authenticated user to UserDto
     * @param user authenticated user
     * @return authenticated user dto
     */
    UserDto getAuthenticatedUser(User user);
}

