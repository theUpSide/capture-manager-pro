// Gate Package Slides - Individual slide renderers and data collectors
const GatePackageSlides = {
    // Main render dispatcher (called from generator)
    renderGatePackageSlides(gatePackage, opportunity) {
        const content = document.getElementById('gate-package-content');
        const gateDefinition = GatePackageGenerator.getGateDefinition(gatePackage.gateNumber);
        
        const slidesHTML = `
            <!-- Slide Navigation -->
            <div class="gate-package-nav">
                <button class="btn btn-secondary" onclick="GatePackageGenerator.previousSlide()" id="prevBtn">← Previous</button>
                <span class="slide-counter" id="slideCounter">1 / 8</span>
                <button class="btn btn-secondary" onclick="GatePackageGenerator.nextSlide()" id="nextBtn">Next →</button>
                <div class="gate-package-actions">
                    <button class="btn btn-primary" onclick="GatePackageGenerator.saveGatePackage()">💾 Save</button>
                    <button class="btn btn-success" onclick="GatePackageGenerator.exportGatePackage()">📄 Export</button>
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

            <!-- Slide 8: Summary & Decision -->
            <div class="gate-package-slide" data-slide="8">
                ${this.renderSummaryDecisionSlide(gatePackage, opportunity, gateDefinition)}
            </div>
        `;

        content.innerHTML = slidesHTML;
        GatePackageGenerator.totalSlides = 8;
    },

    // Render Title Slide
    renderTitleSlide(gatePackage, opportunity, gateDefinition) {
        return `
            <div class="slide-header">
                <h1>Gate ${gatePackage.gateNumber} - ${gateDefinition.name}</h1>
                <h2><input type="text" id="title-opp-name" value="${opportunity.name || ''}" /></h2>
                <div class="slide-date">${Utils.formatDate(gatePackage.createdDate)}</div>
                <div class="gate-package-status">
                    <span class="status-badge status-${gatePackage.status}">${gatePackage.status}</span>
                </div>
            </div>
            
            <div class="slide-content">
                <div class="opportunity-overview-grid">
                    <div class="overview-item">
                        <label>Customer</label>
                        <input type="text" id="title-opp-client" value="${opportunity.client || 'TBD'}" />
                    </div>
                    <div class="overview-item">
                        <label>Contract Value</label>
                        <input type="text" id="title-opp-value" value="${Utils.formatCurrency(opportunity.value || 0)}" />
                    </div>
                    <div class="overview-item">
                        <label>Win Probability</label>
                        <input type="text" id="title-opp-probability" value="${opportunity.probability || 'TBD'}%" />
                    </div>
                    <div class="overview-item">
                        <label>Close Date</label>
                        <input type="date" id="title-opp-closeDate" value="${opportunity.closeDate || ''}" />
                    </div>
                    <div class="overview-item">
                        <label>Current Phase</label>
                        <input type="text" id="title-opp-currentPhase" value="${opportunity.currentPhase || 'identification'}" />
                    </div>
                    <div class="overview-item">
                        <label>Business Unit</label>
                        <input type="text" id="title-opp-businessUnit" value="${opportunity.businessUnit || 'Integration & Sustainment'}" />
                    </div>
                </div>
                
                <div class="gate-description">
                    <h3>Gate ${gatePackage.gateNumber} Purpose</h3>
                    <textarea id="title-gate-recap">${gateDefinition.description}</textarea>
                </div>
            </div>
        `;
    },

    // Render Executive Summary Slide
    renderExecutiveSummarySlide(gatePackage, opportunity) {
        const highlightsHTML = gatePackage.executiveSummary.keyHighlights.map((h, index) => `
            <li><input type="text" id="exec-highlight-${index}" value="${h}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        return `
            <h2>Executive Summary Details</h2>
            <textarea id="exec-summary">${gatePackage.executiveSummary.summary}</textarea>
            <h3>Key Highlights</h3>
            <ul id="exec-highlights-list">${highlightsHTML}</ul>
            <button onclick="GatePackageSlides.addListItem('exec-highlights-list')">Add Highlight</button>
        `;
    },

    // Render Business Case Slide
    renderBusinessCaseSlide(gatePackage, opportunity) {
        const strengthsHTML = gatePackage.businessCaseAnalysis.strengths.map((s, index) => `
            <li><input type="text" id="bc-strength-${index}" value="${s}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        const weaknessesHTML = gatePackage.businessCaseAnalysis.weaknesses.map((w, index) => `
            <li><input type="text" id="bc-weakness-${index}" value="${w}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        return `
            <h2>Business Case Analysis</h2>
            <label>Program Alignment</label><textarea id="bc-program-alignment">${gatePackage.businessCaseAnalysis.programAlignment}</textarea>
            <label>Bid Position</label><input type="text" id="bc-bid-position" value="${gatePackage.businessCaseAnalysis.bidPosition}" />
            <label>Teaming Required</label>
            <select id="bc-teaming-required">
                <option value="false" ${!gatePackage.businessCaseAnalysis.teamingRequired ? 'selected' : ''}>No</option>
                <option value="true" ${gatePackage.businessCaseAnalysis.teamingRequired ? 'selected' : ''}>Yes</option>
            </select>
            <h3>Strengths</h3><ul id="bc-strengths-list">${strengthsHTML}</ul><button onclick="GatePackageSlides.addListItem('bc-strengths-list')">Add Strength</button>
            <h3>Weaknesses</h3><ul id="bc-weaknesses-list">${weaknessesHTML}</ul><button onclick="GatePackageSlides.addListItem('bc-weaknesses-list')">Add Weakness</button>
            <label>OCI Concerns</label><textarea id="bc-oci-concerns">${gatePackage.businessCaseAnalysis.ociConcerns}</textarea>
        `;
    },

    // Render Requirements Slide
    renderRequirementsSlide(gatePackage, opportunity) {
        const requirementsHTML = gatePackage.requirements.map((r, index) => `
            <li><textarea id="req-item-${index}">${r}</textarea> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        return `
            <h2>Requirements Analysis</h2>
            <ul id="req-list">${requirementsHTML}</ul>
            <button onclick="GatePackageSlides.addListItem('req-list', true)">Add Requirement</button>
        `;
    },

    // Render Call Plan Slide
    renderCallPlanSlide(gatePackage, opportunity) {
        const keyDecisionMakersHTML = gatePackage.callPlan.keyDecisionMakers.map((kdm, index) => `
            <tr>
                <td><input type="text" id="cp-kdm-name-${index}" value="${kdm.name || ''}" /></td>
                <td><input type="text" id="cp-kdm-role-${index}" value="${kdm.role || ''}" /></td>
                <td><button onclick="GatePackageSlides.removeTableRow(this)">Remove</button></td>
            </tr>
        `).join('');
        const customerVisitsHTML = gatePackage.callPlan.customerVisits.map((cv, index) => `
            <tr>
                <td><input type="date" id="cp-cv-date-${index}" value="${cv.date || ''}" /></td>
                <td><input type="text" id="cp-cv-purpose-${index}" value="${cv.purpose || ''}" /></td>
                <td><button onclick="GatePackageSlides.removeTableRow(this)">Remove</button></td>
            </tr>
        `).join('');
        return `
            <h2>Call Plan</h2>
            <div class="tabs">
                <button onclick="GatePackageSlides.switchTab('cp-tab1')" class="active">Key Decision Makers</button>
                <button onclick="GatePackageSlides.switchTab('cp-tab2')">Customer Visits</button>
                <button onclick="GatePackageSlides.switchTab('cp-tab3')">Statements & Preferences</button>
            </div>
            <div id="cp-tab1" class="tab-content" style="display: block;">
                <table>
                    <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody id="cp-kdm-table">${keyDecisionMakersHTML}</tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('cp-kdm-table', ['name', 'role'])">Add Decision Maker</button>
            </div>
            <div id="cp-tab2" class="tab-content" style="display: none;">
                <table>
                    <thead><tr><th>Date</th><th>Purpose</th><th>Actions</th></tr></thead>
                    <tbody id="cp-cv-table">${customerVisitsHTML}</tbody>
                </table>
                <button onclick="GatePackageSlides.addTableRow('cp-cv-table', ['date', 'purpose'])">Add Visit</button>
            </div>
            <div id="cp-tab3" class="tab-content" style="display: none;">
                <label>Customer Statement</label><textarea id="cp-customer-statement">${gatePackage.callPlan.customerStatement}</textarea>
                <label>Customer Preferences</label><textarea id="cp-customer-preferences">${gatePackage.callPlan.customerPreferences}</textarea>
                <label>Customer Reaction</label><textarea id="cp-customer-reaction">${gatePackage.callPlan.customerReaction}</textarea>
            </div>
        `;
    },

    // Render Proposal Slide
    renderProposalSlide(gatePackage, opportunity) {
        const deliverablesHTML = gatePackage.proposal.contractDeliverables.map((d, index) => `
            <li><input type="text" id="prop-deliv-${index}" value="${d}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        const volumesHTML = gatePackage.proposal.proposalVolumes.map((v, index) => `
            <li><input type="text" id="prop-vol-${index}" value="${v}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        const criteriaHTML = gatePackage.proposal.selectionCriteria.map((c, index) => `
            <li><input type="text" id="prop-crit-${index}" value="${c}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        const timelineKeys = Object.keys(gatePackage.proposal.timeline);
        const timelineHTML = timelineKeys.map((key, index) => `
            <div>
                <input type="text" id="prop-tl-key-${index}" value="${key}" />
                <input type="date" id="prop-tl-val-${index}" value="${gatePackage.proposal.timeline[key]}" />
                <button onclick="GatePackageSlides.removeTimelineItem(this)">Remove</button>
            </div>
        `).join('');
        return `
            <h2>Proposal Information</h2>
            <div class="tabs">
                <button onclick="GatePackageSlides.switchTab('prop-tab1')" class="active">Deliverables</button>
                <button onclick="GatePackageSlides.switchTab('prop-tab2')">Volumes</button>
                <button onclick="GatePackageSlides.switchTab('prop-tab3')">Criteria</button>
                <button onclick="GatePackageSlides.switchTab('prop-tab4')">Timeline</button>
            </div>
            <div id="prop-tab1" class="tab-content" style="display: block;">
                <ul id="prop-deliv-list">${deliverablesHTML}</ul>
                <button onclick="GatePackageSlides.addListItem('prop-deliv-list')">Add Deliverable</button>
            </div>
            <div id="prop-tab2" class="tab-content" style="display: none;">
                <ul id="prop-vol-list">${volumesHTML}</ul>
                <button onclick="GatePackageSlides.addListItem('prop-vol-list')">Add Volume</button>
            </div>
            <div id="prop-tab3" class="tab-content" style="display: none;">
                <ul id="prop-crit-list">${criteriaHTML}</ul>
                <button onclick="GatePackageSlides.addListItem('prop-crit-list')">Add Criterion</button>
            </div>
            <div id="prop-tab4" class="tab-content" style="display: none;">
                <div id="prop-tl-list">${timelineHTML}</div>
                <button onclick="GatePackageSlides.addTimelineItem('prop-tl-list')">Add Timeline Item</button>
            </div>
        `;
    },

    // Render Market Assessment Slide
    renderMarketAssessmentSlide(gatePackage, opportunity) {
        return `
            <h2>Market Assessment</h2>
            <label>Market Intelligence</label><textarea id="ma-market-intel">${gatePackage.marketAssessment.marketIntelligence}</textarea>
            <label>Competitive Analysis</label><textarea id="ma-comp-analysis">${gatePackage.marketAssessment.competitiveAnalysis}</textarea>
            <label>Investment Details</label><textarea id="ma-invest-details">${gatePackage.marketAssessment.investmentDetails}</textarea>
        `;
    },

    // Render Pricing Slide
    renderPricingSlide(gatePackage, opportunity) {
        const risksHTML = gatePackage.pricing.risks.map((r, index) => `
            <li><input type="text" id="price-risk-${index}" value="${r}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        const leversHTML = gatePackage.pricing.pricingLevers.map((l, index) => `
            <li><input type="text" id="price-lever-${index}" value="${l}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
        `).join('');
        return `
            <h2>Pricing Analysis</h2>
            <label>Pro Forma Cost Estimate</label><textarea id="price-proforma">${JSON.stringify(gatePackage.pricing.proFormaCostEstimate)}</textarea>
            <label>Green Team Pricing</label><textarea id="price-green">${JSON.stringify(gatePackage.pricing.greenTeamPricing)}</textarea>
            <h3>Risks</h3><ul id="price-risks-list">${risksHTML}</ul><button onclick="GatePackageSlides.addListItem('price-risks-list')">Add Risk</button>
            <label>Price to Win</label><input type="number" id="price-ptw" value="${gatePackage.pricing.priceToWin || ''}" />
            <h3>Pricing Levers</h3><ul id="price-levers-list">${leversHTML}</ul><button onclick="GatePackageSlides.addListItem('price-levers-list')">Add Lever</button>
        `;
    },

    // Render Functional Reviews Slide
    renderFunctionalReviewsSlide(gatePackage, opportunity) {
        const reviews = ['pricing', 'contracting', 'programManagement', 'security', 'humanResources', 'quality'];
        const tabsHTML = reviews.map((review, index) => `
            <button onclick="GatePackageSlides.switchTab('fr-tab${index + 1}')" ${index === 0 ? 'class="active"' : ''}>${review.charAt(0).toUpperCase() + review.slice(1)}</button>
        `).join('');
        const contentsHTML = reviews.map((review, index) => `
            <div id="fr-tab${index + 1}" class="tab-content" style="${index === 0 ? 'display: block;' : 'display: none;'}">
                <label>Reviewer</label><input type="text" id="fr-${review}-reviewer" value="${gatePackage.functionalReviews[review].reviewer}" />
                <label>Assessment</label><textarea id="fr-${review}-assessment">${gatePackage.functionalReviews[review].assessment}</textarea>
                <h3>Concerns</h3>
                <ul id="fr-${review}-concerns-list">
                    ${gatePackage.functionalReviews[review].concerns.map((c, cIndex) => `
                        <li><input type="text" id="fr-${review}-concern-${cIndex}" value="${c}" /> <button onclick="GatePackageSlides.removeListItem(this)">Remove</button></li>
                    `).join('')}
                </ul>
                <button onclick="GatePackageSlides.addListItem('fr-${review}-concerns-list')">Add Concern</button>
            </div>
        `).join('');
        return `
            <h2>Functional Reviews</h2>
            <div class="tabs">${tabsHTML}</div>
            ${contentsHTML}
        `;
    },

    // Render Team Slide
    renderTeamSlide(gatePackage, opportunity) {
        return `
            <h2>Team Assignment</h2>
            <label>Lead Investigators</label><input type="text" id="team-lead-invest" value="${gatePackage.teamAssignment.leadInvestigators.join(', ')}" />
            <label>Proposal Manager</label><input type="text" id="team-prop-mgr" value="${gatePackage.teamAssignment.proposalManager}" />
            <label>Program Management</label><input type="text" id="team-prog-mgt" value="${gatePackage.teamAssignment.programManagement}" />
            <label>Contracts Lead</label><input type="text" id="team-cont-lead" value="${gatePackage.teamAssignment.contractsLead}" />
            <label>Pricing Team Lead</label><input type="text" id="team-price-lead" value="${gatePackage.teamAssignment.pricingTeamLead}" />
            <label>Pricing Team</label><input type="text" id="team-price-team" value="${gatePackage.teamAssignment.pricingTeam.join(', ')}" />
        `;
    },

    // Render Action Items Slide
    renderActionItemsSlide(gatePackage, opportunity) {
        const actionsHTML = gatePackage.actionItems.map((a, index) => `
            <tr>
                <td><input type="text" id="ai-title-${index}" value="${a.title}" /></td>
                <td><input type="text" id="ai-assignee-${index}" value="${a.assignee}" /></td>
                <td><input type="date" id="ai-due-${index}" value="${a.dueDate}" /></td>
                <td><select id="ai-status-${index}"><option value="pending" ${a.status === 'pending' ? 'selected' : ''}>Pending</option><option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option></select></td>
                <td><select id="ai-priority-${index}"><option value="high" ${a.priority === 'high' ? 'selected' : ''}>High</option><option value="medium" ${a.priority === 'medium' ? 'selected' : ''}>Medium</option><option value="low" ${a.priority === 'low' ? 'selected' : ''}>Low</option></select></td>
                <td><button onclick="GatePackageSlides.removeTableRow(this)">Remove</button></td>
            </tr>
        `).join('');
        return `
            <h2>Action Items</h2>
            <table>
                <thead><tr><th>Title</th><th>Assignee</th><th>Due Date</th><th>Status</th><th>Priority</th><th>Actions</th></tr></thead>
                <tbody id="ai-table">${actionsHTML}</tbody>
            </table>
            <button onclick="GatePackageSlides.addTableRow('ai-table', ['title', 'assignee', 'due', 'status', 'priority'])">Add Action Item</button>
        `;
    },

    // Render Summary & Decision Slide
    renderSummaryDecisionSlide(gatePackage, opportunity, gateDefinition) {
        return `
            <h2>Summary & Decision</h2>
            <textarea id="sum-gate-recap">${gatePackage.executiveSummary.gateRecap}</textarea>
            <label>Decision</label>
            <select id="sum-decision">
                <option value="null" ${!gatePackage.executiveSummary.decision ? 'selected' : ''}>Select Decision</option>
                <option value="approve" ${gatePackage.executiveSummary.decision === 'approve' ? 'selected' : ''}>Approve</option>
                <option value="reject" ${gatePackage.executiveSummary.decision === 'reject' ? 'selected' : ''}>Reject</option>
                <option value="hold" ${gatePackage.executiveSummary.decision === 'hold' ? 'selected' : ''}>Hold</option>
            </select>
            <label>Review Meeting Date</label><input type="date" id="sum-review-date" value="${gatePackage.reviewMeetingDate || ''}" />
            <label>Assigned Reviewers</label><input type="text" id="sum-reviewers" value="${gatePackage.assignedReviewers.join(', ')}" />
            <label>Attendees</label><input type="text" id="sum-attendees" value="${gatePackage.attendees.join(', ')}" />
        `;
    },

    // Dynamic helpers
    switchTab(tabId) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.style.display = 'none');
        document.getElementById(tabId).style.display = 'block';
        const buttons = document.querySelectorAll('.tabs button');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    },

    addListItem(listId, isTextarea = false) {
        const list = document.getElementById(listId);
        const li = document.createElement('li');
        const inputType = isTextarea ? 'textarea' : 'input';
        const input = document.createElement(inputType);
        if (!isTextarea) input.type = 'text';
        li.appendChild(input);
        li.innerHTML += ' <button onclick="GatePackageSlides.removeListItem(this)">Remove</button>';
        list.appendChild(li);
    },

    removeListItem(btn) {
        btn.parentElement.remove();
    },

    addTableRow(tableId, fields) {
        const tbody = document.getElementById(tableId);
        const tr = document.createElement('tr');
        fields.forEach(field => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = field === 'due' ? 'date' : field === 'status' || field === 'priority' ? 'text' : 'text'; // Simplify for add
            td.appendChild(input);
            tr.appendChild(td);
        });
        const actionTd = document.createElement('td');
        actionTd.innerHTML = '<button onclick="GatePackageSlides.removeTableRow(this)">Remove</button>';
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    },

    removeTableRow(btn) {
        btn.closest('tr').remove();
    },

    addTimelineItem(listId) {
        const list = document.getElementById(listId);
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="text" value="" />
            <input type="date" value="" />
            <button onclick="GatePackageSlides.removeTimelineItem(this)">Remove</button>
        `;
        list.appendChild(div);
    },

    removeTimelineItem(btn) {
        btn.parentElement.remove();
    },

    // Collectors
    collectExecutiveSummary(gatePackage) {
        gatePackage.executiveSummary.summary = document.getElementById('exec-summary')?.value || '';
        gatePackage.executiveSummary.keyHighlights = Array.from(document.querySelectorAll('#exec-highlights-list input')).map(i => i.value).filter(v => v.trim());
    },

    collectBusinessCaseAnalysis(gatePackage) {
        gatePackage.businessCaseAnalysis.programAlignment = document.getElementById('bc-program-alignment')?.value || '';
        gatePackage.businessCaseAnalysis.bidPosition = document.getElementById('bc-bid-position')?.value || '';
        gatePackage.businessCaseAnalysis.teamingRequired = document.getElementById('bc-teaming-required')?.value === 'true';
        gatePackage.businessCaseAnalysis.strengths = Array.from(document.querySelectorAll('#bc-strengths-list input')).map(i => i.value).filter(v => v.trim());
        gatePackage.businessCaseAnalysis.weaknesses = Array.from(document.querySelectorAll('#bc-weaknesses-list input')).map(i => i.value).filter(v => v.trim());
        gatePackage.businessCaseAnalysis.ociConcerns = document.getElementById('bc-oci-concerns')?.value || '';
    },

    collectTeamAssignment(gatePackage) {
        gatePackage.teamAssignment.leadInvestigators = document.getElementById('team-lead-invest')?.value.split(',').map(s => s.trim()) || [];
        gatePackage.teamAssignment.proposalManager = document.getElementById('team-prop-mgr')?.value || '';
        gatePackage.teamAssignment.programManagement = document.getElementById('team-prog-mgt')?.value || '';
        gatePackage.teamAssignment.contractsLead = document.getElementById('team-cont-lead')?.value || '';
        gatePackage.teamAssignment.pricingTeamLead = document.getElementById('team-price-lead')?.value || '';
        gatePackage.teamAssignment.pricingTeam = document.getElementById('team-price-team')?.value.split(',').map(s => s.trim()) || [];
    },

    collectActionItems(gatePackage) {
        const rows = document.querySelectorAll('#ai-table tr');
        gatePackage.actionItems = Array.from(rows).map(row => {
            const inputs = row.querySelectorAll('input, select');
            if (inputs.length < 5) return null;
            return {
                title: inputs[0].value,
                assignee: inputs[1].value,
                dueDate: inputs[2].value,
                status: inputs[3].value,
                priority: inputs[4].value
            };
        }).filter(a => a);
    },

    collectMarketAssessment(gatePackage) {
        gatePackage.marketAssessment.marketIntelligence = document.getElementById('ma-market-intel')?.value || '';
        gatePackage.marketAssessment.competitiveAnalysis = document.getElementById('ma-comp-analysis')?.value || '';
        gatePackage.marketAssessment.investmentDetails = document.getElementById('ma-invest-details')?.value || '';
    },

    collectCallPlan(gatePackage) {
        gatePackage.callPlan.keyDecisionMakers = Array.from(document.querySelectorAll('#cp-kdm-table tr')).map(tr => {
            const inputs = tr.querySelectorAll('input');
            return { name: inputs[0]?.value, role: inputs[1]?.value };
        }).filter(k => k.name || k.role);
        gatePackage.callPlan.customerVisits = Array.from(document.querySelectorAll('#cp-cv-table tr')).map(tr => {
            const inputs = tr.querySelectorAll('input');
            return { date: inputs[0]?.value, purpose: inputs[1]?.value };
        }).filter(v => v.date || v.purpose);
        gatePackage.callPlan.customerStatement = document.getElementById('cp-customer-statement')?.value || '';
        gatePackage.callPlan.customerPreferences = document.getElementById('cp-customer-preferences')?.value || '';
        gatePackage.callPlan.customerReaction = document.getElementById('cp-customer-reaction')?.value || '';
    },

    collectProposal(gatePackage) {
        gatePackage.proposal.contractDeliverables = Array.from(document.querySelectorAll('#prop-deliv-list input')).map(i => i.value).filter(v => v.trim());
        gatePackage.proposal.proposalVolumes = Array.from(document.querySelectorAll('#prop-vol-list input')).map(i => i.value).filter(v => v.trim());
        gatePackage.proposal.selectionCriteria = Array.from(document.querySelectorAll('#prop-crit-list input')).map(i => i.value).filter(v => v.trim());
        const tlDivs = document.querySelectorAll('#prop-tl-list div');
        gatePackage.proposal.timeline = {};
        tlDivs.forEach(div => {
            const inputs = div.querySelectorAll('input');
            if (inputs[0].value) gatePackage.proposal.timeline[inputs[0].value] = inputs[1].value;
        });
    },

    collectPricing(gatePackage) {
        try {
            gatePackage.pricing.proFormaCostEstimate = JSON.parse(document.getElementById('price-proforma')?.value || '{}');
        } catch (e) {
            gatePackage.pricing.proFormaCostEstimate = {};
        }
        try {
            gatePackage.pricing.greenTeamPricing = JSON.parse(document.getElementById('price-green')?.value || '{}');
        } catch (e) {
            gatePackage.pricing.greenTeamPricing = {};
        }
        gatePackage.pricing.risks = Array.from(document.querySelectorAll('#price-risks-list input')).map(i => i.value).filter(v => v.trim());
        gatePackage.pricing.priceToWin = parseFloat(document.getElementById('price-ptw')?.value) || null;
        gatePackage.pricing.pricingLevers = Array.from(document.querySelectorAll('#price-levers-list input')).map(i => i.value).filter(v => v.trim());
    },

    collectFunctionalReviews(gatePackage) {
        const reviews = ['pricing', 'contracting', 'programManagement', 'security', 'humanResources', 'quality'];
        reviews.forEach(review => {
            gatePackage.functionalReviews[review].reviewer = document.getElementById(`fr-${review}-reviewer`)?.value || '';
            gatePackage.functionalReviews[review].assessment = document.getElementById(`fr-${review}-assessment`)?.value || '';
            gatePackage.functionalReviews[review].concerns = Array.from(document.querySelectorAll(`#fr-${review}-concerns-list input`)).map(i => i.value).filter(v => v.trim());
        });
    },

    collectRequirements(gatePackage) {
        gatePackage.requirements = Array.from(document.querySelectorAll('#req-list textarea')).map(t => t.value).filter(v => v.trim());
    },

    collectSummaryDecision(gatePackage) {
        gatePackage.executiveSummary.gateRecap = document.getElementById('sum-gate-recap')?.value || '';
        gatePackage.executiveSummary.decision = document.getElementById('sum-decision')?.value || null;
        gatePackage.reviewMeetingDate = document.getElementById('sum-review-date')?.value || null;
        gatePackage.assignedReviewers = document.getElementById('sum-reviewers')?.value.split(',').map(s => s.trim()) || [];
        gatePackage.attendees = document.getElementById('sum-attendees')?.value.split(',').map(s => s.trim()) || [];
    }
};