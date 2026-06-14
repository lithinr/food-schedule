// Smart Meal Rotation Algorithm
const MenuAlgorithm = {
    generateDailyMenu(date = new Date()) {
        const dateString = Utils.getDateString(date);
        const menu = {};
        
        // Get recent meal history for this date range
        const recentHistory = this.getRecentHistory(date, CONFIG.MENU_ROTATION_DAYS);
        
        // Generate menu for each category
        for (const category in CONFIG.CATEGORIES) {
            const availableItems = window.foodItems[category] || [];
            
            if (availableItems.length === 0) {
                menu[category] = null;
                continue;
            }
            
            // Filter out recently used items
            const recentItems = recentHistory
                .filter(h => h.category === category)
                .map(h => h.foodId);
            
            let candidateItems = availableItems.filter(item => !recentItems.includes(item.id));
            
            // If all items were recently used, use all items
            if (candidateItems.length === 0) {
                candidateItems = availableItems;
            }
            
            // Select random item from candidates
            const selectedItem = candidateItems[Math.floor(Math.random() * candidateItems.length)];
            
            menu[category] = {
                ...selectedItem,
                category,
                date: dateString,
                prepared: false
            };
        }
        
        return menu;
    },
    
    generateWeeklyMenu(startDate = null) {
        if (!startDate) {
            startDate = Utils.getWeekStart(new Date());
        }
        
        const weeklyMenu = {
            weekStarting: Utils.getDateString(startDate),
            days: []
        };
        
        // Generate menu for each day of the week
        for (let i = 0; i < 7; i++) {
            const date = Utils.addDays(startDate, i);
            const dailyMenu = this.generateDailyMenu(date);
            
            weeklyMenu.days.push({
                date: Utils.getDateString(date),
                meals: dailyMenu
            });
            
            // Add to temporary history to avoid repeats within the week
            this.addToTempHistory(dailyMenu);
        }
        
        // Clear temporary history
        this.clearTempHistory();
        
        return weeklyMenu;
    },
    
    getRecentHistory(fromDate, days) {
        const cutoffDate = Utils.addDays(fromDate, -days);
        const cutoffString = Utils.getDateString(cutoffDate);
        
        return window.mealHistory.filter(h => h.date >= cutoffString);
    },
    
    tempHistory: [],
    
    addToTempHistory(dailyMenu) {
        for (const category in dailyMenu) {
            const meal = dailyMenu[category];
            if (meal) {
                this.tempHistory.push({
                    date: meal.date,
                    category: meal.category,
                    foodId: meal.id
                });
            }
        }
    },
    
    clearTempHistory() {
        this.tempHistory = [];
    },
    
    getRecentHistory(fromDate, days) {
        const cutoffDate = Utils.addDays(fromDate, -days);
        const cutoffString = Utils.getDateString(cutoffDate);
        
        // Combine actual history with temp history
        const allHistory = [...window.mealHistory, ...this.tempHistory];
        return allHistory.filter(h => h.date >= cutoffString);
    },
    
    markMealAsPrepared(date, category, prepared) {
        const dateString = Utils.getDateString(date);
        
        // Find the meal in weekly menu
        const day = window.weeklyMenu.days.find(d => d.date === dateString);
        if (!day || !day.meals[category]) {
            return;
        }
        
        // Update prepared status
        day.meals[category].prepared = prepared;
        
        // Update history
        const historyIndex = window.mealHistory.findIndex(
            h => h.date === dateString && h.category === category
        );
        
        if (prepared) {
            const meal = day.meals[category];
            const historyEntry = {
                date: dateString,
                category,
                foodId: meal.id,
                foodName: meal.name,
                prepared: true,
                timestamp: new Date().toISOString()
            };
            
            if (historyIndex >= 0) {
                window.mealHistory[historyIndex] = historyEntry;
            } else {
                window.mealHistory.push(historyEntry);
            }
        } else {
            // Remove from history if unchecked
            if (historyIndex >= 0) {
                window.mealHistory.splice(historyIndex, 1);
            }
        }
        
        // Save changes
        Storage.saveWeeklyMenu(window.weeklyMenu);
        Storage.saveMealHistory(window.mealHistory);
    }
};
