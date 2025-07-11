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
        this.hideAllViews();
        document.getElementById('gate-reviews-view').style.display = 'block';
        this.updateActiveNav('Gate Reviews');
        if (typeof GateReviews !== 'undefined') {
            GateReviews.render();
        }
    },

    showReports() {
        this.hideAllViews();
        document.getElementById('reports-view').style.display = 'block';
        this.updateActiveNav('Reports');
        if (typeof Reports !== 'undefined') {
            Reports.render();
        }
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
            'reports-view'
        ];
        
        views.forEach(viewId => {
            const view = document.getElementById(viewId);
            if (view) {
                view.style.display = 'none';
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
    // Load data from localStorage
    DataStore.loadData();
    
    // Load presentation CSS if not already loaded
    if (!document.querySelector('link[href="css/presentation.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/presentation.css';
        document.head.appendChild(link);
    }

    // Initialize all modules
    Dashboard.init();
    
    // Initialize Gate Reviews if available
    if (typeof GateReviews !== 'undefined') {
        GateReviews.init();
    }
    
    // Show dashboard by default
    Navigation.showDashboard();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}