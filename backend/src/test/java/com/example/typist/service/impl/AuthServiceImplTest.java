package com.example.typist.service.impl;

import com.example.typist.exception.ResourceAlreadyExistException;
import com.example.typist.model.User;
import com.example.typist.payload.EmailDto;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.ResendEmailTokenRequest;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

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
    void whenSignUp_givenRegistrationDataIsValid_thenCreateNewUser() {
        // given
        UserDto userDto = UserDto.builder()
                .email("j.doe@mail.com")
                .nickname("j.doe")
                .password("password")
                .build();

        String encodedPassword = "rkep4h1etq8i";

        long tokenExpirationTimeMin = 15;
        String confirmationToken = "13te!3@51";

        String template = "email-confirmation";
        String confirmationUrl = "app:port/api/confirm/";

        ReflectionTestUtils.setField(authService, "emailConfirmationTokenExpirationMin", tokenExpirationTimeMin);
        ReflectionTestUtils.setField(authService, "confirmationUrl", confirmationUrl);

        // when
        when(userRepository.findByEmail(userDto.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByNickname(userDto.getNickname())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDto.getPassword())).thenReturn(encodedPassword);
        when(userRepository.save(Mockito.any(User.class))).then(returnsFirstArg());
        when(jwtService.createToken(Mockito.any(User.class), Mockito.eq(tokenExpirationTimeMin))).thenReturn(confirmationToken);

        UserDto response = authService.signUp(userDto);

        // then
        verify(userRepository).findByEmail(userDto.getEmail());
        verify(userRepository).findByNickname(userDto.getNickname());
        verify(passwordEncoder).encode(userDto.getPassword());
        verify(jwtService).createToken(Mockito.any(User.class), Mockito.eq(tokenExpirationTimeMin));
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
        assertThat(email.getVariables().get("confirmation_link"), is(confirmationUrl + confirmationToken));

        assertThat(response.getNickname(), is(userDto.getNickname()));
        assertThat(response.getEmail(), is(userDto.getEmail()));
    }

    @Test
    void whenSignUp_givenEmailIsTaken_thenThrowException() {
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
    void whenSignUp_givenNicknameIsTaken_thenThrowException() {
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
    void whenConfirmEmail_givenValidRequest_thenEnableUserAndRedirectToLogin() {
        // given
        String token = "ejt1p37t30h";

        String userId = "1234-qwer";
        User user = User.builder().id(userId).enabled(false).build();

        ReflectionTestUtils.setField(authService, "redirectUrl", "http://foo");

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<Void> res = authService.confirmEmail(token);

        // then
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);
        verify(userRepository).save(userCaptor.capture());

        User saved = userCaptor.getValue();
        assertThat(saved.getId(), is(userId));
        assertThat(saved.isEnabled(), is(true));
        assertThat(res.getStatusCode(), is(HttpStatus.FOUND));
    }

    @Test
    void whenConfirmEmail_givenUserIsAlreadyEnabled_thenRedirectToLogin() {
        // given
        String token = "ejt1p37t30h";

        String userId = "1234-qwer";
        User user = User.builder().id(userId).enabled(false).build();

        ReflectionTestUtils.setField(authService, "redirectUrl", "http://foo");

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<Void> res = authService.confirmEmail(token);

        // then
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);

        assertThat(res.getStatusCode(), is(HttpStatus.FOUND));
    }

    @Test
    void whenConfirmEmail_givenUserDoesntExist_thenThrowException() {
        // given
        String token = "ejt1p37t30h";

        String userId = "1234-qwer";

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () -> authService.confirmEmail(token));
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);
    }

    @Test
    void whenResendConfirmationToken_givenRequestIsValid_thenResendToken() {
        // given
        String email = "j.doe@mail.com";
        ResendEmailTokenRequest req = new ResendEmailTokenRequest(email);

        User user = User.builder().image("1234-qwer").email(email).nickname("doe").enabled(false).build();

        long tokenExpirationTimeMin = 15;
        String confirmationToken = "13te!3@51";

        String template = "email-confirmation";
        String confirmationUrl = "app:port/api/confirm/";

        ReflectionTestUtils.setField(authService, "emailConfirmationTokenExpirationMin", tokenExpirationTimeMin);
        ReflectionTestUtils.setField(authService, "confirmationUrl", confirmationUrl);

        // when
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.createToken(user, tokenExpirationTimeMin)).thenReturn(confirmationToken);

        authService.resendEmailConfirmationToken(req);

        // then
        verify(userRepository).findByEmail(email);
        verify(jwtService).createToken(user, tokenExpirationTimeMin);
        verify(emailService).sendTemplateEmail(emailCaptor.capture());

        EmailDto mail = emailCaptor.getValue();
        assertThat(mail.getTo(), is(email));
        assertThat(mail.getTemplate(), is(template));
        assertThat(mail.getVariables().containsKey("confirmation_link"), is(true));
        assertThat(mail.getVariables().get("confirmation_link"), is(confirmationUrl + confirmationToken));
    }

    @Test
    void whenResendConfirmationToken_givenUserIsAlreadyEnabled_thenThrowException() {
        // given
        String email = "j.doe@mail.com";
        ResendEmailTokenRequest req = new ResendEmailTokenRequest(email);

        User user = User.builder().image("1234-qwer").email(email).nickname("doe").enabled(true).build();

        // when
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // then
        assertThrows(RuntimeException.class, () -> authService.resendEmailConfirmationToken(req));
        verify(userRepository).findByEmail(email);
    }

    @Test
    void whenResendConfirmationToken_givenUserDoesntExist_thenThrowException() {
        // given
        String email = "j.doe@mail.com";
        ResendEmailTokenRequest req = new ResendEmailTokenRequest(email);

        // when
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () -> authService.resendEmailConfirmationToken(req));
        verify(userRepository).findByEmail(email);
    }

    @Test
    void whenSignIn_givenCredentialsAreValid_thenGenerateJwt() {
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
    void whenSignIn_givenCredentialsAreInvalid_thenThrowException() {
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
    void whenExchangeToken_givenTokenIsValidAndUserExistAndEnabled_thenReturnUserAuthentication() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        String userId = "1234";
        User user = User.builder().id(userId).email("j.doe@mail.com").enabled(true).build();

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Authentication res = authService.exchangeToken(token);

        // then
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);

        assertThat(res.isAuthenticated(), is(true));
        assertThat((User) res.getPrincipal(), is(user));
        assertThat((String) res.getCredentials(), is(token));
    }

    @Test
    void whenExchangeToken_givenTokenIsValidAndUserExistButNotEnabled_thenReturnUserAuthenticationNotAuthenticated() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        String userId = "1234";
        User user = User.builder().id(userId).email("j.doe@mail.com").enabled(false).build();

        // when
        when(jwtService.decodeToken(token)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Authentication res = authService.exchangeToken(token);

        // then
        verify(jwtService).decodeToken(token);
        verify(userRepository).findById(userId);

        assertThat(res.isAuthenticated(), is(false));
        assertThat((User) res.getPrincipal(), is(user));
        assertThat((String) res.getCredentials(), is(token));
    }

    @Test
    void whenExchangeToken_givenUserDoesntExist_thenThrowException() {
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
    void whenExchangeToken_givenTokenIsInvalid_thenThrowException() {
        // given
        String token = "eyJ0eXA.eyJzdWIi.Ou-2-0gYTg";

        // when
        when(jwtService.decodeToken(token)).thenThrow(new RuntimeException());

        // then
        assertThrows(RuntimeException.class, () -> authService.exchangeToken(token));
        verify(jwtService).decodeToken(token);
    }
}