package com.example.typist.web;

import com.example.typist.model.dto.NicknameDto;
import com.example.typist.model.dto.PasswordDto;
import com.example.typist.model.dto.UserDto;
import com.example.typist.model.entities.User;
import com.example.typist.model.errors.EntityNotFoundException;
import com.example.typist.model.errors.InvalidRequestArgumentException;
import com.example.typist.service.AwsImageService;
import com.example.typist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final AwsImageService imageService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, AwsImageService imageService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.imageService = imageService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") long userId) throws IOException {
        User user = userService.getById(userId).orElseThrow(() -> new EntityNotFoundException(String.format("User with id %d not found", userId)));

        byte[] image = imageService.loadImage(user.getImageName());

        UserDto userDto = new UserDto(user);
        userDto.setImage(image);

        return ResponseEntity.ok().body(userDto);
    }

    @PostMapping("/edit/nickname")
    public void updateNickname(@Valid @RequestBody NicknameDto nicknameDto, Authentication auth){
        String nickname = nicknameDto.getNickname();

        String email = auth.getName();
        User user = userService.getByEmail(email).orElseThrow(() -> new EntityNotFoundException(String.format("User with email '%s' not found", email)));

        user.setNickname(nickname);
        userService.saveUser(user);
    }

    @PostMapping("/edit/password")
    public void changePassword(@Valid @RequestBody PasswordDto passwordDto, Authentication auth){
        String email = auth.getName();
        User user = userService.getByEmail(email).orElseThrow(() -> new EntityNotFoundException(String.format("User with email '%s' not found", email)));

        if(!passwordEncoder.matches(passwordDto.getOldPassword(), user.getPassword())){
            throw new InvalidRequestArgumentException("Invalid old password");
        }

        String newPassword = passwordEncoder.encode(passwordDto.getNewPassword());
        user.setPassword(newPassword);
        userService.saveUser(user);
    }

    @DeleteMapping("/delete")
    public void deleteAccount(Authentication auth){
        String email = auth.getName();
        User user = userService.getByEmail(email).orElseThrow(() -> new EntityNotFoundException(String.format("User with email '%s' not found", email)));

        userService.deleteUser(user);
    }
}