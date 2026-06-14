// Weekly Menu View
const WeeklyMenu = {
    currentWeekStart: null,
    
    init() {
        this.currentWeekStart = Utils.getWeekStart(new Date());
        this.setupEventListeners();
        this.ensureWeeklyMenuExists();
        this.render();
    },
    
    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => this.previousWeek());
        document.getElementById('next-week').addEventListener('click', () => this.nextWeek());
    },
    
    ensureWeeklyMenuExists() {
        const weekString = Utils.getDateString(this.currentWeekStart);
        
        // Check if we have a menu for this week
        if (window.weeklyMenu.weekStarting !== weekString) {
            // Generate new weekly menu
            window.weeklyMenu = MenuAlgorithm.generateWeeklyMenu(this.currentWeekStart);
            Storage.saveWeeklyMenu(window.weeklyMenu);
            Storage.pushToGitHub();
        }
    },
    
    render() {
        this.updateWeekDisplay();
        
        const container = document.getElementById('weekly-menu');
        container.innerHTML = '';
        
        // Render each day
        for (let i = 0; i < 7; i++) {
            const date = Utils.addDays(this.currentWeekStart, i);
            const dateString = Utils.getDateString(date);
            
            const day = window.weeklyMenu.days.find(d => d.date === dateString);
            const meals = day ? day.meals : {};
            
            container.innerHTML += this.renderDayCard(date, meals);
        }
    },
    
    updateWeekDisplay() {
        const weekEnd = Utils.addDays(this.currentWeekStart, 6);
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
        this.ensureWeeklyMenuExists();
        this.render();
    },
    
    nextWeek() {
        this.currentWeekStart = Utils.addDays(this.currentWeekStart, 7);
        this.ensureWeeklyMenuExists();
        this.render();
    }
};
