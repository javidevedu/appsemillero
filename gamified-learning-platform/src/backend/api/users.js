const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../db/users.json');

// Get all users
const getUsers = (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users data' });
        }
        res.status(200).json(JSON.parse(data));
    });
};

// Add a new user
const addUser = (req, res) => {
    const newUser = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users data' });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user data' });
            }
            res.status(201).json(newUser);
        });
    });
};

// Export the API routes
module.exports = (req, res) => {
    if (req.method === 'GET') {
        getUsers(req, res);
    } else if (req.method === 'POST') {
        addUser(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};