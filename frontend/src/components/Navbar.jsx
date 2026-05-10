import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ usuario }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    navigate('/');
  };

  // Si no hay usuario, no mostramos navbar (está en login/registro)
  if (!usuario) return null;

  return (
    <nav style={{ background: '#f0f0f0', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/dashboard" style={{ marginRight: '15px' }}>Inicio</Link>
        {usuario.rol === 'administrador' && (
          <>
            <Link to="/admin/usuarios" style={{ marginRight: '15px' }}>Gestionar Usuarios</Link>
            <Link to="/admin/turnos" style={{ marginRight: '15px' }}>Todos los Turnos</Link>
          </>
        )}
        {usuario.rol === 'medico' && (
          <Link to="/medico/turnos" style={{ marginRight: '15px' }}>Mis Turnos</Link>
        )}
        {usuario.rol === 'paciente' && (
          <Link to="/paciente/solicitar-turno" style={{ marginRight: '15px' }}>Solicitar Turno</Link>
        )}
      </div>
      <div>
        <span style={{ marginRight: '15px' }}>{usuario.nombre} ({usuario.rol})</span>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;