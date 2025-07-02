const DataStore = {
    // ... existing properties ...

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
        
        // Migrate existing opportunities to include status if they don't have one
        this.opportunities.forEach(opp => {
            if (!opp.status) {
                opp.status = 'capture';
            }
        });
    },

    // ... rest of existing methods ...
};
