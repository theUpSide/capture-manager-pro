// Gate Packages - List management and modals
const GatePackages = {
    render() {
        const view = document.getElementById('gate-packages-view');
        if (!view) return;
        
        const gatePackages = DataStore.gatePackages || [];
        let html = '<h2>Gate Packages</h2>';
        
        if (gatePackages.length === 0) {
            html += '<p>No gate packages created yet. Create gate packages from the Opportunities page by clicking the "Gate Reviews" button on any opportunity card.</p>';
        } else {
            html += `
                <table class="gate-packages-table">
                    <thead>
                        <tr>
                            <th>Opportunity</th>
                            <th>Gate Number</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            gatePackages.forEach(gp => {
                const opp = DataStore.getOpportunity(gp.opportunityId);
                html += `
                    <tr>
                        <td>${opp?.name || 'Unknown Opportunity'}</td>
                        <td>Gate ${gp.gateNumber}</td>
                        <td><span class="status-badge status-${gp.status}">${this.formatStatus(gp.status)}</span></td>
                        <td>${Utils.formatDate(gp.createdDate)}</td>
                        <td>${Utils.formatDate(gp.lastModified)}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="GatePackageGenerator.openGatePackage(${gp.id})">Open</button>
                            <button class="btn btn-danger" onclick="GatePackages.deleteGatePackage(${gp.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
        }
        
        view.innerHTML = html;
    },

    formatStatus(status) {
        const statusMap = {
            'draft': 'Draft',
            'in-progress': 'In Progress',
            'under-review': 'Under Review',
            'approved': 'Approved',
            'rejected': 'Rejected'
        };
        return statusMap[status] || status;
    },

    openGatePackageSelector(opportunityId) {
        const modal = document.getElementById('gatePackageSelectionModal');
        if (!modal) {
            this.createGatePackageSelectionModal();
        }
        
        const content = document.getElementById('gate-package-selection-content');
        const gates = [1, 2, 3, 4];
        const opportunity = DataStore.getOpportunity(opportunityId);
        
        let html = `
            <h2>Select Gate Package</h2>
            <p>Create or open a gate package for: <strong>${opportunity?.name || 'Unknown Opportunity'}</strong></p>
            <div class="gate-selector-buttons">
        `;
        
        gates.forEach(g => {
            const existing = DataStore.gatePackages.find(gp => 
                gp.opportunityId == opportunityId && gp.gateNumber === g
            );
            
            const btnText = existing ? `Gate ${g} (Open Existing)` : `Gate ${g} (Create New)`;
            const btnClass = existing ? 'btn-secondary' : 'btn-primary';
            
            const onclick = existing 
                ? `GatePackageGenerator.openGatePackage(${existing.id}); GatePackages.closeGatePackageSelectionModal();`
                : `const newPkg = GatePackageGenerator.createGatePackage(${opportunityId}, ${g}); if (newPkg) { GatePackageGenerator.openGatePackage(newPkg.id); GatePackages.closeGatePackageSelectionModal(); }`;
            
            html += `<button class="btn ${btnClass}" onclick="${onclick}">${btnText}</button>`;
        });
        
        html += `
            </div>
            <button class="btn btn-secondary" onclick="GatePackages.closeGatePackageSelectionModal()">Cancel</button>
        `;
        
        content.innerHTML = html;
        modal.style.display = 'block';
    },

    createGatePackageSelectionModal() {
        const modalHTML = `
            <div id="gatePackageSelectionModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="GatePackages.closeGatePackageSelectionModal()">×</span>
                    <div id="gate-package-selection-content">
                        <!-- Selection content populated dynamically -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    closeGatePackageSelectionModal() {
        const modal = document.getElementById('gatePackageSelectionModal');
        if (modal) modal.style.display = 'none';
    },

    deleteGatePackage(packageId) {
        const gatePackage = DataStore.gatePackages.find(gp => gp.id == packageId);
        if (!gatePackage) {
            alert('Gate package not found');
            return;
        }
        
        const opportunity = DataStore.getOpportunity(gatePackage.opportunityId);
        const confirmMessage = `Are you sure you want to delete Gate ${gatePackage.gateNumber} for ${opportunity?.name || 'Unknown Opportunity'}? This action cannot be undone.`;
        
        if (!confirm(confirmMessage)) return;
        
        DataStore.gatePackages = DataStore.gatePackages.filter(gp => gp.id != packageId);
        DataStore.saveData();
        this.render(); // Re-render the list
        
        // Show success message
        this.showMessage('Gate package deleted successfully', 'success');
    },

    updateStatus(packageId, newStatus) {
        const gp = DataStore.gatePackages.find(gp => gp.id == packageId);
        if (gp) {
            gp.status = newStatus;
            gp.lastModified = new Date().toISOString().split('T')[0];
            
            if (newStatus === 'approved') {
                gp.completedDate = new Date().toISOString().split('T')[0];
            }
            
            DataStore.saveData();
            this.render(); // Re-render to show updated status
        }
    },

    showMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'};
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    },

    // Debug function to help troubleshoot data issues
    debug() {
        console.log('=== GATE PACKAGES DEBUG ===');
        console.log('Total gate packages:', DataStore.gatePackages?.length || 0);
        console.log('Gate packages:', DataStore.gatePackages);
        console.log('Opportunities:', DataStore.opportunities.map(o => ({id: o.id, name: o.name})));
        console.log('=== END DEBUG ===');
    }
};