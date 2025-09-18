// Endpoint para guardar respuestas de estudiantes
const { v4: uuidv4 } = require('uuid');
const { getActivityByStudentId, saveSubmission } = require('./utils/dataStore');

module.exports = async (req, res) => {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { studentId, studentName, answers } = req.body;

    // Validar datos requeridos
    if (!studentId || !studentName || !answers) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Obtener la actividad por el ID de estudiante
    const activity = getActivityByStudentId(studentId);
    if (!activity) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Calcular calificación según el tipo de actividad
    let score = 0;
    let maxScore = 0;
    let needsManualReview = false;

    switch (activity.type) {
      case 'reading':
        // Para quizzes de selección múltiple
        const questions = activity.content.questions;
        maxScore = questions.length;
        
        questions.forEach((question, index) => {
          if (answers[index] === question.correctOption) {
            score++;
          }
        });
        break;
        
      case 'writing':
        // Para ejercicios de completar espacios
        const blanks = activity.content.blanks;
        maxScore = blanks.length;
        
        blanks.forEach((blank, index) => {
          if (answers[index].toLowerCase() === blank.toLowerCase()) {
            score++;
          }
        });
        break;
        
      case 'listening':
        // Para actividades de escucha y respuesta
        const listeningQuestions = activity.content.questions;
        maxScore = listeningQuestions.length;
        
        listeningQuestions.forEach((question, index) => {
          if (answers[index] === question.correctOption) {
            score++;
          }
        });
        break;
        
      case 'speaking':
        // Para ejercicios de contestar por voz
        needsManualReview = true;
        maxScore = 100; // La calificación será asignada manualmente
        score = 0;
        break;
        
      default:
        return res.status(400).json({ error: 'Tipo de actividad no válido' });
    }

    // Calcular porcentaje de calificación
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    // Crear objeto de respuesta
    const submission = {
      id: uuidv4(),
      studentName,
      submittedAt: new Date().toISOString(),
      answers,
      score,
      maxScore,
      percentage,
      needsManualReview
    };

    // Guardar la respuesta
    saveSubmission(activity.id, submission);

    // Generar datos para la carta coleccionable
    const cardData = {
      studentName,
      activityName: activity.name,
      skillType: activity.type,
      percentage,
      submissionId: submission.id,
      date: new Date().toLocaleDateString()
    };

    // Devolver respuesta exitosa con datos de la carta
    return res.status(200).json({
      success: true,
      submission,
      cardData
    });
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};