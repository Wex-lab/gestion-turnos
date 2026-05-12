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
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="text-medico-dark font-bold text-lg hover:text-medico-medium transition-colors">
          🏥 Gestión Turnos
        </Link>
        <div className="flex space-x-4">
          {usuario.rol === 'administrador' && (
            <>
              <Link to="/admin/usuarios" className="text-gray-600 hover:text-medico-medium transition-colors">
                Gestionar Usuarios
              </Link>
              <Link to="/admin/turnos" className="text-gray-600 hover:text-medico-medium transition-colors">
                Todos los Turnos
              </Link>
            </>
          )}
          {usuario.rol === 'medico' && (
            <Link to="/medico/turnos" className="text-gray-600 hover:text-medico-medium transition-colors">
              Mis Turnos
            </Link>
          )}
          {usuario.rol === 'paciente' && (
            <Link to="/paciente/solicitar-turno" className="text-gray-600 hover:text-medico-medium transition-colors">
              Solicitar Turno
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          {usuario.nombre}{' '}
          <span className="text-xs bg-medico-light text-medico-dark px-2 py-0.5 rounded-full ml-1">
            ({usuario.rol})
          </span>
        </span>
        <button
          onClick={cerrarSesion}
          className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;