export default class Gamification {
    constructor() {
        this.cards = [];
        this.loadCards();
    }

    loadCards() {
        fetch('/api/gamification/cards')
            .then(response => response.json())
            .then(data => {
                this.cards = data;
                this.renderCards();
            })
            .catch(error => console.error('Error loading cards:', error));
    }

    renderCards() {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <h3>${card.title}</h3>
                <p>${card.description}</p>
                <button onclick="gamification.collectCard('${card.id}')">Collect</button>
            `;
            cardContainer.appendChild(cardElement);
        });
    }

    collectCard(cardId) {
        fetch(`/api/gamification/collect/${cardId}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    alert('Card collected!');
                    this.loadCards();
                } else {
                    alert('Failed to collect card.');
                }
            })
            .catch(error => console.error('Error collecting card:', error));
    }
}

const gamification = new Gamification();