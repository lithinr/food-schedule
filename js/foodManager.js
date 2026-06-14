// Food Items Management
const FoodManager = {
    init() {
        this.setupEventListeners();
        this.render();
    },
    
    setupEventListeners() {
        const addBtn = document.getElementById('add-food-btn');
        const cancelBtn = document.getElementById('cancel-food-btn');
        const form = document.getElementById('food-item-form');
        
        addBtn.addEventListener('click', () => this.showForm());
        cancelBtn.addEventListener('click', () => this.hideForm());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    showForm(foodItem = null) {
        const form = document.getElementById('food-form');
        const formTitle = document.getElementById('form-title');
        
        if (foodItem) {
            formTitle.textContent = 'Edit Food Item';
            document.getElementById('food-id').value = foodItem.id;
            document.getElementById('food-name').value = foodItem.name;
            document.getElementById('food-category').value = foodItem.category;
            document.getElementById('food-ingredients').value = foodItem.ingredients.join('\n');
        } else {
            formTitle.textContent = 'Add Food Item';
            document.getElementById('food-item-form').reset();
            document.getElementById('food-id').value = '';
        }
        
        form.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    hideForm() {
        document.getElementById('food-form').classList.add('hidden');
        document.getElementById('food-item-form').reset();
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const id = document.getElementById('food-id').value;
        const name = document.getElementById('food-name').value.trim();
        const category = document.getElementById('food-category').value;
        const ingredientsText = document.getElementById('food-ingredients').value;
        const ingredients = ingredientsText
            .split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);
        
        const foodItem = {
            id: id || Utils.generateId(),
            name,
            ingredients
        };
        
        if (id) {
            // Update existing item
            this.updateFoodItem(category, foodItem);
        } else {
            // Add new item
            this.addFoodItem(category, foodItem);
        }
        
        this.hideForm();
        this.render();
        Utils.showToast('Food item saved (tap sync to upload)', 'success');
    },
    
    addFoodItem(category, item) {
        if (!window.foodItems[category]) {
            window.foodItems[category] = [];
        }
        window.foodItems[category].push(item);
        Storage.saveFoodItems(window.foodItems);
    },
    
    updateFoodItem(category, updatedItem) {
        // Remove from old category if moved
        for (const cat in window.foodItems) {
            const index = window.foodItems[cat].findIndex(item => item.id === updatedItem.id);
            if (index >= 0) {
                window.foodItems[cat].splice(index, 1);
                break;
            }
        }
        
        // Add to new category
        if (!window.foodItems[category]) {
            window.foodItems[category] = [];
        }
        window.foodItems[category].push(updatedItem);
        Storage.saveFoodItems(window.foodItems);
    },
    
    deleteFoodItem(category, itemId) {
        if (confirm('Are you sure you want to delete this food item?')) {
            const index = window.foodItems[category].findIndex(item => item.id === itemId);
            if (index >= 0) {
                window.foodItems[category].splice(index, 1);
                Storage.saveFoodItems(window.foodItems);
                this.render();
                Utils.showToast('Food item deleted (tap sync to upload)', 'success');
            }
        }
    },
    
    render() {
        for (const category in CONFIG.CATEGORIES) {
            const container = document.getElementById(`${category}-items`);
            const items = window.foodItems[category] || [];
            
            if (items.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🍽️</div>
                        <div class="empty-state-message">No items yet</div>
                    </div>
                `;
                continue;
            }
            
            container.innerHTML = items.map(item => `
                <div class="food-item-card">
                    <div class="food-item-name">${item.name}</div>
                    <div class="food-item-ingredients">
                        ${item.ingredients.slice(0, 3).join(', ')}
                        ${item.ingredients.length > 3 ? '...' : ''}
                    </div>
                    <div class="food-item-actions">
                        <button class="btn-edit" onclick="FoodManager.editItem('${category}', '${item.id}')">
                            Edit
                        </button>
                        <button class="btn-delete" onclick="FoodManager.deleteFoodItem('${category}', '${item.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }
    },
    
    editItem(category, itemId) {
        const item = window.foodItems[category].find(i => i.id === itemId);
        if (item) {
            this.showForm({ ...item, category });
        }
    }
};
