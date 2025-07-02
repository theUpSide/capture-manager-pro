const Templates = {
    render() {
        const container = document.getElementById('templates-grid');
        if (!container) {
            console.error('Templates container not found');
            return;
        }

        // Group templates by category
        const categories = {};
        DataStore.templates.forEach(template => {
            if (!categories[template.category]) {
                categories[template.category] = [];
            }
            categories[template.category].push(template);
        });

        let html = '';
        Object.entries(categories).forEach(([category, templates]) => {
            html += `
                <div class="template-category">
                    <h3 class="category-title">${category}</h3>
                    <div class="template-cards-grid">
                        ${templates.map(template => this.renderTemplateCard(template)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    renderTemplateCard(template) {
        return `
            <div class="template-card">
                <h4>${template.title}</h4>
                <p>${template.description}</p>
                <div class="template-meta">
                    <span class="field-count">${template.fields.length} fields</span>
                    <span class="category-badge">${template.category}</span>
                </div>
                <div class="template-actions">
                    <button class="btn" onclick="Templates.showGuidance(${template.id})">Get Started</button>
                </div>
            </div>
        `;
    },

    showGuidance(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) {
            console.error('Template not found:', templateId);
            return;
        }

        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        const guidance = template.guidance;
        
        content.innerHTML = `
            <div class="template-guidance">
                <h2>${template.title}</h2>
                <p class="template-description">${template.description}</p>
                
                <div class="guidance-section">
                    <h3>🎯 Why This Template Matters</h3>
                    <p class="guidance-text">${guidance.importance}</p>
                </div>
                
                <div class="guidance-section">
                    <h3>🤔 Key Considerations</h3>
                    <ul class="guidance-list">
                        ${guidance.keyConsiderations.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="guidance-section">
                    <h3>📋 Pre-Work Checklist</h3>
                    <ul class="guidance-checklist">
                        ${guidance.prework.map(item => `
                            <li>
                                <label class="checklist-item">
                                    <input type="checkbox"> ${item}
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                ${guidance.workshopGuide ? `
                    <div class="guidance-section">
                        <h3>🏗️ Workshop Facilitation Guide</h3>
                        <div class="workshop-details">
                            <div class="workshop-meta">
                                <span><strong>Duration:</strong> ${guidance.workshopGuide.duration}</span>
                                <span><strong>Participants:</strong> ${guidance.workshopGuide.participants}</span>
                            </div>
                            
                            <h4>Suggested Agenda:</h4>
                            <ol class="agenda-list">
                                ${guidance.workshopGuide.agenda.map(item => `<li>${item}</li>`).join('')}
                            </ol>
                            
                            <div class="facilitation-tip">
                                <h4>💡 Facilitation Tips:</h4>
                                <p>${guidance.workshopGuide.facilitation}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="guidance-section">
                    <h3>📚 Theory & Best Practices</h3>
                    <p class="guidance-text">${guidance.theory}</p>
                </div>
                
                <div class="guidance-cta-section">
                    <div class="cta-content">
                        <h3>Ready to Get Started?</h3>
                        <p>Now that you understand the framework and best practices, click below to open the interactive worksheet and begin documenting your capture strategy.</p>
                    </div>
                    <div class="template-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Not Right Now</button>
                        <button type="button" class="btn btn-large" onclick="Templates.openWorksheet(${template.id})">Open Worksheet</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    },

    openWorksheet(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) {
            console.error('Template not found:', templateId);
            return;
        }

        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        let fieldsHtml = template.fields.map(field => {
            let inputHtml = '';
            switch(field.type) {
                case 'text':
                    inputHtml = `<input type="text" id="field-${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
                    break;
                case 'number':
                    inputHtml = `<input type="number" id="field-${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
                    break;
                case 'date':
                    inputHtml = `<input type="date" id="field-${field.id}" ${field.required ? 'required' : ''}>`;
                    break;
                case 'select':
                    const options = field.options ? field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('') : '';
                    inputHtml = `<select id="field-${field.id}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${options}
                    </select>`;
                    break;
                case 'textarea':
                    inputHtml = `<textarea id="field-${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}" rows="3"></textarea>`;
                    break;
                default:
                    inputHtml = `<input type="text" id="field-${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
            }
            
            return `
                <div class="form-group">
                    <label for="field-${field.id}">
                        ${field.label}
                        ${field.required ? '<span style="color: #dc3545;">*</span>' : ''}
                    </label>
                    ${inputHtml}
                </div>
            `;
        }).join('');

        content.innerHTML = `
            <div class="template-worksheet">
                <div class="worksheet-header">
                    <h2>${template.title} - Worksheet</h2>
                    <p class="template-description">Complete the fields below to document your capture strategy. All required fields must be filled before saving.</p>
                    <button type="button" class="btn btn-secondary btn-small" onclick="Templates.showGuidance(${template.id})">← Back to Guidance</button>
                </div>
                
                <form id="templateForm" onsubmit="Templates.saveTemplateData(event, ${template.id})">
                    <div class="template-fields">
                        ${fieldsHtml}
                    </div>
                    <div class="template-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                        <button type="submit" class="btn">Save Template Data</button>
                    </div>
                </form>
            </div>
        `;
        
        // Keep modal open, just change content
    },

    saveTemplateData(event, templateId) {
        event.preventDefault();
        
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) {
            console.error('Template not found:', templateId);
            return;
        }

        // Collect form data
        const formData = {};
        template.fields.forEach(field => {
            const element = document.getElementById(`field-${field.id}`);
            if (element) {
                formData[field.id] = element.value;
            }
        });

        // Create saved template entry
        const savedTemplate = {
            id: Date.now(),
            templateId: templateId,
            templateTitle: template.title,
            templateCategory: template.category,
            data: formData,
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };

        // Save to DataStore
        if (!DataStore.savedTemplates) {
            DataStore.savedTemplates = [];
        }
        DataStore.savedTemplates.push(savedTemplate);
        DataStore.saveData();

        // Close modal and show success
        this.closeModal();
        alert('Template data saved successfully!');
        
        // Refresh if we're on saved templates view
        if (document.getElementById('saved-templates-view').style.display !== 'none') {
            this.renderSavedTemplates();
        }
    },

    closeModal() {
        document.getElementById('templateDetailModal').style.display = 'none';
    },

    showSavedTemplates() {
        // Hide main templates view
        document.getElementById('templates-view').style.display = 'none';
        
        // Show saved templates view
        document.getElementById('saved-templates-view').style.display = 'block';
        
        // Update navigation
        Navigation.updateActiveNav('Saved Templates');
        
        this.renderSavedTemplates();
    },

    renderSavedTemplates() {
        const container = document.getElementById('saved-templates-grid');
        if (!container) {
            console.error('Saved templates container not found');
            return;
        }

        if (!DataStore.savedTemplates || DataStore.savedTemplates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <h3>No saved templates yet</h3>
                    <p>Use a template to create your first saved entry</p>
                    <button class="btn btn-secondary" onclick="Navigation.showTemplates()">Browse Templates</button>
                </div>
            `;
            return;
        }

        // Group by category
        const categories = {};
        DataStore.savedTemplates.forEach(saved => {
            if (!categories[saved.templateCategory]) {
                categories[saved.templateCategory] = [];
            }
            categories[saved.templateCategory].push(saved);
        });

        let html = '';
        Object.entries(categories).forEach(([category, savedTemplates]) => {
            html += `
                <div class="template-category">
                    <h3 class="category-title">${category}</h3>
                    <div class="template-cards-grid">
                        ${savedTemplates.map(saved => this.renderSavedTemplateCard(saved)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    renderSavedTemplateCard(savedTemplate) {
        const dataCount = Object.keys(savedTemplate.data).length;
        const hasData = Object.values(savedTemplate.data).some(value => value && value.trim !== '');
        
        return `
            <div class="template-card saved-template-card">
                <h4>${savedTemplate.templateTitle}</h4>
                <p class="saved-template-info">
                    Created: ${Utils.formatDate(savedTemplate.createdDate)}<br>
                    Last modified: ${Utils.formatDate(savedTemplate.lastModified)}
                </p>
                <div class="template-meta">
                    <span class="field-count">${dataCount} fields</span>
                    <span class="category-badge">${savedTemplate.templateCategory}</span>
                    ${hasData ? '<span class="data-badge">Has Data</span>' : '<span class="no-data-badge">Empty</span>'}
                </div>
                <div class="template-actions">
                    <button class="btn btn-secondary" onclick="Templates.viewSavedTemplate(${savedTemplate.id})">View/Edit</button>
                    <button class="btn btn-secondary" onclick="Templates.exportSavedTemplate(${savedTemplate.id})">Export</button>
                    <button class="btn btn-secondary" onclick="Templates.deleteSavedTemplate(${savedTemplate.id})" style="color: #dc3545;">Delete</button>
                </div>
            </div>
        `;
    },

    viewSavedTemplate(savedId) {
        const savedTemplate = DataStore.savedTemplates.find(s => s.id === savedId);
        if (!savedTemplate) {
            console.error('Saved template not found:', savedId);
            return;
        }

        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        if (!template) {
            console.error('Original template not found:', savedTemplate.templateId);
            return;
        }

        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        let fieldsHtml = template.fields.map(field => {
            const savedValue = savedTemplate.data[field.id] || '';
            let inputHtml = '';
            
            switch(field.type) {
                case 'text':
                    inputHtml = `<input type="text" id="field-${field.id}" value="${savedValue}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
                    break;
                case 'number':
                    inputHtml = `<input type="number" id="field-${field.id}" value="${savedValue}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
                    break;
                case 'date':
                    inputHtml = `<input type="date" id="field-${field.id}" value="${savedValue}" ${field.required ? 'required' : ''}>`;
                    break;
                case 'select':
                    const options = field.options ? field.options.map(opt => 
                        `<option value="${opt}" ${opt === savedValue ? 'selected' : ''}>${opt}</option>`
                    ).join('') : '';
                    inputHtml = `<select id="field-${field.id}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${options}
                    </select>`;
                    break;
                case 'textarea':
                    inputHtml = `<textarea id="field-${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}" rows="3">${savedValue}</textarea>`;
                    break;
                default:
                    inputHtml = `<input type="text" id="field-${field.id}" value="${savedValue}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
            }
            
            return `
                <div class="form-group">
                    <label for="field-${field.id}">
                        ${field.label}
                        ${field.required ? '<span style="color: #dc3545;">*</span>' : ''}
                    </label>
                    ${inputHtml}
                </div>
            `;
        }).join('');

        content.innerHTML = `
            <h2>${savedTemplate.templateTitle} (Saved)</h2>
            <p class="template-description">Last modified: ${Utils.formatDate(savedTemplate.lastModified)}</p>
            
            <form id="templateForm" onsubmit="Templates.updateSavedTemplate(event, ${savedId})">
                <div class="template-fields">
                    ${fieldsHtml}
                </div>
                <div class="template-form-actions">
                    <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                    <button type="submit" class="btn">Update Template Data</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'block';
    },

    updateSavedTemplate(event, savedId) {
        event.preventDefault();
        
        const savedTemplate = DataStore.savedTemplates.find(s => s.id === savedId);
        if (!savedTemplate) {
            console.error('Saved template not found:', savedId);
            return;
        }

        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        if (!template) {
            console.error('Original template not found:', savedTemplate.templateId);
            return;
        }

        // Collect updated form data
        const formData = {};
        template.fields.forEach(field => {
            const element = document.getElementById(`field-${field.id}`);
            if (element) {
                formData[field.id] = element.value;
            }
        });

        // Update saved template
        savedTemplate.data = formData;
        savedTemplate.lastModified = new Date().toISOString().split('T')[0];

        DataStore.saveData();
        this.closeModal();
        alert('Template data updated successfully!');
        this.renderSavedTemplates();
    },

    exportSavedTemplate(savedId) {
        const savedTemplate = DataStore.savedTemplates.find(s => s.id === savedId);
        if (!savedTemplate) {
            console.error('Saved template not found:', savedId);
            return;
        }

        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        if (!template) {
            console.error('Original template not found:', savedTemplate.templateId);
            return;
        }

        // Create export data
        const exportData = {
            templateTitle: savedTemplate.templateTitle,
            templateCategory: savedTemplate.templateCategory,
            createdDate: savedTemplate.createdDate,
            lastModified: savedTemplate.lastModified,
            fields: template.fields.map(field => ({
                label: field.label,
                value: savedTemplate.data[field.id] || '',
                required: field.required
            }))
        };

        // Export as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${savedTemplate.templateTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${savedTemplate.createdDate}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    deleteSavedTemplate(savedId) {
        if (!confirm('Are you sure you want to delete this saved template?')) {
            return;
        }

        DataStore.savedTemplates = DataStore.savedTemplates.filter(s => s.id !== savedId);
        DataStore.saveData();
        this.renderSavedTemplates();
        alert('Saved template deleted successfully!');
    }
};
