const express = require('express');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
conectarDB();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'gestion-turnos-phi.vercel.app', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const cors = require('cors');
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de Gestión de Turnos Médicos funcionando' });
});

// Rutas
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/turnos', require('./routes/turnoRoutes'));