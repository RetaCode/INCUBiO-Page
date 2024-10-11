const express = require("express");
const morgan = require("morgan"); 
const jwt = require('jsonwebtoken');  
const bcrypt = require('bcrypt'); 
const app = express();
const port = 3000;

// const apis1 = require('./api/login');
const apis2 = require('./api/registro');

const Pool = require("pg").Pool;
const pool = new Pool({
  host: "localhost",
  user: "Soporte",
  password: "re2014416",
  database: "INCUBiO",
  port: 5432,
});

// ----------------------------------------------- Visualizar las rutas en la terminal -----------------------------------------------
app.use(morgan('tiny'));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ----------------------------------------------- Rutas de las Paginas -----------------------------------------------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get("/RegUser", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Registro.html'));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Login.html'));
});



app.get("/EscritorioEmpleado", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'escritorioEmpleado.html'));
});



app.get("/plantas", (req, res) => {
  res.send("");
});

app.use('/static', express.static (__dirname+'/static'));
const path = require('path');
app.use('static', express.static(path.join(__dirname, 'static'))); 

// ----------------------------------------------- LLamadas a las apis -----------------------------------------------

app.post('/servicio-login-usuario', apis2.loginUsuario);
app.post('/servicio-login-empleado', apis2.loginEmpleado);

app.post('/cregistrarse', apis2.resgistrarseUsuario);




app.listen(3000, () => {
  console.log("Server on port 3000");
});
