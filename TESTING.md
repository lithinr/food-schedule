# Local Testing Guide

## Use a Local Web Server

The app uses Supabase API calls, so run a local server while testing.

## Option 1: Python

```bash
python -m http.server 8000
```

Open http://localhost:8000

## Option 2: Node http-server

```bash
npm install -g http-server
http-server -p 8000
```

Open http://localhost:8000

## Option 3: VS Code Live Server

1. Install Live Server extension
2. Right-click index.html
3. Open with Live Server

## Testing Checklist

### 1. Food Items
- Add, edit, and delete food items

### 2. Weekly Menu
- Verify week view is Monday to Friday
- Use Edit Menu and Save Menu
- Confirm selections persist

### 3. Daily Menu
- Verify today view reflects weekly plan
- Mark meals as prepared

### 4. Shopping
- Verify list aggregates ingredients from weekly menu

### 5. Supabase Sync
- Open settings
- Enter Supabase URL and anon key
- Tap Test Connection
- Tap Save
- Tap Sync
- Verify data in Supabase table app_state

## Debug Snippets

```javascript
console.log('Food Items:', window.foodItems);
console.log('Weekly Menu:', window.weeklyMenu);
console.log('Meal History:', window.mealHistory);
console.log('Supabase Configured:', SupabaseAPI.isConfigured());
console.log('Supabase URL:', SupabaseAPI.url);
```

## Common Issues

- Connection failed: invalid Supabase URL or anon key
- Sync failed: app_state table or RLS policies missing
- Data mismatch: tap Sync on both devices

## Next Steps

1. Follow [SETUP.md](SETUP.md)
2. Configure Supabase on both phones
3. Add app to iPhone home screen
