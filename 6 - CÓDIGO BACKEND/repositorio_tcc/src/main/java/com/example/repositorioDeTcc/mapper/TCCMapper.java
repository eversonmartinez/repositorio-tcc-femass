package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.TCCDTO;
import com.example.repositorioDeTcc.model.Categoria;
import com.example.repositorioDeTcc.model.Orientador;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import com.example.repositorioDeTcc.repository.CategoriaRepository;
import com.example.repositorioDeTcc.repository.OrientadorRepository;
import com.example.repositorioDeTcc.service.TCCService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TCCMapper {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private OrientadorRepository orientadorRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public TCC fromTCCDTOToTCC(TCCDTO tccDTO){
        Categoria categoria = tccDTO.getIdCategoria() != null ? categoriaRepository.findById(tccDTO.getIdCategoria()).get() : null;
        return new TCC(tccDTO.getTitulo(), alunoRepository.findById(tccDTO.getIdAluno()).get(), orientadorRepository.findById(tccDTO.getIdOrientador()).get(),
                tccDTO.getIdCurso(), categoria, tccDTO.getResumo());
    }

    public TCCDTO toTCCDTO(TCC tcc){
        return new TCCDTO(tcc);
    }
}
