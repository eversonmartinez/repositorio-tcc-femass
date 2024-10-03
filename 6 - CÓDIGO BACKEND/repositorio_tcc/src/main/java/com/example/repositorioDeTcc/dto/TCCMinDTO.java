package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.TCC;
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
    private UUID idOrientador;
    private Integer idCurso;

    public TCCMinDTO(TCC entity){
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.idAluno = entity.getAluno().getId();
        this.idOrientador = entity.getOrientador().getId();
        this.idCurso = entity.getCurso();
    }
}
