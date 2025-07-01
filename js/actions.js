const Actions = {
    renderAll() {
        const container = document.getElementById('all-actions');
        
        if (DataStore.actions.length === 0) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No action items found</div>';
            return;
        }

        const sortedActions = [...DataStore.actions].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        container.innerHTML = sortedActions.map(action => {
            const opportunity = DataStore.getOpportunity(action.opportunityId);
            const dueDate = new Date(action.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0 && !action.completed;
            
            return `
                <div class="action-item ${isOverdue ? 'urgent' : ''} ${action.completed ? 'completed' : ''}">
                    <div>
                        <strong>${action.title}</strong>
                        <div style="font-size: 0.9rem; color: #666;">
                            ${opportunity ? opportunity.name : 'Unknown Opportunity'} • ${action.phase} • Priority: ${action.priority}
                            ${action.description ? `<br><em>${action.description}</em>` : ''}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: ${action.completed ? '#28a745' : isOverdue ? '#dc3545' : '#666'};">
                            ${action.completed ? 'Completed' : isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `Due: ${Utils.formatDate(action.dueDate)}`}
                        </div>
                        ${!action.completed ? `<div style="margin-top: 0.3rem;">
                            <button class="btn btn-success" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="Actions.markComplete(${action.id})">Complete</button>
                            <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-left: 0.3rem;" onclick="Actions.edit(${action.id})">Edit</button>
                        </div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    renderUrgent() {
        const container = document.getElementById('urgent-actions');
        const urgentActions = DataStore.actions.filter(action => {
            const dueDate = new Date(action.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return !action.completed && daysUntilDue <= 7;
        }).slice(0, 5);

        if (urgentActions.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">No urgent actions</div>';
            return;
        }

        container.innerHTML = urgentActions.map(action => {
            const opportunity = DataStore.getOpportunity(action.opportunityId);
            const dueDate = new Date(action.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;
            
            return `
                <div class="action-item ${isOverdue ? 'urgent' : ''}">
                    <div>
                        <strong>${action.title}</strong>
                        <div style="font-size: 0.9rem; color: #666;">
                            ${opportunity ? opportunity.name : 'Unknown Opportunity'} • ${action.phase}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: ${isOverdue ? '#dc3545' : '#ffc107'};">
                            ${isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `Due in ${daysUntilDue} days`}
                        </div>
                        <div style="margin-top: 0.3rem;">
                            <button class="btn btn-success" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="Actions.markComplete(${action.id})">Complete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    openNewModal() {
        document.getElementById('actionModal').style.display = 'block';
        document.getElementById('actionForm').reset();
    
        // Populate opportunity dropdown
        const opportunitySelect = document.getElementById('actionOpportunity');
        opportunitySelect.innerHTML = '<option value="">Select Opportunity</option>';
    
        DataStore.opportunities.forEach(opp => {
            const option = document.createElement('option');
            option.value = opp.id;
            option.textContent = opp.name;
            opportunitySelect.appendChild(option);
        });
    },

    closeModal() {
        document.getElementById('actionModal').style.display = 'none';
    },

    save(event) {
        event.preventDefault();

        const newAction = {
            id: Date.now(),
            opportunityId: parseInt(document.getElementById('actionOpportunity').value),
            title: document.getElementById('actionTitle').value,
            dueDate: document.getElementById('actionDueDate').value,
            priority: document.getElementById('actionPriority').value,
            phase: document.getElementById('actionPhase').value,
            category: document.getElementById('actionCategory').value,
            description: document.getElementById('actionDescription').value,
            completed: false
        };

        DataStore.actions.push(newAction);
        this.closeModal();
        Dashboard.refresh();

        if (document.getElementById('actions-view').style.display !== 'none') {
            this.renderAll();
        }

        alert('Action item added successfully!');
    },

    markComplete(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (action) {
            action.completed = true;
            Dashboard.refresh();
            
            // Refresh current view
            if (document.getElementById('actions-view').style.display !== 'none') {
                this.renderAll();
            }
            
            // Update roadmap if open
            if (document.getElementById('roadmap-view').style.display !== 'none') {
                Roadmap.render();
            }
        }
    },

    edit(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;

        // Pre-populate the form with existing data
        document.getElementById('actionTitle').value = action.title;
        document.getElementById('actionDueDate').value = action.dueDate;
        document.getElementById('actionPriority').value = action.priority;
        document.getElementById('actionPhase').value = action.phase;
        document.getElementById('actionCategory').value = action.category || 'other';
        document.getElementById('actionDescription').value = action.description || '';

        // Populate and select the opportunity
        const opportunitySelect = document.getElementById('actionOpportunity');
        opportunitySelect.innerHTML = '<option value="">Select Opportunity</option>';
        
        DataStore.opportunities.forEach(opp => {
            const option = document.createElement('option');
            option.value = opp.id;
            option.textContent = opp.name;
            if (opp.id === action.opportunityId) {
                option.selected = true;
            }
            opportunitySelect.appendChild(option);
        });

        // Change form submission to update instead of create
        const form = document.getElementById('actionForm');
        form.onsubmit = (event) => this.update(event, actionId);
        
        // Update modal title and button text
        const modalContent = document.querySelector('#actionModal .modal-content h2');
        modalContent.textContent = 'Edit Action Item';
        
        const submitButton = document.querySelector('#actionForm button[type="submit"]');
        submitButton.textContent = 'Update Action';

        document.getElementById('actionModal').style.display = 'block';
    },

    update(event, actionId) {
        event.preventDefault();

        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;

        // Update the action with new values
        action.title = document.getElementById('actionTitle').value;
        action.opportunityId = parseInt(document.getElementById('actionOpportunity').value);
        action.dueDate = document.getElementById('actionDueDate').value;
        action.priority = document.getElementById('actionPriority').value;
        action.phase = document.getElementById('actionPhase').value;
        action.category = document.getElementById('actionCategory').value;
        action.description = document.getElementById('actionDescription').value;

        this.closeModal();
        
        // Reset form back to create mode
        this.resetFormToCreateMode();
        
        Dashboard.refresh();

        if (document.getElementById('actions-view').style.display !== 'none') {
            this.renderAll();
        }

        alert('Action item updated successfully!');
    },

    resetFormToCreateMode() {
        const form = document.getElementById('actionForm');
        form.onsubmit = (event) => this.save(event);
        
        const modalContent = document.querySelector('#actionModal .modal-content h2');
        modalContent.textContent = 'Add Action Item';
        
        const submitButton = document.querySelector('#actionForm button[type="submit"]');
        submitButton.textContent = 'Save Action';
    },

    delete(actionId) {
        if (!confirm('Are you sure you want to delete this action item?')) return;

        const actionIndex = DataStore.actions.findIndex(a => a.id === actionId);
        if (actionIndex !== -1) {
            DataStore.actions.splice(actionIndex, 1);
            Dashboard.refresh();
            
            if (document.getElementById('actions-view').style.display !== 'none') {
                this.renderAll();
            }
            
            alert('Action item deleted successfully!');
        }
    },

    // Filter actions by status
    filterByStatus(status) {
        const container = document.getElementById('all-actions');
        let filteredActions;

        switch(status) {
            case 'completed':
                filteredActions = DataStore.actions.filter(a => a.completed);
                break;
            case 'pending':
                filteredActions = DataStore.actions.filter(a => !a.completed);
                break;
            case 'overdue':
                filteredActions = DataStore.actions.filter(a => {
                    if (a.completed) return false;
                    const dueDate = new Date(a.dueDate);
                    const today = new Date();
                    return dueDate < today;
                });
                break;
            default:
                filteredActions = DataStore.actions;
        }

        this.renderActionsList(container, filteredActions);
    },

    // Filter actions by opportunity
    filterByOpportunity(opportunityId) {
        const container = document.getElementById('all-actions');
        const filteredActions = opportunityId ? 
            DataStore.actions.filter(a => a.opportunityId == opportunityId) : 
            DataStore.actions;
        
        this.renderActionsList(container, filteredActions);
    },

    // Filter actions by priority
    filterByPriority(priority) {
        const container = document.getElementById('all-actions');
        const filteredActions = priority ? 
            DataStore.actions.filter(a => a.priority === priority) : 
            DataStore.actions;
        
        this.renderActionsList(container, filteredActions);
    },

    renderActionsList(container, actionsList) {
        if (actionsList.length === 0) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No action items match the current filter</div>';
            return;
        }

        const sortedActions = [...actionsList].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        container.innerHTML = sortedActions.map(action => {
            const opportunity = DataStore.getOpportunity(action.opportunityId);
            const dueDate = new Date(action.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0 && !action.completed;
            
            return `
                <div class="action-item ${isOverdue ? 'urgent' : ''} ${action.completed ? 'completed' : ''}">
                    <div>
                        <strong>${action.title}</strong>
                        <div style="font-size: 0.9rem; color: #666;">
                            ${opportunity ? opportunity.name : 'Unknown Opportunity'} • ${action.phase} • Priority: ${action.priority}
                            ${action.description ? `<br><em>${action.description}</em>` : ''}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: ${action.completed ? '#28a745' : isOverdue ? '#dc3545' : '#666'};">
                            ${action.completed ? 'Completed' : isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `Due: ${Utils.formatDate(action.dueDate)}`}
                        </div>
                        <div style="margin-top: 0.3rem; display: flex; gap: 0.3rem; justify-content: flex-end;">
                            ${!action.completed ? `
                                <button class="btn btn-success" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="Actions.markComplete(${action.id})">Complete</button>
                                <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="Actions.edit(${action.id})">Edit</button>
                            ` : ''}
                            <button class="btn btn-warning" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="Actions.delete(${action.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get action statistics
    getStats() {
        const total = DataStore.actions.length;
        const completed = DataStore.actions.filter(a => a.completed).length;
        const pending = total - completed;
        const overdue = DataStore.actions.filter(a => {
            if (a.completed) return false;
            const dueDate = new Date(a.dueDate);
            const today = new Date();
            return dueDate < today;
        }).length;

        return { total, completed, pending, overdue };
    },

    // Export actions to CSV
    exportToCsv() {
        const csvData = DataStore.actions.map(action => {
            const opportunity = DataStore.getOpportunity(action.opportunityId);
            const status = action.completed ? 'Completed' : 'Pending';
            return `"${action.title}","${opportunity ? opportunity.name : 'Unknown'}","${action.phase}","${action.priority}","${action.dueDate}","${status}","${action.description || ''}"`;
        });
        
        const csvContent = ['Title,Opportunity,Phase,Priority,Due Date,Status,Description', ...csvData].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'action_items.csv';
        a.click();
        URL.revokeObjectURL(url);
    },

    // Add this alias for compatibility with existing HTML references
    markActionComplete(actionId) {
        this.markComplete(actionId);
    }
};
