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
            const daysToRfp = opp.rfpDate ? Utils.calculateDaysUntilDate(opp.rfpDate) : 
                              opp.closeDate ? Utils.calculateDaysUntilDate(opp.closeDate) : null;
            
            // Use the correct field names and provide fallbacks for undefined values
            const customer = opp.client || opp.customer || 'Customer TBD';
            const contractType = opp.type || 'Contract Type TBD';
            const role = opp.role || 'Role TBD';
            const incumbent = opp.incumbent ? ` • vs ${opp.incumbent}` : '';
            
            return `
                <div class="timeline-row">
                    <div class="opportunity-info-cell">
                        <div class="opp-name">${opp.name}</div>
                        <div class="opp-details">
                            <strong>${customer}</strong><br>
                            ${contractType} • ${role}${incumbent}
                        </div>
                        <div class="opp-metrics">
                            <div class="metric-badge value">
                                💰 ${Utils.formatCurrency(opp.value)}
                            </div>
                            <div class="metric-badge pwin-${this.getPwinClass(opp.probability || opp.pwin || 0)}">
                                🎯 ${opp.probability || opp.pwin || 0}%
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
            
            // Calculate actual completion for this specific phase
            const phaseSteps = phase.steps;
            const completedStepsInPhase = phaseSteps.filter(step => 
                this.getStepCompletion(opportunity.id, step.id)
            ).length;
            const phaseProgress = phaseSteps.length > 0 ? 
                Math.round((completedStepsInPhase / phaseSteps.length) * 100) : 0;
            
            let status, icon, progress, statusText, className;
            
            // Check if this phase is 100% complete regardless of current phase
            if (phaseProgress === 100) {
                status = 'completed';
                icon = '✅';
                progress = '100%';
                statusText = 'Complete';
                className = 'completed';
            } else if (thisPhaseIndex < currentPhaseIndex) {
                // Phase should be completed but isn't - needs attention
                status = 'needs-attention';
                icon = '🎯';
                progress = `${phaseProgress}%`;
                statusText = 'Needs Attention';
                className = 'needs-attention';
            } else if (thisPhaseIndex === currentPhaseIndex) {
                // Current phase - check if needs attention
                const needsAttention = this.shouldPhaseNeedAttention(phaseKey, daysToRfp, phaseProgress);
                
                if (needsAttention) {
                    status = 'needs-attention';
                    icon = '🎯';
                    progress = `${phaseProgress}%`;
                    statusText = 'Needs Attention';
                    className = 'needs-attention';
                } else {
                    status = 'current';
                    icon = '🔄';
                    progress = `${phaseProgress}%`;
                    statusText = 'In Progress';
                    className = 'current';
                }
            } else {
                // Future phase
                status = 'upcoming';
                icon = '⏳';
                progress = `${phaseProgress}%`;
                statusText = phaseProgress > 0 ? 'Started' : 'Pending';
                className = phaseProgress > 0 ? 'current' : 'upcoming';
            }
            
            const tooltipText = this.generateTooltipText(opportunity, phase, status, daysToRfp, phaseProgress);
            
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

    shouldPhaseNeedAttention(phaseKey, daysToRfp, phaseProgress) {
        if (!daysToRfp || daysToRfp < 0) return false;
        
        // If phase is 100% complete, it doesn't need attention
        if (phaseProgress === 100) return false;
        
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
        return daysToRfp <= timeline.shouldCompleteBy && phaseProgress < timeline.minProgress;
    },

    generateTooltipText(opportunity, phase, status, daysToRfp, phaseProgress) {
        let tooltip = `${phase.title}\n${phase.steps.length} steps`;
        
        switch(status) {
            case 'completed':
                tooltip += '\n✅ Phase completed (100%)';
                break;
            case 'current':
                tooltip += `\n🔄 ${phaseProgress}% complete`;
                break;
            case 'needs-attention':
                tooltip += `\n🎯 ${phaseProgress}% - needs attention`;
                break;
            case 'upcoming':
                if (phaseProgress > 0) {
                    tooltip += `\n⏳ ${phaseProgress}% started`;
                } else {
                    tooltip += '\n⏳ Not started';
                }
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
        const completedSteps = phase.steps.filter(step => this.getStepCompletion(opportunityId, step.id)).length;
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
                                <div style="display: flex; gap: 0.5rem;">
                                    ${isCompleted ? 
                                        `<button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Roadmap.markStepIncomplete('${opportunityId}', '${step.id}')">Mark Incomplete</button>` :
                                        `<button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Roadmap.markStepComplete('${opportunityId}', '${step.id}')">Mark Complete</button>`
                                    }
                                </div>
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
        
        // Save data
        DataStore.saveData();
        
        // Refresh the main roadmap view
        this.render();
        
        // Refresh the current modal content without closing it
        const currentPhase = this.getCurrentPhaseForStep(stepId);
        this.openPhaseDetail(opportunityId, currentPhase);
    },

    markStepIncomplete(opportunityId, stepId) {
        // Find the action and mark it incomplete
        const action = DataStore.actions.find(a => a.opportunityId == opportunityId && a.stepId === stepId);
        
        if (action) {
            action.completed = false;
            
            // Update opportunity progress
            this.updateOpportunityProgress(opportunityId);
            
            // Save data
            DataStore.saveData();
            
            // Refresh the main roadmap view
            this.render();
            
            // Refresh the current modal content without closing it
            const currentPhase = this.getCurrentPhaseForStep(stepId);
            this.openPhaseDetail(opportunityId, currentPhase);
        }
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
        const phases = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        let currentPhaseIndex = 0;
        
        // Calculate overall progress and determine current phase
        phases.forEach((phaseKey, index) => {
            const phase = DataStore.captureRoadmap[phaseKey];
            const phaseSteps = phase.steps;
            const completedStepsInPhase = phaseSteps.filter(step => 
                this.getStepCompletion(opportunityId, step.id)
            ).length;
            
            totalSteps += phaseSteps.length;
            completedSteps += completedStepsInPhase;
            
            // Determine current phase: first incomplete phase or last phase if all complete
            const phaseProgress = phaseSteps.length > 0 ? 
                (completedStepsInPhase / phaseSteps.length) * 100 : 0;
            
            if (phaseProgress < 100 && currentPhaseIndex === index) {
                // This is the first incomplete phase
                currentPhaseIndex = index;
            } else if (phaseProgress === 100 && currentPhaseIndex <= index) {
                // This phase is complete, move to next phase
                currentPhaseIndex = Math.min(index + 1, phases.length - 1);
            }
        });
        
        opportunity.progress = Math.round((completedSteps / totalSteps) * 100);
        opportunity.currentPhase = phases[currentPhaseIndex];
        
        console.log(`Updated opportunity ${opportunityId}: ${opportunity.progress}% complete, current phase: ${opportunity.currentPhase}`);
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
    },

    calculatePhaseStatus(opportunity, phase) {
        const actions = DataStore.actions.filter(action => 
            action.opportunityId == opportunity.id && action.phase === phase
        );
        
        if (actions.length === 0) {
            // No actions for this phase
            const phaseOrder = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
            const currentPhaseIndex = phaseOrder.indexOf(opportunity.currentPhase);
            const thisPhaseIndex = phaseOrder.indexOf(phase);
            
            if (thisPhaseIndex < currentPhaseIndex) {
                return { status: 'completed', progress: 100, icon: '✅' };
            } else if (thisPhaseIndex === currentPhaseIndex) {
                return { status: 'current', progress: opportunity.progress || 0, icon: '🔄' };
            } else {
                return { status: 'upcoming', progress: 0, icon: '⏳' };
            }
        }
        
        const completedActions = actions.filter(action => action.completed);
        const progress = Math.round((completedActions.length / actions.length) * 100);
        
        // Check if ALL actions in this phase are complete
        const allActionsComplete = completedActions.length === actions.length && actions.length > 0;
        
        if (allActionsComplete) {
            return { status: 'completed', progress: 100, icon: '✅' };
        }
        
        // Check if this is the current phase based on opportunity progress
        const phaseOrder = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        const currentPhaseIndex = phaseOrder.indexOf(opportunity.currentPhase);
        const thisPhaseIndex = phaseOrder.indexOf(phase);
        
        if (thisPhaseIndex < currentPhaseIndex) {
            // Previous phases should be completed unless there are incomplete actions
            if (progress === 100) {
                return { status: 'completed', progress: 100, icon: '✅' };
            } else {
                return { status: 'needs-attention', progress, icon: '🎯' };
            }
        } else if (thisPhaseIndex === currentPhaseIndex) {
            // Current phase
            if (progress === 100) {
                return { status: 'completed', progress: 100, icon: '✅' };
            } else {
                return { status: 'current', progress, icon: '🔄' };
            }
        } else {
            // Future phases
            if (progress > 0) {
                return { status: 'current', progress, icon: '🔄' };
            } else {
                return { status: 'upcoming', progress: 0, icon: '⏳' };
            }
        }
    }
};
