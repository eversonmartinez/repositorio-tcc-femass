package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.*;
import com.example.repositorioDeTcc.exception.MustChangePasswordException;
import com.example.repositorioDeTcc.exception.TooManyArgumentsException;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Objects;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenService tokenService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    MailService mailService;

    public ResponseEntity<?> login(LoginRequestDTO loginRequestDTO) {

        if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty() &&
                loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
            throw new TooManyArgumentsException("Both email and matricula cannot be provided together.");
        }

        try {
            Authentication auth;
            User user;
            if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.email(), loginRequestDTO.password());
                auth = authenticationManager.authenticate(usernamePassword);
                user = (User) userRepository.findByEmail(loginRequestDTO.email());
            } else if (loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.matricula(), loginRequestDTO.password());
                user = (User) userRepository.findByMatricula(loginRequestDTO.matricula());
                auth = authenticationManager.authenticate(usernamePassword);


            } else {
                return ResponseEntity.badRequest().body(new LoginErroDTO("Email or Matricula must be provided."));
            }
            var token = tokenService.generateToken(user);

            if(user.getMustChangePassword()){
                return ResponseEntity.ok(new LoginResponseMustChangeDTO(token, true));
            }
            return ResponseEntity.ok(new LoginResponseDTO(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginErroDTO("Authentication failed: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> register(RegisterUserDTO registerUserDTO) {
        if(userRepository.findByEmail(registerUserDTO.email()) != null) return ResponseEntity.badRequest().body(new LoginErroDTO("Email Already taken"));
        if(userRepository.findByMatricula(registerUserDTO.matricula()) !=null) return ResponseEntity.badRequest().body(new LoginErroDTO("Matricula already taken"));

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerUserDTO.password());
        String role = "USER";
        User newUser = new User(registerUserDTO.nomeCompleto(), registerUserDTO.matricula(), registerUserDTO.email(), encryptedPassword, Role.valueOf(role));

        userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> changePassword(ChangePasswordRequestDTO request, Principal connectedUser) {
        var user = ((User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal());

        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())){
            throw new IllegalStateException("Wrong password");
        };
        if(!request.newPassword().equals(request.confirmPassword())){
            throw new IllegalStateException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
        var token = tokenService.generateToken(user);
        return ResponseEntity.ok(new LoginResponseDTO(token));

    }

    public ResponseEntity<?> sendMailReset(SendMailResetRequestDTO request) {
        var user = userRepository.findByEmail(request.email());
        if (user == null){
            return ResponseEntity.ok().build();
        }
        var token = tokenService.generateSingleToken((User) user);
        mailService.sendRecoverPassword(((User) user).getNomeCompleto(), request.email(),token);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> resetPassword(ResetPasswordDTO request,String token) {
        try {
            tokenService.validateToken(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new LoginErroDTO("Invalid token"));
        }
        if(!request.newPassword().equals(request.confirmPassword())){
            throw new IllegalStateException("Password do not match");
        }
        User user = (User) userRepository.findByEmail(tokenService.getClaimFromToken(token, "sub"));
        if(!userRepository.findByUsedToken(token).isEmpty()){
            throw new IllegalStateException("Token already used");
        }
        if (user != null) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(request.newPassword());
            user.setPassword(encryptedPassword);
            userRepository.insertToken(token);
            user.setMustChangePassword(false);
            userRepository.save(user);
            token = tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponseDTO(token));
        }else {
            throw new IllegalStateException("User not found");
        }
    }

}
