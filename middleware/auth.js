const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protegerRuta = async (req, res, next) => {

  let token;

  // Verificar header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    try {

      // Obtener token
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Buscar usuario sin password
      req.usuario = await Usuario.findById(decoded.id)
        .select('-password');

      return next();

    } catch (error) {

      return res.status(401).json({
        mensaje: 'No autorizado, token inválido'
      });

    }

  }

  // Si no existe token
  return res.status(401).json({
    mensaje: 'No autorizado, no se proporcionó token'
  });

};

module.exports = { protegerRuta };