const Opportunities = {
    statuses: {
        capture: { label: 'Capture', color: '#007bff', icon: '🎯' },
        pursuing: { label: 'Pursuing', color: '#28a745', icon: '🚀' },
        won: { label: 'Won', color: '#28a745', icon: '🏆' },
        lost: { label: 'Lost', color: '#dc3545', icon: '❌' },
        archived: { label: 'Archived', color: '#6c757d', icon: '📦' }
    },

    render() {
        const container = document.getElementById('opportunities-grid');
        
        // Group opportunities by status
        const grouped = this.groupByStatus();
        
        let html = '';
        
        // Active opportunities (capture and pursuing)
        const activeStatuses = ['capture', 'pursuing'];
        activeStatuses.forEach(status => {
            if (grouped[status] && grouped[status].length > 0) {
                html += this.renderStatusSection(status, grouped[status], false);
            }
        });
        
        // Completed opportunities (won/lost) - collapsible
        const completedStatuses = ['won', 'lost'];
        const completedOpps = [];
        completedStatuses.forEach(status => {
            if (grouped[status]) {
                completedOpps.push(...grouped[status].map(opp => ({...opp, status})));
            }
        });
        
        if (completedOpps.length > 0) {
            html += this.renderCompletedSection(completedOpps);
        }
        
        // Archived opportunities - collapsible
        if (grouped.archived && grouped.archived.length > 0) {
            html += this.renderArchivedSection(grouped.archived);
        }
        
        // Add new opportunity card
        html += `
            <div class="opportunity-card" style="border: 2px dashed #ddd; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: #666;">
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">➕</div>
                    <h4>Add New Opportunity</h4>
                    <p>Track a new business opportunity</p>
                </div>
                <button class="btn" onclick="Opportunities.openNewModal()">
                    Add Opportunity
                </button>
            </div>
        `;
        
        container.innerHTML = html;
    },

    groupByStatus() {
        const grouped = {};
        DataStore.opportunities.forEach(opp => {
            const status = opp.status || 'capture';
            if (!grouped[status]) grouped[status] = [];
            grouped[status].push(opp);
        });
        return grouped;
    },

    renderStatusSection(status, opportunities, isCollapsible = false) {
        const statusInfo = this.statuses[status];
        const sectionId = `section-${status}`;
        
        return `
            <div class="status-section" style="grid-column: 1 / -1; margin-bottom: 1rem;">
                <div class="status-header" style="display: flex; align-items: center; margin-bottom: 1rem; ${isCollapsible ? 'cursor: pointer;' : ''}" ${isCollapsible ? `onclick="Opportunities.toggleSection('${sectionId}')"` : ''}>
                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">${statusInfo.icon}</span>
                    <h3 style="margin: 0; color: ${statusInfo.color};">${statusInfo.label} (${opportunities.length})</h3>
                    ${isCollapsible ? '<span style="margin-left: auto; font-size: 1.2rem;">▼</span>' : ''}
                </div>
                <div id="${sectionId}" class="opportunities-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem;">
                    ${opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                </div>
            </div>
        `;
    },

    renderCompletedSection(opportunities) {
        const sectionId = 'section-completed';
        return `
            <div class="status-section" style="grid-column: 1 / -1; margin-bottom: 1rem;">
                <div class="status-header" style="display: flex; align-items: center; margin-bottom: 1rem; cursor: pointer;" onclick="Opportunities.toggleSection('${sectionId}')">
                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">📊</span>
                    <h3 style="margin: 0; color: #6c757d;">Completed Opportunities (${opportunities.length})</h3>
                    <span style="margin-left: auto; font-size: 1.2rem;">▼</span>
                </div>
                <div id="${sectionId}" class="opportunities-grid" style="display: none; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem;">
                    ${opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                </div>
            </div>
        `;
    },

    renderArchivedSection(opportunities) {
        const sectionId = 'section-archived';
        return `
            <div class="status-section" style="grid-column: 1 / -1; margin-bottom: 1rem;">
                <div class="status-header" style="display: flex; align-items: center; margin-bottom: 1rem; cursor: pointer;" onclick="Opportunities.toggleSection('${sectionId}')">
                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">📦</span>
                    <h3 style="margin: 0; color: #6c757d;">Archived (${opportunities.length})</h3>
                    <span style="margin-left: auto; font-size: 1.2rem;">▼</span>
                </div>
                <div id="${sectionId}" class="opportunities-grid" style="display: none; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem;">
                    ${opportunities.map(opp => this.renderOpportunityCard(opp)).join('')}
                </div>
            </div>
        `;
    },

    renderOpportunityCard(opp) {
        const status = opp.status || 'capture';
        const statusInfo = this.statuses[status];
        
        return `
            <div class="opportunity-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <h4 style="margin: 0; flex: 1;">${opp.name}</h4>
                    <span style="background: ${statusInfo.color}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-left: 0.5rem;">
                        ${statusInfo.icon} ${statusInfo.label}
                    </span>
                </div>
                
                <p style="color: #666; margin-bottom: 1rem;">${opp.description || 'No description'}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem;">
                    <div><strong>Value:</strong> ${Utils.formatCurrency(opp.value)}</div>
                    <div><strong>Probability:</strong> ${opp.probability}%</div>
                    <div><strong>Close Date:</strong> ${Utils.formatDate(opp.closeDate)}</div>
                    <div><strong>Days Left:</strong> ${Utils.getDaysUntil(opp.closeDate)}</div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.edit(${opp.id})">
                            Edit
                        </button>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.view(${opp.id})">
                            View
                        </button>
                    </div>
                    <div class="dropdown" style="position: relative;">
                        <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Opportunities.toggleStatusMenu(${opp.id})">
                            Status ▼
                        </button>
                        <div id="status-menu-${opp.id}" class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; min-width: 150px;">
                            ${Object.entries(this.statuses).map(([key, info]) => `
                                <button class="dropdown-item" style="display: block; width: 100%; padding: 0.5rem; border: none; background: none; text-align: left; cursor: pointer;" 
                                        onclick="Opportunities.changeStatus(${opp.id}, '${key}')" 
                                        ${key === status ? 'disabled' : ''}>
                                    ${info.icon} ${info.label} ${key === status ? '(Current)' : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        const header = section.previousElementSibling.querySelector('span:last-child');
        
        if (section.style.display === 'none') {
            section.style.display = 'grid';
            header.textContent = '▲';
        } else {
            section.style.display = 'none';
            header.textContent = '▼';
        }
    },

    toggleStatusMenu(oppId) {
        // Close all other menus
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.id !== `status-menu-${oppId}`) {
                menu.style.display = 'none';
            }
        });
        
        const menu = document.getElementById(`status-menu-${oppId}`);
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    },

    changeStatus(oppId, newStatus) {
        const opp = DataStore.opportunities.find(o => o.id === oppId);
        if (!opp) return;
        
        opp.status = newStatus;
        opp.statusChangedDate = new Date().toISOString().split('T')[0];
        
        DataStore.saveData();
        this.render();
        
        // Close the dropdown
        document.getElementById(`status-menu-${oppId}`).style.display = 'none';
        
        const statusInfo = this.statuses[newStatus];
        alert(`Opportunity moved to ${statusInfo.label}!`);
    },

    openNewModal() {
        document.getElementById('opportunityModal').style.display = 'block';
        document.getElementById('opportunityForm').reset();
    },

    save(event) {
        event.preventDefault();
        
        const newOpportunity = {
            name: document.getElementById('oppName').value,
            customer: document.getElementById('oppCustomer').value,
            value: parseInt(document.getElementById('oppValue').value) || 0,
            rfpDate: document.getElementById('oppRfpDate').value,
            pwin: parseInt(document.getElementById('oppPwin').value) || 50,
            type: document.getElementById('oppType').value,
            role: document.getElementById('oppRole').value,
            incumbent: document.getElementById('oppIncumbent').value,
            description: document.getElementById('oppDescription').value
        };
        
        DataStore.addOpportunity(newOpportunity);
        this.closeModal();
        Dashboard.refresh();
        
        if (document.getElementById('roadmap-view').style.display !== 'none') {
            Roadmap.render();
        }
        if (document.getElementById('opportunities-view').style.display !== 'none') {
            this.renderAll();
        }
        
        alert('Opportunity added successfully!');
    },

    closeModal() {
        document.getElementById('opportunityModal').style.display = 'none';
    },

    edit(oppId) {
        const opp = DataStore.opportunities.find(o => o.id === oppId);
        if (!opp) return;
        
        const modal = document.getElementById('opportunityModal');
        const content = document.getElementById('opportunity-form-content');
        
        content.innerHTML = `
            <h2>Edit Opportunity</h2>
            <form id="opportunityForm" onsubmit="Opportunities.updateOpportunity(event, ${oppId})">
                <div class="form-group">
                    <label for="opp_name">Opportunity Name *</label>
                    <input type="text" id="opp_name" value="${opp.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="opp_description">Description</label>
                    <textarea id="opp_description" rows="3">${opp.description || ''}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="opp_value">Value ($) *</label>
                        <input type="number" id="opp_value" value="${opp.value}" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="opp_probability">Probability (%) *</label>
                        <input type="number" id="opp_probability" value="${opp.probability}" min="0" max="100" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="opp_closeDate">Expected Close Date *</label>
                        <input type="date" id="opp_closeDate" value="${opp.closeDate}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="opp_status">Status</label>
                        <select id="opp_status">
                            ${Object.entries(this.statuses).map(([key, info]) => `
                                <option value="${key}" ${(opp.status || 'capture') === key ? 'selected' : ''}>
                                    ${info.icon} ${info.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="opp_client">Client/Customer</label>
                    <input type="text" id="opp_client" value="${opp.client || ''}">
                </div>
                
                <div class="form-group">
                    <label for="opp_notes">Notes</label>
                    <textarea id="opp_notes" rows="4">${opp.notes || ''}</textarea>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="Opportunities.closeModal()">Cancel</button>
                    <button type="submit" class="btn">Update Opportunity</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'block';
    },

    updateOpportunity(event, oppId) {
        event.preventDefault();
        
        const oppIndex = DataStore.opportunities.findIndex(o => o.id === oppId);
        if (oppIndex === -1) return;
        
        const oldStatus = DataStore.opportunities[oppIndex].status;
        const newStatus = document.getElementById('opp_status').value;
        
        // Update the opportunity
        DataStore.opportunities[oppIndex] = {
            ...DataStore.opportunities[oppIndex],
            name: document.getElementById('opp_name').value,
            description: document.getElementById('opp_description').value,
            value: parseFloat(document.getElementById('opp_value').value),
            probability: parseInt(document.getElementById('opp_probability').value),
            closeDate: document.getElementById('opp_closeDate').value,
            status: newStatus,
            client: document.getElementById('opp_client').value,
            notes: document.getElementById('opp_notes').value,
            lastModified: new Date().toISOString().split('T')[0]
        };
        
        // If status changed, record the change
        if (oldStatus !== newStatus) {
            DataStore.opportunities[oppIndex].statusChangedDate = new Date().toISOString().split('T')[0];
        }
        
        DataStore.saveData();
        this.closeModal();
        this.render();
        
        alert('Opportunity updated successfully!');
    },

    renderAll() {
        this.render('all-opportunities', DataStore.opportunities);
    },

    getPwinClass(pwin) {
        return pwin >= 70 ? 'high' : pwin >= 40 ? 'medium' : 'low';
    },

    // ... existing methods (add, view, etc.) remain the same ...
    
    // Close all dropdowns when clicking outside
    init() {
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }
};

// Initialize the opportunities module
Opportunities.init();
