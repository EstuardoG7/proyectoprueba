const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Importamos la conexión a la base de datos
import {PORT} from './configure'
const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta base para comprobar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Backend del sistema de gestión de control en funcionamiento');
});

// Ruta para obtener todos los proyectos
app.get('/proyectos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM proyectos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

// Ruta para crear un nuevo proyecto
app.post('/proyectos', async (req, res) => {
  const { nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion } = req.body;

  // Validar los campos requeridos
  if (!nombre || !estado || !hito || !fechaInicio || !fechaFinal || !recurso) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const result = await db.query(
      'INSERT INTO proyectos (nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
});

// Ruta para actualizar un proyecto
app.put('/proyectos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion } = req.body;

  // Validar los campos requeridos
  if (!nombre || !estado || !hito || !fechaInicio || !fechaFinal || !recurso) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const result = await db.query(
      'UPDATE proyectos SET nombre = $1, estado = $2, hito = $3, fechaInicio = $4, fechaFinal = $5, recurso = $6, diasDuracion = $7 WHERE id = $8 RETURNING *',
      [nombre, estado, hito, fechaInicio, fechaFinal, recurso, diasDuracion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

// Ruta para eliminar un proyecto
app.delete('/proyectos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM proyectos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
