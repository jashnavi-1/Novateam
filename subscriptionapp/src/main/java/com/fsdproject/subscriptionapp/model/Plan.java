package com.fsdproject.subscriptionapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String platform;
    private String name;
    private Double price;
    private Integer duration;

    public Plan() {}

    public Plan(Integer id, String platform, String name, Double price, Integer duration) {
        this.id = id;
        this.platform = platform;
        this.name = name;
        this.price = price;
        this.duration = duration;
    }

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
}
