package com.fsdproject.subscriptionapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsdproject.subscriptionapp.model.Subscription;
import com.fsdproject.subscriptionapp.model.User;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    // Get subscriptions of a user
    List<Subscription> findByUser(User user);
}