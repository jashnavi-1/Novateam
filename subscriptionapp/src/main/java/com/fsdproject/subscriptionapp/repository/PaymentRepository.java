package com.fsdproject.subscriptionapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsdproject.subscriptionapp.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}