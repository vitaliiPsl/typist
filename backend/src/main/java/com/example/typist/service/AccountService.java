package com.example.typist.service;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.payload.account.ChangePasswordRequest;
import com.example.typist.payload.account.DeleteAccountRequest;

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


    /**
     * Change nickname of the user
     *
     * @param request change nickname request
     * @param actor   authenticated user
     * @return user dto with updated nickname
     */
    UserDto changeNickname(ChangeNicknameRequest request, User actor);

    /**
     * Change password of the user
     *
     * @param request change password request
     * @param actor   authenticated user
     * @return user dto with updated password
     */
    UserDto changePassword(ChangePasswordRequest request, User actor);

    /**
     * Delete account of the authenticated user
     *
     * @param request delete account request
     * @param actor   authenticated user
     */
    void deleteAccount(DeleteAccountRequest request, User actor);
}
