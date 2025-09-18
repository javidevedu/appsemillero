const fs = require('fs');
const path = require('path');

const gamificationDataPath = path.join(__dirname, '../db/gamification.json');

// Get all collectible cards
const getCollectibleCards = (req, res) => {
    fs.readFile(gamificationDataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        res.status(200).json(JSON.parse(data));
    });
};

// Add a new collectible card
const addCollectibleCard = (req, res) => {
    const newCard = req.body;

    fs.readFile(gamificationDataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        const cards = JSON.parse(data);
        cards.push(newCard);

        fs.writeFile(gamificationDataPath, JSON.stringify(cards, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.status(201).json(newCard);
        });
    });
};

// Export the API routes
module.exports = (req, res) => {
    if (req.method === 'GET') {
        getCollectibleCards(req, res);
    } else if (req.method === 'POST') {
        addCollectibleCard(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};