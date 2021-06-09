CREATE DATABASE catalogo_pokemon;

CREATE TABLE usuarios (
	id serial primary key,
	nome varchar(42) not null,
	email varchar(255) not null unique,
	senha text not null
);


create table pokemons (
id serial primary key,
  usuario_id serial not null,
  nome varchar(42) not null,
  habilidades text not null,
  imagem text,
  apelido varchar(42),
  foreign key (usuario_id) references usuarios(id)
);