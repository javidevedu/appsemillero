// Endpoint para crear actividades y generar links
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { getDataFilePath, ensureDataDirExists } = require('./utils/dataStore');

module.exports = async (req, res) => {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener datos de la actividad del cuerpo de la solicitud
    const activityData = req.body;

    // Validar datos mínimos requeridos
    if (!activityData.name || !activityData.type) {
      return res.status(400).json({ error: 'Nombre y tipo de actividad son requeridos' });
    }

    // Generar IDs únicos para los enlaces
    const studentId = uuidv4();
    const adminId = uuidv4();

    // Crear objeto de actividad completo
    const activity = {
      id: uuidv4(),
      name: activityData.name,
      type: activityData.type,
      studentId,
      adminId,
      createdAt: new Date().toISOString(),
      content: activityData,
      submissions: []
    };

    // Asegurar que el directorio de datos existe
    ensureDataDirExists();

    // Guardar la actividad en un archivo JSON
    const filePath = getDataFilePath(`activity_${activity.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(activity, null, 2));

    // Generar URLs para estudiantes y administrador
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const studentLink = `${baseUrl}/student.html?id=${studentId}`;
    const adminLink = `${baseUrl}/admin.html?id=${adminId}`;

    // Devolver los enlaces generados
    return res.status(200).json({
      success: true,
      activityId: activity.id,
      studentLink,
      adminLink
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};