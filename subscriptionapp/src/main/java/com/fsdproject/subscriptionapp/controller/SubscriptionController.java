package com.fsdproject.subscriptionapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fsdproject.subscriptionapp.model.Subscription;
import com.fsdproject.subscriptionapp.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    // Subscribe
    @PostMapping("/subscribe")
    public Subscription subscribe(@RequestParam int userId,
                                  @RequestParam int planId) {
        return subscriptionService.subscribe(userId, planId);
    }

    // Get user subscriptions
    @GetMapping("/user/{userId}")
    public List<Subscription> getUserSubscriptions(@PathVariable int userId) {
        return subscriptionService.getUserSubscriptions(userId);
    }

    // Cancel subscription
    @PutMapping("/cancel/{id}")
    public Subscription cancelSubscription(@PathVariable int id) {
        return subscriptionService.cancelSubscription(id);
    }
}