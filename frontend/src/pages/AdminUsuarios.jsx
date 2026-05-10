import { useState, useEffect } from 'react';
import axios from 'axios';
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
      const res = await axios.get('http://localhost:3000/api/usuarios', config);
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
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, config);
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
      await axios.put(`http://localhost:3000/api/usuarios/${id}`, data, config);
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
    <div>
      <Navbar usuario={usuarioLS} />
      <div style={{ maxWidth: '800px', margin: '50px auto' }}>
        <h1>Gestión de Usuarios</h1>
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table border="1" cellPadding="5" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                {editando === u._id ? (
                  <>
                    <td><input name="nombre" value={formEdit.nombre} onChange={handleEditChange} /></td>
                    <td><input name="email" value={formEdit.email} onChange={handleEditChange} /></td>
                    <td>
                      <select name="rol" value={formEdit.rol} onChange={handleEditChange}>
                        <option value="paciente">Paciente</option>
                        <option value="medico">Médico</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </td>
                    <td>
                      <input name="password" type="password" placeholder="Nueva contraseña (opcional)" value={formEdit.password} onChange={handleEditChange} />
                      <button onClick={() => guardarEdicion(u._id)}>Guardar</button>
                      <button onClick={cancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <button onClick={() => iniciarEdicion(u)}>Editar</button>
                      <button onClick={() => eliminarUsuario(u._id)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;