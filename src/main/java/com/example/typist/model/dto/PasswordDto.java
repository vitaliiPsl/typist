package com.example.typist.model.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class PasswordDto {
    @NotNull
    private String oldPassword;

    @NotNull
    @Size(min = 6, message = "Minimal password length - 6 symbols")
    private String newPassword;
}
