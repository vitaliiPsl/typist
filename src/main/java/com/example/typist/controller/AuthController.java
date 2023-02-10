package com.example.typist.controller;

import com.example.typist.payload.UserDto;
import com.example.typist.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public UserDto signup(@RequestBody @Valid UserDto userDto) {
        return authService.signUp(userDto);
    }
}
