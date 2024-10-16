import React, { useState, useEffect } from 'react';

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

// Estilos para los estados
const estadoStyles = {
  ACTIVO: { color: 'green', fontWeight: 'bold' },
  FINALIZADO: { color: 'red', fontWeight: 'bold' },
};

function Proyectos() {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');
  const [hito, setHito] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [recurso, setRecurso] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [diasDuracion, setDiasDuracion] = useState(0);
  const [loading, setLoading] = useState(false);

  // Función para obtener proyectos desde el backend
  const obtenerProyectos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/ping`);
      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
    setLoading(false);
  };

  // Llama a obtenerProyectos cuando el componente se monte
  useEffect(() => {
    obtenerProyectos();
  }, []);

  // Función para calcular la duración en días entre fechaInicio y fechaFinal
  const calcularDuracion = (inicio, final) => {
    if (inicio && final) {
      const fechaInicio = new Date(inicio);
      const fechaFinal = new Date(final);
      const diferencia = Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24));
      return diferencia;
    }
    return 0;
  };

  // Efecto para recalcular la duración cuando cambian las fechas
  useEffect(() => {
    setDiasDuracion(calcularDuracion(fechaInicio, fechaFinal));
  }, [fechaInicio, fechaFinal]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fechaFinal) < new Date(fechaInicio)) {
      alert('La fecha final no puede ser anterior a la fecha de inicio');
      return;
    }

    const proyecto = { nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion };

    setLoading(true);
    try {
      if (editando) {
        // Si estamos editando un proyecto, enviamos una solicitud de actualización
        const response = await fetch(`${URL}/ping${editando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(proyecto),
        });

        if (response.ok) {
          alert('Proyecto actualizado exitosamente');
          resetForm();
          obtenerProyectos(); // Refresca la lista de proyectos
        } else {
          alert('Error al actualizar el proyecto');
        }
      } else {
        // Si no estamos editando, enviamos una solicitud de creación
        const response = await fetch(`${URL}/ping`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(proyecto),
        });

        if (response.ok) {
          alert('Proyecto guardado exitosamente');
          resetForm();
          obtenerProyectos(); // Refresca la lista de proyectos
        } else {
          alert('Error al guardar el proyecto');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/ping${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Proyecto eliminado exitosamente');
        obtenerProyectos(); // Refresca la lista de proyectos
      } else {
        alert('Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleEdit = (proyecto) => {
    setNombre(proyecto.nombre);
    setEstado(proyecto.estado);
    setHito(proyecto.hito);
    setFechaInicio(proyecto.fechaInicio);
    setFechaFinal(proyecto.fechaFinal);
    setRecurso(proyecto.recurso);
    setDiasDuracion(calcularDuracion(proyecto.fechaInicio, proyecto.fechaFinal));
    setEditando(proyecto.id);
  };

  const resetForm = () => {
    setNombre('');
    setEstado('');
    setHito('');
    setFechaInicio('');
    setFechaFinal('');
    setRecurso('');
    setDiasDuracion(0);
    setEditando(null);
  };

  return (
    <div>
      <h2>Gestión de Proyectos</h2>
      {loading && <p>Cargando...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Proyecto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estado:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">Seleccionar estado</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>
        <div>
          <label>Hito:</label>
          <input
            type="text"
            value={hito}
            onChange={(e) => setHito(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha Final:</label>
          <input
            type="date"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Recurso:</label>
          <input
            type="text"
            value={recurso}
            onChange={(e) => setRecurso(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Duración (días):</label>
          <input
            type="text"
            value={diasDuracion}
            readOnly
          />
        </div>
        <button type="submit">
          {editando ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
        </button>
        {editando && <button type="button" onClick={resetForm}>Cancelar Edición</button>}
      </form>

      <h3>Lista de Proyectos</h3>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={{ ...thTdStyles, ...thStyles }}>ID</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Nombre</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Estado</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Hito</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Fecha de Inicio</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Fecha Final</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Duración (días)</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Recurso</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((proyecto) => (
            <tr key={proyecto.id}>
              <td style={thTdStyles}>{proyecto.id}</td>
              <td style={thTdStyles}>{proyecto.nombre}</td>
              <td style={{ ...thTdStyles, ...estadoStyles[proyecto.estado] }}>{proyecto.estado}</td>
              <td style={thTdStyles}>{proyecto.hito}</td>
              <td style={thTdStyles}>{new Date(proyecto.fechaInicio).toLocaleDateString()}</td>
              <td style={thTdStyles}>{new Date(proyecto.fechaFinal).toLocaleDateString()}</td>
              <td style={thTdStyles}>{proyecto.diasDuracion}</td>
              <td style={thTdStyles}>{proyecto.recurso}</td>
              <td style={thTdStyles}>
                <button onClick={() => handleEdit(proyecto)}>Editar</button>
                <button onClick={() => handleDelete(proyecto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Proyectos;
