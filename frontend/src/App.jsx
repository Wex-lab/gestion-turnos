import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import AdminUsuarios from './pages/AdminUsuarios';
import SolicitarTurno from './pages/SolicitarTurno';
import MisTurnosMedico from './pages/MisTurnosMedico';
import AdminTurnos from './pages/AdminTurnos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/paciente/solicitar-turno" element={<SolicitarTurno />} />
        <Route path="/medico/turnos" element={<MisTurnosMedico />} />
        <Route path="/admin/turnos" element={<AdminTurnos />} />
      </Routes>
    </Router>
  );
}

export default App;