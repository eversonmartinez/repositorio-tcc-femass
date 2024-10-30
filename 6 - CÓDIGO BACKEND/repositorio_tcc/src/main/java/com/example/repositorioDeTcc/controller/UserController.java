package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.UserMinDTO;
import com.example.repositorioDeTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/users")
@CrossOrigin
public class UserController {

    @Autowired
    UserService service;

    @GetMapping
    public ResponseEntity<List<UserMinDTO>> findAll(){
        List<UserMinDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

}
