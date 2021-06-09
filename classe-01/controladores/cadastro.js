const conexao = require("../conexao");
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken"); 
const jwtSecret = require("../jwt_secret"); 


const password = securePassword();

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json(`Todos os dados devem ser preenchidos.`);
    };

    try {
        const query = `select * from usuarios where email = $1`;
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount > 0) {
            return res.json('Este email já foi cadastrado.')
        };
    } catch (error) {
        return res.status(400).json(error.message)
    };

    try {
        const hash = (await password.hash(Buffer.from(senha))).toString("hex");

        const query = `insert into usuarios (nome, email, senha) values ($1, $2, $3)`;
        const usuario = await conexao.query(query, [nome, email, hash]);

        if (usuario.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.')
        };

        return res.status(200).json('Usuário cadastrado com sucesso!')
    } catch (error) {
        return res.json(error.message)

    };
};


const logar = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json('Todos os campos são obrigatórios.');
    };

    try {
        const query = `select * from usuarios where email = $1`;
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount === 0) {
            return res.status(400).json('Email ou senha incorretos.');
        };

        const usuario = usuarios.rows[0];

        const result = await password.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Email ou senha incorretos.');
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hashMelhorada = (await password.hash(Buffer.from(senha))).toString("hex");
                    const query = `update usuarios set senha = $1 where email = $2`;
                    await conexao.query(query, [hashMelhorada, email]);
                } catch {
                };
                break;
        };

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret);

        return res.status(200).json(token)
    } catch (error) {
        return res.json(error.message)
    };
};


module.exports = { 
    cadastrarUsuario,
    logar,
};