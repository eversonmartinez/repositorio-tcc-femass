package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.TCCMinDTO;
import com.example.repositorioDeTcc.dto.UserMinDTO;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails user = userRepository.findByEmail(email);

        if (user == null){
            user = userRepository.findByMatricula(email);
        }
        if (user == null){
            throw new UsernameNotFoundException("User not found with username " + email);
        }
        return user;
    }

    @Transactional(readOnly = true)
    public List<UserMinDTO> findAll(){
        List<User> list = userRepository.findAll().stream().map((detail) -> (User) detail).collect(Collectors.toList());
        List<UserMinDTO> listDto = list.stream().map(user -> new UserMinDTO(user)).toList();
        return listDto;
    }

}
