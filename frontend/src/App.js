import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';


// Importar las páginas
import Dashboard from './pages/Dashboard.js';
import Proyectos from './pages/Proyectos';
import Escenarios from './pages/escenarios';
import Resultados from './pages/resultados';
import Defectos from './pages/defectos';
import Informes from './pages/informes.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sistema de Gestión de Pruebas</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">INICIO</Link></li>
              <li><Link to="/proyectos">Gestión de Proyectos</Link></li>
              <li><Link to="/escenarios">Escenarios</Link></li>
              <li><Link to="/resultados">Resultados</Link></li>
              <li><Link to="/defectos">Defectos</Link></li>
              <li><Link to="/informes">Informes</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/escenarios" element={<Escenarios />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/defectos" element={<Defectos />} />
            <Route path="/informes" element={<Informes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
