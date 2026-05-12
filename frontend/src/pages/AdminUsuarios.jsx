import { useState, useEffect } from 'react';
import api from '../api';
//import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null); // ID del usuario en edición
  const [formEdit, setFormEdit] = useState({ nombre: '', email: '', password: '', rol: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const usuarioLS = JSON.parse(sessionStorage.getItem('usuario'));
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLS || usuarioLS.rol !== 'administrador') {
      navigate('/dashboard');
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    cargarUsuarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarUsuarios = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/api/usuarios', config);
      //const res = await axios.get('http://localhost:3000/api/usuarios', config);
      setUsuarios(res.data.usuarios);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/api/usuarios/${id}`, config);
      //await axios.delete(`http://localhost:3000/api/usuarios/${id}`, config);
      setMensaje('Usuario eliminado');
      cargarUsuarios(); // refrescar lista
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const iniciarEdicion = (usuario) => {
    setEditando(usuario._id);
    setFormEdit({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // no se muestra
      rol: usuario.rol,
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setMensaje('');
    setError('');
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const guardarEdicion = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Solo enviamos campos que no estén vacíos (menos password que puede ser opcional)
      const data = { ...formEdit };
      if (!data.password) delete data.password; // no enviar password vacío
      await api.put(`/api/usuarios/${id}`, data, config);
      //await axios.put(`http://localhost:3000/api/usuarios/${id}`, data, config);
      setMensaje('Usuario actualizado');
      setEditando(null);
      cargarUsuarios();
    } catch (err) {
      const errMsg = err.response?.data?.mensaje || 'Error al actualizar';
      setError(errMsg);
    }
  };

  if (!usuarioLS || usuarioLS.rol !== 'administrador') {
    return null; // mientras redirige
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar usuario={usuarioLS} />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-medico-dark mb-6">Gestión de Usuarios</h1>
        
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-medico-dark text-white">
              <tr>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Rol</th>
                <th className="px-6 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                  {editando === u._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          name="nombre"
                          value={formEdit.nombre}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medico-medium"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          name="email"
                          value={formEdit.email}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medico-medium"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="rol"
                          value={formEdit.rol}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medico-medium bg-white"
                        >
                          <option value="paciente">Paciente</option>
                          <option value="medico">Médico</option>
                          <option value="administrador">Administrador</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <input
                            name="password"
                            type="password"
                            placeholder="Nueva contraseña (opcional)"
                            value={formEdit.password}
                            onChange={handleEditChange}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medico-medium text-sm"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => guardarEdicion(u._id)}
                              className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition text-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-gray-800">{u.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-medico-light text-medico-dark px-2 py-0.5 rounded-full">
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => iniciarEdicion(u)}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarUsuario(u._id)}
                            className="bg-red-50 text-red-700 px-3 py-1 rounded-lg hover:bg-red-100 transition text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;