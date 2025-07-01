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
        Dashboard.refresh();
    },

    showOpportunities() {
        this.hideAllViews();
        document.getElementById('opportunities-view').style.display = 'block';
        this.updateActiveNav('Opportunities');
        Opportunities.renderAll();
    },

    showRoadmap() {
        this.hideAllViews();
        document.getElementById('roadmap-view').style.display = 'block';
        this.updateActiveNav('Roadmap');
        Roadmap.render();
    },

    showActions() {
        this.hideAllViews();
        document.getElementById('actions-view').style.display = 'block';
        this.updateActiveNav('Action Items');
        Actions.renderAll();
    },

    showTemplates() {
        this.hideAllViews();
        document.getElementById('templates-view').style.display = 'block';
        this.updateActiveNav('Templates');
        Templates.render();
    },

    showReports() {
        alert('Reports functionality coming soon!');
    },

    hideAllViews() {
        const views = ['dashboard-view', 'opportunities-view', 'roadmap-view', 'actions-view', 'templates-view', 'saved-templates-view'];
        views.forEach(viewId => {
            const element = document.getElementById(viewId);
            if (element) element.style.display = 'none';
        });
    },

    updateActiveNav(activeSection) {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.textContent === activeSection) {
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

// Initialize when DOM is ready  
document.addEventListener('DOMContentLoaded', () => {
    CaptureManager.init();
});
