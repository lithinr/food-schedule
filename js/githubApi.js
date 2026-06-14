// GitHub API Integration
const GitHubAPI = {
    token: null,
    repo: null,
    
    init() {
        this.token = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN);
        this.repo = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_REPO);
        return this.isConfigured();
    },
    
    isConfigured() {
        return !!(this.token && this.repo);
    },
    
    configure(token, repo) {
        this.token = token;
        this.repo = repo;
        localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN, token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_REPO, repo);
    },
    
    async request(method, path, data = null) {
        if (!this.isConfigured()) {
            throw new Error('GitHub API not configured');
        }
        
        const url = `${CONFIG.GITHUB_API_BASE}/repos/${this.repo}/contents/${path}`;
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            if (response.status === 404 && method === 'GET') {
                return null;
            }
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        return method === 'DELETE' ? null : await response.json();
    },
    
    async readFile(path) {
        try {
            const response = await this.request('GET', path);
            if (!response) return null;
            
            // Remove newlines and decode properly
            const cleanContent = response.content.replace(/\n/g, '');
            const content = decodeURIComponent(escape(atob(cleanContent)));
            return {
                content: JSON.parse(content),
                sha: response.sha
            };
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    },
    
    async writeFile(path, content, sha = null) {
        try {
            // Always fetch latest SHA before writing to prevent conflicts
            if (!sha) {
                const existing = await this.readFile(path);
                if (existing) {
                    sha = existing.sha;
                }
            }
            
            const contentString = JSON.stringify(content, null, 2);
            // Fix encoding for special characters
            const encodedContent = btoa(unescape(encodeURIComponent(contentString)));
            
            const data = {
                message: `Update ${path} - ${new Date().toISOString()}`,
                content: encodedContent,
                branch: CONFIG.DATA_BRANCH
            };
            
            if (sha) {
                data.sha = sha;
            }
            
            await this.request('PUT', path, data);
            return true;
        } catch (error) {
            console.error('Error writing file:', error);
            throw error;
        }
    },
    
    async deleteFile(path, sha) {
        try {
            await this.request('DELETE', path, {
                message: `Delete ${path}`,
                sha,
                branch: CONFIG.DATA_BRANCH
            });
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
};
