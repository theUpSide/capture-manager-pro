// Complete Opportunities module for Capture Manager Pro
const Opportunities = {
    currentEdit: null,

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
                // FIX: Updated collapsing logic - only 'capture' and 'pursuing' open by default
                const isCollapsed = status !== 'capture' && status !== 'pursuing';
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

    groupOpportunitiesByStatus() {
        const groups = {
            capture: [],
            pursuing: [],
            won: [],
            lost: [],
            archived: []
        };

        DataStore.opportunities.forEach(opp => {
            const status = opp.status || 'capture';
            if (groups[status]) {
                groups[status].push(opp);
            } else {
                groups.capture.push(opp); // Default fallback
            }
        });

        return groups;
    },

    renderOpportunityCard(opportunity) {
        const value = opportunity.value || 0;
        const probability = opportunity.probability || opportunity.pwin || 0;
        const expectedValue = (value * probability) / 100;
        const daysUntilClose = opportunity.closeDate ? Utils.calculateDaysUntilDate(opportunity.closeDate) : 'TBD';
        const progress = Math.round(opportunity.progress || 0);
        
        // Truncate description
        const description = opportunity.description || 'No description provided';
        const truncatedDescription = description.length > 120 ? 
            description.substring(0, 120) + '...' : description;

        return `
            <div class="opportunity-card executive-card" data-status="${opportunity.status || 'capture'}" onclick="Opportunities.openDetailModal(${opportunity.id})">
                <div class="opportunity-card-header">
                    <h4 class="opportunity-title">${opportunity.name}</h4>
                    <div class="opportunity-value">${Utils.formatCurrency(value)}</div>
                </div>
                
                <div class="opportunity-details-grid">
                    <div class="detail-row">
                        <span class="detail-label">Client:</span>
                        <span class="detail-value">${opportunity.client || opportunity.customer || 'TBD'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">P(Win):</span>
                        <span class="detail-value">${probability}%</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Expected Value:</span>
                        <span class="detail-value">${Utils.formatCurrency(expectedValue)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Days to Close:</span>
                        <span class="detail-value">${daysUntilClose}</span>
                    </div>
                </div>

                <div class="opportunity-description-preview">
                    ${truncatedDescription}
                </div>

                <div class="opportunity-progress-section">
                    <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-percentage">${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="opportunity-footer">
                    <div class="opportunity-status">
                        <span class="status-badge status-${opportunity.status || 'capture'}">
                            ${opportunity.status || 'capture'}
                        </span>
                    </div>
                    <div class="opportunity-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-secondary btn-small" onclick="Opportunities.edit(${opportunity.id})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    toggleSection(status) {
        const section = document.querySelector(`[data-status="${status}"]`);
        if (!section) return;
        
        const content = section.querySelector('.collapsible-content');
        const icon = section.querySelector('.collapse-icon');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            icon.textContent = '▶';
        }
    },

    openDetailModal(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;

        const modal = document.getElementById('opportunityDetailModal');
        const content = document.getElementById('opportunity-detail-content');

        // FIXED: Build phase blocks using roadmap logic and phase.title instead of phase.name
        const phaseBlocksHtml = Object.entries(DataStore.captureRoadmap).map(([key, phase]) => {
            // Use the same getStepCompletion logic as roadmap.js
            const phaseStepsCompleted = phase.steps.filter(step => 
                this.getStepCompletion(opportunityId, step.id)
            ).length;
            const phaseProgress = Math.round((phaseStepsCompleted / phase.steps.length) * 100);
            
            let statusClass = 'upcoming';
            if (phaseProgress === 100) statusClass = 'completed';
            else if (phaseProgress > 0) statusClass = 'current';
            
            return `
                <div class="phase-block ${statusClass}" onclick="Opportunities.showPhaseSteps(${opportunityId}, '${key}')">
                    <div class="phase-name">${phase.title}</div>
                    <div class="phase-progress">${phaseProgress}%</div>
                    <div class="phase-steps">${phaseStepsCompleted}/${phase.steps.length} steps</div>
                </div>
            `;
        }).join('');

        // Build saved templates section (in-progress only)
        const savedTemplates = DataStore.savedTemplates.filter(st => 
            st.opportunityId == opportunityId && st.status !== 'completed'
        );
        
        // Build completed templates section
        const completedTemplates = opportunity.completedTemplates || [];
        
        const savedTemplatesHtml = savedTemplates.length > 0 ? savedTemplates.map(st => {
            const template = DataStore.templates.find(t => t.id === st.templateId);
            return `
                <div class="saved-template-item in-progress">
                    <div class="template-info">
                        <strong>${template ? template.title : 'Unknown Template'}</strong>
                        <span class="template-status">📝 In Progress</span>
                    </div>
                    <div class="template-meta">
                        <span>Started: ${Utils.formatDate(st.savedDate)}</span>
                        <span>By: ${st.data?.employee_name || 'Unknown'}</span>
                    </div>
                    <button class="btn btn-small" onclick="Templates.editSavedTemplate(${st.id})">Continue</button>
                </div>
            `;
        }).join('') : '';

        const completedTemplatesHtml = completedTemplates.length > 0 ? completedTemplates.map(ct => {
            return `
                <div class="saved-template-item completed">
                    <div class="template-info">
                        <strong>${ct.templateTitle}</strong>
                        <span class="template-status">✅ Completed</span>
                    </div>
                    <div class="template-meta">
                        <span>Completed: ${Utils.formatDate(ct.completedDate)}</span>
                        <span>By: ${ct.completedBy}</span>
                    </div>
                    <button class="btn btn-small btn-secondary" onclick="Templates.viewCompletedTemplate(${ct.id})">View</button>
                </div>
            `;
        }).join('') : '';

        const templatesContent = (savedTemplatesHtml || completedTemplatesHtml) ? 
            `${savedTemplatesHtml}${completedTemplatesHtml}` : 
            '<p>No templates for this opportunity yet.</p>';

        // Build actions section  
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);
        const actionsHtml = actions.length > 0 ? actions.map(action => {
            return `
                <div class="action-item ${action.completed ? 'completed' : ''} ${!action.completed && new Date(action.dueDate) < new Date() ? 'overdue' : ''}">
                    <div class="action-header">
                        <span class="action-title">${action.title}</span>
                        <span class="action-priority priority-${action.priority}">${action.priority}</span>
                    </div>
                    <div class="action-details">
                        <span>Due: ${Utils.formatDate(action.dueDate)}</span>
                        <span class="action-status">${action.completed ? 'Completed' : 'Pending'}</span>
                    </div>
                </div>
            `;
        }).join('') : '<p>No action items for this opportunity.</p>';

        // Calculate days until close
        const daysUntilClose = opportunity.closeDate || opportunity.rfpDate ? Utils.calculateDaysUntilDate(opportunity.closeDate || opportunity.rfpDate) : 'N/A';

        // Build notes section HTML
        const notes = opportunity.notes || [];
        const notesHtml = notes.length > 0 ? notes.map(note => `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-timestamp">${Utils.formatDateTime(note.timestamp)}</span>
                    <button class="btn-small btn-secondary note-delete" onclick="Opportunities.deleteNote(${opportunityId}, ${note.id})" title="Delete note">
                        🗑️
                    </button>
                </div>
                <div class="note-content">${note.content}</div>
            </div>
        `).join('') : '<p class="no-notes-message">No notes yet. Add your first note above.</p>';

        // Update the modal content with the executive presentation button that calls the existing Presentation module
        content.innerHTML = `
            <div class="opportunity-summary-card">
                <div>
                    <h3>Value</h3>
                    <div class="metric-value">${Utils.formatCurrency(opportunity.value)}</div>
                </div>
                <div>
                    <h3>Probability of Win</h3>
                    <div class="metric-value">${opportunity.probability || opportunity.pwin || 0}%</div>
                </div>
                <div>
                    <h3>Days Until Close</h3>
                    <div class="metric-value">${daysUntilClose}</div>
                </div>
                <div>
                    <h3>Progress</h3>
                    <div class="metric-value">${opportunity.progress || 0}%</div>
                </div>
            </div>

            <div class="opportunity-detail-columns">
                <div class="opportunity-left detail-section">
                    <h3>Capture Management Journey</h3>
                    <div class="phase-blocks-container">
                        ${phaseBlocksHtml}
                    </div>
                </div>

                <div class="opportunity-right">
                    <section class="notes-section detail-section">
                        <h3>📝 Opportunity Notes</h3>
                        <div class="notes-input-section">
                            <textarea id="newNoteContent" placeholder="Add a new note about this opportunity..." rows="3"></textarea>
                            <button class="btn btn-secondary" onclick="Opportunities.addNoteFromModal(${opportunityId})">Add Note</button>
                        </div>
                        <div class="notes-list">
                            ${notesHtml}
                        </div>
                    </section>

                    <section class="saved-templates-section detail-section">
                        <h3>📋 Templates & Documentation</h3>
                        <div class="templates-list">
                            ${templatesContent}
                        </div>
                    </section>

                    <section class="actions-section detail-section">
                        <h3>Action Items</h3>
                        <div class="actions-list">
                            ${actionsHtml}
                        </div>
                    </section>
                </div>
            </div>

            <div id="phase-steps-modal" class="modal" style="display:none;">
                <div class="modal-content" style="max-width: 600px; max-height: 70vh; overflow-y: auto; position: relative;">
                    <span class="close" onclick="Opportunities.closePhaseStepsModal()" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>
                    <div id="phase-steps-content"></div>
                </div>
            </div>

            <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e9ecef;">
                <button class="btn executive-presentation-btn" onclick="Presentation.openPresentation(${opportunityId})" style="background: linear-gradient(45deg, #2a5298, #3d6bb3); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(42, 82, 152, 0.3); transition: all 0.3s ease;">
                    <span style="font-size: 1.2rem;">📊</span>
                    Executive Presentation
                </button>
                <div style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-secondary" onclick="Opportunities.edit(${opportunityId})">Edit Details</button>
                    <button class="btn btn-secondary" onclick="Opportunities.closeDetailModal()">Close</button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        
        // Add event listener to close modal when clicking outside content
        const onClickOutside = (event) => {
            if (event.target === modal) {
                this.closeDetailModal();
                modal.removeEventListener('click', onClickOutside);
            }
        };
        modal.addEventListener('click', onClickOutside);
    },

    openNewModal() {
        console.log('Opening new opportunity modal');
        const modal = document.getElementById('opportunityModal');
        const content = document.getElementById('opportunity-form-content');
        
        content.innerHTML = `
            <h2>Add New Opportunity</h2>
            <form id="opportunityForm" onsubmit="Opportunities.save(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppName">Opportunity Name *</label>
                        <input type="text" id="oppName" required>
                    </div>
                    <div class="form-group">
                        <label for="oppCustomer">Customer *</label>
                        <input type="text" id="oppCustomer" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppValue">Value ($) *</label>
                        <input type="number" id="oppValue" required>
                    </div>
                    <div class="form-group">
                        <label for="oppProbability">Probability of Win (%) *</label>
                        <input type="number" id="oppProbability" min="0" max="100" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppRfpDate">RFP Release Date</label>
                        <input type="date" id="oppRfpDate">
                    </div>
                    <div class="form-group">
                        <label for="oppCloseDate">Proposal Due Date</label>
                        <input type="date" id="oppCloseDate">
                    </div>
                </div>
                <div class="form-group">
                    <label for="oppDescription">Description</label>
                    <textarea id="oppDescription" rows="3" placeholder="Brief description of the opportunity..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppStatus">Status</label>
                        <select id="oppStatus">
                            <option value="capture">Capture Phase</option>
                            <option value="pursuing">Actively Pursuing</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Save Opportunity</button>
            </form>
        `;
        
        modal.style.display = 'block';
    },

    save(event) {
        event.preventDefault();
        console.log('Saving opportunity');
        
        const formData = {
            name: document.getElementById('oppName').value,
            customer: document.getElementById('oppCustomer').value,
            value: parseInt(document.getElementById('oppValue').value),
            probability: parseInt(document.getElementById('oppProbability').value),
            rfpDate: document.getElementById('oppRfpDate').value,
            closeDate: document.getElementById('oppCloseDate').value,
            description: document.getElementById('oppDescription').value,
            status: document.getElementById('oppStatus').value
        };

        if (this.currentEdit) {
            DataStore.updateOpportunity(this.currentEdit, formData);
        } else {
            DataStore.addOpportunity(formData);
        }

        this.closeModal();
        this.render();
        
        // Also refresh dashboard if it's visible
        if (document.getElementById('dashboard-view').style.display !== 'none') {
            Dashboard.render();
        }
    },

    edit(id) {
        const opportunity = DataStore.getOpportunity(id);
        if (!opportunity) return;

        this.currentEdit = id;
        this.openNewModal();
        
        // Populate form with existing data
        document.getElementById('oppName').value = opportunity.name || '';
        document.getElementById('oppCustomer').value = opportunity.customer || '';
        document.getElementById('oppValue').value = opportunity.value || '';
        document.getElementById('oppProbability').value = opportunity.probability || opportunity.pwin || '';
        document.getElementById('oppRfpDate').value = opportunity.rfpDate || '';
        document.getElementById('oppCloseDate').value = opportunity.closeDate || '';
        document.getElementById('oppDescription').value = opportunity.description || '';
        document.getElementById('oppStatus').value = opportunity.status || 'capture';
        
        // Update modal title
        document.querySelector('#opportunity-form-content h2').textContent = 'Edit Opportunity';
    },

    closeModal() {
        document.getElementById('opportunityModal').style.display = 'none';
        this.currentEdit = null;
    },

    closeDetailModal() {
        document.getElementById('opportunityDetailModal').style.display = 'none';
    },

    addNoteFromModal(opportunityId) {
        const noteContent = document.getElementById('newNoteContent').value.trim();
        if (!noteContent) {
            alert('Please enter a note before adding.');
            return;
        }
        
        this.addNote(opportunityId, noteContent);
        document.getElementById('newNoteContent').value = ''; // Clear the input
    },

    addNote(opportunityId, noteContent) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;
        
        if (!opportunity.notes) {
            opportunity.notes = [];
        }
        
        const newNote = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            content: noteContent,
            author: "Current User" // You can expand this later for multi-user
        };
        
        opportunity.notes.unshift(newNote); // Add to beginning for most recent first
        DataStore.saveData();
        
        // Refresh the detail modal if it's open
        if (document.getElementById('opportunityDetailModal').style.display === 'block') {
            this.openDetailModal(opportunityId);
        }
    },

    deleteNote(opportunityId, noteId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity || !opportunity.notes) return;
        
        opportunity.notes = opportunity.notes.filter(note => note.id !== noteId);
        DataStore.saveData();
        
        // Refresh the detail modal if it's open
        if (document.getElementById('opportunityDetailModal').style.display === 'block') {
            this.openDetailModal(opportunityId);
        }
    },

    showPhaseSteps(opportunityId, phaseKey) {
        const phase = DataStore.captureRoadmap[phaseKey];
        if (!phase) return;

        const modal = document.getElementById('phase-steps-modal');
        const content = document.getElementById('phase-steps-content');
        const opportunity = DataStore.getOpportunity(opportunityId);
        
        // Get actions for this opportunity and phase steps
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);

        // Build steps list with checkboxes and completion status
        const stepsHtml = phase.steps.map(step => {
            const action = actions.find(a => a.stepId === step.id);
            // FIX: Use the new getStepCompletion method
            const completed = this.getStepCompletion(opportunityId, step.id);
            const completedDate = action && action.completedDate ? Utils.formatDate(action.completedDate) : 'Not completed';

            return `
                <div class="step-item ${completed ? 'completed' : ''}" style="margin-bottom: 1rem; padding: 1rem; border-radius: 8px; background: ${completed ? '#e8f5e9' : '#f8f9fa'}; border: 1px solid ${completed ? '#c3e6cb' : '#e9ecef'};">
                    <div class="step-header" style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" 
                               id="step-${step.id}" 
                               ${completed ? 'checked' : ''} 
                               onchange="Opportunities.toggleStepCompletionViaAction(${opportunityId}, '${step.id}')"
                               style="margin-top: 0.25rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: ${completed ? '#28a745' : '#495057'};">${step.title}</h4>
                            <p style="margin: 0.5rem 0; color: #666; font-size: 0.9rem;">${step.description}</p>
                            ${step.deliverable ? `<p style="margin: 0.5rem 0; font-weight: 500; color: #2a5298;"><strong>Deliverable:</strong> ${step.deliverable}</p>` : ''}
                            <p style="margin: 0; font-size: 0.8rem; color: #999;">Status: ${completedDate}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // FIXED: Use phase.title instead of phase.name
        content.innerHTML = `
            <h3 style="margin-top: 0; color: #2a5298;">${phase.title}</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">${phase.description}</p>
            <div class="steps-list">
                ${stepsHtml}
            </div>
        `;

        modal.style.display = 'block';
    },

    // FIX: Add new method for step completion checking
    getStepCompletion(opportunityId, stepId) {
        return DataStore.actions.some(action => 
            action.opportunityId == opportunityId && 
            action.stepId === stepId && 
            action.completed
        );
    },

    // FIX: Add new method for step completion via actions
    toggleStepCompletionViaAction(opportunityId, stepId) {
        // Find existing action or create new one
        let action = DataStore.actions.find(a => a.opportunityId == opportunityId && a.stepId === stepId);
        
        if (!action) {
            // Create new action for this step
            const stepInfo = this.findStepInfo(stepId);
            action = {
                id: Date.now(),
                opportunityId: parseInt(opportunityId),
                title: stepInfo.title,
                dueDate: new Date().toISOString().split('T')[0],
                priority: "Medium",
                phase: this.getCurrentPhaseForStep(stepId),
                stepId: stepId,
                completed: true,
                completedDate: new Date().toISOString()
            };
            DataStore.actions.push(action);
        } else {
            // Toggle completion status
            action.completed = !action.completed;
            if (action.completed) {
                action.completedDate = new Date().toISOString();
            } else {
                delete action.completedDate;
            }
        }
        
        DataStore.saveData();
        
        // Refresh modals if open
        if (document.getElementById('opportunityDetailModal').style.display === 'block') {
            this.openDetailModal(opportunityId);
        }
        if (document.getElementById('phase-steps-modal').style.display === 'block') {
            // Re-render the current phase modal
            const phaseTitle = document.querySelector('#phase-steps-content h3')?.textContent;
            if (phaseTitle) {
                const phaseKey = this.getPhaseKeyFromTitle(phaseTitle);
                if (phaseKey) {
                    this.showPhaseSteps(opportunityId, phaseKey);
                }
            }
        }
    },

    // FIX: Add helper methods
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
        
        // Calculate total steps across all phases
        let totalSteps = 0;
        let completedSteps = 0;
        
        Object.values(DataStore.captureRoadmap).forEach(phase => {
            totalSteps += phase.steps.length;
            // FIX: Use the new completion checking method
            completedSteps += phase.steps.filter(step => 
                this.getStepCompletion(opportunityId, step.id)
            ).length;
        });
        
        // Calculate progress percentage
        const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        opportunity.progress = progressPercent;
        DataStore.saveData();
    },

    // FIXED: Update the getPhaseKeyFromTitle method to use phase.title instead of phase.name
    getPhaseKeyFromTitle(title) {
        // Helper function to get phase key from phase title
        for (const [key, phase] of Object.entries(DataStore.captureRoadmap)) {
            if (phase.title === title) {
                return key;
            }
        }
        return null;
    },

    closePhaseStepsModal() {
        document.getElementById('phase-steps-modal').style.display = 'none';
    }
};