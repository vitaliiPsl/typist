package com.example.typist.web;

import com.example.typist.config.security.AuthenticationRequest;
import com.example.typist.config.security.jwt.JwtUtils;
import com.example.typist.model.dto.UserDto;
import com.example.typist.model.entities.User;
import com.example.typist.model.errors.ApiError;
import com.example.typist.model.errors.EntityNotFoundException;
import com.example.typist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthenticationRequest request) {
        // Authenticate user. It will throw AuthenticationExc if credentials are invalid
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Build jwt token
        String token = JwtUtils.buildToken(authentication);

        // Find user by email/username
        String username = authentication.getName();
        User user = userService.getByEmail(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username '%s' not found", username)));
        UserDto userDto = new UserDto(user);

        // return response entity containing user and authentication token
        Map<String, Object> response = Map.of("user", userDto, "authToken", token);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@Valid @RequestBody User user) {
        Optional<User> existing = userService.getByEmail(user.getEmail());

        if(existing.isPresent()) {
            ApiError apiError = new ApiError();
            apiError.setStatus(HttpStatus.BAD_REQUEST);
            apiError.setMessage("User already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
        }

        user = userService.saveUser(user);
        UserDto userDto = new UserDto(user);

        return ResponseEntity.ok().body(userDto);
    }
}
