document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    // Function to navigate to different sections
    function navigateTo(section) {
        mainContent.innerHTML = ''; // Clear current content
        if (section === 'dashboard') {
            loadDashboard();
        } else if (section === 'gamification') {
            loadGamification();
        }
    }

    // Load the dashboard component
    function loadDashboard() {
        import('../components/dashboard.js').then(module => {
            const dashboard = module.default();
            mainContent.appendChild(dashboard);
        });
    }

    // Load the gamification component
    function loadGamification() {
        import('../components/gamification.js').then(module => {
            const gamification = module.default();
            mainContent.appendChild(gamification);
        });
    }

    // Event listeners for navigation buttons
    document.getElementById('nav-dashboard').addEventListener('click', () => navigateTo('dashboard'));
    document.getElementById('nav-gamification').addEventListener('click', () => navigateTo('gamification'));

    // Initial load
    navigateTo('dashboard');
});