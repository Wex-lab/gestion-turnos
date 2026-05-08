const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const nuevoUsuario = new Usuario({ nombre, email, password, rol });
    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: usuarioGuardado,
    });
  } catch (error) {
    // Error de duplicado (email único)
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', detalles: mensajes });
    }
    // Otros errores
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // busca todos los documentos
    res.status(200).json({
      mensaje: 'Lista de usuarios',
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

module.exports = router;