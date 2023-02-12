package com.example.typist.service;

import com.example.typist.payload.UserDto;

import java.util.List;

public interface UserService {

    /**
     * Get user by id
     *
     * @param id id of the user
     * @return retrieved user
     */
    UserDto getUserById(long id);

    /**
     * Get users with given nickname
     *
     * @param nickname nickname
     * @return list of the users with given
     */
    List<UserDto> getUsersByNickname(String nickname);
}
