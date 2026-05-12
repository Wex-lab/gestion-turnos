import { useState, useEffect } from 'react';
import api from '../api';
//import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const MisTurnosMedico = () => {
  const usuarioLS = JSON.parse(sessionStorage.getItem('usuario'));
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuarioLS || usuarioLS.rol !== 'medico') {
      navigate('/dashboard');
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    cargarTurnos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarTurnos = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/api/turnos', config);
      //const res = await axios.get('http://localhost:3000/api/turnos', config);
      setTurnos(res.data.turnos);
      setError(''); // limpiamos errores anteriores
    } catch (err) {
      if (err.response) {
        // El servidor respondió con un código de error
        setError(`Error del servidor: ${err.response.data?.mensaje || err.response.statusText}`);
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión o si el backend está activo.');
      } else {
        setError(`Error inesperado: ${err.message}`);
      }
      setTurnos([]);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/api/turnos/${id}`, { estado: nuevoEstado }, config);
      //await axios.put(`http://localhost:3000/api/turnos/${id}`, { estado: nuevoEstado }, config);
      setMensaje(`Turno ${nuevoEstado} exitosamente`);
      cargarTurnos(); // refrescar
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al actualizar el turno');
    }
  };

  const [filtro, setFiltro] = useState('todos');

  const turnosFiltrados = filtro === 'todos' 
    ? turnos 
    : turnos.filter(t => t.estado === filtro);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-BO', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuarioLS} />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-medico-dark mb-6">Mis Turnos Asignados</h1>
        
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6">
          <label className="mr-2 text-gray-700 font-medium">Filtrar por estado:</label>
          <select 
            value={filtro} 
            onChange={e => setFiltro(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-medico-medium"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        {turnosFiltrados.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
            <h3 className="text-xl mb-2">📅 No tienes turnos {filtro !== 'todos' ? `en estado "${filtro}"` : 'asignados'}</h3>
            <p>Cuando un paciente solicite un turno contigo, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-medico-dark text-white">
                <tr>
                  <th className="px-6 py-3 font-semibold">Paciente</th>
                  <th className="px-6 py-3 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-3 font-semibold">Motivo</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnosFiltrados.map(turno => (
                  <tr key={turno._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{turno.paciente?.nombre || 'Sin datos'}</td>
                    <td className="px-6 py-4">{formatearFecha(turno.fechaHora)}</td>
                    <td className="px-6 py-4">{turno.motivo}</td>
                    <td className="px-6 py-4">
                      {turno.estado === 'pendiente' && <span className="text-yellow-600 font-medium">⏳ Pendiente</span>}
                      {turno.estado === 'confirmado' && <span className="text-green-600 font-medium">✔️ Confirmado</span>}
                      {turno.estado === 'cancelado' && <span className="text-red-500 font-medium">✖️ Cancelado</span>}
                    </td>
                    <td className="px-6 py-4">
                      {turno.estado === 'pendiente' && (
                        <div className="space-x-2">
                          <button 
                            onClick={() => actualizarEstado(turno._id, 'confirmado')} 
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition"
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => actualizarEstado(turno._id, 'cancelado')} 
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnosMedico;