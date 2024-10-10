package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.LoginRequestDTO;
import com.example.repositorioDeTcc.dto.LoginResponseDTO;
import com.example.repositorioDeTcc.dto.RegisterUserDTO;
import com.example.repositorioDeTcc.exception.TooManyArgumentsException;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenService tokenService;

    @Autowired
    AuthenticationManager authenticationManager;

    public ResponseEntity<LoginResponseDTO> login(LoginRequestDTO loginRequestDTO) {

        if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty() &&
                loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
            throw new TooManyArgumentsException("Both email and matricula cannot be provided together.");
        }

        try {
            Authentication auth;
            if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.email(), loginRequestDTO.password());
                auth = authenticationManager.authenticate(usernamePassword);

            } else if (loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.matricula(), loginRequestDTO.password());
                System.out.println(usernamePassword);
                auth = authenticationManager.authenticate(usernamePassword);


            } else {
                return ResponseEntity.badRequest().body(new LoginResponseDTO("Email or Matricula must be provided."));
            }
            var token = tokenService.generateToken((User) auth.getPrincipal());
            return ResponseEntity.ok(new LoginResponseDTO(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDTO("Authentication failed: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> register(RegisterUserDTO registerUserDTO) {
        if(userRepository.findByEmail(registerUserDTO.email()) != null) return ResponseEntity.badRequest().body("Email já está em uso");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerUserDTO.password());
        User newUser = new User(registerUserDTO.nomeCompleto(), registerUserDTO.matricula(), registerUserDTO.email(), encryptedPassword, Role.USER);

        userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }
}
