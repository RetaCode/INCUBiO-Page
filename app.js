const express = require("express");
const morgan = require("morgan");
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const registro = require('./api/registro'); // Importa las funciones del archivo registro.js
const app = express();
const port = 3000;

// --------------------------------------------- Configuración de multer para manejar la carga de archivos ---------------------------------------------
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// --------------------------------------------- Clave secreta para firmar los tokens JWT ---------------------------------------------
const SECRET_KEY = '1Ncu310'; 

// --------------------------------------------- Middleware para verificar el token JWT ---------------------------------------------

function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // Debes enviar el token en el encabezado "authorization"
    


    if (!token) {
        return res.status(403).json({ mensaje: 'No se proporcionó un token' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
        req.usuarioId = decoded.id; // Guardar el ID del usuario decodificado en la solicitud
        next(); // Continuar con la siguiente función en la cadena
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
}

module.exports = verificarToken;


// --------------------------------------------- Configuración de Middleware ---------------------------------------------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

// --------------------------------------------- Logging middleware ---------------------------------------------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --------------------------------------------- Rutas públicas ---------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get("/RegUser", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Registro.html'));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Login.html'));
});

// --------------------------------------------- Rutas protegidas (necesitan token JWT) ---------------------------------------------

app.get('/verificar-token', verificarToken, (req, res) => {
  res.send({ mensaje: 'Token válido', usuario: req.usuario });
});

app.get("/EscritorioEmpleado", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'escritorioEmpleado.html'));
});

app.get("/registroEmpleado", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'FormEmpleado.html'));
});

app.get("/EscritorioUsuario", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'escritorioUsuario.html'));
});

// --------------------------------------------- Rutas de inicio de sesión y registro ---------------------------------------------
app.post('/servicio-login-usuario', async (req, res) => {
  const resultado = await registro.loginUsuario(req, res);
  if (resultado.error) {
    return res.status(400).json({ mensaje: resultado.error });
  }
  const token = jwt.sign({ id_usuario: resultado.usuario.id_usuario }, SECRET_KEY, { expiresIn: '1h' });
  return res.status(200).json({
    mensaje: 'Inicio de sesión exitoso',
    token
  });
});

app.post('/servicio-login-empleado', async (req, res) => {
  const resultado = await registro.loginEmpleado(req, res);
  if (resultado.error) {
    return res.status(400).json({ mensaje: resultado.error });
  }
  const token = jwt.sign({ id_empleado: resultado.empleado.id_empleado }, SECRET_KEY, { expiresIn: '1h' });
  return res.status(200).json({
    mensaje: 'Inicio de sesión exitoso',
    token
  });
});

app.post('/cregistrarse', upload.single('foto_usuario'), registro.registrarseUsuario);
app.post('/registerEmployee', upload.single('foto_empleado'), registro.registrarseEmpleado);

// --------------------------------------------- Iniciar el servidor ---------------------------------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
