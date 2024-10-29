package com.example.repositorioDeTcc.repository;

import java.util.UUID;

import com.example.repositorioDeTcc.model.Subcategoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, UUID>{
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Subcategoria i WHERE LOWER(i.nomeSubcategoria) = LOWER(:nome)")
    boolean existsByNomeIgnoreCase(@Param("nome") String nome);
    
} 
