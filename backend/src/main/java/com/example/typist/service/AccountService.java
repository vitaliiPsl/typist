package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;

/**
 * Account related logic
 */
public interface AccountService {
    /**
     * Maps authenticated user to UserDto
     *
     * @param user authenticated user
     * @return authenticated user dto
     */
    UserDto getAuthenticatedUser(User user);
}
