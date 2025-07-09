const Opportunities = {
    render() {
        console.log('Opportunities.render() called');
        
        // Look for the correct container - checking both possible IDs
        let container = document.getElementById('opportunities-grid');
        if (!container) {
            // Try the opportunities view container and create the grid inside it
            const opportunitiesView = document.getElementById('opportunities-view');
            if (opportunitiesView) {
                const section = opportunitiesView.querySelector('.section');
                if (section) {
                    // Find or create the opportunities-grid div
                    container = section.querySelector('.opportunities-grid');
                    if (!container) {
                        container = section.querySelector('#opportunities-grid');
                        if (!container) {
                            // Create the container
                            const existingGrid = section.querySelector('div:last-child');
                            if (existingGrid && existingGrid.classList.contains('opportunities-grid')) {
                                container = existingGrid;
                            } else {
                                container = document.createElement('div');
                                container.className = 'opportunities-grid';
                                container.id = 'opportunities-grid';
                                section.appendChild(container);
                            }
                        }
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
                    <h3>No opportunities yet</h3>
                    <p>Add your first opportunity to get started</p>
                    <button class="btn" onclick="Opportunities.openNewModal()">Add Opportunity</button>
                </div>
            `;
            return;
        }

        // Group opportunities by status
        const groupedOpportunities = this.groupOpportunitiesByStatus();
        
        // Create horizontal columns layout - all visible at once
        let html = `<div class="opportunities-sections-layout">`;
        
        Object.entries(groupedOpportunities).forEach(([status, opps]) => {
            if (opps.length > 0) {
                // Determine if section should be collapsed by default
                const isCollapsed = status !== 'capture' && status !== 'pursuing';
                const collapseIcon = isCollapsed ? '▶' : '▼';
                
                html += `
                    <div class="opportunity-category-section" data-status="${status}">
                        <div class="category-header collapsible-header" onclick="Opportunities.toggleSection('${status}')">
                            <div class="category-title-section">
                                <span class="collapse-icon" id="collapse-${status}">${collapseIcon}</span>
                                <h3>${this.getStatusDisplayName(status)}</h3>
                            </div>
                            <span class="category-count">${opps.length} opportunit${opps.length === 1 ? 'y' : 'ies'}</span>
                        </div>
                        <div class="category-cards-grid collapsible-content" id="content-${status}" ${isCollapsed ? 'style="display: none;"' : ''}>
                            ${opps.map(opp => this.renderOpportunityCard(opp)).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        html += `</div>`;
        container.innerHTML = html;
    },

    toggleSection(status) {
        const content = document.getElementById(`content-${status}`);
        const icon = document.getElementById(`collapse-${status}`);
        const section = content.closest('.opportunity-category-section');
        
        if (content.style.display === 'none' || content.style.display === '') {
            // Expand section
            content.style.display = 'grid';
            content.style.opacity = '0';
            content.style.transform = 'translateY(-20px)';
            
            // Smooth animation
            requestAnimationFrame(() => {
                content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            });
            
            icon.textContent = '▼';
            section.classList.add('expanded');
        } else {
            // Collapse section
            content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)';
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                content.style.display = 'none';
                content.style.transition = '';
            }, 300);
            
            icon.textContent = '▶';
            section.classList.remove('expanded');
        }
    },

    switchTab(status) {
        // Update active tab
        document.querySelectorAll('.status-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"].status-tab`).classList.add('active');
        
        // Update active content
        document.querySelectorAll('.status-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"].status-section`).classList.add('active');
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

    getStatusDisplayName(status) {
        const names = {
            capture: '🎯 Capture Phase',
            pursuing: '🏃 Actively Pursuing',
            won: '🏆 Won',
            lost: '❌ Lost',
            archived: '📁 Archived'
        };
        return names[status] || status;
    },

    renderOpportunityCard(opp) {
        const progress = opp.progress || 0;
        const probability = opp.probability || opp.pwin || 0;
        
        return `
            <div class="opportunity-card" data-status="${opp.status || 'capture'}" onclick="Opportunities.openDetailModal(${opp.id})" style="cursor: pointer;">
                <div class="opportunity-card-header" onclick="event.stopPropagation()">
                    <h4>${opp.name}</h4>
                    <div class="opportunity-actions">
                        <span class="status-badge status-${opp.status || 'capture'}">
                            ${opp.status || 'capture'}
                        </span>
                        <div class="dropdown">
                            <button class="btn btn-secondary" onclick="Opportunities.toggleDropdown(event, ${opp.id})">⋮</button>
                            <div class="dropdown-menu" id="dropdown-${opp.id}">
                                <button class="dropdown-item" onclick="Opportunities.edit(${opp.id})">Edit</button>
                                <button class="dropdown-item" onclick="Opportunities.changeStatus(${opp.id}, 'capture')" ${(opp.status || 'capture') === 'capture' ? 'disabled' : ''}>Mark as Capture</button>
                                <button class="dropdown-item" onclick="Opportunities.changeStatus(${opp.id}, 'pursuing')" ${opp.status === 'pursuing' ? 'disabled' : ''}>Mark as Pursuing</button>
                                <button class="dropdown-item" onclick="Opportunities.changeStatus(${opp.id}, 'won')" ${opp.status === 'won' ? 'disabled' : ''}>Mark as Won</button>
                                <button class="dropdown-item" onclick="Opportunities.changeStatus(${opp.id}, 'lost')" ${opp.status === 'lost' ? 'disabled' : ''}>Mark as Lost</button>
                                <button class="dropdown-item" onclick="Opportunities.changeStatus(${opp.id}, 'archived')" ${opp.status === 'archived' ? 'disabled' : ''}>Archive</button>
                                <button class="dropdown-item" onclick="Opportunities.delete(${opp.id})" style="color: #dc3545;">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="opportunity-details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Value:</span>
                        <span class="detail-value">${Utils.formatCurrency(opp.value || 0)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">P(win):</span>
                        <span class="detail-value">${probability}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Close Date:</span>
                        <span class="detail-value">${Utils.formatDate(opp.closeDate || opp.rfpDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Client:</span>
                        <span class="detail-value">${opp.client || opp.customer || 'TBD'}</span>
                    </div>
                </div>
                
                ${opp.description ? `<div class="opportunity-description">${opp.description}</div>` : ''}
                
                <div class="opportunity-progress">
                    <div class="progress-header">
                        <span>Progress:</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="opportunity-footer" style="display: flex; justify-content: space-between; align-items: center;">
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); Opportunities.edit(${opp.id})">
                        Edit Details
                    </button>
                    <div class="opportunity-meta">
                        Created: ${Utils.formatDate(opp.createdDate)}
                    </div>
                </div>
            </div>
        `;
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
                        <label for="oppClient">Client/Customer</label>
                        <input type="text" id="oppClient">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppValue">Contract Value ($)</label>
                        <input type="number" id="oppValue" min="0" step="1000">
                    </div>
                    <div class="form-group">
                        <label for="oppProbability">Probability of Win (%)</label>
                        <input type="number" id="oppProbability" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppCloseDate">Expected Close Date</label>
                        <input type="date" id="oppCloseDate">
                    </div>
                    <div class="form-group">
                        <label for="oppStatus">Status</label>
                        <select id="oppStatus">
                            <option value="capture">Capture</option>
                            <option value="pursuing">Pursuing</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="oppDescription">Description</label>
                    <textarea id="oppDescription" placeholder="Brief description of the opportunity..."></textarea>
                </div>
                <button type="submit" class="btn">Save Opportunity</button>
            </form>
        `;
        
        modal.style.display = 'block';
    },

    save(event) {
        event.preventDefault();
        console.log('Saving opportunity');
        
        const newOpportunity = {
            id: Date.now(),
            name: document.getElementById('oppName').value,
            client: document.getElementById('oppClient').value,
            value: parseInt(document.getElementById('oppValue').value) || 0,
            probability: parseInt(document.getElementById('oppProbability').value) || 50,
            closeDate: document.getElementById('oppCloseDate').value,
            status: document.getElementById('oppStatus').value,
            description: document.getElementById('oppDescription').value,
            createdDate: new Date().toISOString().split('T')[0],
            progress: 5,
            currentPhase: 'identification'
        };
        
        DataStore.opportunities.push(newOpportunity);
        DataStore.saveData();
        this.closeModal();
        this.render();
        
        alert('Opportunity added successfully!');
    },

    edit(id) {
        const opportunity = DataStore.getOpportunity(id);
        if (!opportunity) {
            alert('Opportunity not found');
            return;
        }

        const modal = document.getElementById('opportunityModal');
        const content = document.getElementById('opportunity-form-content');

        // Populate form with existing opportunity data
        content.innerHTML = `
            <h2>Edit Opportunity</h2>
            <form id="opportunityForm" onsubmit="Opportunities.update(event, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppName">Opportunity Name *</label>
                        <input type="text" id="oppName" required value="${opportunity.name}">
                    </div>
                    <div class="form-group">
                        <label for="oppClient">Client/Customer</label>
                        <input type="text" id="oppClient" value="${opportunity.client || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppValue">Contract Value ($)</label>
                        <input type="number" id="oppValue" min="0" step="1000" value="${opportunity.value || 0}">
                    </div>
                    <div class="form-group">
                        <label for="oppProbability">Probability of Win (%)</label>
                        <input type="number" id="oppProbability" min="0" max="100" value="${opportunity.probability || opportunity.pwin || 50}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="oppCloseDate">Expected Close Date</label>
                        <input type="date" id="oppCloseDate" value="${opportunity.closeDate || opportunity.rfpDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="oppStatus">Status</label>
                        <select id="oppStatus">
                            <option value="capture" ${opportunity.status === 'capture' ? 'selected' : ''}>Capture</option>
                            <option value="pursuing" ${opportunity.status === 'pursuing' ? 'selected' : ''}>Pursuing</option>
                            <option value="won" ${opportunity.status === 'won' ? 'selected' : ''}>Won</option>
                            <option value="lost" ${opportunity.status === 'lost' ? 'selected' : ''}>Lost</option>
                            <option value="archived" ${opportunity.status === 'archived' ? 'selected' : ''}>Archived</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="oppDescription">Description</label>
                    <textarea id="oppDescription" placeholder="Brief description of the opportunity...">${opportunity.description || ''}</textarea>
                </div>
                <button type="submit" class="btn">Save Changes</button>
            </form>
        `;

        modal.style.display = 'block';
    },

    update(event, id) {
        event.preventDefault();

        const opportunity = DataStore.getOpportunity(id);
        if (!opportunity) {
            alert('Opportunity not found');
            return;
        }

        // Update opportunity fields from form inputs
        opportunity.name = document.getElementById('oppName').value;
        opportunity.client = document.getElementById('oppClient').value;
        opportunity.value = parseInt(document.getElementById('oppValue').value) || 0;
        opportunity.probability = parseInt(document.getElementById('oppProbability').value) || 50;
        opportunity.closeDate = document.getElementById('oppCloseDate').value;
        opportunity.status = document.getElementById('oppStatus').value;
        opportunity.description = document.getElementById('oppDescription').value;
        opportunity.lastModified = new Date().toISOString().split('T')[0];

        DataStore.saveData();
        this.closeModal();
        this.render();

        // Removed alert popup for successful save
        // alert('Opportunity updated successfully!');
    },

    delete(id) {
        if (confirm('Are you sure you want to delete this opportunity?')) {
            DataStore.opportunities = DataStore.opportunities.filter(opp => opp.id !== id);
            DataStore.saveData();
            this.render();
        }
    },

    changeStatus(id, newStatus) {
        const opp = DataStore.opportunities.find(o => o.id === id);
        if (opp) {
            opp.status = newStatus;
            opp.statusChangedDate = new Date().toISOString().split('T')[0];
            DataStore.saveData();
            this.render();
        }
    },

    toggleDropdown(event, id) {
        event.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.id !== `dropdown-${id}`) {
                menu.style.display = 'none';
            }
        });
        
        // Toggle this dropdown
        const dropdown = document.getElementById(`dropdown-${id}`);
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    },

    closeModal() {
        document.getElementById('opportunityModal').style.display = 'none';
    },

    openDetailModal(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;

        const modal = document.getElementById('opportunityDetailModal');
        const content = document.getElementById('opportunity-detail-content');

        // Gather saved templates and actions related to this opportunity
        const savedTemplates = DataStore.savedTemplates.filter(st => st.opportunityId == opportunityId);
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);

        // Calculate phase progress based on completed steps
        const phaseTitles = {
            identification: 'Identification',
            qualification: 'Qualification', 
            planning: 'Planning',
            engagement: 'Engagement',
            intelligence: 'Intelligence',
            preparation: 'Preparation'
        };
        
        const completedSteps = opportunity.completedSteps || [];
        
        const phaseBlocksHtml = Object.entries(DataStore.captureRoadmap).map(([phaseKey, phase]) => {
            const phaseSteps = phase.steps;
            const completedPhaseSteps = phaseSteps.filter(step => completedSteps.includes(step.id));
            const progressPercent = phaseSteps.length > 0 ? Math.round((completedPhaseSteps.length / phaseSteps.length) * 100) : 0;
            
            let statusClass = 'upcoming';
            let icon = '⏳';
            
            if (progressPercent === 100) {
                statusClass = 'completed';
                icon = '✅';
            } else if (phaseKey === opportunity.currentPhase) {
                statusClass = 'current';
                icon = '🔄';
            } else if (progressPercent > 0) {
                statusClass = 'needs-attention';
                icon = '🎯';
            }

            return `
                <div class="phase-block ${statusClass}" title="${phase.title} - ${progressPercent}% complete (${completedPhaseSteps.length}/${phaseSteps.length} steps)" onclick="Opportunities.showPhaseSteps('${opportunityId}', '${phaseKey}')">
                    <div class="phase-icon">${icon}</div>
                    <div class="phase-title">${phaseTitles[phaseKey]}</div>
                    <div class="phase-progress">${progressPercent}%</div>
                    <div class="phase-steps-count">${completedPhaseSteps.length}/${phaseSteps.length}</div>
                </div>
            `;
        }).join('');

        // Build saved templates list HTML
        const savedTemplatesHtml = savedTemplates.length > 0 ? savedTemplates.map(st => {
            const templateDef = DataStore.templates.find(t => t.id === st.templateId);
            const templateTitle = templateDef ? templateDef.title : 'Unknown Template';
            const statusLabel = st.status === 'in-progress' ? 'In Progress' : 'Completed';
            return `
                <div class="saved-template-item">
                    <strong>${templateTitle}</strong> - ${statusLabel} (Saved: ${Utils.formatDate(st.savedDate)})
                    <button class="btn-small btn btn-secondary" onclick="Templates.editSavedTemplate(${st.id})">Edit</button>
                </div>
            `;
        }).join('') : '<p class="no-saved-templates-message">No saved templates yet.</p>';

        // Build actions list HTML
        const actionsHtml = actions.length > 0 ? actions.map(action => {
            const completedClass = action.completed ? 'completed' : '';
            return `
                <div class="action-item ${completedClass}">
                    <div><strong>${action.title}</strong> (${action.priority})</div>
                    <div>Due: ${Utils.formatDate(action.dueDate)}</div>
                    <div>Status: ${action.completed ? 'Completed' : 'Pending'}</div>
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

        // Update the modal content to include notes section
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
                        <h3>Templates</h3>
                        <div class="saved-templates-list">
                            ${savedTemplatesHtml}
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

            <div style="text-align: right; margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="Opportunities.closeDetailModal()">Close</button>
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
        const completedSteps = opportunity.completedSteps || [];

        // Get actions for this opportunity and phase steps
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);

        // Build steps list with checkboxes and completion status
        const stepsHtml = phase.steps.map(step => {
            const action = actions.find(a => a.stepId === step.id);
            const completed = completedSteps.includes(step.id);
            const completedDate = action && action.completedDate ? Utils.formatDate(action.completedDate) : 'Not completed';

            return `
                <div class="step-item ${completed ? 'completed' : ''}" style="margin-bottom: 1rem; padding: 1rem; border-radius: 8px; background: ${completed ? '#e8f5e9' : '#f8f9fa'}; border: 1px solid ${completed ? '#c3e6cb' : '#e9ecef'};">
                    <div class="step-header" style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" 
                               id="step-${step.id}" 
                               ${completed ? 'checked' : ''} 
                               onchange="Opportunities.toggleStepCompletion(${opportunityId}, '${step.id}')"
                               style="margin-top: 0.2rem; transform: scale(1.2);">
                        <label for="step-${step.id}" style="flex: 1; cursor: pointer;">
                            <h4 style="margin: 0 0 0.3rem 0; color: ${completed ? '#28a745' : '#2a5298'};">
                                ${completed ? '✅' : '⏳'} ${step.title}
                            </h4>
                            <p style="margin: 0 0 0.3rem 0; color: #666; font-size: 0.9rem;">${step.description}</p>
                        </label>
                    </div>
                    <div style="margin-left: 2rem; font-size: 0.8rem; color: #666;">
                        <small>Duration: ${step.duration} days • Start: Day ${step.daysFromStart}</small><br>
                        <small style="color: ${completed ? '#28a745' : '#6c757d'};">
                            ${completed ? `Completed: ${completedDate}` : 'Not completed'}
                        </small>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate phase progress
        const phaseSteps = phase.steps;
        const completedPhaseSteps = phaseSteps.filter(step => completedSteps.includes(step.id));
        const phaseProgress = phaseSteps.length > 0 ? Math.round((completedPhaseSteps.length / phaseSteps.length) * 100) : 0;

        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <h3 style="margin: 0 0 0.5rem 0; color: #2a5298;">${phase.title} - Steps</h3>
                <div style="margin-bottom: 0.5rem;">
                    <span style="font-weight: bold; color: #28a745;">${completedPhaseSteps.length}</span> of 
                    <span style="font-weight: bold; color: #2a5298;">${phaseSteps.length}</span> steps completed
                </div>
                <div class="progress-bar" style="width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
                    <div class="progress-fill" style="width: ${phaseProgress}%; height: 100%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%); transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">${phaseProgress}% Complete</div>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem;">
                ${stepsHtml}
            </div>
        `;

        modal.style.display = 'block';

        // Close modal on clicking outside content
        const onClickOutside = (event) => {
            if (event.target === modal) {
                this.closePhaseStepsModal();
                modal.removeEventListener('click', onClickOutside);
            }
        };
        modal.addEventListener('click', onClickOutside);
    },

    toggleStepCompletion(opportunityId, stepId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;
        
        if (!opportunity.completedSteps) {
            opportunity.completedSteps = [];
        }
        
        const stepIndex = opportunity.completedSteps.indexOf(stepId);
        if (stepIndex > -1) {
            // Step is completed, remove it
            opportunity.completedSteps.splice(stepIndex, 1);
        } else {
            // Step is not completed, add it
            opportunity.completedSteps.push(stepId);
        }
        
        // Update overall progress based on completed steps
        this.updateOpportunityProgress(opportunityId);
        
        DataStore.saveData();
        
        // Refresh the detail modal if it's open
        if (document.getElementById('opportunityDetailModal').style.display === 'block') {
            this.openDetailModal(opportunityId);
        }
        
        // Refresh the phase steps modal if it's open
        if (document.getElementById('phase-steps-modal').style.display === 'block') {
            // Get the current phase from the modal content
            const phaseStepsModal = document.getElementById('phase-steps-modal');
            const phaseTitle = phaseStepsModal.querySelector('h3')?.textContent;
            if (phaseTitle) {
                const phaseKey = this.getPhaseKeyFromTitle(phaseTitle);
                if (phaseKey) {
                    this.showPhaseSteps(opportunityId, phaseKey);
                }
            }
        }
    },
    
    updateOpportunityProgress(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;
        
        // Calculate total steps across all phases
        let totalSteps = 0;
        let completedSteps = opportunity.completedSteps ? opportunity.completedSteps.length : 0;
        
        Object.values(DataStore.captureRoadmap).forEach(phase => {
            totalSteps += phase.steps.length;
        });
        
        // Calculate progress percentage
        const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        opportunity.progress = progressPercent;
        
        // Update current phase based on completed steps
        this.updateCurrentPhase(opportunityId);
    },
    
    updateCurrentPhase(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity || !opportunity.completedSteps) return;
        
        const phases = Object.keys(DataStore.captureRoadmap);
        let currentPhase = 'identification';
        
        // Find the most advanced phase with incomplete steps
        for (let i = 0; i < phases.length; i++) {
            const phaseKey = phases[i];
            const phase = DataStore.captureRoadmap[phaseKey];
            const phaseSteps = phase.steps;
            
            // Check if all steps in this phase are completed
            const allStepsCompleted = phaseSteps.every(step => 
                opportunity.completedSteps.includes(step.id)
            );
            
            if (allStepsCompleted && i < phases.length - 1) {
                // All steps completed, move to next phase
                currentPhase = phases[i + 1];
            } else if (!allStepsCompleted) {
                // Some steps incomplete, this is the current phase
                currentPhase = phaseKey;
                break;
            }
        }
        
        opportunity.currentPhase = currentPhase;
    },
    
    getPhaseKeyFromTitle(titleWithSteps) {
        // Extract phase key from title like "Opportunity Identification - Steps"
        const phaseTitle = titleWithSteps.replace(' - Steps', '');
        const phaseMap = {
            'Opportunity Identification': 'identification',
            'Opportunity Qualification': 'qualification',
            'Capture Planning': 'planning',
            'Customer Engagement': 'engagement',
            'Competitive Intelligence': 'intelligence',
            'Pre-RFP Preparation': 'preparation'
        };
        
        return phaseMap[phaseTitle] || 'identification';
    },
    
    closePhaseStepsModal() {
        const modal = document.getElementById('phase-steps-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.replaceWith(modal.cloneNode(true)); // Remove event listeners
        }
    },

    closeDetailModal() {
        const modal = document.getElementById('opportunityDetailModal');
        if (modal) {
            modal.style.display = 'none';
            // Remove any click listeners to avoid memory leaks
            modal.replaceWith(modal.cloneNode(true));
        }
    }
};

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});