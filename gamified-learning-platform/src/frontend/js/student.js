// This file contains JavaScript functions specific to the student's interface, including submitting answers and viewing results.

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-answer');
    const resultContainer = document.getElementById('result-container');

    submitButton.addEventListener('click', submitAnswer);
});

function submitAnswer() {
    const answerInput = document.getElementById('answer-input').value;
    const assignmentId = document.getElementById('assignment-id').value;

    if (answerInput.trim() === '') {
        alert('Please enter an answer before submitting.');
        return;
    }

    fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answerInput }),
    })
    .then(response => response.json())
    .then(data => {
        displayResult(data);
    })
    .catch(error => {
        console.error('Error submitting answer:', error);
    });
}

function displayResult(data) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    if (data.success) {
        resultContainer.innerHTML = `<p>Your answer has been submitted successfully!</p>`;
    } else {
        resultContainer.innerHTML = `<p>Error: ${data.message}</p>`;
    }
}