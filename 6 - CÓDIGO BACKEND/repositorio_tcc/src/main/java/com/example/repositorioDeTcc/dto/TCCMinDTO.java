package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.model.Categoria;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class TCCMinDTO {
    private UUID id;
    private String titulo;
    private UUID idAluno;
    private String nomeCompletoAluno;
    private UUID idOrientador;
    private String nomeCompletoOrientador;
    private Integer idCurso;
    private UUID idCategoria;

    public TCCMinDTO(TCC entity){
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.idAluno = entity.getAluno().getId();
        this.nomeCompletoAluno = entity.getAluno().getNomeCompleto();
        this.idOrientador = entity.getOrientador().getId();
        this.nomeCompletoOrientador = entity.getOrientador().getNomeCompleto();
        this.idCurso = entity.getCurso();
        // Verifica se a categoria é nula antes de acessar seus atributos
        if (entity.getCategoria() != null) {
            this.idCategoria = entity.getCategoria().getId();
        } else {
            this.idCategoria = null; // Define como null se a categoria for nula
        }
    }
}
