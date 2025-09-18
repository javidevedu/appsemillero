const Dashboard = () => {
    const createActivity = () => {
        // Logic to create a new activity
        alert("Create Activity functionality to be implemented.");
    };

    const viewResults = () => {
        // Logic to view results of activities
        alert("View Results functionality to be implemented.");
    };

    return `
        <div class="dashboard">
            <h1>Teacher's Dashboard</h1>
            <button onclick="createActivity()">Create Activity</button>
            <button onclick="viewResults()">View Results</button>
        </div>
    `;
};

export default Dashboard;