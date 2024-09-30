ALTER TABLE users
ADD CONSTRAINT unicaKey UNIQUE(id,matricula);
