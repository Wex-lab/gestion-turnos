import { useState, useEffect } from 'react';
import api from '../api';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const usuarioLS = JSON.parse(sessionStorage.getItem('usuario'));

    if (!token || !usuarioLS) {
      navigate('/');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsuario(usuarioLS);

    if (usuarioLS.rol === 'administrador') {
      const cargarUsuarios = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const res = await api.get('/api/usuarios', config);
          //const res = await axios.get('http://localhost:3000/api/usuarios', config);
          setUsuarios(res.data.usuarios);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.log('Error al cargar usuarios (posiblemente no admin)');
        }
      };
      cargarUsuarios();
    }
  }, [navigate]);

  if (!usuario) return <p className="text-center mt-10 text-gray-500">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuario} />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Saludo principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medico-dark">
            Bienvenido, {usuario.nombre}
          </h1>
          <p className="text-gray-500 mt-1">
            Has iniciado sesión como{' '}
            <span className="font-semibold text-medico-medium">{usuario.rol}</span>
          </p>
        </div>

        {/* Tarjetas de acceso rápido según rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {usuario.rol === 'paciente' && (
            <button
              onClick={() => navigate('/paciente/solicitar-turno')}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 text-left"
            >
              <h2 className="text-xl font-semibold text-medico-dark">📋 Solicitar Turno</h2>
              <p className="text-gray-600 mt-2">Elige un médico y una fecha disponible</p>
            </button>
          )}
          {usuario.rol === 'medico' && (
            <button
              onClick={() => navigate('/medico/turnos')}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 text-left"
            >
              <h2 className="text-xl font-semibold text-medico-dark">🩺 Mis Turnos</h2>
              <p className="text-gray-600 mt-2">Gestiona los turnos de tus pacientes</p>
            </button>
          )}
          {usuario.rol === 'administrador' && (
            <>
              <button
                onClick={() => navigate('/admin/usuarios')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 text-left"
              >
                <h2 className="text-xl font-semibold text-medico-dark">👥 Gestionar Usuarios</h2>
                <p className="text-gray-600 mt-2">Crear, editar o eliminar usuarios</p>
              </button>
              <button
                onClick={() => navigate('/admin/turnos')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 text-left"
              >
                <h2 className="text-xl font-semibold text-medico-dark">📊 Todos los Turnos</h2>
                <p className="text-gray-600 mt-2">Control total sobre los turnos del sistema</p>
              </button>
            </>
          )}
        </div>

        {/* Sección exclusiva para admin: lista rápida de usuarios */}
        {usuario.rol === 'administrador' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-medico-dark mb-4">Lista rápida de Usuarios</h2>
            {usuarios.length === 0 ? (
              <p className="text-gray-500">No hay usuarios registrados aún.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {usuarios.map(u => (
                  <li key={u._id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{u.nombre}</span>
                      <span className="text-gray-500 ml-2">- {u.email}</span>
                    </div>
                    <span className="text-xs bg-medico-light text-medico-dark px-2 py-0.5 rounded-full">
                      {u.rol}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;