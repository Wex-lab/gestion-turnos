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
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Registro de Usuario</h1>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select name="rol" value={rol} onChange={handleChange}>
            <option value="paciente">Paciente</option>
            <option value="medico">Médico</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Registro;