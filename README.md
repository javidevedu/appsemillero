# 🎓 EduGamify - Plataforma de Aprendizaje Gamificado

Una plataforma web moderna para crear actividades de aprendizaje interactivas con sistema de recompensas coleccionables.

## ✨ Características

- **Sin registro requerido**: Los docentes pueden crear actividades inmediatamente
- **4 tipos de actividades**:
  - 📚 **Quiz de Selección Múltiple** (Reading)
  - ✍️ **Completar Espacios en Blanco** (Writing)
  - 👂 **Escucha y Responde** (Listening)
  - 🗣️ **Respuesta por Voz** (Speaking)
- **Sistema de recompensas**: Cartas coleccionables digitales para estudiantes
- **Panel de administración**: Seguimiento de resultados y calificaciones
- **Diseño responsivo**: Funciona en desktop, tablet y móvil
- **Despliegue en Vercel**: Configuración lista para producción

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue desde GitHub

1. **Fork este repositorio** en tu cuenta de GitHub
2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio fork
   - Vercel detectará automáticamente la configuración

3. **Configuración automática**:
   - Vercel usará el `vercel.json` incluido
   - Las API routes se desplegarán automáticamente
   - El frontend se servirá desde `/public`

### Opción 2: Despliegue desde Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# En el directorio del proyecto
vercel

# Seguir las instrucciones del CLI
```

### Opción 3: Despliegue manual

1. **Sube los archivos** a tu cuenta de Vercel
2. **Configura las variables de entorno** (si es necesario)
3. **Despliega** usando el dashboard de Vercel

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd appsemillero

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Estructura del Proyecto

```
appsemillero/
├── api/                    # API Routes de Vercel
│   ├── create.js          # Crear actividades
│   ├── submit.js          # Enviar respuestas
│   ├── results.js         # Ver resultados
│   └── upload.js          # Subir archivos
├── public/                # Frontend estático
│   ├── index.html         # Página principal (docente)
│   ├── student.html       # Página de estudiantes
│   ├── admin.html         # Panel de administración
│   ├── styles.css         # Estilos CSS
│   ├── script.js          # Lógica principal
│   ├── student-script.js  # Lógica de estudiantes
│   ├── admin-script.js    # Lógica de administración
│   └── uploads/           # Archivos subidos
├── data/                  # Base de datos JSON (desarrollo)
├── package.json           # Dependencias
├── vercel.json           # Configuración de Vercel
└── README.md             # Este archivo
```

## 📱 Uso de la Plataforma

### Para Docentes

1. **Crear Actividad**:
   - Accede a la página principal
   - Completa el formulario de creación
   - Selecciona el tipo de actividad
   - Configura el contenido según el tipo
   - Obtén los enlaces únicos

2. **Gestionar Resultados**:
   - Usa el enlace de administrador
   - Ve estadísticas en tiempo real
   - Revisa calificaciones automáticas
   - Escucha audios de speaking
   - Exporta resultados a CSV

### Para Estudiantes

1. **Resolver Actividad**:
   - Accede con el enlace de estudiante
   - Completa la actividad según el tipo
   - En speaking: graba tu respuesta
   - Envía tus respuestas

2. **Recibir Recompensa**:
   - Obtén una carta coleccionable digital
   - Descarga la carta como imagen
   - Acumula cartas por habilidad

## 🎯 Tipos de Actividades

### Quiz de Selección Múltiple
- Múltiples preguntas con opciones
- Calificación automática
- Ideal para evaluar comprensión

### Completar Espacios en Blanco
- Texto con palabras ocultas
- Palabras entre corchetes `[palabra]`
- Calificación automática por coincidencia

### Escucha y Responde
- Archivo de audio + preguntas
- Reproducción controlada
- Calificación automática

### Respuesta por Voz
- Grabación de audio del estudiante
- Revisión manual por el docente
- Instrucciones personalizables

## 🎨 Sistema de Recompensas

### Cartas Coleccionables
- **Diseño único** por habilidad
- **Personajes temáticos**: 📚 Reading, ✍️ Writing, 👂 Listening, 🗣️ Speaking
- **Niveles de desempeño**: Excellent, Great, Good, Fair, Needs Practice
- **Descarga como imagen** PNG
- **Información personalizada**: Nombre, actividad, puntuación

### Motivación Cognitiva
- **Refuerzo positivo** inmediato
- **Colección progresiva** de logros
- **Evidencia tangible** del aprendizaje
- **Gamificación** del proceso educativo

## 🔧 Configuración Avanzada

### Base de Datos Externa

Para conectar a una base de datos real (Supabase, PostgreSQL, etc.):

1. **Modifica las API routes** en `/api/`
2. **Reemplaza las funciones** `loadActivities()` y `saveActivities()`
3. **Configura variables de entorno** en Vercel
4. **Actualiza las consultas** según tu esquema

### Personalización

- **Estilos**: Modifica `public/styles.css`
- **Funcionalidad**: Edita los archivos JavaScript
- **Tipos de actividades**: Extiende en `script.js`
- **Cartas**: Personaliza en `student-script.js`

## 🐛 Solución de Problemas

### Errores Comunes

1. **"Activity not found"**:
   - Verifica que el enlace sea correcto
   - Asegúrate de que la actividad existe

2. **"Error uploading file"**:
   - Verifica el tamaño del archivo
   - Confirma el formato soportado

3. **Problemas de CORS**:
   - Las API routes ya incluyen headers CORS
   - Verifica la configuración de Vercel

### Logs y Debugging

- **Vercel Dashboard**: Ve logs en tiempo real
- **Console del navegador**: Errores del frontend
- **API Routes**: Logs en la consola de Vercel

## 📈 Próximas Mejoras

- [ ] Sistema de autenticación opcional
- [ ] Más tipos de actividades
- [ ] Análisis avanzado de resultados
- [ ] Integración con LMS
- [ ] Notificaciones por email
- [ ] Modo offline
- [ ] Aplicación móvil

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: Reporta problemas en GitHub Issues
- **Documentación**: Consulta este README
- **Comunidad**: Únete a las discusiones

---

**¡Creado con ❤️ para la educación gamificada!**
