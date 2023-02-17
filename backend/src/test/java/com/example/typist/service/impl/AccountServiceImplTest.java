package com.example.typist.service.impl;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.payload.account.ChangePasswordRequest;
import com.example.typist.payload.account.DeleteAccountRequest;
import com.example.typist.payload.account.DeleteTestsRequest;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.TestService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {
    @Mock
    UserRepository userRepository;

    @Mock
    TestService testService;

    @Mock
    PasswordEncoder passwordEncoder;

    @Spy
    ModelMapper mapper;

    @InjectMocks
    AccountServiceImpl accountService;

    @Test
    void whenGetAuthenticatedUser_thenReturnMappedUser() {
        // given
        User actor = User.builder().id("1234-qwer").email("j.doe@mail.com").build();

        // when
        UserDto res = accountService.getAuthenticatedUser(actor);

        // then
        verify(mapper).map(actor, UserDto.class);
        assertThat(res.getId(), Matchers.is(actor.getId()));
        assertThat(res.getEmail(), Matchers.is(actor.getEmail()));
    }

    @Test
    void whenChangeNickname_givenValidRequest_thenChangeNickname() {
        // given
        String requestNickname = "john.doe";
        String requestPassword = "password";
        ChangeNicknameRequest changeNicknameRequest = new ChangeNicknameRequest(requestNickname, requestPassword);

        User actor = User.builder().id("1234-qwer").nickname("j.doe").password("password").build();

        // when
        when(passwordEncoder.matches(requestPassword, actor.getPassword())).thenReturn(true);
        when(userRepository.findByNickname(requestNickname)).thenReturn(Optional.empty());
        when(userRepository.save(actor)).then(AdditionalAnswers.returnsFirstArg());

        UserDto res = accountService.changeNickname(changeNicknameRequest, actor);

        // then
        verify(passwordEncoder).matches(requestPassword, actor.getPassword());
        verify(userRepository).findByNickname(requestNickname);
        verify(userRepository).save(actor);

        assertThat(res.getNickname(), Matchers.is(requestNickname));
    }

    @Test
    void whenChangeNickname_givenIncorrectPassword_thenThrowException() {
        // given
        String requestNickname = "john.doe";
        String requestPassword = "password";
        ChangeNicknameRequest changeNicknameRequest = new ChangeNicknameRequest(requestNickname, requestPassword);

        User actor = User.builder().id("1234-qwer").nickname("j.doe").password("password12").build();

        // when
        when(passwordEncoder.matches(requestPassword, actor.getPassword())).thenReturn(false);

        // then
        assertThrows(RuntimeException.class, () -> accountService.changeNickname(changeNicknameRequest, actor));
        verify(passwordEncoder).matches(requestPassword, actor.getPassword());
    }

    @Test
    void whenChangeNickname_givenNicknameIsAlreadyTaken_thenThrowException() {
        // given
        String requestNickname = "john.doe";
        String requestPassword = "password";
        ChangeNicknameRequest changeNicknameRequest = new ChangeNicknameRequest(requestNickname, requestPassword);

        User actor = User.builder().id("1234-qwer").nickname("j.doe").password("password").build();

        // when
        when(passwordEncoder.matches(requestPassword, actor.getPassword())).thenReturn(true);
        when(userRepository.findByNickname(requestNickname)).thenReturn(Optional.of(new User()));

        // then
        assertThrows(RuntimeException.class, () -> accountService.changeNickname(changeNicknameRequest, actor));
        verify(passwordEncoder).matches(requestPassword, actor.getPassword());
        verify(userRepository).findByNickname(requestNickname);
    }

    @Test
    void whenChangePassword_givenValidRequest_thenChangePassword() {
        // given
        String oldPassword = "password";
        String newPassword = "pass11word";
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest(oldPassword, newPassword);

        String encodedNewPassword = "3g12h098#!5";
        String actorOldPassword = "31l#y1pyy5";
        User actor = User.builder().id("1234-qwer").nickname("j.doe").password(actorOldPassword).build();

        // when
        when(passwordEncoder.matches(oldPassword, actorOldPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);
        when(userRepository.save(actor)).then(AdditionalAnswers.returnsFirstArg());

        UserDto res = accountService.changePassword(changePasswordRequest, actor);

        // then
        verify(passwordEncoder).matches(oldPassword, actorOldPassword);
        verify(passwordEncoder).encode(newPassword);
        verify(userRepository).save(actor);

        assertThat(res.getId(), Matchers.is(actor.getId()));
    }

    @Test
    void whenChangePassword_givenIncorrectPassword_thenThrowException() {
        // given
        String oldPassword = "password";
        String newPassword = "pass11word";
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest(oldPassword, newPassword);

        User actor = User.builder().id("1234-qwer").nickname("j.doe").password("31l#y1pyy5").build();

        // when
        when(passwordEncoder.matches(oldPassword, actor.getPassword())).thenReturn(false);

        // then
        assertThrows(RuntimeException.class, () -> accountService.changePassword(changePasswordRequest, actor));
        verify(passwordEncoder).matches(oldPassword, actor.getPassword());
    }

    @Test
    void whenDeleteUser_givenValidRequest_thenDeleteUser() {
        // given
        String requestPassword = "1234-4321";
        DeleteAccountRequest request = new DeleteAccountRequest(requestPassword);

        String actorId = "1234";
        String actorPassword = "1234-4321";
        User actor = User.builder().id(actorId).email("j.doe@mail.com").password(actorPassword).build();

        // when
        when(passwordEncoder.matches(requestPassword, actorPassword)).thenReturn(true);

        accountService.deleteAccount(request, actor);

        // then
        verify(passwordEncoder).matches(requestPassword, actorPassword);
        verify(userRepository).delete(actor);
        verify(testService).deleteTests(actorId);
    }

    @Test
    void whenDeleteUser_givenIncorrectPassword_thenThrowException() {
        // given
        String requestPassword = "1234-4321";
        DeleteAccountRequest request = new DeleteAccountRequest(requestPassword);

        String actorId = "1234";
        String actorPassword = "1234-4321";
        User actor = User.builder().id(actorId).email("j.doe@mail.com").password(actorPassword).build();

        // when
        when(passwordEncoder.matches(requestPassword, actorPassword)).thenReturn(false);

        // then
        assertThrows(RuntimeException.class, () -> accountService.deleteAccount(request, actor));
        verify(passwordEncoder).matches(requestPassword, actorPassword);
    }


    @Test
    void whenDeleteTests_givenValidRequest_thenDeleteTests() {
        // given
        String requestPassword = "1234-4321";
        DeleteTestsRequest request = new DeleteTestsRequest(requestPassword);

        String actorId = "1234";
        String actorPassword = "1234-4321";
        User actor = User.builder().id(actorId).email("j.doe@mail.com").password(actorPassword).build();

        // when
        when(passwordEncoder.matches(requestPassword, actorPassword)).thenReturn(true);

        accountService.deleteTests(request, actor);

        // then
        verify(passwordEncoder).matches(requestPassword, actorPassword);
        verify(testService).deleteTests(actorId);
    }

    @Test
    void whenDeleteTests_givenIncorrectPassword_thenThrowException() {
        // given
        String requestPassword = "1234-4321";
        DeleteTestsRequest request = new DeleteTestsRequest(requestPassword);

        String actorId = "1234";
        String actorPassword = "1234-4321";
        User actor = User.builder().id(actorId).email("j.doe@mail.com").password(actorPassword).build();

        // when
        when(passwordEncoder.matches(requestPassword, actorPassword)).thenReturn(false);

        // then
        assertThrows(RuntimeException.class, () -> accountService.deleteTests(request, actor));
        verify(passwordEncoder).matches(requestPassword, actorPassword);
    }
}