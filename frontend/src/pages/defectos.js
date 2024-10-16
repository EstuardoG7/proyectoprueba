import React, { useState, useEffect } from 'react';
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
// Estados posibles de un defecto
const estadosDefecto = ['Abierto', 'En Progreso', 'Cerrado'];

// Niveles de clasificación de defectos
const clasificacionesDefecto = ['Crítico', 'Mayor', 'Menor'];

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

const Defectos = () => {
  const [defectos, setDefectos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [mostrarProyectos, setMostrarProyectos] = useState(false);

  // Estados para el formulario
  const [descripcion, setDescripcion] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [miembroAsignado, setMiembroAsignado] = useState('');
  const [estado, setEstado] = useState('');
  const [solucion, setSolucion] = useState('');

  // Estado para manejar la edición de defectos
  const [defectoEdicion, setDefectoEdicion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener la lista de defectos
  const obtenerDefectos = async () => {
    setLoading(true);
    try {

      const response = await fetch(`${URL}/ping`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los defectos');
      }
      const data = await response.json();
      setDefectos(data);
    } catch (error) {
      alert(`Error al obtener los defectos: ${error.message}`);
      console.error('Error al obtener los defectos:', error);
    }
    setLoading(false);
  };

  // Obtener solo proyectos activos
  const obtenerProyectos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/ping`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los proyectos');
      }
      const data = await response.json();
      const proyectosActivos = data.filter(proyecto => proyecto.estado === 'ACTIVO');
      setProyectos(proyectosActivos);
    } catch (error) {
      alert(`Error al obtener los proyectos: ${error.message}`);
      console.error('Error al obtener los proyectos:', error);
    }
    setLoading(false);
  };

  // Cargar defectos y proyectos al montar el componente
  useEffect(() => {
    obtenerDefectos();
    obtenerProyectos();
  }, []);

  const agregarDefecto = async (e) => {
    e.preventDefault();
    const nuevoDefecto = {
      descripcion,
      clasificacion,
      miembroAsignado,
      estado,
      solucion,
      proyectoId: proyectoSeleccionado,
    };

    setLoading(true);
    try {
      const response = defectoEdicion
        ? await fetch(`${URL}/ping ${defectoEdicion.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoDefecto),
          })
        : await fetch(`${URL}/ping`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoDefecto),
          });

      if (response.ok) {
        alert(defectoEdicion ? 'Defecto actualizado exitosamente' : 'Defecto agregado exitosamente');
        obtenerDefectos(); // Refrescar la lista de defectos
      } else {
        alert('Error al agregar o actualizar el defecto');
      }

      resetForm();
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const eliminarDefecto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este defecto?')) {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/ping${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Defecto eliminado exitosamente');
          obtenerDefectos(); // Refrescar la lista de defectos
        } else {
          alert('Error al eliminar el defecto');
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
      }
      setLoading(false);
    }
  };

  const editarDefecto = (defecto) => {
    setDefectoEdicion(defecto);
    setDescripcion(defecto.descripcion);
    setClasificacion(defecto.clasificacion);
    setMiembroAsignado(defecto.miembroAsignado);
    setEstado(defecto.estado);
    setSolucion(defecto.solucion);
    setProyectoSeleccionado(defecto.proyectoId);
  };

  const seleccionarProyecto = (id) => {
    setProyectoSeleccionado(id);
    setMostrarProyectos(false);
  };

  const resetForm = () => {
    setDescripcion('');
    setClasificacion('');
    setMiembroAsignado('');
    setEstado('');
    setSolucion('');
    setProyectoSeleccionado('');
    setDefectoEdicion(null); // Resetea el defecto en edición
  };

  return (
    <div>
      <h2>Gestión de Defectos</h2>
      {loading && <p>Cargando...</p>}
      <form onSubmit={agregarDefecto}>
        <input
          type="text"
          placeholder="Descripción del Defecto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <select
          value={clasificacion}
          onChange={(e) => setClasificacion(e.target.value)}
          required
        >
          <option value="">Clasificación</option>
          {clasificacionesDefecto.map((clasif, index) => (
            <option key={index} value={clasif}>{clasif}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Asignar a"
          value={miembroAsignado}
          onChange={(e) => setMiembroAsignado(e.target.value)}
          required
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Estado</option>
          {estadosDefecto.map((estadoDefecto, index) => (
            <option key={index} value={estadoDefecto}>{estadoDefecto}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Solución del Defecto"
          value={solucion}
          onChange={(e) => setSolucion(e.target.value)}
        />
        <div>
          <button type="button" onClick={() => setMostrarProyectos(true)}>
            Seleccionar Proyecto
          </button>
          {proyectoSeleccionado && (
            <span> Proyecto Seleccionado: {proyectos.find(p => p.id === proyectoSeleccionado)?.nombre} </span>
          )}
        </div>
        <button type="submit">{defectoEdicion ? 'Actualizar Defecto' : 'Agregar Defecto'}</button>
      </form>

      {/* Modal o menú de selección de proyectos */}
      {mostrarProyectos && (
        <div className="modal">
          <h3>Seleccionar Proyecto</h3>
          <ul>
            {proyectos.map(proyecto => (
              <li key={proyecto.id}>
                <button onClick={() => seleccionarProyecto(proyecto.id)}>
                  {proyecto.nombre}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setMostrarProyectos(false)}>Cerrar</button>
        </div>
      )}

      <h3>Lista de Defectos</h3>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={{ ...thTdStyles, ...thStyles }}>ID</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Descripción</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Clasificación</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Asignado a</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Estado</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Solución</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Proyecto</th>
            <th style={{ ...thTdStyles, ...thStyles }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {defectos.map(defecto => (
            <tr key={defecto.id}>
              <td style={thTdStyles}>{defecto.id}</td>
              <td style={thTdStyles}>{defecto.descripcion}</td>
              <td style={thTdStyles}>{defecto.clasificacion}</td>
              <td style={thTdStyles}>{defecto.miembroAsignado}</td>
              <td style={thTdStyles}>{defecto.estado}</td>
              <td style={thTdStyles}>{defecto.solucion}</td>
              <td style={thTdStyles}>{proyectos.find(p => p.id === defecto.proyectoId)?.nombre}</td>
              <td style={thTdStyles}>
                <button onClick={() => editarDefecto(defecto)}>Editar</button>
                <button onClick={() => eliminarDefecto(defecto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Defectos;
