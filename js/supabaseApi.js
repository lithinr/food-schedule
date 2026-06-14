// Supabase API Integration
const SupabaseAPI = {
    url: null,
    anonKey: null,
    client: null,

    init() {
        this.url = localStorage.getItem(CONFIG.STORAGE_KEYS.SUPABASE_URL);
        this.anonKey = localStorage.getItem(CONFIG.STORAGE_KEYS.SUPABASE_ANON_KEY);

        if (this.isConfigured()) {
            this.client = supabase.createClient(this.url, this.anonKey, {
                auth: { persistSession: false }
            });
        }

        return this.isConfigured();
    },

    isConfigured() {
        return !!(this.url && this.anonKey);
    },

    configure(url, anonKey) {
        this.url = url;
        this.anonKey = anonKey;

        localStorage.setItem(CONFIG.STORAGE_KEYS.SUPABASE_URL, url);
        localStorage.setItem(CONFIG.STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey);

        this.client = supabase.createClient(this.url, this.anonKey, {
            auth: { persistSession: false }
        });
    },

    async readState() {
        if (!this.client) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await this.client
            .from(CONFIG.SUPABASE.TABLE)
            .select('id, food_items, weekly_menu, meal_history, updated_at')
            .eq('id', CONFIG.SUPABASE.APP_STATE_ID)
            .maybeSingle();

        if (error) {
            throw new Error(error.message || 'Failed to read cloud state');
        }

        return data;
    },

    async writeState(statePayload) {
        if (!this.client) {
            throw new Error('Supabase is not configured');
        }

        const payload = {
            id: CONFIG.SUPABASE.APP_STATE_ID,
            food_items: statePayload.food_items,
            weekly_menu: statePayload.weekly_menu,
            meal_history: statePayload.meal_history,
            updated_at: new Date().toISOString()
        };

        const { error } = await this.client
            .from(CONFIG.SUPABASE.TABLE)
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            throw new Error(error.message || 'Failed to write cloud state');
        }

        return true;
    },

    async testConnection() {
        if (!this.client) {
            throw new Error('Supabase is not configured');
        }

        const { error } = await this.client
            .from(CONFIG.SUPABASE.TABLE)
            .select('id')
            .limit(1);

        if (error) {
            throw new Error(error.message || 'Unable to connect to Supabase');
        }

        return true;
    }
};
