package com.example.typist.service;

import com.example.typist.model.entities.User;
import com.example.typist.persistence.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public Optional<User> getById(long id){
        return userRepository.findById(id);
    }

    public Optional<User> getByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public List<User> getAll(){
        return userRepository.findAll();
    }
}
