const Templates = {
    render() {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        let html = `
            <!-- Saved Templates Section -->
            <div class="saved-templates-section">
                <div class="saved-templates-header" onclick="Templates.toggleSavedTemplates()">
                    <div class="saved-templates-title">
                        <span class="collapse-icon" id="saved-templates-icon">▼</span>
                        <h3>📋 Saved Templates</h3>
                    </div>
                    <span class="saved-count">${this.getSavedTemplatesCount()} saved</span>
                </div>
                <div class="saved-templates-content" id="saved-templates-content">
                    ${this.renderSavedTemplates()}
                </div>
            </div>

            <!-- Available Templates Section -->
            <div class="available-templates-section">
                <h3 style="color: #2a5298; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e9ecef;">
                    📚 Available Templates
                </h3>
                ${this.renderTemplatesByCategory()}
            </div>
        `;

        container.innerHTML = html;
    },

    getSavedTemplatesCount() {
        const activeOpportunityIds = DataStore.opportunities
            .filter(opp => !opp.status || opp.status === 'capture' || opp.status === 'pursuing')
            .map(opp => opp.id);
        
        return DataStore.savedTemplates.filter(template => 
            activeOpportunityIds.includes(parseInt(template.opportunityId))
        ).length;
    },

    toggleSavedTemplates() {
        const content = document.getElementById('saved-templates-content');
        const icon = document.getElementById('saved-templates-icon');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            icon.textContent = '▶';
        }
    },

    renderSavedTemplates() {
        const activeOpportunityIds = DataStore.opportunities
            .filter(opp => !opp.status || opp.status === 'capture' || opp.status === 'pursuing')
            .map(opp => opp.id);
        
        const activeSavedTemplates = DataStore.savedTemplates.filter(template => 
            activeOpportunityIds.includes(parseInt(template.opportunityId))
        );

        if (activeSavedTemplates.length === 0) {
            return `
                <div class="no-saved-templates">
                    <p>No saved templates yet. Fill out a template below to get started.</p>
                </div>
            `;
        }

        // Sort by project name alphabetically, with in-progress templates first
        const sortedTemplates = activeSavedTemplates.sort((a, b) => {
            // In-progress templates first
            if (a.status === 'in-progress' && b.status !== 'in-progress') return -1;
            if (b.status === 'in-progress' && a.status !== 'in-progress') return 1;
            
            // Then alphabetical by project name
            const aOpportunity = DataStore.opportunities.find(opp => opp.id == a.opportunityId);
            const bOpportunity = DataStore.opportunities.find(opp => opp.id == b.opportunityId);
            const aName = aOpportunity ? aOpportunity.name : 'Unknown';
            const bName = bOpportunity ? bOpportunity.name : 'Unknown';
            
            return aName.localeCompare(bName);
        });

        return `
            <div class="saved-templates-list">
                ${sortedTemplates.map(template => this.renderSavedTemplateRibbon(template)).join('')}
            </div>
        `;
    },

    renderSavedTemplateRibbon(savedTemplate) {
        const opportunity = DataStore.opportunities.find(opp => opp.id == savedTemplate.opportunityId);
        const templateDef = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        const opportunityName = opportunity ? opportunity.name : 'Unknown Opportunity';
        const templateTitle = templateDef ? templateDef.title : 'Unknown Template';
        
        const statusIcon = savedTemplate.status === 'in-progress' ? '🔄' : '✅';
        const statusLabel = savedTemplate.status === 'in-progress' ? 'In Progress' : 'Completed';
        const statusClass = savedTemplate.status === 'in-progress' ? 'in-progress' : 'completed';

        return `
            <div class="saved-template-ribbon ${statusClass}">
                <div class="ribbon-main-content">
                    <div class="ribbon-info">
                        <div class="ribbon-title">
                            <strong>${opportunityName}</strong>
                            <span class="template-type">• ${templateTitle}</span>
                        </div>
                        <div class="ribbon-meta">
                            <span class="employee-name">👤 ${savedTemplate.data.employee_name || 'No name'}</span>
                            <span class="save-date">📅 ${Utils.formatDate(savedTemplate.savedDate)}</span>
                            <span class="template-status ${statusClass}">
                                ${statusIcon} ${statusLabel}
                            </span>
                        </div>
                    </div>
                    <div class="ribbon-actions">
                        <button class="btn btn-small btn-secondary" onclick="Templates.editSavedTemplate(${savedTemplate.id})">
                            ${savedTemplate.status === 'in-progress' ? 'Continue' : 'Edit'}
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="Templates.exportSavedTemplate(${savedTemplate.id})">
                            Export
                        </button>
                        <button class="btn btn-small" onclick="Templates.deleteSavedTemplate(${savedTemplate.id})" style="background: #dc3545;">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderTemplatesByCategory() {
        // Define the roadmap phase order and display information
        const phaseOrder = [
            {
                key: 'identification',
                title: '🔍 Opportunity Identification',
                description: 'Discover and initially assess opportunities'
            },
            {
                key: 'qualification',
                title: '⚖️ Opportunity Qualification',
                description: 'Formal bid/no-bid decision process'
            },
            {
                key: 'planning',
                title: '📋 Capture Planning',
                description: 'Develop comprehensive capture strategy'
            },
            {
                key: 'engagement',
                title: '🤝 Customer Engagement',
                description: 'Build relationships and shape opportunity'
            },
            {
                key: 'intelligence',
                title: '🔎 Competitive Intelligence',
                description: 'Analyze competition and refine strategy'
            },
            {
                key: 'preparation',
                title: '🎯 Pre-RFP Preparation',
                description: 'Final preparations before RFP release'
            }
        ];

        // Group templates by category
        const templatesByCategory = {};
        DataStore.templates.forEach(template => {
            const category = template.category;
            if (!templatesByCategory[category]) {
                templatesByCategory[category] = [];
            }
            templatesByCategory[category].push(template);
        });

        // Render in phase order
        return phaseOrder.map(phase => {
            const templates = templatesByCategory[phase.key] || [];
            if (templates.length === 0) return '';

            return `
                <div class="template-phase-section" data-phase="${phase.key}">
                    <div class="phase-panel">
                        <div class="phase-header">
                            <h3 class="phase-title">${phase.title}</h3>
                            <p class="phase-description">${phase.description}</p>
                            <div class="template-count">${templates.length} template${templates.length !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="template-cards-grid">
                            ${templates.map(template => this.renderTemplateCard(template)).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderTemplateCard(template) {
        const savedCount = DataStore.savedTemplates.filter(st => st.templateId === template.id).length;
        
        return `
            <div class="template-card">
                <h4>${template.title}</h4>
                <p>${template.description}</p>
                <div class="template-meta">
                    <span class="field-count">${template.fields.length} fields</span>
                    <span class="category-badge">${template.category}</span>
                    ${savedCount > 0 ? `<span class="data-badge">${savedCount} saved</span>` : '<span class="no-data-badge">No data</span>'}
                </div>
                <div class="template-actions">
                    <button class="btn" onclick="Templates.openTemplate(${template.id})">
                        ${template.guidance ? '📖 Use Template' : 'Use Template'}
                    </button>
                </div>
            </div>
        `;
    },

    openTemplate(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;

        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        // Get active opportunities for dropdown
        const activeOpportunities = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing'
        );

        let html = `
            <div class="worksheet-header">
                <h2>${template.title}</h2>
                <p class="template-description">${template.description}</p>
                ${template.guidance ? `<button class="btn btn-small btn-secondary" onclick="Templates.showGuidance(${templateId})">📖 View Guidance</button>` : ''}
            </div>
            
            <div class="template-worksheet">
                <form id="templateForm" onsubmit="Templates.saveTemplate(event, ${templateId})">
                    <!-- Required fields first -->
                    <div class="form-group">
                        <label for="template_opportunity">Opportunity *</label>
                        <select id="template_opportunity" required>
                            <option value="">Select Opportunity</option>
                            ${activeOpportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="template_employee_name">Employee Name *</label>
                        <input type="text" id="template_employee_name" required placeholder="Enter your name">
                    </div>
                    
                    <!-- Template-specific fields -->
                    ${template.fields.map(field => `
                        <div class="form-group">
                            <label for="template_${field.id}">${field.label}</label>
                            ${this.renderFormField(field)}
                        </div>
                    `).join('')}
                    
                    <div class="template-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                        <button type="button" class="btn btn-secondary" onclick="Templates.saveInProgress(${templateId})">💾 Save Progress</button>
                        <button type="submit" class="btn">✅ Save & Complete</button>
                    </div>
                </form>
            </div>
        `;

        content.innerHTML = html;
        modal.style.display = 'block';
    },

    renderFormField(field) {
        switch (field.type) {
            case 'select':
                return `
                    <select id="template_${field.id}">
                        <option value="">Select...</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;
            case 'textarea':
                return `<textarea id="template_${field.id}" placeholder="${field.label}"></textarea>`;
            case 'number':
                return `<input type="number" id="template_${field.id}" placeholder="Enter number">`;
            case 'date':
                return `<input type="date" id="template_${field.id}">`;
            default:
                return `<input type="text" id="template_${field.id}" placeholder="${field.label}">`;
        }
    },

    saveInProgress(templateId) {
        this.saveTemplateData(templateId, 'in-progress');
    },

    saveTemplate(event, templateId) {
        event.preventDefault();
        this.saveTemplateData(templateId, 'completed');
    },

    saveTemplateData(templateId, status) {
        const template = DataStore.templates.find(t => t.id === templateId);
        const opportunityId = document.getElementById('template_opportunity').value;
        const employeeName = document.getElementById('template_employee_name').value;

        if (!opportunityId || !employeeName) {
            alert('Please select an opportunity and enter your name.');
            return;
        }

        // Collect all form data
        const data = {
            opportunity_id: opportunityId,
            employee_name: employeeName
        };

        template.fields.forEach(field => {
            const element = document.getElementById(`template_${field.id}`);
            if (element) {
                data[field.id] = element.value;
            }
        });

        // Create saved template record
        const savedTemplate = {
            id: Date.now(),
            templateId: templateId,
            opportunityId: opportunityId,
            data: data,
            status: status,
            savedDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };

        DataStore.savedTemplates.push(savedTemplate);
        DataStore.saveData();
        this.closeModal();
        this.render();
    },

    editSavedTemplate(savedTemplateId) {
        const savedTemplate = DataStore.savedTemplates.find(st => st.id === savedTemplateId);
        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        
        if (!savedTemplate || !template) return;

        this.openTemplate(template.id);
        
        // Populate form with saved data
        setTimeout(() => {
            document.getElementById('template_opportunity').value = savedTemplate.opportunityId;
            document.getElementById('template_employee_name').value = savedTemplate.data.employee_name || '';
            
            template.fields.forEach(field => {
                const element = document.getElementById(`template_${field.id}`);
                if (element && savedTemplate.data[field.id]) {
                    element.value = savedTemplate.data[field.id];
                }
            });
            
            // Update form submission to update existing record
            const form = document.getElementById('templateForm');
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateSavedTemplate(savedTemplateId, 'completed');
            };
            
            // Update save progress button
            const saveProgressBtn = form.querySelector('button[onclick*="saveInProgress"]');
            if (saveProgressBtn) {
                saveProgressBtn.onclick = () => this.updateSavedTemplate(savedTemplateId, 'in-progress');
            }
        }, 100);
    },

    updateSavedTemplate(savedTemplateId, status) {
        const savedTemplate = DataStore.savedTemplates.find(st => st.id === savedTemplateId);
        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        
        const opportunityId = document.getElementById('template_opportunity').value;
        const employeeName = document.getElementById('template_employee_name').value;

        if (!opportunityId || !employeeName) {
            alert('Please select an opportunity and enter your name.');
            return;
        }

        // Update saved data
        savedTemplate.data.opportunity_id = opportunityId;
        savedTemplate.data.employee_name = employeeName;
        savedTemplate.opportunityId = opportunityId;
        savedTemplate.status = status;
        savedTemplate.lastModified = new Date().toISOString().split('T')[0];

        template.fields.forEach(field => {
            const element = document.getElementById(`template_${field.id}`);
            if (element) {
                savedTemplate.data[field.id] = element.value;
            }
        });

        DataStore.saveData();
        this.closeModal();
        this.render();
    },

    exportSavedTemplate(savedTemplateId) {
        const savedTemplate = DataStore.savedTemplates.find(st => st.id === savedTemplateId);
        const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
        const opportunity = DataStore.opportunities.find(opp => opp.id == savedTemplate.opportunityId);
        
        if (!savedTemplate || !template) return;

        const exportData = {
            templateTitle: template.title,
            opportunityName: opportunity ? opportunity.name : 'Unknown',
            employeeName: savedTemplate.data.employee_name,
            savedDate: savedTemplate.savedDate,
            status: savedTemplate.status,
            data: savedTemplate.data
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.title.replace(/[^a-z0-9]/gi, '_')}_${opportunity ? opportunity.name.replace(/[^a-z0-9]/gi, '_') : 'export'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    deleteSavedTemplate(savedTemplateId) {
        if (!confirm('Are you sure you want to delete this saved template?')) return;
        
        DataStore.savedTemplates = DataStore.savedTemplates.filter(st => st.id !== savedTemplateId);
        DataStore.saveData();
        this.render();
    },

    showGuidance(templateId) {
        // Existing guidance functionality
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template || !template.guidance) return;

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
                        <button type="button" class="btn btn-large" onclick="Templates.openTemplate(${template.id})">Open Template</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    },

    closeModal() {
        const modal = document.getElementById('templateDetailModal');
        if (modal) {
            modal.style.display = 'none';
            modal.replaceWith(modal.cloneNode(true)); // Remove event listeners
        }
    },

    saveForm() {
        // ... existing save logic ...

        DataStore.saveData();
        this.closeModal();
        this.render();

        // Removed alert popup for successful save
        // alert('Template saved successfully!');
    },

    updateForm() {
        // ... existing update logic ...

        DataStore.saveData();
        this.closeModal();
        this.render();

        // Removed alert popup for successful update
        // alert('Template updated successfully!');
    },

    openNewForm(templateId, opportunityId) {
        // Find the template definition
        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            alert('Template not found.');
            return;
        }

        // Prepare modal and form content for new form based on template
        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');

        // Store current opportunityId and templateId for saving later
        this.currentOpportunityId = opportunityId;
        this.currentTemplateId = templateId;

        // Build form HTML dynamically based on template.fields
        let formHtml = `<h2>New Form: ${template.title}</h2>`;
        formHtml += `<form id="templateForm" onsubmit="Templates.saveNewForm(event)">`;

        template.fields.forEach(field => {
            formHtml += `<div class="form-group">`;
            formHtml += `<label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>`;

            if (field.type === 'textarea') {
                formHtml += `<textarea id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} placeholder="${field.label}"></textarea>`;
            } else if (field.type === 'select') {
                formHtml += `<select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`;
                field.options.forEach(option => {
                    formHtml += `<option value="${option}">${option}</option>`;
                });
                formHtml += `</select>`;
            } else {
                formHtml += `<input type="${field.type}" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`;
            }

            formHtml += `</div>`;
        });

        formHtml += `<button type="submit" class="btn">Save</button>`;
        formHtml += `</form>`;

        content.innerHTML = formHtml;
        modal.style.display = 'block';
    },

    saveNewForm(event) {
        event.preventDefault();

        const form = document.getElementById('templateForm');
        if (!form) return;

        // Collect form data
        const formData = {};
        Array.from(form.elements).forEach(el => {
            if (el.name) {
                formData[el.name] = el.value;
            }
        });

        // Create new saved template entry
        const newSavedTemplate = {
            id: Date.now(),
            opportunityId: this.currentOpportunityId,
            templateId: this.currentTemplateId,
            data: formData,
            status: 'in-progress',
            savedDate: new Date().toISOString().split('T')[0]
        };

        DataStore.savedTemplates.push(newSavedTemplate);
        DataStore.saveData();

        this.closeModal();
        if (typeof Opportunities !== 'undefined') {
            Opportunities.openDetailModal(this.currentOpportunityId);
        }
    },

    renderMeetingNotesTemplate(template, savedData = {}) {
        const fieldsHtml = template.fields.map(field => {
            const value = savedData[field.id] || '';
            const isRequired = field.required ? 'required' : '';
            
            // Group related fields into sections
            let sectionClass = '';
            let sectionLabel = '';
            
            if (['meeting_date', 'meeting_time', 'meeting_location', 'meeting_type'].includes(field.id)) {
                sectionClass = 'meeting-logistics-section';
                sectionLabel = field.id === 'meeting_date' ? 'Meeting Logistics' : '';
            } else if (['our_attendees', 'customer_attendees', 'other_attendees'].includes(field.id)) {
                sectionClass = 'meeting-attendees-section';
                sectionLabel = field.id === 'our_attendees' ? 'Attendees' : '';
            } else if (['action_items', 'our_commitments', 'customer_commitments', 'follow_up_needed'].includes(field.id)) {
                sectionClass = 'action-items-section';
                sectionLabel = field.id === 'action_items' ? 'Action Items & Commitments' : '';
            }
            
            const sectionHeader = sectionLabel ? `<h4>${sectionLabel}</h4>` : '';
            const sectionStart = sectionLabel ? `<div class="${sectionClass}">` : '';
            const sectionEnd = sectionLabel && field.id === 'other_attendees' ? '</div>' : 
                              sectionLabel && field.id === 'follow_up_needed' ? '</div>' : '';
            
            let fieldHtml = '';
            
            if (field.type === 'select') {
                const options = field.options.map(option => 
                    `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`
                ).join('');
                
                fieldHtml = `
                    <div class="form-group">
                        <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                        <select id="${field.id}" ${isRequired}>
                            <option value="">Select...</option>
                            ${options}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                fieldHtml = `
                    <div class="form-group">
                        <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                        <textarea id="${field.id}" ${isRequired} placeholder="Enter ${field.label.toLowerCase()}...">${value}</textarea>
                    </div>
                `;
            } else {
                fieldHtml = `
                    <div class="form-group">
                        <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                        <input type="${field.type}" id="${field.id}" value="${value}" ${isRequired}>
                    </div>
                `;
            }
            
            return sectionStart + sectionHeader + fieldHtml + sectionEnd;
        }).join('');
        
        return `
            <div class="meeting-notes-template">
                <div class="worksheet-header">
                    <h2>📝 ${template.title}</h2>
                    <p class="template-description">${template.description}</p>
                </div>
                
                <div class="template-worksheet">
                    <form id="templateForm">
                        ${fieldsHtml}
                    </form>
                </div>
                
                <div class="template-form-actions">
                    <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                    <button type="button" class="btn btn-success" onclick="Templates.saveTemplate(${template.id})">Save Meeting Notes</button>
                </div>
            </div>
        `;
    },

    renderTemplateWorksheet(template) {
        const activeOpportunities = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing'
        );

        let html = `
            <div class="worksheet-header">
                <h2>${template.title}</h2>
                <p class="template-description">${template.description}</p>
                ${template.guidance ? `<button class="btn btn-small btn-secondary" onclick="Templates.showGuidance(${template.id})">📖 View Guidance</button>` : ''}
            </div>
            
            <div class="template-worksheet">
                <form id="templateForm" onsubmit="Templates.saveTemplate(event, ${template.id})">
                    <!-- Required fields first -->
                    <div class="form-group">
                        <label for="template_opportunity">Opportunity *</label>
                        <select id="template_opportunity" required>
                            <option value="">Select Opportunity</option>
                            ${activeOpportunities.map(opp => `<option value="${opp.id}">${opp.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="template_employee_name">Employee Name *</label>
                        <input type="text" id="template_employee_name" required placeholder="Enter your name">
                    </div>
                    
                    <!-- Template-specific fields -->
                    ${template.fields.map(field => `
                        <div class="form-group">
                            <label for="template_${field.id}">${field.label}</label>
                            ${this.renderFormField(field)}
                        </div>
                    `).join('')}
                    
                    <div class="template-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                        <button type="button" class="btn btn-secondary" onclick="Templates.saveInProgress(${template.id})">💾 Save Progress</button>
                        <button type="submit" class="btn">✅ Save & Complete</button>
                    </div>
                </form>
            </div>
        `;

        return html;
    }
};
