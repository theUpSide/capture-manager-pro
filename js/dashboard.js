const Dashboard = {
    refresh() {
        this.updateMetrics();
        this.renderOpportunities();
        this.renderUrgentActions();
        this.renderSmartRecommendations();
    },

    updateMetrics() {
        const totalPipeline = DataStore.opportunities.reduce((sum, opp) => sum + opp.value, 0);
        const weightedPipeline = DataStore.opportunities.reduce((sum, opp) => sum + (opp.value * opp.pwin / 100), 0);
        const avgProgress = DataStore.opportunities.length > 0 ? 
            Math.round(DataStore.opportunities.reduce((sum, opp) => sum + opp.progress, 0) / DataStore.opportunities.length) : 0;

        document.getElementById('total-pipeline').textContent = `$${(totalPipeline / 1000000).toFixed(1)}M`;
        document.getElementById('weighted-pipeline').textContent = `$${(weightedPipeline / 1000000).toFixed(1)}M`;
        document.getElementById('active-count').textContent = DataStore.opportunities.length;
        document.getElementById('avg-progress').textContent = `${avgProgress}%`;
    },

    renderOpportunities() {
        Opportunities.render('opportunity-list', DataStore.opportunities);
    },

    renderUrgentActions() {
        Actions.renderUrgent();
    },

    renderSmartRecommendations() {
        const container = document.getElementById('smart-recommendations');
        const recommendations = this.generateSmartRecommendations();
        
        container.innerHTML = recommendations.map(rec => `
            <div class="next-action-item">
                <div>
                    <strong>${rec.title}</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${rec.description}</div>
                </div>
                <div style="color: #ffd700;">⭐ ${rec.priority}</div>
            </div>
        `).join('');
    },

    generateSmartRecommendations() {
        const recommendations = [];
        
        DataStore.opportunities.forEach(opp => {
            const daysToRfp = opp.rfpDate ? Utils.calculateDaysUntilDate(opp.rfpDate) : null;
            
            if (daysToRfp && daysToRfp < 60 && opp.progress < 70) {
                recommendations.push({
                    title: `Accelerate ${opp.name}`,
                    description: `Only ${daysToRfp} days to RFP, currently ${opp.progress}% complete`,
                    priority: 'High'
                });
            }
            
            if (opp.pwin < 50 && opp.currentPhase === 'engagement') {
                recommendations.push({
                    title: `Improve positioning for ${opp.name}`,
                    description: `Low PWin (${opp.pwin}%) during engagement phase`,
                    priority: 'Medium'
                });
            }
        });

        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Pipeline looking good!',
                description: 'All opportunities are progressing well. Consider adding new prospects.',
                priority: 'Low'
            });
        }

        return recommendations.slice(0, 3);
    }
};
