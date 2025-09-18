// Variables globales
let currentActivity = null;
let adminLink = null;
let results = [];

// Elementos del DOM
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const resultsSection = document.getElementById('resultsSection');
const resultsTableBody = document.getElementById('resultsTableBody');
const noResultsMessage = document.getElementById('noResultsMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el link de la URL
    const urlParams = new URLSearchParams(window.location.search);
    adminLink = urlParams.get('adminLink') || window.location.pathname.split('/').pop();
    
    if (adminLink) {
        loadResults();
    } else {
        showError('Enlace de administración no válido');
    }
});

// Cargar resultados
async function loadResults() {
    try {
        showLoading(true);
        
        const response = await fetch(`/api/results?adminLink=${adminLink}`);
        const result = await response.json();
        
        if (result.success) {
            currentActivity = result.activity;
            results = result.results;
            displayResults(result);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error loading results:', error);
        showError('Error al cargar los resultados');
    } finally {
        showLoading(false);
    }
}

// Mostrar resultados
function displayResults(data) {
    const { activity, stats, results } = data;
    
    // Mostrar información de la actividad
    displayActivityInfo(activity);
    
    // Mostrar estadísticas
    displayStats(stats);
    
    // Mostrar tabla de resultados
    displayResultsTable(results);
    
    // Mostrar sección de resultados
    resultsSection.style.display = 'block';
}

// Mostrar información de la actividad
function displayActivityInfo(activity) {
    document.getElementById('activityTitle').textContent = activity.title;
    document.getElementById('activityDescription').textContent = activity.description;
    
    // Badge de habilidad
    const skillBadge = document.getElementById('skillBadge');
    skillBadge.textContent = getSkillDisplay(activity.skill);
    skillBadge.className = `skill-badge ${activity.skill}`;
    
    // Tipo de actividad
    document.getElementById('activityType').textContent = getActivityTypeDisplay(activity.type);
    
    // Fecha de creación
    const createdDate = new Date(activity.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('createdDate').textContent = `Creada: ${createdDate}`;
}

// Mostrar estadísticas
function displayStats(stats) {
    document.getElementById('totalSubmissions').textContent = stats.totalSubmissions;
    document.getElementById('gradedSubmissions').textContent = stats.gradedSubmissions;
    document.getElementById('pendingReview').textContent = stats.pendingReview;
    document.getElementById('averageScore').textContent = `${stats.averageScore}%`;
}

// Mostrar tabla de resultados
function displayResultsTable(results) {
    if (results.length === 0) {
        resultsTableBody.innerHTML = '';
        noResultsMessage.style.display = 'block';
        return;
    }
    
    noResultsMessage.style.display = 'none';
    
    resultsTableBody.innerHTML = results.map(result => `
        <tr>
            <td>${result.studentName}</td>
            <td>
                <span class="score-${getScoreClass(result.score)}">
                    ${result.score || 'Pendiente'}
                </span>
            </td>
            <td>
                <span class="status-${result.status}">
                    ${getStatusDisplay(result.status)}
                </span>
            </td>
            <td>${formatDate(result.submittedAt)}</td>
            <td>
                <div class="action-links">
                    <a href="#" onclick="viewCard('${result.id}')" class="action-link">Ver Carta</a>
                    ${result.audioFile ? `<a href="#" onclick="playAudio('${result.audioFile}')" class="action-link">Escuchar Audio</a>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
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

// Obtener display de tipo de actividad
function getActivityTypeDisplay(type) {
    const types = {
        'quiz': 'Quiz de Selección Múltiple',
        'fill-blanks': 'Completar Espacios',
        'listening': 'Escucha y Responde',
        'speaking': 'Respuesta por Voz'
    };
    return types[type] || type;
}

// Obtener clase CSS para puntuación
function getScoreClass(score) {
    if (score === null) return 'pending';
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'poor';
}

// Obtener display de estado
function getStatusDisplay(status) {
    const statuses = {
        'graded': 'Calificado',
        'pending_review': 'Pendiente de Revisión'
    };
    return statuses[status] || status;
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Ver carta coleccionable
function viewCard(resultId) {
    const result = results.find(r => r.id === resultId);
    if (!result) return;
    
    const modalBody = document.getElementById('cardModalBody');
    modalBody.innerHTML = `
        <div class="collectible-card">
            <div class="card-header">
                <div class="card-icon">${result.collectibleCard.skillIcon}</div>
                <div class="card-title">
                    <h4>${result.collectibleCard.skillName}</h4>
                    <p>${result.collectibleCard.activityTitle}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="student-info">
                    <strong>Estudiante:</strong> ${result.collectibleCard.studentName}
                </div>
                <div class="score-info">
                    <strong>Puntuación:</strong> ${result.collectibleCard.score}
                </div>
                <div class="performance-level">
                    ${result.collectibleCard.performanceLevel}
                </div>
                <div class="completion-date">
                    <strong>Completado:</strong> ${formatDate(result.submittedAt)}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('cardModal').style.display = 'flex';
}

// Cerrar modal de carta
function closeCardModal() {
    document.getElementById('cardModal').style.display = 'none';
}

// Reproducir audio
function playAudio(audioFile) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioFile;
    document.getElementById('audioModal').style.display = 'flex';
}

// Cerrar modal de audio
function closeAudioModal() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause();
    audioPlayer.src = '';
    document.getElementById('audioModal').style.display = 'none';
}

// Exportar a CSV
function exportToCSV() {
    if (results.length === 0) {
        alert('No hay resultados para exportar');
        return;
    }
    
    const csvContent = generateCSV(results);
    downloadCSV(csvContent, `resultados-${currentActivity.title.replace(/\s+/g, '-')}.csv`);
}

// Generar contenido CSV
function generateCSV(results) {
    const headers = ['Estudiante', 'Puntuación', 'Estado', 'Fecha de Envío', 'ID de Carta'];
    const rows = results.map(result => [
        result.studentName,
        result.score || 'Pendiente',
        getStatusDisplay(result.status),
        formatDate(result.submittedAt),
        result.collectibleCard?.id || 'N/A'
    ]);
    
    return [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
}

// Descargar archivo CSV
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Actualizar resultados
function refreshResults() {
    loadResults();
}

// Mostrar estado de carga
function showLoading(show) {
    if (show) {
        loadingSection.style.display = 'block';
        errorSection.style.display = 'none';
        resultsSection.style.display = 'none';
    } else {
        loadingSection.style.display = 'none';
    }
}

// Mostrar error
function showError(message) {
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    document.getElementById('errorMessage').textContent = message;
    errorSection.style.display = 'block';
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(event) {
    const cardModal = document.getElementById('cardModal');
    const audioModal = document.getElementById('audioModal');
    
    if (event.target === cardModal) {
        closeCardModal();
    }
    
    if (event.target === audioModal) {
        closeAudioModal();
    }
});

// Agregar estilos adicionales para modales
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e1e5e9;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #333;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 5px;
    }
    
    .close-btn:hover {
        color: #333;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .collectible-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .card-icon {
        font-size: 3rem;
        margin-right: 20px;
    }
    
    .card-title h4 {
        font-size: 1.5rem;
        margin-bottom: 5px;
    }
    
    .card-title p {
        opacity: 0.9;
        font-size: 1rem;
    }
    
    .card-body > div {
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    
    .performance-level {
        font-weight: 600;
        font-size: 1.2rem;
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        text-align: center;
    }
    
    .completion-date {
        margin-top: 15px;
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .score-excellent {
        color: #28a745;
        font-weight: 600;
    }
    
    .score-good {
        color: #17a2b8;
        font-weight: 600;
    }
    
    .score-fair {
        color: #ffc107;
        font-weight: 600;
    }
    
    .score-poor {
        color: #dc3545;
        font-weight: 600;
    }
    
    .score-pending {
        color: #6c757d;
        font-weight: 600;
    }
    
    .status-graded {
        color: #28a745;
        font-weight: 500;
    }
    
    .status-pending_review {
        color: #ffc107;
        font-weight: 500;
    }
    
    .action-links {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .action-link {
        color: #667eea;
        text-decoration: none;
        font-size: 0.9rem;
        padding: 5px 10px;
        border-radius: 5px;
        transition: background-color 0.2s;
    }
    
    .action-link:hover {
        background: #e9ecef;
    }
`;
document.head.appendChild(style);
