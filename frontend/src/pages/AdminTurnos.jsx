import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminTurnos = () => {
  const usuarioLS = JSON.parse(sessionStorage.getItem('usuario'));
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'pendiente', 'confirmado', 'cancelado'
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuarioLS || usuarioLS.rol !== 'administrador') {
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
      setMensaje(`Turno actualizado a ${nuevoEstado}`);
      cargarTurnos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al actualizar');
    }
  };

  const turnosFiltrados = filtro === 'todos' ? turnos : turnos.filter(t => t.estado === filtro);

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-BO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <Navbar usuario={usuarioLS} />
      <div style={{ maxWidth: '900px', margin: '50px auto' }}>
        <h1>Gestión de Turnos (Admin)</h1>
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginBottom: '20px' }}>
          <label>Filtrar por estado: </label>
          <select value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha y Hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.map(turno => (
              <tr key={turno._id}>
                <td>{turno.paciente?.nombre || 'Sin datos'}</td>
                <td>{turno.medico?.nombre || 'Sin datos'}</td>
                <td>{formatearFecha(turno.fechaHora)}</td>
                <td>{turno.motivo}</td>
                <td>{turno.estado}</td>
                <td>
                  {turno.estado !== 'cancelado' && (
                    <>
                      <button onClick={() => actualizarEstado(turno._id, 'confirmado')}>Confirmar</button>
                      <button onClick={() => actualizarEstado(turno._id, 'cancelado')}>Cancelar</button>
                    </>
                  )}
                  {turno.estado === 'cancelado' && <span style={{ color: 'gray' }}>🗑️ Cancelado</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTurnos;