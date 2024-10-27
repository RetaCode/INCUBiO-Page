const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');

const pool = require('../db/db.config');

const saltRounds = 10;

//--------------------------------------------------------------Inicio de sesión Usuario----------------------------------------------------------
const loginUsuario = async (request, response) => {
  const { correo_usuario, contrasena_usuario } = request.body;
  console.log('Intentando login para usuario:', correo_usuario);
  const query = "SELECT * FROM usuario WHERE correo_usuario = $1";
  
  try {
    const results = await pool.query(query, [correo_usuario]);
    console.log('Resultados de la consulta:', results.rows);
    
    if (results.rows.length === 0) {
      console.log('Usuario no encontrado');
      return { error: 'Usuario no encontrado' };
    }

    const user = results.rows[0];
    console.log('Comparando contraseñas para usuario:', user.correo_usuario);
    const match = await bcrypt.compare(contrasena_usuario, user.contrasena_usuario);
    
    if (match) {
      console.log('Contraseña correcta para usuario:', user.correo_usuario);
      return { usuario: user };
    } else {
      console.log('Contraseña incorrecta para usuario:', user.correo_usuario);
      return { error: 'Contraseña incorrecta' };
    }
  } catch (error) {
    console.error('Error en login:', error);
    return { error: 'Error interno del servidor' };
  }
};

//--------------------------------------------------------------Inicio de sesión Empleado---------------------------------------------------------
const loginEmpleado = async (request, response) => {
  const { correo_empleado, contrasena_empleado } = request.body;
  console.log('Intentando login para empleado:', correo_empleado);
  const query = "SELECT * FROM empleado WHERE correo_empleado = $1";
  
  try {
    const results = await pool.query(query, [correo_empleado]);
    console.log('Resultados de la consulta:', results.rows);
    
    if (results.rows.length === 0) {
      console.log('Empleado no encontrado');
      return { error: 'Empleado no encontrado' };
    }

    const empleado = results.rows[0];
    console.log('Comparando contraseñas para empleado:', empleado.correo_empleado);
    const match = await bcrypt.compare(contrasena_empleado, empleado.contrasena_empleado);
    
    if (match) {
      console.log('Contraseña correcta para empleado:', empleado.correo_empleado);
      return { empleado: empleado };
    } else {
      console.log('Contraseña incorrecta para empleado:', empleado.correo_empleado);
      return { error: 'Contraseña incorrecta' };
    }
  } catch (error) {
    console.error('Error en login de empleado:', error);
    return { error: 'Error interno del servidor' };
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

//--------------------------------------------------------------Registro de Usuario---------------------------------------------------------------
const registrarseUsuario = async (request, response) => {
  console.log('Iniciando registro de usuario');
  const { nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, contrasena_usuario } = request.body;
  let foto_usuario = null;

  console.log('Datos recibidos:', { nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario });

  if (request.file) {
    foto_usuario = request.file.buffer.toString('base64');
    console.log('Foto de usuario recibida');
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena_usuario, saltRounds);
    console.log('Contraseña hasheada');

    const query = "INSERT INTO usuario (nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, contrasena_usuario, foto_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [nombre_usuario, apellido1_usuario, apellido2_usuario, correo_usuario, hashedPassword, foto_usuario];
    
    console.log('Ejecutando query de inserción');
    const results = await pool.query(query, values);
    console.log('Usuario registrado exitosamente');
    response.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: results.rows[0] });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === '23505' && error.constraint === 'usuario_correo_usuario_key') {
      response.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
    } else {
      response.status(400).json({ mensaje: 'No se pudo registrar el usuario', error: error.message });
    }
  }
};

const registrarGerminadora = async (req, res) => {
  const { descripcion, color = 'naranja', version } = req.body;
  const codigo = `G-${Date.now().toString(36).toUpperCase()}`; // Genera un código único

  try {
      const newGerminadora = await pool.query(
          'INSERT INTO germinadora (codigo, descripcion_germinadora, color, version) VALUES ($1, $2, $3, $4) RETURNING *',
          [codigo, descripcion, color, version]
      );
      res.status(201).json(newGerminadora.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al guardar la germinadora' });
  }
};

//--------------------------------------------------------------Registro de Semilla---------------------------------------------------------------
const registrarSemilla = async (request, response) => {
  console.log('Iniciando registro de semilla');
  const { nombre_semilla, humedad_semilla, temperatura_semilla, descripcion_semilla } = request.body;
  let foto_semilla = null;

  console.log('Datos de semilla recibidos:', { nombre_semilla, humedad_semilla, temperatura_semilla, descripcion_semilla });

  if (request.file) {
    foto_semilla = request.file.buffer.toString('base64'); // Convertir imagen a Base64
    console.log('Foto de semilla recibida y convertida a Base64');
  }

  try {
    const query = "INSERT INTO semilla (nombre_semilla, foto_semilla, humedad_semilla, temperatura_semilla, descripcion_semilla) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [nombre_semilla, foto_semilla, humedad_semilla, temperatura_semilla, descripcion_semilla];
    
    console.log('Ejecutando query de inserción de semilla');
    const results = await pool.query(query, values);
    console.log('Semilla registrada exitosamente');
    response.status(201).json({ mensaje: 'Semilla registrada exitosamente', semilla: results.rows[0] });
  } catch (error) {
    console.error('Error al registrar semilla:', error);
    response.status(400).json({ mensaje: 'No se pudo registrar la semilla', error: error.message });
  }
};


module.exports = {
  loginUsuario,
  loginEmpleado,
  registrarseEmpleado,
  registrarseUsuario,
  registrarSemilla,
  registrarGerminadora
};