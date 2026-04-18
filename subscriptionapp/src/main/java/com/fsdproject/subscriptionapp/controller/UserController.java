package com.fsdproject.subscriptionapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fsdproject.subscriptionapp.model.User;
import com.fsdproject.subscriptionapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        return userService.register(user);
    }

    // Login
    @PostMapping("/login")
    public User login(@RequestParam String email,
                      @RequestParam String password) {
        return userService.login(email, password);
    }

    // Get user by email
    @GetMapping("/by-email")
    public User getByEmail(@RequestParam String email) {
        return userService.getByEmail(email);
    }
}
