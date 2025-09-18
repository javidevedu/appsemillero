// Endpoint para subir audios/imágenes
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { ensureDataDirExists } = require('./utils/dataStore');

// Directorio para almacenar archivos subidos
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Asegurar que el directorio de uploads existe
function ensureUploadsDirExists() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

module.exports = async (req, res) => {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Nota: En un entorno real de Vercel, se utilizaría un servicio de almacenamiento externo
    // como AWS S3, Cloudinary, etc. Para este prototipo, simularemos la subida de archivos.
    
    const { fileType, fileName, fileData, activityId } = req.body;

    // Validar datos requeridos
    if (!fileType || !fileName || !fileData) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Generar un nombre único para el archivo
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    
    // Asegurar que el directorio de uploads existe
    ensureUploadsDirExists();
    
    // En un entorno real, aquí guardaríamos el archivo
    // Para este prototipo, solo simularemos que se ha guardado
    
    // Devolver la URL del archivo (simulada)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const fileUrl = `${baseUrl}/uploads/${uniqueFileName}`;
    
    return res.status(200).json({
      success: true,
      fileName: uniqueFileName,
      fileUrl
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};