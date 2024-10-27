// api/seleccionar.js
const { pool } = require('../db/db.config'); // Importar pool
const sequelize = require('../db/db.config'); // Conexión a la Base de Datos

async function cargarSemillas(req, res) {
    try {
        console.log("Cargando semillas...");
        const [result] = await sequelize.query('SELECT * FROM semilla');

        const semillas = result.map(semilla => ({
            id_semilla: semilla.id_semilla,
            nombre_semilla: semilla.nombre_semilla,
            foto_semilla: `data:image/png;base64,${semilla.foto_semilla}`,
            humedad_semilla: semilla.humedad_semilla,
            temperatura_semilla: semilla.temperatura_semilla,
            descripcion_semilla: semilla.descripcion_semilla
        }));

        res.json(semillas);
    } catch (error) {
        console.error("Error al cargar semillas:", error);
        res.status(500).json({ error: "Error al cargar semillas" });
    }
}

const obtenerGerminadoras = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM germinadora');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener germinadoras' });
    }
};

const obtenerGerminadora = async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM germinadora WHERE codigo = $1', [codigo]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la germinadora' });
    }
};

module.exports = {
    cargarSemillas,
    obtenerGerminadoras,
    obtenerGerminadora,
};
