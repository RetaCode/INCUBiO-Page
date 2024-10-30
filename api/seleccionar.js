// api/seleccionar.js
const { pool } = require('../db/db.config'); // Importar pool
const sequelize = require('../db/db.config'); // Conexión a la Base de Datos

async function cargarSemillas(req, res) {
    try {
        const result = await pool.query('SELECT * FROM semilla');
        const semillas = result.rows.map(semilla => ({
            ...semilla,
            foto_semilla: semilla.foto_semilla ? `data:image/jpeg;base64,${semilla.foto_semilla}` : null
        }));
        console.log("Semillas cargadas:", semillas);
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

const obtenerUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        
        // Transformar los datos para incluir el formato base64 correcto
        const usuarios = result.rows.map(usuario => ({
            ...usuario,
            foto_usuario: usuario.foto_usuario ? `data:image/jpeg;base64,${usuario.foto_usuario}` : null
        }));
        
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios');
    }
};

const obtenerUsuarioid = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
        if (result.rows.length) {
            const usuario = {
                ...result.rows[0],
                foto_usuario: result.rows[0].foto_usuario ? 
                    `data:image/jpeg;base64,${result.rows[0].foto_usuario}` : null
            };
            res.json(usuario);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error al obtener usuario');
    }
};

module.exports = {
    cargarSemillas,
    obtenerGerminadoras,
    obtenerGerminadora,
    obtenerUsuarios,
    obtenerUsuarioid
};
