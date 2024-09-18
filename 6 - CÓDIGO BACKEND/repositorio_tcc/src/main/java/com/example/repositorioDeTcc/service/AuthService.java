package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.LoginRequestDTO;
import com.example.repositorioDeTcc.dto.LoginResponseDTO;
import com.example.repositorioDeTcc.dto.RegisterUserDTO;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        UsernamePasswordAuthenticationToken usernamePassword =  new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password());

        Authentication auth = authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    public ResponseEntity<?> register(RegisterUserDTO registerUserDTO) {
        if(userRepository.findByEmail(registerUserDTO.email()) != null) return ResponseEntity.badRequest().body("Email já está em uso");

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerUserDTO.password());
        User newUser = new User(registerUserDTO.nomeCompleto(), registerUserDTO.matricula(), registerUserDTO.email(), encryptedPassword, Role.USER);

        userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }
}
