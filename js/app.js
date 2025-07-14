// Main application namespace
const CaptureManager = {
    init() {
        console.log('Capture Manager Pro initialized');
        Navigation.showDashboard();
    }
};

// Navigation controller
const Navigation = {
    showDashboard() {
        this.hideAllViews();
        document.getElementById('dashboard-view').style.display = 'block';
        this.updateActiveNav('Dashboard');
        Dashboard.render();
    },

    showOpportunities() {
        this.hideAllViews();
        document.getElementById('opportunities-view').style.display = 'block';
        this.updateActiveNav('Opportunities');
        Opportunities.render();
    },

    showRoadmap() {
        this.hideAllViews();
        document.getElementById('roadmap-view').style.display = 'block';
        this.updateActiveNav('Roadmap');
        if (typeof Roadmap !== 'undefined') {
            Roadmap.render();
        }
    },

    showActions() {
        this.hideAllViews();
        document.getElementById('actions-view').style.display = 'block';
        this.updateActiveNav('Action Items');
        if (typeof Actions !== 'undefined') {
            Actions.render();
        }
    },

    showTemplates() {
        this.hideAllViews();
        document.getElementById('templates-view').style.display = 'block';
        this.updateActiveNav('Templates');
        Templates.render();
    },

    showGateReviews() {
        // Hide all views first
        this.hideAllViews();
        
        // Show gate reviews view
        document.getElementById('gate-reviews-view').style.display = 'block';
        
        // Update navigation
        this.updateActiveNav('gate-reviews');
        
        // FIXED: Only render gate reviews when actually showing the page
        GateReviews.render();
    },

    showReports() {
        this.hideAllViews();
        document.getElementById('reports-view').style.display = 'block';
        this.updateActiveNav('Reports');
        if (typeof Reports !== 'undefined') {
            Reports.render();
        }
    },

    showGatePackages() {
        this.hideAllViews();
        document.getElementById('gate-packages-view').style.display = 'block';
        document.title = 'Gate Packages - Capture Manager Pro';
        GatePackages.render();
    },

    hideAllViews() {
        const views = [
            'dashboard-view',
            'opportunities-view',
            'roadmap-view',
            'actions-view',
            'templates-view',
            'saved-templates-view',
            'gate-reviews-view',
            'reports-view',
            'gate-packages-view'  // ADD THIS
        ];
        
        views.forEach(viewId => {
            const element = document.getElementById(viewId);
            if (element) {
                element.style.display = 'none';
            }
        });
    },

    updateActiveNav(activeText) {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim() === activeText) {
                link.classList.add('active');
            }
        });
    }
};

window.onclick = function(event) {
    const opportunityModal = document.getElementById('opportunityModal');
    const phaseModal = document.getElementById('phaseDetailModal');
    const templateModal = document.getElementById('templateDetailModal');
    const actionModal = document.getElementById('actionModal');
    const gateReviewModal = document.getElementById('gateReviewModal');

    if (event.target === opportunityModal) {
        Opportunities.closeModal();
    }
    if (event.target === phaseModal && typeof Roadmap !== 'undefined') {
        Roadmap.closePhaseModal();
    }
    if (event.target === templateModal && typeof Templates !== 'undefined') {
        Templates.closeModal();
    }
    if (event.target === actionModal && typeof Actions !== 'undefined') {
        Actions.closeModal();
    }
    if (event.target === gateReviewModal && typeof GateReviews !== 'undefined') {
        GateReviews.closeReviewModal();
    }
};

// Update the loadData function
function loadData() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to load');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const result = DataStore.importData(e.target.result);
            if (result.success) {
                alert(result.message);
                // Refresh all views
                Navigation.showOpportunities();
            } else {
                alert('Error loading data: ' + result.message);
            }
        } catch (error) {
            alert('Error loading file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    DataStore.loadData();
    
    // Show dashboard by default
    Navigation.showDashboard();
    
    // DON'T automatically render gate reviews here
    // GateReviews.render(); // <-- REMOVE THIS LINE
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}