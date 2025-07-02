const DataManager = {
    saveAllData() {
        const data = DataStore.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `capture_manager_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    loadAllData() {
        document.getElementById('dataFileInput').click();
    },

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = DataStore.importData(e.target.result);
                if (result.success) {
                    alert(result.message);
                    // Refresh current view
                    const activeView = document.querySelector('[id$="-view"]:not([style*="display: none"])');
                    if (activeView) {
                        const viewName = activeView.id.replace('-view', '');
                        switch(viewName) {
                            case 'dashboard':
                                Dashboard.render();
                                break;
                            case 'opportunities':
                                Opportunities.render();
                                break;
                            case 'roadmap':
                                if (typeof Roadmap !== 'undefined') Roadmap.render();
                                break;
                            case 'actions':
                                if (typeof Actions !== 'undefined') Actions.render();
                                break;
                            case 'templates':
                                if (typeof Templates !== 'undefined') Templates.render();
                                break;
                        }
                    }
                } else {
                    alert('Error loading data: ' + result.message);
                }
            } catch (error) {
                console.error('File load error:', error);
                alert('Error loading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
};
