const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Por favor ingrese un email válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    rol: {
      type: String,
      enum: ['paciente', 'medico', 'administrador'],
      default: 'paciente',
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Middleware que se ejecuta antes de guardar
usuarioSchema.pre('save', async function () {
  // Si la contraseña no fue modificada
  if (!this.isModified('password')) {
    return;
  }

  // Generar salt
  const salt = await bcrypt.genSalt(10);

  // Hashear contraseña
  this.password = await bcrypt.hash(this.password, salt);

});

usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);

