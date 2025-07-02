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
        if (typeof Templates !== 'undefined') {
            Templates.render();
        }
    },

    showReports() {
        this.hideAllViews();
        // Add reports view when implemented
        alert('Reports functionality coming soon!');
    },

    hideAllViews() {
        const views = [
            'dashboard-view',
            'opportunities-view',
            'roadmap-view',
            'actions-view',
            'templates-view',
            'saved-templates-view'
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

    if (event.target === opportunityModal) {
        Opportunities.closeModal();
    }
    if (event.target === phaseModal) {
        Roadmap.closePhaseModal();
    }
    if (event.target === templateModal) {
        Templates.closeModal();
    }
    if (event.target === actionModal) {
        Actions.closeModal();
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
    
    // Initialize all modules
    Dashboard.init();
    
    // Show dashboard by default
    Navigation.showDashboard();
});
