package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.dto.AlunoMinDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.AlunoMapper;
import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class AlunoService {

    @Autowired
    AlunoRepository repository;

    @Autowired
    AlunoMapper alunoMapper;

    @Transactional(readOnly = true)
    public AlunoDTO findById(UUID id){
        Optional<Aluno> obj = repository.findById(id);
        AlunoDTO dto = new AlunoDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AlunoMinDTO> findAll(){
        List <Aluno> list = repository.findAllByAtivoIsTrue();
        List<AlunoMinDTO> listDto = list.stream().map(aluno -> new AlunoMinDTO(aluno)).toList();
        return listDto;
    }

    public AlunoDTO insert(AlunoDTO alunoDTO){

        if(alunoDTO == null) throw new RequiredObjectIsNullException();

        Aluno aluno = alunoMapper.fromAlunoDTOToAluno(alunoDTO);
        return alunoMapper.toAlunoDTO(repository.save(aluno));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        repository.deleteById(id);
    }

    @Transactional
    public AlunoDTO update(UUID id, AlunoDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        Aluno entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return alunoMapper.toAlunoDTO(repository.save(entity));
    }

    private void updateData(Aluno entity, AlunoDTO obj) {
        entity.setNomeCompleto(obj.getNomeCompleto());
        entity.setEmail(obj.getEmail());
        entity.setTelefone(obj.getTelefone());
    }
}
