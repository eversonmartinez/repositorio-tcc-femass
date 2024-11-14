ALTER TABLE TCC 
ALTER COLUMN id_curso TYPE UUID USING id_curso::uuid,
ADD CONSTRAINT fk_tcc_curso foreign key (id_curso) references curso(id);