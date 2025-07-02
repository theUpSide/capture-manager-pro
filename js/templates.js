const Templates = {
    render() {
        const container = document.getElementById('templates-grid');
        
        // Ensure savedTemplates is properly loaded
        if (!DataStore.savedTemplates) {
            DataStore.savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
        }
        
        container.innerHTML = DataStore.templates.map(template => this.renderTemplateCard(template)).join('') + `
            <div class="template-card" style="border: 2px dashed #ddd; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: #666;">
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                    <h4>Saved Templates</h4>
                    <p>View your completed templates</p>
                </div>
                <button class="btn" onclick="Templates.showSaved()">
                    View Saved (${DataStore.savedTemplates.length})
                </button>
            </div>
        `;
    },

    renderTemplateCard(template) {
        const categoryClass = template.category ? template.category.toLowerCase() : 'planning';
        const categoryDisplay = template.category || 'Planning';
        
        return `
            <div class="template-card" data-category="${categoryClass}">
                <div class="template-category ${categoryClass}">${categoryDisplay}</div>
                <h4>${template.title}</h4>
                <p>${template.description}</p>
                <div class="template-actions">
                    <button class="btn" onclick="Templates.useTemplate('${template.id}')">
                        Use Template
                    </button>
                    <button class="btn btn-secondary" onclick="Templates.viewTemplate('${template.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `;
    },

    use(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Generate form HTML
        const formHTML = `
            <h2>${template.title}</h2>
            <p style="color: #666; margin-bottom: 2rem;">${template.description}</p>
            
            <form id="templateForm" onsubmit="Templates.saveForm(event, ${templateId})">
                <div class="form-group">
                    <label for="template_title">Template Title *</label>
                    <input type="text" id="template_title" value="${template.title} - ${new Date().toLocaleDateString()}" required>
                </div>
                
                <div class="form-group">
                    <label for="template_opportunity">Related Opportunity (Optional)</label>
                    <select id="template_opportunity">
                        <option value="">Select Opportunity</option>
                        ${DataStore.opportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('')}
                    </select>
                </div>
                
                <hr style="margin: 2rem 0;">
                
                ${template.fields.map(field => this.generateFormField(field)).join('')}
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                    <button type="submit" class="btn">Save Template</button>
                </div>
            </form>
        `;
        
        content.innerHTML = formHTML;
        modal.style.display = 'block';
    },

    generateFormField(field) {
        const required = field.required ? 'required' : '';
        const fieldId = `field_${field.id}`;
        
        switch (field.type) {
            case 'text':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="text" id="${fieldId}" name="${field.id}" ${required}>
                    </div>
                `;
            case 'number':
                const min = field.min !== undefined ? `min="${field.min}"` : '';
                const max = field.max !== undefined ? `max="${field.max}"` : '';
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="number" id="${fieldId}" name="${field.id}" value="${field.defaultValue}" ${min} ${max} ${required}>
                    </div>
                `;
            case 'date':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="date" id="${fieldId}" name="${field.id}" ${required}>
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <textarea id="${fieldId}" name="${field.id}" rows="4" ${required}>${field.defaultValue || ''}</textarea>
                    </div>
                `;
            case 'select':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <select id="${fieldId}" name="${field.id}" ${required}>
                            <option value="">Select an option</option>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>
                `;
            default:
                return '';
        }
    },

    saveForm(event, templateId) {
        event.preventDefault();
        
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const formData = new FormData(event.target);
        const savedTemplate = {
            id: Date.now(),
            templateId: templateId,
            title: document.getElementById('template_title').value,
            opportunityId: document.getElementById('template_opportunity').value || null,
            opportunityName: document.getElementById('template_opportunity').value ? 
                DataStore.opportunities.find(o => o.id == document.getElementById('template_opportunity').value)?.name : null,
            savedDate: new Date().toISOString().split('T')[0],
            data: {}
        };
        
        // Collect all form data
        template.fields.forEach(field => {
            const value = formData.get(field.id);
            savedTemplate.data[field.id] = value || '';
        });
        
        DataStore.savedTemplates.push(savedTemplate);
        localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));
        
        this.closeModal();
        alert('Template saved successfully!');
        
        // Refresh templates view
        this.render();
    },

    showSaved() {
        Navigation.hideAllViews();
        document.getElementById('saved-templates-view').style.display = 'block';
        Navigation.updateActiveNav('Templates');
        this.renderSaved();
    },

    renderSaved() {
        const container = document.getElementById('saved-templates-grid');
        
        if (DataStore.savedTemplates.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                    <h3>No saved templates yet</h3>
                    <p>Fill out some templates to see them here</p>
                    <button class="btn" onclick="Templates.render(); Navigation.showTemplates()" style="margin-top: 1rem;">Browse Templates</button>
                </div>
            `;
            return;
        }

        container.innerHTML = DataStore.savedTemplates.map(saved => {
            const template = DataStore.templates.find(t => t.id === saved.templateId);
            return `
                <div class="template-card">
                    <h4>${saved.title}</h4>
                    <p style="color: #666; font-size: 0.9rem;">${template ? template.title : 'Unknown Template'}</p>
                    <div style="margin: 0.5rem 0; font-size: 0.8rem; color: #999;">
                        Saved: ${Utils.formatDate(saved.savedDate)}
                        ${saved.lastModified ? ` • Last Modified: ${Utils.formatDate(saved.lastModified)}` : ''}
                        ${saved.opportunityName ? ` • ${saved.opportunityName}` : ''}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                        <span style="background: #e8f5e9; color: #2e7d2e; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">
                            Completed
                        </span>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Templates.view(${saved.id})">
                                View
                            </button>
                            <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Templates.editSaved(${saved.id})">
                                Edit
                            </button>
                            <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Templates.downloadSaved(${saved.id})">
                                Export
                            </button>
                            <button class="btn btn-warning" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="Templates.deleteSaved(${saved.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    view(savedId) {
        const saved = DataStore.savedTemplates.find(s => s.id === savedId);
        const template = DataStore.templates.find(t => t.id === saved.templateId);
        
        if (!saved || !template) return;
        
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Generate read-only view
        const viewHTML = `
            <h2>${saved.title}</h2>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <strong>Template:</strong> ${template.title}<br>
                <strong>Saved:</strong> ${Utils.formatDate(saved.savedDate)}<br>
                ${saved.lastModified ? `<strong>Last Modified:</strong> ${Utils.formatDate(saved.lastModified)}<br>` : ''}
                ${saved.opportunityName ? `<strong>Opportunity:</strong> ${saved.opportunityName}<br>` : ''}
            </div>
            
            <div style="max-height: 60vh; overflow-y: auto;">
                ${template.fields.map(field => {
                    const value = saved.data[field.id] || 'Not provided';
                    return `
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                            <h4 style="color: #333; margin-bottom: 0.5rem;">${field.label}</h4>
                            <div style="background: #f8f9fa; padding: 0.8rem; border-radius: 4px; white-space: pre-wrap;">${value}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="Templates.closeModal()">Close</button>
                <button class="btn" onclick="Templates.editSaved(${savedId})">Edit</button>
                <button class="btn btn-secondary" onclick="Templates.downloadSaved(${savedId})">Export</button>
            </div>
        `;
        
        content.innerHTML = viewHTML;
        modal.style.display = 'block';
    },

    editSaved(savedId) {
        const saved = DataStore.savedTemplates.find(s => s.id === savedId);
        const template = DataStore.templates.find(t => t.id === saved.templateId);
        
        if (!saved || !template) return;
        
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Generate editable form HTML with existing data
        const formHTML = `
            <h2>Edit: ${saved.title}</h2>
            <p style="color: #666; margin-bottom: 2rem;">Based on: ${template.title}</p>
            
            <form id="templateForm" onsubmit="Templates.updateSaved(event, ${savedId})">
                <div class="form-group">
                    <label for="template_title">Template Title *</label>
                    <input type="text" id="template_title" value="${saved.title}" required>
                </div>
                
                <div class="form-group">
                    <label for="template_opportunity">Related Opportunity (Optional)</label>
                    <select id="template_opportunity">
                        <option value="">Select Opportunity</option>
                        ${DataStore.opportunities.map(opp => `
                            <option value="${opp.id}" ${saved.opportunityId == opp.id ? 'selected' : ''}>
                                ${opp.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <hr style="margin: 2rem 0;">
                
                ${template.fields.map(field => this.generateEditableFormField(field, saved.data[field.id] || '')).join('')}
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                    <button type="submit" class="btn">Update Template</button>
                </div>
            </form>
        `;
        
        content.innerHTML = formHTML;
        modal.style.display = 'block';
    },

    generateEditableFormField(field, existingValue) {
        const required = field.required ? 'required' : '';
        const fieldId = `field_${field.id}`;
        
        switch (field.type) {
            case 'text':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="text" id="${fieldId}" name="${field.id}" value="${existingValue}" ${required}>
                    </div>
                `;
            case 'number':
                const min = field.min !== undefined ? `min="${field.min}"` : '';
                const max = field.max !== undefined ? `max="${field.max}"` : '';
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="number" id="${fieldId}" name="${field.id}" value="${existingValue}" ${min} ${max} ${required}>
                    </div>
                `;
            case 'date':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="date" id="${fieldId}" name="${field.id}" value="${existingValue}" ${required}>
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <textarea id="${fieldId}" name="${field.id}" rows="4" ${required}>${existingValue}</textarea>
                    </div>
                `;
            case 'select':
                return `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label} ${field.required ? '*' : ''}</label>
                        <select id="${fieldId}" name="${field.id}" ${required}>
                            <option value="">Select an option</option>
                            ${field.options.map(option => `
                                <option value="${option}" ${existingValue === option ? 'selected' : ''}>${option}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            default:
                return '';
        }
    },

    updateSaved(event, savedId) {
        event.preventDefault();
        
        const savedIndex = DataStore.savedTemplates.findIndex(s => s.id === savedId);
        if (savedIndex === -1) return;
        
        const saved = DataStore.savedTemplates[savedIndex];
        const template = DataStore.templates.find(t => t.id === saved.templateId);
        if (!template) return;
        
        const formData = new FormData(event.target);
        
        // Update the saved template
        saved.title = document.getElementById('template_title').value;
        saved.opportunityId = document.getElementById('template_opportunity').value || null;
        saved.opportunityName = document.getElementById('template_opportunity').value ? 
            DataStore.opportunities.find(o => o.id == document.getElementById('template_opportunity').value)?.name : null;
        saved.lastModified = new Date().toISOString().split('T')[0];
        
        // Update all form data
        template.fields.forEach(field => {
            const value = formData.get(field.id);
            saved.data[field.id] = value || '';
        });
        
        // Save back to localStorage
        localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));
        
        this.closeModal();
        alert('Template updated successfully!');
        
        // Refresh the saved templates view
        if (document.getElementById('saved-templates-view').style.display !== 'none') {
            this.renderSaved();
        }
    },

    download(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;
        
        // Create a simple text template
        const content = `${template.title}\n${'='.repeat(template.title.length)}\n\n${template.description}\n\n` +
            template.fields.map(field => `${field.label}:\n${field.required ? '(Required)' : '(Optional)'}\n\n\n`).join('');
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.title.replace(/\s+/g, '_')}_template.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    downloadSaved(savedId) {
        const saved = DataStore.savedTemplates.find(s => s.id === savedId);
        const template = DataStore.templates.find(t => t.id === saved.templateId);
        
        if (!saved || !template) return;
        
        const content = `${saved.title}\n${'='.repeat(saved.title.length)}\n\n` +
            `Template: ${template.title}\n` +
            `Saved: ${Utils.formatDate(saved.savedDate)}\n` +
            `${saved.opportunityName ? `Opportunity: ${saved.opportunityName}\n` : ''}\n` +
            template.fields.map(field => {
                const value = saved.data[field.id] || 'Not provided';
                return `${field.label}:\n${value}\n`;
            }).join('\n');
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${saved.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    },

    deleteSaved(savedId) {
        if (!confirm('Are you sure you want to delete this saved template?')) return;
        
        DataStore.savedTemplates = DataStore.savedTemplates.filter(s => s.id !== savedId);
        localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));
        this.renderSaved();
    },

    closeModal() {
        document.getElementById('templateDetailModal').style.display = 'none';
    },

    showTemplates() {
        Navigation.hideAllViews();
        document.getElementById('templates-view').style.display = 'block';
        Navigation.updateActiveNav('Templates');
        this.render();
    },

    clearAllSaved() {
        if (!confirm('Are you sure you want to delete ALL saved templates?')) return;
        
        DataStore.savedTemplates = [];
        localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));
        this.renderSaved();
    },

    openNewModal() {
        alert('Add Template functionality coming soon!');
    },

    useTemplate(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Generate form HTML
        const formHTML = `
            <h2>${template.title}</h2>
            <p style="color: #666; margin-bottom: 2rem;">${template.description}</p>
            
            <form id="templateForm" onsubmit="Templates.saveForm(event, ${templateId})">
                <div class="form-group">
                    <label for="template_title">Template Title *</label>
                    <input type="text" id="template_title" value="${template.title} - ${new Date().toLocaleDateString()}" required>
                </div>
                
                <div class="form-group">
                    <label for="template_opportunity">Related Opportunity (Optional)</label>
                    <select id="template_opportunity">
                        <option value="">Select Opportunity</option>
                        ${DataStore.opportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('')}
                    </select>
                </div>
                
                <hr style="margin: 2rem 0;">
                
                ${template.fields.map(field => this.generateFormField(field)).join('')}
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                    <button type="submit" class="btn">Save Template</button>
                </div>
            </form>
        `;
        
        content.innerHTML = formHTML;
        modal.style.display = 'block';
    },

    viewTemplate(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Generate read-only view
        const viewHTML = `
            <h2>${template.title}</h2>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <strong>Category:</strong> ${template.category}<br>
                <strong>Description:</strong> ${template.description}<br>
            </div>
            
            <div style="max-height: 60vh; overflow-y: auto;">
                ${template.fields.map(field => {
                    return `
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                            <h4 style="color: #333; margin-bottom: 0.5rem;">${field.label}</h4>
                            <div style="background: #f8f9fa; padding: 0.8rem; border-radius: 4px; white-space: pre-wrap;">${field.type}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="Templates.closeModal()">Close</button>
                <button class="btn" onclick="Templates.useTemplate('${templateId}')">Use Template</button>
            </div>
        `;
        
        content.innerHTML = viewHTML;
        modal.style.display = 'block';
    },
};
