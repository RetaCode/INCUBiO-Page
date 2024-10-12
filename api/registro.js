const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: "localhost",
  user: "Soporte",
  password: "re2014416",
  database: "INCUBiO",
  port: 5432,
});

const saltRounds = 10;

//--------------------------------------------------------------Inicio de sesión Usuario--------------------------------------------------------------
const loginUsuario = async (request, response) => {
  const { correo_usuario, contrasena_usuario } = request.body;
  const query = "SELECT * FROM usuario WHERE correo_usuario = $1";
  
  try {
    const results = await pool.query(query, [correo_usuario]);
    
    if (results.rows.length === 0) {
      return response.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const user = results.rows[0];
    const match = await bcrypt.compare(contrasena_usuario, user.contrasena_usuario);
    
    if (match) {
      response.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: user });
    } else {
      response.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

//--------------------------------------------------------------Inicio de sesión Empleado--------------------------------------------------------------
const loginEmpleado = async (request, response) => {
  const { correo_empleado, contrasena_empleado } = request.body;
  const query = "SELECT * FROM empleado WHERE correo_empleado = $1";
  
  try {
    const results = await pool.query(query, [correo_empleado]);
    
    if (results.rows.length === 0) {
      return response.status(400).json({ mensaje: 'Empleado no encontrado' });
    }

    const empleado = results.rows[0];
    const match = await bcrypt.compare(contrasena_empleado, empleado.contrasena_empleado);
    
    if (match) {
      response.status(200).json({ mensaje: 'Inicio de sesión exitoso', empleado: empleado });
    } else {
      response.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login de empleado:', error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

//--------------------------------------------------------------Registro de Empleado--------------------------------------------------------------
const registrarseEmpleado = async (request, response) => {
  const { nombre_empleado, apellido1_empleado, apellido2_empleado, cedula_empleado, correo_empleado, contrasena_empleado, telefono } = request.body;
  let foto_empleado = null;

  if (request.file) {
    foto_empleado = request.file.buffer.toString('base64');
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena_empleado, saltRounds);
    const query = "INSERT INTO empleado (nombre_empleado, apellido1_empleado, apellido2_empleado, cedula_empleado, correo_empleado, contrasena_empleado, telefono, foto_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values = [nombre_empleado, apellido1_empleado, apellido2_empleado, cedula_empleado, correo_empleado, hashedPassword, telefono, foto_empleado];
    
    const results = await pool.query(query, values);
    response.status(201).json({ mensaje: 'Empleado registrado exitosamente', empleado: results.rows[0] });
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    if (error.code === '23505' && error.constraint === 'empleado_correo_empleado_key') {
      response.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
    } else if (error.code === '23505' && error.constraint === 'empleado_cedula_empleado_key') {
      response.status(400).json({ mensaje: 'La cédula ya está registrada' });
    } else {
      response.status(400).json({ mensaje: 'No se pudo registrar el empleado', error: error.message });
    }
  }
};

// Registro de Usuario (placeholder)
const registrarseUsuario = async (request, response) => {
  response.status(501).send('Función no implementada');
};

module.exports = {
  loginUsuario,
  loginEmpleado,
  registrarseEmpleado,
  registrarseUsuario
};
