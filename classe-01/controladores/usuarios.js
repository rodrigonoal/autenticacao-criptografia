const conexao = require("../conexao");

const listarUsuarios = async (req, res) => {
    try {
        const { rows: usuarios } = await conexao.query('select * from usuarios');
        
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = { listarUsuarios }