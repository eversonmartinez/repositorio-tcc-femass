package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Orientador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrientadorRepository extends JpaRepository<Orientador, UUID> {
}
