package com.fsdproject.subscriptionapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsdproject.subscriptionapp.model.Plan;
import com.fsdproject.subscriptionapp.repository.PlanRepository;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    // Get all plans
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    // Create plan
    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }
}
