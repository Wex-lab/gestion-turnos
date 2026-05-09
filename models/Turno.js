const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    medico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    fechaHora: {
      type: Date,
      required: [true, 'La fecha y hora son obligatorias'],
    },
    motivo: {
      type: String,
      default: 'Consulta general',
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'cancelado'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Turno', turnoSchema);