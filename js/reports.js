const Reports = {
    render() {
        const container = document.getElementById('reports-content');
        if (!container) return;

        container.innerHTML = `
            <div class="reports-container">
                <div class="reports-nav-window">
                    <div class="reports-nav">
                        <button class="btn report-tab active" onclick="Reports.showReport('pipeline')">📊 Pipeline Summary</button>
                        <button class="btn report-tab" onclick="Reports.showReport('winloss')">🎯 Win/Loss Analysis</button>
                        <button class="btn report-tab" onclick="Reports.showReport('actions')">📋 Action Performance</button>
                        <button class="btn report-tab" onclick="Reports.showReport('deadlines')">⏰ Upcoming Deadlines</button>
                    </div>
                </div>
                
                <div class="report-content">
                    <div id="pipeline-report" class="report-section active">
                        ${this.renderPipelineReport()}
                    </div>
                    <div id="winloss-report" class="report-section" style="display: none;">
                        ${this.renderWinLossReport()}
                    </div>
                    <div id="actions-report" class="report-section" style="display: none;">
                        ${this.renderActionsReport()}
                    </div>
                    <div id="deadlines-report" class="report-section" style="display: none;">
                        ${this.renderDeadlinesReport()}
                    </div>
                </div>
            </div>
        `;
    },

    showReport(reportType) {
        // Hide all reports
        document.querySelectorAll('.report-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected report
        document.getElementById(`${reportType}-report`).style.display = 'block';
        event.target.classList.add('active');
    },

    renderPipelineReport() {
        const opportunities = DataStore.opportunities;
        const activeOpps = opportunities.filter(opp => !opp.status || opp.status === 'capture' || opp.status === 'pursuing');
        const wonOpps = opportunities.filter(opp => opp.status === 'won');
        const lostOpps = opportunities.filter(opp => opp.status === 'lost');
        
        const totalPipeline = activeOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const weightedPipeline = activeOpps.reduce((sum, opp) => sum + ((opp.value || 0) * (opp.probability || opp.pwin || 0) / 100), 0);
        const totalWonValue = wonOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);
        
        const winRate = (wonOpps.length + lostOpps.length) > 0 ? 
            Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100) : 0;

        // Probability distribution
        const pwinRanges = {
            low: { count: activeOpps.filter(opp => (opp.probability || opp.pwin || 0) <= 30).length, label: '0-30%', color: '#dc3545' },
            medium: { count: activeOpps.filter(opp => (opp.probability || opp.pwin || 0) > 30 && (opp.probability || opp.pwin || 0) <= 60).length, label: '31-60%', color: '#ffc107' },
            high: { count: activeOpps.filter(opp => (opp.probability || opp.pwin || 0) > 60).length, label: '61-100%', color: '#28a745' }
        };

        // Pipeline by customer
        const customerPipeline = {};
        activeOpps.forEach(opp => {
            const customer = opp.client || opp.customer || 'Unknown';
            if (!customerPipeline[customer]) {
                customerPipeline[customer] = { count: 0, value: 0 };
            }
            customerPipeline[customer].count++;
            customerPipeline[customer].value += (opp.value || 0);
        });

        const topCustomers = Object.entries(customerPipeline)
            .sort((a, b) => b[1].value - a[1].value)
            .slice(0, 5);

        return `
            <div class="report-header-window">
                <h2>📊 Pipeline Summary Report</h2>
                <div class="report-date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="report-metrics-window">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Total Active Pipeline</h3>
                        <div class="metric-value">${Utils.formatCurrency(totalPipeline)}</div>
                        <div class="metric-subtitle">${activeOpps.length} opportunities</div>
                    </div>
                    <div class="metric-card">
                        <h3>Weighted Pipeline</h3>
                        <div class="metric-value">${Utils.formatCurrency(weightedPipeline)}</div>
                        <div class="metric-subtitle">Probability adjusted</div>
                    </div>
                    <div class="metric-card">
                        <h3>Win Rate</h3>
                        <div class="metric-value">${winRate}%</div>
                        <div class="metric-subtitle">${wonOpps.length}W / ${lostOpps.length}L</div>
                    </div>
                    <div class="metric-card">
                        <h3>Total Won Value</h3>
                        <div class="metric-value">${Utils.formatCurrency(totalWonValue)}</div>
                        <div class="metric-subtitle">${wonOpps.length} contracts</div>
                    </div>
                </div>
            </div>

            <div class="report-charts-window">
                <div class="report-section-grid">
                    <div class="report-card">
                        <h3>🎯 Probability Distribution</h3>
                        <div class="chart-container">
                            <div class="pie-chart-container">
                                <div class="pie-chart" id="pwin-pie-chart">
                                    ${this.renderPieChart([
                                        { label: pwinRanges.low.label, value: pwinRanges.low.count, color: pwinRanges.low.color },
                                        { label: pwinRanges.medium.label, value: pwinRanges.medium.count, color: pwinRanges.medium.color },
                                        { label: pwinRanges.high.label, value: pwinRanges.high.count, color: pwinRanges.high.color }
                                    ])}
                                </div>
                                <div class="pie-legend">
                                    ${Object.entries(pwinRanges).map(([key, data]) => `
                                        <div class="legend-item">
                                            <div class="legend-color" style="background: ${data.color};"></div>
                                            <span class="legend-label">${data.label} PWin</span>
                                            <span class="legend-value">${data.count} opps</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="report-card">
                        <h3>🏢 Top Customers by Pipeline Value</h3>
                        <div class="horizontal-bar-chart">
                            ${topCustomers.map(([customer, data], index) => {
                                const maxValue = topCustomers[0] ? topCustomers[0][1].value : 1;
                                const percentage = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                                return `
                                    <div class="bar-row">
                                        <div class="bar-label">${customer}</div>
                                        <div class="bar-container">
                                            <div class="bar-fill" style="width: ${percentage}%; background: linear-gradient(90deg, #2a5298 0%, #4dabf7 100%);"></div>
                                            <div class="bar-text">${Utils.formatCurrency(data.value)}</div>
                                        </div>
                                        <div class="bar-count">${data.count} opp${data.count !== 1 ? 's' : ''}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderWinLossReport() {
        const opportunities = DataStore.opportunities;
        const wonOpps = opportunities.filter(opp => opp.status === 'won');
        const lostOpps = opportunities.filter(opp => opp.status === 'lost');
        const totalDecided = wonOpps.length + lostOpps.length;
        
        const winRate = totalDecided > 0 ? Math.round((wonOpps.length / totalDecided) * 100) : 0;

        // Win/Loss by opportunity size
        const sizeCategories = {
            small: { won: 0, lost: 0, threshold: 1000000, label: 'Small (<$1M)' },
            medium: { won: 0, lost: 0, threshold: 5000000, label: 'Medium ($1M-$5M)' },
            large: { won: 0, lost: 0, threshold: Infinity, label: 'Large (>$5M)' }
        };

        [...wonOpps, ...lostOpps].forEach(opp => {
            const value = opp.value || 0;
            const status = opp.status;
            
            if (value < sizeCategories.small.threshold) {
                sizeCategories.small[status]++;
            } else if (value < sizeCategories.medium.threshold) {
                sizeCategories.medium[status]++;
            } else {
                sizeCategories.large[status]++;
            }
        });

        // Customer performance analysis
        const customerPerformance = {};
        [...wonOpps, ...lostOpps].forEach(opp => {
            const customer = opp.client || opp.customer || 'Unknown';
            if (!customerPerformance[customer]) {
                customerPerformance[customer] = { won: 0, lost: 0, totalValue: 0 };
            }
            customerPerformance[customer][opp.status]++;
            customerPerformance[customer].totalValue += (opp.value || 0);
        });

        const topCustomers = Object.entries(customerPerformance)
            .filter(([customer, data]) => (data.won + data.lost) > 0)
            .sort((a, b) => (b[1].won + b[1].lost) - (a[1].won + a[1].lost))
            .slice(0, 5);

        // Competitive analysis
        const competitiveData = {};
        [...wonOpps, ...lostOpps].forEach(opp => {
            const incumbent = opp.incumbent || 'Unknown';
            if (!competitiveData[incumbent]) {
                competitiveData[incumbent] = { won: 0, lost: 0 };
            }
            competitiveData[incumbent][opp.status]++;
        });

        const topCompetitors = Object.entries(competitiveData)
            .filter(([competitor, data]) => (data.won + data.lost) > 0)
            .sort((a, b) => (b[1].won + b[1].lost) - (a[1].won + a[1].lost))
            .slice(0, 5);

        return `
            <div class="report-header-window">
                <h2>🎯 Win/Loss Analysis Report</h2>
                <div class="report-date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="report-metrics-window">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Overall Win Rate</h3>
                        <div class="metric-value">${winRate}%</div>
                        <div class="metric-subtitle">${wonOpps.length} wins / ${totalDecided} decided</div>
                    </div>
                    <div class="metric-card">
                        <h3>Won Value</h3>
                        <div class="metric-value">${Utils.formatCurrency(wonOpps.reduce((sum, opp) => sum + (opp.value || 0), 0))}</div>
                        <div class="metric-subtitle">${wonOpps.length} contracts</div>
                    </div>
                    <div class="metric-card">
                        <h3>Lost Value</h3>
                        <div class="metric-value">${Utils.formatCurrency(lostOpps.reduce((sum, opp) => sum + (opp.value || 0), 0))}</div>
                        <div class="metric-subtitle">${lostOpps.length} opportunities</div>
                    </div>
                    <div class="metric-card">
                        <h3>Avg Win Size</h3>
                        <div class="metric-value">${wonOpps.length > 0 ? Utils.formatCurrency(wonOpps.reduce((sum, opp) => sum + (opp.value || 0), 0) / wonOpps.length) : '$0'}</div>
                        <div class="metric-subtitle">Per contract</div>
                    </div>
                </div>
            </div>

            <div class="report-charts-window">
                <div class="report-section-grid">
                    <div class="report-card">
                        <h3>📊 Performance by Opportunity Size</h3>
                        <div class="stacked-bar-chart">
                            ${Object.entries(sizeCategories).map(([key, data]) => {
                                const total = data.won + data.lost;
                                if (total === 0) return '';
                                
                                const winRate = Math.round((data.won / total) * 100);
                                const wonWidth = (data.won / total) * 100;
                                const lostWidth = (data.lost / total) * 100;
                                
                                return `
                                    <div class="stacked-bar-row">
                                        <div class="stacked-bar-label">
                                            <div class="size-label">${data.label}</div>
                                            <div class="win-rate-badge ${winRate >= 60 ? 'high' : winRate >= 40 ? 'medium' : 'low'}">
                                                ${winRate}% Win Rate
                                            </div>
                                        </div>
                                        <div class="stacked-bar-container">
                                            <div class="stacked-bar">
                                                <div class="bar-segment won" style="width: ${wonWidth}%"></div>
                                                <div class="bar-segment lost" style="width: ${lostWidth}%"></div>
                                            </div>
                                            <div class="stacked-bar-text">${data.won}W / ${data.lost}L</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="report-card">
                        <h3>🏢 Customer Relationship Performance</h3>
                        <div class="customer-performance-chart">
                            ${topCustomers.map(([customer, data]) => {
                                const total = data.won + data.lost;
                                const winRate = Math.round((data.won / total) * 100);
                                
                                return `
                                    <div class="customer-performance-row">
                                        <div class="customer-info">
                                            <div class="customer-name">${customer}</div>
                                            <div class="customer-record">${data.won}W / ${data.lost}L • ${Utils.formatCurrency(data.totalValue)} total value</div>
                                        </div>
                                        <div class="performance-visual">
                                            <div class="win-rate-circle ${winRate >= 60 ? 'high' : winRate >= 40 ? 'medium' : 'low'}">
                                                <div class="win-rate-inner">
                                                    <div class="win-rate-percent">${winRate}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="report-charts-window">
                <div class="report-section-grid">
                    <div class="report-card">
                        <h3>⚔️ Competitive Analysis</h3>
                        <div class="report-text-content">
                            <p><strong>Performance Against Key Competitors:</strong></p>
                            ${topCompetitors.map(([competitor, data]) => {
                                const total = data.won + data.lost;
                                const winRate = Math.round((data.won / total) * 100);
                                const statusColor = winRate >= 60 ? '#28a745' : winRate >= 40 ? '#ffc107' : '#dc3545';
                                
                                return `
                                    <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${statusColor};">
                                        <strong>vs ${competitor}</strong><br>
                                        <span style="color: #666;">Win Rate: ${winRate}% (${data.won}W / ${data.lost}L across ${total} competitions)</span>
                                    </div>
                                `;
                            }).join('')}
                            
                            <p><strong>Key Insights:</strong></p>
                            <ul>
                                <li>Strongest performance: ${this.getBestPerformanceCategory(sizeCategories)}</li>
                                <li>Best customer relationship: ${topCustomers.length > 0 ? topCustomers[0][0] : 'N/A'}</li>
                                <li>Most challenging competitor: ${this.getMostChallengingCompetitor(topCompetitors)}</li>
                                <li>Overall trend: ${wonOpps.length >= lostOpps.length ? 'Positive momentum' : 'Need strategic review'}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="report-card">
                        <h3>📈 Win/Loss Trends</h3>
                        <div class="report-text-content">
                            <p><strong>Recent Performance Analysis:</strong></p>
                            ${this.generateTrendAnalysis(wonOpps, lostOpps)}
                            
                            <p><strong>Strategic Recommendations:</strong></p>
                            <ul>
                                ${this.generateRecommendations(sizeCategories, topCustomers, winRate).map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                            
                            <p><strong>Focus Areas for Improvement:</strong></p>
                            <ul>
                                <li>Strengthen relationships with high-value customers</li>
                                <li>Develop competitive advantages in challenging segments</li>
                                <li>Leverage successful patterns from wins</li>
                                <li>Address recurring themes from losses</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderActionsReport() {
        const actions = DataStore.actions;
        const completedActions = actions.filter(action => action.completed);
        const activeActions = actions.filter(action => !action.completed);
        const overdueActions = activeActions.filter(action => new Date(action.dueDate) < new Date());
        
        const completionRate = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;

        return `
            <div class="report-header-window">
                <h2>📋 Action Item Performance Report</h2>
                <div class="report-date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="report-metrics-window">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Completion Rate</h3>
                        <div class="metric-value">${completionRate}%</div>
                        <div class="metric-subtitle">${completedActions.length} / ${actions.length} completed</div>
                    </div>
                    <div class="metric-card">
                        <h3>Active Actions</h3>
                        <div class="metric-value">${activeActions.length}</div>
                        <div class="metric-subtitle">In progress</div>
                    </div>
                    <div class="metric-card">
                        <h3>Overdue Actions</h3>
                        <div class="metric-value">${overdueActions.length}</div>
                        <div class="metric-subtitle">Need attention</div>
                    </div>
                    <div class="metric-card">
                        <h3>High Priority</h3>
                        <div class="metric-value">${actions.filter(a => a.priority === 'High').length}</div>
                        <div class="metric-subtitle">Critical items</div>
                    </div>
                </div>
            </div>

            <div class="report-charts-window">
                <div class="report-text-content">
                    <p><strong>Action Item Analysis:</strong></p>
                    <ul>
                        <li>Most overdue actions are in the ${this.getMostCommonPhase(overdueActions)} phase</li>
                        <li>Average time to completion: ${this.getAverageCompletionTime()} days</li>
                        <li>Peak activity periods align with proposal deadlines</li>
                        <li>High-priority items have ${this.getHighPriorityCompletionRate()}% completion rate</li>
                    </ul>
                    
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Focus on reducing overdue items in critical phases</li>
                        <li>Implement automated reminders for approaching deadlines</li>
                        <li>Consider resource reallocation for high-priority initiatives</li>
                    </ul>
                </div>
            </div>
        `;
    },

    renderDeadlinesReport() {
        const opportunities = DataStore.opportunities;
        const actions = DataStore.actions;
        const today = new Date();
        
        // Opportunities closing soon
        const closingSoon = opportunities
            .filter(opp => {
                const status = opp.status || 'capture';
                return (status === 'capture' || status === 'pursuing') && (opp.closeDate || opp.rfpDate);
            })
            .map(opp => ({
                ...opp,
                daysUntil: Math.ceil((new Date(opp.closeDate || opp.rfpDate) - today) / (1000 * 60 * 60 * 24))
            }))
            .filter(opp => opp.daysUntil >= 0 && opp.daysUntil <= 90)
            .sort((a, b) => a.daysUntil - b.daysUntil);

        // Actions due soon
        const actionsDueSoon = actions
            .filter(action => !action.completed)
            .map(action => ({
                ...action,
                daysUntil: Math.ceil((new Date(action.dueDate) - today) / (1000 * 60 * 60 * 24))
            }))
            .filter(action => action.daysUntil >= -7 && action.daysUntil <= 30)
            .sort((a, b) => a.daysUntil - b.daysUntil);

        return `
            <div class="report-header-window">
                <h2>⏰ Upcoming Deadlines Report</h2>
                <div class="report-date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="report-metrics-window">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Opportunities Closing Soon</h3>
                        <div class="metric-value">${closingSoon.length}</div>
                        <div class="metric-subtitle">Next 90 days</div>
                    </div>
                    <div class="metric-card">
                        <h3>Actions Due Soon</h3>
                        <div class="metric-value">${actionsDueSoon.filter(a => a.daysUntil >= 0).length}</div>
                        <div class="metric-subtitle">Next 30 days</div>
                    </div>
                    <div class="metric-card">
                        <h3>Overdue Actions</h3>
                        <div class="metric-value">${actionsDueSoon.filter(a => a.daysUntil < 0).length}</div>
                        <div class="metric-subtitle">Need attention</div>
                    </div>
                    <div class="metric-card">
                        <h3>This Week</h3>
                        <div class="metric-value">${actionsDueSoon.filter(a => a.daysUntil >= 0 && a.daysUntil <= 7).length}</div>
                        <div class="metric-subtitle">Actions due</div>
                    </div>
                </div>
            </div>

            <div class="report-charts-window">
                <div class="report-text-content">
                    <p><strong>Critical Upcoming Deadlines:</strong></p>
                    ${closingSoon.slice(0, 5).map(opp => `
                        <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${opp.daysUntil <= 7 ? '#dc3545' : opp.daysUntil <= 30 ? '#ffc107' : '#28a745'};">
                            <strong>${opp.name}</strong> - ${opp.client || 'Unknown Customer'}<br>
                            <span style="color: #666;">Due in ${opp.daysUntil} days (${Utils.formatDate(opp.closeDate || opp.rfpDate)}) - ${Utils.formatCurrency(opp.value || 0)}</span>
                        </div>
                    `).join('')}
                    
                    <p><strong>Urgent Action Items:</strong></p>
                    ${actionsDueSoon.slice(0, 5).map(action => {
                        const urgencyLevel = action.daysUntil < 0 ? 'Overdue' : action.daysUntil <= 1 ? 'Critical' : action.daysUntil <= 7 ? 'Urgent' : 'Normal';
                        const urgencyColor = action.daysUntil < 0 ? '#dc3545' : action.daysUntil <= 1 ? '#fd7e14' : action.daysUntil <= 7 ? '#ffc107' : '#28a745';
                        
                        return `
                            <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${urgencyColor};">
                                <strong>${action.title}</strong> - ${urgencyLevel}<br>
                                <span style="color: #666;">Due: ${Utils.formatDate(action.dueDate)} (${action.daysUntil < 0 ? Math.abs(action.daysUntil) + ' days overdue' : action.daysUntil + ' days left'})</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    // Helper methods
    getMostCommonPhase(actions) {
        if (!actions.length) return 'N/A';
        const phases = actions.map(a => a.phase).filter(p => p);
        const phaseCount = {};
        phases.forEach(phase => {
            phaseCount[phase] = (phaseCount[phase] || 0) + 1;
        });
        return Object.keys(phaseCount).reduce((a, b) => phaseCount[a] > phaseCount[b] ? a : b) || 'N/A';
    },

    getAverageCompletionTime() {
        const completedActions = DataStore.actions.filter(a => a.completed && a.completedDate && a.createdDate);
        if (!completedActions.length) return 'N/A';
        
        const totalDays = completedActions.reduce((sum, action) => {
            const created = new Date(action.createdDate);
            const completed = new Date(action.completedDate);
            return sum + Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
        }, 0);
        
        return Math.round(totalDays / completedActions.length);
    },

    getHighPriorityCompletionRate() {
        const highPriorityActions = DataStore.actions.filter(a => a.priority === 'High');
        if (!highPriorityActions.length) return 0;
        
        const completed = highPriorityActions.filter(a => a.completed).length;
        return Math.round((completed / highPriorityActions.length) * 100);
    },

    getBestPerformanceCategory(sizeCategories) {
        let bestCategory = 'Unknown';
        let bestRate = 0;
        
        Object.entries(sizeCategories).forEach(([key, data]) => {
            const total = data.won + data.lost;
            if (total > 0) {
                const rate = (data.won / total) * 100;
                if (rate > bestRate) {
                    bestRate = rate;
                    bestCategory = data.label;
                }
            }
        });
        
        return `${bestCategory} (${Math.round(bestRate)}% win rate)`;
    },

    getMostChallengingCompetitor(topCompetitors) {
        if (topCompetitors.length === 0) return 'N/A';
        
        let mostChallenging = topCompetitors[0];
        let lowestWinRate = 100;
        
        topCompetitors.forEach(([competitor, data]) => {
            const total = data.won + data.lost;
            const winRate = (data.won / total) * 100;
            if (winRate < lowestWinRate) {
                lowestWinRate = winRate;
                mostChallenging = [competitor, data];
            }
        });
        
        return `${mostChallenging[0]} (${Math.round(lowestWinRate)}% win rate)`;
    },

    generateTrendAnalysis(wonOpps, lostOpps) {
        const allDecided = [...wonOpps, ...lostOpps].sort((a, b) => 
            new Date(b.statusChangedDate || b.createdDate) - new Date(a.statusChangedDate || a.createdDate)
        );
        
        const recent = allDecided.slice(0, 5);
        const recentWins = recent.filter(opp => opp.status === 'won').length;
        const recentRate = recent.length > 0 ? Math.round((recentWins / recent.length) * 100) : 0;
        
        return `
            <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <strong>Last 5 Decisions:</strong> ${recentRate}% win rate (${recentWins} wins out of ${recent.length})<br>
                <span style="color: #666;">
                    Recent outcomes show ${recentRate >= 60 ? 'strong' : recentRate >= 40 ? 'moderate' : 'concerning'} performance trends
                </span>
            </div>
        `;
    },

    generateRecommendations(sizeCategories, topCustomers, overallWinRate) {
        const recommendations = [];
        
        // Size-based recommendations
        const smallRate = sizeCategories.small.won + sizeCategories.small.lost > 0 ? 
            (sizeCategories.small.won / (sizeCategories.small.won + sizeCategories.small.lost)) * 100 : 0;
        const largeRate = sizeCategories.large.won + sizeCategories.large.lost > 0 ? 
            (sizeCategories.large.won / (sizeCategories.large.won + sizeCategories.large.lost)) * 100 : 0;
        
        if (smallRate > largeRate + 20) {
            recommendations.push('Focus on smaller opportunities where win rate is significantly higher');
        } else if (largeRate > smallRate + 20) {
            recommendations.push('Prioritize larger opportunities where competitive advantage is strongest');
        }
        
        // Win rate recommendations
        if (overallWinRate < 40) {
            recommendations.push('Implement more rigorous bid/no-bid qualification process');
            recommendations.push('Strengthen customer engagement and relationship building');
        } else if (overallWinRate > 70) {
            recommendations.push('Consider pursuing more challenging, higher-value opportunities');
        }
        
        // Customer recommendations
        if (topCustomers.length > 0) {
            const bestCustomer = topCustomers[0];
            const bestRate = (bestCustomer[1].won / (bestCustomer[1].won + bestCustomer[1].lost)) * 100;
            if (bestRate > 60) {
                recommendations.push(`Expand relationship with ${bestCustomer[0]} - proven success partner`);
            }
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Continue current strategy while monitoring competitive landscape');
            recommendations.push('Focus on lessons learned from recent wins and losses');
        }
        
        return recommendations;
    },

    renderPieChart(data) {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return '<div class="no-data">No data available</div>';
        
        let cumulativeAngle = 0;
        const radius = 80;
        const centerX = 100;
        const centerY = 100;
        
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                ${data.map(item => {
                    if (item.value === 0) return '';
                    
                    const angle = (item.value / total) * 2 * Math.PI;
                    const startAngle = cumulativeAngle;
                    const endAngle = cumulativeAngle + angle;
                    
                    const x1 = centerX + radius * Math.cos(startAngle);
                    const y1 = centerY + radius * Math.sin(startAngle);
                    const x2 = centerX + radius * Math.cos(endAngle);
                    const y2 = centerY + radius * Math.sin(endAngle);
                    
                    const largeArcFlag = angle > Math.PI ? 1 : 0;
                    
                    const pathData = [
                        `M ${centerX} ${centerY}`,
                        `L ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        'Z'
                    ].join(' ');
                    
                    cumulativeAngle += angle;
                    
                    return `<path d="${pathData}" fill="${item.color}" stroke="white" stroke-width="2"/>`;
                }).join('')}
            </svg>
        `;
    }
};