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

        // Clear existing content and render new content
        content.innerHTML = '';
        
        try {
            if (typeof GatePackageSlides !== 'undefined') {
                GatePackageSlides.renderGatePackageSlides(gatePackage, opportunity);
            } else {
                console.error('GatePackageSlides not found - check if gate-package-slides.js is loaded');
                this.renderBasicContent(content, gatePackage, opportunity);
            }
        } catch (error) {
            console.error('Error rendering slides:', error);
            this.renderBasicContent(content, gatePackage, opportunity);
        }
        
        // IMPROVED MODAL DISPLAY LOGIC
        this.showModal(modal);
        
        // Update slide navigation
        this.updateSlideNavigation();
        
        console.log('Gate package opened successfully');
    },

    // NEW: Dedicated method to show the modal with multiple fallbacks
    showModal(modal) {
        // Method 1: CSS class approach
        modal.classList.add('showing', 'active');
        modal.classList.remove('hidden', 'hide', 'd-none');
        
        // Method 2: Direct style setting with specific CSS text
        modal.style.cssText = `
            display: block !important;
            position: fixed !important;
            z-index: 2000 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.6) !important;
            overflow: auto !important;
        `;
        
        // Method 3: Individual style properties
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = '2000';
        
        // Method 4: Set data attributes for CSS targeting
        modal.setAttribute('data-state', 'open');
        modal.setAttribute('aria-hidden', 'false');
        
        // Method 5: Body class for additional CSS support
        document.body.classList.add('modal-open', 'gate-package-open');
        
        // Method 6: Force reflow and ensure visibility
        modal.offsetHeight; // Force reflow
        modal.scrollTop = 0;
        
        // Method 7: Focus management for accessibility
        modal.focus();
        
        // Method 8: Backup verification after short delay
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(modal);
            if (computedStyle.display === 'none') {
                console.warn('Modal still hidden after display attempts, applying emergency fix');
                this.emergencyShowModal(modal);
            }
        }, 50);
    },

    // Emergency method if all else fails
    emergencyShowModal(modal) {
        // Create a new style element with very high specificity
        const emergencyStyle = document.createElement('style');
        emergencyStyle.id = 'gate-package-emergency-style';
        emergencyStyle.innerHTML = `
            #gatePackageModal.gate-package-modal {
                display: block !important;
                position: fixed !important;
                z-index: 99999 !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background-color: rgba(0, 0, 0, 0.8) !important;
            }
        `;
        
        // Remove any existing emergency style
        const existingEmergencyStyle = document.getElementById('gate-package-emergency-style');
        if (existingEmergencyStyle) {
            existingEmergencyStyle.remove();
        }
        
        // Add the emergency style
        document.head.appendChild(emergencyStyle);
        
        console.log('Emergency modal display style applied');
    },

    closeGatePackage() {
        const modal = document.getElementById('gatePackageModal');
        if (modal) {
            // Remove all showing classes and styles
            modal.classList.remove('showing', 'active');
            modal.style.display = 'none';
            modal.setAttribute('data-state', 'closed');
            modal.setAttribute('aria-hidden', 'true');
        }
        
        // Remove body classes
        document.body.classList.remove('modal-open', 'gate-package-open');
        
        // Remove emergency styles if they exist
        const emergencyStyle = document.getElementById('gate-package-emergency-style');
        if (emergencyStyle) {
            emergencyStyle.remove();
        }
        
        // Reset state
        this.currentPackage = null;
        this.currentSlide = 1;
    },

    // Fallback content renderer (keep your existing renderBasicContent method here)
    renderBasicContent(content, gatePackage, opportunity) {
        // Your existing renderBasicContent method code here
        console.log('Rendering basic fallback content');
        
        const gateDefinition = this.getGateDefinition(gatePackage.gateNumber) || {
            name: `Gate ${gatePackage.gateNumber}`,
            description: 'Gate review package'
        };
        
        const basicHTML = `
            <div style="padding: 2rem; background: white; color: black; min-height: 400px;">
                <div style="background: #2a5298; color: white; padding: 1rem; margin: -2rem -2rem 2rem -2rem; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: white;">${gateDefinition.name}</h1>
                    <h2 style="margin: 0.5rem 0 0 0; color: #ccc; font-weight: normal;">${opportunity.name}</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #2a5298; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">Package Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <strong>Gate Number:</strong><br>
                            Gate ${gatePackage.gateNumber}
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <strong>Status:</strong><br>
                            <span style="background: #6c757d; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9rem;">
                                ${gatePackage.status}
                            </span>
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <strong>Created:</strong><br>
                            ${gatePackage.createdDate}
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <strong>Value:</strong><br>
                            $${opportunity.value ? opportunity.value.toLocaleString() : 'TBD'}
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #2a5298; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">Executive Summary</h3>
                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 6px; border-left: 4px solid #2a5298;">
                        ${gatePackage.executiveSummary?.summary || 'No executive summary available yet.'}
                    </div>
                </div>

                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid #eee; text-align: center;">
                    <button onclick="GatePackageGenerator.closeGatePackage()" 
                            style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem;">
                        Close Package
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = basicHTML;
    },


    getGateDefinition(gateNumber) {
        const definitions = {
            1: {
                name: "Gate 1: Opportunity Qualification",
                description: "Assess opportunity viability and alignment with business strategy"
            },
            2: {
                name: "Gate 2: Capture Planning", 
                description: "Develop initial capture strategy and resource planning"
            },
            3: {
                name: "Gate 3: Strategy Validation",
                description: "Validate win strategy and solution approach"
            },
            4: {
                name: "Gate 4: Proposal Readiness",
                description: "Final pre-RFP preparation and readiness review"
            }
        };
        return definitions[gateNumber];
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