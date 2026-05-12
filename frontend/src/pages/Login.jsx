import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await api.post('/api/auth/login', formData);
      // Guardar token en sessionStorage
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      setMensaje('Inicio de sesión exitoso. Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errMsg = err.response?.data?.mensaje || 'Error al iniciar sesión';
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-medico-dark text-center mb-6">
          Iniciar Sesión
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
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-medico-dark text-white py-2 rounded-lg hover:bg-medico-medium transition-colors font-medium"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-medico-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;