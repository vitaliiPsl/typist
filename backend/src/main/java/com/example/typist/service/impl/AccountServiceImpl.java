package com.example.typist.service.impl;

import com.example.typist.exception.ForbiddenException;
import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.payload.account.ChangePasswordRequest;
import com.example.typist.payload.account.DeleteAccountRequest;
import com.example.typist.payload.account.DeleteTestsRequest;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.AccountService;
import com.example.typist.service.ImageService;
import com.example.typist.service.TestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final UserRepository userRepository;

    private final TestService testService;
    private final ImageService imageService;

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

        // verify password
        verifyPassword(request.getPassword(), actor.getPassword());

        String requestedNickname = request.getNickname();
        Optional<User> user = userRepository.findByNickname(requestedNickname);
        if (user.isPresent()) {
            log.error("Nickname {} is already taken", requestedNickname);
            throw new ResourceAlreadyExistException("Nickname is already taken");
        }

        actor.setNickname(requestedNickname);
        actor = userRepository.save(actor);

        return mapUserToUserDto(actor);
    }

    @Override
    public UserDto changePassword(ChangePasswordRequest request, User actor) {
        log.debug("Change password of the user {}", actor.getId());

        // verify password
        verifyPassword(request.getOldPassword(), actor.getPassword());

        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        actor.setPassword(encodedNewPassword);

        actor = userRepository.save(actor);

        return mapUserToUserDto(actor);
    }

    @Override
    public void deleteAccount(DeleteAccountRequest request, User actor) {
        log.debug("Delete account of the user {}", actor.getId());

        // verify password
        verifyPassword(request.getPassword(), actor.getPassword());

        // delete user
        userRepository.delete(actor);

        // delete tests
        testService.deleteTests(actor.getId());

        // delete account image
        if (actor.getImage() != null) {
            imageService.deleteImage(actor.getImage());
        }
    }

    @Override
    public void deleteTests(DeleteTestsRequest request, User actor) {
        log.debug("Delete tests of the user {}", actor);

        // verify password
        verifyPassword(request.getPassword(), actor.getPassword());

        // delete tests
        testService.deleteTests(actor.getId());
    }

    @Override
    public UserDto saveProfileImage(MultipartFile image, User actor) {
        log.debug("Save profile image of user {}", actor);

        // delete existing image
        if(actor.getImage() != null) {
            imageService.deleteImage(actor.getImage());
        }

        // save image
        String imageId = imageService.saveImage(image);

        // update image reference
        actor.setImage(imageId);
        actor = userRepository.save(actor);

        return mapUserToUserDto(actor);
    }

    private void verifyPassword(String requestPassword, String actualPassword) {
        if (!passwordEncoder.matches(requestPassword, actualPassword)) {
            log.error("Incorrect password");
            throw new ForbiddenException("Incorrect password");
        }
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
