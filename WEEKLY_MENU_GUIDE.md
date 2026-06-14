# 📅 Weekly Menu Editor Guide

## What's New

### ✨ Manual Weekly Menu Editor
You can now manually select meals for each day of the work week (Monday-Friday)!

### 🔄 Improved Sync
- Fixed encoding issues with special characters
- Better sync reliability
- Daily menu automatically uses your weekly selections

---

## How to Use

### 📱 Planning Your Week

1. **Go to "Week" tab**
2. **Tap "Edit Menu" button**
3. **For each day (Mon-Fri), select meals from dropdowns:**
   - Breakfast
   - Lunch  
   - Morning Snack
   - Evening Snack
4. **Tap "Save Menu"**
5. **Tap 🔄 Sync button** to upload to GitHub

### 📆 Daily View

The "Today" tab now shows meals from your weekly menu automatically:
- If you've planned the week, today's meals come from the weekly plan
- You can still mark meals as prepared
- Changes sync across devices

### 🔄 How Sync Works Now

**Planning the week:**
```
Your Phone:
1. Go to Week tab
2. Tap "Edit Menu"
3. Select meals for Mon-Fri
4. Tap "Save Menu"
5. Tap 🔄 Sync
   → Uploads to GitHub ✓

Wife's Phone:
1. Tap 🔄 Sync
   → Downloads your plan ✓
2. See same weekly menu
```

**During the week:**
```
Morning:
1. Open app
2. Tap 🔄 Sync (get latest)
3. See today's menu from weekly plan
4. Mark meals as prepared
5. Tap 🔄 Sync (upload status)
```

---

## Features

### ✅ Monday-Friday Focus
- Weekly view shows only workdays (Mon-Fri)
- Weekend meals not included (home cooking typically weekdays only)
- Week navigation shows Monday-Friday range

### ✅ Meal Selection
- Dropdown for each meal category
- Choose from your food items library
- Can leave categories empty if not needed
- Changes save immediately to local storage

### ✅ Sync Integration
- Weekly menu syncs across devices
- Daily menu reads from weekly menu
- Preparation tracking works as before
- Shopping list includes whole week's meals

---

## Workflow

### 🗓️ Sunday Evening Planning

**Step 1: Sync First**
- Tap 🔄 to get any updates

**Step 2: Edit Weekly Menu**
- Go to Week tab
- Tap "Edit Menu"
- Select meals for each day

**Step 3: Save & Sync**
- Tap "Save Menu"
- Tap 🔄 to upload

**Step 4: Generate Shopping List**
- Go to Shopping tab
- See all ingredients for the week
- Use while grocery shopping

### 📅 Daily During the Week

**Morning:**
1. Tap 🔄 Sync
2. View Today tab
3. See planned meals
4. Prepare and mark as done
5. Tap 🔄 Sync

**Evening:**
1. Tap 🔄 Sync
2. Mark evening snack as prepared
3. Tap 🔄 Sync

### 🔄 If Plans Change

**Mid-week adjustment:**
1. Tap 🔄 Sync
2. Go to Week tab
3. Tap "Edit Menu"
4. Change meals for remaining days
5. Tap "Save Menu"
6. Tap 🔄 Sync

---

## Key Benefits

### 🎯 Manual Control
- **You decide** what to cook each day
- **No surprises** - know the week ahead
- **Flexibility** - adjust as needed

### 👥 Family Coordination
- **Wife sees plan** on her phone
- **Both can edit** (last sync wins)
- **Shopping together** with same list

### ⏱️ Time Saving
- **Plan once** on Sunday
- **No daily decisions** during busy mornings
- **Shopping list ready** for weekend market

### 📊 Better Variety
- **Manual selection** ensures favorites
- **Avoid repeats** by looking at full week
- **Balance nutrition** across days

---

## Tips & Tricks

### 🎨 Planning Strategies

**Theme Days:**
- Monday: South Indian (Idli, Dosa)
- Tuesday: North Indian (Chapati, Paratha)
- Wednesday: Rice-based
- Thursday: Breakfast experiments
- Friday: Kid's favorites

**Batch Cooking:**
- Select similar meals that share prep
- Monday & Wednesday: Same breakfast for efficiency
- Group by common ingredients

**Balance:**
- Vary protein sources across week
- Mix heavy and light meals
- Consider prep time for busy days

### 🔄 Sync Best Practices

**When to Sync:**
- ✅ Before editing weekly menu
- ✅ After saving weekly menu
- ✅ Before checking daily menu
- ✅ After marking meals prepared
- ❌ Not needed every minute

**If Sync Fails:**
1. Check internet connection
2. Verify GitHub token is valid
3. Check browser console for errors
4. Try again in a few seconds

**If Meals Disappear:**
- This should be fixed now!
- Sync pushes YOUR changes first
- Then pulls updates from wife
- Both changes preserved

---

## Troubleshooting

### ❓ "Save Menu" doesn't work
- Check if you selected at least one meal
- Make sure you're not offline
- Look for error toast at top

### ❓ Daily menu shows wrong meals
- Tap 🔄 Sync to get latest weekly menu
- Check if you're looking at current week
- Verify weekly menu is saved

### ❓ Wife doesn't see my changes
- Did you tap 🔄 Sync after saving?
- Did she tap 🔄 Sync to download?
- Check both phones use same repository

### ❓ Dropdowns are empty
- Go to Foods tab
- Add food items in each category
- Come back to weekly menu editor

### ❓ Weekend days don't show
- This is intentional!
- App shows Monday-Friday only
- Weekend meals can be flexible

---

## Technical Details

### 📊 Data Structure

**Weekly Menu:**
```json
{
  "weekStarting": "2026-06-14",
  "days": [
    {
      "date": "2026-06-14",
      "meals": {
        "breakfast": { "id": "b1", "name": "Idli", ... },
        "lunch": { "id": "l1", "name": "Rice with Dal", ... },
        ...
      }
    }
  ]
}
```

### 🔄 Sync Order

1. **Push** your local changes to GitHub (saves your edits)
2. **Pull** latest data from GitHub (gets wife's changes)
3. If same meal edited: last sync wins
4. Different meals: both preserved

### 💾 Storage

- **Local**: Browser localStorage (instant, works offline)
- **Remote**: GitHub JSON files (syncs between devices)
- **Backup**: GitHub history (can recover old versions)

---

## FAQ

**Q: Can I plan more than one week ahead?**
A: Currently one week at a time. Use prev/next week arrows to navigate.

**Q: What if I want to skip a day?**
A: Leave all dropdowns empty for that day.

**Q: Can I copy last week's menu?**
A: Not yet - you'll need to select meals again each week.

**Q: What if we both edit at the same time?**
A: Last one to sync wins. Coordinate who plans the week.

**Q: Can I see next week's menu?**
A: Yes! Use next week arrow. Plan ahead if you like.

**Q: Do I have to plan all 5 days?**
A: No! Plan as many or as few days as you want.

---

## What's Next?

Future enhancements we could add:
- Copy last week's menu
- Plan multiple weeks ahead
- Meal favorites/quick select
- Recipe instructions per meal
- Nutritional information

For now, enjoy your manual weekly planning! 🎉

---

**Remember:** Plan → Sync → Cook → Mark → Sync

Happy meal planning! 🍽️
