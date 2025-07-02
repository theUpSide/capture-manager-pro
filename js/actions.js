const Actions = {
    render() {
        const container = document.getElementById('all-actions');
        
        if (!container) {
            console.error('Actions container not found');
            return;
        }
        
        console.log('Rendering actions:', DataStore.actions.length);
        
        if (DataStore.actions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                    <h3>No action items yet</h3>
                    <p>Add your first action item to get started</p>
                    <button class="btn" onclick="Actions.openNewModal()" style="margin-top: 1rem;">Add Action Item</button>
                </div>
            `;
            return;
        }
        
        // Group actions by priority and status
        const urgentActions = DataStore.actions.filter(action => 
            !action.completed && (action.priority === 'High' || this.isOverdue(action.dueDate))
        );
        
        const activeActions = DataStore.actions.filter(action => !action.completed);
        const completedActions = DataStore.actions.filter(action => action.completed);
        
        let html = '';
        
        // Urgent actions section
        if (urgentActions.length > 0) {
            html += `
                <div class="actions-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #dc3545; margin-bottom: 1rem;">🚨 Urgent Actions (${urgentActions.length})</h3>
                    <div class="actions-grid">
                        ${urgentActions.map(action => this.renderActionCard(action, true)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Active actions section
        const regularActions = activeActions.filter(action => !urgentActions.includes(action));
        if (regularActions.length > 0) {
            html += `
                <div class="actions-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #007bff; margin-bottom: 1rem;">📝 Active Actions (${regularActions.length})</h3>
                    <div class="actions-grid">
                        ${regularActions.map(action => this.renderActionCard(action)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Completed actions section (collapsible)
        if (completedActions.length > 0) {
            html += `
                <div class="actions-section" style="margin-bottom: 2rem;">
                    <div class="section-header" style="cursor: pointer;" onclick="Actions.toggleCompleted()">
                        <h3 style="color: #28a745; margin: 0;">✅ Completed Actions (${completedActions.length}) <span id="completed-toggle">▼</span></h3>
                    </div>
                    <div id="completed-actions" class="actions-grid" style="display: none; margin-top: 1rem;">
                        ${completedActions.map(action => this.renderActionCard(action)).join('')}
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    },

    renderActionCard(action, isUrgent = false) {
        const opportunity = DataStore.opportunities.find(opp => opp.id == action.opportunityId);
        const oppName = opportunity ? opportunity.name : 'Unknown Opportunity';
        const isOverdue = this.isOverdue(action.dueDate);
        const daysUntil = Utils.getDaysUntil(action.dueDate);
        
        let priorityColor = '#6c757d';
        if (action.priority === 'High') priorityColor = '#dc3545';
        else if (action.priority === 'Medium') priorityColor = '#ffc107';
        else if (action.priority === 'Low') priorityColor = '#28a745';
        
        return `
            <div class="action-card ${isUrgent ? 'urgent' : ''} ${action.completed ? 'completed' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <h4 style="margin: 0; flex: 1;">${action.title}</h4>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="background: ${priorityColor}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">
                            ${action.priority}
                        </span>
                        ${action.completed ? '<span style="background: #28a745; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">✅ Done</span>' : ''}
                    </div>
                </div>
                
                <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">${oppName}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem;">
                    <div><strong>Due Date:</strong> ${Utils.formatDate(action.dueDate)}</div>
                    <div style="color: ${isOverdue ? '#dc3545' : daysUntil <= 3 ? '#ffc107' : '#666'};">
                        <strong>Status:</strong> ${isOverdue ? 'Overdue' : daysUntil <= 0 ? 'Due Today' : `${daysUntil} days left`}
                    </div>
                    <div><strong>Phase:</strong> ${action.phase || 'N/A'}</div>
                    <div><strong>Category:</strong> ${action.category || 'N/A'}</div>
                </div>
                
                ${action.description ? `<p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${action.description}</p>` : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Actions.edit(${action.id})">
                            Edit
                        </button>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Actions.delete(${action.id})">
                            Delete
                        </button>
                    </div>
                    <button class="btn ${action.completed ? 'btn-secondary' : ''}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Actions.toggleComplete(${action.id})">
                        ${action.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    },

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    },

    toggleCompleted() {
        const section = document.getElementById('completed-actions');
        const toggle = document.getElementById('completed-toggle');
        
        if (section.style.display === 'none') {
            section.style.display = 'grid';
            toggle.textContent = '▲';
        } else {
            section.style.display = 'none';
            toggle.textContent = '▼';
        }
    },

    openNewModal() {
        const modal = document.getElementById('actionModal');
        
        // Populate opportunity dropdown
        const opportunitySelect = document.getElementById('actionOpportunity');
        opportunitySelect.innerHTML = '<option value="">Select Opportunity</option>' +
            DataStore.opportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('');
        
        // Clear form
        document.getElementById('actionForm').reset();
        
        modal.style.display = 'block';
    },

    save(event) {
        event.preventDefault();
        
        const newAction = {
            id: Date.now(),
            opportunityId: document.getElementById('actionOpportunity').value,
            title: document.getElementById('actionTitle').value,
            dueDate: document.getElementById('actionDueDate').value,
            priority: document.getElementById('actionPriority').value,
            phase: document.getElementById('actionPhase').value,
            category: document.getElementById('actionCategory').value,
            description: document.getElementById('actionDescription').value,
            completed: false,
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        DataStore.actions.push(newAction);
        DataStore.saveData();
        this.closeModal();
        this.render();
        
        alert('Action item added successfully!');
    },

    edit(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;
        
        const modal = document.getElementById('actionModal');
        
        // Populate form with existing data
        document.getElementById('actionTitle').value = action.title;
        document.getElementById('actionDueDate').value = action.dueDate;
        document.getElementById('actionPriority').value = action.priority;
        document.getElementById('actionPhase').value = action.phase;
        document.getElementById('actionCategory').value = action.category || '';
        document.getElementById('actionDescription').value = action.description || '';
        
        // Populate opportunity dropdown
        const opportunitySelect = document.getElementById('actionOpportunity');
        opportunitySelect.innerHTML = '<option value="">Select Opportunity</option>' +
            DataStore.opportunities.map(opp => `<option value="${opp.id}" ${opp.id == action.opportunityId ? 'selected' : ''}>${opp.name}</option>`).join('');
        
        // Change form submission to update
        const form = document.getElementById('actionForm');
        form.onsubmit = (e) => this.update(e, actionId);
        
        modal.style.display = 'block';
    },

    update(event, actionId) {
        event.preventDefault();
        
        const actionIndex = DataStore.actions.findIndex(a => a.id === actionId);
        if (actionIndex === -1) return;
        
        DataStore.actions[actionIndex] = {
            ...DataStore.actions[actionIndex],
            opportunityId: document.getElementById('actionOpportunity').value,
            title: document.getElementById('actionTitle').value,
            dueDate: document.getElementById('actionDueDate').value,
            priority: document.getElementById('actionPriority').value,
            phase: document.getElementById('actionPhase').value,
            category: document.getElementById('actionCategory').value,
            description: document.getElementById('actionDescription').value,
            lastModified: new Date().toISOString().split('T')[0]
        };
        
        DataStore.saveData();
        this.closeModal();
        this.render();
        
        // Reset form submission
        document.getElementById('actionForm').onsubmit = (e) => this.save(e);
        
        alert('Action item updated successfully!');
    },

    toggleComplete(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;
        
        action.completed = !action.completed;
        action.completedDate = action.completed ? new Date().toISOString().split('T')[0] : null;
        
        DataStore.saveData();
        this.render();
    },

    delete(actionId) {
        if (!confirm('Are you sure you want to delete this action item?')) return;
        
        DataStore.actions = DataStore.actions.filter(a => a.id !== actionId);
        DataStore.saveData();
        this.render();
    },

    closeModal() {
        document.getElementById('actionModal').style.display = 'none';
        // Reset form submission
        document.getElementById('actionForm').onsubmit = (e) => this.save(e);
    }
};
