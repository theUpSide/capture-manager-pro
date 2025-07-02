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

    // Initialize all required arrays
    savedTemplates: [],
    contacts: [],
    tasks: [],


    templates: [
        {
            id: 1,
            title: "Capture Plan Template (Master Document)",
            description: "Comprehensive capture plan serving as single source of truth for the entire capture effort.",
            category: "Planning",
            guidance: {
                importance: "The capture plan is your strategic roadmap and single source of truth throughout the entire capture process. It prevents scope creep, ensures team alignment, and provides a framework for making informed bid/no-bid decisions. Without a solid capture plan, teams often waste resources pursuing unwinnable opportunities or fail to capitalize on their competitive advantages.",
                keyConsiderations: [
                    "Ensure senior leadership buy-in and resource commitment before proceeding",
                    "Update the plan regularly as new intelligence emerges - it's a living document",
                    "Focus on 3-4 key win themes rather than trying to be everything to everyone",
                    "Validate assumptions through customer engagement, not internal speculation",
                    "Include realistic timelines with buffer for unexpected delays"
                ],
                prework: [
                    "Gather all available RFI responses, draft RFPs, and market research",
                    "Interview internal subject matter experts who have worked similar programs",
                    "Research customer organization structure and key personnel",
                    "Analyze recent similar contract awards and pricing",
                    "Assess internal capability gaps and potential teaming partners"
                ],
                workshopGuide: {
                    duration: "4-6 hours",
                    participants: "Capture manager, technical lead, business development, pricing, contracts",
                    agenda: [
                        "Review opportunity background and customer intelligence (30 min)",
                        "Assess technical requirements and solution approach (60 min)",
                        "Competitive landscape analysis and positioning (45 min)",
                        "Win theme development and validation (60 min)",
                        "Resource requirements and timeline planning (30 min)",
                        "Risk assessment and mitigation strategies (30 min)",
                        "Action items and next steps (15 min)"
                    ],
                    facilitation: "Use structured brainstorming, capture all ideas without judgment initially, then prioritize and validate. Assign specific owners and deadlines for each action item."
                },
                theory: "Based on proven capture management methodologies from Shipley Associates and APMP best practices. The capture plan forces disciplined thinking about customer needs, competitive positioning, and win strategy before expensive proposal efforts begin. Studies show that opportunities with comprehensive capture plans have 3x higher win rates than those without."
            },
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
                { id: "capability_gaps", label: "Company Capability Gaps & Mitigation", type: "textarea", required: false },
                { id: "win_themes", label: "Primary Win Themes (3-4)", type: "textarea", required: true },
                { id: "competitive_positioning", label: "Competitive Positioning Summary", type: "textarea", required: true },
                { id: "key_risks", label: "Key Risks & Mitigation Strategies", type: "textarea", required: true },
                { id: "action_items", label: "Critical Action Items & Owners", type: "textarea", required: true }
            ]
        },
        {
            id: 2,
            title: "Opportunity Qualification Scorecard",
            description: "Early-stage bid/no-bid decision tool to focus resources on winnable opportunities.",
            category: "Planning",
            guidance: {
                importance: "The qualification scorecard prevents the 'chase everything' mentality that wastes precious BD resources. It forces objective evaluation of opportunities against consistent criteria, helping you focus on winnable business. Companies using formal qualification processes win 2x more often while spending 40% less on losing pursuits.",
                keyConsiderations: [
                    "Be brutally honest in your scoring - wishful thinking costs money",
                    "Weight the criteria based on your company's strategic priorities",
                    "Include customer relationship strength as a major factor",
                    "Consider the competitive landscape realistically",
                    "Factor in your capacity to properly pursue the opportunity"
                ],
                prework: [
                    "Define your company's strategic priorities and growth targets",
                    "Research the customer's procurement history and preferences",
                    "Assess your past performance relevance and customer relationships",
                    "Analyze competitor strengths and likely participation",
                    "Calculate realistic pursuit costs (capture + proposal)"
                ],
                workshopGuide: {
                    duration: "2-3 hours",
                    participants: "BD manager, capture manager, technical lead, senior management",
                    agenda: [
                        "Review opportunity overview and requirements (20 min)",
                        "Score each criterion individually with discussion (90 min)",
                        "Calculate weighted scores and probability assessment (20 min)",
                        "Discuss resource requirements and capacity (15 min)",
                        "Make final go/no-go recommendation (10 min)",
                        "If GO: Define success conditions and checkpoints (15 min)"
                    ],
                    facilitation: "Score independently first, then discuss differences. Require justification for all high scores. Document assumptions and revisit them regularly."
                },
                theory: "Based on portfolio management principles and opportunity cost analysis. The scorecard quantifies subjective factors, enabling better resource allocation decisions. Regular use builds institutional knowledge about what opportunities your company wins and why."
            },
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
            guidance: {
                importance: "Customer engagement is the foundation of successful capture. Government customers buy from companies they know and trust. Each interaction is an opportunity to build relationships, gather intelligence, and shape requirements in your favor. Companies with strong customer engagement programs win 4x more often than those relying solely on proposal excellence.",
                keyConsiderations: [
                    "Focus on building genuine relationships, not just selling",
                    "Prepare thoroughly - customers can tell when you're winging it",
                    "Listen more than you talk - intelligence gathering is the primary goal",
                    "Follow up promptly on commitments and questions",
                    "Share your meetings insights with the broader capture team"
                ],
                prework: [
                    "Research attendees' backgrounds, roles, and interests",
                    "Prepare thoughtful questions about their challenges and priorities",
                    "Develop 2-3 key messages about your capabilities (not a sales pitch)",
                    "Review recent contract awards and industry trends",
                    "Prepare examples of relevant past performance"
                ],
                workshopGuide: {
                    duration: "1-2 hours prep, 30 min debrief",
                    participants: "Meeting attendees plus capture manager",
                    agenda: [
                        "Pre-meeting prep:",
                        "- Review meeting objectives and success criteria (15 min)",
                        "- Assign roles (lead, technical expert, note-taker) (10 min)",
                        "- Practice key messages and difficult questions (20 min)",
                        "- Review intelligence targets and priority questions (15 min)",
                        "Post-meeting debrief:",
                        "- Document key insights and intelligence gathered (15 min)",
                        "- Assess relationship progression and next steps (15 min)"
                    ],
                    facilitation: "Role-play difficult scenarios during prep. In debrief, focus on actionable intelligence and relationship insights, not just what was said."
                },
                theory: "Relationship-based selling principles adapted for government contracting. Based on research showing that purchase decisions are 70% emotional and 30% rational, even in government procurement. Trust and credibility are earned through consistent, value-added interactions over time."
            },
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
            guidance: {
                importance: "Black Hat analysis forces you to think like your competitors, revealing vulnerabilities in your strategy and uncovering opponent strengths you might miss. It's one of the most powerful competitive intelligence tools available. Teams using Black Hat analysis win 50% more competitive procurements by developing more effective differentiation strategies.",
                keyConsiderations: [
                    "Choose participants who can genuinely role-play competitors objectively",
                    "Focus on predicting strategies, not just listing competitor strengths",
                    "Be honest about your own weaknesses from competitors' perspectives",
                    "Develop specific countermeasures, not just awareness",
                    "Update your analysis as new intelligence emerges"
                ],
                prework: [
                    "Gather detailed competitive intelligence on each major competitor",
                    "Research competitors' recent wins, losses, and strategic moves",
                    "Understand competitors' key personnel and past performance",
                    "Analyze competitors' pricing history and typical margins",
                    "Identify potential teaming arrangements competitors might pursue"
                ],
                workshopGuide: {
                    duration: "3-4 hours",
                    participants: "5-8 people who understand competitors and customer",
                    agenda: [
                        "Set ground rules - honest, objective analysis only (10 min)",
                        "Review customer evaluation criteria and priorities (20 min)",
                        "Role-play each major competitor (45 min each):",
                        "- What's their likely strategy and positioning?",
                        "- How will they attack our weaknesses?",
                        "- What are their key discriminators?",
                        "- What's their probable pricing approach?",
                        "Identify our vulnerabilities from competitors' view (30 min)",
                        "Develop countermeasures and strategy adjustments (45 min)"
                    ],
                    facilitation: "Assign someone to genuinely advocate for each competitor. Challenge weak assumptions. Document specific actions, not just insights."
                },
                theory: "Based on military intelligence techniques and competitive strategy frameworks. The role-playing aspect overcomes cognitive biases that prevent objective competitor assessment. Forces systematic thinking about competitive dynamics rather than wishful thinking."
            },
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
            description: "Systematic framework for gathering and analyzing competitive intelligence from multiple sources.",
            category: "Intelligence",
            guidance: {
                importance: "Competitive intelligence is the foundation of effective positioning and strategy development. This systematic approach ensures you gather actionable intelligence while staying within legal and ethical boundaries. Companies with structured competitive intelligence processes are 3x more likely to accurately predict competitor moves and develop effective counter-strategies.",
                keyConsiderations: [
                    "Focus on publicly available information and ethical sources only",
                    "Validate intelligence through multiple independent sources",
                    "Distinguish between facts, assumptions, and speculation",
                    "Update intelligence regularly as situations change rapidly",
                    "Share intelligence appropriately while protecting sources"
                ],
                prework: [
                    "Identify key competitors likely to bid on similar opportunities",
                    "Establish ethical guidelines for intelligence gathering",
                    "Train team members on legal boundaries and proper techniques",
                    "Set up monitoring systems for competitor announcements",
                    "Develop relationships with industry contacts for insights"
                ],
                workshopGuide: {
                    duration: "2-3 hours quarterly",
                    participants: "BD team, capture managers, competitive analysts",
                    agenda: [
                        "Review competitive landscape changes (30 min)",
                        "Share new intelligence gathered since last meeting (45 min)",
                        "Analyze competitor strategic moves and implications (45 min)",
                        "Update competitive profiles and positioning (30 min)",
                        "Assign intelligence gathering tasks for next quarter (15 min)",
                        "Review and update intelligence gathering procedures (15 min)"
                    ],
                    facilitation: "Encourage sharing while maintaining confidentiality. Focus on actionable insights rather than raw data collection."
                },
                theory: "Based on business intelligence methodologies and competitive analysis frameworks. Systematic intelligence gathering enables proactive rather than reactive competitive strategies, leading to better positioning and higher win rates."
            },
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
            description: "Systematic development of compelling win themes that highlight strengths and differentiate from competitors.",
            category: "Strategy",
            guidance: {
                importance: "Win themes are the foundation of your competitive positioning and proposal messaging. They connect customer needs with your unique capabilities while differentiating you from competitors. Well-developed win themes increase win probability by 40% and make proposal writing more focused and compelling.",
                keyConsiderations: [
                    "Limit to 3-4 primary themes - more dilutes impact",
                    "Each theme must address a real customer hot button",
                    "Provide concrete proof points, not just claims",
                    "Ensure themes are truly differentiating, not just strengths",
                    "Test themes with customer contacts when possible"
                ],
                prework: [
                    "Complete thorough customer needs analysis",
                    "Conduct competitive intelligence gathering",
                    "Inventory your company's relevant capabilities and past performance",
                    "Identify customer evaluation criteria and weighting",
                    "Gather quantitative proof points and success stories"
                ],
                workshopGuide: {
                    duration: "4-5 hours",
                    participants: "Capture manager, technical leads, proposal manager, subject matter experts",
                    agenda: [
                        "Review customer hot buttons and evaluation criteria (30 min)",
                        "Brainstorm potential themes without judgment (45 min)",
                        "Map themes to customer needs and evaluation criteria (30 min)",
                        "Develop proof points for each potential theme (60 min)",
                        "Test themes against competitive differentiation (45 min)",
                        "Select final 3-4 themes and refine messaging (60 min)",
                        "Assign theme validation and development tasks (15 min)"
                    ],
                    facilitation: "Use structured brainstorming initially, then apply rigorous evaluation criteria. Focus on customer perspective, not internal pride."
                },
                theory: "Based on persuasion psychology and competitive positioning theory. Win themes work by creating mental anchors that influence evaluation and decision-making. They must be memorable, credible, and clearly superior to alternatives."
            },
            fields: [
                { id: "theme_title", label: "Win Theme Title", type: "text", required: true },
                { id: "customer_hot_button", label: "Customer Hot Button Addressed", type: "textarea", required: true },
                { id: "company_strength", label: "Company Strength Highlighted", type: "textarea", required: true },
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
            description: "Structured approach to developing technical and management solutions that are feasible and compelling.",
            category: "Strategy",
            guidance: {
                importance: "Solution development bridges the gap between customer requirements and your technical approach. A well-structured solution development process ensures technical feasibility, competitive differentiation, and executable implementation. Companies with systematic solution development win 35% more technical competitions.",
                keyConsiderations: [
                    "Balance innovation with proven approaches and manageable risk",
                    "Ensure solution directly addresses customer's key performance challenges",
                    "Design for the evaluation criteria, not just technical elegance",
                    "Consider lifecycle costs and sustainability, not just initial implementation",
                    "Validate feasibility with actual technical personnel who will execute"
                ],
                prework: [
                    "Thoroughly analyze customer requirements and performance objectives",
                    "Research customer's current systems, processes, and pain points",
                    "Review relevant company past performance and lessons learned",
                    "Assess available personnel, technologies, and partnership options",
                    "Understand budget constraints and cost sensitivity"
                ],
                workshopGuide: {
                    duration: "6-8 hours over 2 sessions",
                    participants: "Technical leads, solution architects, program managers, operations personnel",
                    agenda: [
                        "Session 1: Requirements Analysis & Concept Development",
                        "- Requirements decomposition and analysis (90 min)",
                        "- Brainstorm solution concepts and approaches (60 min)",
                        "- Initial feasibility and risk assessment (45 min)",
                        "Session 2: Solution Architecture & Validation",
                        "- Develop detailed solution architecture (90 min)",
                        "- Risk mitigation and management planning (45 min)",
                        "- Validation with technical SMEs and operations (45 min)",
                        "- Cost and schedule reality check (30 min)"
                    ],
                    facilitation: "Focus on customer outcomes, not just technical features. Challenge assumptions and validate with operational personnel."
                },
                theory: "Based on systems engineering principles and solution architecture methodologies. Successful solutions balance customer needs, technical feasibility, and competitive positioning while remaining executable within resource constraints."
            },
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
            description: "Comprehensive Price-to-Win analysis to identify optimal pricing that maximizes win probability.",
            category: "Pricing",
            guidance: {
                importance: "Price-to-Win analysis is critical for competitive positioning and profitability. It helps you find the sweet spot between winning the contract and maintaining acceptable margins. Systematic PTW analysis increases win rates by 25% while protecting profitability through disciplined pricing decisions.",
                keyConsiderations: [
                    "Gather multiple data points - don't rely on single sources",
                    "Consider customer's budget constraints and funding cycles",
                    "Factor in competitive dynamics and likely bidder strategies",
                    "Balance win probability with acceptable profit margins",
                    "Update estimates as new intelligence becomes available"
                ],
                prework: [
                    "Research government budget documents and appropriations",
                    "Analyze historical contract awards for similar work",
                    "Gather intelligence on competitor cost structures and pricing",
                    "Develop detailed should-cost estimates for major elements",
                    "Understand customer's cost sensitivity and evaluation criteria"
                ],
                workshopGuide: {
                    duration: "3-4 hours",
                    participants: "Pricing manager, capture manager, finance, competitive intelligence",
                    agenda: [
                        "Review available budget and cost intelligence (45 min)",
                        "Analyze historical pricing data and trends (30 min)",
                        "Develop competitor price estimates and rationales (60 min)",
                        "Model different pricing scenarios and win probability (45 min)",
                        "Sensitivity analysis and risk assessment (30 min)",
                        "Recommend pricing strategy and bounds (15 min)"
                    ],
                    facilitation: "Challenge assumptions and require supporting rationale for all estimates. Focus on ranges rather than point estimates."
                },
                theory: "Based on competitive bidding theory and microeconomics principles. PTW analysis combines market intelligence with statistical modeling to optimize bid pricing under uncertainty."
            },
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
            description: "Systematic collection and analysis of cost intelligence to support informed pricing decisions.",
            category: "Pricing",
            guidance: {
                importance: "Cost intelligence provides the foundation for competitive pricing strategies. Understanding market rates, competitor cost structures, and customer budget constraints enables more accurate price-to-win analysis and better bid decisions. Companies with strong cost intelligence win 30% more price-sensitive competitions.",
                keyConsiderations: [
                    "Focus on publicly available and ethically obtained information",
                    "Validate cost data through multiple independent sources",
                    "Consider regional variations and market conditions",
                    "Factor in inflation and cost escalation trends",
                    "Document sources and confidence levels for all data"
                ],
                prework: [
                    "Identify relevant historical contracts and awards data",
                    "Research government budget documents and spending patterns",
                    "Network with industry contacts for market rate insights",
                    "Analyze competitor public financial reports and statements",
                    "Gather internal historical cost data for benchmarking"
                ],
                workshopGuide: {
                    duration: "2-3 hours quarterly",
                    participants: "Pricing team, business development, competitive intelligence, finance",
                    agenda: [
                        "Review recent contract awards and pricing trends (45 min)",
                        "Share cost intelligence gathered from various sources (45 min)",
                        "Analyze competitor cost structures and capabilities (30 min)",
                        "Update market rate databases and benchmarks (15 min)",
                        "Identify cost intelligence gaps and collection priorities (15 min)"
                    ],
                    facilitation: "Maintain strict ethical standards while maximizing insight development. Focus on actionable intelligence for pricing decisions."
                },
                theory: "Based on market research methodologies and competitive intelligence principles. Systematic cost intelligence gathering enables data-driven rather than intuition-based pricing decisions."
            },
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
            description: "Formal review template to validate capture strategy and secure leadership commitment.",
            category: "Reviews",
            guidance: {
                importance: "Gate reviews provide critical checkpoints to validate strategy and secure continued investment. This formal review ensures capture strategy is sound before proceeding to expensive proposal development. Companies using structured gate reviews have 60% higher win rates and waste 40% less money on losing pursuits.",
                keyConsiderations: [
                    "Present honest assessment, not optimistic projections",
                    "Focus on evidence-based recommendations, not intuition",
                    "Address leadership concerns and risk tolerance explicitly",
                    "Provide clear go/no-go recommendation with rationale",
                    "Define success conditions and checkpoints for next phase"
                ],
                prework: [
                    "Complete all capture activities and gather supporting data",
                    "Prepare executive summary with key findings and recommendation",
                    "Develop risk assessment and mitigation strategies",
                    "Calculate resource requirements for proposal phase",
                    "Prepare compelling business case for continued investment"
                ],
                workshopGuide: {
                    duration: "90 minutes",
                    participants: "Senior leadership, capture manager, BD manager, proposal manager",
                    agenda: [
                        "Opportunity summary and strategic fit (15 min)",
                        "Customer intelligence and relationship status (15 min)",
                        "Competitive assessment and positioning (15 min)",
                        "Win strategy and theme validation (15 min)",
                        "Resource requirements and timeline (10 min)",
                        "Risk assessment and mitigation (10 min)",
                        "Go/no-go recommendation and discussion (10 min)"
                    ],
                    facilitation: "Focus on decision-making, not just information sharing. Require specific commitments and clear next steps."
                },
                theory: "Based on stage-gate innovation methodologies adapted for capture management. Formal reviews improve decision quality and resource allocation while reducing sunk costs from poor pursuits."
            },
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
            description: "Structured workshop template for collaborative win strategy development ensuring team alignment.",
            category: "Reviews",
            guidance: {
                importance: "Win strategy workshops align diverse perspectives and expertise to develop comprehensive competitive strategies. They leverage collective intelligence while ensuring all team members understand and buy into the approach. Teams using structured strategy workshops have 45% higher win rates due to better alignment and more thorough planning.",
                keyConsiderations: [
                    "Include diverse perspectives but limit to 6-8 participants",
                    "Prepare thoroughly with background materials distributed in advance",
                    "Focus on decisions and actions, not just discussion",
                    "Document assumptions and validate them through capture activities",
                    "Assign specific owners and deadlines for all action items"
                ],
                prework: [
                    "Distribute background materials 2-3 days before workshop",
                    "Complete preliminary customer and competitive intelligence",
                    "Prepare initial solution concepts and win themes",
                    "Gather relevant past performance and capability information",
                    "Reserve appropriate meeting space with visual aids"
                ],
                workshopGuide: {
                    duration: "6-8 hours",
                    participants: "Capture manager, technical leads, BD, proposal manager, subject matter experts",
                    agenda: [
                        "Workshop objectives and ground rules (15 min)",
                        "Opportunity overview and customer intelligence (45 min)",
                        "Competitive landscape and positioning (60 min)",
                        "Solution approach brainstorming and selection (90 min)",
                        "Win theme development and validation (90 min)",
                        "Pricing strategy discussion (45 min)",
                        "Risk assessment and mitigation planning (30 min)",
                        "Action planning and assignments (30 min)",
                        "Next steps and success conditions (15 min)"
                    ],
                    facilitation: "Use structured brainstorming techniques. Encourage creative thinking initially, then apply evaluation criteria. Maintain energy through varied activities and regular breaks."
                },
                theory: "Based on collaborative decision-making research and group dynamics principles. Structured workshops improve strategy quality while building team commitment through participatory development."
            },
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
        guidance: {
            importance: "Regular status reporting ensures leadership visibility, enables proactive decision-making, and maintains stakeholder alignment throughout the capture process. Effective reporting prevents surprises, builds confidence in the capture team, and provides early warning of issues requiring senior intervention. Teams with structured reporting practices have 35% fewer late-stage surprises and better resource allocation decisions.",
            keyConsiderations: [
                "Focus on actionable information and decisions needed, not just activity reports",
                "Tailor reporting frequency to opportunity timeline and leadership preferences",
                "Highlight changes from previous reporting period to show trends",
                "Be transparent about challenges while proposing solutions",
                "Include quantitative metrics alongside qualitative assessments"
            ],
            prework: [
                "Establish reporting schedule and distribution list with stakeholders",
                "Define key performance indicators and success metrics",
                "Create templates for consistent reporting format",
                "Set up tracking systems for metrics and milestones",
                "Identify escalation triggers that require immediate communication"
            ],
            workshopGuide: {
                duration: "1 hour monthly",
                participants: "Capture manager, BD manager, senior leadership",
                agenda: [
                    "Review progress against capture plan milestones (15 min)",
                    "Discuss customer engagement activities and intelligence (15 min)",
                    "Analyze competitive positioning changes (10 min)",
                    "Address current issues and resource needs (10 min)",
                    "Update probability assessment and next steps (10 min)"
                ],
                facilitation: "Focus on decision-making and problem-solving rather than just information sharing. Use visual dashboards when possible to highlight trends and key metrics."
            },
            theory: "Based on project management communication principles and stakeholder engagement theory. Regular, structured communication builds trust and enables better decision-making by providing consistent, comparable information over time."
        },
        fields: [
            // ... existing fields ...
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
        id: 13,
        title: "Teaming and Partnership Templates",
        description: "Strategic teaming evaluation and management templates for strengthening win probability through effective partnerships.",
        category: "Teaming",
        guidance: {
            importance: "Strategic teaming can be the difference between winning and losing, especially in complex government procurements. The right partners bring complementary capabilities, customer relationships, and past performance that strengthen your positioning. Poor teaming decisions waste resources and can actually hurt your competitiveness. Companies with systematic teaming processes win 40% more team-based competitions.",
            keyConsiderations: [
                "Prioritize complementary capabilities over just adding names to the proposal",
                "Assess cultural fit and working relationship potential early",
                "Understand partner motivations and commitment levels honestly",
                "Define roles, responsibilities, and decision-making authority clearly",
                "Consider intellectual property and competitive disclosure implications"
            ],
            prework: [
                "Identify capability gaps that require external partners",
                "Research potential partners' past performance and customer relationships",
                "Assess your attractiveness as a partner and negotiating position",
                "Understand partner's strategic priorities and capacity",
                "Review legal and security implications of partnership"
            ],
            workshopGuide: {
                duration: "2-3 hours",
                participants: "BD manager, capture manager, technical lead, legal counsel",
                agenda: [
                    "Review opportunity requirements and capability gaps (30 min)",
                    "Evaluate potential partners against selection criteria (60 min)",
                    "Assess partnership structures and work allocation (45 min)",
                    "Discuss pricing strategy and profit sharing (30 min)",
                    "Plan partnership approach and negotiation strategy (15 min)"
                ],
                facilitation: "Use structured evaluation criteria to compare partners objectively. Focus on fit with opportunity requirements rather than general partner capabilities."
            },
            theory: "Based on strategic alliance theory and partnership management best practices. Successful teaming requires alignment of strategic objectives, complementary capabilities, and compatible organizational cultures."
        },
        fields: [
            // ... existing fields ...
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
        title: "Customer Organization Mapping",
        description: "Map customer organizational relationships and decision-making processes.",
        category: "Customer Intelligence",
        guidance: {
            importance: "Understanding customer organizational dynamics is critical for successful capture. This template helps you map decision-making processes, identify key influencers, and develop targeted engagement strategies. Companies with strong customer intelligence win 60% more often than those without systematic mapping.",
            keyConsiderations: [
                "Focus on decision makers and influencers, not just program managers",
                "Understand both formal and informal organizational relationships",
                "Map budget authority and funding sources clearly",
                "Identify end user organizations and their specific needs",
                "Document your current relationship status honestly"
            ],
            prework: [
                "Gather organizational charts and contact directories",
                "Research key personnel backgrounds and career histories",
                "Understand the customer's recent organizational changes",
                "Identify budget authority and appropriation sources",
                "Map previous contract awards and decision patterns"
            ],
            workshopGuide: {
                duration: "2-3 hours",
                participants: "Business development, capture manager, account managers, technical leads",
                agenda: [
                    "Review customer organizational structure (30 min)",
                    "Identify key decision makers and influencers (45 min)",
                    "Map decision-making processes and approval chains (30 min)",
                    "Assess current relationship strengths and gaps (30 min)",
                    "Develop targeted engagement strategy (30 min)",
                    "Assign relationship-building responsibilities (15 min)"
                ],
                facilitation: "Use visual mapping tools like whiteboards or sticky notes. Focus on relationships and influence patterns, not just titles."
            },
            theory: "Based on stakeholder analysis and influence mapping methodologies. Understanding organizational dynamics enables targeted relationship building and more effective positioning strategies."
        },
        fields: [
            // ... existing fields ...
        { id: "program_office", label: "Primary Program Office", type: "text", required: true },
        { id: "parent_organization", label: "Parent Organization/Command", type: "text", required: true },
        { id: "program_manager", label: "Program Manager Name & Contact", type: "text", required: true },
        { id: "technical_lead", label: "Technical Lead Name & Contact", type: "text", required: false },
        { id: "contracting_officer", label: "Contracting Officer Name & Contact", type: "text", required: true },
        { id: "end_users", label: "End User Organizations", type: "textarea", required: true },
        { id: "decision_makers", label: "Key Decision Makers", type: "textarea", required: true },
        { id: "influencers", label: "Key Influencers", type: "textarea", required: true },
        { id: "budget_authority", label: "Budget Authority/Funding Source", type: "textarea", required: true },
        { id: "decision_process", label: "Decision-Making Process", type: "textarea", required: true },
        { id: "relationship_status", label: "Current Relationship Status", type: "textarea", required: true },
        { id: "engagement_strategy", label: "Engagement Strategy", type: "textarea", required: true }    
        ]
    },
    {
        id: 15,
        title: "Past Performance Packaging",
        description: "Template for effectively packaging GMRE's excellent CPARS ratings and past performance as a key competitive advantage.",
        category: "Past Performance",
        guidance: {
            importance: "Past performance is often the most heavily weighted evaluation factor in government procurements. Excellent CPARS ratings and relevant experience can be your strongest differentiator, but only if presented effectively. Poor past performance packaging wastes your competitive advantage, while compelling presentations can overcome other weaknesses.",
            keyConsiderations: [
                "Select most relevant examples that directly support your win themes",
                "Quantify achievements with specific metrics and outcomes",
                "Tell complete stories using Situation-Action-Results format",
                "Address any performance issues honestly with lessons learned",
                "Maintain current relationships with customer references"
            ],
            prework: [
                "Gather all CPARS reports and performance evaluations",
                "Interview project managers and technical leads for success stories",
                "Collect quantitative performance data and customer testimonials",
                "Research customer's evaluation criteria and weighting",
                "Verify reference contact information and availability"
            ],
            workshopGuide: {
                duration: "3-4 hours",
                participants: "Capture manager, project managers, technical leads, proposal manager",
                agenda: [
                    "Review evaluation criteria and past performance requirements (30 min)",
                    "Inventory available past performance examples (45 min)",
                    "Select most relevant examples for detailed development (30 min)",
                    "Develop compelling performance stories with metrics (90 min)",
                    "Plan reference strategy and customer testimonials (30 min)",
                    "Assign past performance write-up responsibilities (15 min)"
                ],
                facilitation: "Focus on customer outcomes and business results, not just technical achievements. Challenge teams to quantify their impact with specific metrics."
            },
            theory: "Based on persuasion psychology and evidence-based decision making. Evaluators need concrete proof of your ability to deliver results similar to what they need."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Security and compliance failures can disqualify even the best technical solution. Government contractors face complex regulatory requirements that change frequently. This systematic approach ensures you identify and address all compliance requirements early, preventing costly disqualifications or contract modifications.",
            keyConsiderations: [
                "Start compliance review early in the capture process",
                "Understand both explicit requirements and implied expectations",
                "Document compliance approach and evidence systematically",
                "Identify any compliance gaps and mitigation strategies",
                "Keep compliance documentation current as requirements evolve"
            ],
            prework: [
                "Review all solicitation compliance requirements carefully",
                "Gather current company certifications and clearances",
                "Research applicable regulations and standards",
                "Assess team member clearance status and facility requirements",
                "Identify potential compliance risks and mitigation approaches"
            ],
            workshopGuide: {
                duration: "2 hours",
                participants: "Compliance officer, security manager, contracts manager, capture manager",
                agenda: [
                    "Review all solicitation compliance requirements (45 min)",
                    "Assess current compliance status and gaps (30 min)",
                    "Develop compliance strategy and timeline (30 min)",
                    "Assign compliance responsibilities and deadlines (15 min)"
                ],
                facilitation: "Use detailed checklists and require documentation for all compliance claims. Focus on proactive risk identification and mitigation."
            },
            theory: "Based on risk management principles and regulatory compliance frameworks. Systematic compliance management prevents disqualification while building customer confidence in your ability to perform."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Test and Evaluation contracts have unique technical, safety, and regulatory requirements that differ significantly from other government work. Success requires deep understanding of test methodologies, safety protocols, and data analysis approaches. Specialized T&E experience and approach can be strong differentiators in this niche market.",
            keyConsiderations: [
                "Understand both test objectives and underlying operational requirements",
                "Address safety as a primary concern throughout test planning",
                "Design test approaches that provide actionable data for decision makers",
                "Consider schedule constraints and weather/facility dependencies",
                "Plan for both expected results and anomaly investigation"
            ],
            prework: [
                "Review test objectives and success criteria carefully",
                "Research similar test programs and lessons learned",
                "Assess facility requirements and availability",
                "Identify safety requirements and approval processes",
                "Understand data collection and analysis expectations"
            ],
            workshopGuide: {
                duration: "4 hours",
                participants: "Test director, safety manager, instrumentation lead, data analyst",
                agenda: [
                    "Review test objectives and customer priorities (60 min)",
                    "Develop test methodology and approach (90 min)",
                    "Address safety requirements and risk mitigation (60 min)",
                    "Plan instrumentation and data collection strategy (45 min)",
                    "Define success criteria and deliverables (15 min)"
                ],
                facilitation: "Focus on test objectives and customer decision needs. Challenge assumptions about test requirements and methods."
            },
            theory: "Based on systems engineering test principles and experimental design methodology. Effective test programs balance technical rigor with practical constraints and customer needs."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Standardized processes ensure consistent quality and efficiency across all capture efforts. They prevent important steps from being skipped, enable better resource planning, and facilitate knowledge transfer between teams. Companies with mature capture processes win 25% more often while spending 20% less on capture activities.",
            keyConsiderations: [
                "Tailor process rigor to opportunity size and complexity",
                "Maintain discipline in following established processes",
                "Document deviations and rationale for future learning",
                "Regular process reviews and continuous improvement",
                "Balance process compliance with agility and responsiveness"
            ],
            prework: [
                "Review company capture process standards and templates",
                "Assess opportunity characteristics and process requirements",
                "Identify any process modifications needed for this opportunity",
                "Assign process roles and responsibilities clearly",
                "Set up process monitoring and compliance tracking"
            ],
            workshopGuide: {
                duration: "90 minutes",
                participants: "Capture manager, process owner, team leads",
                agenda: [
                    "Review standard capture process and gate requirements (30 min)",
                    "Assess opportunity-specific process modifications (30 min)",
                    "Assign roles and responsibilities (15 min)",
                    "Plan gate reviews and milestone schedule (15 min)"
                ],
                facilitation: "Focus on practical application rather than theoretical process discussion. Ensure all team members understand their responsibilities."
            },
            theory: "Based on process management and quality assurance principles. Standardized processes reduce variability and improve predictable outcomes while enabling continuous improvement."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Effective team member onboarding accelerates productivity and ensures consistent application of capture processes. Poor onboarding leads to mistakes, inefficiency, and team frustration. Systematic onboarding reduces time-to-productivity by 40% and improves team member retention and satisfaction.",
            keyConsiderations: [
                "Tailor onboarding intensity to experience level and role",
                "Provide both process training and opportunity-specific context",
                "Assign experienced mentors for hands-on guidance",
                "Document competency requirements and assessment criteria",
                "Provide ongoing development opportunities and feedback"
            ],
            prework: [
                "Assess new team member's experience and skill gaps",
                "Prepare opportunity background materials and briefings",
                "Identify appropriate mentors and training resources",
                "Define role-specific competency requirements",
                "Schedule training sessions and check-in meetings"
            ],
            workshopGuide: {
                duration: "2 days",
                participants: "New team member, mentor, capture manager, process owner",
                agenda: [
                    "Day 1: Company capture process and tools training (4 hours)",
                    "Day 1: Opportunity background and strategy briefing (4 hours)",
                    "Day 2: Role-specific training and shadowing (6 hours)",
                    "Day 2: Competency assessment and development planning (2 hours)"
                ],
                facilitation: "Use interactive training methods and real examples. Focus on practical application rather than theoretical knowledge."
            },
            theory: "Based on adult learning principles and competency-based training methodology. Effective onboarding combines knowledge transfer with practical application and mentoring."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Independent execution review prevents the 'happy path' bias that often affects capture teams. Execution teams provide realistic assessment of technical feasibility, resource requirements, and profitability. This review catches problems before they become contract performance issues, protecting both profitability and customer relationships.",
            keyConsiderations: [
                "Ensure reviewers are independent from the capture team",
                "Focus on practical execution challenges, not just technical feasibility",
                "Assess resource availability and skill requirements realistically",
                "Consider operational constraints and customer expectations",
                "Address execution risks with specific mitigation strategies"
            ],
            prework: [
                "Brief execution team on opportunity requirements and approach",
                "Provide access to all technical and management documentation",
                "Schedule sufficient time for thorough technical review",
                "Identify execution team members with relevant experience",
                "Prepare specific questions about technical and operational challenges"
            ],
            workshopGuide: {
                duration: "4-6 hours",
                participants: "Independent execution team, capture manager, technical leads",
                agenda: [
                    "Opportunity and solution overview presentation (60 min)",
                    "Technical approach review and challenge (120 min)",
                    "Resource and schedule assessment (90 min)",
                    "Risk analysis and mitigation planning (60 min)",
                    "Recommendations and required changes (30 min)"
                ],
                facilitation: "Encourage critical questioning and realistic assessment. Focus on execution challenges rather than defending the capture approach."
            },
            theory: "Based on independent verification and validation principles. External review reduces bias and improves decision quality by providing objective assessment of execution risk."
        },
        fields: [
            // ... existing fields ...
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
        guidance: {
            importance: "Final capture plan review provides quality assurance gate before expensive proposal development begins. It ensures all capture activities are complete, strategy is sound, and positioning is compelling. This review prevents wasted proposal effort on poorly prepared opportunities and improves win rates by 30%.",
            keyConsiderations: [
                "Use independent reviewers who weren't involved in plan development",
                "Apply consistent evaluation criteria across all opportunities",
                "Focus on strategy strength and competitive positioning",
                "Assess completeness of customer intelligence and competitive analysis",
                "Ensure win themes are compelling and well-supported"
            ],
            prework: [
                "Complete all capture plan sections and supporting documentation",
                "Gather evidence and proof points for all claims and strategies",
                "Schedule review meeting with appropriate senior stakeholders",
                "Prepare executive summary highlighting key findings and recommendations",
                "Identify any outstanding action items or information gaps"
            ],
            workshopGuide: {
                duration: "2-3 hours",
                participants: "Independent reviewers, capture manager, senior leadership",
                agenda: [
                    "Capture plan presentation and strategy overview (45 min)",
                    "Systematic review against quality criteria (90 min)",
                    "Discussion of findings and recommendations (30 min)",
                    "Go/no-go decision and conditions (15 min)"
                ],
                facilitation: "Use structured evaluation criteria and scoring. Focus on objective assessment rather than advocacy for the opportunity."
            },
            theory: "Based on quality assurance and gate review methodologies. Independent review improves decision quality and prevents continuation of poorly positioned pursuits."
        },
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

    // Add the critical missing methods
    saveData() {
        try {
            localStorage.setItem('opportunities', JSON.stringify(this.opportunities));
            localStorage.setItem('savedTemplates', JSON.stringify(this.savedTemplates));
            localStorage.setItem('contacts', JSON.stringify(this.contacts));
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            localStorage.setItem('actions', JSON.stringify(this.actions));
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },


    loadData() {
        try {
            // Load from localStorage or use defaults
            const storedOpportunities = localStorage.getItem('opportunities');
            if (storedOpportunities) {
                this.opportunities = JSON.parse(storedOpportunities);
            }
            
            this.savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
            this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            const storedActions = localStorage.getItem('actions');
            if (storedActions) {
                this.actions = JSON.parse(storedActions);
            }
            
            // Migrate existing opportunities to include status and required fields
            this.opportunities.forEach(opp => {
                if (!opp.status) {
                    opp.status = 'capture';
                }
                // Map old field names to new ones if needed
                if (opp.pwin && !opp.probability) {
                    opp.probability = opp.pwin;
                }
                if (opp.rfpDate && !opp.closeDate) {
                    opp.closeDate = opp.rfpDate;
                }
                if (opp.customer && !opp.client) {
                    opp.client = opp.customer;
                }
            });
            
            console.log('Data loaded successfully', {
                opportunities: this.opportunities.length,
                actions: this.actions.length,
                savedTemplates: this.savedTemplates.length
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Handle nested structure from your JSON file
            const opportunitiesData = data.data ? data.data.opportunities : data.opportunities;
            const templatesData = data.data ? data.data.savedTemplates : data.savedTemplates;
            const actionsData = data.data ? data.data.actions : data.actions;
            
            if (opportunitiesData && Array.isArray(opportunitiesData)) {
                // Transform the imported opportunities to match our expected structure
                this.opportunities = opportunitiesData.map(opp => ({
                    id: opp.id,
                    name: opp.name,
                    description: opp.description || '',
                    value: opp.value || 0,
                    probability: opp.pwin || opp.probability || 50,
                    closeDate: opp.rfpDate || opp.closeDate || new Date().toISOString().split('T')[0],
                    status: opp.status || 'capture',
                    client: opp.customer || opp.client || '',
                    notes: opp.notes || '',
                    createdDate: opp.createdDate || new Date().toISOString().split('T')[0],
                    // Keep additional fields from import
                    type: opp.type,
                    role: opp.role,
                    incumbent: opp.incumbent,
                    currentPhase: opp.currentPhase,
                    progress: opp.progress
                }));
            }
            
            if (templatesData && Array.isArray(templatesData)) {
                this.savedTemplates = templatesData;
            }
            
            if (actionsData && Array.isArray(actionsData)) {
                this.actions = actionsData;
            }
            
            // Save the imported data
            this.saveData();
            
            return {
                success: true,
                message: `Imported ${this.opportunities.length} opportunities, ${this.actions.length} actions, and ${this.savedTemplates.length} saved templates`
            };
        } catch (error) {
            console.error('Import error:', error);
            return {
                success: false,
                message: `Import failed: ${error.message}`
            };
        }
    },

    exportData() {
        return {
            version: "1.0",
            exportDate: new Date().toISOString(),
            opportunities: this.opportunities,
            savedTemplates: this.savedTemplates,
            contacts: this.contacts,
            tasks: this.tasks,
            actions: this.actions
        };
    },

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