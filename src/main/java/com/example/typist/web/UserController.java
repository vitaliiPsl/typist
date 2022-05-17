package com.example.typist.web;

import com.example.typist.model.dto.UserDto;
import com.example.typist.model.entities.User;
import com.example.typist.model.errors.EntityNotFoundException;
import com.example.typist.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") long userId) {
        User user = userService.getById(userId).orElseThrow(() -> new EntityNotFoundException(String.format("User with id %d not found", userId)));
        UserDto userDto = new UserDto(user);

        return ResponseEntity.ok().body(userDto);
    }
}