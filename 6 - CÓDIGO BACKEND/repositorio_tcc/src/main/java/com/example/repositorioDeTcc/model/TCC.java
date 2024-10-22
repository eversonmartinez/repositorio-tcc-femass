package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table
@NoArgsConstructor
@Data
public class TCC implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column
    private String titulo;

    @ManyToOne(optional = false)
    @JoinColumn(name="id_aluno", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name="id_orientador", referencedColumnName = "id", nullable = false)
    private Orientador orientador;
    //mudar para relacionamente com a classe curso quando essa existir
    @Column(name = "id_curso")
    private Integer curso;
    @ManyToOne(optional = false)
    @JoinColumn(name="idCategoria", referencedColumnName = "id", nullable = false)
    private Categoria categoria;

    @Column
    private String resumo;

    public TCC(String titulo, Aluno aluno, Orientador orientador, Integer curso,Categoria categoria, String resumo){
        this.titulo = titulo;
        this.aluno = aluno;
        this.orientador = orientador;
        this.curso = curso;
        this.categoria = categoria;
        this.resumo = resumo;
    }
}
