// Variables globales
let currentActivity = null;

// Elementos del DOM
const activityForm = document.getElementById('activityForm');
const typeSelect = document.getElementById('type');
const contentSection = document.getElementById('contentSection');
const resultsSection = document.getElementById('resultsSection');
const createBtn = document.querySelector('.create-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateFormValidation();
});

// Event Listeners
function setupEventListeners() {
    typeSelect.addEventListener('change', handleTypeChange);
    activityForm.addEventListener('submit', handleFormSubmit);
}

// Manejar cambio de tipo de actividad
function handleTypeChange() {
    const type = typeSelect.value;
    contentSection.style.display = type ? 'block' : 'none';
    
    if (type) {
        generateContentForm(type);
    }
    
    updateFormValidation();
}

// Generar formulario de contenido según el tipo
function generateContentForm(type) {
    let contentHTML = '';
    
    switch (type) {
        case 'quiz':
            contentHTML = generateQuizForm();
            break;
        case 'fill-blanks':
            contentHTML = generateFillBlanksForm();
            break;
        case 'listening':
            contentHTML = generateListeningForm();
            break;
        case 'speaking':
            contentHTML = generateSpeakingForm();
            break;
    }
    
    contentSection.innerHTML = contentHTML;
    setupContentEventListeners();
}

// Generar formulario para quiz
function generateQuizForm() {
    return `
        <h4>Configurar Preguntas del Quiz</h4>
        <div id="questionsContainer">
            <div class="question-item">
                <h5>Pregunta 1</h5>
                <input type="text" name="question1" placeholder="Escribe tu pregunta aquí..." required>
                <div class="options-container">
                    <div class="option-group">
                        <input type="radio" name="correct1" value="0" required>
                        <input type="text" name="option1_0" placeholder="Opción A" required>
                    </div>
                    <div class="option-group">
                        <input type="radio" name="correct1" value="1" required>
                        <input type="text" name="option1_1" placeholder="Opción B" required>
                    </div>
                    <div class="option-group">
                        <input type="radio" name="correct1" value="2" required>
                        <input type="text" name="option1_2" placeholder="Opción C" required>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" onclick="addQuestion()" class="add-question-btn">+ Agregar Pregunta</button>
    `;
}

// Generar formulario para completar espacios
function generateFillBlanksForm() {
    return `
        <h4>Configurar Texto con Espacios en Blanco</h4>
        <div class="form-group">
            <label for="fillText">Texto completo:</label>
            <textarea id="fillText" name="fillText" placeholder="Escribe el texto completo aquí. Las palabras que quieras ocultar deben estar entre corchetes [palabra]..." required></textarea>
        </div>
        <div class="form-group">
            <label>Palabras a ocultar (se generan automáticamente del texto):</label>
            <div id="blanksList" class="blanks-list">
                <!-- Se llena automáticamente -->
            </div>
        </div>
    `;
}

// Generar formulario para listening
function generateListeningForm() {
    return `
        <h4>Configurar Actividad de Escucha</h4>
        <div class="form-group">
            <label for="audioFile">Archivo de Audio:</label>
            <input type="file" id="audioFile" name="audioFile" accept="audio/*" required>
            <small>Formatos soportados: MP3, WAV, M4A</small>
        </div>
        <div id="listeningQuestionsContainer">
            <div class="question-item">
                <h5>Pregunta 1</h5>
                <input type="text" name="listeningQuestion1" placeholder="Escribe tu pregunta aquí..." required>
                <div class="options-container">
                    <div class="option-group">
                        <input type="radio" name="listeningCorrect1" value="0" required>
                        <input type="text" name="listeningOption1_0" placeholder="Opción A" required>
                    </div>
                    <div class="option-group">
                        <input type="radio" name="listeningCorrect1" value="1" required>
                        <input type="text" name="listeningOption1_1" placeholder="Opción B" required>
                    </div>
                    <div class="option-group">
                        <input type="radio" name="listeningCorrect1" value="2" required>
                        <input type="text" name="listeningOption1_2" placeholder="Opción C" required>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" onclick="addListeningQuestion()" class="add-question-btn">+ Agregar Pregunta</button>
    `;
}

// Generar formulario para speaking
function generateSpeakingForm() {
    return `
        <h4>Configurar Actividad de Habla</h4>
        <div class="form-group">
            <label for="mediaFile">Imagen o Audio de Referencia (opcional):</label>
            <input type="file" id="mediaFile" name="mediaFile" accept="image/*,audio/*">
            <small>Puedes subir una imagen o audio como referencia para el estudiante</small>
        </div>
        <div class="form-group">
            <label for="speakingInstructions">Instrucciones para el estudiante:</label>
            <textarea id="speakingInstructions" name="speakingInstructions" placeholder="Describe qué debe hacer el estudiante. Ej: 'Describe la imagen en inglés usando al menos 5 oraciones completas.'" required></textarea>
        </div>
    `;
}

// Configurar event listeners para el contenido
function setupContentEventListeners() {
    const fillText = document.getElementById('fillText');
    if (fillText) {
        fillText.addEventListener('input', generateBlanksFromText);
    }
}

// Generar espacios en blanco automáticamente del texto
function generateBlanksFromText() {
    const text = document.getElementById('fillText').value;
    const blanksList = document.getElementById('blanksList');
    
    if (!blanksList) return;
    
    // Buscar palabras entre corchetes [palabra]
    const blanks = text.match(/\[([^\]]+)\]/g);
    
    if (blanks && blanks.length > 0) {
        blanksList.innerHTML = blanks.map((blank, index) => {
            const word = blank.slice(1, -1); // Remover corchetes
            return `
                <div class="blank-item">
                    <input type="text" name="blank${index}" value="${word}" readonly>
                    <small>Palabra ${index + 1}</small>
                </div>
            `;
        }).join('');
    } else {
        blanksList.innerHTML = '<p>Escribe palabras entre corchetes [palabra] en el texto para crear espacios en blanco.</p>';
    }
}

// Agregar nueva pregunta al quiz
function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionCount = container.children.length;
    const questionNumber = questionCount + 1;
    
    const questionHTML = `
        <div class="question-item">
            <h5>Pregunta ${questionNumber}</h5>
            <input type="text" name="question${questionNumber}" placeholder="Escribe tu pregunta aquí..." required>
            <div class="options-container">
                <div class="option-group">
                    <input type="radio" name="correct${questionNumber}" value="0" required>
                    <input type="text" name="option${questionNumber}_0" placeholder="Opción A" required>
                </div>
                <div class="option-group">
                    <input type="radio" name="correct${questionNumber}" value="1" required>
                    <input type="text" name="option${questionNumber}_1" placeholder="Opción B" required>
                </div>
                <div class="option-group">
                    <input type="radio" name="correct${questionNumber}" value="2" required>
                    <input type="text" name="option${questionNumber}_2" placeholder="Opción C" required>
                </div>
            </div>
            <button type="button" onclick="removeQuestion(this)" class="remove-question-btn">Eliminar</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHTML);
}

// Agregar nueva pregunta de listening
function addListeningQuestion() {
    const container = document.getElementById('listeningQuestionsContainer');
    const questionCount = container.children.length;
    const questionNumber = questionCount + 1;
    
    const questionHTML = `
        <div class="question-item">
            <h5>Pregunta ${questionNumber}</h5>
            <input type="text" name="listeningQuestion${questionNumber}" placeholder="Escribe tu pregunta aquí..." required>
            <div class="options-container">
                <div class="option-group">
                    <input type="radio" name="listeningCorrect${questionNumber}" value="0" required>
                    <input type="text" name="listeningOption${questionNumber}_0" placeholder="Opción A" required>
                </div>
                <div class="option-group">
                    <input type="radio" name="listeningCorrect${questionNumber}" value="1" required>
                    <input type="text" name="listeningOption${questionNumber}_1" placeholder="Opción B" required>
                </div>
                <div class="option-group">
                    <input type="radio" name="listeningCorrect${questionNumber}" value="2" required>
                    <input type="text" name="listeningOption${questionNumber}_2" placeholder="Opción C" required>
                </div>
            </div>
            <button type="button" onclick="removeQuestion(this)" class="remove-question-btn">Eliminar</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHTML);
}

// Eliminar pregunta
function removeQuestion(button) {
    button.parentElement.remove();
}

// Actualizar validación del formulario
function updateFormValidation() {
    const title = document.getElementById('title').value;
    const type = typeSelect.value;
    const skill = document.getElementById('skill').value;
    
    const isValid = title.trim() && type && skill;
    createBtn.disabled = !isValid;
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (createBtn.disabled) return;
    
    const formData = new FormData(activityForm);
    const activityData = {
        title: formData.get('title'),
        description: formData.get('description'),
        skill: formData.get('skill'),
        type: formData.get('type'),
        content: {}
    };
    
    // Procesar contenido según el tipo
    switch (activityData.type) {
        case 'quiz':
            activityData.content = processQuizData(formData);
            break;
        case 'fill-blanks':
            activityData.content = processFillBlanksData(formData);
            break;
        case 'listening':
            activityData.content = await processListeningData(formData);
            break;
        case 'speaking':
            activityData.content = await processSpeakingData(formData);
            break;
    }
    
    // Validar contenido
    if (!validateContent(activityData)) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }
    
    // Enviar a la API
    await createActivity(activityData);
}

// Procesar datos del quiz
function processQuizData(formData) {
    const questions = [];
    let questionIndex = 1;
    
    while (formData.has(`question${questionIndex}`)) {
        const question = formData.get(`question${questionIndex}`);
        const correctAnswer = parseInt(formData.get(`correct${questionIndex}`));
        const options = [];
        
        for (let i = 0; i < 3; i++) {
            const option = formData.get(`option${questionIndex}_${i}`);
            if (option) options.push(option);
        }
        
        questions.push({
            question,
            options,
            correctAnswer
        });
        
        questionIndex++;
    }
    
    return { questions };
}

// Procesar datos de completar espacios
function processFillBlanksData(formData) {
    const text = formData.get('fillText');
    const blanks = [];
    
    // Extraer palabras entre corchetes
    const blankMatches = text.match(/\[([^\]]+)\]/g);
    if (blankMatches) {
        blankMatches.forEach(blank => {
            const word = blank.slice(1, -1);
            blanks.push({
                correctAnswer: word,
                placeholder: `[${word}]`
            });
        });
    }
    
    return { text, blanks };
}

// Procesar datos de listening
async function processListeningData(formData) {
    const audioFile = formData.get('audioFile');
    const questions = [];
    let questionIndex = 1;
    
    // Procesar preguntas
    while (formData.has(`listeningQuestion${questionIndex}`)) {
        const question = formData.get(`listeningQuestion${questionIndex}`);
        const correctAnswer = parseInt(formData.get(`listeningCorrect${questionIndex}`));
        const options = [];
        
        for (let i = 0; i < 3; i++) {
            const option = formData.get(`listeningOption${questionIndex}_${i}`);
            if (option) options.push(option);
        }
        
        questions.push({
            question,
            options,
            correctAnswer
        });
        
        questionIndex++;
    }
    
    // Subir archivo de audio
    let audioUrl = null;
    if (audioFile && audioFile.size > 0) {
        audioUrl = await uploadFile(audioFile);
    }
    
    return { audioUrl, questions };
}

// Procesar datos de speaking
async function processSpeakingData(formData) {
    const mediaFile = formData.get('mediaFile');
    const instructions = formData.get('speakingInstructions');
    
    // Subir archivo de media si existe
    let mediaUrl = null;
    if (mediaFile && mediaFile.size > 0) {
        mediaUrl = await uploadFile(mediaFile);
    }
    
    return { mediaUrl, instructions };
}

// Validar contenido
function validateContent(activityData) {
    const { type, content } = activityData;
    
    switch (type) {
        case 'quiz':
            return content.questions && content.questions.length > 0;
        case 'fill-blanks':
            return content.text && content.blanks && content.blanks.length > 0;
        case 'listening':
            return content.audioUrl && content.questions && content.questions.length > 0;
        case 'speaking':
            return content.instructions;
        default:
            return false;
    }
}

// Subir archivo
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('fileType', file.type);
    formData.append('fileName', file.name);
    
    // Convertir archivo a base64 para simulación
    const base64 = await fileToBase64(file);
    formData.append('fileData', base64);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.file.url;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Convertir archivo a base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Crear actividad
async function createActivity(activityData) {
    try {
        showLoading(true);
        
        const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showResults(result);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error creating activity:', error);
        alert('Error al crear la actividad: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Mostrar estado de carga
function showLoading(show) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    if (show) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        createBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        createBtn.disabled = false;
    }
}

// Mostrar resultados
function showResults(result) {
    currentActivity = result;
    
    // Ocultar formulario y mostrar resultados
    document.querySelector('.activity-creation').style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Llenar enlaces
    document.getElementById('studentLink').value = result.links.student;
    document.getElementById('adminLink').value = result.links.admin;
    
    // Scroll a resultados
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Copiar al portapapeles
function copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    input.select();
    input.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showNotification('¡Enlace copiado al portapapeles!');
    } catch (err) {
        console.error('Error copying to clipboard:', err);
        showNotification('Error al copiar. Selecciona el texto manualmente.');
    }
}

// Abrir enlace de estudiante
function openStudentLink() {
    if (currentActivity) {
        window.open(currentActivity.links.student, '_blank');
    }
}

// Abrir enlace de administrador
function openAdminLink() {
    if (currentActivity) {
        window.open(currentActivity.links.admin, '_blank');
    }
}

// Crear nueva actividad
function createNewActivity() {
    // Resetear formulario
    activityForm.reset();
    contentSection.style.display = 'none';
    resultsSection.style.display = 'none';
    document.querySelector('.activity-creation').style.display = 'block';
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .add-question-btn, .remove-question-btn {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-top: 10px;
    }
    
    .add-question-btn:hover {
        background: #5a6268;
    }
    
    .remove-question-btn {
        background: #dc3545;
        margin-left: 10px;
    }
    
    .remove-question-btn:hover {
        background: #c82333;
    }
    
    .blanks-list {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-top: 10px;
    }
    
    .blank-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .blank-item input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: white;
    }
    
    .blank-item small {
        color: #666;
        font-size: 0.8rem;
        min-width: 80px;
    }
`;
document.head.appendChild(style);
