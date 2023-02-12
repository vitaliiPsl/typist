package com.example.typist.service.impl;

import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.AuthService;
import com.example.typist.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final ModelMapper mapper;

    @Override
    public UserDto signUp(UserDto userDto) {
        log.debug("Register new user: {}", userDto);

        // check if email is available
        Optional<User> existing = userRepository.findByEmail(userDto.getEmail());
        if (existing.isPresent()) {
            log.error("Email '{}' is already taken", userDto.getEmail());
            throw new ResourceAlreadyExistException("User", "email", userDto.getEmail());
        }

        // check if nickname is available
        existing = userRepository.findByNickname(userDto.getNickname());
        if (existing.isPresent()) {
            log.error("Nickname '{}' is already taken", userDto.getNickname());
            throw new ResourceAlreadyExistException("User", "nickname", userDto.getNickname());
        }

        // save user
        User user = createUser(userDto);
        userRepository.save(user);

        return mapUserToUserDto(user);
    }

    @Override
    public SignInResponse signIn(SignInRequest request) {
        log.debug("Authenticate user: {}", request.getEmail());

        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        authentication = authManager.authenticate(authentication);

        String token = jwtService.createToken(authentication);
        return new SignInResponse(token);
    }

    @Override
    public Authentication exchangeToken(String token) {
        log.debug("Exchange token");

        Long userId = jwtService.decodeToken(token);

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            log.error("User with id '{}' doesn't exist", userId);
            throw new ResourceNotFoundException("User", "id", userId.toString());
        }

        return new PreAuthenticatedAuthenticationToken(user.get(), token);
    }

    private User createUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        return User.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getNickname())
                .password(encodedPassword)
                .createdAt(LocalDateTime.now())
                .enabled(true)
                .build();
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
