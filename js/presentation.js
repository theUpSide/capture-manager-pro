// Executive Presentation Module for Capture Manager Pro
const Presentation = {
    
    // Open presentation for a specific opportunity
    openPresentation(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            alert('Opportunity not found');
            return;
        }

        const modal = document.getElementById('presentationModal');
        if (!modal) {
            console.error('Presentation modal not found - add to HTML');
            return;
        }

        // Generate presentation content
        const presentationData = this.generatePresentationData(opportunity);
        const content = document.getElementById('presentation-content');
        content.innerHTML = this.renderPresentationSlides(presentationData);

        // Show modal
        modal.style.display = 'block';
        
        // Initialize slide navigation
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.presentation-slide').length;
        this.updateSlideNavigation();
    },

    // Close presentation modal
    closePresentation() {
        const modal = document.getElementById('presentationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Generate comprehensive presentation data
    generatePresentationData(opportunity) {
        // Get related data
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunity.id);
        const completedActions = actions.filter(a => a.completed);
        const openActions = actions.filter(a => !a.completed);
        const overdueActions = openActions.filter(a => new Date(a.dueDate) < new Date());
        
        const savedTemplates = DataStore.savedTemplates.filter(st => st.opportunityId == opportunity.id);
        const completedTemplates = savedTemplates.filter(st => st.status === 'completed');
        
        const gateReviews = DataStore.gateReviews ? DataStore.gateReviews.filter(gr => gr.opportunityId == opportunity.id) : [];
        const completedGates = gateReviews.filter(gr => gr.status === 'Complete' && gr.decision === 'Approved');
        
        // Calculate metrics
        const daysUntilClose = opportunity.closeDate ? Utils.calculateDaysUntilDate(opportunity.closeDate) : 'TBD';
        const progressPercent = Math.round(opportunity.progress || 0);
        const completionRate = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;
        
        // Notes analysis
        const notes = opportunity.notes || [];
        const recentNotes = notes.slice(-5); // Last 5 notes
        
        // Phase analysis
        const phaseProgress = this.calculatePhaseProgress(opportunity);
        
        // Risk assessment
        const riskFactors = this.assessRiskFactors(opportunity, actions, daysUntilClose);
        
        return {
            opportunity,
            metrics: {
                value: opportunity.value || 0,
                probability: opportunity.probability || 0,
                expectedValue: ((opportunity.value || 0) * (opportunity.probability || 0)) / 100,
                daysUntilClose,
                progressPercent,
                completionRate,
                totalActions: actions.length,
                completedActions: completedActions.length,
                openActions: openActions.length,
                overdueActions: overdueActions.length,
                completedTemplates: completedTemplates.length,
                totalTemplates: savedTemplates.length,
                completedGates: completedGates.length,
                totalGates: gateReviews.length
            },
            actions: {
                completed: completedActions,
                open: openActions,
                overdue: overdueActions
            },
            templates: {
                saved: savedTemplates,
                completed: completedTemplates
            },
            gateReviews: {
                all: gateReviews,
                completed: completedGates
            },
            notes: recentNotes,
            phaseProgress,
            riskFactors
        };
    },

    // Calculate progress across all phases
    calculatePhaseProgress(opportunity) {
        const phases = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        const phaseProgress = {};
        
        phases.forEach(phase => {
            const phaseSteps = DataStore.captureRoadmap[phase]?.steps || [];
            const completedSteps = opportunity.phaseSteps?.[phase] || [];
            const progress = phaseSteps.length > 0 ? 
                Math.round((completedSteps.length / phaseSteps.length) * 100) : 0;
            
            phaseProgress[phase] = {
                title: this.getPhaseTitle(phase),
                progress,
                completed: completedSteps.length,
                total: phaseSteps.length,
                status: phase === opportunity.currentPhase ? 'current' : 
                       progress === 100 ? 'completed' : 
                       progress > 0 ? 'in-progress' : 'upcoming'
            };
        });
        
        return phaseProgress;
    },

    // Assess risk factors for the opportunity
    assessRiskFactors(opportunity, actions, daysUntilClose) {
        const risks = [];
        
        // Time-based risks
        if (daysUntilClose !== 'TBD' && daysUntilClose < 30) {
            risks.push({
                type: 'timeline',
                level: daysUntilClose < 14 ? 'high' : 'medium',
                description: `Only ${daysUntilClose} days until close date`,
                impact: 'high'
            });
        }
        
        // Progress risks
        if ((opportunity.progress || 0) < 50 && daysUntilClose !== 'TBD' && daysUntilClose < 60) {
            risks.push({
                type: 'progress',
                level: 'medium',
                description: 'Low progress with approaching deadline',
                impact: 'medium'
            });
        }
        
        // Action risks
        const overdueActions = actions.filter(a => !a.completed && new Date(a.dueDate) < new Date());
        if (overdueActions.length > 0) {
            risks.push({
                type: 'actions',
                level: overdueActions.length > 3 ? 'high' : 'medium',
                description: `${overdueActions.length} overdue action items`,
                impact: 'medium'
            });
        }
        
        // Probability risks
        if ((opportunity.probability || 0) < 30) {
            risks.push({
                type: 'probability',
                level: 'high',
                description: 'Low win probability',
                impact: 'high'
            });
        }
        
        return risks;
    },

    // Get user-friendly phase titles
    getPhaseTitle(phase) {
        const titles = {
            identification: 'Opportunity Identification',
            qualification: 'Opportunity Qualification',
            planning: 'Capture Planning',
            engagement: 'Customer Engagement',
            intelligence: 'Competitive Intelligence',
            preparation: 'Pre-RFP Preparation'
        };
        return titles[phase] || phase;
    },

    // Render complete presentation slides
    renderPresentationSlides(data) {
        return `
            <!-- Slide Navigation -->
            <div class="presentation-nav">
                <button class="btn btn-secondary" onclick="Presentation.previousSlide()" id="prevBtn">← Previous</button>
                <span class="slide-counter" id="slideCounter">1 / ${this.getTotalSlideCount()}</span>
                <button class="btn btn-secondary" onclick="Presentation.nextSlide()" id="nextBtn">Next →</button>
                <button class="btn btn-primary" onclick="Presentation.exportPresentation('${data.opportunity.id}')" style="margin-left: auto;">📄 Export PDF</button>
            </div>

            <!-- Slide 1: Executive Summary -->
            <div class="presentation-slide active" data-slide="1">
                ${this.renderExecutiveSummarySlide(data)}
            </div>

            <!-- Slide 2: Opportunity Overview -->
            <div class="presentation-slide" data-slide="2">
                ${this.renderOpportunityOverviewSlide(data)}
            </div>

            <!-- Slide 3: Progress & Metrics -->
            <div class="presentation-slide" data-slide="3">
                ${this.renderProgressMetricsSlide(data)}
            </div>

            <!-- Slide 4: Phase Progress -->
            <div class="presentation-slide" data-slide="4">
                ${this.renderPhaseProgressSlide(data)}
            </div>

            <!-- Slide 5: Work Completed -->
            <div class="presentation-slide" data-slide="5">
                ${this.renderWorkCompletedSlide(data)}
            </div>

            <!-- Slide 6: Risk Assessment -->
            <div class="presentation-slide" data-slide="6">
                ${this.renderRiskAssessmentSlide(data)}
            </div>

            <!-- Slide 7: Next Steps & Recommendations -->
            <div class="presentation-slide" data-slide="7">
                ${this.renderNextStepsSlide(data)}
            </div>
        `;
    },

    // Slide 1: Executive Summary
    renderExecutiveSummarySlide(data) {
        const { opportunity, metrics } = data;
        
        return `
            <div class="slide-header">
                <h1>Executive Presentation</h1>
                <h2>${opportunity.name}</h2>
                <div class="slide-date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="slide-content">
                <div class="executive-summary-grid">
                    <div class="summary-metrics">
                        <div class="metric-highlight">
                            <span class="metric-label">Contract Value</span>
                            <span class="metric-value">$${metrics.value.toLocaleString()}</span>
                        </div>
                        <div class="metric-highlight">
                            <span class="metric-label">Win Probability</span>
                            <span class="metric-value">${metrics.probability}%</span>
                        </div>
                        <div class="metric-highlight">
                            <span class="metric-label">Expected Value</span>
                            <span class="metric-value">$${metrics.expectedValue.toLocaleString()}</span>
                        </div>
                        <div class="metric-highlight">
                            <span class="metric-label">Days to Close</span>
                            <span class="metric-value">${metrics.daysUntilClose}</span>
                        </div>
                    </div>
                    
                    <div class="summary-status">
                        <div class="status-item">
                            <strong>Current Status:</strong> ${opportunity.status || 'Active'}
                        </div>
                        <div class="status-item">
                            <strong>Current Phase:</strong> ${this.getPhaseTitle(opportunity.currentPhase || 'identification')}
                        </div>
                        <div class="status-item">
                            <strong>Overall Progress:</strong> ${metrics.progressPercent}%
                        </div>
                        <div class="status-item">
                            <strong>Client:</strong> ${opportunity.client || 'TBD'}
                        </div>
                    </div>
                </div>
                
                <div class="slide-footer">
                    <p><strong>Recommendation:</strong> ${this.generateRecommendation(data)}</p>
                </div>
            </div>
        `;
    },

    // Slide 2: Opportunity Overview
    renderOpportunityOverviewSlide(data) {
        const { opportunity } = data;
        
        return `
            <div class="slide-header">
                <h1>Opportunity Overview</h1>
                <h2>${opportunity.name}</h2>
            </div>
            
            <div class="slide-content">
                <div class="overview-grid">
                    <div class="overview-section">
                        <h3>📋 Opportunity Details</h3>
                        <div class="detail-item">
                            <strong>Client:</strong> ${opportunity.client || 'TBD'}
                        </div>
                        <div class="detail-item">
                            <strong>Contract Value:</strong> $${(opportunity.value || 0).toLocaleString()}
                        </div>
                        <div class="detail-item">
                            <strong>Close Date:</strong> ${opportunity.closeDate ? Utils.formatDate(opportunity.closeDate) : 'TBD'}
                        </div>
                        <div class="detail-item">
                            <strong>Type:</strong> ${opportunity.type || 'Not specified'}
                        </div>
                        <div class="detail-item">
                            <strong>Our Role:</strong> ${opportunity.role || 'Not specified'}
                        </div>
                        <div class="detail-item">
                            <strong>Incumbent:</strong> ${opportunity.incumbent || 'Unknown'}
                        </div>
                    </div>
                    
                    <div class="overview-section">
                        <h3>📝 Description</h3>
                        <p class="opportunity-description">
                            ${opportunity.description || 'No description provided'}
                        </p>
                    </div>
                </div>
                
                ${data.notes.length > 0 ? `
                <div class="overview-section">
                    <h3>📄 Recent Activity</h3>
                    <div class="recent-notes">
                        ${data.notes.slice(0, 3).map(note => `
                            <div class="note-item">
                                <div class="note-date">${Utils.formatDate(note.date)}</div>
                                <div class="note-content">${note.content}</div>
                                <div class="note-author">— ${note.author}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    // Slide 3: Progress & Metrics
    renderProgressMetricsSlide(data) {
        const { metrics, actions } = data;
        
        return `
            <div class="slide-header">
                <h1>Progress & Key Metrics</h1>
            </div>
            
            <div class="slide-content">
                <div class="metrics-dashboard">
                    <div class="metric-card-large">
                        <div class="metric-icon">📊</div>
                        <div class="metric-info">
                            <span class="metric-title">Overall Progress</span>
                            <span class="metric-number">${metrics.progressPercent}%</span>
                        </div>
                        <div class="metric-bar">
                            <div class="metric-bar-fill" style="width: ${metrics.progressPercent}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card-large">
                        <div class="metric-icon">✅</div>
                        <div class="metric-info">
                            <span class="metric-title">Action Completion</span>
                            <span class="metric-number">${metrics.completionRate}%</span>
                        </div>
                        <div class="metric-bar">
                            <div class="metric-bar-fill" style="width: ${metrics.completionRate}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">Total Actions</span>
                            <span class="metric-value">${metrics.totalActions}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Completed</span>
                            <span class="metric-value">${metrics.completedActions}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Open</span>
                            <span class="metric-value">${metrics.openActions}</span>
                        </div>
                        <div class="metric-item ${metrics.overdueActions > 0 ? 'metric-danger' : ''}">
                            <span class="metric-label">Overdue</span>
                            <span class="metric-value">${metrics.overdueActions}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Templates</span>
                            <span class="metric-value">${metrics.completedTemplates}/${metrics.totalTemplates}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Gate Reviews</span>
                            <span class="metric-value">${metrics.completedGates}/${metrics.totalGates}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Slide 4: Phase Progress
    renderPhaseProgressSlide(data) {
        const { phaseProgress } = data;
        
        return `
            <div class="slide-header">
                <h1>Capture Phase Progress</h1>
            </div>
            
            <div class="slide-content">
                <div class="phase-timeline">
                    ${Object.entries(phaseProgress).map(([phase, info]) => `
                        <div class="phase-timeline-item ${info.status}">
                            <div class="phase-icon">
                                ${info.status === 'completed' ? '✅' : 
                                  info.status === 'current' ? '🔄' : 
                                  info.status === 'in-progress' ? '🎯' : '⏳'}
                            </div>
                            <div class="phase-content">
                                <h3>${info.title}</h3>
                                <div class="phase-progress-bar">
                                    <div class="phase-progress-fill" style="width: ${info.progress}%"></div>
                                    <span class="phase-progress-text">${info.progress}%</span>
                                </div>
                                <div class="phase-details">
                                    ${info.completed}/${info.total} steps completed
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Slide 5: Work Completed
    renderWorkCompletedSlide(data) {
        const { actions, templates } = data;
        
        return `
            <div class="slide-header">
                <h1>Work Completed to Date</h1>
            </div>
            
            <div class="slide-content">
                <div class="work-summary-grid">
                    <div class="work-section">
                        <h3>✅ Completed Actions (${actions.completed.length})</h3>
                        <div class="work-list">
                            ${actions.completed.slice(0, 10).map(action => `
                                <div class="work-item">
                                    <span class="work-title">${action.title}</span>
                                    <span class="work-meta">${action.priority} | ${Utils.formatDate(action.completedDate || action.dueDate)}</span>
                                </div>
                            `).join('')}
                            ${actions.completed.length > 10 ? `<div class="work-item-more">... and ${actions.completed.length - 10} more</div>` : ''}
                        </div>
                    </div>
                    
                    <div class="work-section">
                        <h3>📋 Completed Templates (${templates.completed.length})</h3>
                        <div class="work-list">
                            ${templates.completed.map(template => {
                                const templateDef = DataStore.templates.find(t => t.id === template.templateId);
                                return `
                                    <div class="work-item">
                                        <span class="work-title">${templateDef ? templateDef.title : 'Unknown Template'}</span>
                                        <span class="work-meta">Completed: ${Utils.formatDate(template.savedDate)}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                ${data.gateReviews.completed.length > 0 ? `
                <div class="work-section">
                    <h3>🚪 Completed Gate Reviews (${data.gateReviews.completed.length})</h3>
                    <div class="work-list">
                        ${data.gateReviews.completed.map(gate => `
                            <div class="work-item">
                                <span class="work-title">Gate ${gate.gateNumber}</span>
                                <span class="work-meta">Decision: ${gate.decision} | ${Utils.formatDate(gate.completedDate)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    // Slide 6: Risk Assessment
    renderRiskAssessmentSlide(data) {
        const { riskFactors } = data;
        
        return `
            <div class="slide-header">
                <h1>Risk Assessment</h1>
            </div>
            
            <div class="slide-content">
                ${riskFactors.length > 0 ? `
                    <div class="risk-summary">
                        <div class="risk-count">
                            <span class="risk-count-number">${riskFactors.length}</span>
                            <span class="risk-count-label">Risk Factors Identified</span>
                        </div>
                    </div>
                    
                    <div class="risk-list">
                        ${riskFactors.map(risk => `
                            <div class="risk-item risk-${risk.level}">
                                <div class="risk-indicator">
                                    ${risk.level === 'high' ? '🔴' : risk.level === 'medium' ? '🟡' : '🟢'}
                                </div>
                                <div class="risk-content">
                                    <div class="risk-title">${risk.description}</div>
                                    <div class="risk-meta">
                                        Type: ${risk.type} | Level: ${risk.level.toUpperCase()} | Impact: ${risk.impact.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="no-risks">
                        <div class="no-risks-icon">✅</div>
                        <h3>No Significant Risks Identified</h3>
                        <p>Current opportunity assessment shows manageable risk levels.</p>
                    </div>
                `}
            </div>
        `;
    },

    // Slide 7: Next Steps & Recommendations
    renderNextStepsSlide(data) {
        const { actions, metrics } = data;
        const nextSteps = this.generateNextSteps(data);
        
        return `
            <div class="slide-header">
                <h1>Next Steps & Recommendations</h1>
            </div>
            
            <div class="slide-content">
                <div class="recommendations-grid">
                    <div class="recommendations-section">
                        <h3>🎯 Immediate Actions Required</h3>
                        <div class="action-list">
                            ${actions.overdue.length > 0 ? `
                                <div class="action-group">
                                    <h4>Overdue Items (${actions.overdue.length})</h4>
                                    ${actions.overdue.slice(0, 5).map(action => `
                                        <div class="action-item urgent">
                                            <span class="action-title">${action.title}</span>
                                            <span class="action-due">Due: ${Utils.formatDate(action.dueDate)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            ${actions.open.filter(a => new Date(a.dueDate) <= new Date(Date.now() + 7*24*60*60*1000)).length > 0 ? `
                                <div class="action-group">
                                    <h4>Due This Week</h4>
                                    ${actions.open.filter(a => new Date(a.dueDate) <= new Date(Date.now() + 7*24*60*60*1000)).slice(0, 5).map(action => `
                                        <div class="action-item">
                                            <span class="action-title">${action.title}</span>
                                            <span class="action-due">Due: ${Utils.formatDate(action.dueDate)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="recommendations-section">
                        <h3>💡 Strategic Recommendations</h3>
                        <div class="recommendation-list">
                            ${nextSteps.map(step => `
                                <div class="recommendation-item">
                                    <div class="recommendation-icon">${step.icon}</div>
                                    <div class="recommendation-content">
                                        <strong>${step.title}</strong>
                                        <p>${step.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="slide-footer">
                    <p><strong>Overall Assessment:</strong> ${this.generateOverallAssessment(data)}</p>
                </div>
            </div>
        `;
    },

    // Generate recommendation based on data
    generateRecommendation(data) {
        const { metrics, riskFactors } = data;
        
        if (riskFactors.filter(r => r.level === 'high').length > 0) {
            return 'Immediate attention required - high-risk factors identified that need mitigation.';
        } else if (metrics.overdueActions > 0) {
            return 'Focus on completing overdue action items to maintain progress momentum.';
        } else if (metrics.progressPercent < 50 && metrics.daysUntilClose !== 'TBD' && metrics.daysUntilClose < 60) {
            return 'Accelerate capture activities - progress may be insufficient for timeline.';
        } else if (metrics.probability < 40) {
            return 'Investigate strategies to improve win probability and competitive position.';
        } else {
            return 'Opportunity is on track - continue executing planned capture strategy.';
        }
    },

    // Generate strategic next steps
    generateNextSteps(data) {
        const steps = [];
        const { metrics, riskFactors, phaseProgress } = data;
        
        // Time-based recommendations
        if (metrics.daysUntilClose !== 'TBD' && metrics.daysUntilClose < 30) {
            steps.push({
                icon: '⏰',
                title: 'Finalize Proposal Strategy',
                description: 'With close date approaching, ensure all proposal elements are ready for submission.'
            });
        }
        
        // Progress-based recommendations
        if (metrics.progressPercent < 50) {
            steps.push({
                icon: '🚀',
                title: 'Accelerate Capture Activities',
                description: 'Current progress is below target. Consider additional resources or parallel workstreams.'
            });
        }
        
        // Phase-specific recommendations
        const currentPhase = Object.entries(phaseProgress).find(([_, info]) => info.status === 'current');
        if (currentPhase && currentPhase[1].progress < 75) {
            steps.push({
                icon: '🎯',
                title: `Complete ${currentPhase[1].title}`,
                description: `Focus on finishing current phase activities before advancing to next phase.`
            });
        }
        
        // Risk mitigation
        if (riskFactors.length > 0) {
            steps.push({
                icon: '🛡️',
                title: 'Mitigate Identified Risks',
                description: 'Address the identified risk factors to improve opportunity success probability.'
            });
        }
        
        // Default recommendations if none others apply
        if (steps.length === 0) {
            steps.push({
                icon: '📈',
                title: 'Maintain Momentum',
                description: 'Continue executing planned capture activities and monitor progress regularly.'
            });
        }
        
        return steps;
    },

    // Generate overall assessment
    generateOverallAssessment(data) {
        const { metrics, riskFactors } = data;
        const highRisks = riskFactors.filter(r => r.level === 'high').length;
        
        if (highRisks > 0) {
            return 'HIGH ATTENTION NEEDED - Multiple high-risk factors require immediate action.';
        } else if (metrics.probability >= 70 && metrics.progressPercent >= 75) {
            return 'STRONG POSITION - Opportunity is well-positioned with good win probability.';
        } else if (metrics.probability >= 50 && metrics.progressPercent >= 50) {
            return 'ON TRACK - Opportunity progressing well with manageable risks.';
        } else if (metrics.probability < 30 || metrics.progressPercent < 25) {
            return 'NEEDS IMPROVEMENT - Consider strategic changes to improve position.';
        } else {
            return 'MODERATE POSITION - Continued focus needed to ensure success.';
        }
    },

    // Slide navigation
    currentSlide: 0,
    totalSlides: 7,

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlideNavigation();
        }
    },

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideNavigation();
        }
    },

    updateSlideNavigation() {
        const slides = document.querySelectorAll('.presentation-slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        }

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    },

    getTotalSlideCount() {
        return 7; // Fixed number of slides
    },

    // Export presentation to PDF (placeholder for future implementation)
    exportPresentation(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;

        // For now, create a formatted text export
        const presentationData = this.generatePresentationData(opportunity);
        const exportContent = this.generateTextExport(presentationData);
        
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Executive_Presentation_${opportunity.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Generate text export of presentation
    generateTextExport(data) {
        const { opportunity, metrics, riskFactors } = data;
        
        return `
EXECUTIVE PRESENTATION
${opportunity.name}
Generated: ${new Date().toLocaleDateString()}

================================================================
EXECUTIVE SUMMARY
================================================================

Contract Value: ${metrics.value.toLocaleString()}
Win Probability: ${metrics.probability}%
Expected Value: ${metrics.expectedValue.toLocaleString()}
Days to Close: ${metrics.daysUntilClose}

Current Status: ${opportunity.status || 'Active'}
Current Phase: ${this.getPhaseTitle(opportunity.currentPhase || 'identification')}
Overall Progress: ${metrics.progressPercent}%
Client: ${opportunity.client || 'TBD'}

Recommendation: ${this.generateRecommendation(data)}

================================================================
OPPORTUNITY OVERVIEW
================================================================

Client: ${opportunity.client || 'TBD'}
Contract Value: ${metrics.value.toLocaleString()}
Close Date: ${opportunity.closeDate ? Utils.formatDate(opportunity.closeDate) : 'TBD'}
Type: ${opportunity.type || 'Not specified'}
Our Role: ${opportunity.role || 'Not specified'}
Incumbent: ${opportunity.incumbent || 'Unknown'}

Description: ${opportunity.description || 'No description provided'}

================================================================
PROGRESS & METRICS
================================================================

Overall Progress: ${metrics.progressPercent}%
Action Completion Rate: ${metrics.completionRate}%

Actions:
- Total: ${metrics.totalActions}
- Completed: ${metrics.completedActions}
- Open: ${metrics.openActions}
- Overdue: ${metrics.overdueActions}

Templates: ${metrics.completedTemplates}/${metrics.totalTemplates} completed
Gate Reviews: ${metrics.completedGates}/${metrics.totalGates} completed

================================================================
RISK ASSESSMENT
================================================================

${riskFactors.length > 0 ? 
    `${riskFactors.length} Risk Factors Identified:\n\n` +
    riskFactors.map(risk => 
        `- ${risk.description} (${risk.level.toUpperCase()} risk, ${risk.impact.toUpperCase()} impact)`
    ).join('\n')
    : 'No significant risks identified.'
}

================================================================
OVERALL ASSESSMENT
================================================================

${this.generateOverallAssessment(data)}

================================================================
NEXT STEPS
================================================================

${this.generateNextSteps(data).map(step => 
    `- ${step.title}: ${step.description}`
).join('\n')}

================================================================
End of Report
================================================================
        `.trim();
    }
};