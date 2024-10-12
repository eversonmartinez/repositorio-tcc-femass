package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record RegisterUserDTO(@NotBlank String nomeCompleto,
                              @NotBlank String email,
                              @NotBlank String matricula,
                              @NotBlank String password,
                              @NotNull Boolean mustChangePassword,
                              Role role )
        implements Serializable {
}
