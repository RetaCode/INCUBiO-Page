// db/db.config.js
const { Pool } = require('pg');

const pool = new Pool({
    user: "Soporte",
    host: "localhost",
    database: "INCUBiO",
    password: "re2014416",
    port: 5432, // Cambia si es necesario
});

// Exporta el pool para poder usarlo en otros archivos
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
