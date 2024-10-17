package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.dto.AlunoMinDTO;
import com.example.repositorioDeTcc.service.AlunoService;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/alunos")
@CrossOrigin
@PreAuthorize("hasAnyRole('USER','ADMIN','MODERATOR')")
public class AlunoController {

    @Autowired
    AlunoService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<AlunoDTO> findById(@PathVariable UUID id){
        AlunoDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<AlunoMinDTO>> findAll(){
        List<AlunoMinDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AlunoDTO> create(@RequestBody AlunoDTO aluno){

        aluno = service.insert(aluno);
        return ResponseEntity.ok().body(aluno);
    }

    @PutMapping(value = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AlunoDTO> update(@PathVariable UUID id, @RequestBody AlunoDTO aluno){

        aluno = service.update(id, aluno);
        return ResponseEntity.ok().body(aluno);

    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){
        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
