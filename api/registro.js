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



//--------------------------------------------------------------Registro de personas--------------------------------------------------------------
// const registrarseEmpresa = (request, response) => {
//     const {corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario} = request.body;
//     const query = "INSERT INTO eregistro (corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cedula_juridica";

//     pool.query(query, [corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario], (error, results) => {
//       console.log(error)
//         if (error) {
//           response.status(400).send({mensaje: 'No se pudo registrar'});
//         } else
//         response.status(201).send(results.rows[0])
//         //response.status(201).send()
//       })
// }


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

//--------------------------------------------------------------Administracion de vacantes--------------------------------------------------------------
// const publicarVacante = (request, response) => {
//   const { nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, fecha, nivel, beneficios, area, disponibilidad, id_empresa } = request.body;
//   const query = "INSERT INTO puesto (nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, fecha, nivel, beneficios, area, disponibilidad, id_empresa) VALUES ('"
//     +nombre_puesto+"','"
//     +descripcion+"','"
//     +requisitos+"','"
//     +funcion_laboral+"','"
//     +jornada+"',"
//     +"NOW(),'"
//     +nivel+"','"
//     +beneficios+"','"
//     +area+"',"
//     +disponibilidad+","
//     +id_empresa+")";
//   console.log(query)
//   pool.query(query, (error, results) => {
//       if (error) {
//         console.log(error)
//       } else
//       response.status(201).send({mensaje: 'Registrado'})
//       //response.status(201).send()
//     })
// }

// const traerVacantes = (request, response) => {
//   const query = "SELECT id_puesto, nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, nivel, fecha, beneficios, area from puesto where disponibilidad is false";
//   pool.query(query, (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }

// const traerVacanteEmpresa = (request, response) => {
//   const {id_empresa}  = request.query; 
//   console.log(id_empresa)
//   const query = "SELECT * from puesto where id_empresa = $1";
//   pool.query(query, [id_empresa], (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }

// const traerVacanteDisEmpresa = (request, response) => {
//   const {id_empresa}  = request.query; 
//   console.log(id_empresa)
//   const query = "SELECT * from puesto where id_empresa = $1 and disponibilidad = false";
//   pool.query(query, [id_empresa], (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }



// //--------------------------------------------------------------Administracion de recursos--------------------------------------------------------------
// const publicarRecurso = (request, response) => {
//   const {nombre_recurso, detalle_recurso, area_recurso, certificacion, 
//     semana, dia, hora, link_recurso, cedula_juridica_fk} = request.body;
//   const query = "INSERT INTO recurso (nombre_recurso, detalle_recurso, area_recurso, " +
//   "certificacion, semana, dia, hora, link_recurso, cedula_juridica_fk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

//   pool.query(query, [nombre_recurso, detalle_recurso, area_recurso, certificacion, 
//     semana, dia, hora, link_recurso, cedula_juridica_fk], (error, results) => {
//       if (error) {
//         response.status(400).send({mensaje: 'No se pudo registrar'});
//       } else
//       response.status(201).send({mensaje: 'Registrado'})
//       //response.status(201).send()
//     })
// }


// const traerRecurso = (request, response) => {
//   const query = "SELECT * from recurso";
//   pool.query(query, (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }


// const traerRecursoEmpresa = (request, response) => {
//   const {id_empresa}  = request.query; 
//   console.log(id_empresa)
//   const query = "SELECT * from recurso where cedula_juridica_fk = $1";
//   pool.query(query, [id_empresa], (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }




// /*const traerVacantesDisponibles = (request, response) => {
//   const query = "SELECT id, nombre_puesto, descripcion, requisitos, funcion_laboral, tipo_empleo, localidad, fecha, nivel, recomendaciones, beneficios, area from vacante where disponibilidad is false and id_empresa id ";
//   pool.query(query, (error, results) => {
//       if(error){
//           response.status(400);
//           console.log(error)
//       }
//       response.status(201).send(results.rows);
//   });
// }*/

module.exports = {
  loginUsuario,
  loginEmpleado,
  resgistrarseUsuario
};


// module.exports = {
//   registrarseEmpresa,
//   registrarseCandidata,
//   publicarVacante,
//   traerVacantes,
//   traerVacanteEmpresa,
//   loginUsuario,
//   loginEmpresa,
//   publicarRecurso,
//   traerRecurso,
//   traerVacanteDisEmpresa,
//   traerRecursoEmpresa
// }