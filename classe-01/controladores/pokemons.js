const conexao = require("../conexao");
const jwt = require("jsonwebtoken"); // (01) - IMPORTOU!
const jwtSecret = require("../jwt_secret"); // (02) - Puxou a chave secreta


const verificarToken = async (req, res) => {
    const { token } = req.body;

    try {
        const usuario = jwt.verify(token, jwtSecret);
        console.log(`${usuario.nome} está online.`)
    } catch {
        return res.status(400).json('Token inválido. Faça login para ter acesso ao sistema.')
    };
};

const verificarExistência = async (req, res) => {
    const { id } = req.params

    try {
        const pokemon = await conexao.query(`select * from pokemons where id =$1`, [id])
        
        if(pokemon.rowCount === 0) {
            return res.status(404).json(`Não existe Pokemon com o ID pesquisado.`);
        };
    } catch (error) {
        return res.status(400).json(error.message);
    };
}


const listarPokemons = async (req, res) => {
    verificarToken(req, res);

    try {
        const query = 'select pokemons.id, usuarios.nome as usuario, pokemons.nome, apelido, habilidades, imagem from pokemons join usuarios on pokemons.usuario_id = usuarios.id'
        const { rows: pokemons } = await conexao.query(query);

        for(let pokemon of pokemons){
            pokemon.habilidades = pokemon.habilidades.split(', ')
        };
        
        return res.status(200).json(pokemons);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const obterPokemon = async (req, res) => {
    verificarToken(req, res);
    verificarExistência(req,res);

    const { id } = req.params;
    try {
        const query = 'select pokemons.id, usuarios.nome as usuario, pokemons.nome, apelido, habilidades, imagem from pokemons join usuarios on pokemons.usuario_id = usuarios.id where pokemons.id = $1'
        const { rows: pokemons } = await conexao.query(query, [id]);

        for(let pokemon of pokemons){
            pokemon.habilidades = pokemon.habilidades.split(', ')
        };
        
        return res.status(200).json(pokemons);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const cadastrarPokemon = async (req, res) => {
    verificarToken(req, res);
    const { nome, apelido, habilidades, imagem, token } = req.body;

    if (!nome || !habilidades) {
        return res.status(400).json(`Erro. Os campos 'nome' e 'habilidades' devem estar preenchidos.`);
    }

    try {
        const usuario = jwt.verify(token, jwtSecret);

        const query = `insert into pokemons (nome, apelido, habilidades, imagem, usuario_id) values ($1, $2, $3, $4, $5)`;
        const cadastro = await conexao.query(query, [nome, apelido, habilidades, imagem, usuario.id]);

        if(cadastro.rowCount === 0) {
            return res.status(400).json(`Erro. Não foi possível cadastrar o Pokemon.`);
        };

        return res.status(200).json(`Pokemon cadastrado com sucesso!`)

    } catch (error) {
        return res.status(400).json(error.message);
    };

};

const excluirPokemon = async (req,res) => {
    verificarToken(req, res);
    verificarExistência(req, res);
    const { id } = req.params

    try {
        const query = `delete from pokemons where id = $1`;
        const deletePoke = await conexao.query(query, [id]);

        if(deletePoke.rowCount === 0) {
            return res.status(400).json(`Erro. Não foi possível excluir o Pokemon.`);
        };

        return res.status(200).json('Pokemon excluído com sucesso!')
        
    } catch (error) {
        return res.status(400).json(error.message);
    };
};


const editarPokemon = async (req,res) => {
    verificarToken(req, res);
    verificarExistência(req, res);

    const { id } = req.params;
    const { apelido } = req.body;

    try {
        const query = `update pokemons set apelido = $1 where id = $2`;
        const update = await conexao.query(query, [apelido, id]);

        if(update.rowCount === 0) {
            return res.status(400).json(`Erro. Não foi possível mudar o apelido do Pokemon.`);
        };

        return res.status(200).json('Pokemon atualizado com sucesso!')
        
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

module.exports = { 
    listarPokemons, 
    obterPokemon,
    cadastrarPokemon,
    excluirPokemon,
    editarPokemon
}