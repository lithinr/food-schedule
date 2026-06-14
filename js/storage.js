// Data Storage and Sync Management
const Storage = {
    async init() {
        // Initialize GitHub API
        GitHubAPI.init();
        
        // Load data from localStorage first (offline support)
        this.loadLocalData();
        
        // Try to sync with GitHub if configured
        if (GitHubAPI.isConfigured()) {
            await this.syncFromGitHub();
        }
    },
    
    loadLocalData() {
        // Load cached data from localStorage
        const foodItems = localStorage.getItem(CONFIG.STORAGE_KEYS.FOOD_ITEMS);
        const weeklyMenu = localStorage.getItem(CONFIG.STORAGE_KEYS.WEEKLY_MENU);
        const mealHistory = localStorage.getItem(CONFIG.STORAGE_KEYS.MEAL_HISTORY);
        
        window.foodItems = foodItems ? JSON.parse(foodItems) : this.getDefaultFoodItems();
        window.weeklyMenu = weeklyMenu ? JSON.parse(weeklyMenu) : this.getDefaultWeeklyMenu();
        window.mealHistory = mealHistory ? JSON.parse(mealHistory) : [];
    },
    
    async syncFromGitHub() {
        try {
            // Read food items
            const foodData = await GitHubAPI.readFile(CONFIG.DATA_FILES.FOOD_ITEMS);
            if (foodData) {
                window.foodItems = foodData.content;
                this.saveFoodItems(window.foodItems);
            } else {
                // Create initial file if it doesn't exist
                await this.pushToGitHub();
            }
            
            // Read weekly menu
            const menuData = await GitHubAPI.readFile(CONFIG.DATA_FILES.WEEKLY_MENU);
            if (menuData) {
                window.weeklyMenu = menuData.content;
                this.saveWeeklyMenu(window.weeklyMenu);
            }
            
            // Read meal history
            const historyData = await GitHubAPI.readFile(CONFIG.DATA_FILES.MEAL_HISTORY);
            if (historyData) {
                window.mealHistory = historyData.content;
                this.saveMealHistory(window.mealHistory);
            }
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
            Utils.showToast('Synced with GitHub', 'success');
        } catch (error) {
            console.error('Error syncing from GitHub:', error);
            Utils.showToast('Sync failed, using local data', 'error');
        }
    },
    
    async pushToGitHub() {
        if (!GitHubAPI.isConfigured()) {
            return false;
        }
        
        try {
            // Push all data files
            await GitHubAPI.writeFile(CONFIG.DATA_FILES.FOOD_ITEMS, window.foodItems);
            await GitHubAPI.writeFile(CONFIG.DATA_FILES.WEEKLY_MENU, window.weeklyMenu);
            await GitHubAPI.writeFile(CONFIG.DATA_FILES.MEAL_HISTORY, window.mealHistory);
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
            return true;
        } catch (error) {
            console.error('Error pushing to GitHub:', error);
            return false;
        }
    },
    
    saveFoodItems(items) {
        window.foodItems = items;
        localStorage.setItem(CONFIG.STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
    },
    
    saveWeeklyMenu(menu) {
        window.weeklyMenu = menu;
        localStorage.setItem(CONFIG.STORAGE_KEYS.WEEKLY_MENU, JSON.stringify(menu));
    },
    
    saveMealHistory(history) {
        window.mealHistory = history;
        localStorage.setItem(CONFIG.STORAGE_KEYS.MEAL_HISTORY, JSON.stringify(history));
    },
    
    getDefaultFoodItems() {
        return {
            breakfast: [
                { id: 'b1', name: 'Idli', ingredients: ['Rice', 'Urad dal', 'Salt'] },
                { id: 'b2', name: 'Dosa', ingredients: ['Rice', 'Urad dal', 'Salt', 'Oil'] },
                { id: 'b3', name: 'Upma', ingredients: ['Semolina', 'Vegetables', 'Oil', 'Mustard seeds'] }
            ],
            lunch: [
                { id: 'l1', name: 'Rice with Dal', ingredients: ['Rice', 'Toor dal', 'Tomatoes', 'Spices'] },
                { id: 'l2', name: 'Chapati with Curry', ingredients: ['Wheat flour', 'Vegetables', 'Spices', 'Oil'] }
            ],
            morningSnack: [
                { id: 'ms1', name: 'Fruits', ingredients: ['Banana', 'Apple', 'Orange'] },
                { id: 'ms2', name: 'Biscuits', ingredients: ['Biscuits', 'Milk'] }
            ],
            eveningSnack: [
                { id: 'es1', name: 'Pakoda', ingredients: ['Gram flour', 'Onion', 'Oil', 'Spices'] },
                { id: 'es2', name: 'Sandwich', ingredients: ['Bread', 'Vegetables', 'Butter', 'Cheese'] }
            ]
        };
    },
    
    getDefaultWeeklyMenu() {
        return {
            weekStarting: Utils.getDateString(Utils.getWeekStart(new Date())),
            days: []
        };
    }
};
