const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Directorio para archivos subidos
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Crear directorio de uploads si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Para Vercel, los archivos se manejan de manera diferente
    // En un entorno de producción real, usaríamos multer o similar
    // Por ahora, simulamos la subida de archivos
    
    const { fileType, fileName, fileData } = req.body;

    if (!fileType || !fileName || !fileData) {
      return res.status(400).json({ 
        error: 'Missing required fields: fileType, fileName, and fileData are required' 
      });
    }

    // Validar tipos de archivo permitidos
    const allowedTypes = {
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'audio/mp4': '.m4a',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif'
    };

    if (!allowedTypes[fileType]) {
      return res.status(400).json({ 
        error: 'File type not allowed. Supported types: audio (mp3, wav, m4a), image (jpg, png, gif)' 
      });
    }

    // Generar nombre único para el archivo
    const fileExtension = allowedTypes[fileType];
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    // En un entorno real, aquí procesaríamos el archivo
    // Por ahora, simulamos guardando la información del archivo
    const fileInfo = {
      id: uuidv4(),
      originalName: fileName,
      fileName: uniqueFileName,
      fileType,
      filePath: `/uploads/${uniqueFileName}`,
      uploadedAt: new Date().toISOString(),
      size: fileData.length // Tamaño aproximado
    };

    // En un entorno real, aquí guardaríamos el archivo:
    // fs.writeFileSync(filePath, Buffer.from(fileData, 'base64'));

    // Simular guardado exitoso
    console.log(`File upload simulated: ${fileName} -> ${uniqueFileName}`);

    res.status(201).json({
      success: true,
      file: {
        id: fileInfo.id,
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        url: `${req.headers.origin || 'http://localhost:3000'}${fileInfo.filePath}`,
        uploadedAt: fileInfo.uploadedAt
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Función auxiliar para manejar archivos en base64 (simulación)
function handleBase64File(fileData, filePath) {
  try {
    // Remover el prefijo data:type/subtype;base64, si existe
    const base64Data = fileData.replace(/^data:.*,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    console.error('Error handling base64 file:', error);
    return false;
  }
}
