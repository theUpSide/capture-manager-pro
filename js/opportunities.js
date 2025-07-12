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

    renderOpportunityCard(opportunity) {
        const progressPercentage = opportunity.progress || 0;
    
        // Format values safely
        const formatValue = (value) => {
            if (value === null || value === undefined || value === '') return 'N/A';
            if (typeof value === 'number') {
                return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : 
                       value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : 
                       `$${value.toLocaleString()}`;
            }
            return value;
        };
    
        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
                return new Date(dateStr).toLocaleDateString();
            } catch (e) {
                return 'N/A';
            }
        };

        return `
            <div class="opportunity-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <h4 style="margin: 0; flex: 1; color: #2a5298; font-size: 1.1rem; font-weight: 600;">${opportunity.name}</h4>
                    <span class="status-badge status-${opportunity.status || 'capture'}" style="font-size: 0.7rem; padding: 0.25rem 0.6rem; border-radius: 10px; font-weight: 600; text-transform: uppercase;">${(opportunity.status || 'capture').toUpperCase()}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem;">
                    <div><strong>Value:</strong> ${formatValue(opportunity.value)}</div>
                    <div><strong>P(win):</strong> ${opportunity.probability || opportunity.pwin || 0}%</div>
                    <div><strong>Client:</strong> ${opportunity.client || opportunity.customer || 'N/A'}</div>
                    <div><strong>Close:</strong> ${formatDate(opportunity.closeDate || opportunity.rfpDate)}</div>
                </div>
                
                <div style="color: #666; font-size: 0.9rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #e9ecef; flex-grow: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                    ${opportunity.description || 'No description provided.'}
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: #495057;">
                        <span>Progress</span>
                        <span>${progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.editOpportunity(${opportunity.id})">Edit</button>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.initiateGateReview(${opportunity.id})">Gate Review</button>
                    </div>
                    <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.showDetailModal(${opportunity.id})">View Details</button>
                </div>
            </div>
        `;
    },

    openNewModal() {
        this.openEditModal(null);
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

    showDetailModal(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('opportunityDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'opportunityDetailModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Format values safely
        const formatValue = (value) => {
            if (value === null || value === undefined || value === '') return 'N/A';
            if (typeof value === 'number') {
                return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : 
                       value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : 
                       `$${value.toLocaleString()}`;
            }
            return value;
        };
        
        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
                return new Date(dateStr).toLocaleDateString();
            } catch (e) {
                return 'N/A';
            }
        };
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                <div id="opportunity-detail-content">
                    <div class="opportunity-summary-card">
                        <div>
                            <h3>Value</h3>
                            <div class="metric-value">${formatValue(opportunity.value)}</div>
                        </div>
                        <div>
                            <h3>Probability</h3>
                            <div class="metric-value">${opportunity.probability || opportunity.pwin || 0}%</div>
                        </div>
                        <div>
                            <h3>Expected Value</h3>
                            <div class="metric-value">${formatValue((opportunity.value || 0) * ((opportunity.probability || opportunity.pwin || 0) / 100))}</div>
                        </div>
                        <div>
                            <h3>Phase</h3>
                            <div class="metric-value">${(opportunity.currentPhase || 'identification').charAt(0).toUpperCase() + (opportunity.currentPhase || 'identification').slice(1)}</div>
                        </div>
                    </div>
                    
                    <div class="opportunity-detail-columns">
                        <div class="opportunity-left">
                            <h3>Opportunity Details</h3>
                            <div style="margin-bottom: 1rem;">
                                <strong>Name:</strong> ${opportunity.name}<br>
                                <strong>Client:</strong> ${opportunity.client || opportunity.customer || 'N/A'}<br>
                                <strong>Status:</strong> ${(opportunity.status || 'capture').toUpperCase()}<br>
                                <strong>Close Date:</strong> ${formatDate(opportunity.closeDate || opportunity.rfpDate)}<br>
                                <strong>Progress:</strong> ${opportunity.progress || 0}%
                            </div>
                            
                            <div style="margin-bottom: 1rem;">
                                <strong>Description:</strong><br>
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px; margin-top: 0.5rem;">
                                    ${opportunity.description || 'No description provided.'}
                                </div>
                            </div>
                            
                            ${opportunity.notes ? `
                                <div>
                                    <strong>Notes:</strong><br>
                                    <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px; margin-top: 0.5rem;">
                                        ${opportunity.notes}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="opportunity-right">
                            <h3>Phase Progress</h3>
                            <div class="phase-blocks-container">
                                <div class="phase-block ${opportunity.currentPhase === 'identification' ? 'current' : ''}">
                                    <div class="phase-icon">🔍</div>
                                    <div class="phase-title">Identification</div>
                                    <div class="phase-progress">Step 1</div>
                                </div>
                                <div class="phase-block ${opportunity.currentPhase === 'qualification' ? 'current' : ''}">
                                    <div class="phase-icon">📋</div>
                                    <div class="phase-title">Qualification</div>
                                    <div class="phase-progress">Step 2</div>
                                </div>
                                <div class="phase-block ${opportunity.currentPhase === 'planning' ? 'current' : ''}">
                                    <div class="phase-icon">📅</div>
                                    <div class="phase-title">Planning</div>
                                    <div class="phase-progress">Step 3</div>
                                </div>
                                <div class="phase-block ${opportunity.currentPhase === 'engagement' ? 'current' : ''}">
                                    <div class="phase-icon">🤝</div>
                                    <div class="phase-title">Engagement</div>
                                    <div class="phase-progress">Step 4</div>
                                </div>
                                <div class="phase-block ${opportunity.currentPhase === 'intelligence' ? 'current' : ''}">
                                    <div class="phase-icon">🧠</div>
                                    <div class="phase-title">Intelligence</div>
                                    <div class="phase-progress">Step 5</div>
                                </div>
                                <div class="phase-block ${opportunity.currentPhase === 'preparation' ? 'current' : ''}">
                                    <div class="phase-icon">🎯</div>
                                    <div class="phase-title">Preparation</div>
                                    <div class="phase-progress">Step 6</div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 2rem;">
                                <h4>Quick Actions</h4>
                                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                    <button class="btn btn-secondary" onclick="Opportunities.editOpportunity(${opportunity.id})">Edit Details</button>
                                    <button class="btn btn-secondary" onclick="Opportunities.initiateGateReview(${opportunity.id})">Gate Review</button>
                                    <button class="btn" onclick="Navigation.showTemplates(); this.closest('.modal').style.display='none'">View Templates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },

    editOpportunity(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        this.openEditModal(opportunity);
    },

    openEditModal(opportunity) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('opportunityEditModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'opportunityEditModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                <h2>${opportunity ? 'Edit' : 'Add New'} Opportunity</h2>
                <form id="opportunityForm" onsubmit="Opportunities.${opportunity ? 'updateOpportunity' : 'saveOpportunity'}(event)">
                    ${opportunity ? `<input type="hidden" id="opportunityId" value="${opportunity.id}">` : ''}
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="opportunityName">Opportunity Name *</label>
                            <input type="text" id="opportunityName" value="${opportunity?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="opportunityStatus">Status</label>
                            <select id="opportunityStatus">
                                <option value="capture" ${(opportunity?.status || 'capture') === 'capture' ? 'selected' : ''}>Capture</option>
                                <option value="pursuing" ${opportunity?.status === 'pursuing' ? 'selected' : ''}>Pursuing</option>
                                <option value="won" ${opportunity?.status === 'won' ? 'selected' : ''}>Won</option>
                                <option value="lost" ${opportunity?.status === 'lost' ? 'selected' : ''}>Lost</option>
                                <option value="archived" ${opportunity?.status === 'archived' ? 'selected' : ''}>Archived</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="opportunityValue">Value ($)</label>
                            <input type="number" id="opportunityValue" value="${opportunity?.value || ''}" step="1000">
                        </div>
                        <div class="form-group">
                            <label for="opportunityProbability">Probability (%)</label>
                            <input type="number" id="opportunityProbability" value="${opportunity?.probability || opportunity?.pwin || 50}" min="0" max="100">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="opportunityClient">Client</label>
                            <input type="text" id="opportunityClient" value="${opportunity?.client || opportunity?.customer || ''}">
                        </div>
                        <div class="form-group">
                            <label for="opportunityCloseDate">Close Date</label>
                            <input type="date" id="opportunityCloseDate" value="${opportunity?.closeDate || opportunity?.rfpDate || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="opportunityDescription">Description</label>
                        <textarea id="opportunityDescription" rows="3">${opportunity?.description || ''}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="opportunityProgress">Progress (%)</label>
                            <input type="number" id="opportunityProgress" value="${opportunity?.progress || 5}" min="0" max="100">
                        </div>
                        <div class="form-group">
                            <label for="opportunityPhase">Current Phase</label>
                            <select id="opportunityPhase">
                                <option value="identification" ${(opportunity?.currentPhase || 'identification') === 'identification' ? 'selected' : ''}>Identification</option>
                                <option value="qualification" ${opportunity?.currentPhase === 'qualification' ? 'selected' : ''}>Qualification</option>
                                <option value="planning" ${opportunity?.currentPhase === 'planning' ? 'selected' : ''}>Planning</option>
                                <option value="engagement" ${opportunity?.currentPhase === 'engagement' ? 'selected' : ''}>Engagement</option>
                                <option value="intelligence" ${opportunity?.currentPhase === 'intelligence' ? 'selected' : ''}>Intelligence</option>
                                <option value="preparation" ${opportunity?.currentPhase === 'preparation' ? 'selected' : ''}>Preparation</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="opportunityNotes">Notes</label>
                        <textarea id="opportunityNotes" rows="3">${opportunity?.notes || ''}</textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                        <button type="submit" class="btn">${opportunity ? 'Update' : 'Save'} Opportunity</button>
                    </div>
                </form>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },

    updateOpportunity(event) {
        event.preventDefault();
        
        const opportunityId = parseInt(document.getElementById('opportunityId').value);
        const opportunity = DataStore.getOpportunity(opportunityId);
        
        if (!opportunity) {
            alert('Opportunity not found');
            return;
        }
        
        // Update opportunity with form data
        opportunity.name = document.getElementById('opportunityName').value;
        opportunity.status = document.getElementById('opportunityStatus').value;
        opportunity.value = parseFloat(document.getElementById('opportunityValue').value) || 0;
        opportunity.probability = parseInt(document.getElementById('opportunityProbability').value) || 0;
        opportunity.client = document.getElementById('opportunityClient').value;
        opportunity.closeDate = document.getElementById('opportunityCloseDate').value;
        opportunity.description = document.getElementById('opportunityDescription').value;
        opportunity.progress = parseInt(document.getElementById('opportunityProgress').value) || 0;
        opportunity.currentPhase = document.getElementById('opportunityPhase').value;
        opportunity.notes = document.getElementById('opportunityNotes').value;
        opportunity.lastModified = new Date().toISOString().split('T')[0];
        
        // Save data and refresh view
        DataStore.saveData();
        document.getElementById('opportunityEditModal').style.display = 'none';
        this.render();
        
        // Update dashboard if it's visible
        if (document.getElementById('dashboard-view').style.display !== 'none') {
            Dashboard.render();
        }
        
        alert('Opportunity updated successfully!');
    },

    initiateGateReview(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Check if GateReviews module is available
        if (typeof GateReviews !== 'undefined' && GateReviews.initiateReview) {
            GateReviews.initiateReview(opportunityId);
        } else {
            // Fallback: show a simple modal
            this.showGateReviewModal(opportunityId);
        }
    },

    showGateReviewModal(opportunityId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('gateReviewModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'gateReviewModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                <h2>Gate Review for ${opportunity.name}</h2>
                <p>Gate review functionality is being prepared for this opportunity.</p>
                <div style="margin-top: 2rem;">
                    <h3>Pre-Gate Review Checklist:</h3>
                    <ul style="text-align: left; margin: 1rem 0; padding-left: 2rem;">
                        <li>Complete capture plan documentation</li>
                        <li>Validate customer requirements</li>
                        <li>Confirm team assignments</li>
                        <li>Review competitive positioning</li>
                        <li>Assess technical feasibility</li>
                        <li>Validate pricing strategy</li>
                    </ul>
                </div>
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">Close</button>
                    <button class="btn" onclick="Navigation.showGateReviews(); this.closest('.modal').style.display='none'">Go to Gate Reviews</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },

    saveOpportunity(event) {
        event.preventDefault();
        
        const newOpportunity = {
            id: Date.now(), // Simple ID generation
            name: document.getElementById('opportunityName').value,
            status: document.getElementById('opportunityStatus').value,
            value: parseFloat(document.getElementById('opportunityValue').value) || 0,
            probability: parseInt(document.getElementById('opportunityProbability').value) || 0,
            client: document.getElementById('opportunityClient').value,
            closeDate: document.getElementById('opportunityCloseDate').value,
            description: document.getElementById('opportunityDescription').value,
            progress: parseInt(document.getElementById('opportunityProgress').value) || 0,
            currentPhase: document.getElementById('opportunityPhase').value,
            notes: document.getElementById('opportunityNotes').value,
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        
        // Add to DataStore
        DataStore.opportunities.push(newOpportunity);
        DataStore.saveData();
        this.closeModal();
        this.render();
        
        // Update dashboard if it's visible
        if (document.getElementById('dashboard-view').style.display !== 'none') {
            Dashboard.render();
        }
        
        alert('Opportunity saved successfully!');
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
            this.showDetailModal(opportunityId);
        }
    },

    deleteNote(opportunityId, noteId) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity || !opportunity.notes) return;
        
        opportunity.notes = opportunity.notes.filter(note => note.id !== noteId);
        DataStore.saveData();
        
        // Refresh the detail modal if it's open
        if (document.getElementById('opportunityDetailModal').style.display === 'block') {
            this.showDetailModal(opportunityId);
        }
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
            const completedPhaseSteps = phaseSteps.filter(step => 
                completedSteps.includes(step.id)
            );
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
            return `
                <div class="saved-template-item">
                    <strong>${templateTitle}</strong> - ${st.status === 'in-progress' ? 'In Progress' : 'Completed'} (Saved: ${Utils.formatDate(st.savedDate)})
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
            <button class="btn btn-primary" onclick="Presentation.openPresentation(${opportunity.id})" style="margin-left: 0.5rem;">
                📊 Executive Presentation
            </button>
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

    closeDetailModal() {
        const modal = document.getElementById('opportunityDetailModal');
        if (modal) {
            modal.style.display = 'none';
            // Remove any click listeners to avoid memory leaks
            modal.replaceWith(modal.cloneNode(true));
        }
    },

    renderOpportunitiesByStatus() {
        const container = document.getElementById('opportunities-grid');
        if (!container) return;

        const statusGroups = {
            'capture': DataStore.opportunities.filter(opp => !opp.status || opp.status === 'capture'),
            'pursuing': DataStore.opportunities.filter(opp => opp.status === 'pursuing'),
            'won': DataStore.opportunities.filter(opp => opp.status === 'won'),
            'lost': DataStore.opportunities.filter(opp => opp.status === 'lost'),
            'archived': DataStore.opportunities.filter(opp => opp.status === 'archived')
        };

        let html = '';

        // Create sections like actions page but using your existing card rendering
        Object.entries(statusGroups).forEach(([status, opportunities]) => {
            if (opportunities.length > 0) {
                const statusDisplayName = status.charAt(0).toUpperCase() + status.slice(1);
                const statusColor = this.getStatusColor(status);
                
                html += `
                    <div class="opportunities-section" style="margin-bottom: 2rem;">
                        <h3 style="color: ${statusColor}; margin: 0 0 1rem 0;">
                            ${this.getStatusIcon(status)} ${statusDisplayName} Opportunities (${opportunities.length})
                        </h3>
                        <div class="opportunities-grid">
                            ${opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                        </div>
                    </div>
                `;
            }
        });

        if (html === '') {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💼</div>
                    <h3>No opportunities yet</h3>
                    <p>Add your first opportunity to get started</p>
                    <button class="btn" onclick="Opportunities.openNewModal()" style="margin-top: 1rem;">Add Opportunity</button>
                </div>
            `;
        } else {
            container.innerHTML = html;
        }
    },

    getStatusColor(status) {
        const colors = {
            'capture': '#2a5298',
            'pursuing': '#ffc107',
            'won': '#28a745',
            'lost': '#dc3545',
            'archived': '#6c757d'
        };
        return colors[status] || '#2a5298';
    },

    getStatusIcon(status) {
        const icons = {
            'capture': '🎯',
            'pursuing': '🏃',
            'won': '✅',
            'lost': '❌',
            'archived': '📁'
        };
        return icons[status] || '💼';
    },

    toggleSection(status) {
        const section = document.getElementById(`${status}-opportunities`);
        const toggle = document.getElementById(`${status}-toggle`);
        
        if (section.style.display === 'none') {
            section.style.display = 'grid';
            toggle.textContent = '▼';
        } else {
            section.style.display = 'none';
            toggle.textContent = '▶';
        }
    },

    closePhaseStepsModal() {
        const modal = document.getElementById('phase-steps-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.replaceWith(modal.cloneNode(true)); // Remove event listeners
        }
    }
};

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});