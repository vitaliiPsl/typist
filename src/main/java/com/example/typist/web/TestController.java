package com.example.typist.web;

import com.example.typist.model.entities.Test;
import com.example.typist.model.entities.User;
import com.example.typist.model.errors.EntityNotFoundException;
import com.example.typist.service.TestService;
import com.example.typist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("api/tests")
public class TestController {
    private TestService testService;
    private UserService userService;

    @Autowired
    public TestController(TestService testService, UserService userService) {
        this.testService = testService;
        this.userService = userService;
    }

    @PostMapping("/save")
    public ResponseEntity<Test> saveTest(@Valid @RequestBody Test test, Authentication auth){
        String username = auth.getName();
        User user = userService.getByEmail(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username '%s' not found", username)));

        test.setUser(user);
        testService.save(test);

        return ResponseEntity.ok().body(test);
    }

    @GetMapping("/top")
    public ResponseEntity<List<Test>> getTodayTests(){
        List<Test> todayTests = testService.getTodayTopTests();

        return ResponseEntity.ok().body(todayTests);
    }
}
