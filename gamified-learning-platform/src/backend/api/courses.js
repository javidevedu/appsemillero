const fs = require('fs');
const path = require('path');

const coursesFilePath = path.join(__dirname, '../db/courses.json');

const getCourses = (req, res) => {
    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading courses data' });
        }
        res.status(200).json(JSON.parse(data));
    });
};

const createCourse = (req, res) => {
    const newCourse = req.body;

    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading courses data' });
        }

        const courses = JSON.parse(data);
        courses.push(newCourse);

        fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving course data' });
            }
            res.status(201).json(newCourse);
        });
    });
};

const updateCourse = (req, res) => {
    const { id } = req.params;
    const updatedCourse = req.body;

    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading courses data' });
        }

        const courses = JSON.parse(data);
        const courseIndex = courses.findIndex(course => course.id === id);

        if (courseIndex === -1) {
            return res.status(404).json({ message: 'Course not found' });
        }

        courses[courseIndex] = { ...courses[courseIndex], ...updatedCourse };

        fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving course data' });
            }
            res.status(200).json(courses[courseIndex]);
        });
    });
};

const deleteCourse = (req, res) => {
    const { id } = req.params;

    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading courses data' });
        }

        let courses = JSON.parse(data);
        courses = courses.filter(course => course.id !== id);

        fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving course data' });
            }
            res.status(204).send();
        });
    });
};

module.exports = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
};