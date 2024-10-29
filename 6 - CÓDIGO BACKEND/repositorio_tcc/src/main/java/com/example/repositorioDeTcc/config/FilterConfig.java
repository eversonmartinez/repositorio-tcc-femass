package com.example.repositorioDeTcc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<MustChangeFilter> mustChangeFilter(){
        FilterRegistrationBean<MustChangeFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new MustChangeFilter());
        registrationBean.addUrlPatterns("/alunos/*");
        registrationBean.addUrlPatterns("/orientadores/*");
        registrationBean.addUrlPatterns("/tcc/*");
        registrationBean.addUrlPatterns("/categorias/*");
        registrationBean.addUrlPatterns("/subcategorias/*");
        return registrationBean;
    }
}
