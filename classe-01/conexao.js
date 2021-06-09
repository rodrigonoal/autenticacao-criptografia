const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catalogo_pokemon',
    password: 'password',
    port: 5432
});

const query = (text, param) => {
    return pool.query(text, param);
};

module.exports = {
    query
};
