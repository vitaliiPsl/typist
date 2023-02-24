package com.example.typist.payload.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeNicknameRequest {
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    @NotBlank(message = "Nickname is required")
    @Length(min = 3, message = "Nickname must be at least 3 characters long")
    private String nickname;

    @ToString.Exclude
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "You need to enter your password to change nickname")
    private String password;
}
