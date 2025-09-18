// Utilidades para el almacenamiento de datos
const fs = require('fs');
const path = require('path');

// Directorio para almacenar los datos
const DATA_DIR = path.join(process.cwd(), 'data');

// Asegurar que el directorio de datos existe
function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Obtener la ruta completa para un archivo de datos
function getDataFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

// Guardar datos en un archivo JSON
function saveData(filename, data) {
  ensureDataDirExists();
  fs.writeFileSync(getDataFilePath(filename), JSON.stringify(data, null, 2));
}

// Leer datos de un archivo JSON
function readData(filename) {
  const filePath = getDataFilePath(filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Obtener una actividad por su ID
function getActivityById(activityId) {
  return readData(`activity_${activityId}.json`);
}

// Obtener una actividad por su ID de estudiante
function getActivityByStudentId(studentId) {
  // Leer todos los archivos de actividades
  ensureDataDirExists();
  const files = fs.readdirSync(DATA_DIR);
  
  for (const file of files) {
    if (file.startsWith('activity_')) {
      const activity = readData(file);
      if (activity && activity.studentId === studentId) {
        return activity;
      }
    }
  }
  
  return null;
}

// Obtener una actividad por su ID de administrador
function getActivityByAdminId(adminId) {
  // Leer todos los archivos de actividades
  ensureDataDirExists();
  const files = fs.readdirSync(DATA_DIR);
  
  for (const file of files) {
    if (file.startsWith('activity_')) {
      const activity = readData(file);
      if (activity && activity.adminId === adminId) {
        return activity;
      }
    }
  }
  
  return null;
}

// Guardar una respuesta de estudiante
function saveSubmission(activityId, submission) {
  const activity = getActivityById(activityId);
  if (!activity) {
    throw new Error('Actividad no encontrada');
  }
  
  activity.submissions.push(submission);
  saveData(`activity_${activityId}.json`, activity);
  return submission;
}

// Preparación para conexión con bases de datos externas
// Esta función se implementará en el futuro para conectar con Supabase o SQLite
function getDatabaseConnection() {
  // Por ahora, devolvemos un objeto con métodos similares a los que usaríamos con una base de datos
  return {
    getActivity: getActivityById,
    getActivityByStudentId,
    getActivityByAdminId,
    saveActivity: (activity) => saveData(`activity_${activity.id}.json`, activity),
    saveSubmission,
    getAllActivities: () => {
      ensureDataDirExists();
      const files = fs.readdirSync(DATA_DIR);
      return files
        .filter(file => file.startsWith('activity_'))
        .map(file => readData(file));
    }
  };
}

module.exports = {
  ensureDataDirExists,
  getDataFilePath,
  saveData,
  readData,
  getActivityById,
  getActivityByStudentId,
  getActivityByAdminId,
  saveSubmission,
  getDatabaseConnection
};