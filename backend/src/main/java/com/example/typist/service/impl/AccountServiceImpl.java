package com.example.typist.service.impl;

import com.example.typist.exception.ForbiddenException;
import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper mapper;

    @Override
    public UserDto getAuthenticatedUser(User user) {
        log.debug("Get authenticated user: {}", user);

        return mapUserToUserDto(user);
    }

    @Override
    public UserDto changeNickname(ChangeNicknameRequest request, User actor) {
        log.debug("Change nickname of the user {} to {}", actor.getId(), request.getNickname());

        if(!passwordEncoder.matches(request.getPassword(), actor.getPassword())) {
            log.error("Incorrect password");
            throw new ForbiddenException("Incorrect password");
        }

        String requestedNickname = request.getNickname();
        Optional<User> user = userRepository.findByNickname(requestedNickname);
        if(user.isPresent()) {
            log.error("Nickname {} is already taken", requestedNickname);
            throw new ResourceAlreadyExistException("Nickname is already taken");
        }

        actor.setNickname(requestedNickname);
        return mapUserToUserDto(actor);
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
