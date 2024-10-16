import React, { useState, useEffect } from 'react';

// Estilos en línea
const containerStyles = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f4f4f4',
  minHeight: '100vh',
};

const detallesContainerStyles = {
  marginTop: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const buttonStyles = {
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007BFF',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.3s',
  display: 'block',
  margin: '20px auto',
  fontSize: '16px',
};

const proyectoItemStyles = {
  marginBottom: '15px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#e9ecef',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const seleccionarButtonStyles = {
  padding: '5px 10px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const sectionHeaderStyles = {
  backgroundColor: '#007BFF',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '20px',
};

const detalleEstilo = {
  marginBottom: '10px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#f8f9fa',
  borderLeft: '5px solid #007BFF',
};

// Componente Informes
const Informes = () => {
  const [datosProyectos, setDatosProyectos] = useState([]);
  const [escenarios, setEscenarios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [defectos, setDefectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mostrarProyectos, setMostrarProyectos] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const [proyectosResponse, escenariosResponse, resultadosResponse, defectosResponse] = await Promise.all([
          fetch('http://localhost:3001/proyectos'),
          fetch('http://localhost:3001/planes'),
          fetch('http://localhost:3001/resultados'),
          fetch('http://localhost:3001/defectos'),
        ]);

        if (!proyectosResponse.ok || !escenariosResponse.ok || !resultadosResponse.ok || !defectosResponse.ok) {
          throw new Error('Error al obtener datos');
        }

        const proyectosData = await proyectosResponse.json();
        const escenariosData = await escenariosResponse.json();
        const resultadosData = await resultadosResponse.json();
        const defectosData = await defectosResponse.json();

        setDatosProyectos(proyectosData);
        setEscenarios(escenariosData);
        setResultados(resultadosData);
        setDefectos(defectosData);
      } catch (error) {
        setError(true);
        console.error('Error al obtener los datos:', error);
      }
      setLoading(false);
    };

    obtenerDatos();
  }, []);

  const manejarClick = () => {
    setMostrarProyectos(true);
  };

  const seleccionarProyecto = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    alert(`Seleccionaste el proyecto: ${proyecto.nombre}`);
  };

  const calcularMetrics = () => {
    if (!proyectoSeleccionado) return {};

    const escenariosFiltrados = escenarios.filter(escenario => escenario.proyectoId === proyectoSeleccionado.id);
    const resultadosFiltrados = resultados.filter(resultado => resultado.proyectoId === proyectoSeleccionado.id);
    const defectosFiltrados = defectos.filter(defecto => defecto.proyectoId === proyectoSeleccionado.id);

    // Calcular cobertura de pruebas
    const totalEscenarios = escenariosFiltrados.length;
    const totalResultados = resultadosFiltrados.length;
    const coberturaPruebas = totalEscenarios > 0 ? (totalResultados / totalEscenarios) * 100 : 0;

    // Calcular tasa de defectos encontrados
    const totalDefectos = defectosFiltrados.length;
    const defectosCorregidos = defectosFiltrados.filter(defecto => defecto.estado === 'Corregido').length;
    const tasaDefectos = totalDefectos > 0 ? (defectosCorregidos / totalDefectos) * 100 : 0;

    // Calcular tiempo promedio de resolución de defectos
    const tiemposResolucion = defectosFiltrados.map(defecto => defecto.tiempoResolucion || 0);
    const tiempoPromedioResolucion = tiemposResolucion.length > 0 ? (tiemposResolucion.reduce((a, b) => a + b, 0) / tiemposResolucion.length).toFixed(2) : 0;

    return { coberturaPruebas, tasaDefectos, tiempoPromedioResolucion };
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error al cargar los proyectos</p>;

  const metrics = calcularMetrics();

  return (
    <div style={containerStyles}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Informes y Métricas</h2>
      <button onClick={manejarClick} style={buttonStyles}>
        Seleccionar Proyecto
      </button>

      {mostrarProyectos && (
        <div style={detallesContainerStyles}>
          <h4>Proyectos:</h4>
          {datosProyectos.map((proyecto) => (
            <div key={proyecto.id} style={proyectoItemStyles}>
              <div>
                <strong>ID:</strong> {proyecto.id} - <strong>Nombre:</strong> {proyecto.nombre} - <strong>Estado:</strong> {proyecto.estado}
              </div>
              <button
                onClick={() => seleccionarProyecto(proyecto)}
                style={seleccionarButtonStyles}
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      )}

      {proyectoSeleccionado && (
        <div style={detallesContainerStyles}>
          <h4 style={sectionHeaderStyles}>Detalles del Proyecto Seleccionado:</h4>
          <p><strong>ID:</strong> {proyectoSeleccionado.id}</p>
          <p><strong>Nombre:</strong> {proyectoSeleccionado.nombre}</p>
          <p><strong>Hito:</strong> {proyectoSeleccionado.hito}</p>
          <p><strong>Duración:</strong> {proyectoSeleccionado.diasDuracion} días</p>
          <p><strong>Recursos:</strong> {proyectoSeleccionado.recurso}</p>

          <h5 style={sectionHeaderStyles}>Métricas de Calidad:</h5>
          <p><strong>Cobertura de Pruebas:</strong> {metrics.coberturaPruebas.toFixed(1)}%</p>
          <p><strong>Tasa de Defectos Encontrados:</strong> {metrics.tasaDefectos.toFixed(2)}%</p>
          <p><strong>Tiempo Promedio de Resolución de Defectos:</strong> {metrics.tiempoPromedioResolucion} días</p>

          <h5 style={sectionHeaderStyles}>Escenarios de Prueba:</h5>
          {escenarios.filter(escenario => escenario.proyectoId === proyectoSeleccionado.id).length > 0 ? (
            escenarios.filter(escenario => escenario.proyectoId === proyectoSeleccionado.id).map((escenario) => (
              <div key={escenario.id} style={detalleEstilo}>
                <p><strong>Descripción:</strong> {escenario.descripcion}</p>
                <p><strong>Casos:</strong> {escenario.casos}</p>
                <p><strong>Datos:</strong> {escenario.datos}</p>
                <p><strong>Criterios:</strong> {escenario.criterios}</p>
              </div>
            ))
          ) : (
            <p>No hay escenarios para este proyecto.</p>
          )}

          <h5 style={sectionHeaderStyles}>Resultados de Pruebas:</h5>
          {resultados.filter(resultado => resultado.proyectoId === proyectoSeleccionado.id).length > 0 ? (
            resultados.filter(resultado => resultado.proyectoId === proyectoSeleccionado.id).map((resultado) => (
              <div key={resultado.id} style={detalleEstilo}>
                <p><strong>Resultado:</strong> {resultado.resultado}</p>
                <p><strong>Comentarios:</strong> {resultado.comentarios}</p>
              </div>
            ))
          ) : (
            <p>No hay resultados de pruebas para este proyecto.</p>
          )}

          <h5 style={sectionHeaderStyles}>Defectos:</h5>
          {defectos.filter(defecto => defecto.proyectoId === proyectoSeleccionado.id).length > 0 ? (
            defectos.filter(defecto => defecto.proyectoId === proyectoSeleccionado.id).map((defecto) => (
              <div key={defecto.id} style={detalleEstilo}>
                <p><strong>Descripción:</strong> {defecto.descripcion}</p>
                <p><strong>Estado:</strong> {defecto.estado}</p>
                <p><strong>Tiempo de Resolución:</strong> {defecto.tiempoResolucion} días</p>
              </div>
            ))
          ) : (
            <p>No hay defectos registrados para este proyecto.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Informes;
