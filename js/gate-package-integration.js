// Gate Package Integration - Hooks into existing system
// This file centralizes calls to gate package features from other modules.
// Assumes updates in opportunities.js (renderOpportunityCard with gate badges and button) and dashboard.js (renderGatePackageMetrics) from Phase 5.

document.addEventListener('DOMContentLoaded', () => {
    // If needed, initialize any global listeners here
});

// Example: Called from opportunity card "Gate Reviews" button (in opportunities.js)
function openGateReviewsForOpportunity(opportunityId) {
    GatePackages.openGatePackageSelector(opportunityId);
}

// Example: Get gate status for opportunity cards (called from opportunities.js renderOpportunityCard)
function getGateStatusBadge(opportunityId) {
    const gatePackages = DataStore.gatePackages.filter(gp => gp.opportunityId === opportunityId);
    if (gatePackages.length === 0) {
        return '<span class="gate-status-badge none">No Gates</span>';
    }
    const approved = gatePackages.filter(gp => gp.status === 'approved');
    if (approved.length > 0) {
        const lastGate = Math.max(...approved.map(gp => gp.gateNumber));
        return `<span class="gate-status-badge completed">Gate ${lastGate} ✓</span>`;
    }
    const currentGate = Math.min(...gatePackages.map(gp => gp.gateNumber));
    return `<span class="gate-status-badge pending">Gate ${currentGate} ⏳</span>`;
}

// Example: Get gate metrics for dashboard (called from dashboard.js renderGatePackageMetrics)
function getGatePackageMetrics() {
    const gatePackages = DataStore.gatePackages || [];
    const approved = gatePackages.filter(gp => gp.status === 'approved').length;
    const pending = gatePackages.filter(gp => gp.status === 'draft' || gp.status === 'in-review').length;
    return { approved, pending };
};

// Remove stub for presentation feature—full impl in presentation.js