CREATE TABLE IF NOT EXISTS aluno (
    id UUID PRIMARY KEY,
    matricula VARCHAR(11) NOT NULL,
    FOREIGN KEY (id, matricula) REFERENCES users(id,matricula)
)
