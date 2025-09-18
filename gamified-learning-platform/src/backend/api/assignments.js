const fs = require('fs');
const path = require('path');

const assignmentsFilePath = path.join(__dirname, '../db/assignments.json');

// Get all assignments
const getAssignments = (req, res) => {
    fs.readFile(assignmentsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read assignments data' });
        }
        res.status(200).json(JSON.parse(data));
    });
};

// Create a new assignment
const createAssignment = (req, res) => {
    const newAssignment = req.body;

    fs.readFile(assignmentsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read assignments data' });
        }

        const assignments = JSON.parse(data);
        assignments.push(newAssignment);

        fs.writeFile(assignmentsFilePath, JSON.stringify(assignments, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save new assignment' });
            }
            res.status(201).json(newAssignment);
        });
    });
};

// Export the API routes
module.exports = (req, res) => {
    if (req.method === 'GET') {
        return getAssignments(req, res);
    } else if (req.method === 'POST') {
        return createAssignment(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};