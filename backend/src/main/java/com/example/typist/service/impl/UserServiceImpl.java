package com.example.typist.service.impl;

import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.ImageService;
import com.example.typist.service.UserService;
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
    private final ImageService imageService;
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
    public byte[] getUserImage(String id) {
        log.debug("Get account image of the user {}", id);

        Optional<User> optionalUser = userRepository.findById(id);
        if(optionalUser.isEmpty()) {
            log.error("User with id {} doesn't exist", id);
            throw new ResourceNotFoundException("User", "id", id);
        }

        User user = optionalUser.get();
        String imageId = user.getImage();
        if(imageId == null) {
            log.error("User {} doesn't have account image", id);
            throw new ResourceNotFoundException("User doesn't have account image");
        }

        return imageService.loadImage(imageId);
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
