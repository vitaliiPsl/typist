package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;

/**
 * Account related logic
 */
public interface AccountService {
    /**
     * Maps authenticated user to UserDto
     * @param user authenticated user
     * @return authenticated user dto
     */
    UserDto getAuthenticatedUser(User user);


    /**
     * Change nickname of the user
     *
     * @param request change request
     * @param actor authenticated user
     * @return user dto with updated nickname
     */
    UserDto changeNickname(ChangeNicknameRequest request, User actor);
}
