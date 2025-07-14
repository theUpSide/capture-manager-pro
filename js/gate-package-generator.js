// Gate Package Generator - Core logic for creating and managing gate packages
const GatePackageGenerator = {
    currentSlide: 1,
    totalSlides: 8,
    currentPackage: null,

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
        console.log('Creating gate package for opportunity:', opportunityId, 'gate:', gateNumber);
        
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

        // Check if gate package already exists
        const existing = DataStore.gatePackages.find(gp => 
            gp.opportunityId == opportunityId && gp.gateNumber === gateNumber
        );
        
        if (existing) {
            if (confirm('A gate package already exists for this gate. Do you want to open the existing one?')) {
                return existing;
            } else {
                return null;
            }
        }

        const newPackage = {
            id: Date.now(),
            opportunityId: parseInt(opportunityId),
            gateNumber: gateNumber,
            status: 'draft',
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            
            // Initialize all required sections
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

        // Initialize gate packages array if it doesn't exist
        if (!DataStore.gatePackages) {
            DataStore.gatePackages = [];
        }

        DataStore.gatePackages.push(newPackage);
        DataStore.saveData();

        console.log('Created gate package:', newPackage);
        return newPackage;
    },

    openGatePackage(packageId) {
        console.log('Opening gate package with ID:', packageId);
        
        // Convert to number for comparison since IDs are stored as numbers
        const numericId = typeof packageId === 'string' ? parseInt(packageId) : packageId;
        
        const gatePackage = DataStore.gatePackages.find(gp => gp.id === numericId);
        if (!gatePackage) {
            console.error('Gate package not found. Available packages:', DataStore.gatePackages);
            alert('Gate package not found. ID: ' + packageId);
            return;
        }

        const opportunity = DataStore.getOpportunity(gatePackage.opportunityId);
        if (!opportunity) {
            alert('Associated opportunity not found');
            return;
        }

        const modal = document.getElementById('gatePackageModal');
        if (!modal) {
            console.error('Gate package modal not found - check HTML');
            alert('Gate package modal not found. Please check that the modal HTML is properly included.');
            return;
        }

        // Store current package for navigation
        this.currentPackage = gatePackage;
        this.currentSlide = 1;

        // Render the gate package content
        const content = document.getElementById('gate-package-content');
        if (!content) {
            console.error('Gate package content container not found');
            return;
        }

        GatePackageSlides.renderGatePackageSlides(gatePackage, opportunity);
        
        // Show the modal
        modal.style.display = 'block';
        
        // Update slide navigation
        this.updateSlideNavigation();
        
        console.log('Gate package opened successfully');
    },

    closeGatePackage() {
        const modal = document.getElementById('gatePackageModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentPackage = null;
        this.currentSlide = 1;
    },

    saveGatePackage() {
        if (!this.currentPackage) {
            alert('No gate package is currently open');
            return;
        }

        try {
            // Collect data from all form fields in the current slides
            this.collectSlideData();
            
            // Update last modified date
            this.currentPackage.lastModified = new Date().toISOString().split('T')[0];
            
            // Save to DataStore
            DataStore.saveData();
            
            // Show success message
            this.showSuccessMessage('Gate package saved successfully');
            
            console.log('Gate package saved:', this.currentPackage);
        } catch (error) {
            console.error('Error saving gate package:', error);
            alert('Error saving gate package: ' + error.message);
        }
    },

    collectSlideData() {
        // Collect data from form fields in all slides
        const slides = document.querySelectorAll('.gate-package-slide');
        
        slides.forEach(slide => {
            const inputs = slide.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.id && this.currentPackage) {
                    // Map input IDs to package properties
                    this.updatePackageProperty(input.id, input.value);
                }
            });
        });
    },

    updatePackageProperty(inputId, value) {
        // Map input IDs to package properties
        // This is a simplified version - you can expand this based on your form structure
        const propertyMap = {
            'exec-summary': 'executiveSummary.summary',
            'exec-highlights': 'executiveSummary.keyHighlights',
            'business-alignment': 'businessCaseAnalysis.programAlignment',
            'bid-position': 'businessCaseAnalysis.bidPosition'
            // Add more mappings as needed
        };

        const property = propertyMap[inputId];
        if (property && this.currentPackage) {
            // Handle nested properties
            const parts = property.split('.');
            let target = this.currentPackage;
            
            for (let i = 0; i < parts.length - 1; i++) {
                if (!target[parts[i]]) {
                    target[parts[i]] = {};
                }
                target = target[parts[i]];
            }
            
            target[parts[parts.length - 1]] = value;
        }
    },

    exportGatePackage() {
        if (!this.currentPackage) {
            alert('No gate package is currently open');
            return;
        }

        try {
            const dataStr = JSON.stringify(this.currentPackage, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `gate-${this.currentPackage.gateNumber}-${this.currentPackage.opportunityId}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showSuccessMessage('Gate package exported successfully');
        } catch (error) {
            console.error('Error exporting gate package:', error);
            alert('Error exporting gate package: ' + error.message);
        }
    },

    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.showSlide(this.currentSlide);
            this.updateSlideNavigation();
        }
    },

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.showSlide(this.currentSlide);
            this.updateSlideNavigation();
        }
    },

    showSlide(slideNumber) {
        // Hide all slides
        const slides = document.querySelectorAll('.gate-package-slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show the target slide
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }
    },

    updateSlideNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const slideCounter = document.getElementById('slideCounter');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
        
        if (slideCounter) {
            slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        }
    },

    showSuccessMessage(message) {
        // Create a temporary success message
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    },

    getGateDefinition(gateNumber) {
        return this.gateDefinitions[gateNumber];
    },

    // Data generation methods
    generateExecutiveSummary(opportunity, gateDefinition) {
        const safeNotes = Array.isArray(opportunity.notes) ? opportunity.notes : [];
        
        const recentNotes = safeNotes
            .filter(note => note && note.timestamp && note.content)
            .slice(0, 5) // Get recent notes
            .map(note => `- [${Utils.formatDate(note.timestamp)}] ${note.content}`)
            .join('\n');

        const completedTemplates = (opportunity.completedTemplates || [])
            .filter(ct => gateDefinition.requiredTemplates.includes(ct.templateId))
            .map(ct => ct.templateTitle)
            .join(', ');

        const completedActions = DataStore.actions
            .filter(a => a.opportunityId === opportunity.id && a.completed)
            .map(a => a.title)
            .join(', ');

        return {
            summary: `${gateDefinition.name} for ${opportunity.name}. Current progress: ${opportunity.progress}%.`,
            keyHighlights: [
                `Completed templates: ${completedTemplates || 'None'}`,
                `Completed actions: ${completedActions || 'None'}`,
                `Recent activity: ${recentNotes || 'None'}`
            ],
            gateRecap: '',
            decision: null
        };
    },

    generateBusinessCaseAnalysis(opportunity, gateDefinition) {
        return {
            programAlignment: opportunity.description || 'To be determined',
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
            priceToWin: opportunity.value || null,
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
    }
};