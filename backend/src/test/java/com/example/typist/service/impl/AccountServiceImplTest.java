package com.example.typist.service.impl;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

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
}