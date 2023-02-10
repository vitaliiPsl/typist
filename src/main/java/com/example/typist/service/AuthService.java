package com.example.typist.service;

import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;

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
}

