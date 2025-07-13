const Templates = {
    render() {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        // Debug: Check if DataStore.templates exists
        if (!DataStore || !DataStore.templates) {
            console.error('DataStore.templates is not available');
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>⚠️ Templates not loaded</h3>
                    <p>There was an error loading the templates. Please refresh the page.</p>
                    <button class="btn" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
            return;
        }

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
                    📚 Available Templates (${DataStore.templates.length} total)
                </h3>
                ${this.renderTemplatesByCategory()}
            </div>
        `;

        container.innerHTML = html;
    },

    getSavedTemplatesCount() {
        if (!DataStore || !DataStore.opportunities || !DataStore.savedTemplates) return 0;
        
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
        
        if (content && icon) {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.textContent = '▼';
            } else {
                content.style.display = 'none';
                icon.textContent = '▶';
            }
        }
    },

    renderSavedTemplates() {
        if (!DataStore || !DataStore.opportunities || !DataStore.savedTemplates) {
            return `<div class="no-saved-templates"><p>No saved templates available.</p></div>`;
        }

        const activeOpportunityIds = DataStore.opportunities
            .filter(opp => !opp.status || opp.status === 'capture' || opp.status === 'pursuing')
            .map(opp => opp.id);
        
        const activeSavedTemplates = DataStore.savedTemplates.filter(template => 
            activeOpportunityIds.includes(parseInt(template.opportunityId))
        );

        if (activeSavedTemplates.length === 0) {
            return `
                <div class="no-saved-templates">
                    <p>No saved templates yet. Fill out some templates to see them here.</p>
                </div>
            `;
        }

        // Use unified card grid system
        return `
            <div class="cards-grid-unified">
                ${activeSavedTemplates.map(savedTemplate => {
                    const template = DataStore.templates.find(t => t.id === savedTemplate.templateId);
                    const opportunity = DataStore.opportunities.find(opp => opp.id == savedTemplate.opportunityId);
                    
                    // Determine status styling
                    const statusClass = savedTemplate.status === 'completed' ? 'status-completed' : 'status-in-progress';
                    const statusIcon = savedTemplate.status === 'completed' ? '✅' : '⏳';
                    const statusText = savedTemplate.status === 'completed' ? 'Completed' : 'In Progress';
                    
                    return `
                        <div class="card-unified saved-template-card ${statusClass}">
                            <div class="card-header-unified">
                                <h3 class="card-title-unified">${savedTemplate.title || template?.title || 'Unknown Template'}</h3>
                                <div class="card-subtitle-unified">${opportunity ? opportunity.name : 'Unknown Opportunity'}</div>
                            </div>
                            
                            <div class="card-content-unified">
                                <div class="card-meta-unified">
                                    <div class="saved-template-meta">
                                        <span class="meta-item">
                                            <strong>📅 Saved:</strong> ${savedTemplate.savedDate}
                                        </span>
                                        <span class="meta-item">
                                            <strong>👤 By:</strong> ${savedTemplate.data?.employee_name || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="card-description-unified">
                                    ${template?.description || 'No description available'}
                                </div>
                            </div>
                            
                            <div class="card-footer-unified">
                                <div class="card-status-unified">
                                    <span class="status-badge-unified ${statusClass}">
                                        ${statusIcon} ${statusText}
                                    </span>
                                </div>
                                <div class="card-actions-unified">
                                    <button class="btn-card btn-card-secondary" onclick="Templates.exportSavedTemplate(${savedTemplate.id})">
                                        📤 Export
                                    </button>
                                    <button class="btn-card btn-card-primary" onclick="Templates.editSavedTemplate(${savedTemplate.id})">
                                        ${savedTemplate.status === 'completed' ? '👁️ View' : '✏️ Continue'}
                                    </button>
                                    <button class="btn-card btn-card-icon" onclick="Templates.deleteSavedTemplate(${savedTemplate.id})" style="background: #dc3545; color: white;" title="Delete">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderTemplatesByCategory(category, templates) {
        const categoryConfig = this.getPhaseConfig(category);
        
        // Fix: Handle undefined category properly
        const categoryName = category || 'other';
        const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        if (!categoryConfig) {
            console.warn(`Unknown category: ${category}`);
            return `
                <div class="template-phase-section" data-phase="${categoryName}">
                    <div class="phase-panel">
                        <div class="phase-header">
                            <h3 class="phase-title">📂 ${displayName}</h3>
                            <p class="phase-description">Additional templates</p>
                            <span class="template-count">${templates.length} template${templates.length === 1 ? '' : 's'}</span>
                        </div>
                        <div class="cards-grid-unified">
                            ${templates.map(template => this.renderTemplateCard(template)).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="template-phase-section" data-phase="${categoryName}">
                <div class="phase-panel">
                    <div class="phase-header">
                        <h3 class="phase-title">${categoryConfig.title}</h3>
                        <p class="phase-description">${categoryConfig.description}</p>
                        <span class="template-count">${templates.length} template${templates.length === 1 ? '' : 's'}</span>
                    </div>
                    <div class="cards-grid-unified">
                        ${templates.map(template => this.renderTemplateCard(template)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderTemplatesByCategory() {
        if (!DataStore || !DataStore.templates || DataStore.templates.length === 0) {
            return `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>📄 No Templates Available</h3>
                    <p>Templates are not loaded. This might be due to a data loading issue.</p>
                    <button class="btn" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }

        // Define the complete phase configuration with fallbacks
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

        // Group templates by category with better error handling
        const templatesByCategory = {};
        DataStore.templates.forEach(template => {
            if (template) {
                // Fix: Handle undefined category
                const category = template.category ? template.category.toLowerCase() : 'other';
                if (!templatesByCategory[category]) {
                    templatesByCategory[category] = [];
                }
                templatesByCategory[category].push(template);
            }
        });

        // Debug info
        console.log('Templates by category:', templatesByCategory);
        console.log('Total templates found:', DataStore.templates.length);

        // Render in phase order with proper error handling
        let html = '';
        phaseOrder.forEach(phase => {
            const templates = templatesByCategory[phase.key] || [];
            if (templates.length > 0) {
                html += this.renderCategorySection(phase, templates);
            }
        });

        // Handle templates with unknown categories (including undefined)
        const unknownTemplates = DataStore.templates.filter(template => {
            if (!template) return false;
            const category = template.category ? template.category.toLowerCase() : 'other';
            return !phaseOrder.some(phase => phase.key === category);
        });

        if (unknownTemplates.length > 0) {
            const unknownPhase = {
                key: 'other',
                title: '📂 Other Templates',
                description: 'Additional templates and resources'
            };
            html += this.renderCategorySection(unknownPhase, unknownTemplates);
        }

        return html || `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>📄 No Templates Found</h3>
                <p>No templates are available in any category.</p>
            </div>
        `;
    },

    getPhaseConfig(phaseKey) {
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

        return phaseOrder.find(phase => phase.key === phaseKey);
    },

    renderCategorySection(phase, templates) {
        return `
            <div class="template-phase-section" data-phase="${phase.key}">
                <div class="phase-panel">
                    <div class="phase-header">
                        <h3 class="phase-title">${phase.title}</h3>
                        <p class="phase-description">${phase.description}</p>
                        <span class="template-count">${templates.length} template${templates.length === 1 ? '' : 's'}</span>
                    </div>
                    <div class="cards-grid-unified">
                        ${templates.map(template => this.renderTemplateCard(template)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderTemplateCard(template) {
        if (!template) return '';

        const phaseColors = {
            identification: '#2196f3',
            qualification: '#ff9800', 
            planning: '#4caf50',
            engagement: '#9c27b0',
            intelligence: '#f44336',
            preparation: '#607d8b',
            other: '#6c757d'
        };
        
        const category = template.category ? template.category.toLowerCase() : 'other';
        const phaseColor = phaseColors[category] || '#17a2b8';
        const description = template.description || 'No description available';
        const truncatedDescription = description.length > 120 ? 
            description.substring(0, 120) + '...' : description;
        
        return `
            <div class="card-base template-card" onclick="Templates.openTemplate(${template.id})">
                <div class="template-phase-indicator" style="background: ${phaseColor};">
                    ${category}
                </div>
                
                <div class="card-header-unified">
                    <h3 class="card-title-unified">${template.title || 'Untitled Template'}</h3>
                    <div class="card-subtitle-unified">${category.charAt(0).toUpperCase() + category.slice(1)} Phase</div>
                </div>
                
                <div class="card-content-unified">
                    <div class="card-description-unified">
                        ${truncatedDescription}
                    </div>
                    
                    <div class="card-metrics-unified">
                        <div class="card-metric-item">
                            <span class="card-metric-label">Fields</span>
                            <span class="card-metric-value">${template.fields ? template.fields.length : 0}</span>
                        </div>
                        <div class="card-metric-item">
                            <span class="card-metric-label">Required</span>
                            <span class="card-metric-value">${template.fields ? template.fields.filter(f => f.required).length : 0}</span>
                        </div>
                    </div>
                    
                    ${template.guidance ? `
                        <div style="background: #e3f2fd; border-radius: 4px; padding: 0.5rem; margin-top: 0.5rem;">
                            <div style="font-size: 0.8rem; color: #1976d2; font-weight: 500;">
                                💡 Includes guidance and best practices
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-footer-unified">
                    <div class="card-status-unified">
                        <span class="status-badge-unified" style="background: ${phaseColor}20; color: ${phaseColor};">
                            ${category}
                        </span>
                    </div>
                    <div class="card-actions-unified" onclick="event.stopPropagation()">
                        <button class="btn-card btn-card-secondary" onclick="Templates.previewTemplate(${template.id})">
                            Preview
                        </button>
                        <button class="btn-card btn-card-primary" onclick="Templates.openTemplate(${template.id})">
                            Use Template
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderFormField(field) {
        const required = field.required ? 'required' : '';
        
        switch (field.type) {
            case 'select':
                return `
                    <select id="template_${field.id}" ${required}>
                        <option value="">Select...</option>
                        ${field.options ? field.options.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
                    </select>
                `;
            case 'textarea':
                return `<textarea id="template_${field.id}" ${required} placeholder="${field.label}"></textarea>`;
            case 'number':
                return `<input type="number" id="template_${field.id}" ${required}>`;
            case 'date':
                return `<input type="date" id="template_${field.id}" ${required}>`;
            default:
                return `<input type="text" id="template_${field.id}" ${required} placeholder="${field.label}">`;
        }
    },

    renderTemplateWorksheet(template) {
        const activeOpportunities = DataStore.opportunities.filter(opp => 
            !opp.status || opp.status === 'capture' || opp.status === 'pursuing'
        );

        let html = `
            <div class="worksheet-header">
                <h2>${template.title}</h2>
                <p class="template-description">${template.description}</p>
                ${template.guidance ? `
                    <div class="guidance-info">
                        <button type="button" class="btn btn-secondary" onclick="Templates.showGuidance(${template.id})">
                            💡 Show Guidance
                        </button>
                    </div>
                ` : ''}
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
                    ${template.fields ? template.fields.map(field => `
                        <div class="form-group">
                            <label for="template_${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                            ${this.renderFormField(field)}
                        </div>
                    `).join('') : ''}
                    
                    <div class="template-form-actions">
                        <button type="button" class="btn btn-secondary" onclick="Templates.closeModal()">Cancel</button>
                        <button type="button" class="btn btn-secondary" onclick="Templates.saveInProgress(${template.id})">💾 Save Progress</button>
                        <button type="submit" class="btn">✅ Save & Complete</button>
                    </div>
                </form>
            </div>
        `;

        return html;
    },

    renderMeetingNotesTemplate(template, savedData = {}) {
        const fieldsHtml = template.fields.map(field => {
            const value = savedData[field.id] || '';
            const isRequired = field.required ? 'required' : '';
            
            // Group related fields into sections
            let sectionClass = '';
            let sectionLabel = '';
            let sectionStart = '';
            let sectionEnd = '';
            let sectionHeader = '';
            
            if (['meeting_date', 'meeting_time', 'meeting_location', 'meeting_type'].includes(field.id)) {
                sectionClass = 'meeting-logistics-section';
                if (field.id === 'meeting_date') {
                    sectionStart = '<div class="meeting-logistics-section">';
                    sectionHeader = '<h3>Meeting Logistics</h3>';
                }
                if (field.id === 'meeting_type') {
                    sectionEnd = '</div>';
                }
            } else if (['our_attendees', 'customer_attendees', 'other_attendees'].includes(field.id)) {
                sectionClass = 'meeting-attendees-section';
                if (field.id === 'our_attendees') {
                    sectionStart = '<div class="meeting-attendees-section">';
                    sectionHeader = '<h3>Attendees</h3>';
                }
                if (field.id === 'other_attendees') {
                    sectionEnd = '</div>';
                }
            } else if (['action_items', 'our_commitments', 'customer_commitments', 'follow_up_needed'].includes(field.id)) {
                sectionClass = 'action-items-section';
                if (field.id === 'action_items') {
                    sectionStart = '<div class="action-items-section">';
                    sectionHeader = '<h3>Action Items & Follow-up</h3>';
                }
                if (field.id === 'follow_up_needed') {
                    sectionEnd = '</div>';
                }
            }
            
            let fieldHtml = '';
            if (field.type === 'textarea') {
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

    openTemplate(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) {
            alert('Template not found');
            return;
        }

        const modal = document.getElementById('templateDetailModal');
        const content = document.getElementById('template-detail-content');
        
        if (!modal || !content) {
            alert('Template modal not found');
            return;
        }

        // Handle special templates
        if (template.id === 22) { // Meeting Notes Template
            content.innerHTML = this.renderMeetingNotesTemplate(template);
        } else {
            content.innerHTML = this.renderTemplateWorksheet(template);
        }

        modal.style.display = 'block';

        // Handle form submission
        const form = document.getElementById('templateForm');
        if (form && !form.onsubmit) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.saveTemplate(e, templateId);
            };
        }
    },

    previewTemplate(templateId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;

        let previewText = `Template: ${template.title}\n\nDescription: ${template.description}\n\nCategory: ${template.category}\n\nFields (${template.fields ? template.fields.length : 0}):\n`;
        
        if (template.fields) {
            template.fields.forEach((field, index) => {
                previewText += `${index + 1}. ${field.label} (${field.type})${field.required ? ' *' : ''}\n`;
            });
        }

        if (template.guidance) {
            previewText += `\nIncludes guidance and best practices.`;
        }

        alert(previewText);
    },

    saveTemplate(event, templateId) {
        if (event) event.preventDefault();
        
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) return;

        const opportunityId = document.getElementById('template_opportunity').value;
        const employeeName = document.getElementById('template_employee_name').value;

        if (!opportunityId || !employeeName) {
            alert('Please select an opportunity and enter your name');
            return;
        }

        this.saveTemplateData(templateId, 'completed');
    },

    saveInProgress(templateId) {
        const opportunityId = document.getElementById('template_opportunity').value;
        const employeeName = document.getElementById('template_employee_name').value;

        if (!opportunityId || !employeeName) {
            alert('Please select an opportunity and enter your name before saving progress');
            return;
        }

        this.saveTemplateData(templateId, 'in-progress');
    },

    saveTemplateData(templateId, status) {
        const template = DataStore.templates.find(t => t.id === templateId);
        const opportunityId = document.getElementById('template_opportunity').value;
        const employeeName = document.getElementById('template_employee_name').value;

        // Collect all form data
        const data = {
            opportunity_id: opportunityId,
            employee_name: employeeName
        };

        if (template.fields) {
            template.fields.forEach(field => {
                const element = document.getElementById(`template_${field.id}`);
                if (element) {
                    data[field.id] = element.value;
                }
            });
        }

        // Create saved template record
        const savedTemplate = {
            id: Date.now(),
            templateId: templateId,
            opportunityId: opportunityId,
            title: `${template.title} - ${employeeName}`,
            data: data,
            status: status,
            savedDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };

        DataStore.savedTemplates.push(savedTemplate);
        DataStore.saveData();
        this.closeModal();
        
        // Show success message
        const statusText = status === 'completed' ? 'completed' : 'saved as in-progress';
        alert(`Template ${statusText} successfully!`);
        
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
            
            if (template.fields) {
                template.fields.forEach(field => {
                    const element = document.getElementById(`template_${field.id}`);
                    if (element && savedTemplate.data[field.id]) {
                        element.value = savedTemplate.data[field.id];
                    }
                });
            }
            
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
            alert('Please select an opportunity and enter your name');
            return;
        }

        // Update saved data
        savedTemplate.data.opportunity_id = opportunityId;
        savedTemplate.data.employee_name = employeeName;
        savedTemplate.opportunityId = opportunityId;
        savedTemplate.status = status;
        savedTemplate.lastModified = new Date().toISOString().split('T')[0];

        if (template.fields) {
            template.fields.forEach(field => {
                const element = document.getElementById(`template_${field.id}`);
                if (element) {
                    savedTemplate.data[field.id] = element.value;
                }
            });
        }

        DataStore.saveData();
        this.closeModal();
        
        const statusText = status === 'completed' ? 'updated' : 'saved as in-progress';
        alert(`Template ${statusText} successfully!`);
        
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
                
                ${guidance.keyConsiderations ? `
                    <div class="guidance-section">
                        <h3>🤔 Key Considerations</h3>
                        <ul class="guidance-list">
                            ${guidance.keyConsiderations.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${guidance.prework ? `
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
                ` : ''}
                
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
                
                ${guidance.theory ? `
                    <div class="guidance-section">
                        <h3>📚 Theory & Best Practices</h3>
                        <p class="guidance-text">${guidance.theory}</p>
                    </div>
                ` : ''}
                
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
            // Clean up event listeners
            const clonedModal = modal.cloneNode(true);
            modal.parentNode.replaceChild(clonedModal, modal);
        }
    },

    // Additional utility functions for completeness
    openNewForm(templateId, opportunityId) {
        const template = DataStore.templates.find(t => t.id === templateId);
        if (!template) {
            alert('Template not found.');
            return;
        }

        this.currentOpportunityId = opportunityId;
        this.currentTemplateId = templateId;
        this.openTemplate(templateId);
        
        // Pre-select the opportunity
        setTimeout(() => {
            const oppSelect = document.getElementById('template_opportunity');
            if (oppSelect) {
                oppSelect.value = opportunityId;
            }
        }, 100);
    },

    saveNewForm(event) {
        event.preventDefault();
        this.saveTemplate(event, this.currentTemplateId);
    }
};