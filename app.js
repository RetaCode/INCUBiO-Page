const express = require("express");
const morgan = require("morgan");
const multer = require('multer');
const path = require('path');
const apis2 = require('./api/registro');

const app = express();
const port = 3000;

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// ----------------------------------------------- Visualizar las rutas en la terminal -----------------------------------------------
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

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

app.get("/registroEmpleado", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'FormEmpleado.html'));
});


// ----------------------------------------------- LLamadas a las apis -----------------------------------------------
app.post('/servicio-login-usuario', apis2.loginUsuario);
app.post('/servicio-login-empleado', apis2.loginEmpleado);
app.post('/cregistrarse', apis2.registrarseUsuario);
app.post('/registerEmployee', upload.single('foto_empleado'), apis2.registrarseEmpleado);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});