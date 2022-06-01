package com.example.typist.web;

import com.example.typist.config.security.AuthenticationRequest;
import com.example.typist.config.security.jwt.JwtUtils;
import com.example.typist.model.dto.UserDto;
import com.example.typist.model.entities.User;
import com.example.typist.model.errors.EntityNotFoundException;
import com.example.typist.model.errors.UserAlreadyExistsException;
import com.example.typist.service.AwsImageService;
import com.example.typist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;
    private final AwsImageService imageService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, AwsImageService imageService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.imageService = imageService;
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
    public ResponseEntity<Object> signup(@Valid User user, @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        String email = user.getEmail();
        Optional<User> existing = userService.getByEmail(email);

        if(existing.isPresent()) {
            throw new UserAlreadyExistsException(String.format("User with email: '%s' already exists", email));
        }

        String imageName = imageService.saveImage(image);
        user.setImageName(imageName);
        user = userService.saveUser(user);

        UserDto userDto = new UserDto(user);

        return ResponseEntity.ok().body(userDto);
    }
}
