# 🔄 Sync Guide

## How Syncing Works

Your Food Schedule app now uses **manual sync** for reliability and control. Here's what you need to know:

### The Two-Button System

1. **🔄 Sync Button** (blue, top right)
   - Pulls latest data from GitHub
   - Pushes your local changes to GitHub
   - Updates both directions at once

2. **⚙️ Settings Button** (green, bottom right)
   - Configure GitHub access
   - Set up Personal Access Token
   - Enter repository name

### When to Sync

**Before Making Changes:**
- Tap sync button to get latest data from your wife's updates
- This ensures you're working with current information

**After Making Changes:**
- Add/edit/delete food items
- Generate or regenerate menus
- Mark meals as prepared
- Then tap sync button to upload changes

**Best Practice:**
- Sync at start of each session
- Sync after making any changes
- Check "last sync" time below the sync button

### How It Works

```
Your Phone                GitHub               Wife's Phone
    |                        |                        |
    |---- Tap Sync ---------->|                        |
    |<--- Pull Latest --------|                        |
    |---- Push Changes ------>|                        |
    |                        |<---- Tap Sync ---------|
    |                        |---- Pull Latest ------>|
    |                        |<--- Push Changes ------|
```

### Visual Feedback

**Status Bar (top of screen):**
- "Syncing..." - In progress
- "✓ Sync complete" (green) - Success
- "✗ Sync failed" (red) - Error

**Last Sync Time (near sync button):**
- "Never synced" - Configure GitHub first
- "Just now" - Synced within last minute
- "5m ago" - Synced 5 minutes ago
- "2h ago" - Synced 2 hours ago
- "Yesterday" - Synced yesterday
- "3d ago" - Synced 3 days ago

**Sync Button Animation:**
- Spinning 🔄 - Sync in progress
- Static 🔄 - Ready to sync

### What Gets Synced

All three data files sync together:
1. **food-items.json** - All your food options
2. **weekly-menu.json** - Current week's meal plan
3. **meal-history.json** - What you've prepared

### Sync Workflow Examples

**Scenario 1: Adding Food Items**
1. Open app, tap 🔄 sync button
2. Go to "Foods" tab
3. Add 3 new breakfast items
4. Tap 🔄 sync button
5. Changes now on GitHub
6. Wife taps sync on her phone → sees new items

**Scenario 2: Checking Today's Menu**
1. Open app in morning
2. Tap 🔄 sync button (get latest)
3. Go to "Today" tab
4. Mark breakfast as prepared
5. Tap 🔄 sync button
6. Wife can see breakfast is done

**Scenario 3: Planning the Week**
1. Sunday evening: tap 🔄 sync
2. Go to "Week" tab
3. Review weekly menu
4. Regenerate if needed
5. Tap 🔄 sync button
6. Both phones have same plan

**Scenario 4: Shopping List**
1. Before shopping: tap 🔄 sync
2. Go to "Shopping" tab
3. Check off items as you buy
4. After shopping: tap 🔄 sync
5. Wife sees what's been bought

### Conflict Resolution

**If both edit at same time:**
- Last sync wins (most recent push)
- GitHub keeps version history
- You can always check repository on GitHub.com
- For important data, communicate before editing

**Best practice to avoid conflicts:**
- Sync before making changes
- Agree who manages what:
  - You: Add food items
  - Wife: Mark meals as prepared
- Or simply sync often

### Troubleshooting

**"Never synced" showing?**
- Tap ⚙️ settings button
- Enter GitHub Personal Access Token
- Enter repository name
- Tap "Save"

**Sync button spinning forever?**
- Check internet connection
- Verify GitHub token is valid
- Check token hasn't expired
- Try closing and reopening app

**"Sync failed" message?**
- Check internet connection
- Verify repository name is correct
- Make sure token has `repo` scope
- Check GitHub status: status.github.com

**Changes not appearing on other phone?**
- Make sure both phones use same repository
- Ensure both have synced (tap sync button)
- Check last sync time on both phones
- Verify internet connection on both

### Offline Support

**Without internet:**
- ✅ App works fully offline
- ✅ Add food items
- ✅ Generate menus
- ✅ Mark meals prepared
- ✅ View shopping list
- ❌ Sync won't work (will show error)
- Data saved locally, will sync when online

### Data Storage

**Local (Phone Browser):**
- All data cached in browser localStorage
- Works offline
- Survives app restarts
- Cleared if browser data cleared

**GitHub Repository:**
- Master copy of data
- Accessible from web
- Version controlled
- Backed up

### Advanced: Manual Sync in Browser

If sync button isn't working, you can manually trigger sync in browser console:

```javascript
// Pull latest from GitHub
await Storage.syncFromGitHub();

// Push local changes to GitHub
await Storage.pushToGitHub();

// Full sync (pull then push)
await Storage.fullSync();
```

### Security Notes

- Personal Access Token stored in browser only
- Never synced to GitHub (kept local)
- Token has access only to your repository
- Can revoke token anytime on GitHub

### Tips for Success

1. **Sync regularly** - Make it a habit
2. **Before leaving home** - Sync so data is uploaded
3. **When arriving home** - Sync to get updates
4. **After shopping** - Sync shopping list
5. **Sunday planning** - Both sync before planning week

### Need Help?

Check these in order:
1. Last sync time - Is it recent?
2. Internet connection - Connected to WiFi/data?
3. GitHub settings - Token and repo correct?
4. Browser console (F12) - Any error messages?
5. GitHub repository - Can you see the data files?

---

**Remember:** Sync early, sync often! 🔄
