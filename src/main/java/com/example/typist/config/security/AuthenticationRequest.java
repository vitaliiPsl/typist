package com.example.typist.config.security;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}
