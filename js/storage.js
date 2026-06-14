// Data Storage and Sync Management
const Storage = {
    async init() {
        // Initialize Supabase API
        SupabaseAPI.init();
        
        // Load data from localStorage first (offline support)
        this.loadLocalData();
        
        // Try to sync with Supabase if configured
        if (SupabaseAPI.isConfigured()) {
            await this.syncFromSupabase(false);
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
    
    async syncFromSupabase(showToast = true) {
        try {
            const state = await SupabaseAPI.readState();

            // If row doesn't exist yet, create it from local state
            if (!state) {
                await this.pushToSupabase(false);
            } else {
                window.foodItems = state.food_items || this.getDefaultFoodItems();
                window.weeklyMenu = state.weekly_menu || this.getDefaultWeeklyMenu();
                window.mealHistory = state.meal_history || [];

                this.saveFoodItems(window.foodItems);
                this.saveWeeklyMenu(window.weeklyMenu);
                this.saveMealHistory(window.mealHistory);
            }
            
            const now = new Date().toISOString();
            localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, now);
            
            if (showToast) {
                Utils.showToast('✓ Synced with cloud', 'success');
            }
            
            return { success: true, timestamp: now };
        } catch (error) {
            console.error('Error syncing from Supabase:', error);
            if (showToast) {
                Utils.showToast('✗ Sync failed: ' + error.message, 'error');
            }
            return { success: false, error: error.message };
        }
    },
    
    async pushToSupabase(showToast = true) {
        if (!SupabaseAPI.isConfigured()) {
            return { success: false, error: 'Supabase not configured' };
        }
        
        try {
            await SupabaseAPI.writeState({
                food_items: window.foodItems,
                weekly_menu: window.weeklyMenu,
                meal_history: window.mealHistory
            });
            
            const now = new Date().toISOString();
            localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, now);
            
            if (showToast) {
                Utils.showToast('✓ Pushed to cloud', 'success');
            }
            
            return { success: true, timestamp: now };
        } catch (error) {
            console.error('Error pushing to Supabase:', error);
            if (showToast) {
                Utils.showToast('✗ Push failed: ' + error.message, 'error');
            }
            return { success: false, error: error.message };
        }
    },
    
    async fullSync(showToast = true) {
        if (!SupabaseAPI.isConfigured()) {
            if (showToast) {
                Utils.showToast('Configure Supabase sync in Settings first', 'error');
            }
            return { success: false, error: 'Not configured' };
        }
        
        try {
            // Strategy: Pull first, merge intelligently, then push
            // This minimizes conflicts and prevents data loss
            
            // 1. Save current local state
            const localFoodItems = JSON.parse(JSON.stringify(window.foodItems));
            const localWeeklyMenu = JSON.parse(JSON.stringify(window.weeklyMenu));
            const localMealHistory = JSON.parse(JSON.stringify(window.mealHistory));
            
            // 2. Pull latest from Supabase
            const pullResult = await this.syncFromSupabase(false);
            
            // 3. Merge local changes with remote
            if (pullResult.success) {
                // Merge food items (combine both, remove duplicates by ID)
                window.foodItems = this.mergeFoodItems(localFoodItems, window.foodItems);
                
                // Merge meal history (combine both, keep unique entries)
                window.mealHistory = this.mergeMealHistory(localMealHistory, window.mealHistory);
                
                // Weekly menu: local takes precedence if same week
                if (localWeeklyMenu.weekStarting === window.weeklyMenu.weekStarting) {
                    // Merge days - local overrides remote for same dates
                    window.weeklyMenu = this.mergeWeeklyMenu(localWeeklyMenu, window.weeklyMenu);
                } else {
                    // Different week, keep local
                    window.weeklyMenu = localWeeklyMenu;
                }
                
                // Save merged data locally
                this.saveFoodItems(window.foodItems);
                this.saveWeeklyMenu(window.weeklyMenu);
                this.saveMealHistory(window.mealHistory);
            }
            
            // 4. Push merged data to Supabase
            const pushResult = await this.pushToSupabase(false);
            
            if (pullResult.success && pushResult.success) {
                if (showToast) {
                    Utils.showToast('✓ Sync complete', 'success');
                }
                return { success: true, timestamp: pushResult.timestamp };
            } else {
                throw new Error(pullResult.error || pushResult.error);
            }
        } catch (error) {
            console.error('Error in full sync:', error);
            if (showToast) {
                Utils.showToast('✗ Sync error: ' + error.message, 'error');
            }
            return { success: false, error: error.message };
        }
    },
    
    getLastSyncTime() {
        const lastSync = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_SYNC);
        if (!lastSync) return null;
        return new Date(lastSync);
    },
    
    getLastSyncDisplay() {
        const lastSync = this.getLastSyncTime();
        if (!lastSync) return 'Never synced';
        
        const now = new Date();
        const diffMs = now - lastSync;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
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
    },
    
    // Merge strategies to prevent data loss during conflicts
    mergeFoodItems(localItems, remoteItems) {
        const merged = {};
        
        // For each category
        for (const category in CONFIG.CATEGORIES) {
            const local = localItems[category] || [];
            const remote = remoteItems[category] || [];
            
            // Create a map by ID
            const itemsById = {};
            
            // Add remote items first
            remote.forEach(item => {
                itemsById[item.id] = item;
            });
            
            // Add/overwrite with local items (local takes precedence)
            local.forEach(item => {
                itemsById[item.id] = item;
            });
            
            // Convert back to array
            merged[category] = Object.values(itemsById);
        }
        
        return merged;
    },
    
    mergeMealHistory(localHistory, remoteHistory) {
        // Combine both arrays
        const combined = [...remoteHistory, ...localHistory];
        
        // Remove duplicates by date+category key
        const uniqueMap = {};
        combined.forEach(entry => {
            const key = `${entry.date}-${entry.category}`;
            // Keep the one with most recent timestamp
            if (!uniqueMap[key] || 
                (entry.timestamp && uniqueMap[key].timestamp && 
                 entry.timestamp > uniqueMap[key].timestamp)) {
                uniqueMap[key] = entry;
            }
        });
        
        return Object.values(uniqueMap);
    },
    
    mergeWeeklyMenu(localMenu, remoteMenu) {
        // Local menu takes precedence for same week
        const merged = {
            weekStarting: localMenu.weekStarting,
            days: []
        };
        
        // Create map of local days
        const localDaysMap = {};
        localMenu.days.forEach(day => {
            localDaysMap[day.date] = day;
        });
        
        // Create map of remote days
        const remoteDaysMap = {};
        remoteMenu.days.forEach(day => {
            remoteDaysMap[day.date] = day;
        });
        
        // Merge: local days take precedence
        const allDates = new Set([
            ...Object.keys(localDaysMap),
            ...Object.keys(remoteDaysMap)
        ]);
        
        allDates.forEach(date => {
            // Prefer local, fallback to remote
            merged.days.push(localDaysMap[date] || remoteDaysMap[date]);
        });
        
        // Sort by date
        merged.days.sort((a, b) => a.date.localeCompare(b.date));
        
        return merged;
    }
};
