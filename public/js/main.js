// Funcionalidad principal de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const createActivityBtn = document.getElementById('create-activity-btn');
    const activityCreator = document.getElementById('activity-creator');
    const activityLinks = document.getElementById('activity-links');
    const saveActivityBtn = document.getElementById('save-activity-btn');
    const cancelActivityBtn = document.getElementById('cancel-activity-btn');
    const createNewActivityBtn = document.getElementById('create-new-activity-btn');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Mostrar el creador de actividades
    createActivityBtn.addEventListener('click', () => {
        document.querySelector('.hero').classList.add('hidden');
        activityCreator.classList.remove('hidden');
    });

    // Cancelar la creación de actividad
    cancelActivityBtn.addEventListener('click', () => {
        activityCreator.classList.add('hidden');
        document.querySelector('.hero').classList.remove('hidden');
        resetForm();
    });

    // Guardar la actividad
    saveActivityBtn.addEventListener('click', async () => {
        if (validateForm()) {
            const activityData = collectFormData();
            try {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(activityData)
                });

                if (response.ok) {
                    const data = await response.json();
                    showActivityLinks(data.studentLink, data.adminLink);
                } else {
                    alert('Error al crear la actividad. Por favor, intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor. Por favor, intenta de nuevo.');
            }
        }
    });

    // Crear nueva actividad después de generar enlaces
    createNewActivityBtn.addEventListener('click', () => {
        activityLinks.classList.add('hidden');
        resetForm();
        document.querySelector('.hero').classList.remove('hidden');
    });

    // Funcionalidad de copiar al portapapeles
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const inputElement = document.getElementById(targetId);
            
            inputElement.select();
            document.execCommand('copy');
            
            // Feedback visual
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    });

    // Funciones auxiliares
    function validateForm() {
        const activityName = document.getElementById('activity-name').value;
        const activityType = document.getElementById('activity-type').value;
        
        if (!activityName || !activityType) {
            alert('Por favor, completa todos los campos obligatorios.');
            return false;
        }
        
        // Validación específica según el tipo de actividad
        switch (activityType) {
            case 'reading':
                return validateReadingActivity();
            case 'writing':
                return validateWritingActivity();
            case 'listening':
                return validateListeningActivity();
            case 'speaking':
                return validateSpeakingActivity();
            default:
                return true;
        }
    }

    function collectFormData() {
        const activityName = document.getElementById('activity-name').value;
        const activityType = document.getElementById('activity-type').value;
        
        const baseData = {
            name: activityName,
            type: activityType,
            createdAt: new Date().toISOString()
        };
        
        // Datos específicos según el tipo de actividad
        switch (activityType) {
            case 'reading':
                return { ...baseData, ...collectReadingData() };
            case 'writing':
                return { ...baseData, ...collectWritingData() };
            case 'listening':
                return { ...baseData, ...collectListeningData() };
            case 'speaking':
                return { ...baseData, ...collectSpeakingData() };
            default:
                return baseData;
        }
    }

    function resetForm() {
        document.getElementById('activity-name').value = '';
        document.getElementById('activity-type').value = '';
        document.getElementById('activity-form-container').innerHTML = '';
    }

    function showActivityLinks(studentLink, adminLink) {
        activityCreator.classList.add('hidden');
        activityLinks.classList.remove('hidden');
        
        document.getElementById('student-link').value = studentLink;
        document.getElementById('admin-link').value = adminLink;
    }
});

// Funciones para validar y recopilar datos específicos de cada tipo de actividad
// Estas funciones serán implementadas en activity-creator.js
function validateReadingActivity() {
    // Implementado en activity-creator.js
    return true;
}

function validateWritingActivity() {
    // Implementado en activity-creator.js
    return true;
}

function validateListeningActivity() {
    // Implementado en activity-creator.js
    return true;
}

function validateSpeakingActivity() {
    // Implementado en activity-creator.js
    return true;
}

function collectReadingData() {
    // Implementado en activity-creator.js
    return {};
}

function collectWritingData() {
    // Implementado en activity-creator.js
    return {};
}

function collectListeningData() {
    // Implementado en activity-creator.js
    return {};
}

function collectSpeakingData() {
    // Implementado en activity-creator.js
    return {};
}