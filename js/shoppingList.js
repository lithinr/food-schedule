// Shopping List Generator
const ShoppingList = {
    init() {
        this.setupEventListeners();
        this.render();
    },
    
    setupEventListeners() {
        document.getElementById('refresh-shopping-btn').addEventListener('click', () => this.render());
    },
    
    render() {
        const container = document.getElementById('shopping-list');
        const ingredients = this.aggregateIngredients();
        
        if (ingredients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <div class="empty-state-message">No meals planned for this week</div>
                </div>
            `;
            return;
        }
        
        // Group by category
        const grouped = this.groupByCategory(ingredients);
        
        let html = '<div class="shopping-list-header"><h2>This Week\'s Shopping List</h2></div>';
        
        for (const category in grouped) {
            html += `
                <div class="shopping-category">
                    <h3>${CONFIG.CATEGORIES[category]}</h3>
                    <div class="shopping-items">
                        ${grouped[category].map((item, index) => this.renderShoppingItem(item, category, index)).join('')}
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        this.attachCheckboxListeners();
    },
    
    aggregateIngredients() {
        const ingredients = [];
        const currentWeekStart = Utils.getWeekStart(new Date());
        const currentWeekString = Utils.getDateString(currentWeekStart);
        
        // Only get ingredients for current week
        if (window.weeklyMenu.weekStarting === currentWeekString) {
            window.weeklyMenu.days.forEach(day => {
                for (const category in day.meals) {
                    const meal = day.meals[category];
                    if (meal && meal.ingredients) {
                        meal.ingredients.forEach(ingredient => {
                            ingredients.push({
                                name: ingredient,
                                category: category,
                                mealName: meal.name,
                                date: day.date
                            });
                        });
                    }
                }
            });
        }
        
        return ingredients;
    },
    
    groupByCategory(ingredients) {
        const grouped = {};
        
        ingredients.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            
            // Check if ingredient already exists
            const existing = grouped[item.category].find(i => 
                i.name.toLowerCase() === item.name.toLowerCase()
            );
            
            if (existing) {
                existing.count++;
                existing.meals.push(item.mealName);
            } else {
                grouped[item.category].push({
                    name: item.name,
                    count: 1,
                    meals: [item.mealName]
                });
            }
        });
        
        return grouped;
    },
    
    renderShoppingItem(item, category, index) {
        const id = `shopping-${category}-${index}`;
        const countText = item.count > 1 ? ` (${item.count}x)` : '';
        const mealsText = item.meals.length > 1 ? ` - for ${item.meals.join(', ')}` : '';
        
        return `
            <div class="shopping-item" id="${id}">
                <input type="checkbox" id="${id}-check" onchange="ShoppingList.toggleItem('${id}')">
                <label for="${id}-check">
                    ${item.name}${countText}
                    <span style="font-size: 12px; color: var(--text-secondary);">${mealsText}</span>
                </label>
            </div>
        `;
    },
    
    attachCheckboxListeners() {
        // Checkboxes are handled by inline onchange
    },
    
    toggleItem(itemId) {
        const item = document.getElementById(itemId);
        const checkbox = document.getElementById(`${itemId}-check`);
        
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    }
};
