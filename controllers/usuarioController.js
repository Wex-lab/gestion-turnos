const Usuario = require('../models/Usuario');

// @desc    Crear un nuevo usuario
// @route   POST /api/usuarios
// @access  Public
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const nuevoUsuario = new Usuario({ nombre, email, password, rol });
    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: usuarioGuardado,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', detalles: mensajes });
    }
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/usuarios
// @access  Private (luego lo protegeremos)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json({
      mensaje: 'Lista de usuarios',
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/usuarios/:id
// @access  Private
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar usuario', error: error.message });
  }
};

// @desc    Actualizar un usuario
// @route   PUT /api/usuarios/:id
// @access  Private
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar solo campos enviados
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    if (rol) usuario.rol = rol;

    const usuarioActualizado = await usuario.save();

    res.status(200).json({
      mensaje: 'Usuario actualizado',
      usuario: usuarioActualizado,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está en uso' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', detalles: mensajes });
    }
    res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
  }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/usuarios/:id
// @access  Private
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await usuario.deleteOne(); // o Usuario.findByIdAndDelete(req.params.id)

    res.status(200).json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};