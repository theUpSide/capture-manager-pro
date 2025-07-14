// Gate Packages - List management and modals
const GatePackages = {
    render() {
        const view = document.getElementById('gate-packages-view');
        if (!view) return;
        const gatePackages = DataStore.gatePackages || [];
        let html = '<h2>Gate Packages</h2>';
        if (gatePackages.length === 0) {
            html += '<p>No gate packages created yet.</p>';
        } else {
            html += '<table class="gate-packages-table"><thead><tr><th>Opportunity</th><th>Gate Number</th><th>Status</th><th>Created</th><th>Last Modified</th><th>Actions</th></tr></thead><tbody>';
            gatePackages.forEach(gp => {
                const opp = DataStore.getOpportunity(gp.opportunityId);
                html += `<tr>
                    <td>${opp?.name || 'Unknown Opportunity'}</td>
                    <td>${gp.gateNumber}</td>
                    <td><span class="status-badge status-${gp.status}">${gp.status}</span></td>
                    <td>${Utils.formatDate(gp.createdDate)}</td>
                    <td>${Utils.formatDate(gp.lastModified)}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="GatePackageGenerator.openGatePackage('${gp.id}')">Open</button>
                        <button class="btn btn-danger" onclick="GatePackages.deleteGatePackage('${gp.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
        }
        view.innerHTML = html;
    },

    openGatePackageSelector(opportunityId) {
        const modal = document.getElementById('gatePackageSelectionModal');
        if (!modal) {
            this.createGatePackageSelectionModal();
        }
        const content = document.getElementById('gate-package-selection-content');
        const gates = [1, 2, 3, 4];
        let html = '<h2>Select Gate Package for Opportunity</h2>';
        gates.forEach(g => {
            const existing = DataStore.gatePackages.find(gp => gp.opportunityId === opportunityId && gp.gateNumber === g);
            const btnText = existing ? `Gate ${g} (Open Existing)` : `Gate ${g} (Create New)`;
            const onclick = existing 
                ? `GatePackageGenerator.openGatePackage('${existing.id}')`
                : `const newPkg = GatePackageGenerator.createGatePackage('${opportunityId}', ${g}); if (newPkg) GatePackageGenerator.openGatePackage(newPkg.id);`;
            html += `<button class="btn btn-primary" onclick="${onclick}">${btnText}</button>`;
        });
        content.innerHTML = html + '<button class="btn btn-secondary" onclick="GatePackages.closeGatePackageSelectionModal()">Cancel</button>';
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
        if (!confirm('Are you sure you want to delete this gate package? This action cannot be undone.')) return;
        DataStore.gatePackages = DataStore.gatePackages.filter(gp => gp.id !== packageId);
        DataStore.saveData();
        this.render(); // Re-render the list
    },

    updateStatus(packageId, newStatus) {
        const gp = DataStore.gatePackages.find(gp => gp.id === packageId);
        if (gp) {
            gp.status = newStatus;
            if (newStatus === 'approved') {
                gp.completedDate = new Date().toISOString().split('T')[0];
            }
            DataStore.saveData();
            // Optional: Refresh views if needed
        }
    }
};