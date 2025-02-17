CREATE TABLE IF NOT EXISTS banca_tcc(
    id UUID PRIMARY KEY,
    id_professor UUID NOT NULL,
    id_tcc UUID NOT NULL,
    CONSTRAINT fk_banca_tcc_professor FOREIGN KEY (id_professor) REFERENCES professor(id),
    CONSTRAINT fk_banca_tcc_tcc FOREIGN KEY (id_tcc) REFERENCES tcc(id)
);