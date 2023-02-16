package com.example.typist.service.impl;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.repository.UserRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {
    @Mock
    UserRepository userRepository;

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

        UserDto res = accountService.changeNickname(changeNicknameRequest, actor);

        // then
        verify(passwordEncoder).matches(requestPassword, actor.getPassword());
        verify(userRepository).findByNickname(requestNickname);

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
}