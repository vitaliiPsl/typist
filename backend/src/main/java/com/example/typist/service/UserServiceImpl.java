package com.example.typist.service;

import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public UserDto getUserById(String id) {
        log.debug("Get user by id {}", id);

        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()) {
            log.error("User with id {} doesn't exist", id);
            throw new ResourceNotFoundException("User", "id", id);
        }

        return mapUserToUserDto(user.get());
    }

    @Override
    public List<UserDto> getUsersByNickname(String nickname) {
        log.debug("Get users by nickname {}", nickname);

        List<User> users = userRepository.findByNicknameContainingIgnoreCase(nickname);

        return users.stream().map(this::mapUserToUserDto).collect(Collectors.toList());
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
