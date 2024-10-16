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

// Componente para la gestión de escenarios
const Escenarios = () => {
  const [escenarios, setEscenarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [casos, setCasos] = useState('');
  const [datos, setDatos] = useState('');
  const [criterios, setCriterios] = useState('');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [editando, setEditando] = useState(null); // ID del escenario que se está editando
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga

  // Obtener la lista de escenarios
  const obtenerEscenarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/escenarios');
      const data = await response.json();
      setEscenarios(data);
    } catch (error) {
      console.error('Error al obtener los escenarios:', error);
    }
    setLoading(false);
  };

  // Obtener solo proyectos activos
  const obtenerProyectos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/proyectos');
      const data = await response.json();
      const proyectosActivos = data.filter(proyecto => proyecto.estado === 'ACTIVO');
      setProyectos(proyectosActivos);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
    setLoading(false);
  };

  // Cargar escenarios y proyectos al montar el componente
  useEffect(() => {
    obtenerEscenarios();
    obtenerProyectos();
  }, []);

  // Función para agregar o actualizar un escenario
  const agregarOActualizarEscenario = async (e) => {
    e.preventDefault();
    const escenario = {
      descripcion,
      casos,
      datos,
      criterios,
      proyectoId: proyectoSeleccionado,
    };

    setLoading(true);
    try {
      if (editando) {
        // Actualizar un escenario existente
        const response = await fetch(`http://localhost:3001/escenarios/${editando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(escenario),
        });

        if (response.ok) {
          alert('Escenario actualizado exitosamente');
        } else {
          alert('Error al actualizar el escenario');
        }
      } else {
        // Agregar un nuevo escenario
        const response = await fetch('http://localhost:3001/escenarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(escenario),
        });

        if (response.ok) {
          alert('Escenario agregado exitosamente');
        } else {
          alert('Error al agregar el escenario');
        }
      }

      resetForm();
      obtenerEscenarios(); // Refrescar la lista de escenarios
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Función para llenar el formulario con los datos del escenario a editar
  const handleEdit = (escenario) => {
    setDescripcion(escenario.descripcion);
    setCasos(escenario.casos);
    setDatos(escenario.datos);
    setCriterios(escenario.criterios);
    setProyectoSeleccionado(escenario.proyectoId);
    setEditando(escenario.id); // Establecer el ID del escenario que se está editando
  };

  // Función para eliminar un escenario
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/escenarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Escenario eliminado exitosamente');
        obtenerEscenarios(); // Refrescar la lista de escenarios
      } else {
        alert('Error al eliminar el escenario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Función para restablecer el formulario
  const resetForm = () => {
    setDescripcion('');
    setCasos('');
    setDatos('');
    setCriterios('');
    setProyectoSeleccionado('');
    setEditando(null); // Reiniciar el modo de edición
  };

  return (
    <div>
      <h2>Gestión de Escenarios</h2>
      {loading && <p>Cargando...</p>}
      <form onSubmit={agregarOActualizarEscenario}>
        <div>
          <label>Descripción del Escenario:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Casos de Prueba:</label>
          <input
            type="text"
            value={casos}
            onChange={(e) => setCasos(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Datos de Prueba:</label>
          <input
            type="text"
            value={datos}
            onChange={(e) => setDatos(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Criterios de Aceptación:</label>
          <input
            type="text"
            value={criterios}
            onChange={(e) => setCriterios(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">
          {editando ? 'Actualizar Escenario' : 'Agregar Escenario'}
        </button>
        {editando && <button type="button" onClick={resetForm}>Cancelar Edición</button>}
      </form>

      <h3>Lista de Escenarios</h3>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={{ ...thTdStyles, ...thStyles }}>ID</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Descripción</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Casos</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Datos</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Criterios</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Proyecto</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {escenarios.map((escenario) => (
            <tr key={escenario.id}>
              <td style={thTdStyles}>{escenario.id}</td>
              <td style={thTdStyles}>{escenario.descripcion}</td>
              <td style={thTdStyles}>{escenario.casos}</td>
              <td style={thTdStyles}>{escenario.datos}</td>
              <td style={thTdStyles}>{escenario.criterios}</td>
              <td style={thTdStyles}>
                {proyectos.find(p => p.id === escenario.proyectoId)?.nombre || 'No disponible'}
              </td>
              <td style={thTdStyles}>
                <button onClick={() => handleEdit(escenario)}>Editar</button>
                <button onClick={() => handleDelete(escenario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Escenarios;
