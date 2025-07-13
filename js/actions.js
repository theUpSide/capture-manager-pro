// Complete Actions.js file with all missing functions and fixes
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
                <div class="empty-state">
                    <div>📋</div>
                    <h3>No action items yet</h3>
                    <p>Add your first action item to get started</p>
                    <button class="btn btn-primary" onclick="Actions.openNewModal()" style="margin-top: 1rem;">Add Action Item</button>
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
                <div class="actions-section">
                    <h3 style="color: #dc3545;">🚨 Urgent Actions (${urgentActions.length})</h3>
                    <div class="cards-grid-unified">
                        ${urgentActions.map(action => this.renderActionCard(action, true)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Active actions section
        const regularActions = activeActions.filter(action => !urgentActions.includes(action));
        if (regularActions.length > 0) {
            html += `
                <div class="actions-section">
                    <h3 style="color: #007bff;">📝 Active Actions (${regularActions.length})</h3>
                    <div class="cards-grid-unified">
                        ${regularActions.map(action => this.renderActionCard(action)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Completed actions section (collapsible)
        if (completedActions.length > 0) {
            html += `
                <div class="actions-section">
                    <div class="section-header" style="cursor: pointer;" onclick="Actions.toggleCompleted()">
                        <h3 style="color: #28a745; margin: 0;">✅ Completed Actions (${completedActions.length}) <span id="completed-toggle">▼</span></h3>
                    </div>
                    <div id="completed-actions" class="cards-grid-unified" style="display: none; margin-top: 1rem;">
                        ${completedActions.map(action => this.renderActionCard(action)).join('')}
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    },

    renderActionCard(action, isUrgent = false) {
        const isOverdue = !action.completed && new Date(action.dueDate) < new Date();
        const isDueSoon = !action.completed && !isOverdue && 
            new Date(action.dueDate) <= new Date(Date.now() + 3*24*60*60*1000); // 3 days
        
        const priorityClass = `priority-${action.priority.toLowerCase()}`;
        const statusClass = action.completed ? 'completed' : (isOverdue ? 'overdue' : 'active');
        
        const description = action.description || 'No description provided';
        const truncatedDescription = description.length > 120 ? 
            description.substring(0, 120) + '...' : description;
        
        // Get opportunity name
        const opportunity = DataStore.getOpportunity(action.opportunityId);
        const opportunityName = opportunity ? opportunity.name : 'Unknown Opportunity';
        
        // Format due date
        const dueDate = new Date(action.dueDate);
        const today = new Date();
        const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let dueDateText = '';
        if (action.completed) {
            dueDateText = `Completed on ${action.completedDate || 'Unknown'}`;
        } else if (isOverdue) {
            dueDateText = `${Math.abs(daysUntil)} days overdue`;
        } else if (isDueSoon) {
            dueDateText = `Due in ${daysUntil} days`;
        } else {
            dueDateText = `Due: ${dueDate.toLocaleDateString()}`;
        }

        return `
            <div class="card-unified ${priorityClass} status-${statusClass}">
                <div class="card-header-unified">
                    <h4 class="card-title-unified">${action.title}</h4>
                    <div class="card-meta-unified">
                        <strong>${opportunityName}</strong> • ${action.phase} • Priority: ${action.priority}
                    </div>
                    <div class="card-meta-unified" style="color: ${action.completed ? '#28a745' : isOverdue ? '#dc3545' : '#6c757d'};">
                        ${dueDateText}
                    </div>
                    <div class="card-description-unified">
                        ${truncatedDescription}
                    </div>
                </div>
                <div class="card-footer-unified">
                    <div class="status-badge-unified status-${statusClass}">
                        ${action.completed ? 
                            '<span class="status-badge-unified status-completed">✅ Completed</span>' :
                            isOverdue ? 
                            '<span class="status-badge-unified status-overdue">🔴 Overdue</span>' :
                            '<span class="status-badge-unified status-active">📋 Active</span>'
                        }
                    </div>
                    <div class="card-actions-unified">
                        <button class="btn-card btn-card-secondary btn-card-icon" onclick="Actions.editAction(${action.id})" title="Edit">
                            ✏️
                        </button>
                        ${!action.completed ? `
                            <button class="btn-card btn-card-primary" onclick="Actions.markComplete(${action.id})">
                                Complete
                            </button>
                        ` : `
                            <button class="btn-card btn-card-secondary" onclick="Actions.markIncomplete(${action.id})">
                                Reopen
                            </button>
                        `}
                    </div>
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
        
        // Reset form submission to save mode
        document.getElementById('actionForm').onsubmit = (e) => this.save(e);
        
        modal.style.display = 'block';
    },

    editAction(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) {
            console.error('Action not found:', actionId);
            return;
        }
        
        const modal = document.getElementById('actionModal');
        
        // Populate opportunity dropdown
        const opportunitySelect = document.getElementById('actionOpportunity');
        opportunitySelect.innerHTML = '<option value="">Select Opportunity</option>' +
            DataStore.opportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('');
        
        // Populate form with existing action data
        document.getElementById('actionOpportunity').value = action.opportunityId;
        document.getElementById('actionTitle').value = action.title;
        document.getElementById('actionDueDate').value = action.dueDate;
        document.getElementById('actionPriority').value = action.priority;
        document.getElementById('actionPhase').value = action.phase;
        document.getElementById('actionCategory').value = action.category;
        document.getElementById('actionDescription').value = action.description || '';
        
        // Change form submission to update instead of create
        document.getElementById('actionForm').onsubmit = (e) => this.update(e, actionId);
        
        modal.style.display = 'block';
    },

    update(event, actionId) {
        event.preventDefault();
        
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;
        
        // Update action with form data
        action.opportunityId = document.getElementById('actionOpportunity').value;
        action.title = document.getElementById('actionTitle').value;
        action.dueDate = document.getElementById('actionDueDate').value;
        action.priority = document.getElementById('actionPriority').value;
        action.phase = document.getElementById('actionPhase').value;
        action.category = document.getElementById('actionCategory').value;
        action.description = document.getElementById('actionDescription').value;
        
        DataStore.saveData();
        this.closeModal();
        this.render();
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
    },

    markComplete(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;
        
        action.completed = true;
        action.completedDate = new Date().toISOString().split('T')[0];
        
        DataStore.saveData();
        this.render();
        
        // Refresh dashboard if it's visible
        if (typeof Dashboard !== 'undefined' && Dashboard.render) {
            Dashboard.render();
        }
    },

    markIncomplete(actionId) {
        const action = DataStore.actions.find(a => a.id === actionId);
        if (!action) return;
        
        action.completed = false;
        action.completedDate = null;
        
        DataStore.saveData();
        this.render();
        
        // Refresh dashboard if it's visible
        if (typeof Dashboard !== 'undefined' && Dashboard.render) {
            Dashboard.render();
        }
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
        // Reset form submission to save mode
        document.getElementById('actionForm').onsubmit = (e) => this.save(e);
    }
};