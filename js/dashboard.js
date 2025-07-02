const Dashboard = {
    init() {
        // Initialize dashboard
        console.log('Dashboard initialized');
    },

    render() {
        console.log('Rendering dashboard');
        this.updateMetrics();
        this.renderOpportunityList();
        this.renderUrgentActions();
        this.renderSmartRecommendations();
    },

    updateMetrics() {
        // Calculate pipeline metrics
        const totalPipeline = DataStore.opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const weightedPipeline = DataStore.opportunities.reduce((sum, opp) => 
            sum + ((opp.value || 0) * (opp.probability || 0) / 100), 0);
        
        const activeOpportunities = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing').length;
        
        const avgProgress = DataStore.opportunities.length > 0 ? 
            DataStore.opportunities.reduce((sum, opp) => sum + (opp.progress || 0), 0) / DataStore.opportunities.length : 0;

        // Update DOM elements
        const totalPipelineEl = document.getElementById('total-pipeline');
        const weightedPipelineEl = document.getElementById('weighted-pipeline');
        const activeCountEl = document.getElementById('active-count');
        const avgProgressEl = document.getElementById('avg-progress');

        if (totalPipelineEl) totalPipelineEl.textContent = Utils.formatCurrency(totalPipeline);
        if (weightedPipelineEl) weightedPipelineEl.textContent = Utils.formatCurrency(weightedPipeline);
        if (activeCountEl) activeCountEl.textContent = activeOpportunities.toString();
        if (avgProgressEl) avgProgressEl.textContent = Math.round(avgProgress) + '%';
    },

    renderOpportunityList() {
        const container = document.getElementById('opportunity-list');
        if (!container) return;

        const activeOpportunities = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing');

        if (activeOpportunities.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>No active opportunities</p>
                    <button class="btn" onclick="Opportunities.openNewModal()">Add Your First Opportunity</button>
                </div>
            `;
            return;
        }

        container.innerHTML = activeOpportunities.slice(0, 5).map(opp => `
            <div class="opportunity-summary">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4>${opp.name}</h4>
                    <span class="status-badge status-${opp.status || 'capture'}">${opp.status || 'capture'}</span>
                </div>
                <div class="opportunity-details">
                    <span><strong>Value:</strong> ${Utils.formatCurrency(opp.value || 0)}</span>
                    <span><strong>P(win):</strong> ${opp.probability || opp.pwin || 0}%</span>
                    <span><strong>Close:</strong> ${Utils.formatDate(opp.closeDate || opp.rfpDate)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${opp.progress || 0}%"></div>
                </div>
            </div>
        `).join('');
    },

    renderUrgentActions() {
        const container = document.getElementById('urgent-actions');
        if (!container) return;

        const urgentActions = DataStore.actions.filter(action => 
            !action.completed && (action.priority === 'High' || this.isOverdue(action.dueDate))
        ).slice(0, 5);

        if (urgentActions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>No urgent actions</p>
                </div>
            `;
            return;
        }

        container.innerHTML = urgentActions.map(action => {
            const opportunity = DataStore.opportunities.find(opp => opp.id == action.opportunityId);
            const isOverdue = this.isOverdue(action.dueDate);
            
            return `
                <div class="action-summary ${isOverdue ? 'overdue' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h5>${action.title}</h5>
                        <span class="priority-badge priority-${action.priority.toLowerCase()}">${action.priority}</span>
                    </div>
                    <p style="color: #666; margin: 0.5rem 0;">${opportunity ? opportunity.name : 'Unknown Opportunity'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.9rem;">Due: ${Utils.formatDate(action.dueDate)}</span>
                        <span style="font-size: 0.9rem; color: ${isOverdue ? '#dc3545' : '#666'};">
                            ${isOverdue ? 'Overdue' : Utils.getDaysUntil(action.dueDate) + ' days left'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderSmartRecommendations() {
        const container = document.getElementById('smart-recommendations');
        if (!container) return;

        const recommendations = this.generateRecommendations();
        
        if (recommendations.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>No recommendations at this time</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.2rem; margin-right: 0.5rem;">${rec.icon}</span>
                    <strong>${rec.title}</strong>
                </div>
                <p style="margin: 0; color: #666;">${rec.description}</p>
                ${rec.action ? `<button class="btn btn-secondary" style="margin-top: 0.5rem; font-size: 0.8rem;" onclick="${rec.action}">Take Action</button>` : ''}
            </div>
        `).join('');
    },

    generateRecommendations() {
        const recommendations = [];

        // Check for overdue actions
        const overdueActions = DataStore.actions.filter(action => 
            !action.completed && this.isOverdue(action.dueDate));
        
        if (overdueActions.length > 0) {
            recommendations.push({
                icon: '⚠️',
                title: `${overdueActions.length} Overdue Action${overdueActions.length > 1 ? 's' : ''}`,
                description: 'You have overdue action items that need immediate attention.',
                action: 'Navigation.showActions()'
            });
        }

        // Check for opportunities without recent activity
        const staleOpportunities = DataStore.opportunities.filter(opp => {
            const lastActivity = new Date(opp.lastModified || opp.createdDate);
            const daysSinceActivity = (new Date() - lastActivity) / (1000 * 60 * 60 * 24);
            return daysSinceActivity > 14 && (!opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        });

        if (staleOpportunities.length > 0) {
            recommendations.push({
                icon: '📅',
                title: `${staleOpportunities.length} Opportunity${staleOpportunities.length > 1 ? 'ies' : 'y'} Need${staleOpportunities.length === 1 ? 's' : ''} Attention`,
                description: 'Some opportunities haven\'t been updated in over 2 weeks.',
                action: 'Navigation.showOpportunities()'
            });
        }

        // Check for high-value opportunities with low probability
        const highValueLowProb = DataStore.opportunities.filter(opp => 
            (opp.value || 0) > 1000000 && (opp.probability || opp.pwin || 0) < 30);

        if (highValueLowProb.length > 0) {
            recommendations.push({
                icon: '💡',
                title: 'High-Value Opportunities Need Strategy Review',
                description: 'Consider strategic initiatives to improve win probability on high-value opportunities.',
                action: 'Navigation.showOpportunities()'
            });
        }

        // Check for opportunities closing soon
        const closingSoon = DataStore.opportunities.filter(opp => {
            const closeDate = new Date(opp.closeDate || opp.rfpDate);
            const daysUntil = (closeDate - new Date()) / (1000 * 60 * 60 * 24);
            return daysUntil > 0 && daysUntil <= 30 && (!opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        });

        if (closingSoon.length > 0) {
            recommendations.push({
                icon: '⏰',
                title: `${closingSoon.length} Opportunity${closingSoon.length > 1 ? 'ies' : 'y'} Closing Soon`,
                description: 'Review preparation status for opportunities closing within 30 days.',
                action: 'Navigation.showOpportunities()'
            });
        }

        return recommendations.slice(0, 4); // Limit to 4 recommendations
    },

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }
};
