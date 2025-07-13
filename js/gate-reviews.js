const GateReviews = {
    // Gate definitions aligned with your 6-phase capture process
    gateDefinitions: {
        0: {
            name: "Opportunity Identification/Qualification",
            description: "Initial assessment of opportunity viability and strategic alignment",
            phase: "identification",
            requiredCriteria: [
                "Business case alignment with GMRE capabilities assessed",
                "Market research and customer intelligence gathered", 
                "Initial customer engagement documented",
                "Strategic fit and risk/opportunity assessment completed"
            ],
            roles: ["BD Manager", "Technical Lead", "Finance Lead"],
            aiPromptContext: "initial opportunity assessment, market fit, and strategic alignment"
        },
        1: {
            name: "Pursuit Decision Gate",
            description: "Formal bid/no-bid decision based on comprehensive qualification",
            phase: "qualification",
            requiredCriteria: [
                "Customer requirements and evaluation criteria understood",
                "Competitive landscape analysis completed",
                "Technical approach and solution concept defined",
                "Resource requirements and capacity assessed"
            ],
            roles: ["Program Manager", "Technical Lead", "Business Development Director"],
            aiPromptContext: "bid/no-bid decision, competitive positioning, and resource commitment"
        },
        2: {
            name: "Capture Strategy Gate",
            description: "Validation of capture strategy and approach before major investment",
            phase: "planning",
            requiredCriteria: [
                "Win strategy and themes developed and validated",
                "Customer engagement plan executed",
                "Teaming strategy finalized",
                "Capture plan approved and resourced"
            ],
            roles: ["Capture Manager", "Technical Lead", "BD Director"],
            aiPromptContext: "capture strategy validation, win themes, and customer relationships"
        },
        3: {
            name: "Solution Validation Gate", 
            description: "Technical solution and management approach validation",
            phase: "engagement",
            requiredCriteria: [
                "Technical solution architecture validated",
                "Management approach and staffing plan confirmed",
                "Past performance relevance demonstrated",
                "Customer feedback on approach incorporated"
            ],
            roles: ["Program Manager", "Technical Lead", "Contracts Lead"],
            aiPromptContext: "technical solution validation, management approach, and customer alignment"
        },
        4: {
            name: "Proposal Readiness Gate",
            description: "Final validation before proposal development and submission",
            phase: "preparation",
            requiredCriteria: [
                "All RFP requirements analyzed and compliance verified",
                "Pricing strategy developed and validated",
                "Proposal team assembled and roles assigned",
                "Quality assurance plan established"
            ],
            roles: ["Capture Manager", "Proposal Manager", "Executive Sponsor"],
            aiPromptContext: "proposal readiness, pricing validation, and submission preparation"
        },
        5: {
            name: "Contract Award/Transition Gate",
            description: "Transition from capture to delivery phase",
            phase: "preparation",
            requiredCriteria: [
                "Award notification received and contract terms understood",
                "Transition plan from capture to delivery executed",
                "Delivery team assigned and oriented",
                "Contract execution and performance readiness confirmed"
            ],
            roles: ["Program Manager", "Contracts Lead", "Delivery Manager"],
            aiPromptContext: "contract award transition, delivery readiness, and performance preparation"
        }
    },

    // Initialize gate reviews data structure in DataStore if not present
    init() {
        if (!DataStore.gateReviews) {
            DataStore.gateReviews = [];
        }
        if (!DataStore.gateReviewers) {
            DataStore.gateReviewers = [
                { id: 'jp', name: 'Josh Parker', role: 'Program Manager' },
                { id: 'pb', name: 'Philip Bies', role: 'Technical Lead' },
                { id: 'sc', name: 'Samantha Cannon', role: 'Contracts Lead' },
                { id: 'ch', name: 'Christopher Hayes', role: 'Pricing Lead' },
                { id: 'mr', name: 'Morgan Revels', role: 'Proposal Manager' }
            ];
        }
    },

    // Render the main gate reviews view with safety checks
    render() {
        // FIXED: Only render if we're actually on the gate reviews view
        const gateReviewsView = document.getElementById('gate-reviews-view');
        if (!gateReviewsView || gateReviewsView.style.display === 'none') {
            return; // Don't render if not on gate reviews page
        }

        const container = document.getElementById('gate-reviews-view');
        if (!container) return;

        this.init();

        container.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Gate Review Management</h2>
                    <div class="section-actions">
                        <button class="btn" onclick="GateReviews.openNewGateModal()">
                            Initiate Gate Review
                        </button>
                    </div>
                </div>

                <!-- Gate Review Initiation Card -->
                <div class="gate-initiation-card" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0;">Start New Gate Review</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end;">
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Select Opportunity</label>
                            <select id="gateOpportunitySelect" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Choose opportunity...</option>
                                ${DataStore.opportunities.map(opp => 
                                    `<option value="${opp.id}">${opp.name} (${opp.client || opp.customer || 'Unknown'})</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Gate Number</label>
                            <select id="gateNumberSelect" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                ${Object.entries(this.gateDefinitions).map(([num, gate]) => 
                                    `<option value="${num}">Gate ${num}: ${gate.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Review Type</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary" onclick="GateReviews.initiateManualReview()" style="padding: 0.5rem 1rem;">
                                    Manual Review
                                </button>
                                <button class="btn" onclick="GateReviews.initiateAIReview()" style="padding: 0.5rem 1rem; background: #28a745;">
                                    🤖 AI Generate
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="gateDescription" style="margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 4px; display: none;">
                        <!-- Gate description will be populated here -->
                    </div>
                </div>

                <!-- Active/Recent Gate Reviews -->
                <div class="gate-reviews-list">
                    ${this.renderGateReviewsList()}
                </div>
            </div>
        `;

        // Add event listeners for the select elements
        document.getElementById('gateNumberSelect').addEventListener('change', this.updateGateDescription.bind(this));
        document.getElementById('gateOpportunitySelect').addEventListener('change', this.updateGateDescription.bind(this));
    },

    // Update the openNewGateModal function in gate-reviews.js:
    openNewGateModal(opportunityId = null) {
        // Only show if on gate reviews page
        if (document.getElementById('gate-reviews-view').style.display === 'none') {
            return;
        }

        const modal = document.getElementById('gateReviewModal');
        if (!modal) {
            alert('Gate review modal not found. Please ensure the gate review system is properly initialized.');
            return;
        }

        this.init(); // Ensure gate reviews are initialized

        const content = document.getElementById('gate-review-content');
        
        // Get opportunities for dropdown
        const opportunities = DataStore.opportunities || [];
        const opportunityOptions = opportunities.map(opp => 
            `<option value="${opp.id}" ${opportunityId && opp.id == opportunityId ? 'selected' : ''}>${opp.name}</option>`
        ).join('');

        content.innerHTML = `
            <div style="padding: 2rem;">
                <h2 style="color: #2a5298; margin-bottom: 1.5rem;">🚪 Initiate Gate Review</h2>
                
                <div style="background: #f8f9ff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e3e8f0; margin-bottom: 1.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label for="gateOpportunitySelect" style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #2a5298;">
                                Select Opportunity:
                            </label>
                            <select id="gateOpportunitySelect" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Choose an opportunity...</option>
                                ${opportunityOptions}
                            </select>
                        </div>
                        <div>
                            <label for="gateNumberSelect" style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #2a5298;">
                                Gate Number:
                            </label>
                            <select id="gateNumberSelect" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Select gate...</option>
                                <option value="0">Gate 0: Opportunity Assessment</option>
                                <option value="1">Gate 1: Qualification Review</option>
                                <option value="2">Gate 2: Capture Planning</option>
                                <option value="3">Gate 3: Engagement Strategy</option>
                                <option value="4">Gate 4: Intelligence Review</option>
                                <option value="5">Gate 5: Proposal Readiness</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-secondary" onclick="GateReviews.initiateManualReview()" style="padding: 0.75rem 1.5rem;">
                            📝 Manual Review
                        </button>
                        <button class="btn btn-primary" onclick="GateReviews.initiateAIReview()" style="padding: 0.75rem 1.5rem; background: #28a745;">
                            🤖 AI Enhanced Review
                        </button>
                    </div>
                </div>
                
                <div id="gateDescription" style="margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 4px; display: none;">
                    <!-- Gate description will be populated here -->
                </div>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn btn-secondary" onclick="GateReviews.closeReviewModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        
        // Add event listeners for the select elements
        document.getElementById('gateNumberSelect').addEventListener('change', this.updateGateDescription.bind(this));
        document.getElementById('gateOpportunitySelect').addEventListener('change', this.updateGateDescription.bind(this));
    },

    // Also add these helper functions if they don't exist:
    initiateManualReview() {
        // Only execute if on gate reviews page
        if (document.getElementById('gate-reviews-view').style.display === 'none') {
            return;
        }

        const opportunityId = document.getElementById('gateOpportunitySelect').value;
        const gateNumber = document.getElementById('gateNumberSelect').value;
        
        if (!opportunityId || gateNumber === '') {
            alert('Please select both an opportunity and gate number.');
            return;
        }
        
        // Create a manual gate review
        this.createGateReview(parseInt(opportunityId), parseInt(gateNumber), false);
        
        // Close the modal and show success
        this.closeReviewModal();
        alert(`Gate ${gateNumber} review initiated successfully!`);
        
        // Refresh the gate reviews view if we're on it
        if (document.getElementById('gate-reviews-view').style.display !== 'none') {
            this.render();
        }
    },

    initiateAIReview() {
        // Only execute if on gate reviews page
        if (document.getElementById('gate-reviews-view').style.display === 'none') {
            return;
        }

        const opportunityId = document.getElementById('gateOpportunitySelect').value;
        const gateNumber = document.getElementById('gateNumberSelect').value;
        
        if (!opportunityId || gateNumber === '') {
            alert('Please select both an opportunity and gate number.');
            return;
        }
        
        // Create an AI-enhanced gate review
        this.createGateReview(parseInt(opportunityId), parseInt(gateNumber), true);
        
        // Close the modal and show success
        this.closeReviewModal();
        alert(`AI-enhanced Gate ${gateNumber} review initiated successfully!`);
        
        // Refresh the gate reviews view if we're on it
        if (document.getElementById('gate-reviews-view').style.display !== 'none') {
            this.render();
        }
    },

    updateGateDescription() {
        const gateNumber = document.getElementById('gateNumberSelect').value;
        const opportunityId = document.getElementById('gateOpportunitySelect').value;
        const descriptionDiv = document.getElementById('gateDescription');
        
        if (gateNumber && this.gateDefinitions[gateNumber]) {
            const gate = this.gateDefinitions[gateNumber];
            const opportunity = opportunityId ? DataStore.getOpportunity(opportunityId) : null;
            
            descriptionDiv.style.display = 'block';
            descriptionDiv.innerHTML = `
                <h4 style="margin: 0 0 0.5rem 0; color: #1976d2;">Gate ${gateNumber}: ${gate.name}</h4>
                <p style="margin: 0 0 1rem 0; color: #666;">${gate.description}</p>
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #1976d2;">Required Reviewers:</strong> 
                    <span style="color: #666;">${gate.roles.join(', ')}</span>
                </div>
                <div style="background: #f0f8ff; padding: 0.75rem; border-radius: 4px; border-left: 4px solid #2196f3;">
                    <div style="display: flex; align-items: start; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">🤖</span>
                        <div style="font-size: 0.9rem; color: #1976d2;">
                            <strong>AI Enhancement:</strong> ${window.claude ? 'Available - Click "AI Generate"' : 'Not available (requires Claude.ai interface)'} to automatically analyze 
                            ${opportunity ? `"${opportunity.name}"` : 'the selected opportunity'} data including notes, 
                            actions, templates, progress, and competitive intelligence.
                        </div>
                    </div>
                </div>
            `;
        } else {
            descriptionDiv.style.display = 'none';
        }
    },

    renderGateReviewsList() {
        const reviews = DataStore.gateReviews || [];
        
        if (reviews.length === 0) {
            return `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚪</div>
                    <h3>No Gate Reviews Yet</h3>
                    <p>Initiate your first gate review to begin the formal approval process</p>
                </div>
            `;
        }

        return reviews.map(review => {
            const opportunity = DataStore.getOpportunity(review.opportunityId);
            const gate = this.gateDefinitions[review.gateNumber];
            const statusColor = this.getStatusColor(review.status);
            const decisionColor = this.getDecisionColor(review.decision);
            
            return `
                <div class="gate-review-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; background: white;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0;">Gate ${review.gateNumber}: ${opportunity ? opportunity.name : 'Unknown Opportunity'}</h3>
                            <p style="margin: 0; color: #666; font-size: 0.9rem;">${gate ? gate.name : 'Unknown Gate'}</p>
                            <p style="margin: 0.25rem 0 0 0; color: #888; font-size: 0.8rem;">
                                Created: ${Utils.formatDate(review.createdDate)}
                                ${review.completedDate ? ` • Completed: ${Utils.formatDate(review.completedDate)}` : ''}
                            </p>
                        </div>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            ${review.aiGenerated ? '<span style="background: #e8f5e9; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">🤖 AI Enhanced</span>' : ''}
                            ${review.decision ? `<span style="background: ${decisionColor.bg}; color: ${decisionColor.text}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${review.decision}</span>` : ''}
                            <span style="background: ${statusColor.bg}; color: ${statusColor.text}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">${review.status}</span>
                            <button class="btn btn-secondary" onclick="GateReviews.openReviewDetail(${review.id})" style="padding: 0.5rem 1rem;">
                                View Details
                            </button>
                        </div>
                    </div>
                    
                    ${review.executiveSummary ? `
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #2a5298;">Executive Summary</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: #666;">${review.executiveSummary}</p>
                        </div>
                    ` : ''}
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem;">
                        <div>
                            <strong style="color: #2a5298;">Criteria Status:</strong>
                            ${review.criteria ? this.renderCriteriaProgress(review.criteria) : 'No criteria defined'}
                        </div>
                        <div>
                            <strong style="color: #2a5298;">Assigned Reviewers:</strong>
                            <div style="margin-top: 0.25rem; color: #666;">
                                ${review.assignedReviewers ? review.assignedReviewers.join(', ') : 'None assigned'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderCriteriaProgress(criteria) {
        if (!criteria || criteria.length === 0) return 'No criteria';
        
        const metCount = criteria.filter(c => c.status === 'Met').length;
        const totalCount = criteria.length;
        const percentage = Math.round((metCount / totalCount) * 100);
        
        return `
            <div style="margin-top: 0.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #666;">
                    <span>${metCount}/${totalCount} criteria met</span>
                    <span>${percentage}%</span>
                </div>
                <div style="width: 100%; height: 6px; background: #e9ecef; border-radius: 3px; margin-top: 0.25rem;">
                    <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #28a745, #20c997); border-radius: 3px; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    },

    getStatusColor(status) {
        switch (status) {
            case 'Complete': return { bg: '#d4edda', text: '#155724' };
            case 'In Progress': return { bg: '#fff3cd', text: '#856404' };
            case 'AI Generated': return { bg: '#e8f5e9', text: '#2e7d32' };
            default: return { bg: '#f8f9fa', text: '#6c757d' };
        }
    },

    getDecisionColor(decision) {
        switch (decision) {
            case 'Proceed':
            case 'Approved': return { bg: '#d4edda', text: '#155724' };
            case 'Conditional Proceed':
            case 'Conditional': return { bg: '#fff3cd', text: '#856404' };
            case 'No-Go':
            case 'Rejected': return { bg: '#f8d7da', text: '#721c24' };
            default: return { bg: '#f8f9fa', text: '#6c757d' };
        }
    },

    // Initiate AI-powered gate review
    async initiateAIReview() {
        const opportunityId = document.getElementById('gateOpportunitySelect').value;
        const gateNumber = parseInt(document.getElementById('gateNumberSelect').value);
        
        if (!opportunityId) {
            alert('Please select an opportunity first');
            return;
        }

        // Check if Claude API is available
        if (!window.claude || !window.claude.complete) {
            alert('🤖 AI Generation Not Available\n\nThe AI-powered gate review feature requires the Claude.ai interface. You are currently running this locally.\n\nFor now, please use "Manual Review" to create gate reviews.');
            return;
        }

        // Show loading state
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '🔄 Generating...';
        button.disabled = true;

        try {
            await this.createAIGateReview(opportunityId, gateNumber);
        } catch (error) {
            console.error('Error generating AI gate review:', error);
            alert('Error generating AI analysis. Please try again.');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    },

    // Create a new gate review (manual)
    createGateReview(opportunityId, gateNumber, aiGenerated = false, aiData = null) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        const gate = this.gateDefinitions[gateNumber];
        
        if (!opportunity || !gate) {
            alert('Invalid opportunity or gate selection');
            return;
        }

        const newReview = {
            id: Date.now(),
            opportunityId: parseInt(opportunityId),
            gateNumber: gateNumber,
            status: aiGenerated ? 'AI Generated' : 'In Progress',
            criteria: gate.requiredCriteria.map((criterion, index) => {
                if (aiGenerated && aiData && aiData.criteriaAssessment[index]) {
                    const aiCriterion = aiData.criteriaAssessment[index];
                    return {
                        description: criterion,
                        status: aiCriterion.status,
                        comments: `${aiCriterion.analysis}\n\nEvidence: ${aiCriterion.evidence}\n\nRecommendations: ${aiCriterion.recommendations}`,
                        reviewer: 'AI Assistant'
                    };
                } else {
                    return {
                        description: criterion,
                        status: 'Pending',
                        comments: '',
                        reviewer: ''
                    };
                }
            }),
            assignedReviewers: gate.roles,
            createdDate: new Date().toISOString().split('T')[0],
            decision: aiGenerated && aiData ? aiData.recommendation : null,
            executiveSummary: aiGenerated && aiData ? aiData.executiveSummary : '',
            actionItems: aiGenerated && aiData ? aiData.actionItems || [] : [],
            aiGenerated: aiGenerated,
            aiAnalysis: aiGenerated ? aiData : null
        };

        DataStore.gateReviews.push(newReview);
        DataStore.saveData();
        
        // Refresh the view
        this.render();
        
        // Open the review detail modal
        this.openReviewDetail(newReview.id);
    },

    // Create AI-powered gate review (only if Claude API available)
    async createAIGateReview(opportunityId, gateNumber) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        const gate = this.gateDefinitions[gateNumber];
        
        // Gather comprehensive opportunity data with safe fallbacks
        const savedTemplates = DataStore.savedTemplates.filter(st => st.opportunityId == opportunityId);
        const actions = DataStore.actions.filter(a => a.opportunityId == opportunityId);
        const notes = Array.isArray(opportunity.notes) ? opportunity.notes : [];
        
        // Build comprehensive AI prompt
        const prompt = this.buildAIPrompt(opportunity, gate, gateNumber, savedTemplates, actions, notes);
        
        try {
            const response = await window.claude.complete(prompt);
            const aiAnalysis = JSON.parse(response);
            
            // Create the gate review with AI data
            this.createGateReview(opportunityId, gateNumber, true, aiAnalysis);
            
        } catch (error) {
            console.error('AI Analysis Error:', error);
            throw error;
        }
    },

    buildAIPrompt(opportunity, gate, gateNumber, savedTemplates, actions, notes) {
        // Safe fallback for notes
        const safeNotes = Array.isArray(notes) ? notes : [];
        
        return `You are an expert business development analyst conducting a Gate ${gateNumber} review for "${opportunity.name}".

GATE CONTEXT:
- Gate ${gateNumber}: ${gate.name}
- Description: ${gate.description}
- Required Criteria: ${gate.requiredCriteria.join(', ')}
- AI Analysis Focus: ${gate.aiPromptContext}

OPPORTUNITY DATA:
- Program: ${opportunity.name}
- Customer: ${opportunity.client || opportunity.customer || 'TBD'}
- Total Value: ${Utils.formatCurrency(opportunity.value || 0)}
- Current Phase: ${opportunity.currentPhase || 'Unknown'}
- Progress: ${opportunity.progress || 0}%
- Probability of Win: ${opportunity.probability || opportunity.pwin || 'Unknown'}%
- Close Date: ${opportunity.closeDate || opportunity.rfpDate || 'TBD'}
- Description: ${opportunity.description || 'No description available'}
- Status: ${opportunity.status || 'capture'}

COMPLETED STEPS:
${opportunity.completedSteps ? opportunity.completedSteps.map(step => `- ${step}`).join('\n') : 'No completed steps recorded'}

OPPORTUNITY NOTES (${safeNotes.length} total):
${safeNotes.length > 0 ? safeNotes.map(note => 
    `[${Utils.formatDate(note.timestamp)}] ${note.content}`
).join('\n') : 'No notes available'}

ACTION ITEMS (${actions.length} total):
${actions.length > 0 ? actions.map(action => 
    `- ${action.title} (${action.priority}, Due: ${action.dueDate}) [${action.completed ? 'COMPLETED' : 'PENDING'}]`
).join('\n') : 'No action items'}

SAVED TEMPLATES (${savedTemplates.length} completed):
${savedTemplates.length > 0 ? savedTemplates.map(template => {
    const templateDef = DataStore.templates.find(t => t.id === template.templateId);
    return `- ${templateDef ? templateDef.title : 'Unknown Template'} (${template.status}, Saved: ${template.savedDate})`;
}).join('\n') : 'No templates completed'}

Based on this comprehensive data, provide a structured Gate ${gateNumber} review analysis. Respond with a JSON object containing:

{
  "executiveSummary": "2-3 sentence summary of the opportunity and gate recommendation",
  "criteriaAssessment": [
    {
      "criterion": "specific criterion name from the required criteria list",
      "status": "Met|Conditional|Not Met", 
      "analysis": "detailed analysis of why this criterion status was assigned based on the actual data",
      "evidence": "specific evidence from the opportunity data supporting this assessment",
      "recommendations": "specific recommendations for this criterion"
    }
  ],
  "competitiveAnalysis": {
    "position": "overall competitive position assessment based on available data",
    "keyStrengths": ["list of key competitive strengths based on opportunity data"],
    "primaryRisks": ["list of primary risks identified from the data"],
    "differentiators": ["unique differentiators based on capabilities and past performance"]
  },
  "financialAssessment": {
    "viability": "assessment of financial viability based on opportunity value and company capability",
    "resourceRequirements": ["key resource needs based on action items and progress"],
    "investmentJustification": "why this investment makes sense based on strategic fit"
  },
  "recommendation": "Proceed|Conditional Proceed|No-Go",
  "rationale": ["key reasons supporting the recommendation based on actual data analysis"],
  "nextSteps": ["specific next steps if proceeding, based on current phase and progress"],
  "actionItems": ["critical action items with suggested owners based on current gaps"],
  "riskMitigation": ["key risks and specific mitigation strategies"],
  "timeline": "assessment of timeline feasibility based on close date and current progress"
}

Provide realistic, data-driven analysis based ONLY on the actual opportunity data provided. Be specific about evidence and base all assessments on concrete information from the notes, actions, templates, and progress data.

DO NOT OUTPUT ANYTHING OTHER THAN THE VALID JSON OBJECT. NO LEADING BACKTICKS OR TEXT.`;
    },

    // Open gate review detail modal
    openReviewDetail(reviewId) {
        const review = DataStore.gateReviews.find(r => r.id === reviewId);
        if (!review) return;

        const opportunity = DataStore.getOpportunity(review.opportunityId);
        const gate = this.gateDefinitions[review.gateNumber];
        
        const modal = document.getElementById('gateReviewModal');
        if (!modal) {
            console.error('Gate review modal not found - add to HTML');
            return;
        }

        const content = document.getElementById('gate-review-content');
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                <div>
                    <h2 style="margin: 0 0 0.5rem 0;">Gate ${review.gateNumber}: ${opportunity ? opportunity.name : 'Unknown'}</h2>
                    <p style="margin: 0; color: #666;">${gate ? gate.name : 'Unknown Gate'}</p>
                    <p style="margin: 0.5rem 0 0 0; color: #888; font-size: 0.9rem;">
                        Created: ${Utils.formatDate(review.createdDate)}
                        ${review.completedDate ? ` • Completed: ${Utils.formatDate(review.completedDate)}` : ''}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    ${review.aiGenerated ? '<span style="background: #e8f5e9; color: #2e7d32; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">🤖 AI Enhanced</span>' : ''}
                    <span style="background: ${this.getStatusColor(review.status).bg}; color: ${this.getStatusColor(review.status).text}; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">${review.status}</span>
                </div>
            </div>

            ${review.executiveSummary ? `
                <div style="background: #f0f8ff; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #2196f3;">
                    <h3 style="margin: 0 0 1rem 0; color: #1976d2;">Executive Summary</h3>
                    <p style="margin: 0; line-height: 1.6;">${review.executiveSummary}</p>
                </div>
            ` : ''}

            <!-- Criteria Assessment -->
            <div style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0;">Review Criteria</h3>
                <div style="space-y: 1rem;">
                    ${review.criteria.map((criterion, index) => `
                        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                <h4 style="margin: 0; flex: 1;">${criterion.description}</h4>
                                <span style="background: ${this.getStatusColor(criterion.status).bg}; color: ${this.getStatusColor(criterion.status).text}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; margin-left: 1rem;">${criterion.status}</span>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 1rem; margin-bottom: 1rem;">
                                <div>
                                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Status</label>
                                    <select onchange="GateReviews.updateCriteriaStatus(${reviewId}, ${index}, this.value, document.getElementById('comments_${index}').value, document.getElementById('reviewer_${index}').value)" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="Pending" ${criterion.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                        <option value="Met" ${criterion.status === 'Met' ? 'selected' : ''}>Met</option>
                                        <option value="Conditional" ${criterion.status === 'Conditional' ? 'selected' : ''}>Conditional</option>
                                        <option value="Not Met" ${criterion.status === 'Not Met' ? 'selected' : ''}>Not Met</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Reviewer</label>
                                    <select id="reviewer_${index}" onchange="GateReviews.updateCriteriaStatus(${reviewId}, ${index}, document.querySelector('select[onchange*=\\'${index}\\']').value, document.getElementById('comments_${index}').value, this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="">Select reviewer...</option>
                                        ${DataStore.gateReviewers.map(reviewer => 
                                            `<option value="${reviewer.name}" ${criterion.reviewer === reviewer.name ? 'selected' : ''}>${reviewer.name} (${reviewer.role})</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div>
                                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Comments</label>
                                    <textarea id="comments_${index}" onchange="GateReviews.updateCriteriaStatus(${reviewId}, ${index}, document.querySelector('select[onchange*=\\'${index}\\']').value, this.value, document.getElementById('reviewer_${index}').value)" 
                                              placeholder="Add comments..." 
                                              style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; min-height: 60px; resize: vertical;">${criterion.comments}</textarea>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- AI Analysis Display (if available) -->
            ${review.aiGenerated && review.aiAnalysis ? `
                <div style="background: #f0f8ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0; color: #1976d2; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🤖</span> AI Analysis Results
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">Competitive Position</h4>
                            <p style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: #666;">${review.aiAnalysis.competitiveAnalysis?.position || 'Not analyzed'}</p>
                            
                            <div style="margin-bottom: 0.75rem;">
                                <strong style="font-size: 0.85rem; color: #2e7d32;">Key Strengths:</strong>
                                <ul style="margin: 0.25rem 0 0 1rem; padding: 0; font-size: 0.8rem; color: #666;">
                                    ${review.aiAnalysis.competitiveAnalysis?.keyStrengths?.map(strength => `<li>${strength}</li>`).join('') || '<li>None identified</li>'}
                                </ul>
                            </div>
                            
                            <div>
                                <strong style="font-size: 0.85rem; color: #d32f2f;">Primary Risks:</strong>
                                <ul style="margin: 0.25rem 0 0 1rem; padding: 0; font-size: 0.8rem; color: #666;">
                                    ${review.aiAnalysis.competitiveAnalysis?.primaryRisks?.map(risk => `<li>${risk}</li>`).join('') || '<li>None identified</li>'}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin: 0 0 0.5rem 0; color: #1976d2;">AI Recommendation</h4>
                            <div style="background: ${this.getDecisionColor(review.aiAnalysis.recommendation).bg}; color: ${this.getDecisionColor(review.aiAnalysis.recommendation).text}; padding: 0.5rem 1rem; border-radius: 20px; display: inline-block; font-weight: 500; margin-bottom: 0.75rem;">
                                ${review.aiAnalysis.recommendation || 'No recommendation'}
                            </div>
                            
                            <div style="margin-bottom: 0.75rem;">
                                <strong style="font-size: 0.85rem; color: #1976d2;">Rationale:</strong>
                                <ul style="margin: 0.25rem 0 0 1rem; padding: 0; font-size: 0.8rem; color: #666;">
                                    ${review.aiAnalysis.rationale?.map(reason => `<li>${reason}</li>`).join('') || '<li>No rationale provided</li>'}
                                </ul>
                            </div>
                            
                            <div>
                                <strong style="font-size: 0.85rem; color: #1976d2;">Next Steps:</strong>
                                <ul style="margin: 0.25rem 0 0 1rem; padding: 0; font-size: 0.8rem; color: #666;">
                                    ${review.aiAnalysis.nextSteps?.map(step => `<li>${step}</li>`).join('') || '<li>No next steps defined</li>'}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Gate Decision Section -->
            ${review.status === 'In Progress' || review.status === 'AI Generated' ? `
                <div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0;">Gate Decision</h3>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start;">
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Decision</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="GateReviews.finalizeGateDecision(${reviewId}, 'Approved')" 
                                        style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                                    Approve
                                </button>
                                <button onclick="GateReviews.finalizeGateDecision(${reviewId}, 'Conditional')" 
                                        style="background: #ffc107; color: #212529; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                                    Conditional
                                </button>
                                <button onclick="GateReviews.finalizeGateDecision(${reviewId}, 'Rejected')" 
                                        style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                                    Reject
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Decision Summary & Action Items</label>
                            <textarea id="gateDecisionSummary" placeholder="Enter decision summary and any required action items..." 
                                      style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; resize: vertical;">${review.executiveSummary || ''}</textarea>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Action Items -->
            ${review.actionItems && review.actionItems.length > 0 ? `
                <div style="background: #fff8e1; border: 1px solid #ffecb3; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0; color: #f57f17;">Action Items</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${review.actionItems.map(item => `<li style="margin-bottom: 0.5rem; color: #f57f17;">${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <!-- Modal Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
                <div>
                    ${review.status === 'Complete' && review.decision ? `
                        <span style="background: ${this.getDecisionColor(review.decision).bg}; color: ${this.getDecisionColor(review.decision).text}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500;">
                            Final Decision: ${review.decision}
                        </span>
                    ` : ''}
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="GateReviews.exportGateReview(${reviewId})" 
                            style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Export Review
                    </button>
                    <button onclick="GateReviews.closeReviewModal()" 
                            style="background: #2a5298; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    },

    // Update criteria status
    updateCriteriaStatus(reviewId, criteriaIndex, status, comments, reviewer) {
        const review = DataStore.gateReviews.find(r => r.id === reviewId);
        if (!review || !review.criteria[criteriaIndex]) return;

        review.criteria[criteriaIndex].status = status;
        review.criteria[criteriaIndex].comments = comments;
        review.criteria[criteriaIndex].reviewer = reviewer;

        DataStore.saveData();
    },

    // Finalize gate decision
    finalizeGateDecision(reviewId, decision) {
        const review = DataStore.gateReviews.find(r => r.id === reviewId);
        if (!review) return;

        const summary = document.getElementById('gateDecisionSummary')?.value || '';

        review.decision = decision;
        review.executiveSummary = summary;
        review.status = 'Complete';
        review.completedDate = new Date().toISOString().split('T')[0];

        // Parse action items from summary if any
        const actionItemLines = summary.split('\n').filter(line => 
            line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().toLowerCase().includes('action')
        );
        if (actionItemLines.length > 0) {
            review.actionItems = actionItemLines;
        }

        DataStore.saveData();
        
        // Update the opportunity status if gate is approved
        if (decision === 'Approved') {
            this.updateOpportunityOnGateApproval(review.opportunityId, review.gateNumber);
        }

        // Refresh the review detail view
        this.openReviewDetail(reviewId);
        
        // Show success message
        alert(`Gate ${review.gateNumber} review ${decision.toLowerCase()}! Opportunity status updated.`);
    },

    // Update opportunity when gate is approved
    updateOpportunityOnGateApproval(opportunityId, gateNumber) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) return;

        // Update opportunity phase based on gate approval
        const phaseMapping = {
            0: 'qualification',
            1: 'planning', 
            2: 'engagement',
            3: 'intelligence',
            4: 'preparation',
            5: 'preparation' // Final gate stays in preparation
        };

        if (phaseMapping[gateNumber]) {
            opportunity.currentPhase = phaseMapping[gateNumber];
        }

        // Add gate approval to notes
        if (!opportunity.notes) opportunity.notes = [];
        opportunity.notes.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            content: `Gate ${gateNumber} review approved. Opportunity advanced to ${phaseMapping[gateNumber]} phase.`,
            author: "Gate Review System"
        });

        DataStore.saveData();
    },

    // Export gate review
    exportGateReview(reviewId) {
        const review = DataStore.gateReviews.find(r => r.id === reviewId);
        if (!review) return;

        const opportunity = DataStore.getOpportunity(review.opportunityId);
        const gate = this.gateDefinitions[review.gateNumber];

        const exportData = {
            opportunityName: opportunity?.name || 'Unknown',
            gateNumber: review.gateNumber,
            gateName: gate?.name || 'Unknown Gate',
            status: review.status,
            decision: review.decision,
            createdDate: review.createdDate,
            completedDate: review.completedDate,
            executiveSummary: review.executiveSummary,
            criteria: review.criteria,
            assignedReviewers: review.assignedReviewers,
            actionItems: review.actionItems,
            aiGenerated: review.aiGenerated,
            aiAnalysis: review.aiAnalysis
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gate_${review.gateNumber}_Review_${opportunity?.name?.replace(/[^a-z0-9]/gi, '_') || 'Unknown'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Close review modal
    closeReviewModal() {
        const modal = document.getElementById('gateReviewModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Get gate status for opportunity
    getOpportunityGateStatus(opportunityId) {
        const reviews = DataStore.gateReviews.filter(r => r.opportunityId == opportunityId);
        const completedGates = reviews.filter(r => r.status === 'Complete' && r.decision === 'Approved');
        
        return {
            totalReviews: reviews.length,
            completedGates: completedGates.length,
            lastApprovedGate: completedGates.length > 0 ? Math.max(...completedGates.map(r => r.gateNumber)) : -1,
            pendingReviews: reviews.filter(r => r.status === 'In Progress').length
        };
    },

    // Add gate review integration to opportunity cards (call from opportunities.js)
    renderGateStatusBadge(opportunityId) {
        const gateStatus = this.getOpportunityGateStatus(opportunityId);
        
        if (gateStatus.totalReviews === 0) {
            return '<span style="background: #f8f9fa; color: #6c757d; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem;">No Gates</span>';
        }

        const badgeColor = gateStatus.completedGates >= 3 ? '#28a745' : 
                          gateStatus.completedGates >= 1 ? '#ffc107' : '#6c757d';
        const textColor = gateStatus.completedGates >= 3 ? 'white' : 
                         gateStatus.completedGates >= 1 ? '#212529' : 'white';

        return `<span style="background: ${badgeColor}; color: ${textColor}; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
            Gates: ${gateStatus.completedGates}/6
            ${gateStatus.pendingReviews > 0 ? ` (${gateStatus.pendingReviews} pending)` : ''}
        </span>`;
    }
};

// Initialize gate reviews when the module loads
document.addEventListener('DOMContentLoaded', function() {
    GateReviews.init();
});