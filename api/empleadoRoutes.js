const express = require('express');
const router = express.Router();

// Ruta protegida para el escritorio del empleado
router.get('/EscritorioEmpleado', authenticateToken, (req, res) => {
  // Aquí puedes acceder a los datos del usuario autenticado desde req.user
  res.json({ mensaje: 'Bienvenido al escritorio del empleado', usuario: req.user });
});

module.exports = router;
