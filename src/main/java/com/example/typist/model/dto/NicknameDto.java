package com.example.typist.model.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class NicknameDto {
    @NotNull
    @Size(min = 3, message = "Nickname must be at least 3 characters long")
    private String nickname;
}
