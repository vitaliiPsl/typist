package com.example.typist.config.security;

import com.example.typist.model.entities.User;
import com.example.typist.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService userService;

    UserDetailsServiceImpl(UserService userService){
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User with email %s not found", username)));

        return new UserDetailsImpl(user);
    }
}
