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
        title: "Capture Plan Template (Master Document)",
        description: "Comprehensive capture plan serving as single source of truth for the entire capture effort. Update regularly as new intelligence emerges.",
        category: "Planning",
        fields: [
            { id: "program_name", label: "Program/Project Name", type: "text", required: true },
            { id: "customer_agency", label: "Customer Agency/Organization", type: "text", required: true },
            { id: "contract_type", label: "Contract Type & Duration", type: "text", required: true },
            { id: "estimated_value", label: "Estimated Contract Value ($)", type: "number", required: true },
            { id: "strategic_importance", label: "Strategic Importance (1-5)", type: "select", options: ["1 - Low", "2 - Below Average", "3 - Average", "4 - High", "5 - Critical"], required: true },
            { id: "rfp_release_date", label: "Expected RFP Release Date", type: "date", required: false },
            { id: "proposal_due_date", label: "Proposal Due Date", type: "date", required: false },
            { id: "key_stakeholders", label: "Key Decision Makers & Influencers", type: "textarea", required: true },
            { id: "customer_hot_buttons", label: "Customer Hot Buttons & Priorities", type: "textarea", required: true },
            { id: "requirements_summary", label: "Key Requirements Summary", type: "textarea", required: true },
            { id: "capability_gaps", label: "GMRE Capability Gaps & Mitigation", type: "textarea", required: false },
            { id: "win_themes", label: "Primary Win Themes (3-4)", type: "textarea", required: true },
            { id: "competitive_positioning", label: "Competitive Positioning Summary", type: "textarea", required: true },
            { id: "key_risks", label: "Key Risks & Mitigation Strategies", type: "textarea", required: true },
            { id: "action_items", label: "Critical Action Items & Owners", type: "textarea", required: true }
        ]
    },
    {
        id: 2,
        title: "Opportunity Qualification Scorecard",
        description: "Early-stage bid/no-bid decision tool to make disciplined pursuit decisions and focus resources on winnable opportunities.",
        category: "Planning",
        fields: [
            { id: "opportunity_name", label: "Opportunity Name", type: "text", required: true },
            { id: "strategic_fit_score", label: "Strategic Fit Score (1-5)", type: "select", options: ["1 - Poor Fit", "2 - Marginal", "3 - Good Fit", "4 - Strong Fit", "5 - Perfect Fit"], required: true },
            { id: "competitive_position", label: "Competitive Position (1-5)", type: "select", options: ["1 - Weak", "2 - Disadvantaged", "3 - Competitive", "4 - Advantaged", "5 - Dominant"], required: true },
            { id: "customer_relationship", label: "Customer Relationship Strength (1-5)", type: "select", options: ["1 - No Relationship", "2 - Limited", "3 - Established", "4 - Strong", "5 - Preferred Partner"], required: true },
            { id: "probability_win", label: "Estimated Probability of Win (%)", type: "number", required: true },
            { id: "required_investment", label: "Required Capture/Proposal Investment ($)", type: "number", required: true },
            { id: "resource_availability", label: "Resource Availability Assessment", type: "textarea", required: true },
            { id: "strategic_value", label: "Long-term Strategic Value", type: "textarea", required: true },
            { id: "decision_rationale", label: "Go/No-Go Rationale", type: "textarea", required: true },
            { id: "conditions", label: "Conditions for Proceeding", type: "textarea", required: false }
        ]
    },
    {
        id: 3,
        title: "Customer Engagement Templates",
        description: "Systematic customer engagement planning to build relationships and gather intelligence through strategic interactions.",
        category: "Customer Intelligence",
        fields: [
            { id: "contact_name", label: "Primary Contact Name & Title", type: "text", required: true },
            { id: "organization", label: "Customer Organization", type: "text", required: true },
            { id: "engagement_objective", label: "Meeting Objective", type: "textarea", required: true },
            { id: "intelligence_targets", label: "Intelligence to Gather", type: "textarea", required: true },
            { id: "key_messages", label: "Key Messages to Convey", type: "textarea", required: true },
            { id: "preparation_notes", label: "Pre-Meeting Research & Notes", type: "textarea", required: true },
            { id: "meeting_date", label: "Meeting Date", type: "date", required: false },
            { id: "attendees", label: "Meeting Attendees", type: "textarea", required: false },
            { id: "key_insights", label: "Key Insights Gathered", type: "textarea", required: false },
            { id: "follow_up_actions", label: "Follow-up Actions Required", type: "textarea", required: false },
            { id: "relationship_assessment", label: "Relationship Progression Assessment", type: "textarea", required: false }
        ]
    },
    {
        id: 4,
        title: "Black Hat Analysis Framework",
        description: "Structured competitive analysis using role-playing to predict competitor strategies and develop effective counters.",
        category: "Intelligence",
        fields: [
            { id: "opportunity_name", label: "Opportunity Name", type: "text", required: true },
            { id: "session_date", label: "Black Hat Session Date", type: "date", required: true },
            { id: "participants", label: "Session Participants", type: "textarea", required: true },
            { id: "primary_competitors", label: "Primary Competitors (3-5)", type: "textarea", required: true },
            { id: "customer_evaluation_criteria", label: "Customer Evaluation Criteria", type: "textarea", required: true },
            { id: "competitor_strategies", label: "Predicted Competitor Strategies", type: "textarea", required: true },
            { id: "our_vulnerabilities", label: "Our Vulnerabilities (Competitor View)", type: "textarea", required: true },
            { id: "competitive_advantages", label: "Our Competitive Advantages", type: "textarea", required: true },
            { id: "strategy_adjustments", label: "Required Strategy Adjustments", type: "textarea", required: true },
            { id: "action_items", label: "Action Items from Black Hat", type: "textarea", required: true }
        ]
    },
    {
        id: 5,
        title: "Competitive Intelligence Gathering Checklist",
        description: "Systematic framework for gathering and analyzing competitive intelligence from multiple sources throughout capture.",
        category: "Intelligence",
        fields: [
            { id: "competitor_name", label: "Competitor Name", type: "text", required: true },
            { id: "open_source_research", label: "Open Source Research Findings", type: "textarea", required: true },
            { id: "past_performance_analysis", label: "Past Performance Analysis", type: "textarea", required: true },
            { id: "pricing_history", label: "Historical Pricing Data", type: "textarea", required: false },
            { id: "key_personnel", label: "Key Personnel & Qualifications", type: "textarea", required: true },
            { id: "technical_capabilities", label: "Technical Capabilities Assessment", type: "textarea", required: true },
            { id: "financial_position", label: "Financial Position & Health", type: "textarea", required: false },
            { id: "strategic_motivations", label: "Strategic Motivations for This Opportunity", type: "textarea", required: true },
            { id: "likely_approach", label: "Likely Technical/Management Approach", type: "textarea", required: true },
            { id: "strengths", label: "Competitive Strengths", type: "textarea", required: true },
            { id: "weaknesses", label: "Competitive Weaknesses", type: "textarea", required: true },
            { id: "intelligence_confidence", label: "Intelligence Confidence Level", type: "select", options: ["Low", "Medium", "High"], required: true }
        ]
    },
    {
        id: 6,
        title: "Win Theme Development Worksheet",
        description: "Systematic development of compelling win themes that highlight strengths, address customer needs, and differentiate from competitors.",
        category: "Strategy",
        fields: [
            { id: "theme_title", label: "Win Theme Title", type: "text", required: true },
            { id: "customer_hot_button", label: "Customer Hot Button Addressed", type: "textarea", required: true },
            { id: "gmre_strength", label: "GMRE Strength Highlighted", type: "textarea", required: true },
            { id: "competitor_weakness", label: "Competitor Weakness Exploited", type: "textarea", required: false },
            { id: "proof_points", label: "Proof Points & Evidence", type: "textarea", required: true },
            { id: "past_performance_examples", label: "Supporting Past Performance", type: "textarea", required: true },
            { id: "metrics_data", label: "Quantitative Metrics & Data", type: "textarea", required: false },
            { id: "customer_testimonials", label: "Customer Testimonials/References", type: "textarea", required: false },
            { id: "evaluation_criteria_alignment", label: "Evaluation Criteria Alignment", type: "textarea", required: true },
            { id: "theme_validation", label: "Theme Validation Status", type: "select", options: ["Not Validated", "Partially Validated", "Fully Validated"], required: true },
            { id: "messaging_notes", label: "Key Messaging Notes", type: "textarea", required: true }
        ]
    },
    {
        id: 7,
        title: "Solution Development Framework",
        description: "Structured approach to developing technical and management solutions that are feasible, compelling, and superior to competitors.",
        category: "Strategy",
        fields: [
            { id: "technical_approach_summary", label: "Technical Approach Summary", type: "textarea", required: true },
            { id: "key_innovations", label: "Key Innovations & Differentiators", type: "textarea", required: true },
            { id: "technical_risks", label: "Technical Risks & Mitigation", type: "textarea", required: true },
            { id: "management_approach", label: "Management Approach Overview", type: "textarea", required: true },
            { id: "organizational_structure", label: "Proposed Organizational Structure", type: "textarea", required: true },
            { id: "key_personnel_plan", label: "Key Personnel Plan", type: "textarea", required: true },
            { id: "staffing_strategy", label: "Staffing Strategy & Timeline", type: "textarea", required: true },
            { id: "subcontractor_roles", label: "Subcontractor Roles & Management", type: "textarea", required: false },
            { id: "performance_metrics", label: "Proposed Performance Metrics", type: "textarea", required: true },
            { id: "past_performance_relevance", label: "Most Relevant Past Performance", type: "textarea", required: true },
            { id: "solution_validation", label: "Solution Validation Status", type: "textarea", required: true }
        ]
    },
    {
        id: 8,
        title: "PTW Analysis Workbook",
        description: "Comprehensive Price-to-Win analysis to identify optimal pricing that maximizes win probability while maintaining profitability.",
        category: "Pricing",
        fields: [
            { id: "government_budget", label: "Government Budget Research", type: "textarea", required: true },
            { id: "historical_pricing", label: "Historical Contract Pricing Data", type: "textarea", required: false },
            { id: "should_cost_estimate", label: "Should-Cost Analysis", type: "number", required: true },
            { id: "competitor_a_estimate", label: "Competitor A Price Estimate", type: "number", required: false },
            { id: "competitor_b_estimate", label: "Competitor B Price Estimate", type: "number", required: false },
            { id: "competitor_c_estimate", label: "Competitor C Price Estimate", type: "number", required: false },
            { id: "internal_cost_estimate", label: "Internal Cost Estimate", type: "number", required: true },
            { id: "minimum_acceptable_price", label: "Minimum Acceptable Price", type: "number", required: true },
            { id: "optimal_price_range", label: "Optimal Price Range", type: "textarea", required: true },
            { id: "pricing_strategy", label: "Recommended Pricing Strategy", type: "select", options: ["Aggressive", "Competitive", "Premium"], required: true },
            { id: "pricing_rationale", label: "Pricing Strategy Rationale", type: "textarea", required: true },
            { id: "scenario_analysis", label: "Scenario Analysis Results", type: "textarea", required: true }
        ]
    },
    {
        id: 9,
        title: "Cost Intelligence Gathering",
        description: "Systematic collection and analysis of cost intelligence to support informed pricing decisions and PTW analysis.",
        category: "Pricing",
        fields: [
            { id: "contract_reference", label: "Reference Contract Number", type: "text", required: false },
            { id: "contract_value", label: "Contract Value", type: "number", required: false },
            { id: "contract_type", label: "Contract Type", type: "text", required: false },
            { id: "period_of_performance", label: "Period of Performance", type: "text", required: false },
            { id: "scope_similarity", label: "Scope Similarity to Current Opportunity", type: "select", options: ["Low", "Medium", "High"], required: true },
            { id: "pricing_assumptions", label: "Key Pricing Assumptions", type: "textarea", required: true },
            { id: "cost_drivers", label: "Primary Cost Drivers", type: "textarea", required: true },
            { id: "market_rates", label: "Current Market Rates", type: "textarea", required: true },
            { id: "cost_trends", label: "Cost Trends & Projections", type: "textarea", required: false },
            { id: "lessons_learned", label: "Pricing Lessons Learned", type: "textarea", required: false },
            { id: "validation_status", label: "Data Validation Status", type: "select", options: ["Unvalidated", "Partially Validated", "Validated"], required: true }
        ]
    },
    {
        id: 10,
        title: "Capture Strategy Review (Gate 2) Template",
        description: "Formal review template to validate capture strategy and secure leadership commitment before proceeding to proposal development.",
        category: "Reviews",
        fields: [
            { id: "opportunity_summary", label: "Opportunity Summary", type: "textarea", required: true },
            { id: "capture_activities_complete", label: "Capture Activities Completion Status", type: "textarea", required: true },
            { id: "customer_engagement_summary", label: "Customer Engagement Summary", type: "textarea", required: true },
            { id: "competitive_assessment", label: "Competitive Assessment Results", type: "textarea", required: true },
            { id: "win_strategy_summary", label: "Win Strategy Summary", type: "textarea", required: true },
            { id: "solution_overview", label: "Solution Overview", type: "textarea", required: true },
            { id: "pricing_strategy", label: "Pricing Strategy", type: "textarea", required: true },
            { id: "resource_requirements", label: "Proposal Resource Requirements", type: "textarea", required: true },
            { id: "risk_assessment", label: "Risk Assessment & Mitigation", type: "textarea", required: true },
            { id: "recommendation", label: "Go/No-Go Recommendation", type: "select", options: ["Go", "No-Go", "Conditional Go"], required: true },
            { id: "leadership_approval", label: "Leadership Approval Status", type: "select", options: ["Pending", "Approved", "Approved with Conditions", "Rejected"], required: true },
            { id: "conditions_requirements", label: "Conditions/Requirements", type: "textarea", required: false }
        ]
    },
    {
        id: 11,
        title: "Win Strategy Workshop Agenda",
        description: "Structured workshop template for collaborative win strategy development ensuring team alignment and leveraging diverse perspectives.",
        category: "Reviews",
        fields: [
            { id: "workshop_date", label: "Workshop Date", type: "date", required: true },
            { id: "participants", label: "Workshop Participants", type: "textarea", required: true },
            { id: "workshop_objectives", label: "Workshop Objectives", type: "textarea", required: true },
            { id: "background_materials", label: "Pre-Workshop Materials Distributed", type: "textarea", required: true },
            { id: "customer_intelligence_review", label: "Customer Intelligence Review", type: "textarea", required: true },
            { id: "competitive_analysis_review", label: "Competitive Analysis Review", type: "textarea", required: true },
            { id: "theme_brainstorming_results", label: "Win Theme Brainstorming Results", type: "textarea", required: true },
            { id: "solution_concepts", label: "Solution Concepts Developed", type: "textarea", required: true },
            { id: "pricing_discussion", label: "Pricing Strategy Discussion", type: "textarea", required: true },
            { id: "final_win_strategy", label: "Final Win Strategy Consensus", type: "textarea", required: true },
            { id: "action_items", label: "Workshop Action Items", type: "textarea", required: true },
            { id: "next_steps", label: "Next Steps & Timeline", type: "textarea", required: true }
        ]
    },
    {
        id: 12,
        title: "Capture Status Reporting",
        description: "Regular communication templates to keep leadership informed and stakeholders aligned throughout the capture process.",
        category: "Communication",
        fields: [
            { id: "reporting_period", label: "Reporting Period", type: "text", required: true },
            { id: "key_accomplishments", label: "Key Accomplishments", type: "textarea", required: true },
            { id: "customer_interactions", label: "Customer Interactions Summary", type: "textarea", required: true },
            { id: "competitive_intelligence", label: "New Competitive Intelligence", type: "textarea", required: false },
            { id: "milestone_progress", label: "Progress Against Milestones", type: "textarea", required: true },
            { id: "current_issues", label: "Current Issues & Challenges", type: "textarea", required: false },
            { id: "upcoming_activities", label: "Upcoming Activities", type: "textarea", required: true },
            { id: "resource_utilization", label: "Resource Utilization", type: "textarea", required: true },
            { id: "budget_status", label: "Capture Budget Status", type: "textarea", required: true },
            { id: "decisions_needed", label: "Leadership Decisions Needed", type: "textarea", required: false },
            { id: "win_probability", label: "Current Win Probability Assessment", type: "number", required: true },
            { id: "trend_analysis", label: "Trend Analysis vs Previous Period", type: "textarea", required: false }
        ]
    },
    {
        id: 13,
        title: "Teaming and Partnership Templates",
        description: "Strategic teaming evaluation and management templates for strengthening win probability through effective partnerships.",
        category: "Teaming",
        fields: [
            { id: "partner_company", label: "Partner Company Name", type: "text", required: true },
            { id: "partnership_type", label: "Partnership Type", type: "select", options: ["Prime-Sub", "Joint Venture", "Teaming Agreement", "Mentor-Protege"], required: true },
            { id: "complementary_capabilities", label: "Complementary Capabilities", type: "textarea", required: true },
            { id: "past_performance_strength", label: "Partner's Past Performance Strength", type: "textarea", required: true },
            { id: "cultural_fit", label: "Cultural Fit Assessment", type: "select", options: ["Poor", "Fair", "Good", "Excellent"], required: true },
            { id: "commitment_level", label: "Partner Commitment Level", type: "select", options: ["Low", "Medium", "High"], required: true },
            { id: "work_allocation", label: "Proposed Work Allocation", type: "textarea", required: true },
            { id: "pricing_strategy", label: "Joint Pricing Strategy", type: "textarea", required: true },
            { id: "management_structure", label: "Joint Management Structure", type: "textarea", required: true },
            { id: "risk_sharing", label: "Risk Sharing Arrangement", type: "textarea", required: true },
            { id: "intellectual_property", label: "Intellectual Property Agreements", type: "textarea", required: false },
            { id: "performance_metrics", label: "Joint Performance Metrics", type: "textarea", required: true }
        ]
    },
    {
        id: 14,
        title: "Air Force Customer Mapping",
        description: "GMRE-specific template for mapping Air Force organizational relationships and decision-making processes across SPOs and commands.",
        category: "Customer Intelligence",
        fields: [
            { id: "program_office", label: "System Program Office (SPO)", type: "text", required: true },
            { id: "major_command", label: "Major Command (ACC/ANG/AFRC)", type: "text", required: true },
            { id: "program_manager", label: "Program Manager Name & Contact", type: "text", required: true },
            { id: "technical_lead", label: "Technical Lead Name & Contact", type: "text", required: false },
            { id: "contracting_officer", label: "Contracting Officer Name & Contact", type: "text", required: true },
            { id: "end_users", label: "End User Organizations", type: "textarea", required: true },
            { id: "decision_makers", label: "Key Decision Makers", type: "textarea", required: true },
            { id: "influencers", label: "Key Influencers", type: "textarea", required: true },
            { id: "budget_authority", label: "Budget Authority/Funding Source", type: "textarea", required: true },
            { id: "decision_process", label: "Decision-Making Process", type: "textarea", required: true },
            { id: "relationship_status", label: "GMRE Relationship Status", type: "textarea", required: true },
            { id: "engagement_strategy", label: "Engagement Strategy", type: "textarea", required: true }
        ]
    },
    {
        id: 15,
        title: "Past Performance Packaging",
        description: "Template for effectively packaging GMRE's excellent CPARS ratings and past performance as a key competitive advantage.",
        category: "Past Performance",
        fields: [
            { id: "contract_number", label: "Contract Number", type: "text", required: true },
            { id: "program_name", label: "Program Name", type: "text", required: true },
            { id: "customer_organization", label: "Customer Organization", type: "text", required: true },
            { id: "period_of_performance", label: "Period of Performance", type: "text", required: true },
            { id: "contract_value", label: "Contract Value", type: "number", required: true },
            { id: "relevance_score", label: "Relevance Score (1-5)", type: "select", options: ["1 - Low", "2 - Limited", "3 - Moderate", "4 - High", "5 - Highly Relevant"], required: true },
            { id: "cpars_ratings", label: "CPARS Ratings Summary", type: "textarea", required: true },
            { id: "key_accomplishments", label: "Key Accomplishments", type: "textarea", required: true },
            { id: "performance_metrics", label: "Quantitative Performance Metrics", type: "textarea", required: true },
            { id: "customer_testimonials", label: "Customer Testimonials/Quotes", type: "textarea", required: false },
            { id: "reference_contact", label: "Reference Contact Information", type: "textarea", required: true },
            { id: "lessons_learned", label: "Lessons Learned Applied", type: "textarea", required: false },
            { id: "performance_story", label: "Performance Story (Situation-Action-Results)", type: "textarea", required: true }
        ]
    },
    {
        id: 16,
        title: "Security and Compliance Checklist",
        description: "Defense contracting security and regulatory compliance verification template ensuring adherence to all requirements.",
        category: "Compliance",
        fields: [
            { id: "far_clauses_review", label: "Relevant FAR Clauses Review", type: "textarea", required: true },
            { id: "security_clearance_requirements", label: "Security Clearance Requirements", type: "textarea", required: true },
            { id: "team_clearance_status", label: "Team Clearance Status", type: "textarea", required: true },
            { id: "facility_clearance", label: "Facility Clearance Requirements", type: "textarea", required: false },
            { id: "itar_assessment", label: "ITAR/Export Control Assessment", type: "textarea", required: true },
            { id: "conflict_of_interest", label: "Conflict of Interest Analysis", type: "textarea", required: true },
            { id: "cybersecurity_requirements", label: "Cybersecurity Requirements (NIST, CMMC)", type: "textarea", required: true },
            { id: "small_business_certifications", label: "Small Business Certifications", type: "textarea", required: false },
            { id: "environmental_compliance", label: "Environmental Compliance Requirements", type: "textarea", required: false },
            { id: "safety_requirements", label: "Safety Requirements & Protocols", type: "textarea", required: true },
            { id: "compliance_gaps", label: "Identified Compliance Gaps", type: "textarea", required: false },
            { id: "mitigation_plan", label: "Gap Mitigation Plan", type: "textarea", required: false }
        ]
    },
    {
        id: 17,
        title: "Test and Evaluation Specific Templates",
        description: "Specialized template for T&E programs addressing unique requirements, safety considerations, and customer priorities.",
        category: "Specialized",
        fields: [
            { id: "test_objectives", label: "Primary Test Objectives", type: "textarea", required: true },
            { id: "success_criteria", label: "Test Success Criteria", type: "textarea", required: true },
            { id: "test_methodology", label: "Proposed Test Methodology", type: "textarea", required: true },
            { id: "test_facilities", label: "Required Test Facilities/Ranges", type: "textarea", required: true },
            { id: "safety_considerations", label: "Safety Considerations & Requirements", type: "textarea", required: true },
            { id: "airworthiness_requirements", label: "Airworthiness Requirements", type: "textarea", required: false },
            { id: "instrumentation_needs", label: "Instrumentation & Data Collection", type: "textarea", required: true },
            { id: "schedule_constraints", label: "Schedule Constraints & Dependencies", type: "textarea", required: true },
            { id: "test_articles", label: "Test Articles & Configuration", type: "textarea", required: true },
            { id: "data_analysis_approach", label: "Data Analysis Approach", type: "textarea", required: true },
            { id: "risk_mitigation", label: "Technical Risk Mitigation", type: "textarea", required: true },
            { id: "regulatory_approvals", label: "Required Regulatory Approvals", type: "textarea", required: false }
        ]
    },
    {
        id: 18,
        title: "Capture Process Workflow",
        description: "Standardized process management template ensuring consistency and efficiency across all GMRE capture efforts.",
        category: "Process",
        fields: [
            { id: "capture_phase", label: "Current Capture Phase", type: "select", options: ["Opportunity Identification", "Qualification", "Capture Planning", "Strategy Development", "Proposal Readiness"], required: true },
            { id: "phase_entry_criteria", label: "Phase Entry Criteria Met", type: "textarea", required: true },
            { id: "phase_deliverables", label: "Required Phase Deliverables", type: "textarea", required: true },
            { id: "gate_review_status", label: "Gate Review Status", type: "select", options: ["Not Scheduled", "Scheduled", "Completed", "Approved", "Conditional Approval"], required: true },
            { id: "document_version_control", label: "Document Version Control Log", type: "textarea", required: true },
            { id: "team_assignments", label: "Team Role Assignments", type: "textarea", required: true },
            { id: "communication_plan", label: "Stakeholder Communication Plan", type: "textarea", required: true },
            { id: "handoff_checklist", label: "Capture-to-Proposal Handoff Checklist", type: "textarea", required: false },
            { id: "lessons_learned", label: "Capture Lessons Learned", type: "textarea", required: false },
            { id: "process_improvements", label: "Identified Process Improvements", type: "textarea", required: false },
            { id: "next_phase_readiness", label: "Next Phase Readiness Assessment", type: "textarea", required: true }
        ]
    },
    {
        id: 19,
        title: "Training and Onboarding",
        description: "Systematic onboarding template for new capture team members to accelerate productivity and ensure process consistency.",
        category: "Training",
        fields: [
            { id: "team_member_name", label: "Team Member Name", type: "text", required: true },
            { id: "role_assignment", label: "Capture Role Assignment", type: "text", required: true },
            { id: "experience_level", label: "Capture Experience Level", type: "select", options: ["Beginner", "Intermediate", "Advanced", "Expert"], required: true },
            { id: "training_completed", label: "Required Training Completed", type: "textarea", required: true },
            { id: "customer_briefing", label: "Customer Background Briefing", type: "textarea", required: true },
            { id: "process_training", label: "GMRE Capture Process Training", type: "textarea", required: true },
            { id: "tool_access", label: "Tool Access & Training", type: "textarea", required: true },
            { id: "mentor_assignment", label: "Assigned Mentor", type: "text", required: false },
            { id: "competency_assessment", label: "Competency Assessment Results", type: "textarea", required: true },
            { id: "development_plan", label: "Individual Development Plan", type: "textarea", required: false },
            { id: "feedback_sessions", label: "Feedback Session Schedule", type: "textarea", required: true },
            { id: "onboarding_completion", label: "Onboarding Completion Status", type: "select", options: ["In Progress", "Completed", "Needs Additional Training"], required: true }
        ]
    },
    {
        id: 20,
        title: "Execution Readiness Review Template",
        description: "Independent execution team review to ensure proposed solution is actually executable and profitable if won.",
        category: "Quality Assurance",
        fields: [
            { id: "opportunity_name", label: "Opportunity Name", type: "text", required: true },
            { id: "review_date", label: "Review Date", type: "date", required: true },
            { id: "execution_team_members", label: "Execution Team Reviewers", type: "textarea", required: true },
            { id: "technical_feasibility", label: "Technical Feasibility Assessment", type: "select", options: ["Not Feasible", "High Risk", "Moderate Risk", "Low Risk", "Highly Feasible"], required: true },
            { id: "resource_availability", label: "Resource Availability Assessment", type: "select", options: ["Inadequate", "Marginal", "Adequate", "Good", "Excellent"], required: true },
            { id: "schedule_realism", label: "Schedule Realism Assessment", type: "select", options: ["Unrealistic", "Aggressive", "Challenging", "Reasonable", "Conservative"], required: true },
            { id: "budget_adequacy", label: "Budget Adequacy Assessment", type: "select", options: ["Inadequate", "Tight", "Adequate", "Comfortable", "Conservative"], required: true },
            { id: "execution_risks", label: "Identified Execution Risks", type: "textarea", required: true },
            { id: "capability_gaps", label: "Execution Capability Gaps", type: "textarea", required: false },
            { id: "mitigation_strategies", label: "Risk Mitigation Strategies", type: "textarea", required: true },
            { id: "staffing_concerns", label: "Staffing & Personnel Concerns", type: "textarea", required: false },
            { id: "subcontractor_dependencies", label: "Subcontractor Dependencies & Risks", type: "textarea", required: false },
            { id: "execution_confidence", label: "Overall Execution Confidence", type: "select", options: ["Very Low", "Low", "Medium", "High", "Very High"], required: true },
            { id: "recommendation", label: "Execution Team Recommendation", type: "select", options: ["Do Not Bid", "Bid with Major Changes", "Bid with Minor Changes", "Bid as Proposed"], required: true },
            { id: "required_changes", label: "Required Changes for Execution", type: "textarea", required: false },
            { id: "handoff_plan", label: "Capture-to-Execution Handoff Plan", type: "textarea", required: false }
        ]
    },
    {
        id: 21,
        title: "Capture Plan Review Checklist",
        description: "Final quality assurance template ensuring capture plan completeness and compelling positioning before proposal development.",
        category: "Quality Assurance",
        fields: [
            { id: "opportunity_name", label: "Opportunity Name", type: "text", required: true },
            { id: "reviewer_name", label: "Reviewer Name", type: "text", required: true },
            { id: "review_date", label: "Review Date", type: "date", required: true },
            { id: "completeness_score", label: "Plan Completeness Score (1-5)", type: "select", options: ["1 - Major Gaps", "2 - Some Gaps", "3 - Mostly Complete", "4 - Complete", "5 - Comprehensive"], required: true },
            { id: "customer_intelligence_quality", label: "Customer Intelligence Quality", type: "select", options: ["Poor", "Fair", "Good", "Very Good", "Excellent"], required: true },
            { id: "competitive_analysis_quality", label: "Competitive Analysis Quality", type: "select", options: ["Poor", "Fair", "Good", "Very Good", "Excellent"], required: true },
            { id: "win_strategy_strength", label: "Win Strategy Strength", type: "select", options: ["Weak", "Below Average", "Average", "Strong", "Very Strong"], required: true },
            { id: "win_themes_compelling", label: "Win Themes Compelling & Supported", type: "select", options: ["Not Compelling", "Somewhat Compelling", "Compelling", "Very Compelling", "Highly Compelling"], required: true },
            { id: "solution_feasibility", label: "Solution Feasibility", type: "select", options: ["Not Feasible", "Questionable", "Feasible", "Well-Defined", "Excellent"], required: true },
            { id: "pricing_strategy_sound", label: "Pricing Strategy Soundness", type: "select", options: ["Poor", "Weak", "Adequate", "Sound", "Excellent"], required: true },
            { id: "action_plan_realistic", label: "Action Plan Realistic & Achievable", type: "select", options: ["Unrealistic", "Aggressive", "Challenging", "Realistic", "Conservative"], required: true },
            { id: "major_concerns", label: "Major Concerns Identified", type: "textarea", required: false },
            { id: "recommended_improvements", label: "Recommended Improvements", type: "textarea", required: false },
            { id: "approval_recommendation", label: "Approval Recommendation", type: "select", options: ["Do Not Approve", "Approve with Major Revisions", "Approve with Minor Revisions", "Approve as Is"], required: true },
            { id: "final_approval_status", label: "Final Approval Status", type: "select", options: ["Pending", "Approved", "Approved with Conditions", "Rejected"], required: true },
            { id: "approval_conditions", label: "Approval Conditions/Requirements", type: "textarea", required: false }
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
