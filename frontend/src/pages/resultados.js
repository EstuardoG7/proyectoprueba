import React, { useState, useEffect } from 'react';

// Estilos en línea para la tabla
const tableStyles = {
  borderCollapse: 'collapse',
  width: '100%',
};

const thTdStyles = {
  border: '1px solid #ddd',
  padding: '8px',
};

const thStyles = {
  backgroundColor: '#f4f4f4',
};

const EjecucionPruebas = () => {
  const [resultados, setResultados] = useState([]);
  const [prueba, setPrueba] = useState('');
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [editarResultado, setEditarResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener la lista de proyectos activos
  const obtenerProyectos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/proyectos');
      const data = await response.json();
      const proyectosActivos = data.filter(proyecto => proyecto.estado === 'ACTIVO'); // Filtrar solo proyectos activos
      setProyectos(proyectosActivos);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
    setLoading(false);
  };

  // Obtener resultados de pruebas
  const obtenerResultados = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/resultados');
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error('Error al obtener los resultados:', error);
    }
    setLoading(false);
  };

  // Cargar la lista de proyectos y resultados al montar el componente
  useEffect(() => {
    obtenerProyectos();
    obtenerResultados();
  }, []);

  const agregarResultado = async (e) => {
    e.preventDefault();

    if (!proyectoSeleccionado) {
      alert('Por favor, seleccione un proyecto');
      return;
    }

    const nuevoResultado = {
      prueba,
      resultado,
      error: error || 'Sin errores',
      proyectoId: proyectoSeleccionado,
    };

    try {
      const response = await fetch('http://localhost:3001/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoResultado),
      });

      if (response.ok) {
        alert('Resultado registrado exitosamente');
        obtenerResultados();
        setPrueba('');
        setResultado('');
        setError('');
        setProyectoSeleccionado('');
      } else {
        alert('Error al registrar el resultado');
      }
    } catch (error) {
      console.error('Error al registrar el resultado:', error);
    }
  };

  const eliminarResultado = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/resultados/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Resultado eliminado exitosamente');
        obtenerResultados();
      } else {
        alert('Error al eliminar el resultado');
      }
    } catch (error) {
      console.error('Error al eliminar el resultado:', error);
    }
  };

  const iniciarEdicion = (resultado) => {
    setPrueba(resultado.prueba);
    setResultado(resultado.resultado);
    setError(resultado.error);
    setProyectoSeleccionado(resultado.proyectoId);
    setEditarResultado(resultado);
  };

  const actualizarResultado = async (e) => {
    e.preventDefault();

    if (!proyectoSeleccionado) {
      alert('Por favor, seleccione un proyecto');
      return;
    }

    const resultadoActualizado = {
      prueba,
      resultado,
      error: error || 'Sin errores',
      proyectoId: proyectoSeleccionado,
    };

    try {
      const response = await fetch(`http://localhost:3001/resultados/${editarResultado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultadoActualizado),
      });

      if (response.ok) {
        alert('Resultado actualizado exitosamente');
        obtenerResultados();
        setPrueba('');
        setResultado('');
        setError('');
        setProyectoSeleccionado('');
        setEditarResultado(null);
      } else {
        alert('Error al actualizar el resultado');
      }
    } catch (error) {
      console.error('Error al actualizar el resultado:', error);
    }
  };

  return (
    <div>
      <h2>Ejecución de Pruebas Automatizadas</h2>
      {loading && <p>Cargando...</p>}
      <form onSubmit={editarResultado ? actualizarResultado : agregarResultado}>
        <div>
          <label>Seleccionar Proyecto (Solo Activos):</label>
          <select
            value={proyectoSeleccionado}
            onChange={(e) => setProyectoSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un proyecto</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Nombre de la Prueba"
            value={prueba}
            onChange={(e) => setPrueba(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Resultado"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Errores (si aplica)"
            value={error}
            onChange={(e) => setError(e.target.value)}
          />
        </div>
        <button type="submit">{editarResultado ? 'Actualizar Resultado' : 'Registrar Resultado'}</button>
      </form>

      <h3>Resultados de Pruebas</h3>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={{ ...thTdStyles, ...thStyles }}>ID</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Nombre de la Prueba</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Resultado</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Errores</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Proyecto</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((res) => (
            <tr key={res.id}>
              <td style={thTdStyles}>{res.id}</td>
              <td style={thTdStyles}>{res.prueba}</td>
              <td style={thTdStyles}>{res.resultado}</td>
              <td style={thTdStyles}>{res.error}</td>
              <td style={thTdStyles}>
                {proyectos.find(p => p.id === res.proyectoId)?.nombre || 'No disponible'}
              </td>
              <td style={thTdStyles}>
                <button onClick={() => iniciarEdicion(res)}>Editar</button>
                <button onClick={() => eliminarResultado(res.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EjecucionPruebas;
