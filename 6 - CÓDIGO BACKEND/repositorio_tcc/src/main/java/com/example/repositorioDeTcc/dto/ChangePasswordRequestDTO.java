package com.example.repositorioDeTcc.dto;

public record ChangePasswordRequestDTO(
        String currentPassword,
        String newPassword,
        String confirmPassword
) {
}
