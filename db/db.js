// db/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("INCUBiO", "Soporte", "re2014416", {
    host: "localhost",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// Exporta la instancia de sequelize
module.exports = sequelize;
