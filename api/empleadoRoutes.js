const express = require('express');
const router = express.Router();
const authenticateToken = require('./authMiddleware'); // Asegúrate de que la ruta sea correcta

// Ruta protegida para el escritorio del empleado
router.get('/EscritorioEmpleado', authenticateToken, (req, res) => {
  // Aquí puedes acceder a los datos del usuario autenticado desde req.user
  res.json({ mensaje: 'Bienvenido al escritorio del empleado', usuario: req.user });
});

module.exports = router;
