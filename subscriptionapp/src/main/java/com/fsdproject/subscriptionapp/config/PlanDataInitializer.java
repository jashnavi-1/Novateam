package com.fsdproject.subscriptionapp.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fsdproject.subscriptionapp.model.Plan;
import com.fsdproject.subscriptionapp.repository.PlanRepository;

@Component
public class PlanDataInitializer implements CommandLineRunner {

    private final PlanRepository planRepository;

    public PlanDataInitializer(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public void run(String... args) {
        List<Plan> defaultPlans = List.of(
            new Plan(null, "Netflix", "Mobile", 149.0, 30),
            new Plan(null, "Netflix", "Basic", 199.0, 30),
            new Plan(null, "Netflix", "Standard", 499.0, 30),
            new Plan(null, "Netflix", "Premium", 649.0, 30),
            new Plan(null, "Netflix", "Ultra HD", 799.0, 30),

            new Plan(null, "Amazon Prime Video", "Lite", 149.0, 30),
            new Plan(null, "Amazon Prime Video", "Monthly", 299.0, 30),
            new Plan(null, "Amazon Prime Video", "Quarterly", 599.0, 90),
            new Plan(null, "Amazon Prime Video", "Half Yearly", 999.0, 180),
            new Plan(null, "Amazon Prime Video", "Yearly", 1499.0, 365),

            new Plan(null, "Disney+ Hotstar", "Mobile", 499.0, 365),
            new Plan(null, "Disney+ Hotstar", "Super", 899.0, 365),
            new Plan(null, "Disney+ Hotstar", "Premium", 1499.0, 365),
            new Plan(null, "Disney+ Hotstar", "Sports Pack", 799.0, 180),
            new Plan(null, "Disney+ Hotstar", "Family Max", 1999.0, 365),

            new Plan(null, "Aha", "Gold Monthly", 149.0, 30),
            new Plan(null, "Aha", "Gold Quarterly", 399.0, 90),
            new Plan(null, "Aha", "Gold Half Yearly", 649.0, 180),
            new Plan(null, "Aha", "Gold Yearly", 999.0, 365),
            new Plan(null, "Aha", "Family Yearly", 1299.0, 365)
        );

        for (Plan plan : defaultPlans) {
            if (!planRepository.existsByPlatformIgnoreCaseAndNameIgnoreCase(plan.getPlatform(), plan.getName())) {
                planRepository.save(plan);
            }
        }
    }
}
