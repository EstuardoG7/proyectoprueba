import React from 'react';

const Dashboard = () => {
  // URL de la imagen que deseas usar
  const dashboardImageUrl = 'https://pandorafms.com/blog/wp-content/uploads/2018/10/Breve-Historia-de-la-Gestion-de-Proyectos.jpg';

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>PANEL INICIO</h2>
      <p>Bienvenido al panel principal del sistema de gestión de pruebas</p>
      <img 
        src={dashboardImageUrl} 
        alt="Dashboard" 
        style={{ 
          width: '80%', 
          height: 'auto', // Mantiene la proporción
          borderRadius: '8px', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover', // Asegura que la imagen cubra el espacio
        }} 
      />
    </div>
  );
};

export default Dashboard;
