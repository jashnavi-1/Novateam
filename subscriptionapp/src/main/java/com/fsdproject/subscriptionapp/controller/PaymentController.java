package com.fsdproject.subscriptionapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fsdproject.subscriptionapp.model.Payment;
import com.fsdproject.subscriptionapp.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Make payment
    @PostMapping("/pay")
    public Payment makePayment(@RequestParam int userId,
                              @RequestParam double amount) {
        return paymentService.makePayment(userId, amount);
    }
}