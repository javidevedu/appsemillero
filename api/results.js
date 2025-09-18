const fs = require('fs');
const path = require('path');

// Base de datos en memoria (archivos JSON)
const DB_PATH = path.join(__dirname, '..', 'data');
const ACTIVITIES_FILE = path.join(DB_PATH, 'activities.json');
const SUBMISSIONS_FILE = path.join(DB_PATH, 'submissions.json');

function loadActivities() {
  try {
    const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function loadSubmissions() {
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function generateCSV(results) {
  const headers = ['Student Name', 'Score', 'Status', 'Submitted At', 'Card ID'];
  const rows = results.map(result => [
    result.studentName,
    result.score || 'Pending',
    result.status,
    new Date(result.submittedAt).toLocaleString(),
    result.collectibleCard?.id || 'N/A'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminLink } = req.query;

    if (!adminLink) {
      return res.status(400).json({ error: 'adminLink parameter is required' });
    }

    // Buscar la actividad por adminLink
    const activities = loadActivities();
    const activity = activities.find(a => a.adminLink === adminLink);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Obtener todas las submissions de esta actividad
    const submissions = loadSubmissions();
    const activitySubmissions = submissions.filter(s => s.activityId === activity.id);

    // Procesar resultados
    const results = activitySubmissions.map(submission => {
      const skillIcons = {
        'reading': '📚',
        'writing': '✍️',
        'listening': '👂',
        'speaking': '🗣️',
        'general': '🎯'
      };

      const skillNames = {
        'reading': 'Reading Master',
        'writing': 'Writing Wizard',
        'listening': 'Listening Champion',
        'speaking': 'Speaking Star',
        'general': 'Learning Hero'
      };

      const performanceLevel = submission.score >= 90 ? 'Excellent' : 
                              submission.score >= 80 ? 'Great' : 
                              submission.score >= 70 ? 'Good' : 
                              submission.score >= 60 ? 'Fair' : 'Needs Practice';

      return {
        id: submission.id,
        studentName: submission.studentName,
        score: submission.score,
        status: submission.status,
        submittedAt: submission.submittedAt,
        audioFile: submission.audioFile,
        collectibleCard: {
          id: `card_${submission.id}`,
          studentName: submission.studentName,
          activityTitle: activity.title,
          skill: activity.skill,
          skillIcon: skillIcons[activity.skill] || skillIcons.general,
          skillName: skillNames[activity.skill] || skillNames.general,
          score: submission.score || 'Pending Review',
          performanceLevel,
          completedAt: submission.submittedAt
        }
      };
    });

    // Estadísticas generales
    const stats = {
      totalSubmissions: results.length,
      gradedSubmissions: results.filter(r => r.status === 'graded').length,
      pendingReview: results.filter(r => r.status === 'pending_review').length,
      averageScore: results.filter(r => r.score !== null).length > 0 
        ? Math.round(results.filter(r => r.score !== null).reduce((sum, r) => sum + r.score, 0) / results.filter(r => r.score !== null).length)
        : 0
    };

    // Si se solicita exportar a CSV
    if (req.query.export === 'csv') {
      const csvContent = generateCSV(results);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="activity_${activity.id}_results.csv"`);
      return res.status(200).send(csvContent);
    }

    // Respuesta con datos
    res.status(200).json({
      success: true,
      activity: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        skill: activity.skill,
        createdAt: activity.createdAt
      },
      stats,
      results: results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
