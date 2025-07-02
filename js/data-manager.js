const DataManager = {
    saveAllData() {
        try {
            // Collect all data from DataStore
            const allData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                data: {
                    opportunities: DataStore.opportunities,
                    actions: DataStore.actions,
                    templates: DataStore.templates,
                    savedTemplates: DataStore.savedTemplates,
                    captureRoadmap: DataStore.captureRoadmap
                },
                metadata: {
                    totalOpportunities: DataStore.opportunities.length,
                    totalActions: DataStore.actions.length,
                    totalSavedTemplates: DataStore.savedTemplates.length,
                    exportedBy: "Capture Manager Pro"
                }
            };

            // Create filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `capture_manager_data_${timestamp}.json`;

            // Create and download file
            const dataStr = JSON.stringify(allData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success message
            this.showNotification('✅ Data saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('❌ Error saving data. Please try again.', 'error');
        }
    },

    loadAllData() {
        if (!confirm('⚠️ Loading data will replace all current data. Are you sure you want to continue?')) {
            return;
        }
        
        // Trigger file input
        document.getElementById('dataFileInput').click();
    },

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.processImportedData(importedData);
            } catch (error) {
                console.error('Error parsing file:', error);
                this.showNotification('❌ Invalid file format. Please select a valid JSON export file.', 'error');
            }
        };
        
        reader.onerror = () => {
            this.showNotification('❌ Error reading file. Please try again.', 'error');
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    },

    processImportedData(importedData) {
        try {
            // Validate data structure
            if (!this.validateImportedData(importedData)) {
                this.showNotification('❌ Invalid data format. Please check your export file.', 'error');
                return;
            }

            // Backup current data (in case user wants to undo)
            const backupData = {
                opportunities: [...DataStore.opportunities],
                actions: [...DataStore.actions],
                savedTemplates: [...DataStore.savedTemplates]
            };
            sessionStorage.setItem('dataBackup', JSON.stringify(backupData));

            // Load the imported data
            DataStore.opportunities = importedData.data.opportunities || [];
            DataStore.actions = importedData.data.actions || [];
            DataStore.savedTemplates = importedData.data.savedTemplates || [];
            
            // Update templates if provided (but keep default structure)
            if (importedData.data.templates) {
                DataStore.templates = importedData.data.templates;
            }

            // Update localStorage
            localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));

            // Refresh all views
            this.refreshAllViews();

            // Show success with import summary
            const summary = this.getImportSummary(importedData);
            this.showNotification(`✅ Data loaded successfully!\n${summary}`, 'success');
            
        } catch (error) {
            console.error('Error processing imported data:', error);
            this.showNotification('❌ Error loading data. Please check your file and try again.', 'error');
        }
    },

    validateImportedData(data) {
        // Check if it has the expected structure
        if (!data || typeof data !== 'object') return false;
        if (!data.data || typeof data.data !== 'object') return false;
        
        // Check for required arrays
        const requiredArrays = ['opportunities', 'actions'];
        for (const key of requiredArrays) {
            if (data.data[key] && !Array.isArray(data.data[key])) {
                return false;
            }
        }

        return true;
    },

    getImportSummary(data) {
        const opportunities = data.data.opportunities?.length || 0;
        const actions = data.data.actions?.length || 0;
        const savedTemplates = data.data.savedTemplates?.length || 0;
        
        return `Imported: ${opportunities} opportunities, ${actions} actions, ${savedTemplates} saved templates`;
    },

    refreshAllViews() {
        // Refresh dashboard
        Dashboard.refresh();
        
        // Refresh current view
        const currentView = document.querySelector('[id$="-view"]:not([style*="display: none"])');
        if (currentView) {
            const viewId = currentView.id;
            switch(viewId) {
                case 'opportunities-view':
                    Opportunities.renderAll();
                    break;
                case 'roadmap-view':
                    Roadmap.render();
                    break;
                case 'actions-view':
                    Actions.renderAll();
                    break;
                case 'templates-view':
                    Templates.render();
                    break;
                case 'saved-templates-view':
                    Templates.renderSaved();
                    break;
            }
        }
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            max-width: 400px;
            white-space: pre-line;
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#212529';
                break;
            default:
                notification.style.backgroundColor = '#2a5298';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    },

    // Emergency restore function (can be called from console)
    restoreBackup() {
        const backup = sessionStorage.getItem('dataBackup');
        if (backup) {
            try {
                const backupData = JSON.parse(backup);
                DataStore.opportunities = backupData.opportunities;
                DataStore.actions = backupData.actions;
                DataStore.savedTemplates = backupData.savedTemplates;
                localStorage.setItem('savedTemplates', JSON.stringify(DataStore.savedTemplates));
                this.refreshAllViews();
                this.showNotification('✅ Backup restored successfully!', 'success');
            } catch (error) {
                this.showNotification('❌ Error restoring backup.', 'error');
            }
        } else {
            this.showNotification('ℹ️ No backup available.', 'warning');
        }
    },

    // Clear all data (with confirmation)
    clearAllData() {
        if (!confirm('⚠️ This will delete ALL data permanently. Are you absolutely sure?')) {
            return;
        }
        
        if (!confirm('🚨 FINAL WARNING: This cannot be undone! Continue?')) {
            return;
        }

        // Clear all data
        DataStore.opportunities = [];
        DataStore.actions = [];
        DataStore.savedTemplates = [];
        localStorage.clear();
        
        this.refreshAllViews();
        this.showNotification('🗑️ All data cleared.', 'warning');
    },

    // Export specific data types
    exportOpportunities() {
        const data = {
            exportType: 'opportunities',
            exportDate: new Date().toISOString(),
            data: DataStore.opportunities
        };
        
        this.downloadJSON(data, `opportunities_${new Date().toISOString().split('T')[0]}.json`);
    },

    exportActions() {
        const data = {
            exportType: 'actions',
            exportDate: new Date().toISOString(),
            data: DataStore.actions
        };
        
        this.downloadJSON(data, `actions_${new Date().toISOString().split('T')[0]}.json`);
    },

    downloadJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};
