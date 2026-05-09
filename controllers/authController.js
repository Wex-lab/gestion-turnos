const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Autenticar usuario y devolver token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    // Comparar contraseña con bcrypt
    const passwordCorrecta = await usuario.compararPassword(password); // Método que definiremos en el modelo

    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: generarToken(usuario._id),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = { login };