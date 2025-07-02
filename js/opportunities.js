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
            <div class="opportunity-card" data-status="${opp.status || 'capture'}">
                <div class="opportunity-card-header">
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
                
                <div class="opportunity-footer">
                    <button class="btn btn-secondary" onclick="Opportunities.edit(${opp.id})">
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
        console.log('Editing opportunity:', id);
        // Implementation for editing
        alert('Edit functionality will be implemented next');
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
    }
};

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});