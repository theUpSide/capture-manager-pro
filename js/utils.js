const Utils = {
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    },

    formatCurrency(amount) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    },

    calculateDaysUntilDate(dateString) {
        const targetDate = new Date(dateString);
        const today = new Date();
        return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    }
};
