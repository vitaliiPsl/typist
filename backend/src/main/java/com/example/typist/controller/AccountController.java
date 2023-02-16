package com.example.typist.controller;

import com.example.typist.model.User;
import com.example.typist.payload.UserDto;
import com.example.typist.payload.account.ChangeNicknameRequest;
import com.example.typist.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/account")
public class AccountController {
    private final AccountService accountService;

    @GetMapping
    public UserDto getAuthenticatedUser(@AuthenticationPrincipal User actor) {
        return accountService.getAuthenticatedUser(actor);
    }

    @PutMapping("/nickname")
    public UserDto updateNickname(@RequestBody @Valid ChangeNicknameRequest request, @AuthenticationPrincipal User actor){
        return accountService.changeNickname(request, actor);
    }
}
