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
const JWT_SECRET = '1Ncu310'; 

// --------------------------------------------- Middleware para verificar el token JWT ---------------------------------------------
const verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization o de la query string
    let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    // Si no hay token en los headers, buscar en la query string
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        mensaje: 'Acceso denegado, token no encontrado',
        redirect: '/login'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de verificación de token:', error);
    return res.status(403).json({
      mensaje: 'Token no válido',
      redirect: '/login'
    });
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
app.get("/EscritorioEmpleado", verificarToken, (req, res) => {
  if (req.user.rol !== 'empleado') {
    return res.status(403).json({ mensaje: 'Acceso no autorizado' });
  }
  res.sendFile(path.join(__dirname, 'pages', 'escritorioEmpleado.html'));
});

app.get("/registroEmpleado", verificarToken, (req, res) => {
  if (req.user.rol !== 'empleado') {
    return res.status(403).json({ mensaje: 'Acceso no autorizado' });
  }
  res.sendFile(path.join(__dirname, 'pages', 'FormEmpleado.html'));
});

app.get("/EscritorioUsuario", verificarToken, (req, res) => {
  if (req.user.rol !== 'usuario') {
    return res.status(403).json({ mensaje: 'Acceso no autorizado' });
  }
  res.sendFile(path.join(__dirname, 'pages', 'escritorioUsuaro.html'));
});

// ----------------------------------------------- LLamadas a las APIs -----------------------------------------------
// Servicio de login de usuario
app.post('/servicio-login-usuario', async (req, res) => {
  try {
    const resultado = await apis2.loginUsuario(req);
    if (resultado.usuario) {
      const token = jwt.sign(
        { 
          id: resultado.usuario.id_usuario, 
          rol: 'usuario',
          correo: resultado.usuario.correo_usuario
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      res.json({ 
        mensaje: 'Inicio de sesión exitoso', 
        token, 
        usuario: resultado.usuario 
      });
    } else {
      res.status(400).json({ mensaje: resultado.error });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// Servicio de login de empleado
app.post('/servicio-login-empleado', async (req, res) => {
  try {
    const resultado = await apis2.loginEmpleado(req);
    if (resultado.empleado) {
      const token = jwt.sign(
        { 
          id: resultado.empleado.id_empleado, 
          rol: 'empleado',
          correo: resultado.empleado.correo_empleado
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      res.json({ 
        mensaje: 'Inicio de sesión exitoso', 
        token, 
        empleado: resultado.empleado 
      });
    } else {
      res.status(400).json({ mensaje: resultado.error });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// Rutas para el registro de usuarios y empleados
app.post('/cregistrarse', upload.single('foto_usuario'), apis2.registrarseUsuario);
app.post('/registerEmployee', upload.single('foto_empleado'), apis2.registrarseEmpleado);

// --------------------------------------------- Iniciar el servidor ---------------------------------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
