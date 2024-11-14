package com.example.repositorioDeTcc.initialization;

import com.example.repositorioDeTcc.model.Curso;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.CursoRepository;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class cursosDataLoader implements CommandLineRunner {

    @Autowired
    CursoRepository cursoRepository;

    @Override
    public void run(String... args) throws Exception {
            Curso curso1 = new Curso("Sistemas de Informação");
            Curso curso2 = new Curso("Administração");
            Curso curso3 = new Curso("Matemática");
            Curso curso4 = new Curso("Engenharia de Produção");
            cursoRepository.saveAll(Arrays.asList(new Curso[]{curso1, curso2, curso3, curso4}));
    }
}
