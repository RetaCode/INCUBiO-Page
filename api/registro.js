const Pool = require('pg').Pool
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: "localhost",
  user: "Soporte",
  password: "re2014416",
  database: "INCUBiO",
  port: 5432,
});

const saltRounds = 10; // Número de rondas para el hashing

//--------------------------------------------------------------Inicio de sesion--------------------------------------------------------------
const loginUsuario = async (request, response) => {
  const { correo_usuario, contrasena_usuario } = request.body;
  const query = "SELECT * FROM usuario WHERE correo_usuario = $1";
  try {
    const results = await pool.query(query, [correo_usuario]);
    if (results.rows.length === 0) {
      return response.status(400).send('Usuario no encontrado');
    }
    const user = results.rows[0];
    const match = await bcrypt.compare(contrasena_usuario, user.contrasena_usuario);
    if (match) {
      response.status(201).send(user);
    } else {
      response.status(400).send('Contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error en login:', error);
    response.status(500).send('Error interno del servidor');
  }
};

const loginEmpleado = async (request, response) => {
  const { correo_usuario, contrasena_usuario } = request.body;
  const query = "SELECT * FROM empleado WHERE correo = $1";
  try {
    const results = await pool.query(query, [correo_usuario]);
    if (results.rows.length === 0) {
      return response.status(400).send('Empleado no encontrado');
    }
    const empleado = results.rows[0];
    const match = await bcrypt.compare(contrasena_usuario, empleado.clave);
    if (match) {
      response.status(201).send(empleado);
    } else {
      response.status(400).send('Contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error en login de empleado:', error);
    response.status(500).send('Error interno del servidor');
  }
};


const resgistrarseUsuario = (request, response) => {
  upload.single('foto_usuario')(request, response, async function (err) {
    if (err instanceof multer.MulterError) {
      return response.status(400).json({mensaje: 'Error al subir el archivo', error: err.message});
    } else if (err) {
      return response.status(500).json({mensaje: 'Error del servidor', error: err.message});
    }

    const { nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, contrasena_usuario } = request.body;
    let foto_usuario = null;

    if (request.file) {
      foto_usuario = request.file.buffer.toString('base64');
    }

    try {
      const hashedPassword = await bcrypt.hash(contrasena_usuario, saltRounds);
      const query = "INSERT INTO usuario (nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, contrasena_usuario, foto_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      const results = await pool.query(query, [nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, hashedPassword, foto_usuario]);
      response.status(201).json({mensaje: 'Usuario registrado exitosamente', usuario: results.rows[0]});
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      response.status(400).json({mensaje: 'No se pudo registrar', error: error.message});
    }
  });
}

module.exports = {
  resgistrarseUsuario,
};



module.exports = {
  loginUsuario,
  loginEmpleado,
  resgistrarseUsuario
};


