# Local Testing Guide

## Testing Without a Web Server

The app uses GitHub API which requires CORS headers, so it's best to test with a local web server. However, you can still test the basic UI locally.

## Option 1: Python Simple Server (Easiest)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000

## Option 2: Node.js http-server

If you have Node.js installed:

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

Then open: http://localhost:8000

## Option 3: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Option 4: Direct File Open (Limited)

You can open `index.html` directly in your browser, but:
- ❌ GitHub sync won't work (CORS issues)
- ✅ UI will load and work
- ✅ localStorage will work
- ✅ You can test adding food items locally

Simply open: `file:///C:/Working_Directory/Automation/05 FoodSchedule/index.html`

## Testing Checklist

Once the app loads, test these features:

### 1. Food Items Management
- [ ] Click "Foods" tab
- [ ] Click "+ Add Food" button
- [ ] Add a food item with ingredients
- [ ] Verify it appears in the list
- [ ] Edit a food item
- [ ] Delete a food item

### 2. Daily Menu
- [ ] Click "Today" tab
- [ ] Verify daily menu is generated (if food items exist)
- [ ] Check a meal as "prepared"
- [ ] Click "Regenerate Menu"

### 3. Weekly Menu
- [ ] Click "Week" tab
- [ ] Verify weekly menu shows 7 days
- [ ] Navigate to next/previous week
- [ ] Verify today's date is highlighted

### 4. Shopping List
- [ ] Click "Shopping" tab
- [ ] Verify ingredients appear grouped by category
- [ ] Check off some items
- [ ] Click "Refresh"

### 5. Mobile Responsive
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select iPhone 12 Pro or similar
- [ ] Test all features in mobile view
- [ ] Verify navigation bar at bottom
- [ ] Test touch interactions

### 6. GitHub Sync (requires deployment)
- [ ] Click settings icon (⚙️)
- [ ] Enter GitHub token and repo
- [ ] Click Save
- [ ] Verify sync success message
- [ ] Check GitHub repo for data files

## Common Issues

### App not loading?
- Check browser console (F12) for errors
- Verify all JavaScript files loaded
- Try hard refresh (Ctrl+Shift+R)

### No food items showing?
- The app comes with default food items
- Check if `data/food-items.json` loaded
- Open browser console and type: `window.foodItems`

### Menu not generating?
- Make sure food items exist in all categories
- Check console for JavaScript errors
- Try clicking "Regenerate Menu"

### Settings not saving?
- localStorage must be enabled in browser
- Check if running from `file://` protocol (use web server instead)

## Debug Mode

To check what's happening, open browser console (F12) and run:

```javascript
// Check loaded data
console.log('Food Items:', window.foodItems);
console.log('Weekly Menu:', window.weeklyMenu);
console.log('Meal History:', window.mealHistory);

// Check GitHub config
console.log('GitHub Configured:', GitHubAPI.isConfigured());
console.log('Repo:', GitHubAPI.repo);
```

## Next Steps

Once local testing is complete:
1. Follow [SETUP.md](SETUP.md) to deploy to GitHub
2. Configure GitHub sync
3. Test on your iPhone
4. Add to home screen
5. Share with your wife

Happy testing! 🧪
