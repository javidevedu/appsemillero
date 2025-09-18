# Plataforma de Aprendizaje Gamificado

Prototipo funcional de una plataforma web de aprendizaje gamificado con sistema de cartas coleccionables como recompensa.

## Características

- Creación de actividades para diferentes habilidades (lectura, escritura, escucha, habla)
- Sistema de enlaces únicos para estudiantes y administradores
- Calificación automática para la mayoría de actividades
- Cartas coleccionables como recompensa
- Exportación de resultados a CSV
- Interfaz moderna y responsive

## Tecnologías

- **Frontend**: HTML, CSS y JavaScript puro
- **Backend**: API Routes de Vercel con Node.js
- **Base de datos**: Archivos JSON (preparado para conexión a bases de datos externas)
- **Hosting**: Vercel (plan gratuito)

## Estructura del proyecto

```
/public            → Frontend (HTML, CSS, JS, imágenes)
/api/create.js     → Endpoint para crear actividades y generar links
/api/submit.js     → Endpoint para guardar respuestas de estudiantes
/api/results.js    → Endpoint para mostrar resultados al docente
/api/upload.js     → Endpoint para subir audios/imágenes
/api/activity.js   → Endpoint para obtener actividades por ID
/api/utils/        → Utilidades para la gestión de datos
```

## Guía de despliegue en Vercel

### 1. Preparación del repositorio

1. Crea un repositorio en GitHub:
   - Inicia sesión en [GitHub](https://github.com)
   - Haz clic en "New repository"
   - Nombra tu repositorio (ej. "aprendizaje-gamificado")
   - Selecciona la visibilidad (pública o privada)
   - Haz clic en "Create repository"

2. Sube el código al repositorio:
   ```bash
   git init
   git add .
   git commit -m "Versión inicial"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/aprendizaje-gamificado.git
   git push -u origin main
   ```

### 2. Despliegue en Vercel

1. Crea una cuenta en Vercel:
   - Ve a [Vercel](https://vercel.com)
   - Regístrate con tu cuenta de GitHub

2. Importa el repositorio:
   - En el dashboard de Vercel, haz clic en "Add New..." > "Project"
   - Selecciona el repositorio "aprendizaje-gamificado"
   - Vercel detectará automáticamente la configuración del proyecto

3. Configura el proyecto:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (dejar en blanco)
   - Output Directory: public
   - Install Command: npm install

4. Despliega el proyecto:
   - Haz clic en "Deploy"
   - Vercel comenzará el proceso de despliegue
   - Una vez completado, recibirás una URL para tu aplicación (ej. https://aprendizaje-gamificado.vercel.app)

### 3. Configuración adicional (opcional)

1. Dominio personalizado:
   - En el dashboard del proyecto, ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado y sigue las instrucciones

2. Variables de entorno:
   - Si necesitas configurar variables de entorno, ve a "Settings" > "Environment Variables"
   - Agrega las variables necesarias (ej. para conexión a bases de datos externas)

### 4. Despliegue continuo

Vercel está configurado para realizar despliegues automáticos cada vez que haces push a la rama principal de tu repositorio en GitHub. No se requiere configuración adicional.

## Próximos pasos

Para llevar este prototipo a producción, considera:

1. Implementar una base de datos externa (Supabase, MongoDB, etc.)
2. Agregar autenticación de usuarios
3. Mejorar el sistema de cartas coleccionables
4. Implementar más tipos de actividades
5. Optimizar el rendimiento y la accesibilidad

## Licencia

Este proyecto está bajo la Licencia MIT.