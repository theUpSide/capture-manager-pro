// Data store
const DataStore = {
    opportunities: [
        {
            id: 1,
            name: "Japan AWACS E-767 Radio Upgrade",
            customer: "Japan Air Self-Defense Force",
            value: 25000000,
            rfpDate: "2025-03-01",
            pwin: 85,
            type: "IDIQ",
            role: "Sub",
            incumbent: "Boeing",
            currentPhase: "preparation",
            progress: 85,
            description: "Real-time information in cockpit system integration",
            createdDate: "2024-08-20"
        }
    ],

    actions: [
        {
            id: 1,
            opportunityId: 1,
            title: "Complete competitive analysis for Hitachi partnership",
            dueDate: "2025-01-05",
            priority: "High",
            phase: "intelligence",
            stepId: "black-hat-analysis",
            completed: false
        },
        {
            id: 2,
            opportunityId: 1,
            title: "Schedule customer demo at Edwards AFB",
            dueDate: "2025-01-10",
            priority: "Medium",
            phase: "engagement",
            stepId: "technical-exchange",
            completed: false
        }
    ],

    templates: [
        {
            id: 1,
            title: "Capture Plan Template",
            description: "Comprehensive capture plan following Shipley methodology",
            category: "Planning",
            fields: [
                { id: "program_name", label: "Program/Project Name", type: "text", required: true },
                { id: "customer", label: "Customer", type: "text", required: true },
                { id: "contract_type", label: "Contract Type & Duration", type: "text", required: true },
                { id: "estimated_value", label: "Estimated Value ($)", type: "number", required: true },
                { id: "rfp_date", label: "RFP Release Date", type: "date", required: false },
                { id: "key_stakeholders", label: "Key Stakeholders", type: "textarea", required: true },
                { id: "hot_buttons", label: "Customer Hot Buttons", type: "textarea", required: true },
                { id: "competitive_strengths", label: "Our Competitive Strengths", type: "textarea", required: true },
                { id: "win_themes", label: "Primary Win Themes", type: "textarea", required: true }
            ]
        },
        {
            id: 2,
            title: "Competitor Profile Template",
            description: "Detailed competitor analysis framework",
            category: "Intelligence",
            fields: [
                { id: "competitor_name", label: "Competitor Name", type: "text", required: true },
                { id: "company_overview", label: "Company Overview", type: "textarea", required: true },
                { id: "financial_health", label: "Financial Health", type: "select", options: ["Strong", "Moderate", "Weak", "Unknown"], required: true },
                { id: "technical_capabilities", label: "Technical Capabilities", type: "textarea", required: true },
                { id: "strengths", label: "Competitive Strengths", type: "textarea", required: true },
                { id: "weaknesses", label: "Competitive Weaknesses", type: "textarea", required: true }
            ]
        }
    ],

    captureRoadmap: {
        identification: {
            title: "Opportunity Identification",
            description: "Discover and initially assess opportunities",
            steps: [
                { id: "discovery", title: "Opportunity Discovery", description: "Monitor SAM.gov, GovWin, industry sources", daysFromStart: 0, duration: 3 },
                { id: "initial-assessment", title: "Initial Assessment", description: "Review scope, customer, timeline", daysFromStart: 1, duration: 2 },
                { id: "strategic-fit", title: "Strategic Fit Analysis", description: "Evaluate alignment with company goals", daysFromStart: 3, duration: 2 }
            ]
        },
        qualification: {
            title: "Opportunity Qualification",
            description: "Formal bid/no-bid decision process",
            steps: [
                { id: "customer-relationship", title: "Customer Relationship Assessment", description: "Evaluate existing relationships and access", daysFromStart: 7, duration: 2 },
                { id: "capability-gap", title: "Technical Capability Analysis", description: "Assess our ability to perform", daysFromStart: 8, duration: 3 },
                { id: "bid-no-bid", title: "Bid/No-Bid Decision", description: "Formal scoring and recommendation", daysFromStart: 10, duration: 2 }
            ]
        },
        planning: {
            title: "Capture Planning",
            description: "Develop comprehensive capture strategy",
            steps: [
                { id: "team-assembly", title: "Capture Team Assembly", description: "Assign roles and responsibilities", daysFromStart: 14, duration: 2 },
                { id: "capture-plan", title: "Initial Capture Plan", description: "Document strategy and approach", daysFromStart: 16, duration: 5 }
            ]
        },
        engagement: {
            title: "Customer Engagement",
            description: "Build relationships and shape opportunity",
            steps: [
                { id: "engagement-plan", title: "Customer Engagement Plan", description: "Strategic outreach planning", daysFromStart: 30, duration: 3 },
                { id: "customer-meetings", title: "One-on-One Customer Meetings", description: "Program office and stakeholder meetings", daysFromStart: 40, duration: 14 },
                { id: "technical-exchange", title: "Technical Exchange Meetings", description: "Demonstrate capabilities", daysFromStart: 60, duration: 5 }
            ]
        },
        intelligence: {
            title: "Competitive Intelligence",
            description: "Analyze competition and refine strategy",
            steps: [
                { id: "competitive-intel", title: "Competitive Intelligence Gathering", description: "Deep research on competitors", daysFromStart: 70, duration: 10 },
                { id: "black-hat-analysis", title: "Black Hat Analysis Session", description: "Role-play competitor strategies", daysFromStart: 80, duration: 2 },
                { id: "win-strategy", title: "Win Strategy Workshop", description: "Define themes and discriminators", daysFromStart: 85, duration: 2 }
            ]
        },
        preparation: {
            title: "Pre-RFP Preparation",
            description: "Final preparations before RFP release",
            steps: [
                { id: "teaming-finalization", title: "Teaming Agreement Finalization", description: "Lock in partnerships", daysFromStart: 110, duration: 7 },
                { id: "proposal-team", title: "Proposal Team Assembly", description: "Assign proposal roles", daysFromStart: 125, duration: 3 },
                { id: "capture-handoff", title: "Capture-to-Proposal Handoff", description: "Transfer knowledge and strategy", daysFromStart: 140, duration: 2 }
            ]
        }
    },

    savedTemplates: JSON.parse(localStorage.getItem('savedTemplates')) || [],

    // Data manipulation methods
    addOpportunity(opportunity) {
        opportunity.id = Date.now();
        opportunity.createdDate = new Date().toISOString().split('T')[0];
        opportunity.currentPhase = 'identification';
        opportunity.progress = 5;
        this.opportunities.push(opportunity);
    },

    getOpportunity(id) {
        return this.opportunities.find(opp => opp.id == id);
    },

    updateOpportunity(id, updates) {
        const opp = this.getOpportunity(id);
        if (opp) {
            Object.assign(opp, updates);
        }
    },

    addAction(action) {
        action.id = Date.now();
        this.actions.push(action);
    },

    getAction(id) {
        return this.actions.find(action => action.id == id);
    }
};
