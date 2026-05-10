import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SolicitarTurno = () => {
  const usuarioLS = JSON.parse(sessionStorage.getItem('usuario'));
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({
    medico: '',
    fechaHora: '',
    motivo: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuarioLS || usuarioLS.rol !== 'paciente') {
      navigate('/dashboard');
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    cargarMedicos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarMedicos = async () => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:3000/api/usuarios/medicos', config);
    setMedicos(res.data.medicos);
  } catch (err) {
  if (err.response) {
    setError(err.response.data?.mensaje || 'Error del servidor');
  } else if (err.request) {
    setError('No se pudo conectar con el servidor.');
  } else {
    setError('Error al enviar la solicitud.');
  }
}
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post('http://localhost:3000/api/turnos', form, config);
      setMensaje('Turno solicitado exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
  if (err.response) {
    setError(err.response.data?.mensaje || 'Error del servidor');
  } else if (err.request) {
    setError('No se pudo conectar con el servidor.');
  } else {
    setError('Error al enviar la solicitud.');
  }
}
  };

  return (
    <div>
      <Navbar usuario={usuarioLS} />
      <div style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h1>Solicitar Turno</h1>
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Médico:</label>
            <select name="medico" value={form.medico} onChange={handleChange} required>
              <option value="">Seleccione un médico</option>
              {medicos.map(med => (
                <option key={med._id} value={med._id}>{med.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha y Hora:</label>
            <input type="datetime-local" name="fechaHora" value={form.fechaHora} onChange={handleChange} required />
          </div>
          <div>
            <label>Motivo:</label>
            <input type="text" name="motivo" value={form.motivo} onChange={handleChange} />
          </div>
          <button type="submit">Solicitar</button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarTurno;