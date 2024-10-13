const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // El formato de autorización debe ser: "Bearer <token>"

  if (token == null) return res.status(401).json({ mensaje: 'Acceso denegado' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token no válido' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
