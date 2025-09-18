const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Base de datos en memoria (archivos JSON)
const DB_PATH = path.join(__dirname, '..', 'data');
const ACTIVITIES_FILE = path.join(DB_PATH, 'activities.json');

// Crear directorio de datos si no existe
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Inicializar archivo de actividades si no existe
if (!fs.existsSync(ACTIVITIES_FILE)) {
  fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([]));
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
    const { title, description, type, content, skill } = req.body;

    // Validar datos requeridos
    if (!title || !type || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, type, and content are required' 
      });
    }

    // Validar tipo de actividad
    const validTypes = ['quiz', 'fill-blanks', 'listening', 'speaking'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid activity type. Must be one of: quiz, fill-blanks, listening, speaking' 
      });
    }

    // Validar contenido según el tipo
    if (type === 'quiz' && (!content.questions || !Array.isArray(content.questions))) {
      return res.status(400).json({ 
        error: 'Quiz activities must include questions array' 
      });
    }

    if (type === 'fill-blanks' && (!content.text || !content.blanks || !Array.isArray(content.blanks))) {
      return res.status(400).json({ 
        error: 'Fill-blanks activities must include text and blanks array' 
      });
    }

    if (type === 'listening' && (!content.audioUrl || !content.questions || !Array.isArray(content.questions))) {
      return res.status(400).json({ 
        error: 'Listening activities must include audioUrl and questions array' 
      });
    }

    if (type === 'speaking' && (!content.mediaUrl || !content.instructions)) {
      return res.status(400).json({ 
        error: 'Speaking activities must include mediaUrl and instructions' 
      });
    }

    // Generar UUIDs únicos
    const studentLink = uuidv4();
    const adminLink = uuidv4();

    // Crear objeto de actividad
    const activity = {
      id: uuidv4(),
      title,
      description: description || '',
      type,
      skill: skill || 'general',
      content,
      studentLink,
      adminLink,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    // Guardar en la base de datos
    const activities = loadActivities();
    activities.push(activity);
    saveActivities(activities);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      activity: {
        id: activity.id,
        title: activity.title,
        type: activity.type,
        skill: activity.skill
      },
      links: {
        student: `${req.headers.origin || 'http://localhost:3000'}/student/${studentLink}`,
        admin: `${req.headers.origin || 'http://localhost:3000'}/admin/${adminLink}`
      }
    });

  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
