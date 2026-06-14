# Quick Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `food-schedule` (or any name you prefer)
3. Choose Public or Private
4. Don't initialize with README (we already have files)
5. Click "Create repository"

## Step 2: Get Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Food Schedule App`
4. Select scope: ✓ **repo** (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** - save it somewhere safe! You'll need it later.

## Step 3: Push Code to GitHub

Open terminal/command prompt in this folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Food Schedule App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/food-schedule.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages" (in sidebar)
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes for deployment
6. Your app URL will be: `https://YOUR_USERNAME.github.io/food-schedule/`

## Step 5: Generate App Icons

1. Open `icon-generator.html` in your browser
2. Download both icon files (192x192 and 512x512)
3. Place them in the root folder
4. Commit and push to GitHub:
   ```bash
   git add icon-192.png icon-512.png
   git commit -m "Add app icons"
   git push
   ```

## Step 6: Configure App on iPhone

1. Open the app URL on your iPhone Safari
2. Tap the Settings icon (⚙️) in bottom right
3. Enter your GitHub Personal Access Token (from Step 2)
4. Enter repository: `YOUR_USERNAME/food-schedule`
5. Tap "Save"

## Step 7: Add to Home Screen

1. In Safari, tap the Share button (⬆️)
2. Scroll down and tap "Add to Home Screen"
3. Name it "Food Schedule"
4. Tap "Add"

## Done! 🎉

You can now:
- ✓ Add food items
- ✓ Generate daily/weekly menus
- ✓ Track prepared meals
- ✓ Create shopping lists
- ✓ Sync between your and your wife's phones

## For Your Wife's Phone

Repeat Steps 6 and 7 on her iPhone. She'll use the same GitHub token and repository name to sync data.

## Need Help?

- **App not loading?** Check GitHub Pages deployment status
- **Sync not working?** Verify token has `repo` scope
- **Icons not showing?** Make sure icon files are in root folder
- **Data not syncing?** Both phones must use same repository name

---

**Security Note**: Keep your Personal Access Token private. Don't share it publicly or commit it to the repository.
