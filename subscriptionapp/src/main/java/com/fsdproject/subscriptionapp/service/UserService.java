package com.fsdproject.subscriptionapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsdproject.subscriptionapp.model.User;
import com.fsdproject.subscriptionapp.repository.UserRepository;
import com.fsdproject.subscriptionapp.exception.ResourceNotFoundException;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register User
    public User register(User user) {
        return userRepository.save(user);
    }

    // Login User
    public User login(String email, String password) {

    	User user = userRepository.findByEmail(email);

    	if (user == null) {
    	    throw new ResourceNotFoundException("User not found with email: " + email);
    	}

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // Find user by email
    public User getByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        return user;
    }
}
