// Gate Package Generator - Core logic for creating and managing gate packages
const GatePackageGenerator = {
    gateDefinitions: {
        1: {
            name: "Gate 1: Opportunity Qualification",
            description: "Assess opportunity viability and alignment",
            requiredTemplates: ["opportunity-qualification-scorecard"],
            requiredActions: ["customer-relationship", "capability-gap", "bid-no-bid"],
            requiredNotesKeywords: ["customer feedback", "market analysis"]
        },
        2: {
            name: "Gate 2: Capture Planning",
            description: "Develop initial capture strategy",
            requiredTemplates: ["capture-plan-template"],
            requiredActions: ["team-assembly", "capture-plan"],
            requiredNotesKeywords: ["strategy session", "resource allocation"]
        },
        3: {
            name: "Gate 3: Strategy Validation",
            description: "Validate win strategy and solution",
            requiredTemplates: ["win-theme-development", "solution-development-framework"],
            requiredActions: ["engagement-plan", "customer-meetings", "black-hat-analysis"],
            requiredNotesKeywords: ["win themes", "solution review"]
        },
        4: {
            name: "Gate 4: Proposal Readiness",
            description: "Final pre-RFP preparation and review",
            requiredTemplates: ["ptw-analysis-workbook", "execution-readiness-review"],
            requiredActions: ["teaming-finalization", "proposal-team", "capture-handoff"],
            requiredNotesKeywords: ["final review", "readiness assessment"]
        }
    },

    createGatePackage(opportunityId, gateNumber) {
        const opportunity = DataStore.getOpportunity(opportunityId);
        if (!opportunity) {
            alert('Opportunity not found');
            return null;
        }

        const gateDefinition = this.getGateDefinition(gateNumber);
        if (!gateDefinition) {
            alert('Invalid gate number');
            return null;
        }

        const newPackage = {
            id: Date.now(),
            opportunityId: parseInt(opportunityId),
            gateNumber: gateNumber,
            status: 'draft',
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            executiveSummary: this.generateExecutiveSummary(opportunity, gateDefinition),
            businessCaseAnalysis: this.generateBusinessCaseAnalysis(opportunity, gateDefinition),
            teamAssignment: this.generateTeamAssignment(opportunity),
            actionItems: this.generateActionItems(opportunity),
            marketAssessment: this.generateMarketAssessment(opportunity),
            callPlan: this.generateCallPlan(opportunity),
            proposal: this.generateProposal(opportunity),
            pricing: this.generatePricing(opportunity),
            functionalReviews: this.generateFunctionalReviews(opportunity),
            requirements: this.generateRequirements(opportunity),
            assignedReviewers: [],
            attendees: [],
            reviewMeetingDate: null
        };

        DataStore.gatePackages.push(newPackage);
        DataStore.saveData();

        return newPackage;
    },

    generateExecutiveSummary(opportunity, gateDefinition) {
        const safeNotes = Array.isArray(opportunity.notes) ? opportunity.notes : [];
        
        const recentNotes = safeNotes.filter(note => 
            note && note.timestamp && note.content && typeof note.content === 'string' &&
            -Utils.calculateDaysUntilDate(note.timestamp) <= 30  // Calc days since as positive for past dates
        ).map(note => `- [${Utils.formatDate(note.timestamp)}] ${note.content}`).join('\n');

        const completedTemplates = (opportunity.completedTemplates || []).filter(ct => 
            gateDefinition.requiredTemplates.includes(ct.templateId)
        ).map(ct => ct.templateTitle).join(', ');

        const completedActions = DataStore.actions.filter(a => 
            a.opportunityId === opportunity.id && 
            gateDefinition.requiredActions.includes(a.stepId) && 
            a.completed
        ).map(a => a.title).join(', ');

        const keyNotes = safeNotes.filter(note => 
            note && note.content && typeof note.content === 'string' &&
            gateDefinition.requiredNotesKeywords.some(keyword => 
                note.content.toLowerCase().includes(keyword.toLowerCase())
            )
        ).map(note => `- [${Utils.formatDate(note.timestamp)}] ${note.content}`).join('\n');

        return {
            summary: `Gate ${gateDefinition.name} for ${opportunity.name}. Current progress: ${opportunity.progress}%.`,
            keyHighlights: [
                `Completed required templates: ${completedTemplates || 'None'}`,
                `Completed required actions: ${completedActions || 'None'}`,
                `Recent relevant notes: ${keyNotes || 'None'}`
            ],
            gateRecap: '',
            decision: null
        };
    },

    generateBusinessCaseAnalysis(opportunity, gateDefinition) {
        return {
            programAlignment: opportunity.description,
            bidPosition: 'Strong',
            teamingRequired: false,
            strengths: ['Relevant experience', 'Strong customer relationship'],
            weaknesses: ['Potential competition from incumbents'],
            ociConcerns: 'None identified'
        };
    },

    generateTeamAssignment(opportunity) {
        return {
            leadInvestigators: [],
            proposalManager: '',
            programManagement: '',
            contractsLead: '',
            pricingTeamLead: '',
            pricingTeam: []
        };
    },

    generateActionItems(opportunity) {
        return DataStore.actions.filter(a => a.opportunityId === opportunity.id && !a.completed);
    },

    generateMarketAssessment(opportunity) {
        return {
            marketIntelligence: '',
            competitiveAnalysis: '',
            investmentDetails: ''
        };
    },

    generateCallPlan(opportunity) {
        return {
            keyDecisionMakers: [],
            customerVisits: [],
            customerStatement: '',
            customerPreferences: '',
            customerReaction: ''
        };
    },

    generateProposal(opportunity) {
        return {
            contractDeliverables: [],
            proposalVolumes: [],
            selectionCriteria: [],
            timeline: {}
        };
    },

    generatePricing(opportunity) {
        return {
            proFormaCostEstimate: {},
            greenTeamPricing: {},
            risks: [],
            priceToWin: null,
            pricingLevers: []
        };
    },

    generateFunctionalReviews(opportunity) {
        return {
            pricing: { reviewer: '', assessment: '', concerns: [] },
            contracting: { reviewer: '', assessment: '', concerns: [] },
            programManagement: { reviewer: '', assessment: '', concerns: [] },
            security: { reviewer: '', assessment: '', concerns: [] },
            humanResources: { reviewer: '', assessment: '', concerns: [] },
            quality: { reviewer: '', assessment: '', concerns: [] }
        };
    },

    generateRequirements(opportunity) {
        return [];
    },

    getGateDefinition(gateNumber) {
        return this.gateDefinitions[gateNumber];
    },

    openGatePackage(packageId) {
        const gatePackage = DataStore.gatePackages.find(gp => gp.id === packageId);
        if (!gatePackage) {
            alert('Gate package not found');
            return;
        }

        const opportunity = DataStore.getOpportunity(gatePackage.opportunityId);
        if (!opportunity) {
            alert('Associated opportunity not found');
            return;
        }

        const modal = document.getElementById('gatePackageModal');
        if (!modal) {
            console.error('Gate package modal not found - add to HTML');
            return;
        }

        const content = document.getElementById('gate-package-content');
        GatePackageSlides.renderGatePackageSlides(gatePackage, opportunity);

        modal.style.display = 'block';
    },

    closeGatePackage() {
        const modal = document.getElementById('gatePackageModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    saveGatePackage() {
        // Implementation for saving
        alert('Gate package saved');
    },

    exportGatePackage() {
        // Implementation for exporting
        alert('Gate package exported');
    },

    previousSlide() {
        // Slide navigation
    },

    nextSlide() {
        // Slide navigation
    },

    totalSlides: 8
};