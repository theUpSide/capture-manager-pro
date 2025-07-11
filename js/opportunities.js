// Updated Opportunities module for executive-ready presentation
const Opportunities = {
    
    render() {
        console.log('Opportunities.render() called');
        
        // Load the new CSS if not already loaded
        if (!document.querySelector('link[href="css/opportunities-executive.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/opportunities-executive.css';
            document.head.appendChild(link);
        }
        
        // Find container
        let container = document.getElementById('opportunities-grid');
        if (!container) {
            const opportunitiesView = document.getElementById('opportunities-view');
            if (opportunitiesView) {
                const section = opportunitiesView.querySelector('.section');
                if (section) {
                    container = section.querySelector('.opportunities-grid');
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'opportunities-grid';
                        container.id = 'opportunities-grid';
                        section.appendChild(container);
                    }
                }
            }
        }
        
        if (!container) {
            console.error('Could not find or create opportunities container');
            return;
        }

        if (DataStore.opportunities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <h3>No Opportunities Yet</h3>
                    <p>Get started by adding your first business opportunity to track through the capture process.</p>
                    <button class="btn btn-primary" onclick="Opportunities.openNewModal()">
                        📈 Add First Opportunity
                    </button>
                </div>
            `;
            return;
        }

        // Group opportunities by status
        const groupedOpportunities = this.groupOpportunitiesByStatus();
        
        // Create layout with collapsible sections
        let html = `<div class="opportunities-sections-layout">`;
        
        // Define section order and default states
        const sectionOrder = ['capture', 'pursuing', 'won', 'lost', 'archived'];
        const sectionTitles = {
            capture: '🎯 Active Capture',
            pursuing: '🏃 Pursuing',
            won: '🏆 Won',
            lost: '📉 Lost',
            archived: '📁 Archived'
        };

        sectionOrder.forEach(status => {
            const opportunities = groupedOpportunities[status] || [];
            if (opportunities.length > 0) {
                const isCollapsed = status === 'lost' || status === 'archived';
                const collapseIcon = isCollapsed ? '▶' : '▼';
                
                html += `
                    <div class="opportunity-category-section" data-status="${status}">
                        <div class="collapsible-header" onclick="Opportunities.toggleSection('${status}')">
                            <div class="category-header">
                                <div class="category-title-section">
                                    <span class="collapse-icon">${collapseIcon}</span>
                                    <h3>${sectionTitles[status]}</h3>
                                </div>
                                <span class="category-count">${opportunities.length}</span>
                            </div>
                        </div>
                        <div class="collapsible-content" style="display: ${isCollapsed ? 'none' : 'block'}">
                            <div class="category-cards-grid">
                                ${opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += `</div>`;
        container.innerHTML = html;
    },

    renderOpportunityCard(opportunity) {
        const value = opportunity.value || 0;
        const probability = opportunity.probability || opportunity.pwin || 0;
        const expectedValue = (value * probability) / 100;
        const daysUntilClose = opportunity.closeDate ? Utils.calculateDaysUntilDate(opportunity.closeDate) : 'TBD';
        const progress = Math.round(opportunity.progress || 0);
        
        // Truncate description to fit card
        const description = opportunity.description || 'No description provided';
        const truncatedDescription = description.length > 150 ? 
            description.substring(0, 150) + '...' : description;
        
        // Determine status badge class
        const statusClass = `status-${(opportunity.status || 'capture').toLowerCase()}`;
        const statusLabel = opportunity.status || 'Capture';
        
        return `
            <div class="opportunity-card" data-status="${opportunity.status || 'capture'}" onclick="Opportunities.openDetailModal(${opportunity.id})">
                <div class="opportunity-card-header">
                    <h4>${opportunity.name}</h4>
                    <div class="opportunity-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-sm btn-secondary" onclick="Opportunities.editOpportunity(${opportunity.id})" title="Edit">
                            ✏️
                        </button>
                    </div>
                </div>
                
                <div class="opportunity-metrics-grid">
                    <div class="metric-item">
                        <span class="metric-label">Value</span>
                        <span class="metric-value">${value.toLocaleString()}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">P-Win</span>
                        <span class="metric-value">${probability}%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Expected</span>
                        <span class="metric-value">${expectedValue.toLocaleString()}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Close</span>
                        <span class="metric-value">${daysUntilClose === 'TBD' ? 'TBD' : daysUntilClose + 'd'}</span>
                    </div>
                </div>
                
                <div class="opportunity-description">
                    ${truncatedDescription}
                </div>
                
                <div class="opportunity-progress">
                    <div class="progress-header">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="opportunity-footer">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                    <div onclick="event.stopPropagation()">
                        <button class="btn btn-sm btn-primary" onclick="Opportunities.openDetailModal(${opportunity.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    openDetailModal(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            alert('Opportunity not found');
            return;
        }

        // Get related data
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);
        const savedTemplates = DataStore.savedTemplates.filter(st => st.opportunityId == opportunityId);
        const notes = opportunity.notes || [];
        
        // Calculate metrics
        const value = opportunity.value || 0;
        const probability = opportunity.probability || opportunity.pwin || 0;
        const expectedValue = (value * probability) / 100;
        const daysUntilClose = opportunity.closeDate ? Utils.calculateDaysUntilDate(opportunity.closeDate) : 'TBD';
        const progress = Math.round(opportunity.progress || 0);
        
        // Action statistics
        const completedActions = actions.filter(a => a.completed).length;
        const totalActions = actions.length;
        const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
        
        // Get gate reviews
        const gateReviews = DataStore.gateReviews ? DataStore.gateReviews.filter(gr => gr.opportunityId == opportunityId) : [];
        const completedGates = gateReviews.filter(gr => gr.status === 'Complete' && gr.decision === 'Approved').length;

        const modal = document.getElementById('opportunityDetailModal');
        if (!modal) {
            console.error('Opportunity detail modal not found');
            return;
        }

        const content = document.getElementById('opportunity-detail-content');
        content.innerHTML = `
            <div class="opportunity-detail-header">
                <h2>${opportunity.name}</h2>
                <div class="opportunity-header-meta">
                    <div class="header-metric">
                        <div class="header-metric-label">Contract Value</div>
                        <div class="header-metric-value">${value.toLocaleString()}</div>
                    </div>
                    <div class="header-metric">
                        <div class="header-metric-label">Win Probability</div>
                        <div class="header-metric-value">${probability}%</div>
                    </div>
                    <div class="header-metric">
                        <div class="header-metric-label">Expected Value</div>
                        <div class="header-metric-value">${expectedValue.toLocaleString()}</div>
                    </div>
                    <div class="header-metric">
                        <div class="header-metric-label">Days to Close</div>
                        <div class="header-metric-value">${daysUntilClose}</div>
                    </div>
                </div>
                <div class="opportunity-header-actions">
                    <button class="btn btn-secondary" onclick="Opportunities.editOpportunity(${opportunity.id})">
                        ✏️ Edit Opportunity
                    </button>
                    <button class="btn btn-primary" onclick="Presentation.openPresentation(${opportunity.id})">
                        📊 Executive Presentation
                    </button>
                    <button class="btn btn-success" onclick="GateReviews.openNewGateModal(${opportunity.id})">
                        🚪 Initiate Gate Review
                    </button>
                </div>
            </div>
            
            <div class="opportunity-detail-content">
                <div class="opportunity-executive-summary">
                    <div class="executive-summary-grid">
                        <div class="summary-details">
                            <h3>Executive Summary</h3>
                            <p><strong>Client:</strong> ${opportunity.client || 'TBD'}</p>
                            <p><strong>Description:</strong> ${opportunity.description || 'No description provided'}</p>
                            <p><strong>Current Phase:</strong> ${this.getPhaseTitle(opportunity.currentPhase || 'identification')}</p>
                            <p><strong>Status:</strong> ${opportunity.status || 'Active'}</p>
                        </div>
                        <div class="summary-metrics">
                            <div class="summary-metric">
                                <div class="summary-metric-label">Progress</div>
                                <div class="summary-metric-value">${progress}%</div>
                            </div>
                            <div class="summary-metric">
                                <div class="summary-metric-label">Actions</div>
                                <div class="summary-metric-value">${completedActions}/${totalActions}</div>
                            </div>
                            <div class="summary-metric">
                                <div class="summary-metric-label">Templates</div>
                                <div class="summary-metric-value">${savedTemplates.filter(st => st.status === 'completed').length}/${savedTemplates.length}</div>
                            </div>
                            <div class="summary-metric">
                                <div class="summary-metric-label">Gates</div>
                                <div class="summary-metric-value">${completedGates}/${gateReviews.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="opportunity-detail-columns">
                    <div class="opportunity-left">
                        <h3>🎯 Capture Phase Progress</h3>
                        ${this.renderPhaseProgress(opportunity)}
                        
                        <h3>📝 Recent Activity</h3>
                        ${this.renderRecentNotes(notes)}
                    </div>
                    
                    <div class="opportunity-right">
                        <h3>📋 Action Items (${totalActions})</h3>
                        ${this.renderActionsList(actions)}
                        
                        <h3>📄 Templates (${savedTemplates.length})</h3>
                        ${this.renderTemplatesList(savedTemplates)}
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    },

    renderPhaseProgress(opportunity) {
        const phases = ['identification', 'qualification', 'planning', 'engagement', 'intelligence', 'preparation'];
        const phaseNames = {
            identification: 'Identification',
            qualification: 'Qualification', 
            planning: 'Planning',
            engagement: 'Engagement',
            intelligence: 'Intelligence',
            preparation: 'Preparation'
        };

        let html = '<div class="phase-blocks-container">';
        
        phases.forEach(phase => {
            const phaseSteps = DataStore.captureRoadmap[phase]?.steps || [];
            const completedSteps = opportunity.phaseSteps?.[phase] || [];
            const progress = phaseSteps.length > 0 ? 
                Math.round((completedSteps.length / phaseSteps.length) * 100) : 0;
            
            let statusClass = 'upcoming';
            let icon = '⏳';
            
            if (progress === 100) {
                statusClass = 'completed';
                icon = '✅';
            } else if (phase === opportunity.currentPhase) {
                statusClass = 'current';
                icon = '🔄';
            } else if (progress > 0) {
                statusClass = 'in-progress';
                icon = '🎯';
            }

            html += `
                <div class="phase-block ${statusClass}" onclick="Opportunities.showPhaseSteps('${opportunity.id}', '${phase}')">
                    <div class="phase-icon">${icon}</div>
                    <div class="phase-title">${phaseNames[phase]}</div>
                    <div class="phase-progress">${progress}%</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },

    renderRecentNotes(notes) {
        if (!notes || notes.length === 0) {
            return '<p style="color: #666; font-style: italic;">No notes yet. Add your first note to track progress.</p>';
        }

        const recentNotes = notes.slice(-5).reverse(); // Last 5 notes, most recent first
        
        let html = '<div class="notes-list" style="max-height: 300px; overflow-y: auto;">';
        recentNotes.forEach(note => {
            html += `
                <div class="note-item" style="background: #f8f9ff; border: 1px solid #e3e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong style="color: #2a5298;">${note.author || 'Team Member'}</strong>
                        <small style="color: #6c757d;">${Utils.formatDate(note.date)}</small>
                    </div>
                    <p style="margin: 0; line-height: 1.5; color: #495057;">${note.content}</p>
                </div>
            `;
        });
        html += '</div>';
        
        html += `
            <button class="btn btn-sm btn-primary" onclick="Opportunities.addNote()" style="margin-top: 1rem; width: 100%;">
                ➕ Add Note
            </button>
        `;
        
        return html;
    },

    renderActionsList(actions) {
        if (actions.length === 0) {
            return '<p style="color: #666; font-style: italic;">No action items yet.</p>';
        }

        const sortedActions = actions.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        let html = '<div class="actions-list">';
        sortedActions.slice(0, 8).forEach(action => { // Show first 8 actions
            const isOverdue = !action.completed && new Date(action.dueDate) < new Date();
            const priorityClass = action.priority === 'High' ? 'high-priority' : 
                                 action.priority === 'Medium' ? 'medium-priority' : 'low-priority';
            
            html += `
                <div class="action-item ${action.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <strong style="color: ${action.completed ? '#6c757d' : '#2a5298'};">
                                ${action.completed ? '✅' : isOverdue ? '🔴' : '📋'} ${action.title}
                            </strong>
                            <div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;">
                                ${action.priority} Priority • Due: ${Utils.formatDate(action.dueDate)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (actions.length > 8) {
            html += `<p style="text-align: center; color: #6c757d; font-style: italic; margin-top: 1rem;">... and ${actions.length - 8} more actions</p>`;
        }
        
        html += '</div>';
        return html;
    },

    renderTemplatesList(savedTemplates) {
        if (savedTemplates.length === 0) {
            return '<p style="color: #666; font-style: italic;">No templates saved yet.</p>';
        }

        let html = '<div class="saved-templates-list">';
        savedTemplates.forEach(template => {
            const templateDef = DataStore.templates.find(t => t.id === template.templateId);
            const templateTitle = templateDef ? templateDef.title : 'Unknown Template';
            const statusIcon = template.status === 'completed' ? '✅' : '📋';
            const statusLabel = template.status === 'completed' ? 'Completed' : 'In Progress';
            
            html += `
                <div class="saved-template-item">
                    <div>
                        <strong style="color: #2a5298;">
                            ${statusIcon} ${templateTitle}
                        </strong>
                        <div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;">
                            ${statusLabel} • Saved: ${Utils.formatDate(template.savedDate)}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="Templates.editSavedTemplate(${template.id})">
                        Edit
                    </button>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

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

    groupOpportunitiesByStatus() {
        const grouped = {
            capture: [],
            pursuing: [],
            won: [],
            lost: [],
            archived: []
        };

        DataStore.opportunities.forEach(opp => {
            const status = opp.status || 'capture';
            if (grouped[status]) {
                grouped[status].push(opp);
            } else {
                grouped.capture.push(opp); // Default to capture
            }
        });

        return grouped;
    },

    toggleSection(status) {
        const section = document.querySelector(`[data-status="${status}"] .collapsible-content`);
        const icon = document.querySelector(`[data-status="${status}"] .collapse-icon`);
        
        if (section && icon) {
            const isVisible = section.style.display !== 'none';
            section.style.display = isVisible ? 'none' : 'block';
            icon.textContent = isVisible ? '▶' : '▼';
        }
    },

    showPhaseSteps(opportunityId, phase) {
        // This would open the existing phase steps modal
        // Implementation depends on your existing phase steps functionality
        console.log('Show phase steps for opportunity:', opportunityId, 'phase:', phase);
    },

    addNote() {
        // Implementation for adding notes
        const noteContent = prompt('Enter your note:');
        if (noteContent) {
            // Add note logic here
            console.log('Add note:', noteContent);
        }
    },

    editOpportunity(id) {
        // Implementation for editing opportunity
        console.log('Edit opportunity:', id);
    },

    openNewModal() {
        // Implementation for new opportunity modal
        console.log('Open new opportunity modal');
    },

    closeModal() {
        const modal = document.getElementById('opportunityDetailModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
};