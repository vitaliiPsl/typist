package com.example.typist.service.impl;

import com.example.typist.exception.ResourceNotFoundException;
import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.repository.UserRepository;
import com.example.typist.service.ImageService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    UserRepository userRepository;

    @Mock
    ImageService imageService;

    @Spy
    ModelMapper mapper;

    @InjectMocks
    UserServiceImpl userService;

    @Test
    void whenGetUserById_givenUserExist_thenReturnUser() {
        // given
        String id = "1234";
        User user = User.builder().id(id).email("j.doe@mail.com").build();

        // when
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        UserDto res = userService.getUserById(id);

        // then
        verify(userRepository).findById(id);
        assertThat(res.getId(), Matchers.is(id));
        assertThat(res.getEmail(), Matchers.is(user.getEmail()));
    }

    @Test
    void whenGetUserById_givenUserDoesntExist_thenThrowException() {
        // given
        String id = "1234";

        // when
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // then
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(id));
        verify(userRepository).findById(id);
    }

    @Test
    void whenGetUsersByNickname_givenThereAreUsersWithGivenNickname_thenReturnUsers() {
        // given
        String nickname = "doe";
        List<User> users = List.of(
                User.builder().nickname("joe.doe").build(),
                User.builder().nickname("jane.doe").build()
        );

        // when
        when(userRepository.findByNicknameContainingIgnoreCase(nickname)).thenReturn(users);
        List<UserDto> res = userService.getUsersByNickname(nickname);

        // then
        verify(userRepository).findByNicknameContainingIgnoreCase(nickname);
        assertThat(res, Matchers.hasSize(2));
    }

    @Test
    void whenGetUserImage_givenImageExist_thenReturnImage() {
        // given
        String userId = "2134";
        String imageId = "qwer";
        User user = User.builder().id(userId).email("j.doe@mail.com").image(imageId).build();

        byte[] image = new byte[]{1, 2, 3};

        // when
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(imageService.loadImage(imageId)).thenReturn(image);

        byte[] res = userService.getUserImage(userId);

        // then
        verify(userRepository).findById(userId);
        verify(imageService).loadImage(imageId);

        assertThat(res, Matchers.is(image));
    }

    @Test
    void whenGetUserImage_givenAccountDoesntHaveImage_thenThrowException() {
        // given
        String userId = "2134";
        User user = User.builder().id(userId).email("j.doe@mail.com").image(null).build();


        // when
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // then
        assertThrows(RuntimeException.class, () -> userService.getUserImage(userId));
        verify(userRepository).findById(userId);
    }

    @Test
    void whenGetUserImage_givenUserDoesntExist_thenThrowException() {
        // given
        String userId = "2134";

        // when
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () -> userService.getUserImage(userId));
        verify(userRepository).findById(userId);
    }
}