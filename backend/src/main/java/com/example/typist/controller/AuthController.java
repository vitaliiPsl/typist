package com.example.typist.controller;

import com.example.typist.payload.UserDto;
import com.example.typist.payload.auth.SignInRequest;
import com.example.typist.payload.auth.SignInResponse;
import com.example.typist.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signin")
    SignInResponse signIn(@Valid @RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

    @PostMapping("/signup")
    public UserDto signup(@RequestBody @Valid UserDto userDto) {
        return authService.signUp(userDto);
    }

    @PostMapping("/signin")
    SignInResponse signIn(@Valid @RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

}
