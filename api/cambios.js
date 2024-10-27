const pool = require('../db/db.config'); // Conexión a la base de datos

const actualizarGerminadora = async (req, res) => {
    const { codigo } = req.params;
    const { descripcion, color, version } = req.body;
    try {
        await pool.query(
            'UPDATE germinadora SET descripcion_germinadora = $1, color = $2, version = $3 WHERE codigo = $4',
            [descripcion, color, version, codigo]
        );
        res.status(200).json({ message: 'Germinadora actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la germinadora' });
    }
};

const eliminarGerminadora = async (req, res) => {
    const { codigo } = req.params;
    try {
        await pool.query('DELETE FROM germinadora WHERE codigo = $1', [codigo]);
        res.status(200).json({ message: 'Germinadora eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la germinadora' });
    }
};

module.exports = {
    actualizarGerminadora,
    eliminarGerminadora
}