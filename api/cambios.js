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

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener los datos del formulario
        const { nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario } = req.body;
        
        // Validar que los campos requeridos no estén vacíos
        if (!nombre_usuario || !apellido1_usuario || !correo_usuario) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, primer apellido y correo son obligatorios'
            });
        }

        // Si hay un archivo de imagen nuevo
        let foto_usuario = null;
        if (req.file) {
            // Convertir la imagen a Base64
            const imageBuffer = req.file.buffer;
            foto_usuario = imageBuffer.toString('base64');
        }

        // Construir la consulta SQL base
        let queryText = `
            UPDATE usuario 
            SET nombre_usuario = $1, 
                apellido1_usuario = $2, 
                apellido2_usuario = $3, 
                correo_usuario = $4
        `;
        let queryParams = [nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario];

        // Si hay una nueva foto, añadirla a la consulta
        if (foto_usuario) {
            queryText += `, foto_usuario = $5`;
            queryParams.push(foto_usuario);
        }

        // Añadir la condición WHERE
        queryText += ` WHERE id_usuario = $${queryParams.length + 1}`;
        queryParams.push(id);

        queryText += ` RETURNING *`;

        // Ejecutar la consulta
        const result = await pool.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Transformar la foto a base64 para la respuesta
        const usuarioActualizado = {
            ...result.rows[0],
            foto_usuario: result.rows[0].foto_usuario ? 
                `data:image/jpeg;base64,${result.rows[0].foto_usuario}` : null
        };

        res.json({
            success: true,
            message: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario'
        });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario'
        });
    }
};

module.exports = {
    actualizarGerminadora,
    eliminarGerminadora,
    actualizarUsuario,
    eliminarUsuario
}