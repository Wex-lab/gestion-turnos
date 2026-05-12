import { useState } from 'react';
import api from '../api';
//import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'paciente', // por defecto
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { nombre, email, password, rol } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await api.post('/api/usuarios', formData);
      //await axios.post('http://localhost:3000/api/usuarios', formData);
      setMensaje('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/'), 2000); // redirige al login tras 2 seg
    } catch (err) {
      const errMsg = err.response?.data?.mensaje || err.message;
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-medico-dark text-center mb-6">
          Registro de Usuario
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
              Nombre:
            </label>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol:
            </label>
            <select
              name="rol"
              value={rol}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-medico-medium focus:border-transparent bg-white"
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-medico-dark text-white py-2 rounded-lg hover:bg-medico-medium transition-colors font-medium"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="text-medico-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;