const Opportunities = {
    render(containerId, opportunitiesList = DataStore.opportunities) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (opportunitiesList.length === 0) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No opportunities found</div>';
            return;
        }

        container.innerHTML = opportunitiesList.map(opp => `
            <div class="opportunity-item">
                <div class="opportunity-info">
                    <h4>${opp.name}</h4>
                    <div class="opportunity-details">
                        ${opp.customer} • ${opp.type} • ${opp.role}
                        ${opp.incumbent ? ` • Incumbent: ${opp.incumbent}` : ''}
                    </div>
                </div>
                <div class="status-badge status-${opp.currentPhase}">
                    ${opp.currentPhase.charAt(0).toUpperCase() + opp.currentPhase.slice(1)}
                </div>
                <div class="progress-indicator">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${opp.progress}%"></div>
                    </div>
                    <small>${opp.progress}%</small>
                </div>
                <div class="pwin-indicator pwin-${this.getPwinClass(opp.pwin)}">
                    ${opp.pwin}%
                </div>
                <div style="text-align: right; font-size: 0.9rem;">
                    <strong>${Utils.formatCurrency(opp.value)}</strong>
                    <div style="color: #666; font-size: 0.8rem;">
                        ${opp.rfpDate ? Utils.formatDate(opp.rfpDate) : 'TBD'}
                    </div>
                </div>
            </div>
        `).join('');
    },

    getPwinClass(pwin) {
        return pwin >= 70 ? 'high' : pwin >= 40 ? 'medium' : 'low';
    },

    renderAll() {
        this.render('all-opportunities', DataStore.opportunities);
    },

    openNewModal() {
        document.getElementById('opportunityModal').style.display = 'block';
        document.getElementById('opportunityForm').reset();
    },

    save(event) {
        event.preventDefault();
        
        const newOpportunity = {
            name: document.getElementById('oppName').value,
            customer: document.getElementById('oppCustomer').value,
            value: parseInt(document.getElementById('oppValue').value) || 0,
            rfpDate: document.getElementById('oppRfpDate').value,
            pwin: parseInt(document.getElementById('oppPwin').value) || 50,
            type: document.getElementById('oppType').value,
            role: document.getElementById('oppRole').value,
            incumbent: document.getElementById('oppIncumbent').value,
            description: document.getElementById('oppDescription').value
        };
        
        DataStore.addOpportunity(newOpportunity);
        this.closeModal();
        Dashboard.refresh();
        
        if (document.getElementById('roadmap-view').style.display !== 'none') {
            Roadmap.render();
        }
        if (document.getElementById('opportunities-view').style.display !== 'none') {
            this.renderAll();
        }
        
        alert('Opportunity added successfully!');
    },

    closeModal() {
        document.getElementById('opportunityModal').style.display = 'none';
    }
};
