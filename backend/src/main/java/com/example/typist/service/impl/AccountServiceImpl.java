package com.example.typist.service.impl;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final ModelMapper mapper;

    @Override
    public UserDto getAuthenticatedUser(User user) {
        log.debug("Get authenticated user: {}", user);

        return mapUserToUserDto(user);
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
