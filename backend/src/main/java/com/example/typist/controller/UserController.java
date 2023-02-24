package com.example.typist.controller;

import com.example.typist.payload.UserDto;
import com.example.typist.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable("id") String id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<UserDto> getUsersByNickname(@RequestParam("nickname") String nickname) {
        return userService.getUsersByNickname(nickname);
    }
}