package com.fsdproject.subscriptionapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsdproject.subscriptionapp.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Custom method for login
    User findByEmail(String email);
}