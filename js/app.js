// Main Application
const App = {
    async init() {
        // Initialize storage and load data
        await Storage.init();
        
        // Initialize all views
        FoodManager.init();
        DailyMenu.init();
        WeeklyMenu.init();
        ShoppingList.init();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup settings
        this.setupSettings();
        
        // Show daily view by default
        this.showView('daily');
        
        // Check if GitHub is configured
        if (!GitHubAPI.isConfigured()) {
            setTimeout(() => {
                if (confirm('GitHub sync is not configured. Would you like to set it up now?')) {
                    this.openSettings();
                }
            }, 1000);
        }
    },
    
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.showView(view);
                
                // Update active state
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show selected view
        const selectedView = document.getElementById(`${viewName}-view`);
        if (selectedView) {
            selectedView.classList.add('active');
            
            // Refresh view if needed
            switch(viewName) {
                case 'daily':
                    DailyMenu.render();
                    break;
                case 'weekly':
                    WeeklyMenu.render();
                    break;
                case 'shopping':
                    ShoppingList.render();
                    break;
                case 'food-items':
                    FoodManager.render();
                    break;
            }
        }
    },
    
    setupSettings() {
        const openBtn = document.getElementById('open-settings-btn');
        const closeBtn = document.getElementById('close-settings-btn');
        const saveBtn = document.getElementById('save-settings-btn');
        const overlay = document.getElementById('settings-overlay');
        
        openBtn.addEventListener('click', () => this.openSettings());
        closeBtn.addEventListener('click', () => this.closeSettings());
        saveBtn.addEventListener('click', () => this.saveSettings());
        
        // Close overlay when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeSettings();
            }
        });
    },
    
    openSettings() {
        const overlay = document.getElementById('settings-overlay');
        
        // Load current settings
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN) || '';
        const repo = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_REPO) || '';
        
        document.getElementById('github-token').value = token;
        document.getElementById('github-repo').value = repo;
        
        overlay.classList.remove('hidden');
    },
    
    closeSettings() {
        document.getElementById('settings-overlay').classList.add('hidden');
    },
    
    async saveSettings() {
        const token = document.getElementById('github-token').value.trim();
        const repo = document.getElementById('github-repo').value.trim();
        
        if (!token || !repo) {
            Utils.showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Validate repo format (username/repo)
        if (!repo.includes('/')) {
            Utils.showToast('Repository format should be: username/repo-name', 'error');
            return;
        }
        
        // Configure GitHub API
        GitHubAPI.configure(token, repo);
        
        // Try to sync
        try {
            Utils.showToast('Testing connection...', 'info');
            await Storage.syncFromGitHub();
            
            this.closeSettings();
            Utils.showToast('GitHub sync configured successfully!', 'success');
            
            // Refresh all views
            DailyMenu.render();
            WeeklyMenu.render();
            ShoppingList.render();
            FoodManager.render();
        } catch (error) {
            Utils.showToast('Failed to connect to GitHub. Check your settings.', 'error');
            console.error('GitHub sync error:', error);
        }
    }
};

// Add toast animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
