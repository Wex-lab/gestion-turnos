import { useState, useEffect } from 'react';
import axios from 'axios';
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
          const res = await axios.get('http://localhost:3000/api/usuarios', config);
          setUsuarios(res.data.usuarios);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.log('Error al cargar usuarios (posiblemente no admin)');
        }
      };
      cargarUsuarios();
    }
  }, [navigate]);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <Navbar usuario={usuario} />
      <div style={{ maxWidth: '800px', margin: '50px auto' }}>
        <h1>Bienvenido, {usuario.nombre}</h1>
        <p>Rol: {usuario.rol}</p>

        {usuario.rol === 'administrador' && (
          <div>
            <h2>Lista rápida de Usuarios</h2>
            <ul>
              {usuarios.map(u => (
                <li key={u._id}>{u.nombre} - {u.email} ({u.rol})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;