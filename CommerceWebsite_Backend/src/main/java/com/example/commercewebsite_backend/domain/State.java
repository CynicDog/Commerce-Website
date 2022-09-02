package com.example.commercewebsite_backend.domain;

import lombok.Data;

import javax.persistence.*;


@Data
@Entity
@Table(name = "state")
public class State {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
}
