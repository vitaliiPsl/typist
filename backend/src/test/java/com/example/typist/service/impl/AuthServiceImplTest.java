package com.example.typist.service.impl;

import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.model.User;
import com.example.typist.payload.EmailDto;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.EmailService;
import com.example.typist.service.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    UserRepository userRepository;

    @Mock
    JwtService jwtService;

    @Mock
    EmailService emailService;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    AuthenticationManager authManager;

    @Spy
    ModelMapper mapper;

    @InjectMocks
    AuthServiceImpl authService;

    @Captor
    ArgumentCaptor<User> userCaptor;

    @Captor
    ArgumentCaptor<EmailDto> emailCaptor;

    @Test
    void givenSignUp_whenRegistrationDataIsValid_thenCreateNewUser() {
        // given
        UserDto userDto = UserDto.builder()
                .email("j.doe@mail.com")
                .nickname("j.doe")
                .password("password")
                .build();

        String encodedPassword = "rkep4h1etq8i";

        String emailConfirmationToken = "13te!3@51";
        String template = "email-confirmation";

        // when
        when(userRepository.findByEmail(userDto.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByNickname(userDto.getNickname())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDto.getPassword())).thenReturn(encodedPassword);
        when(userRepository.save(Mockito.any(User.class))).then(returnsFirstArg());
        when(jwtService.createToken(Mockito.any(User.class))).thenReturn(emailConfirmationToken);

        UserDto response = authService.signUp(userDto);

        // then
        verify(userRepository).findByEmail(userDto.getEmail());
        verify(userRepository).findByNickname(userDto.getNickname());
        verify(passwordEncoder).encode(userDto.getPassword());
        verify(jwtService).createToken(Mockito.any(User.class));
        verify(userRepository).save(userCaptor.capture());
        verify(emailService).sendTemplateEmail(emailCaptor.capture());

        User user = userCaptor.getValue();
        assertThat(user.getEmail(), is(userDto.getEmail()));
        assertThat(user.getNickname(), is(userDto.getNickname()));
        assertThat(user.getPassword(), is(encodedPassword));
        assertThat(user.isEnabled(), is(false));


        EmailDto email = emailCaptor.getValue();
        assertThat(email.getTo(), is(userDto.getEmail()));
        assertThat(email.getTemplate(), is(template));
        assertThat(email.getVariables().containsKey("confirmation_link"), is(true));

        assertThat(response.getNickname(), is(userDto.getNickname()));
        assertThat(response.getEmail(), is(userDto.getEmail()));
    }

    @Test
    void givenSignUp_whenEmailIsTaken_thenThrowException() {
        // given
        UserDto userDto = UserDto.builder().email("j.doe@mail.com").build();

        User otherUser = User.builder().email(userDto.getEmail()).build();

        // when
        when(userRepository.findByEmail(userDto.getEmail())).thenReturn(Optional.of(otherUser));

        // then
        assertThrows(ResourceAlreadyExistException.class, () -> authService.signUp(userDto));
        verify(userRepository).findByEmail(userDto.getEmail());
    }

    @Test
    void givenSignUp_whenNicknameIsTaken_thenThrowException() {
        // given
        UserDto userDto = UserDto.builder().nickname("j.doe").build();

        User otherUser = User.builder().nickname(userDto.getNickname()).build();

        // when
        when(userRepository.findByNickname(userDto.getNickname())).thenReturn(Optional.of(otherUser));

        // then
        assertThrows(ResourceAlreadyExistException.class, () -> authService.signUp(userDto));
        verify(userRepository).findByEmail(userDto.getEmail());
    }

    @Test
    void givenSignIn_whenCredentialsAreValid_thenGenerateJwt() {
        // given
        String email = "j.doe@mail.com";
        String password = "password";
        String jwt = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        SignInRequest request = SignInRequest.builder()
                .email(email)
                .password(password)
                .build();


        Authentication auth = new UsernamePasswordAuthenticationToken(email, password);

        User user = User.builder().id("1234").email("j.doe@mail.com").build();
        Authentication verified = new PreAuthenticatedAuthenticationToken(user, "");

        // when
        when(authManager.authenticate(auth)).thenReturn(verified);
        when(jwtService.createToken(user)).thenReturn(jwt);

        SignInResponse response = authService.signIn(request);

        // then
        verify(authManager).authenticate(auth);
        verify(jwtService).createToken(user);

        assertThat(response.getToken(), is(jwt));
    }

    @Test
    void givenSignIn_whenCredentialsAreInvalid_thenThrowException() {
        // given
        String email = "j.doe@mail.com";
        String password = "password";

        SignInRequest request = SignInRequest.builder().email(email).password(password).build();

        Authentication auth = new UsernamePasswordAuthenticationToken(email, password);

        // when
        when(authManager.authenticate(auth)).thenThrow(new BadCredentialsException("Invalid password"));

        // then
        assertThrows(BadCredentialsException.class, () -> authService.signIn(request));
        verify(authManager).authenticate(auth);
    }


    @Test
    void givenExchangeToken_whenTokenIsValidAndUserExist_thenReturnUserAuthentication() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        String userId = "1234";
        User user = User.builder().id(userId).email("j.doe@mail.com").build();

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Authentication res = authService.exchangeToken(token);

        // then
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);

        assertThat((User) res.getPrincipal(), is(user));
        assertThat((String) res.getCredentials(), is(token));
    }

    @Test
    void givenExchangeToken_whenUserDoesntExist_thenThrowException() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        String userId = "1234";

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () -> authService.exchangeToken(token));
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);
    }

    @Test
    void givenExchangeToken_whenTokenIsInvalid_thenThrowException() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        // when
        when(jwtService.decodeToken(token)).thenThrow(new RuntimeException());

        // then
        assertThrows(RuntimeException.class, () -> authService.exchangeToken(token));
        verify(jwtService).decodeToken(token);
    }
}