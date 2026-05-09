const autorizarRol = (...roles) => {
  return (req, res, next) => {
    // req.usuario ya fue cargado por protegerRuta
    if (!req.usuario) {
      return res.status(500).json({ mensaje: 'Error de autenticación, usuario no establecido' });
    }

    // Verificar si el rol del usuario está entre los permitidos
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { autorizarRol };