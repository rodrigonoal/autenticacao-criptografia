const express = require('express');
const cadastro = require('./controladores/cadastro');
const usuarios = require('./controladores/usuarios');
const pokemons = require('./controladores/pokemons')

const rotas = express();

rotas.post(`/cadastro`, cadastro.cadastrarUsuario);
rotas.post(`/login`, cadastro.logar);

rotas.get(`/usuarios`, usuarios.listarUsuarios); //para desenvolvimento

rotas.get(`/pokemon`, pokemons.listarPokemons);
rotas.get(`/pokemon/:id`, pokemons.obterPokemon);
rotas.post(`/pokemon`, pokemons.cadastrarPokemon);
rotas.put(`/pokemon/:id`, pokemons.editarPokemon);
rotas.delete(`/pokemon/:id`, pokemons.excluirPokemon);


module.exports = rotas;