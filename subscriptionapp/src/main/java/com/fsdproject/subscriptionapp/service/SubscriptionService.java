package com.fsdproject.subscriptionapp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsdproject.subscriptionapp.model.*;
import com.fsdproject.subscriptionapp.repository.*;
import com.fsdproject.subscriptionapp.exception.ResourceNotFoundException;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    // Subscribe user to a plan
    public Subscription subscribe(int userId, int planId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        Subscription sub = new Subscription();

        sub.setUser(user);
        sub.setPlan(plan);

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(plan.getDuration());

        sub.setStartDate(start);
        sub.setEndDate(end);
        sub.setStatus("ACTIVE");

        return subscriptionRepository.save(sub);
    }

    // Get subscriptions of a user
    public List<Subscription> getUserSubscriptions(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return subscriptionRepository.findByUser(user);
    }

    // Cancel subscription (status update instead of delete)
    public Subscription cancelSubscription(int id) {

        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        sub.setStatus("CANCELLED");

        return subscriptionRepository.save(sub);
    }
}