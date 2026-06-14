// Weekly Menu View
const WeeklyMenu = {
    currentWeekStart: null,
    editMode: false,
    
    init() {
        this.currentWeekStart = Utils.getMonday(new Date());
        this.setupEventListeners();
        this.ensureWeeklyMenuExists();
        this.render();
    },
    
    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => this.previousWeek());
        document.getElementById('next-week').addEventListener('click', () => this.nextWeek());
        document.getElementById('edit-week-btn').addEventListener('click', () => this.toggleEditMode());
        document.getElementById('save-week-btn').addEventListener('click', () => this.saveWeeklyMenu());
    },
    
    ensureWeeklyMenuExists() {
        const weekString = Utils.getDateString(this.currentWeekStart);
        
        // Check if we have a menu for this week
        if (window.weeklyMenu.weekStarting !== weekString) {
            // Generate new weekly menu for Monday-Friday only
            window.weeklyMenu = MenuAlgorithm.generateWeeklyMenu(this.currentWeekStart, CONFIG.WORK_DAYS);
            Storage.saveWeeklyMenu(window.weeklyMenu);
        }
    },
    
    render() {
        this.updateWeekDisplay();
        
        const container = document.getElementById('weekly-menu');
        const editBtn = document.getElementById('edit-week-btn');
        const saveBtn = document.getElementById('save-week-btn');
        
        // Toggle button visibility
        if (this.editMode) {
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        } else {
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
        }
        
        container.innerHTML = '';
        
        // Render Monday to Friday only (5 days)
        for (let i = 0; i < CONFIG.WORK_DAYS; i++) {
            const date = Utils.addDays(this.currentWeekStart, i);
            const dateString = Utils.getDateString(date);
            
            const day = window.weeklyMenu.days.find(d => d.date === dateString);
            const meals = day ? day.meals : {};
            
            if (this.editMode) {
                container.innerHTML += this.renderDayCardEdit(date, meals);
            } else {
                container.innerHTML += this.renderDayCard(date, meals);
            }
        }
        
        // Attach change listeners if in edit mode
        if (this.editMode) {
            this.attachMealChangeListeners();
        }
    },
    
    updateWeekDisplay() {
        // Show Monday to Friday range
        const weekEnd = Utils.addDays(this.currentWeekStart, CONFIG.WORK_DAYS - 1);
        const weekRangeText = `${Utils.formatDateShort(this.currentWeekStart)} - ${Utils.formatDateShort(weekEnd)}`;
        document.getElementById('week-range').textContent = weekRangeText;
    },
    
    renderDayCard(date, meals) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = Utils.formatDateShort(date);
        const isToday = Utils.isSameDay(date, new Date());
        const todayClass = isToday ? 'style="border-left: 4px solid var(--primary-color);"' : '';
        
        let mealsHtml = '';
        for (const category in CONFIG.CATEGORIES) {
            const meal = meals[category];
            if (meal) {
                const preparedIcon = meal.prepared ? '✓' : '';
                mealsHtml += `
                    <div class="day-meal-item">
                        <span class="meal-category-badge">${CONFIG.CATEGORIES[category]}</span>
                        <span class="meal-name-small">${meal.name}</span>
                        <span>${preparedIcon}</span>
                    </div>
                `;
            }
        }
        
        if (!mealsHtml) {
            mealsHtml = '<div class="empty-state-message">No meals planned</div>';
        }
        
        return `
            <div class="day-card" ${todayClass}>
                <div class="day-header">
                    ${dayName}
                    <span class="day-date">${dateStr}</span>
                </div>
                <div class="day-meals">
                    ${mealsHtml}
                </div>
            </div>
        `;
    },
    
    previousWeek() {
        this.currentWeekStart = Utils.addDays(this.currentWeekStart, -7);
        this.editMode = false;
        this.ensureWeeklyMenuExists();
        this.render();
    },
    
    nextWeek() {
        this.currentWeekStart = Utils.addDays(this.currentWeekStart, 7);
        this.editMode = false;
        this.ensureWeeklyMenuExists();
        this.render();
    },
    
    toggleEditMode() {
        this.editMode = !this.editMode;
        this.render();
    },
    
    renderDayCardEdit(date, meals) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = Utils.formatDateShort(date);
        const dateString = Utils.getDateString(date);
        
        let mealsHtml = '';
        for (const category in CONFIG.CATEGORIES) {
            const meal = meals[category];
            const selectedId = meal ? meal.id : '';
            
            // Get all food items for this category
            const categoryItems = window.foodItems[category] || [];
            const options = categoryItems.map(item => 
                `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${item.name}</option>`
            ).join('');
            
            mealsHtml += `
                <div class="day-meal-edit">
                    <label class="meal-category-label">${CONFIG.CATEGORIES[category]}</label>
                    <select class="meal-select" data-date="${dateString}" data-category="${category}">
                        <option value="">-- Select --</option>
                        ${options}
                    </select>
                </div>
            `;
        }
        
        return `
            <div class="day-card-edit">
                <div class="day-header">
                    ${dayName}
                    <span class="day-date">${dateStr}</span>
                </div>
                <div class="day-meals-edit">
                    ${mealsHtml}
                </div>
            </div>
        `;
    },
    
    attachMealChangeListeners() {
        const selects = document.querySelectorAll('.meal-select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                const dateString = e.target.dataset.date;
                const category = e.target.dataset.category;
                const foodId = e.target.value;
                
                this.updateMealSelection(dateString, category, foodId);
            });
        });
    },
    
    updateMealSelection(dateString, category, foodId) {
        // Find or create the day in weekly menu
        let day = window.weeklyMenu.days.find(d => d.date === dateString);
        
        if (!day) {
            day = {
                date: dateString,
                meals: {}
            };
            window.weeklyMenu.days.push(day);
        }
        
        if (foodId) {
            // Find the selected food item
            const foodItem = window.foodItems[category].find(item => item.id === foodId);
            
            if (foodItem) {
                day.meals[category] = {
                    ...foodItem,
                    category,
                    date: dateString,
                    prepared: false
                };
            }
        } else {
            // Remove meal if unselected
            delete day.meals[category];
        }
        
        // Save to localStorage immediately
        Storage.saveWeeklyMenu(window.weeklyMenu);
    },
    
    saveWeeklyMenu() {
        this.editMode = false;
        this.render();
        
        // Sync to GitHub
        Utils.showToast('Saving weekly menu...', 'info');
        Storage.pushToGitHub(true).then(result => {
            if (result.success) {
                Utils.showToast('✓ Weekly menu saved and synced', 'success');
                // Refresh daily menu if today is visible
                if (document.getElementById('daily-view').classList.contains('active')) {
                    DailyMenu.render();
                }
            } else {
                Utils.showToast('Saved locally (tap sync to upload)', 'success');
            }
        });
    }
};
