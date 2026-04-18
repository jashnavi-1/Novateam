package com.fsdproject.subscriptionapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fsdproject.subscriptionapp.model.Plan;
import com.fsdproject.subscriptionapp.service.PlanService;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class PlanController {

    @Autowired
    private PlanService planService;

    // Get all plans
    @GetMapping
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }

    // Create a plan
    @PostMapping
    public Plan createPlan(@RequestBody Plan plan) {
        return planService.createPlan(plan);
    }
}
