import { useState, useEffect } from 'react';
import axios from 'axios';
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
    const res = await axios.get('http://localhost:3000/api/turnos', config);
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
      await axios.put(`http://localhost:3000/api/turnos/${id}`, { estado: nuevoEstado }, config);
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
    <div>
      <Navbar usuario={usuarioLS} />
      <div style={{ maxWidth: '800px', margin: '50px auto' }}>
        <h1>Mis Turnos Asignados</h1>
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

        {turnosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3>📅 No tienes turnos {filtro !== 'todos' ? `en estado "${filtro}"` : 'asignados'}</h3>
          <p>Cuando un paciente solicite un turno contigo, aparecerá aquí.</p>
        </div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Paciente</th>
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
                <td>{formatearFecha(turno.fechaHora)}</td>
                <td>{turno.motivo}</td>
                <td>{turno.estado}</td>
                <td>
                  {turno.estado === 'pendiente' && (
                    <>
                      <button onClick={() => actualizarEstado(turno._id, 'confirmado')}>✅ Confirmar</button>
                      <button onClick={() => actualizarEstado(turno._id, 'cancelado')}>❌ Cancelar</button>
                    </>
                  )}
                  {turno.estado === 'confirmado' && <span style={{ color: 'green' }}>✔️ Confirmado</span>}
                  {turno.estado === 'cancelado' && <span style={{ color: 'red' }}>✖️ Cancelado</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
};

export default MisTurnosMedico;