package com.fsdproject.subscriptionapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsdproject.subscriptionapp.model.Plan;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
    boolean existsByPlatformIgnoreCaseAndNameIgnoreCase(String platform, String name);
}
