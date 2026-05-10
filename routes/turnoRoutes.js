const express = require('express');
const router = express.Router();
const { crearTurno, obtenerTurnos, actualizarTurno } = require('../controllers/turnoController');
const { protegerRuta } = require('../middleware/auth');

router.post('/', protegerRuta, crearTurno);
router.get('/', protegerRuta, obtenerTurnos);
router.put('/:id', protegerRuta, actualizarTurno);

module.exports = router;