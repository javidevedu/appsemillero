// Endpoint para obtener actividades por ID de estudiante
const { getActivityByStudentId } = require('./utils/dataStore');

module.exports = async (req, res) => {
  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener ID de estudiante
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: 'ID de estudiante requerido' });
    }

    // Obtener actividad
    const activity = await getActivityByStudentId(studentId);

    if (!activity) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Devolver actividad
    return res.status(200).json({ activity });
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};