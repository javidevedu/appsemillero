// Endpoint para mostrar resultados al docente
const { getActivityByAdminId } = require('./utils/dataStore');

module.exports = async (req, res) => {
  // Solo permitir método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { adminId } = req.query;

    // Validar ID de administrador
    if (!adminId) {
      return res.status(400).json({ error: 'ID de administrador requerido' });
    }

    // Obtener la actividad por el ID de administrador
    const activity = getActivityByAdminId(adminId);
    if (!activity) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Preparar datos para la respuesta
    const results = {
      activityId: activity.id,
      activityName: activity.name,
      activityType: activity.type,
      createdAt: activity.createdAt,
      submissions: activity.submissions.map(submission => ({
        id: submission.id,
        studentName: submission.studentName,
        submittedAt: submission.submittedAt,
        score: submission.score,
        maxScore: submission.maxScore,
        percentage: submission.percentage,
        needsManualReview: submission.needsManualReview
      }))
    };

    // Devolver los resultados
    return res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};