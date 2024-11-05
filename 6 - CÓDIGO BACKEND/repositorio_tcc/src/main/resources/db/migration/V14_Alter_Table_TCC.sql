ALTER TABLE TCC 
ADD CONSTRAINT fk_tcc_curso foreign key (id_curso) references curso(id);