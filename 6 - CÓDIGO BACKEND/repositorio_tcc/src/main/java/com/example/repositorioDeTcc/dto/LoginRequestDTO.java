package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record LoginRequestDTO (@NotBlank String email, @NotBlank String password) implements Serializable {

}
