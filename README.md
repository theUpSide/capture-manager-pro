# Capture Manager Pro

A comprehensive web-based tool for managing business capture activities and opportunity tracking.

## Features

- 📊 Dashboard with pipeline metrics and smart recommendations
- 🎯 Visual roadmap timeline showing capture phases
- 📋 Action item tracking and management
- 📄 Built-in capture management templates
- 📈 Progress tracking across capture lifecycle phases

## Usage

1. Open `capture_manager_tool_v2.html` in your web browser
2. Start by adding opportunities using the "Add Opportunity" button
3. Track progress through the six capture phases:
   - Identification
   - Qualification
   - Planning
   - Engagement
   - Intelligence
   - Preparation

## Capture Phases

The tool follows industry-standard capture management methodology with six key phases, each containing specific steps and deliverables.

## Technology

Built with vanilla HTML, CSS, and JavaScript - no dependencies required.

## 💼 How to Use

### 1. Dashboard
- View key metrics: Total pipeline, weighted pipeline, active opportunities
- See smart recommendations based on opportunity status
- Quick access to urgent action items
- Add new opportunities directly from the dashboard

### 2. Managing Opportunities
- Click "Add Opportunity" to create new opportunities
- Fill in details: name, customer, value, RFP date, PWin, etc.
- Track opportunities through six capture phases
- Monitor progress and probability of win

### 3. Capture Roadmap
- Visual timeline showing all opportunities across capture phases
- Color-coded status indicators:
  - ✅ **Green**: Completed phases
  - 🔄 **Yellow**: Current phase in progress
  - 🎯 **Orange**: Needs attention (behind schedule)
  - ⏳ **Gray**: Future phases
- Click on any phase to see detailed steps and mark items complete

### 4. Action Items
- Create action items for specific opportunities and phases
- Set due dates, priorities, and categories
- Track completion status
- Filter by status, opportunity, or priority

### 5. Templates
- Use pre-built templates like "Capture Plan" and "Competitor Profile"
- Fill out forms and save completed templates
- Export templates as text files
- View and edit saved templates

### 6. Data Management
- **Save Data**: Export all your data to a JSON file
- **Load Data**: Import previously saved data
- Automatic backup before importing new data
- Emergency restore function available in browser console

## 🛠️ Data Management

### Saving Your Data
1. Click "💾 Save Data" in the header
2. A JSON file will be downloaded with timestamp
3. Store this file safely as your backup

### Loading Data
1. Click "📁 Load Data" in the header
2. Select your previously saved JSON file
3. Confirm the import (this will replace current data)
4. System creates automatic backup before importing

### Data Storage
- Data is stored locally in your browser
- Use Save/Load functions to backup and transfer data
- No data is sent to external servers
- Clear browser data will reset the application

## 📊 Understanding the Capture Phases

### 1. Identification
- Opportunity discovery and initial assessment
- Strategic fit analysis
- **Timeline**: Start of capture process

### 2. Qualification
- Customer relationship assessment
- Technical capability analysis
- Formal bid/no-bid decision
- **Timeline**: Within first 2 weeks

### 3. Planning
- Capture team assembly
- Initial capture plan development
- **Timeline**: Weeks 2-4

### 4. Engagement
- Customer engagement planning
- One-on-one meetings with stakeholders
- Technical exchanges and demos
- **Timeline**: 30-120 days before RFP

### 5. Intelligence
- Competitive intelligence gathering
- Black hat analysis sessions
- Win strategy workshops
- **Timeline**: 70-120 days before RFP

### 6. Preparation
- Teaming agreement finalization
- Proposal team assembly
- Capture-to-proposal handoff
- **Timeline**: Final 30-60 days before RFP

## 🎨 Customization

### Adding Your Logo
Replace `logo1.png` with your company logo (recommended size: 60px height)

### Modifying Templates
Edit the `templates` array in `js/data.js` to add custom templates with your specific fields

### Custom Styling
Modify CSS files to match your company branding:
- `css/main.css`: Main colors and layout
- `css/components.css`: UI components
- `css/responsive.css`: Mobile responsiveness

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android)
- Touch interfaces supported

## 🔧 Troubleshooting

### Common Issues

**Data Not Saving**
- Data is stored in browser local storage
- Clearing browser data will reset the application
- Use the Save Data function to create backups

**Import/Export Not Working**
- Ensure your browser supports file downloads
- Check that JavaScript is enabled
- Try using a different browser if issues persist

**Mobile Display Issues**
- Zoom out if content appears cut off
- Rotate device to landscape for better roadmap viewing
- Use pinch-to-zoom for detailed views

### Emergency Data Recovery
If you accidentally lose data after an import:
1. Open browser developer console (F12)
2. Type: `DataManager.restoreBackup()`
3. Press Enter to restore the automatic backup

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Support

### Getting Help
1. Check this README for common solutions
2. Use browser developer console to check for errors
3. Try clearing browser cache and reloading

### Data Backup Best Practices
1. Save data regularly (weekly recommended)
2. Store backup files in multiple locations
3. Test restore process periodically
4. Export important templates separately

## 📈 Tips for Effective Use

### Dashboard
- Check smart recommendations daily
- Update PWin percentages regularly
- Review urgent actions weekly

### Roadmap Management
- Mark steps complete as you finish them
- Pay attention to "needs attention" indicators
- Update opportunity phases as you progress

### Action Items
- Set realistic due dates
- Use priorities effectively (High/Medium/Low)
- Review and update status regularly

### Templates
- Fill out capture plans early in the process
- Update competitor profiles as you learn more
- Export completed templates for proposal teams

## 🔄 Version History

### Version 1.0 (Current)
- Complete capture management workflow
- Six-phase roadmap visualization
- Template management system
- Data save/load functionality
- Mobile responsive design
- Smart recommendations

## 📄 License

This is a standalone web application designed for internal business use. Modify and customize as needed for your organization.

---

**Capture Manager Pro** - Streamline your business capture process from opportunity identification to proposal handoff.




----

Capture Manager Pro
A comprehensive business development and capture management application designed specifically for defense contractors and government services companies. Track opportunities, manage capture activities, and execute winning strategies with systematic templates and workflows.

🎯 Overview
Capture Manager Pro provides a complete solution for managing the business development lifecycle from opportunity identification through proposal handoff. Built with modern web technologies, it runs entirely in your browser with local data storage for security and privacy.

✨ Key Features
📊 Dashboard & Analytics
Real-time Pipeline Metrics: Total pipeline value, weighted pipeline, active opportunity count
Smart Recommendations: AI-powered insights for overdue actions, stale opportunities, and strategic priorities
Progress Tracking: Visual progress indicators and trend analysis
Urgent Actions Widget: Immediate visibility into high-priority and overdue tasks
🎯 Opportunity Management
Complete Lifecycle Tracking: From identification through win/loss/archive
Status Management: Capture, Pursuing, Won, Lost, Archived with visual indicators
Comprehensive Data: Value, probability, close dates, client information, notes
Organized Views: Collapsible sections for active, completed, and archived opportunities
Edit & Update: Full CRUD operations with change tracking
🗺️ Capture Roadmap
Six-Phase Framework: Identification → Qualification → Planning → Engagement → Intelligence → Preparation
Visual Timeline: Interactive Gantt-style view showing phase progression
Milestone Tracking: Key activities and deliverables for each phase
Progress Indicators: Color-coded status (completed, current, upcoming, needs attention)
Customizable Workflows: Adapt to your organization's capture process
✅ Action Item Management
Priority-Based Organization: High/Medium/Low priority with visual indicators
Overdue Tracking: Automatic identification and highlighting of overdue items
Opportunity Linking: Actions tied to specific opportunities
Phase Association: Actions mapped to capture roadmap phases
Completion Tracking: Mark complete with date stamps and history
📋 Professional Templates (21 Templates)
Planning & Strategy
Capture Plan Template: Comprehensive master document for capture strategy
Opportunity Qualification Scorecard: Bid/no-bid decision framework
Win Theme Development: Systematic theme creation and validation
Solution Development Framework: Technical and management approach planning
Customer Intelligence
Customer Engagement Templates: Systematic relationship building
Air Force Customer Mapping: GMRE-specific organizational mapping
Customer Intelligence Gathering: Structured information collection
Competitive Intelligence
Black Hat Analysis Framework: Role-playing competitor strategies
Competitive Intelligence Checklist: Systematic competitor research
Win Strategy Workshop Agenda: Collaborative strategy development
Pricing & Analysis
Price-to-Win (PTW) Analysis: Comprehensive pricing strategy
Cost Intelligence Gathering: Market rate and pricing research
Reviews & Quality Assurance
Capture Strategy Review (Gate 2): Formal review checkpoints
Execution Readiness Review: Pre-proposal feasibility assessment
Capture Plan Review Checklist: Quality assurance framework
Specialized Areas
Test & Evaluation Templates: T&E-specific requirements and safety
Security & Compliance Checklist: Defense contracting compliance
Teaming & Partnership Templates: Strategic partnership evaluation
Past Performance Packaging: CPARS and reference optimization
Process & Training
Capture Process Workflow: Standardized process management
Training & Onboarding: Team member development
Capture Status Reporting: Regular communication templates
💾 Data Management
Local Storage: Secure browser-based data storage
Import/Export: JSON-based data backup and restoration
Data Migration: Automatic field mapping for legacy data
Version Control: Change tracking and modification dates
🚀 Getting Started
Installation
Download or clone the repository
Open index.html in a modern web browser
Start adding your opportunities and begin capturing!
First Steps
Add Your First Opportunity: Click "Add Opportunity" and enter basic details
Set Up Actions: Create action items linked to your opportunities
Use Templates: Fill out capture planning templates for systematic approach
Track Progress: Monitor your pipeline through the dashboard metrics
📱 User Interface
Navigation
Dashboard: Overview metrics and urgent items
Opportunities: Full opportunity management with status tracking
Roadmap: Visual timeline of capture activities
Action Items: Task management with priority and due date tracking
Templates: Professional capture management templates
Reports: Analytics and export capabilities
Key Workflows
Opportunity Lifecycle
Identification: Discover and initially assess opportunities
Qualification: Formal bid/no-bid decision process
Planning: Develop comprehensive capture strategy
Engagement: Build relationships and shape opportunity
Intelligence: Analyze competition and refine strategy
Preparation: Final preparations before RFP release
Status Management
Capture: Early-stage opportunity development
Pursuing: Active pursuit with approved capture plan
Won: Successfully awarded contracts
Lost: Unsuccessful pursuits for lessons learned
Archived: Inactive opportunities for historical reference
🔧 Technical Details
Architecture
Frontend: Vanilla JavaScript, HTML5, CSS3
Storage: Browser localStorage for data persistence
Security: Client-side only, no server communication
Compatibility: Modern web browsers (Chrome, Firefox, Safari, Edge)
File Structure
17 lines
▲
Data Model
Opportunities: Core business opportunities with lifecycle tracking
Actions: Task items linked to opportunities and phases
Templates: Professional forms with field definitions
Saved Templates: Completed template instances
Roadmap: Phase definitions and workflow steps
🎨 Customization
Adding Custom Templates
Edit js/data.js
Add new template objects to the templates array
Define fields with appropriate types (text, textarea, select, date, number)
Set required fields and validation rules
Modifying Capture Phases
Update the captureRoadmap object in js/data.js
Define steps with timing and descriptions
Customize phase names and workflows for your organization
Styling Customization
Colors: Modify CSS custom properties in css/main.css
Layout: Adjust grid systems and spacing in css/components.css
Branding: Replace logo and update header styling
📊 Analytics & Reporting
Dashboard Metrics
Total Pipeline Value: Sum of all active opportunity values
Weighted Pipeline: Probability-adjusted pipeline value
Active Opportunity Count: Current pursuits in progress
Average Progress: Overall capture phase progression
Smart Recommendations
Overdue Action Detection: Automatic identification of late tasks
Stale Opportunity Alerts: Opportunities without recent activity
High-Value Strategy Alerts: Low-probability, high-value opportunities
Closing Soon Warnings: Opportunities requiring immediate attention
🔒 Security & Privacy
Local Storage Only: All data stays on your device
No Server Communication: Complete offline functionality
Data Control: You own and control all information
Export Capability: Regular backups recommended
🚧 Roadmap & Future Enhancements
Planned Features
Advanced Analytics: Trend analysis and forecasting
Collaboration Tools: Team sharing and assignment features
Integration Capabilities: CRM and ERP system connections
Mobile App: Dedicated mobile application
Advanced Reporting: Custom report generation
Enhancement Requests
Multi-user Support: Team collaboration features
Document Management: File attachment and storage
Email Integration: Automated notifications and reminders
Advanced Filtering: Complex search and filter options
🤝 Support & Contributing
Getting Help
Review this documentation for common questions
Check browser console for error messages
Ensure you're using a modern, updated web browser
Contributing
Report bugs or suggest features through GitHub issues
Submit pull requests for improvements
Share templates and workflows with the community
📝 License
MIT License - see LICENSE file for details.

🏢 About GMRE
Built specifically for defense contractors and government services companies, with particular attention to Air Force and DoD contracting requirements. Templates and workflows reflect industry best practices and proven capture methodologies.

