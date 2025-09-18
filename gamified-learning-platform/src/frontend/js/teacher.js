// This file contains JavaScript functions specific to the teacher's interface, including creating activities and generating unique links.

document.addEventListener('DOMContentLoaded', () => {
    const createActivityForm = document.getElementById('create-activity-form');
    const activityList = document.getElementById('activity-list');

    createActivityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const activityName = document.getElementById('activity-name').value;
        const activityLink = generateUniqueLink(activityName);
        addActivityToList(activityName, activityLink);
        createActivityForm.reset();
    });

    function generateUniqueLink(activityName) {
        const uniqueId = 'activity-' + Date.now();
        return `https://yourplatform.com/activities/${uniqueId}?name=${encodeURIComponent(activityName)}`;
    }

    function addActivityToList(name, link) {
        const listItem = document.createElement('li');
        listItem.textContent = `Activity: ${name} - Link: ${link}`;
        activityList.appendChild(listItem);
    }
});