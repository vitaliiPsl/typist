package com.example.typist.controller;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import com.example.typist.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/signin")
    SignInResponse signIn(@Valid @RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

    @GetMapping("/user")
    UserDto getAuthenticatedUser(@AuthenticationPrincipal User user) {
        return authService.getAuthenticatedUser(user);
    }
}
