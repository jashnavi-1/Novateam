package com.fsdproject.subscriptionapp.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsdproject.subscriptionapp.model.Payment;
import com.fsdproject.subscriptionapp.model.User;
import com.fsdproject.subscriptionapp.repository.PaymentRepository;
import com.fsdproject.subscriptionapp.repository.UserRepository;
import com.fsdproject.subscriptionapp.exception.ResourceNotFoundException;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    // Make Payment
    public Payment makePayment(int userId, double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDate.now());

        return paymentRepository.save(payment);
    }
}