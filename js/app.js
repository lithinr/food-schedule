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
        const syncBtn = document.getElementById('sync-btn');
        
        openBtn.addEventListener('click', () => this.openSettings());
        closeBtn.addEventListener('click', () => this.closeSettings());
        saveBtn.addEventListener('click', () => this.saveSettings());
        syncBtn.addEventListener('click', () => this.manualSync());
        
        // Close overlay when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeSettings();
            }
        });
        
        // Update last sync display
        this.updateLastSyncDisplay();
        setInterval(() => this.updateLastSyncDisplay(), 30000); // Update every 30 seconds
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
            this.showSyncStatus('Testing connection...');
            await Storage.fullSync(false);
            
            this.closeSettings();
            this.showSyncStatus('✓ Configured successfully', 'success');
            this.updateLastSyncDisplay();
            
            // Refresh all views
            DailyMenu.render();
            WeeklyMenu.render();
            ShoppingList.render();
            FoodManager.render();
        } catch (error) {
            this.showSyncStatus('✗ Connection failed', 'error');
            console.error('GitHub sync error:', error);
        }
    },
    
    async manualSync() {
        if (!GitHubAPI.isConfigured()) {
            Utils.showToast('Configure GitHub in Settings first', 'error');
            this.openSettings();
            return;
        }
        
        const syncBtn = document.getElementById('sync-btn');
        syncBtn.classList.add('syncing');
        syncBtn.disabled = true;
        
        this.showSyncStatus('Syncing...');
        
        const result = await Storage.fullSync(false);
        
        syncBtn.classList.remove('syncing');
        syncBtn.disabled = false;
        
        if (result.success) {
            this.showSyncStatus('✓ Sync complete', 'success');
            this.updateLastSyncDisplay();
            
            // Refresh all views
            DailyMenu.render();
            WeeklyMenu.render();
            ShoppingList.render();
            FoodManager.render();
        } else {
            this.showSyncStatus('✗ Sync failed: ' + result.error, 'error');
        }
    },
    
    showSyncStatus(message, type = 'info') {
        const statusBar = document.getElementById('sync-status-bar');
        const statusText = document.getElementById('sync-status-text');
        
        statusBar.className = 'sync-status-bar';
        if (type !== 'info') {
            statusBar.classList.add(type);
        }
        
        statusText.textContent = message;
        statusBar.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusBar.classList.add('hidden');
        }, 3000);
    },
    
    updateLastSyncDisplay() {
        const display = document.getElementById('last-sync-display');
        const text = document.getElementById('last-sync-text');
        const lastSync = Storage.getLastSyncDisplay();
        
        text.textContent = lastSync;
        
        if (lastSync === 'Never synced') {
            display.classList.add('never-synced');
        } else {
            display.classList.remove('never-synced');
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
