const Utils = {
    formatCurrency(amount) {
        if (amount == null || amount === '') return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    getDaysUntil(dateString) {
        if (!dateString) return 'N/A';
        const targetDate = new Date(dateString);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Today';
        return diffDays;
    },

    formatPhase(phase) {
        const phases = {
            'identification': 'Identification',
            'qualification': 'Qualification', 
            'planning': 'Planning',
            'engagement': 'Engagement',
            'intelligence': 'Intelligence',
            'preparation': 'Preparation'
        };
        return phases[phase] || phase;
    },

    generateId() {
        return Date.now();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
