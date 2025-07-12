// ==========================================================================
// ENHANCED DASHBOARD - Killer information-dense dashboard with hot links
// Replace your existing dashboard.js with this enhanced version
// ==========================================================================

const Dashboard = {
    init() {
        console.log('Enhanced Dashboard initialized');
    },

    render() {
        console.log('Rendering enhanced dashboard');
        this.updateMetrics();
        this.renderExecutiveSummary();
        this.renderPipelineOverview();
        this.renderTopOpportunities();
        this.renderUrgentActions();
        this.renderSmartRecommendations();
        this.renderActivityFeed();
        this.renderQuickStats();
    },

    // Helper function to format values as millions
    formatAsMillion(value) {
        if (!value || value === 0) return '$0';
        const millions = value / 1000000;
        return '$' + Math.round(millions) + 'M';
    },

    updateMetrics() {
        // Enhanced metrics calculations
        const allOpps = DataStore.opportunities;
        const activeOpps = allOpps.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        
        const totalPipeline = allOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const activePipeline = activeOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const weightedPipeline = activeOpps.reduce((sum, opp) => 
            sum + ((opp.value || 0) * (opp.probability || opp.pwin || 0) / 100), 0);
        
        const avgProgress = activeOpps.length > 0 ? 
            activeOpps.reduce((sum, opp) => sum + (opp.progress || 0), 0) / activeOpps.length : 0;
        
        // Win rate calculation
        const wonOpps = allOpps.filter(opp => opp.status === 'won');
        const lostOpps = allOpps.filter(opp => opp.status === 'lost');
        const winRate = (wonOpps.length + lostOpps.length) > 0 ? 
            (wonOpps.length / (wonOpps.length + lostOpps.length)) * 100 : 0;

        // Update DOM elements - Format first three as millions
        this.updateMetricElement('total-pipeline', this.formatAsMillion(totalPipeline));
        this.updateMetricElement('active-pipeline', this.formatAsMillion(activePipeline));
        this.updateMetricElement('weighted-pipeline', this.formatAsMillion(weightedPipeline));
        this.updateMetricElement('active-count', activeOpps.length.toString());
        this.updateMetricElement('avg-progress', Math.round(avgProgress) + '%');
        this.updateMetricElement('win-rate', Math.round(winRate) + '%');
    },

    updateMetricElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            // Add animation effect
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    },

    renderExecutiveSummary() {
        const container = document.getElementById('executive-summary');
        if (!container) return;

        const activeOpps = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        
        const urgentActions = DataStore.actions.filter(action => 
            !action.completed && (action.priority === 'High' || this.isOverdue(action.dueDate)));
        
        const closingSoon = activeOpps.filter(opp => {
            const daysUntil = opp.closeDate ? Utils.calculateDaysUntilDate(opp.closeDate) : 999;
            return daysUntil <= 30 && daysUntil > 0;
        });

        container.innerHTML = `
            <div class="executive-summary-card">
                <h3>📊 Executive Summary</h3>
                <div class="summary-stats">
                    <div class="summary-stat" onclick="Navigation.showOpportunities()">
                        <div class="stat-number">${activeOpps.length}</div>
                        <div class="stat-label">Active Opportunities</div>
                        <div class="stat-sublabel">Click to manage →</div>
                    </div>
                    <div class="summary-stat urgent" onclick="Navigation.showActions()">
                        <div class="stat-number">${urgentActions.length}</div>
                        <div class="stat-label">Urgent Actions</div>
                        <div class="stat-sublabel">Needs attention →</div>
                    </div>
                    <div class="summary-stat warning" onclick="this.showClosingSoon()">
                        <div class="stat-number">${closingSoon.length}</div>
                        <div class="stat-label">Closing Soon</div>
                        <div class="stat-sublabel">Next 30 days →</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPipelineOverview() {
        const container = document.getElementById('pipeline-overview');
        if (!container) return;

        const opportunities = DataStore.opportunities;
        const statusGroups = {
            capture: opportunities.filter(opp => !opp.status || opp.status === 'capture'),
            pursuing: opportunities.filter(opp => opp.status === 'pursuing'),
            won: opportunities.filter(opp => opp.status === 'won'),
            lost: opportunities.filter(opp => opp.status === 'lost')
        };

        const totalValue = (opps) => opps.reduce((sum, opp) => sum + (opp.value || 0), 0);

        container.innerHTML = `
            <div class="pipeline-overview-card">
                <h3>💼 Pipeline Overview</h3>
                <div class="pipeline-stages">
                    <div class="pipeline-stage capture" onclick="Navigation.showOpportunities()">
                        <div class="stage-header">
                            <div class="stage-icon">🎯</div>
                            <div class="stage-title">Capture</div>
                        </div>
                        <div class="stage-metrics">
                            <div class="stage-count">${statusGroups.capture.length}</div>
                            <div class="stage-value">${Utils.formatCurrency(totalValue(statusGroups.capture))}</div>
                        </div>
                    </div>
                    <div class="pipeline-stage pursuing" onclick="Navigation.showOpportunities()">
                        <div class="stage-header">
                            <div class="stage-icon">🚀</div>
                            <div class="stage-title">Pursuing</div>
                        </div>
                        <div class="stage-metrics">
                            <div class="stage-count">${statusGroups.pursuing.length}</div>
                            <div class="stage-value">${Utils.formatCurrency(totalValue(statusGroups.pursuing))}</div>
                        </div>
                    </div>
                    <div class="pipeline-stage won" onclick="Navigation.showReports()">
                        <div class="stage-header">
                            <div class="stage-icon">🏆</div>
                            <div class="stage-title">Won</div>
                        </div>
                        <div class="stage-metrics">
                            <div class="stage-count">${statusGroups.won.length}</div>
                            <div class="stage-value">${Utils.formatCurrency(totalValue(statusGroups.won))}</div>
                        </div>
                    </div>
                    <div class="pipeline-stage lost" onclick="Navigation.showReports()">
                        <div class="stage-header">
                            <div class="stage-icon">📉</div>
                            <div class="stage-title">Lost</div>
                        </div>
                        <div class="stage-metrics">
                            <div class="stage-count">${statusGroups.lost.length}</div>
                            <div class="stage-value">${Utils.formatCurrency(totalValue(statusGroups.lost))}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderTopOpportunities() {
        const container = document.getElementById('top-opportunities');
        if (!container) return;

        const activeOpps = DataStore.opportunities
            .filter(opp => !opp.status || opp.status === 'capture' || opp.status === 'pursuing')
            .sort((a, b) => (b.value || 0) - (a.value || 0))
            .slice(0, 5);

        if (activeOpps.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <div class="empty-icon">🎯</div>
                    <h4>No Active Opportunities</h4>
                    <p>Start building your pipeline</p>
                    <button class="btn btn-primary" onclick="Opportunities.openNewModal()">
                        + Add First Opportunity
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="top-opportunities-card">
                <div class="card-header-with-action">
                    <h3>🏆 Top Opportunities</h3>
                    <button class="btn-link" onclick="Navigation.showOpportunities()">View All →</button>
                </div>
                <div class="opportunities-list">
                    ${activeOpps.map(opp => `
                        <div class="opportunity-row" onclick="Opportunities.openDetailModal(${opp.id})">
                            <div class="opp-main">
                                <div class="opp-title">${opp.name}</div>
                                <div class="opp-client">${opp.client || 'Client TBD'}</div>
                            </div>
                            <div class="opp-metrics">
                                <div class="opp-value">${Utils.formatCurrency(opp.value || 0)}</div>
                                <div class="opp-probability">${opp.probability || opp.pwin || 0}% P-Win</div>
                            </div>
                            <div class="opp-progress">
                                <div class="progress-bar-mini">
                                    <div class="progress-fill-mini" style="width: ${opp.progress || 0}%"></div>
                                </div>
                                <div class="progress-text">${Math.round(opp.progress || 0)}%</div>
                            </div>
                            <div class="opp-status">
                                <span class="status-badge-mini status-${opp.status || 'capture'}">
                                    ${opp.status || 'capture'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderUrgentActions() {
        const container = document.getElementById('urgent-actions-widget');
        if (!container) return;

        const urgentActions = DataStore.actions.filter(action => 
            !action.completed && (action.priority === 'High' || this.isOverdue(action.dueDate))
        ).slice(0, 4);

        if (urgentActions.length === 0) {
            container.innerHTML = `
                <div class="urgent-actions-card">
                    <div class="card-header-with-action">
                        <h3>🚨 Urgent Actions</h3>
                        <button class="btn-link" onclick="Navigation.showActions()">View All →</button>
                    </div>
                    <div class="no-urgent-actions">
                        <div class="success-icon">✅</div>
                        <p>No urgent actions - great work!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="urgent-actions-card">
                <div class="card-header-with-action">
                    <h3>🚨 Urgent Actions</h3>
                    <button class="btn-link" onclick="Navigation.showActions()">View All →</button>
                </div>
                <div class="urgent-actions-list">
                    ${urgentActions.map(action => {
                        const opportunity = DataStore.opportunities.find(opp => opp.id == action.opportunityId);
                        const isOverdue = this.isOverdue(action.dueDate);
                        const daysUntil = Utils.calculateDaysUntilDate(action.dueDate);
                        
                        return `
                            <div class="urgent-action-row ${isOverdue ? 'overdue' : ''}" onclick="Navigation.showActions()">
                                <div class="action-priority">
                                    <span class="priority-badge priority-${action.priority.toLowerCase()}">
                                        ${action.priority}
                                    </span>
                                </div>
                                <div class="action-details">
                                    <div class="action-title">${action.title}</div>
                                    <div class="action-opportunity">${opportunity ? opportunity.name : 'Unknown'}</div>
                                </div>
                                <div class="action-timing">
                                    <div class="action-due ${isOverdue ? 'overdue' : daysUntil <= 3 ? 'due-soon' : ''}">
                                        ${isOverdue ? '⚠️ Overdue' : daysUntil <= 0 ? 'Due Today' : `${daysUntil}d left`}
                                    </div>
                                    <div class="action-date">${Utils.formatDate(action.dueDate)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderSmartRecommendations() {
        const container = document.getElementById('smart-recommendations');
        if (!container) return;

        const recommendations = this.generateSmartRecommendations();

        container.innerHTML = `
            <div class="smart-recommendations-card">
                <h3>🤖 Smart Recommendations</h3>
                <div class="recommendations-list">
                    ${recommendations.slice(0, 4).map(rec => `
                        <div class="recommendation-item ${rec.urgency}" onclick="${rec.action}">
                            <div class="rec-icon">${rec.icon}</div>
                            <div class="rec-content">
                                <div class="rec-title">${rec.title}</div>
                                <div class="rec-description">${rec.description}</div>
                            </div>
                            <div class="rec-urgency">
                                <span class="urgency-badge ${rec.urgency}">${rec.urgency}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderActivityFeed() {
        const container = document.getElementById('activity-feed');
        if (!container) return;

        // Generate recent activity from opportunities and actions
        const activities = [];
        
        // Recent opportunity updates
        DataStore.opportunities.forEach(opp => {
            if (opp.createdDate) {
                const daysSince = Utils.calculateDaysUntilDate(opp.createdDate) * -1;
                if (daysSince <= 7) {
                    activities.push({
                        type: 'opportunity',
                        icon: '🎯',
                        title: `New opportunity: ${opp.name}`,
                        subtitle: `${opp.client || 'Client TBD'} • ${Utils.formatCurrency(opp.value || 0)}`,
                        time: `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`,
                        action: `Opportunities.openDetailModal(${opp.id})`
                    });
                }
            }
        });

        // Recent action completions
        DataStore.actions.filter(a => a.completed && a.completedDate).forEach(action => {
            const daysSince = Utils.calculateDaysUntilDate(action.completedDate) * -1;
            if (daysSince <= 7) {
                activities.push({
                    type: 'action',
                    icon: '✅',
                    title: `Completed: ${action.title}`,
                    subtitle: 'Action item completed',
                    time: `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`,
                    action: 'Navigation.showActions()'
                });
            }
        });

        // Sort by recency and limit
        activities.sort((a, b) => a.time.localeCompare(b.time));
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="activity-feed-card">
                    <h3>📈 Recent Activity</h3>
                    <div class="no-activity">
                        <p>No recent activity to show</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="activity-feed-card">
                <h3>📈 Recent Activity</h3>
                <div class="activity-list">
                    ${activities.slice(0, 5).map(activity => `
                        <div class="activity-item" onclick="${activity.action}">
                            <div class="activity-icon">${activity.icon}</div>
                            <div class="activity-content">
                                <div class="activity-title">${activity.title}</div>
                                <div class="activity-subtitle">${activity.subtitle}</div>
                            </div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderQuickStats() {
        const container = document.getElementById('quick-stats');
        if (!container) return;

        const stats = this.calculateQuickStats();

        container.innerHTML = `
            <div class="quick-stats-card">
                <h3>⚡ Quick Stats</h3>
                <div class="stats-grid">
                    <div class="stat-item" onclick="Navigation.showTemplates()">
                        <div class="stat-icon">📋</div>
                        <div class="stat-number">${stats.templatesUsed}</div>
                        <div class="stat-label">Templates Used</div>
                    </div>
                    <div class="stat-item" onclick="Navigation.showRoadmap()">
                        <div class="stat-icon">🛣️</div>
                        <div class="stat-number">${stats.avgPhaseProgress}%</div>
                        <div class="stat-label">Avg Phase Progress</div>
                    </div>
                    <div class="stat-item" onclick="Navigation.showActions()">
                        <div class="stat-icon">⏰</div>
                        <div class="stat-number">${stats.actionsDueSoon}</div>
                        <div class="stat-label">Due This Week</div>
                    </div>
                    <div class="stat-item" onclick="Navigation.showReports()">
                        <div class="stat-icon">📊</div>
                        <div class="stat-number">${stats.winRate}%</div>
                        <div class="stat-label">Win Rate</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Helper methods
    generateSmartRecommendations() {
        const recommendations = [];
        const opportunities = DataStore.opportunities;
        const actions = DataStore.actions;

        // Check for stale opportunities
        const staleOpps = opportunities.filter(opp => {
            const daysSinceUpdate = 30; // Placeholder - would use actual last update date
            return daysSinceUpdate > 14 && (!opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        });

        if (staleOpps.length > 0) {
            recommendations.push({
                icon: '📅',
                title: 'Update Stale Opportunities',
                description: `${staleOpps.length} opportunities need status updates`,
                urgency: 'medium',
                action: 'Navigation.showOpportunities()'
            });
        }

        // Check for overdue actions
        const overdueActions = actions.filter(action => 
            !action.completed && this.isOverdue(action.dueDate));
        
        if (overdueActions.length > 0) {
            recommendations.push({
                icon: '⚠️',
                title: 'Address Overdue Actions',
                description: `${overdueActions.length} actions are past due`,
                urgency: 'high',
                action: 'Navigation.showActions()'
            });
        }

        // Check for opportunities without recent progress
        const lowProgressOpps = opportunities.filter(opp => 
            (!opp.status || opp.status === 'capture' || opp.status === 'pursuing') && 
            (opp.progress || 0) < 20);
        
        if (lowProgressOpps.length > 0) {
            recommendations.push({
                icon: '🎯',
                title: 'Accelerate Early-Stage Opportunities',
                description: `${lowProgressOpps.length} opportunities need capture planning`,
                urgency: 'medium',
                action: 'Navigation.showRoadmap()'
            });
        }

        // Check for missing templates
        const oppsWithoutTemplates = opportunities.filter(opp => {
            const oppTemplates = DataStore.savedTemplates.filter(st => st.opportunityId == opp.id);
            return (!opp.status || opp.status === 'capture' || opp.status === 'pursuing') && 
                   oppTemplates.length === 0;
        });

        if (oppsWithoutTemplates.length > 0) {
            recommendations.push({
                icon: '📝',
                title: 'Complete Capture Templates',
                description: `${oppsWithoutTemplates.length} opportunities missing key templates`,
                urgency: 'medium',
                action: 'Navigation.showTemplates()'
            });
        }

        // Default recommendation if none exist
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '🚀',
                title: 'Looking Good!',
                description: 'Your capture management is on track',
                urgency: 'low',
                action: 'Navigation.showReports()'
            });
        }

        return recommendations;
    },

    calculateQuickStats() {
        const opportunities = DataStore.opportunities;
        const actions = DataStore.actions;
        
        // Templates used count
        const templatesUsed = DataStore.savedTemplates.length;
        
        // Average phase progress
        const activeOpps = opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        const avgPhaseProgress = activeOpps.length > 0 ? 
            Math.round(activeOpps.reduce((sum, opp) => sum + (opp.progress || 0), 0) / activeOpps.length) : 0;
        
        // Actions due this week
        const actionsDueSoon = actions.filter(action => {
            if (action.completed) return false;
            const daysUntil = Utils.calculateDaysUntilDate(action.dueDate);
            return daysUntil >= 0 && daysUntil <= 7;
        }).length;
        
        // Win rate
        const wonOpps = opportunities.filter(opp => opp.status === 'won');
        const lostOpps = opportunities.filter(opp => opp.status === 'lost');
        const winRate = (wonOpps.length + lostOpps.length) > 0 ? 
            Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100) : 0;
        
        return {
            templatesUsed,
            avgPhaseProgress,
            actionsDueSoon,
            winRate
        };
    },

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    },

    showClosingSoon() {
        // Filter and show opportunities closing in next 30 days
        Navigation.showOpportunities();
        // Could add additional filtering logic here
    }
};