# Family Food Schedule

A mobile-friendly web application for planning daily and weekly meals for your family. Generate smart meal plans, track what you've prepared, and create shopping lists automatically.

## Features

- 📅 **Daily Menu**: View and manage today's meals (Breakfast, Lunch, Morning Snack, Evening Snack)
- 📆 **Weekly Planner**: See the entire week's meal plan at a glance
- 🍽️ **Food Management**: Add, edit, and organize food items with ingredients
- 🛒 **Shopping List**: Auto-generated list based on weekly menu
- ✅ **Meal Tracking**: Mark meals as prepared
- 🔄 **Smart Rotation**: Avoid repeating meals within 7 days
- 📱 **Mobile Optimized**: Works great on iPhone (PWA support)
- 🔐 **GitHub Sync**: Data syncs between devices via GitHub

## Quick Start

### 1. Set Up GitHub Repository

1. Create a new GitHub repository (can be private or public)
2. Note your repository name: `username/food-schedule`
3. Create a Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Food Schedule App"
   - Select scope: `repo` (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

### 2. Deploy to GitHub Pages

**Option A: Manual deployment**
1. Push all files to your repository
2. Go to repository Settings → Pages
3. Under "Source", select branch `main` and folder `/ (root)`
4. Click Save
5. Your app will be available at: `https://username.github.io/food-schedule/`

**Option B: Using GitHub Actions** (recommended)
1. Create `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
```

2. Push to GitHub - deployment will happen automatically

### 3. Configure the App

1. Open the deployed app URL on your iPhone
2. Click the settings icon (⚙️) in the bottom right
3. Enter your GitHub Personal Access Token
4. Enter your repository in format: `username/food-schedule`
5. Click "Save"
6. The app will sync your data to GitHub

### 4. Add to iPhone Home Screen (PWA)

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Name it "Food Schedule" and tap "Add"
5. The app will now work like a native app!

## Usage

### Managing Food Items

1. **Tap 🔄 to sync** (get latest food items)
2. Go to "Foods" tab
3. Click "+ Add Food" button
4. Enter food name, select category, and add ingredients (one per line)
5. Click "Save"
6. **Tap 🔄 to sync** (upload changes)
7. Edit or delete items by clicking the respective buttons on food cards

### Viewing Daily Menu

1. Go to "Today" tab
2. View today's automatically generated menu
3. Check off meals as you prepare them
4. Click "Regenerate Menu" if you want different options

### Planning the Week

1. Go to "Week" tab
2. View meals for the entire week
3. Use arrows to navigate between weeks
4. See which meals are marked as prepared (✓)

### Shopping List

1. Go to "Shopping" tab
2. View all ingredients needed for the week
3. Check off items as you buy them
4. Click "Refresh" to regenerate the list

## Data Sync

- **Automatic Local Storage**: All data is stored locally in your browser
- **Manual Sync Button**: Tap the 🔄 button to sync with GitHub (pull + push)
- **Visual Feedback**: See sync status at top and last sync time near button
- **Multi-Device**: Both you and your wife can access the same data
- **Offline Support**: App works offline; sync when connected

### How to Sync

1. **Before using**: Tap 🔄 sync button to get latest changes
2. **Make your changes**: Add food, mark meals, generate menus
3. **After changes**: Tap 🔄 sync button to upload

**See [SYNC_GUIDE.md](SYNC_GUIDE.md) for detailed sync workflow and tips**

## File Structure

```
food-schedule/
├── index.html           # Main HTML file
├── styles.css          # All CSS styles
├── manifest.json       # PWA configuration
├── icon-192.png        # App icon (192x192)
├── icon-512.png        # App icon (512x512)
├── data/
│   ├── food-items.json    # All food options
│   ├── weekly-menu.json   # Current menu plan
│   └── meal-history.json  # Preparation history
└── js/
    ├── config.js          # App configuration
    ├── githubApi.js       # GitHub API integration
    ├── storage.js         # Data storage/sync
    ├── menuAlgorithm.js   # Meal rotation logic
    ├── foodManager.js     # Food CRUD operations
    ├── dailyMenu.js       # Daily menu view
    ├── weeklyMenu.js      # Weekly menu view
    ├── shoppingList.js    # Shopping list generator
    └── app.js             # Main application logic
```

## Creating App Icons

For the PWA to work properly, create two icon files:

**icon-192.png** (192x192 pixels)
**icon-512.png** (512x512 pixels)

You can:
1. Use a free tool like Canva to create icons
2. Use an emoji as icon (🍽️)
3. Use a simple design with your choice of colors
4. Save as PNG with transparent background

Place these files in the root directory.

## Troubleshooting

**App not syncing?**
- Check your GitHub token is correct
- Verify repository name format: `username/repo-name`
- Make sure token has `repo` scope permissions
- Check browser console for errors

**Menu not generating?**
- Make sure you have food items added in each category
- Try clicking "Regenerate Menu"
- Check if data files exist in your GitHub repo

**PWA not installing on iPhone?**
- Make sure you're using Safari browser
- Try clearing browser cache and reloading
- Verify manifest.json is accessible

**Changes not saving?**
- Check GitHub sync is configured
- Look for error toasts at the top of screen
- Verify internet connection

## Customization

### Adding More Categories

Edit `js/config.js` and add to `CATEGORIES` object:

```javascript
CATEGORIES: {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    morningSnack: 'Morning Snack',
    eveningSnack: 'Evening Snack',
    dinner: 'Dinner'  // Add new category
}
```

### Changing Rotation Period

Edit `js/config.js`:

```javascript
MENU_ROTATION_DAYS: 7  // Change to 10, 14, etc.
```

### Changing Colors

Edit `styles.css` root variables:

```css
:root {
    --primary-color: #4CAF50;  /* Change to your preference */
    --secondary-color: #2196F3;
}
```

## License

This is a personal project. Feel free to use and modify for your own family's needs!

## Support

This is a self-hosted app. No external support is provided, but you can:
- Check browser console for errors
- Verify GitHub API responses
- Review data files in your repository

## Version

Version 1.0.0 - June 2026
