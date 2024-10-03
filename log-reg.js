const Pool = require('pg').Pool
const pool = new Pool({
  host: "localhost",
  user: "Soporte",
  password: "re2014416",
  database: "INCUBiO",
  port: 5432,
});

//--------------------------------------------------------------Inicio de sesion--------------------------------------------------------------
const loginUsuario = (request, response) => {
  const {correo, clave} = request.body;
  const query = "SELECT * from cregistro WHERE correo = $1 and clave = $2";
  pool.query(query, [correo, clave], (error, results) => {
      console.log(results.rows.length)
      if(error || results.rows.length == 0){
          response.status(400).send('Error');
      } else
          response.status(201).send(results.rows[0]);

  });
}

const loginEmpresa = (request, response) => {
  const {correo, clave} = request.body;
  const query = "SELECT * from eregistro WHERE correo = $1 and clave = $2";
  pool.query(query, [correo, clave], (error, results) => {
      console.log(results.rows.length)
      if(error || results.rows.length == 0){
          response.status(400).send('Error');
      } else
          response.status(201).send(results.rows[0]);

  });
}



//--------------------------------------------------------------Registro de personas--------------------------------------------------------------
const registrarseEmpresa = (request, response) => {
    const {corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario} = request.body;
    const query = "INSERT INTO eregistro (corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cedula_juridica";

    pool.query(query, [corre_usuario, nombre_usuario, apellido1_usuario, foto_usuaio, apellido2_usuario, contrasena_usuario], (error, results) => {
      console.log(error)
        if (error) {
          response.status(400).send({mensaje: 'No se pudo registrar'});
        } else
        response.status(201).send(results.rows[0])
        //response.status(201).send()
      })
}


const registrarseCandidata = (request, response) => {
  const { nombre, apellido1, apellido2, fecha_nacimiento, correo, clave} = request.body;
  const query = "INSERT INTO cregistro (nombre, apellido1, apellido2, fecha_nacimiento, correo, clave) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_candidata";

  pool.query(query, [nombre, apellido1, apellido2, fecha_nacimiento, correo, clave], (error, results) => {
      if (error) {
        response.status(400).send({mensaje: 'No se pudo registrar'});
        console.log(error)
      } else
      response.status(201).send(results.rows[0])
      //response.status(201).send()
    })
}



//--------------------------------------------------------------Administracion de vacantes--------------------------------------------------------------
const publicarVacante = (request, response) => {
  const { nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, fecha, nivel, beneficios, area, disponibilidad, id_empresa } = request.body;
  const query = "INSERT INTO puesto (nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, fecha, nivel, beneficios, area, disponibilidad, id_empresa) VALUES ('"
    +nombre_puesto+"','"
    +descripcion+"','"
    +requisitos+"','"
    +funcion_laboral+"','"
    +jornada+"',"
    +"NOW(),'"
    +nivel+"','"
    +beneficios+"','"
    +area+"',"
    +disponibilidad+","
    +id_empresa+")";
  console.log(query)
  pool.query(query, (error, results) => {
      if (error) {
        console.log(error)
      } else
      response.status(201).send({mensaje: 'Registrado'})
      //response.status(201).send()
    })
}

const traerVacantes = (request, response) => {
  const query = "SELECT id_puesto, nombre_puesto, descripcion, requisitos, funcion_laboral, jornada, nivel, fecha, beneficios, area from puesto where disponibilidad is false";
  pool.query(query, (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}

const traerVacanteEmpresa = (request, response) => {
  const {id_empresa}  = request.query; 
  console.log(id_empresa)
  const query = "SELECT * from puesto where id_empresa = $1";
  pool.query(query, [id_empresa], (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}

const traerVacanteDisEmpresa = (request, response) => {
  const {id_empresa}  = request.query; 
  console.log(id_empresa)
  const query = "SELECT * from puesto where id_empresa = $1 and disponibilidad = false";
  pool.query(query, [id_empresa], (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}



//--------------------------------------------------------------Administracion de recursos--------------------------------------------------------------
const publicarRecurso = (request, response) => {
  const {nombre_recurso, detalle_recurso, area_recurso, certificacion, 
    semana, dia, hora, link_recurso, cedula_juridica_fk} = request.body;
  const query = "INSERT INTO recurso (nombre_recurso, detalle_recurso, area_recurso, " +
  "certificacion, semana, dia, hora, link_recurso, cedula_juridica_fk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

  pool.query(query, [nombre_recurso, detalle_recurso, area_recurso, certificacion, 
    semana, dia, hora, link_recurso, cedula_juridica_fk], (error, results) => {
      if (error) {
        response.status(400).send({mensaje: 'No se pudo registrar'});
      } else
      response.status(201).send({mensaje: 'Registrado'})
      //response.status(201).send()
    })
}


const traerRecurso = (request, response) => {
  const query = "SELECT * from recurso";
  pool.query(query, (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}


const traerRecursoEmpresa = (request, response) => {
  const {id_empresa}  = request.query; 
  console.log(id_empresa)
  const query = "SELECT * from recurso where cedula_juridica_fk = $1";
  pool.query(query, [id_empresa], (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}




/*const traerVacantesDisponibles = (request, response) => {
  const query = "SELECT id, nombre_puesto, descripcion, requisitos, funcion_laboral, tipo_empleo, localidad, fecha, nivel, recomendaciones, beneficios, area from vacante where disponibilidad is false and id_empresa id ";
  pool.query(query, (error, results) => {
      if(error){
          response.status(400);
          console.log(error)
      }
      response.status(201).send(results.rows);
  });
}*/


module.exports = {
  registrarseEmpresa,
  registrarseCandidata,
  publicarVacante,
  traerVacantes,
  traerVacanteEmpresa,
  loginUsuario,
  loginEmpresa,
  publicarRecurso,
  traerRecurso,
  traerVacanteDisEmpresa,
  traerRecursoEmpresa
}