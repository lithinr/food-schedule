// Daily Menu View
const DailyMenu = {
    currentDate: new Date(),
    
    init() {
        this.setupEventListeners();
        this.render();
    },
    
    setupEventListeners() {
        const regenerateBtn = document.getElementById('regenerate-btn');
        regenerateBtn.addEventListener('click', () => this.regenerateMenu());
    },
    
    render() {
        const dateString = Utils.getDateString(this.currentDate);
        
        // Update date display
        document.querySelector('.date-display').textContent = Utils.formatDate(this.currentDate);
        
        // Get today's menu from weekly menu
        let todayMenu = this.getTodayMenu(dateString);
        
        // Only generate if doesn't exist and current week menu is loaded
        const currentMonday = Utils.getMonday(new Date());
        const currentMondayString = Utils.getDateString(currentMonday);
        
        if (!todayMenu || window.weeklyMenu.weekStarting !== currentMondayString) {
            // Ensure weekly menu exists for current week
            if (window.weeklyMenu.weekStarting !== currentMondayString) {
                window.weeklyMenu = MenuAlgorithm.generateWeeklyMenu(currentMonday, CONFIG.WORK_DAYS);
                Storage.saveWeeklyMenu(window.weeklyMenu);
            }
            
            todayMenu = this.getTodayMenu(dateString);
            
            // If still no menu (weekend), generate one just for today
            if (!todayMenu) {
                todayMenu = MenuAlgorithm.generateDailyMenu(this.currentDate);
                this.saveTodayMenu(dateString, todayMenu);
            }
        }
        
        // Render menu
        const container = document.getElementById('daily-menu');
        container.innerHTML = '';
        
        for (const category in CONFIG.CATEGORIES) {
            const meal = todayMenu[category];
            
            if (!meal) {
                container.innerHTML += this.renderEmptyMeal(category);
                continue;
            }
            
            container.innerHTML += this.renderMealCard(meal);
        }
        
        // Attach event listeners to checkboxes
        this.attachCheckboxListeners();
    },
    
    getTodayMenu(dateString) {
        const day = window.weeklyMenu.days.find(d => d.date === dateString);
        return day ? day.meals : null;
    },
    
    saveTodayMenu(dateString, menu) {
        // Find or create day in weekly menu
        let day = window.weeklyMenu.days.find(d => d.date === dateString);
        
        if (day) {
            day.meals = menu;
        } else {
            window.weeklyMenu.days.push({
                date: dateString,
                meals: menu
            });
        }
        
        Storage.saveWeeklyMenu(window.weeklyMenu);
    },
    
    renderMealCard(meal) {
        const isPrepared = meal.prepared ? 'prepared' : '';
        const isChecked = meal.prepared ? 'checked' : '';
        
        return `
            <div class="meal-card ${isPrepared}">
                <div class="meal-header">
                    <div class="meal-category">${CONFIG.CATEGORIES[meal.category]}</div>
                </div>
                <div class="meal-name">${meal.name}</div>
                <div class="ingredients">
                    <div class="ingredients-label">Ingredients:</div>
                    ${meal.ingredients.map(ing => `<div class="ingredient-item">${ing}</div>`).join('')}
                </div>
                <label class="prepared-checkbox">
                    <input type="checkbox" 
                           data-category="${meal.category}" 
                           ${isChecked}>
                    <span>Mark as prepared</span>
                </label>
            </div>
        `;
    },
    
    renderEmptyMeal(category) {
        return `
            <div class="meal-card">
                <div class="meal-header">
                    <div class="meal-category">${CONFIG.CATEGORIES[category]}</div>
                </div>
                <div class="empty-state">
                    <div class="empty-state-message">No ${CONFIG.CATEGORIES[category].toLowerCase()} items available</div>
                </div>
            </div>
        `;
    },
    
    attachCheckboxListeners() {
        const checkboxes = document.querySelectorAll('#daily-menu input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = e.target.dataset.category;
                const prepared = e.target.checked;
                this.markAsPrepared(category, prepared);
            });
        });
    },
    
    markAsPrepared(category, prepared) {
        MenuAlgorithm.markMealAsPrepared(this.currentDate, category, prepared);
        this.render();
        Utils.showToast(prepared ? 'Marked as prepared' : 'Unmarked', 'success');
        
        // Update weekly view if visible
        if (document.getElementById('weekly-view').classList.contains('active')) {
            WeeklyMenu.render();
        }
    },
    
    regenerateMenu() {
        if (confirm('This will generate a new menu for today. Continue?')) {
            const dateString = Utils.getDateString(this.currentDate);
            const newMenu = MenuAlgorithm.generateDailyMenu(this.currentDate);
            this.saveTodayMenu(dateString, newMenu);
            this.render();
            Utils.showToast('Menu regenerated', 'success');
        }
    }
};
