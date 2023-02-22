package com.example.typist.service.impl;

import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.model.User;
import com.example.typist.payload.EmailDto;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.AuthService;
import com.example.typist.service.EmailService;
import com.example.typist.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final ModelMapper mapper;

    @Value("${email.confirmation-url}")
    private String confirmationUrl;

    @Value("${email.redirect-url}")
    private String redirectUrl;

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

        // send email confirmation email
        sendConfirmationEmail(user);

        return mapUserToUserDto(user);
    }

    @Override
    public ResponseEntity<Void> confirmEmail(String token) {
        log.debug("Confirm email address. Token: {}", token);

        String userId = jwtService.decodeToken(token);

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            log.error("User with id '{}' doesn't exist", userId);
            throw new ResourceNotFoundException("User", "id", userId);
        }

        User user = optionalUser.get();
        if (user.isEnabled()) {
            log.error("Email address of the user {} is already confirmed", user.getId());
            throw new IllegalStateException("Email is already confirmed");
        }

        // enable user
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
    }

    @Override
    public SignInResponse signIn(SignInRequest request) {
        log.debug("Authenticate user: {}", request.getEmail());

        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        authentication = authManager.authenticate(authentication);

        // authentication principal
        User user = (User) authentication.getPrincipal();

        String token = jwtService.createToken(user);
        return new SignInResponse(token);
    }

    @Override
    public Authentication exchangeToken(String token) {
        log.debug("Exchange token");

        String userId = jwtService.decodeToken(token);

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            log.error("User with id '{}' doesn't exist", userId);
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return new PreAuthenticatedAuthenticationToken(user.get(), token);
    }

    private void sendConfirmationEmail(User user) {
        // confirmation token
        String token = jwtService.createToken(user);

        // confirmation link
        String confirmationLink = confirmationUrl + token;

        Map<String, Object> variables = Map.of(
                "nickname", user.getNickname(),
                "confirmation_link", confirmationLink
        );

        EmailDto email = EmailDto.builder()
                .to(user.getEmail())
                .subject("Email confirmation")
                .template("email-confirmation")
                .variables(variables)
                .build();

        emailService.sendTemplateEmail(email);
    }

    private User createUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        return User.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getNickname())
                .password(encodedPassword)
                .createdAt(LocalDateTime.now())
                .enabled(false)
                .build();
    }

    private UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
