const Roadmap = {
    render() {
        this.renderTimeline();
    },

    renderTimeline() {
        const container = document.getElementById('roadmap-timeline-rows');
        if (!container) return;
        
        // Filter opportunities to only show active ones (capture or pursuing status)
        const activeOpportunities = DataStore.opportunities.filter(opp => {
            const status = opp.status || 'capture'; // default to 'capture' if no status set
            return status === 'capture' || status === 'pursuing';
        });
        
        container.innerHTML = activeOpportunities.map(opp => {
            const daysToRfp = opp.rfpDate ? Utils.calculateDaysUntilDate(opp.rfpDate) : null;
            
            return `
                <div class="timeline-row">
                    <div class="opportunity-info-cell">
                        <div class="opp-name">${opp.name}</div>
                        <div class="opp-details">
                            <strong>${opp.customer}</strong><br>
                            ${opp.type} • ${opp.role}${opp.incumbent ? ` • vs ${opp.incumbent}` : ''}
                        </div>
                        <div class="opp-metrics">
                            <div class="metric-badge value">
                                💰 ${Utils.formatCurrency(opp.value)}
                            </div>
                            <div class="metric-badge pwin-${this.getPwinClass(opp.pwin)}">
                                🎯 ${opp.pwin}%
                            </div>
                            <div class="metric-badge">
                                📅 ${daysToRfp ? `${daysToRfp}d to RFP` : 'TBD'}
                            </div>
                        </div>
                    </div>
                    <div class="phase-blocks-container">
                        ${this.generatePhaseBlocks(opp, daysToRfp)}
                    </div>
                </div>
            `;
        }).join('');
    },

    generatePhaseBlocks(opportunity, daysToRfp) {
        const phases = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        
        return phases.map(phaseKey => {
            const phase = DataStore.captureRoadmap[phaseKey];
            const currentPhaseIndex = phases.indexOf(opportunity.currentPhase);
            const thisPhaseIndex = phases.indexOf(phaseKey);
            
            let status, icon, progress, statusText, className;
            
            if (thisPhaseIndex < currentPhaseIndex) {
                // Completed phase
                status = 'completed';
                icon = '✅';
                progress = '100%';
                statusText = 'Complete';
                className = 'completed';
            } else if (thisPhaseIndex === currentPhaseIndex) {
                // Current phase - check if needs attention
                const needsAttention = this.shouldPhaseNeedAttention(phaseKey, daysToRfp, opportunity.progress);
                
                if (needsAttention) {
                    status = 'needs-attention';
                    icon = '🎯';
                    progress = `${opportunity.progress}%`;
                    statusText = 'Needs Attention';
                    className = 'needs-attention';
                } else {
                    status = 'current';
                    icon = '🔄';
                    progress = `${opportunity.progress}%`;
                    statusText = 'In Progress';
                    className = 'current';
                }
            } else {
                // Future phase
                status = 'upcoming';
                icon = '⏳';
                progress = '0%';
                statusText = 'Pending';
                className = 'upcoming';
            }
            
            const tooltipText = this.generateTooltipText(opportunity, phase, status, daysToRfp);
            
            return `
                <div class="phase-block ${className}" onclick="Roadmap.openPhaseDetail('${opportunity.id}', '${phaseKey}')">
                    <div class="phase-icon">${icon}</div>
                    <div class="phase-progress">${progress}</div>
                    <div class="phase-status">${statusText}</div>
                    <div class="tooltip">${tooltipText}</div>
                </div>
            `;
        }).join('');
    },

    shouldPhaseNeedAttention(phaseKey, daysToRfp, progress) {
        if (!daysToRfp || daysToRfp < 0) return false;
        
        // Define when phases should be completed based on days to RFP
        const phaseTimelines = {
            'identification': { shouldCompleteBy: 200, minProgress: 90 },
            'qualification': { shouldCompleteBy: 180, minProgress: 80 },
            'planning': { shouldCompleteBy: 150, minProgress: 70 },
            'engagement': { shouldCompleteBy: 120, minProgress: 60 },
            'intelligence': { shouldCompleteBy: 90, minProgress: 50 },
            'preparation': { shouldCompleteBy: 30, minProgress: 40 }
        };
        
        const timeline = phaseTimelines[phaseKey];
        if (!timeline) return false;
        
        // If we're close to RFP and progress is low, needs attention
        return daysToRfp <= timeline.shouldCompleteBy && progress < timeline.minProgress;
    },

    generateTooltipText(opportunity, phase, status, daysToRfp) {
        let tooltip = `${phase.title}\n${phase.steps.length} steps`;
        
        switch(status) {
            case 'completed':
                tooltip += '\n✅ Phase completed';
                break;
            case 'current':
                tooltip += `\n🔄 ${opportunity.progress}% complete`;
                break;
            case 'needs-attention':
                tooltip += `\n🎯 ${opportunity.progress}% - needs attention`;
                break;
            case 'upcoming':
                tooltip += '\n⏳ Not started';
                break;
        }
        
        if (daysToRfp) {
            tooltip += `\n📅 ${daysToRfp} days to RFP`;
        }
        
        return tooltip;
    },

    getPwinClass(pwin) {
        return pwin >= 70 ? 'high' : pwin >= 40 ? 'medium' : 'low';
    },

    openPhaseDetail(opportunityId, phaseKey) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        const phase = DataStore.captureRoadmap[phaseKey];
        
        if (!opportunity || !phase) return;
        
        const modal = document.getElementById('phaseDetailModal');
        const content = document.getElementById('phase-detail-content');
        
        // Calculate phase progress
        const completedSteps = this.getCompletedStepsForPhase(opportunityId, phaseKey);
        const totalSteps = phase.steps.length;
        const phaseProgress = Math.round((completedSteps / totalSteps) * 100);
        
        content.innerHTML = `
            <h2>${phase.title}</h2>
            <h3 style="color: #666; margin-bottom: 1rem;">${opportunity.name}</h3>
            <p style="margin-bottom: 1.5rem; color: #666;">${phase.description}</p>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4>Phase Progress: ${phaseProgress}% (${completedSteps}/${totalSteps} steps completed)</h4>
                <div class="progress-bar" style="margin-top: 0.8rem; height: 8px;">
                    <div class="progress-fill" style="width: ${phaseProgress}%"></div>
                </div>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto;">
                ${phase.steps.map((step, index) => {
                    const isCompleted = this.getStepCompletion(opportunityId, step.id);
                    const isCurrent = !isCompleted && index === completedSteps;
                    
                    return `
                        <div class="step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}" style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <h4>${isCompleted ? '✅' : isCurrent ? '🔄' : '⏳'} ${step.title}</h4>
                                ${!isCompleted ? `<button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Roadmap.markStepComplete('${opportunityId}', '${step.id}')">Mark Complete</button>` : ''}
                            </div>
                            <p style="color: #666; margin-bottom: 0.5rem;">${step.description}</p>
                            <small style="color: #999;">Duration: ${step.duration} days • Start: Day ${step.daysFromStart}</small>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="Roadmap.closePhaseModal()">Close</button>
                <button class="btn" onclick="Roadmap.addPhaseAction('${opportunityId}', '${phaseKey}')">Add Action Item</button>
            </div>
        `;
        
        modal.style.display = 'block';
    },

    closePhaseModal() {
        document.getElementById('phaseDetailModal').style.display = 'none';
    },

    getCompletedStepsForPhase(opportunityId, phaseKey) {
        const phase = DataStore.captureRoadmap[phaseKey];
        if (!phase) return 0;
        
        return phase.steps.filter(step => this.getStepCompletion(opportunityId, step.id)).length;
    },

    getStepCompletion(opportunityId, stepId) {
        return DataStore.actions.some(action => 
            action.opportunityId == opportunityId && 
            action.stepId === stepId && 
            action.completed
        );
    },

    markStepComplete(opportunityId, stepId) {
        // Find existing action or create new one
        let action = DataStore.actions.find(a => a.opportunityId == opportunityId && a.stepId === stepId);
        
        if (!action) {
            // Create new action
            const stepInfo = this.findStepInfo(stepId);
            action = {
                id: Date.now(),
                opportunityId: parseInt(opportunityId),
                title: stepInfo.title,
                dueDate: new Date().toISOString().split('T')[0],
                priority: "Medium",
                phase: this.getCurrentPhaseForStep(stepId),
                stepId: stepId,
                completed: true
            };
            DataStore.actions.push(action);
        } else {
            action.completed = true;
        }
        
        // Update opportunity progress
        this.updateOpportunityProgress(opportunityId);
        
        // Refresh views
        this.render();
        Dashboard.refresh();
        
        // Close and reopen modal to refresh
        this.closePhaseModal();
        setTimeout(() => this.openPhaseDetail(opportunityId, this.getCurrentPhaseForStep(stepId)), 100);
    },

    findStepInfo(stepId) {
        for (const phase of Object.values(DataStore.captureRoadmap)) {
            const step = phase.steps.find(s => s.id === stepId);
            if (step) return step;
        }
        return { title: "Unknown Step", description: "" };
    },

    getCurrentPhaseForStep(stepId) {
        for (const [phaseKey, phase] of Object.entries(DataStore.captureRoadmap)) {
            if (phase.steps.some(s => s.id === stepId)) {
                return phaseKey;
            }
        }
        return "unknown";
    },

    updateOpportunityProgress(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;
        
        let totalSteps = 0;
        let completedSteps = 0;
        
        Object.values(DataStore.captureRoadmap).forEach(phase => {
            phase.steps.forEach(step => {
                totalSteps++;
                if (this.getStepCompletion(opportunityId, step.id)) {
                    completedSteps++;
                }
            });
        });
        
        opportunity.progress = Math.round((completedSteps / totalSteps) * 100);
        
        // Update current phase based on progress
        const phases = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        if (opportunity.progress < 15) opportunity.currentPhase = 'identification';
        else if (opportunity.progress < 30) opportunity.currentPhase = 'qualification';
        else if (opportunity.progress < 50) opportunity.currentPhase = 'planning';
        else if (opportunity.progress < 70) opportunity.currentPhase = 'engagement';
        else if (opportunity.progress < 85) opportunity.currentPhase = 'intelligence';
        else opportunity.currentPhase = 'preparation';
    },

    addPhaseAction(opportunityId, phaseKey) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        const phase = DataStore.captureRoadmap[phaseKey];
        
        if (!opportunity || !phase) return;
        
        const title = prompt(`Add action item for ${phase.title}:`);
        const dueDate = prompt('Due date (YYYY-MM-DD):', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        
        if (title && dueDate) {
            const newAction = {
                id: Date.now(),
                opportunityId: parseInt(opportunityId),
                title: title,
                dueDate: dueDate,
                priority: "Medium",
                phase: phaseKey,
                stepId: `custom-${Date.now()}`,
                completed: false
            };
            
            DataStore.actions.push(newAction);
            Dashboard.refresh();
            alert('Action item added successfully!');
        }
    },

    refresh() {
        this.render();
        
        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Refreshed';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    },

    export() {
        // Simple CSV export of roadmap data
        const csvData = DataStore.opportunities.map(opp => {
            const daysToRfp = opp.rfpDate ? Utils.calculateDaysUntilDate(opp.rfpDate) : 'TBD';
            return `"${opp.name}","${opp.customer}","${opp.currentPhase}",${opp.progress},"${opp.pwin}%","${Utils.formatCurrency(opp.value)}","${daysToRfp}"`;
        });
        
        const csvContent = ['Name,Customer,Current Phase,Progress,PWin,Value,Days to RFP', ...csvData].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'capture_roadmap.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
};
