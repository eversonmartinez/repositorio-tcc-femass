package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.ChangePasswordRequestDTO;
import com.example.repositorioDeTcc.dto.LoginRequestDTO;
import com.example.repositorioDeTcc.dto.RegisterUserDTO;
import com.example.repositorioDeTcc.dto.ResetPasswordDTO;
import com.example.repositorioDeTcc.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;

@RestController
@CrossOrigin
@RequestMapping("auth")
@Tag(name = "Autenticação")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO){
        return authService.login(loginRequestDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterUserDTO registerUserDTO){
        return authService.register(registerUserDTO);
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequestDTO request, Principal connectedUser){
        return authService.changePassword(request, connectedUser);
    }

    @PatchMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordDTO request){
        return authService.resetPassword(request, token);
    }

}
