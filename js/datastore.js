const DataStore = {
    opportunities: [],
    savedTemplates: [],
    contacts: [],
    tasks: [],
    templates: [
        // ... existing templates array stays the same ...
    ],

    saveData() {
        localStorage.setItem('opportunities', JSON.stringify(this.opportunities));
        localStorage.setItem('savedTemplates', JSON.stringify(this.savedTemplates));
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },

    loadData() {
        this.opportunities = JSON.parse(localStorage.getItem('opportunities')) || [];
        this.savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
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
    },

    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Handle nested structure from your JSON file
            const opportunitiesData = data.data ? data.data.opportunities : data.opportunities;
            const templatesData = data.data ? data.data.savedTemplates : data.savedTemplates;
            
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
            
            // Save the imported data
            this.saveData();
            
            return {
                success: true,
                message: `Imported ${this.opportunities.length} opportunities and ${this.savedTemplates.length} saved templates`
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
            tasks: this.tasks
        };
    }
};
