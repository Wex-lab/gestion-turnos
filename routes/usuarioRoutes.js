const express = require('express');
const router = express.Router();
const {crearUsuario,obtenerUsuarios,obtenerUsuarioPorId,actualizarUsuario,eliminarUsuario,obtenerMedicos,} = require('../controllers/usuarioController');
const { protegerRuta } = require('../middleware/auth');
const { autorizarRol } = require('../middleware/autorizarRol');

router.get('/medicos', protegerRuta, obtenerMedicos);
router.post('/', crearUsuario);
router.get('/', protegerRuta, autorizarRol('administrador'), obtenerUsuarios);
router.get('/:id', protegerRuta, obtenerUsuarioPorId);
router.put('/:id', protegerRuta, autorizarRol('administrador', 'medico'), actualizarUsuario);
router.delete('/:id', protegerRuta, autorizarRol('administrador'), eliminarUsuario);

module.exports = router;