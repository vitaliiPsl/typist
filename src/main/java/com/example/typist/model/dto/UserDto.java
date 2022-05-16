package com.example.typist.model.dto;

import com.example.typist.model.entities.Test;
import com.example.typist.model.entities.User;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class UserDto {
    private long id;
    private String username;
    private String nickname;
    private Set<Test> tests = new HashSet<>();

    public UserDto(User user){
        this.id = user.getId();
        this.username = user.getEmail();
        this.nickname = user.getNickname() == null || user.getNickname().isBlank() ? user.getEmail() : user.getNickname();
        this.tests = user.getTypingTests();
    }
}