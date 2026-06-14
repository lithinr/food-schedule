// Application Configuration
const CONFIG = {
    SUPABASE: {
        TABLE: 'app_state',
        APP_STATE_ID: 'family_main'
    },
    CATEGORIES: {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        morningSnack: 'Morning Snack',
        eveningSnack: 'Evening Snack'
    },
    STORAGE_KEYS: {
        SUPABASE_URL: 'supabase_url',
        SUPABASE_ANON_KEY: 'supabase_anon_key',
        FOOD_ITEMS: 'food_items',
        WEEKLY_MENU: 'weekly_menu',
        MEAL_HISTORY: 'meal_history',
        LAST_SYNC: 'last_sync'
    },
    MENU_ROTATION_DAYS: 7, // Avoid repeats within 7 days
    WORK_DAYS: 5, // Monday to Friday
    VERSION: '1.0.0'
};

// Helper Functions
const Utils = {
    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },
    
    formatDateShort(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },
    
    getDateString(date) {
        return date.toISOString().split('T')[0];
    },
    
    parseDate(dateString) {
        return new Date(dateString + 'T00:00:00');
    },
    
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    },
    
    getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    },
    
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    isSameDay(date1, date2) {
        return this.getDateString(date1) === this.getDateString(date2);
    },
    
    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
