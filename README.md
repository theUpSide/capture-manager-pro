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

## Opportunity Status Management

The system uses five distinct opportunity statuses to track the complete lifecycle:

### Active Statuses (Shown on Roadmap)
- **🎯 Capture**: Early-stage opportunities that have been identified and initially qualified but haven't yet received formal approval to pursue. These opportunities are being assessed, relationships are being built, and initial capture planning is occurring.

- **🚀 Pursuing**: Formally approved opportunities with dedicated capture resources and an approved capture plan. These are active pursuits where you're executing your capture strategy, engaging customers, and preparing for RFP release.

### Completed Statuses (Historical Record Only)
- **🏆 Won**: Successfully awarded contracts
- **❌ Lost**: Unsuccessful pursuits (valuable for lessons learned)
- **📦 Archived**: Inactive opportunities that are no longer being pursued

**Note**: Only opportunities with "Capture" or "Pursuing" status appear on the Roadmap page to keep it focused on active work. All opportunities remain visible on the Opportunities page for complete historical tracking.

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
