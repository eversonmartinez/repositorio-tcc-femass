ALTER TABLE TCC
ADD COLUMN idCategoria UUID,
ADD CONSTRAINT fk_tcc_categoria FOREIGN KEY (idCategoria) REFERENCES categoria(id);
