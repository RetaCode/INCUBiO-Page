const express = require("express");
const morgan = require("morgan");
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const apis2 = require('./api/registro');

const app = express();
const port = 3000;

// --------------------------------------------- Configuración de multer para manejar la carga de archivos ---------------------------------------------
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// --------------------------------------------- Clave secreta para firmar los tokens JWT ---------------------------------------------

const JWT_SECRET = '1Ncu310'; // Cambia esto por una clave segura en producción

// --------------------------------------------- Middleware para verificar el token JWT ---------------------------------------------
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization'); // Asegúrate de que el token se envía correctamente
  if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido' });
  }
};



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

// --------------------------------------------- Rutas de las Paginas ---------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get("/RegUser", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Registro.html'));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Login.html'));
});

app.get("/EscritorioEmpleado", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'escritorioEmpleado.html'));
});

app.get("/registroEmpleado", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'FormEmpleado.html'));
});




// ----------------------------------------------- LLamadas a las apis -----------------------------------------------
app.post('/servicio-login-usuario', async (req, res) => {
  console.log('Recibida solicitud de login de usuario:', req.body);
  try {
    const resultado = await apis2.loginUsuario(req);
    if (resultado.usuario) {
      const token = jwt.sign({ id: resultado.usuario.id_usuario, rol: 'usuario' }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generado:', token); // Nuevo log
      res.json({ mensaje: 'Inicio de sesión exitoso', token, usuario: resultado.usuario });
    } else {
      console.log('Error en login de usuario:', resultado.error);
      res.status(400).json({ mensaje: resultado.error });
    }
  } catch (error) {
    console.error('Error en el servidor durante login de usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

app.post('/servicio-login-empleado', async (req, res) => {
  console.log('Recibida solicitud de login de empleado:', req.body);
  try {
    const resultado = await apis2.loginEmpleado(req);
    if (resultado.empleado) {
      const token = jwt.sign({ id: resultado.empleado.id_empleado, rol: 'empleado' }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generado:', token);
      res.json({ mensaje: 'Inicio de sesión exitoso', token, empleado: resultado.empleado });
    } else {
      console.log('Error en login de empleado:', resultado.error);
      res.status(400).json({ mensaje: resultado.error });
    }
  } catch (error) {
    console.error('Error en el servidor durante login de empleado:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

app.post('/cregistrarse', upload.single('foto_usuario'), apis2.registrarseUsuario);
app.post('/registerEmployee', upload.single('foto_empleado'), apis2.registrarseEmpleado);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});