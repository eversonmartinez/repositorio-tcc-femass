package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class UserMinDTO {
    private UUID id;
    private String nomeCompleto;
    private String role;
    private String matricula;
    private String email;

    public UserMinDTO(User entity){
        this.id = entity.getId();
        this.nomeCompleto = entity.getNomeCompleto();
        this.role = entity.getRole().toString();
        this.matricula = entity.getMatricula();
        this.email = entity.getEmail();
    }
}
