// Variables globales
let currentActivity = null;
let studentLink = null;

// Elementos del DOM
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const activitySection = document.getElementById('activitySection');
const successSection = document.getElementById('successSection');
const activityForm = document.getElementById('activityForm');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el link de la URL
    const pathParts = window.location.pathname.split('/');
    studentLink = pathParts[pathParts.length - 1];
    
    if (studentLink) {
        loadActivity();
    } else {
        showError('Enlace de actividad no válido');
    }
});

// Cargar actividad
async function loadActivity() {
    try {
        showLoading(true);
        
        // Simular carga de actividad (en un entorno real, harías una llamada a la API)
        // Por ahora, creamos una actividad de ejemplo
        currentActivity = await getActivityByLink(studentLink);
        
        if (currentActivity) {
            displayActivity(currentActivity);
        } else {
            showError('Actividad no encontrada');
        }
    } catch (error) {
        console.error('Error loading activity:', error);
        showError('Error al cargar la actividad');
    } finally {
        showLoading(false);
    }
}

// Obtener actividad por link (simulación)
async function getActivityByLink(link) {
    // En un entorno real, esto haría una llamada a la API
    // Por ahora, retornamos una actividad de ejemplo
    return {
        id: 'example-activity',
        title: 'Quiz de Verbos Irregulares',
        description: 'Completa este quiz sobre verbos irregulares en inglés',
        type: 'quiz',
        skill: 'reading',
        content: {
            questions: [
                {
                    question: '¿Cuál es el pasado simple del verbo "go"?',
                    options: ['goed', 'went', 'gone'],
                    correctAnswer: 1
                },
                {
                    question: '¿Cuál es el participio pasado de "see"?',
                    options: ['saw', 'seen', 'seed'],
                    correctAnswer: 1
                },
                {
                    question: '¿Cuál es el pasado simple de "eat"?',
                    options: ['eated', 'ate', 'eaten'],
                    correctAnswer: 1
                }
            ]
        }
    };
}

// Mostrar actividad
function displayActivity(activity) {
    currentActivity = activity;
    
    // Llenar información de la actividad
    document.getElementById('activityTitle').textContent = activity.title;
    document.getElementById('activityDescription').textContent = activity.description;
    
    // Mostrar badge de habilidad
    const skillBadge = document.getElementById('skillBadge');
    skillBadge.textContent = getSkillDisplay(activity.skill);
    skillBadge.className = `skill-badge ${activity.skill}`;
    
    // Generar contenido según el tipo
    const contentDiv = document.getElementById('activityContent');
    contentDiv.innerHTML = generateActivityContent(activity);
    
    // Mostrar sección de actividad
    activitySection.style.display = 'block';
}

// Obtener display de habilidad
function getSkillDisplay(skill) {
    const skills = {
        'reading': '📚 Reading',
        'writing': '✍️ Writing',
        'listening': '👂 Listening',
        'speaking': '🗣️ Speaking',
        'general': '🎯 General'
    };
    return skills[skill] || skills.general;
}

// Generar contenido de la actividad
function generateActivityContent(activity) {
    const { type, content } = activity;
    
    switch (type) {
        case 'quiz':
            return generateQuizContent(content.questions);
        case 'fill-blanks':
            return generateFillBlanksContent(content);
        case 'listening':
            return generateListeningContent(content);
        case 'speaking':
            return generateSpeakingContent(content);
        default:
            return '<p>Tipo de actividad no soportado</p>';
    }
}

// Generar contenido de quiz
function generateQuizContent(questions) {
    let html = '<div class="quiz-container">';
    
    questions.forEach((question, index) => {
        html += `
            <div class="question-item">
                <h4>Pregunta ${index + 1}</h4>
                <p class="question-text">${question.question}</p>
                <div class="options-container">
        `;
        
        question.options.forEach((option, optionIndex) => {
            html += `
                <div class="option-group">
                    <input type="radio" name="question${index}" value="${optionIndex}" id="q${index}_${optionIndex}" required>
                    <label for="q${index}_${optionIndex}">${option}</label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Generar contenido de completar espacios
function generateFillBlanksContent(content) {
    let text = content.text;
    
    // Reemplazar palabras entre corchetes con inputs
    content.blanks.forEach((blank, index) => {
        const placeholder = blank.placeholder || `[${blank.correctAnswer}]`;
        const input = `<input type="text" name="blank${index}" placeholder="Escribe aquí..." required class="blank-input">`;
        text = text.replace(placeholder, input);
    });
    
    return `
        <div class="fill-blanks-container">
            <h4>Completa los espacios en blanco</h4>
            <div class="text-container">
                ${text}
            </div>
        </div>
    `;
}

// Generar contenido de listening
function generateListeningContent(content) {
    let html = `
        <div class="listening-container">
            <h4>Escucha y Responde</h4>
            <div class="audio-container">
                <audio controls>
                    <source src="${content.audioUrl}" type="audio/mpeg">
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
            <div class="questions-container">
    `;
    
    content.questions.forEach((question, index) => {
        html += `
            <div class="question-item">
                <h5>Pregunta ${index + 1}</h5>
                <p class="question-text">${question.question}</p>
                <div class="options-container">
        `;
        
        question.options.forEach((option, optionIndex) => {
            html += `
                <div class="option-group">
                    <input type="radio" name="listeningQuestion${index}" value="${optionIndex}" id="lq${index}_${optionIndex}" required>
                    <label for="lq${index}_${optionIndex}">${option}</label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Generar contenido de speaking
function generateSpeakingContent(content) {
    let html = `
        <div class="speaking-container">
            <h4>Actividad de Habla</h4>
            <div class="instructions">
                <p><strong>Instrucciones:</strong> ${content.instructions}</p>
            </div>
    `;
    
    if (content.mediaUrl) {
        if (content.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
            html += `
                <div class="media-container">
                    <img src="${content.mediaUrl}" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 10px;">
                </div>
            `;
        } else {
            html += `
                <div class="media-container">
                    <audio controls>
                        <source src="${content.mediaUrl}" type="audio/mpeg">
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            `;
        }
    }
    
    html += `
            <div class="recording-container">
                <h5>Graba tu respuesta:</h5>
                <div class="recording-controls">
                    <button type="button" id="recordBtn" class="record-btn">🎤 Grabar</button>
                    <button type="button" id="stopBtn" class="stop-btn" disabled>⏹️ Detener</button>
                    <button type="button" id="playBtn" class="play-btn" disabled>▶️ Reproducir</button>
                </div>
                <audio id="recording" style="display: none;"></audio>
                <div id="recordingStatus" class="recording-status"></div>
            </div>
        </div>
    `;
    
    return html;
}

// Configurar event listeners para speaking
function setupSpeakingListeners() {
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const playBtn = document.getElementById('playBtn');
    const recording = document.getElementById('recording');
    const status = document.getElementById('recordingStatus');
    
    if (!recordBtn) return;
    
    let mediaRecorder;
    let audioChunks = [];
    
    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    playBtn.addEventListener('click', playRecording);
    
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                recording.src = audioUrl;
                
                // Guardar el blob para envío
                window.recordedAudioBlob = audioBlob;
                
                playBtn.disabled = false;
                status.textContent = 'Grabación completada. Puedes reproducirla antes de enviar.';
            };
            
            mediaRecorder.start();
            recordBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Grabando... Habla ahora.';
        } catch (error) {
            console.error('Error accessing microphone:', error);
            status.textContent = 'Error: No se pudo acceder al micrófono.';
        }
    }
    
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
    
    function playRecording() {
        if (recording.src) {
            recording.play();
        }
    }
}

// Manejar envío del formulario
activityForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentName = document.getElementById('studentName').value.trim();
    if (!studentName) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    await submitActivity(studentName);
});

// Enviar actividad
async function submitActivity(studentName) {
    try {
        showLoading(true);
        
        const answers = collectAnswers();
        const audioFile = window.recordedAudioBlob ? await blobToBase64(window.recordedAudioBlob) : null;
        
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentLink,
                studentName,
                answers,
                audioFile
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(result);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error submitting activity:', error);
        alert('Error al enviar la actividad: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Recopilar respuestas
function collectAnswers() {
    const { type } = currentActivity;
    
    switch (type) {
        case 'quiz':
        case 'listening':
            return collectQuizAnswers();
        case 'fill-blanks':
            return collectFillBlanksAnswers();
        case 'speaking':
            return { audioSubmitted: !!window.recordedAudioBlob };
        default:
            return {};
    }
}

// Recopilar respuestas de quiz
function collectQuizAnswers() {
    const questions = [];
    const questionInputs = document.querySelectorAll('input[type="radio"]:checked');
    
    questionInputs.forEach(input => {
        const questionIndex = parseInt(input.name.replace(/\D/g, ''));
        const answer = parseInt(input.value);
        questions[questionIndex] = answer;
    });
    
    return { questions };
}

// Recopilar respuestas de completar espacios
function collectFillBlanksAnswers() {
    const blanks = [];
    const blankInputs = document.querySelectorAll('.blank-input');
    
    blankInputs.forEach(input => {
        blanks.push(input.value);
    });
    
    return { blanks };
}

// Convertir blob a base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Mostrar éxito
function showSuccess(result) {
    // Ocultar sección de actividad
    activitySection.style.display = 'none';
    
    // Mostrar mensaje de éxito
    document.getElementById('successMessage').textContent = result.message;
    
    // Mostrar carta coleccionable
    displayCollectibleCard(result.collectibleCard);
    
    // Mostrar sección de éxito
    successSection.style.display = 'block';
    
    // Scroll a la sección de éxito
    successSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar carta coleccionable
function displayCollectibleCard(card) {
    document.getElementById('cardStudentName').textContent = card.studentName;
    document.getElementById('cardActivityTitle').textContent = card.activityTitle;
    document.getElementById('cardSkillName').textContent = card.skillName;
    document.getElementById('cardIcon').textContent = card.skillIcon;
    document.getElementById('cardScore').textContent = card.score;
    document.getElementById('cardPerformanceLevel').textContent = card.performanceLevel;
}

// Descargar carta
function downloadCard() {
    // Crear canvas para generar imagen de la carta
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar tamaño del canvas
    canvas.width = 400;
    canvas.height = 250;
    
    // Fondo de la carta
    const gradient = ctx.createLinearGradient(0, 0, 400, 250);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 250);
    
    // Bordes redondeados
    ctx.beginPath();
    ctx.roundRect(0, 0, 400, 250, 20);
    ctx.clip();
    
    // Texto de la carta
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 EduGamify', 200, 40);
    
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(document.getElementById('cardSkillName').textContent, 200, 70);
    
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(document.getElementById('cardActivityTitle').textContent, 200, 95);
    
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`Estudiante: ${document.getElementById('cardStudentName').textContent}`, 200, 130);
    ctx.fillText(`Puntuación: ${document.getElementById('cardScore').textContent}`, 200, 155);
    ctx.fillText(document.getElementById('cardPerformanceLevel').textContent, 200, 180);
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('¡Felicitaciones por completar la actividad!', 200, 210);
    
    // Descargar imagen
    const link = document.createElement('a');
    link.download = `carta-${document.getElementById('cardStudentName').textContent.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Mostrar estado de carga
function showLoading(show) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    if (show) {
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
    } else {
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

// Mostrar error
function showError(message) {
    loadingSection.style.display = 'none';
    activitySection.style.display = 'none';
    successSection.style.display = 'none';
    
    document.getElementById('errorMessage').textContent = message;
    errorSection.style.display = 'block';
}

// Configurar event listeners después de cargar el contenido
document.addEventListener('DOMContentLoaded', function() {
    // Si es una actividad de speaking, configurar listeners
    setTimeout(() => {
        if (currentActivity && currentActivity.type === 'speaking') {
            setupSpeakingListeners();
        }
    }, 1000);
});

// Agregar estilos adicionales
const style = document.createElement('style');
style.textContent = `
    .quiz-container, .fill-blanks-container, .listening-container, .speaking-container {
        background: white;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .question-text {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: #333;
    }
    
    .options-container {
        margin-top: 15px;
    }
    
    .option-group {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }
    
    .option-group:hover {
        background-color: #f8f9fa;
    }
    
    .option-group input[type="radio"] {
        margin-right: 12px;
        transform: scale(1.2);
    }
    
    .option-group label {
        flex: 1;
        cursor: pointer;
        font-size: 1rem;
    }
    
    .text-container {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        font-size: 1.1rem;
        line-height: 1.8;
    }
    
    .blank-input {
        border: 2px solid #667eea;
        border-radius: 5px;
        padding: 5px 10px;
        margin: 0 5px;
        background: white;
        font-weight: 500;
        color: #333;
    }
    
    .audio-container {
        text-align: center;
        margin: 20px 0;
    }
    
    .audio-container audio {
        width: 100%;
        max-width: 400px;
    }
    
    .instructions {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        border-left: 4px solid #2196f3;
    }
    
    .media-container {
        text-align: center;
        margin: 20px 0;
    }
    
    .recording-container {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
    }
    
    .recording-controls {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 15px 0;
        flex-wrap: wrap;
    }
    
    .record-btn, .stop-btn, .play-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    .record-btn {
        background: #dc3545;
        color: white;
    }
    
    .record-btn:hover:not(:disabled) {
        background: #c82333;
    }
    
    .stop-btn {
        background: #6c757d;
        color: white;
    }
    
    .stop-btn:hover:not(:disabled) {
        background: #5a6268;
    }
    
    .play-btn {
        background: #28a745;
        color: white;
    }
    
    .play-btn:hover:not(:disabled) {
        background: #218838;
    }
    
    .record-btn:disabled, .stop-btn:disabled, .play-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .recording-status {
        text-align: center;
        font-weight: 500;
        color: #666;
        margin-top: 10px;
    }
    
    .student-info {
        margin-bottom: 20px;
    }
    
    .student-info label {
        display: block;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
    }
    
    .student-info input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 10px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }
    
    .student-info input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;
document.head.appendChild(style);
