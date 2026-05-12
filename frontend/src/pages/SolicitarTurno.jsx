import { useState, useEffect } from 'react';
import api from '../api';
//import axios from 'axios';
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
      const res = await api.get('/api/usuarios/medicos', config);
      //const res = await axios.get('http://localhost:3000/api/usuarios/medicos', config);
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
      const res = await api.post('/api/turnos', form, config);
      //const res = await axios.post('http://localhost:3000/api/turnos', form, config);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuarioLS} />
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-medico-dark text-center mb-6">
            Solicitar Turno
          </h1>

          {mensaje && (
            <p className="text-green-600 text-sm mb-3 text-center">{mensaje}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Médico:
              </label>
              <select
                name="medico"
                value={form.medico}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent bg-white"
              >
                <option value="">Seleccione un médico</option>
                {medicos.map(med => (
                  <option key={med._id} value={med._id}>{med.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha y Hora:
              </label>
              <input
                type="datetime-local"
                name="fechaHora"
                value={form.fechaHora}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motivo:
              </label>
              <input
                type="text"
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-medico-dark text-white py-2 rounded-lg hover:bg-medico-medium transition-colors font-medium"
            >
              Solicitar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarTurno;