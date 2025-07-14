// Gate Package Slides - Individual slide renderers and data collectors
const GatePackageSlides = {
    // Main render dispatcher (called from generator)
    renderGatePackageSlides(gatePackage, opportunity) {
        const content = document.getElementById('gate-package-content');
        const gateDefinition = GatePackageGenerator.getGateDefinition(gatePackage.gateNumber);
        
        const slidesHTML = `
            <!-- Slide Navigation -->
            <div class="gate-package-nav">
                <div class="nav-controls">
                    <button class="btn btn-secondary" onclick="GatePackageGenerator.previousSlide()" id="prevBtn">← Previous</button>
                    <span class="slide-counter" id="slideCounter">1 / 8</span>
                    <button class="btn btn-secondary" onclick="GatePackageGenerator.nextSlide()" id="nextBtn">Next →</button>
                </div>
                <div class="gate-package-actions">
                    <button class="btn btn-primary" onclick="GatePackageGenerator.saveGatePackage()">💾 Save</button>
                    <button class="btn btn-success" onclick="GatePackageGenerator.exportGatePackage()">📄 Export</button>
                    <button class="btn btn-secondary" onclick="GatePackageGenerator.closeGatePackage()">✕ Close</button>
                </div>
            </div>

            <!-- Slide 1: Title & Executive Summary -->
            <div class="gate-package-slide active" data-slide="1">
                ${this.renderTitleSlide(gatePackage, opportunity, gateDefinition)}
            </div>

            <!-- Slide 2: Executive Summary Details -->
            <div class="gate-package-slide" data-slide="2">
                ${this.renderExecutiveSummarySlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 3: Business Case Analysis -->
            <div class="gate-package-slide" data-slide="3">
                ${this.renderBusinessCaseSlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 4: Conditional (Requirements or Call Plan) -->
            <div class="gate-package-slide" data-slide="4">
                ${gatePackage.gateNumber >= 3 ? this.renderRequirementsSlide(gatePackage, opportunity) : this.renderCallPlanSlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 5: Conditional (Proposal or Market Assessment) -->
            <div class="gate-package-slide" data-slide="5">
                ${gatePackage.gateNumber >= 2 ? this.renderProposalSlide(gatePackage, opportunity) : this.renderMarketAssessmentSlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 6: Conditional (Pricing or Team) -->
            <div class="gate-package-slide" data-slide="6">
                ${gatePackage.gateNumber >= 3 ? this.renderPricingSlide(gatePackage, opportunity) : this.renderTeamSlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 7: Conditional (Functional Reviews or Action Items) -->
            <div class="gate-package-slide" data-slide="7">
                ${gatePackage.gateNumber >= 3 ? this.renderFunctionalReviewsSlide(gatePackage, opportunity) : this.renderActionItemsSlide(gatePackage, opportunity)}
            </div>

            <!-- Slide 8: Final Decision & Sign-off -->
            <div class="gate-package-slide" data-slide="8">
                ${this.renderDecisionSlide(gatePackage, opportunity)}
            </div>
        `;
        
        content.innerHTML = slidesHTML;
    },

    renderTitleSlide(gatePackage, opportunity, gateDefinition) {
        return `
            <div class="slide-header">
                <h1>${gateDefinition.name}</h1>
                <h2>${opportunity.name}</h2>
                <div class="opportunity-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Client:</label>
                            <span>${opportunity.client || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <label>Value:</label>
                            <span>$${opportunity.value ? opportunity.value.toLocaleString() : 'TBD'}</span>
                        </div>
                        <div class="info-item">
                            <label>Close Date:</label>
                            <span>${Utils.formatDate(opportunity.closeDate) || 'TBD'}</span>
                        </div>
                        <div class="info-item">
                            <label>Progress:</label>
                            <span>${opportunity.progress || 0}%</span>
                        </div>
                        <div class="info-item">
                            <label>Status:</label>
                            <span class="status-badge status-${gatePackage.status}">${gatePackage.status}</span>
                        </div>
                        <div class="info-item">
                            <label>Created:</label>
                            <span>${Utils.formatDate(gatePackage.createdDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="slide-content">
                <h3>Gate Overview</h3>
                <p>${gateDefinition.description}</p>
                
                <h3>Executive Summary</h3>
                <textarea id="exec-summary" rows="4" placeholder="Enter executive summary...">${gatePackage.executiveSummary?.summary || ''}</textarea>
                
                <h3>Key Highlights</h3>
                <ul class="highlights-list">
                    ${(gatePackage.executiveSummary?.keyHighlights || []).map(highlight => 
                        `<li>${highlight}</li>`
                    ).join('')}
                </ul>
                
                <div class="quick-stats">
                    <div class="stat-card">
                        <h4>Required Templates</h4>
                        <p>${gateDefinition.requiredTemplates.length} templates</p>
                    </div>
                    <div class="stat-card">
                        <h4>Required Actions</h4>
                        <p>${gateDefinition.requiredActions.length} actions</p>
                    </div>
                    <div class="stat-card">
                        <h4>Review Status</h4>
                        <p>${gatePackage.status}</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderExecutiveSummarySlide(gatePackage, opportunity) {
        const summary = gatePackage.executiveSummary || {};
        
        return `
            <h2>Executive Summary</h2>
            
            <div class="form-section">
                <h3>Summary</h3>
                <textarea id="exec-summary-detail" rows="5" placeholder="Provide a detailed executive summary...">${summary.summary || ''}</textarea>
            </div>
            
            <div class="form-section">
                <h3>Key Highlights</h3>
                <div id="highlights-container">
                    ${(summary.keyHighlights || []).map((highlight, index) => `
                        <div class="highlight-item">
                            <input type="text" value="${highlight}" onchange="this.dataset.changed = 'true'">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addHighlight()" class="btn btn-secondary">Add Highlight</button>
            </div>
            
            <div class="form-section">
                <h3>Gate Recap</h3>
                <textarea id="gate-recap" rows="3" placeholder="Recap of gate activities and outcomes...">${summary.gateRecap || ''}</textarea>
            </div>
            
            <div class="form-section">
                <h3>Preliminary Decision</h3>
                <select id="preliminary-decision">
                    <option value="">Select decision...</option>
                    <option value="proceed" ${summary.decision === 'proceed' ? 'selected' : ''}>Proceed to Next Gate</option>
                    <option value="conditional" ${summary.decision === 'conditional' ? 'selected' : ''}>Conditional Proceed</option>
                    <option value="hold" ${summary.decision === 'hold' ? 'selected' : ''}>Hold</option>
                    <option value="stop" ${summary.decision === 'stop' ? 'selected' : ''}>Stop/No Bid</option>
                </select>
            </div>
        `;
    },

    renderBusinessCaseSlide(gatePackage, opportunity) {
        const business = gatePackage.businessCaseAnalysis || {};
        
        return `
            <h2>Business Case Analysis</h2>
            
            <div class="form-grid">
                <div class="form-section">
                    <label for="program-alignment">Program Alignment</label>
                    <textarea id="program-alignment" rows="3" placeholder="How does this opportunity align with our strategic programs?">${business.programAlignment || ''}</textarea>
                </div>
                
                <div class="form-section">
                    <label for="bid-position">Bid Position</label>
                    <select id="bid-position">
                        <option value="">Select position...</option>
                        <option value="prime" ${business.bidPosition === 'prime' ? 'selected' : ''}>Prime Contractor</option>
                        <option value="sub" ${business.bidPosition === 'sub' ? 'selected' : ''}>Subcontractor</option>
                        <option value="team" ${business.bidPosition === 'team' ? 'selected' : ''}>Team Member</option>
                        <option value="partner" ${business.bidPosition === 'partner' ? 'selected' : ''}>Joint Venture Partner</option>
                    </select>
                </div>
            </div>
            
            <div class="form-section">
                <label>
                    <input type="checkbox" id="teaming-required" ${business.teamingRequired ? 'checked' : ''}> 
                    Teaming Required
                </label>
            </div>
            
            <div class="form-grid">
                <div class="form-section">
                    <h3>Strengths</h3>
                    <div id="strengths-container">
                        ${(business.strengths || []).map(strength => `
                            <div class="list-item">
                                <input type="text" value="${strength}">
                                <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="GatePackageSlides.addListItem('strengths-container')" class="btn btn-secondary">Add Strength</button>
                </div>
                
                <div class="form-section">
                    <h3>Weaknesses</h3>
                    <div id="weaknesses-container">
                        ${(business.weaknesses || []).map(weakness => `
                            <div class="list-item">
                                <input type="text" value="${weakness}">
                                <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="GatePackageSlides.addListItem('weaknesses-container')" class="btn btn-secondary">Add Weakness</button>
                </div>
            </div>
            
            <div class="form-section">
                <label for="oci-concerns">OCI Concerns</label>
                <textarea id="oci-concerns" rows="2" placeholder="Any organizational conflict of interest concerns?">${business.ociConcerns || ''}</textarea>
            </div>
        `;
    },

    renderCallPlanSlide(gatePackage, opportunity) {
        const callPlan = gatePackage.callPlan || {};
        
        return `
            <h2>Call Plan</h2>
            
            <div class="tabs">
                <button onclick="GatePackageSlides.switchTab('cp-tab1')" class="tab-button active">Key Decision Makers</button>
                <button onclick="GatePackageSlides.switchTab('cp-tab2')" class="tab-button">Customer Visits</button>
                <button onclick="GatePackageSlides.switchTab('cp-tab3')" class="tab-button">Customer Insights</button>
            </div>
            
            <div id="cp-tab1" class="tab-content active">
                <h3>Key Decision Makers</h3>
                <table id="kdm-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Influence</th>
                            <th>Contact Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(callPlan.keyDecisionMakers || []).map((kdm, index) => `
                            <tr>
                                <td><input type="text" value="${kdm.name || ''}" placeholder="Name"></td>
                                <td><input type="text" value="${kdm.role || ''}" placeholder="Role"></td>
                                <td>
                                    <select>
                                        <option value="high" ${kdm.influence === 'high' ? 'selected' : ''}>High</option>
                                        <option value="medium" ${kdm.influence === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="low" ${kdm.influence === 'low' ? 'selected' : ''}>Low</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option value="contacted" ${kdm.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                                        <option value="pending" ${kdm.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="not-contacted" ${kdm.status === 'not-contacted' ? 'selected' : ''}>Not Contacted</option>
                                    </select>
                                </td>
                                <td><button onclick="this.closest('tr').remove()" class="btn-remove">Remove</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('kdm-table')" class="btn btn-secondary">Add Decision Maker</button>
            </div>
            
            <div id="cp-tab2" class="tab-content">
                <h3>Customer Visits</h3>
                <table id="cv-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Purpose</th>
                            <th>Attendees</th>
                            <th>Outcome</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(callPlan.customerVisits || []).map((visit, index) => `
                            <tr>
                                <td><input type="date" value="${visit.date || ''}"></td>
                                <td><input type="text" value="${visit.purpose || ''}" placeholder="Purpose"></td>
                                <td><input type="text" value="${visit.attendees || ''}" placeholder="Attendees"></td>
                                <td><input type="text" value="${visit.outcome || ''}" placeholder="Outcome"></td>
                                <td><button onclick="this.closest('tr').remove()" class="btn-remove">Remove</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('cv-table')" class="btn btn-secondary">Add Visit</button>
            </div>
            
            <div id="cp-tab3" class="tab-content">
                <div class="form-section">
                    <label for="customer-statement">Customer Statement</label>
                    <textarea id="customer-statement" rows="3" placeholder="What has the customer stated about their needs?">${callPlan.customerStatement || ''}</textarea>
                </div>
                
                <div class="form-section">
                    <label for="customer-preferences">Customer Preferences</label>
                    <textarea id="customer-preferences" rows="3" placeholder="What preferences has the customer expressed?">${callPlan.customerPreferences || ''}</textarea>
                </div>
                
                <div class="form-section">
                    <label for="customer-reaction">Customer Reaction</label>
                    <textarea id="customer-reaction" rows="3" placeholder="How has the customer reacted to our approach?">${callPlan.customerReaction || ''}</textarea>
                </div>
            </div>
        `;
    },

    renderMarketAssessmentSlide(gatePackage, opportunity) {
        const market = gatePackage.marketAssessment || {};
        
        return `
            <h2>Market Assessment</h2>
            
            <div class="form-section">
                <label for="market-intelligence">Market Intelligence</label>
                <textarea id="market-intelligence" rows="4" placeholder="What market intelligence do we have about this opportunity?">${market.marketIntelligence || ''}</textarea>
            </div>
            
            <div class="form-section">
                <label for="competitive-analysis">Competitive Analysis</label>
                <textarea id="competitive-analysis" rows="4" placeholder="Who are the likely competitors and what are their strengths/weaknesses?">${market.competitiveAnalysis || ''}</textarea>
            </div>
            
            <div class="form-section">
                <label for="investment-details">Investment Requirements</label>
                <textarea id="investment-details" rows="3" placeholder="What investments (time, money, resources) are required?">${market.investmentDetails || ''}</textarea>
            </div>
        `;
    },

    renderProposalSlide(gatePackage, opportunity) {
        const proposal = gatePackage.proposal || {};
        
        return `
            <h2>Proposal Planning</h2>
            
            <div class="form-section">
                <h3>Contract Deliverables</h3>
                <div id="deliverables-container">
                    ${(proposal.contractDeliverables || []).map(deliverable => `
                        <div class="list-item">
                            <input type="text" value="${deliverable}" placeholder="Deliverable">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('deliverables-container')" class="btn btn-secondary">Add Deliverable</button>
            </div>
            
            <div class="form-section">
                <h3>Proposal Volumes</h3>
                <div id="volumes-container">
                    ${(proposal.proposalVolumes || []).map(volume => `
                        <div class="list-item">
                            <input type="text" value="${volume}" placeholder="Volume">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('volumes-container')" class="btn btn-secondary">Add Volume</button>
            </div>
            
            <div class="form-section">
                <h3>Selection Criteria</h3>
                <div id="criteria-container">
                    ${(proposal.selectionCriteria || []).map(criteria => `
                        <div class="list-item">
                            <input type="text" value="${criteria}" placeholder="Selection criteria">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('criteria-container')" class="btn btn-secondary">Add Criteria</button>
            </div>
        `;
    },

    renderRequirementsSlide(gatePackage, opportunity) {
        return `
            <h2>Requirements Analysis</h2>
            
            <div class="form-section">
                <h3>Key Requirements</h3>
                <table id="requirements-table">
                    <thead>
                        <tr>
                            <th>Requirement</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Our Capability</th>
                            <th>Risk Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(gatePackage.requirements || []).map(req => `
                            <tr>
                                <td><input type="text" value="${req.requirement || ''}" placeholder="Requirement"></td>
                                <td>
                                    <select>
                                        <option value="technical" ${req.category === 'technical' ? 'selected' : ''}>Technical</option>
                                        <option value="functional" ${req.category === 'functional' ? 'selected' : ''}>Functional</option>
                                        <option value="performance" ${req.category === 'performance' ? 'selected' : ''}>Performance</option>
                                        <option value="compliance" ${req.category === 'compliance' ? 'selected' : ''}>Compliance</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option value="high" ${req.priority === 'high' ? 'selected' : ''}>High</option>
                                        <option value="medium" ${req.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="low" ${req.priority === 'low' ? 'selected' : ''}>Low</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option value="strong" ${req.capability === 'strong' ? 'selected' : ''}>Strong</option>
                                        <option value="adequate" ${req.capability === 'adequate' ? 'selected' : ''}>Adequate</option>
                                        <option value="weak" ${req.capability === 'weak' ? 'selected' : ''}>Weak</option>
                                        <option value="gap" ${req.capability === 'gap' ? 'selected' : ''}>Gap</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option value="low" ${req.risk === 'low' ? 'selected' : ''}>Low</option>
                                        <option value="medium" ${req.risk === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="high" ${req.risk === 'high' ? 'selected' : ''}>High</option>
                                    </select>
                                </td>
                                <td><button onclick="this.closest('tr').remove()" class="btn-remove">Remove</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('requirements-table')" class="btn btn-secondary">Add Requirement</button>
            </div>
        `;
    },

    renderPricingSlide(gatePackage, opportunity) {
        const pricing = gatePackage.pricing || {};
        
        return `
            <h2>Pricing Analysis</h2>
            
            <div class="form-grid">
                <div class="form-section">
                    <label for="price-to-win">Price to Win ($)</label>
                    <input type="number" id="price-to-win" value="${pricing.priceToWin || ''}" placeholder="0">
                </div>
                
                <div class="form-section">
                    <label for="our-estimate">Our Cost Estimate ($)</label>
                    <input type="number" id="our-estimate" value="${pricing.ourEstimate || ''}" placeholder="0">
                </div>
            </div>
            
            <div class="form-section">
                <h3>Pricing Risks</h3>
                <div id="pricing-risks-container">
                    ${(pricing.risks || []).map(risk => `
                        <div class="list-item">
                            <input type="text" value="${risk}" placeholder="Pricing risk">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('pricing-risks-container')" class="btn btn-secondary">Add Risk</button>
            </div>
            
            <div class="form-section">
                <h3>Pricing Levers</h3>
                <div id="pricing-levers-container">
                    ${(pricing.pricingLevers || []).map(lever => `
                        <div class="list-item">
                            <input type="text" value="${lever}" placeholder="Pricing lever">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('pricing-levers-container')" class="btn btn-secondary">Add Lever</button>
            </div>
        `;
    },

    renderTeamSlide(gatePackage, opportunity) {
        const team = gatePackage.teamAssignment || {};
        
        return `
            <h2>Team Assignment</h2>
            
            <div class="form-grid">
                <div class="form-section">
                    <label for="proposal-manager">Proposal Manager</label>
                    <input type="text" id="proposal-manager" value="${team.proposalManager || ''}" placeholder="Name">
                </div>
                
                <div class="form-section">
                    <label for="program-management">Program Management</label>
                    <input type="text" id="program-management" value="${team.programManagement || ''}" placeholder="Name">
                </div>
                
                <div class="form-section">
                    <label for="contracts-lead">Contracts Lead</label>
                    <input type="text" id="contracts-lead" value="${team.contractsLead || ''}" placeholder="Name">
                </div>
                
                <div class="form-section">
                    <label for="pricing-lead">Pricing Team Lead</label>
                    <input type="text" id="pricing-lead" value="${team.pricingTeamLead || ''}" placeholder="Name">
                </div>
            </div>
            
            <div class="form-section">
                <h3>Lead Investigators</h3>
                <div id="investigators-container">
                    ${(team.leadInvestigators || []).map(investigator => `
                        <div class="list-item">
                            <input type="text" value="${investigator}" placeholder="Investigator name">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('investigators-container')" class="btn btn-secondary">Add Investigator</button>
            </div>
            
            <div class="form-section">
                <h3>Pricing Team</h3>
                <div id="pricing-team-container">
                    ${(team.pricingTeam || []).map(member => `
                        <div class="list-item">
                            <input type="text" value="${member}" placeholder="Team member name">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('pricing-team-container')" class="btn btn-secondary">Add Team Member</button>
            </div>
        `;
    },

    renderFunctionalReviewsSlide(gatePackage, opportunity) {
        const reviews = gatePackage.functionalReviews || {};
        const functions = ['pricing', 'contracting', 'programManagement', 'security', 'humanResources', 'quality'];
        
        return `
            <h2>Functional Reviews</h2>
            
            ${functions.map(func => {
                const review = reviews[func] || {};
                const funcName = func.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                return `
                    <div class="functional-review-section">
                        <h3>${funcName}</h3>
                        <div class="form-grid">
                            <div class="form-section">
                                <label for="${func}-reviewer">Reviewer</label>
                                <input type="text" id="${func}-reviewer" value="${review.reviewer || ''}" placeholder="Reviewer name">
                            </div>
                            
                            <div class="form-section">
                                <label for="${func}-assessment">Assessment</label>
                                <select id="${func}-assessment">
                                    <option value="">Select assessment...</option>
                                    <option value="approved" ${review.assessment === 'approved' ? 'selected' : ''}>Approved</option>
                                    <option value="conditional" ${review.assessment === 'conditional' ? 'selected' : ''}>Conditional</option>
                                    <option value="concerns" ${review.assessment === 'concerns' ? 'selected' : ''}>Concerns</option>
                                    <option value="rejected" ${review.assessment === 'rejected' ? 'selected' : ''}>Rejected</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <label for="${func}-concerns">Concerns/Comments</label>
                            <textarea id="${func}-concerns" rows="2" placeholder="Any concerns or comments...">${(review.concerns || []).join('; ')}</textarea>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    },

    renderActionItemsSlide(gatePackage, opportunity) {
        const actionItems = gatePackage.actionItems || [];
        
        return `
            <h2>Action Items</h2>
            
            <div class="form-section">
                <h3>Outstanding Action Items</h3>
                <table id="action-items-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Owner</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actionItems.map(action => `
                            <tr>
                                <td><input type="text" value="${action.title || ''}" placeholder="Action item"></td>
                                <td><input type="text" value="${action.owner || ''}" placeholder="Owner"></td>
                                <td><input type="date" value="${action.dueDate || ''}"></td>
                                <td>
                                    <select>
                                        <option value="high" ${action.priority === 'high' ? 'selected' : ''}>High</option>
                                        <option value="medium" ${action.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="low" ${action.priority === 'low' ? 'selected' : ''}>Low</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option value="open" ${action.status === 'open' ? 'selected' : ''}>Open</option>
                                        <option value="in-progress" ${action.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="completed" ${action.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    </select>
                                </td>
                                <td><button onclick="this.closest('tr').remove()" class="btn-remove">Remove</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('action-items-table')" class="btn btn-secondary">Add Action Item</button>
            </div>
        `;
    },

    renderDecisionSlide(gatePackage, opportunity) {
        return `
            <h2>Final Decision & Sign-off</h2>
            
            <div class="form-section">
                <label for="final-decision">Final Gate Decision</label>
                <select id="final-decision">
                    <option value="">Select final decision...</option>
                    <option value="proceed" ${gatePackage.finalDecision === 'proceed' ? 'selected' : ''}>Proceed to Next Gate</option>
                    <option value="conditional" ${gatePackage.finalDecision === 'conditional' ? 'selected' : ''}>Conditional Proceed</option>
                    <option value="hold" ${gatePackage.finalDecision === 'hold' ? 'selected' : ''}>Hold</option>
                    <option value="stop" ${gatePackage.finalDecision === 'stop' ? 'selected' : ''}>Stop/No Bid</option>
                </select>
            </div>
            
            <div class="form-section">
                <label for="decision-rationale">Decision Rationale</label>
                <textarea id="decision-rationale" rows="4" placeholder="Explain the rationale for this decision...">${gatePackage.decisionRationale || ''}</textarea>
            </div>
            
            <div class="form-section">
                <h3>Assigned Reviewers</h3>
                <div id="reviewers-container">
                    ${(gatePackage.assignedReviewers || []).map(reviewer => `
                        <div class="list-item">
                            <input type="text" value="${reviewer}" placeholder="Reviewer name">
                            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="GatePackageSlides.addListItem('reviewers-container')" class="btn btn-secondary">Add Reviewer</button>
            </div>
            
            <div class="form-section">
                <label for="review-meeting-date">Review Meeting Date</label>
                <input type="date" id="review-meeting-date" value="${gatePackage.reviewMeetingDate || ''}">
            </div>
            
            <div class="status-update-section">
                <h3>Update Gate Status</h3>
                <select id="gate-status" onchange="GatePackages.updateStatus(${gatePackage.id}, this.value)">
                    <option value="draft" ${gatePackage.status === 'draft' ? 'selected' : ''}>Draft</option>
                    <option value="in-progress" ${gatePackage.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="under-review" ${gatePackage.status === 'under-review' ? 'selected' : ''}>Under Review</option>
                    <option value="approved" ${gatePackage.status === 'approved' ? 'selected' : ''}>Approved</option>
                    <option value="rejected" ${gatePackage.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </div>
        `;
    },

    // Utility functions for slide interactions
    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Activate corresponding button
        const clickedButton = event.target;
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
    },

    addHighlight() {
        const container = document.getElementById('highlights-container');
        const newHighlight = document.createElement('div');
        newHighlight.className = 'highlight-item';
        newHighlight.innerHTML = `
            <input type="text" placeholder="New highlight">
            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
        `;
        container.appendChild(newHighlight);
    },

    addListItem(containerId) {
        const container = document.getElementById(containerId);
        const newItem = document.createElement('div');
        newItem.className = 'list-item';
        newItem.innerHTML = `
            <input type="text" placeholder="New item">
            <button onclick="this.parentElement.remove()" class="btn-remove">Remove</button>
        `;
        container.appendChild(newItem);
    },

    addTableRow(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const headerCells = table.querySelectorAll('thead th');
        
        const newRow = document.createElement('tr');
        
        // Add input cells based on table structure
        for (let i = 0; i < headerCells.length - 1; i++) { // -1 for actions column
            const cell = document.createElement('td');
            
            // Determine input type based on header
            const headerText = headerCells[i].textContent.toLowerCase();
            if (headerText.includes('date')) {
                cell.innerHTML = '<input type="date">';
            } else if (headerText.includes('priority') || headerText.includes('status') || 
                      headerText.includes('influence') || headerText.includes('assessment') || 
                      headerText.includes('category') || headerText.includes('capability') || 
                      headerText.includes('risk')) {
                // Add appropriate select options based on context
                let options = '';
                if (headerText.includes('priority')) {
                    options = '<option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
                } else if (headerText.includes('status')) {
                    options = '<option value="open">Open</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>';
                } else if (headerText.includes('influence')) {
                    options = '<option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
                } else if (headerText.includes('assessment')) {
                    options = '<option value="approved">Approved</option><option value="conditional">Conditional</option><option value="concerns">Concerns</option><option value="rejected">Rejected</option>';
                } else if (headerText.includes('category')) {
                    options = '<option value="technical">Technical</option><option value="functional">Functional</option><option value="performance">Performance</option><option value="compliance">Compliance</option>';
                } else if (headerText.includes('capability')) {
                    options = '<option value="strong">Strong</option><option value="adequate">Adequate</option><option value="weak">Weak</option><option value="gap">Gap</option>';
                } else if (headerText.includes('risk')) {
                    options = '<option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>';
                }
                cell.innerHTML = `<select><option value="">Select...</option>${options}</select>`;
            } else {
                cell.innerHTML = '<input type="text" placeholder="Enter value">';
            }
        }
        
        // Add actions column
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = '<button onclick="this.closest(\'tr\').remove()" class="btn-remove">Remove</button>';
        
        newRow.appendChild(...Array.from({ length: headerCells.length - 1 }, (_, i) => {
            const cell = document.createElement('td');
            const headerText = headerCells[i].textContent.toLowerCase();
            
            if (headerText.includes('date')) {
                cell.innerHTML = '<input type="date">';
            } else if (headerText.includes('priority') || headerText.includes('status') || 
                      headerText.includes('influence') || headerText.includes('assessment') || 
                      headerText.includes('category') || headerText.includes('capability') || 
                      headerText.includes('risk')) {
                let options = '';
                if (headerText.includes('priority')) {
                    options = '<option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
                } else if (headerText.includes('status')) {
                    options = '<option value="open">Open</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>';
                } else if (headerText.includes('influence')) {
                    options = '<option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
                } else if (headerText.includes('assessment')) {
                    options = '<option value="approved">Approved</option><option value="conditional">Conditional</option><option value="concerns">Concerns</option><option value="rejected">Rejected</option>';
                } else if (headerText.includes('category')) {
                    options = '<option value="technical">Technical</option><option value="functional">Functional</option><option value="performance">Performance</option><option value="compliance">Compliance</option>';
                } else if (headerText.includes('capability')) {
                    options = '<option value="strong">Strong</option><option value="adequate">Adequate</option><option value="weak">Weak</option><option value="gap">Gap</option>';
                } else if (headerText.includes('risk')) {
                    options = '<option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>';
                }
                cell.innerHTML = `<select><option value="">Select...</option>${options}</select>`;
            } else {
                cell.innerHTML = '<input type="text" placeholder="Enter value">';
            }
            return cell;
        }));
        
        newRow.appendChild(actionsCell);
        tbody.appendChild(newRow);
    }
};