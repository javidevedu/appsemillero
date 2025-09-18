const fs = require('fs');
const path = require('path');

// Base de datos en memoria (archivos JSON)
const DB_PATH = path.join(__dirname, '..', 'data');
const ACTIVITIES_FILE = path.join(DB_PATH, 'activities.json');
const SUBMISSIONS_FILE = path.join(DB_PATH, 'submissions.json');

// Crear directorio de datos si no existe
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Inicializar archivos si no existen
if (!fs.existsSync(ACTIVITIES_FILE)) {
  fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([]));
}

if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([]));
}

function loadActivities() {
  try {
    const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveActivities(activities) {
  fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
}

function loadSubmissions() {
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveSubmissions(submissions) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

function calculateScore(activity, answers) {
  const { type, content } = activity;
  
  switch (type) {
    case 'quiz':
      return calculateQuizScore(content.questions, answers.questions || []);
    
    case 'fill-blanks':
      return calculateFillBlanksScore(content.blanks, answers.blanks || []);
    
    case 'listening':
      return calculateQuizScore(content.questions, answers.questions || []);
    
    case 'speaking':
      // Speaking requiere revisión manual, retornamos null
      return null;
    
    default:
      return 0;
  }
}

function calculateQuizScore(questions, answers) {
  if (!questions || !answers || questions.length !== answers.length) {
    return 0;
  }
  
  let correct = 0;
  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correct++;
    }
  });
  
  return Math.round((correct / questions.length) * 100);
}

function calculateFillBlanksScore(blanks, answers) {
  if (!blanks || !answers || blanks.length !== answers.length) {
    return 0;
  }
  
  let correct = 0;
  blanks.forEach((blank, index) => {
    if (answers[index] && answers[index].toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim()) {
      correct++;
    }
  });
  
  return Math.round((correct / blanks.length) * 100);
}

function generateCollectibleCard(studentName, activity, score) {
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

  const performanceLevel = score >= 90 ? 'Excellent' : 
                          score >= 80 ? 'Great' : 
                          score >= 70 ? 'Good' : 
                          score >= 60 ? 'Fair' : 'Needs Practice';

  return {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentName,
    activityTitle: activity.title,
    skill: activity.skill,
    skillIcon: skillIcons[activity.skill] || skillIcons.general,
    skillName: skillNames[activity.skill] || skillNames.general,
    score: score || 'Pending Review',
    performanceLevel,
    completedAt: new Date().toISOString(),
    downloadUrl: null // Se generará cuando se solicite la descarga
  };
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentLink, studentName, answers, audioFile } = req.body;

    if (!studentLink || !studentName) {
      return res.status(400).json({ 
        error: 'Missing required fields: studentLink and studentName are required' 
      });
    }

    // Buscar la actividad por studentLink
    const activities = loadActivities();
    const activity = activities.find(a => a.studentLink === studentLink);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Calcular puntuación
    const score = calculateScore(activity, answers);

    // Crear submission
    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      activityId: activity.id,
      studentName,
      answers,
      audioFile: audioFile || null,
      score,
      submittedAt: new Date().toISOString(),
      status: score !== null ? 'graded' : 'pending_review'
    };

    // Guardar submission
    const submissions = loadSubmissions();
    submissions.push(submission);
    saveSubmissions(submissions);

    // Actualizar actividad con la submission
    activity.submissions.push(submission.id);
    saveActivities(activities);

    // Generar carta coleccionable
    const collectibleCard = generateCollectibleCard(studentName, activity, score);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      submission: {
        id: submission.id,
        score: submission.score,
        status: submission.status
      },
      collectibleCard,
      message: score !== null 
        ? `¡Excelente trabajo! Obtuviste ${score}% de aciertos.`
        : 'Tu respuesta ha sido enviada para revisión manual.'
    });

  } catch (error) {
    console.error('Error submitting activity:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
