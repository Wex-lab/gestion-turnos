const Turno = require('../models/Turno');

// Crear un turno (paciente solicita)
const crearTurno = async (req, res) => {
  try {
    // req.usuario viene del middleware protegerRuta (paciente autenticado)
    const { medico, fechaHora, motivo } = req.body;

    const nuevoTurno = new Turno({
      paciente: req.usuario._id,
      medico,
      fechaHora,
      motivo: motivo || 'Consulta general',
    });

    const turnoGuardado = await nuevoTurno.save();
    res.status(201).json({ mensaje: 'Turno solicitado', turno: turnoGuardado });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ mensaje: 'Error de validación', detalles: mensajes });
    }
    res.status(500).json({ mensaje: 'Error al crear turno', error: error.message });
  }
};

// Obtener turnos del usuario autenticado (paciente ve sus turnos, médico ve los suyos, admin ve todos)
const obtenerTurnos = async (req, res) => {
  try {
    let query = {};
    if (req.usuario.rol === 'paciente') {
      query.paciente = req.usuario._id;
    } else if (req.usuario.rol === 'medico') {
      query.medico = req.usuario._id;
    }
    // admin no filtra, ve todos

    const turnos = await Turno.find(query)
      .populate('paciente', 'nombre email')
      .populate('medico', 'nombre email')
      .sort({ fechaHora: -1 });

    res.status(200).json({ turnos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener turnos', error: error.message });
  }
};

// Actualizar estado del turno (médico confirma/cancela, admin también)
const actualizarTurno = async (req, res) => {
  try {
    const { estado } = req.body;
    const turno = await Turno.findById(req.params.id);

    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }

    // Verificar permisos: solo el médico del turno o admin pueden cambiar estado
    if (req.usuario.rol !== 'administrador' && turno.medico.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No autorizado para modificar este turno' });
    }

    turno.estado = estado || turno.estado;
    const turnoActualizado = await turno.save();
    res.status(200).json({ mensaje: 'Turno actualizado', turno: turnoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
  }
};

module.exports = { crearTurno, obtenerTurnos, actualizarTurno };