# Family Food Schedule

A mobile-friendly web application for planning daily and weekly meals for your family. The app supports Monday to Friday weekly planning, daily meal tracking, shopping list generation, and cross-device cloud sync using Supabase.

## Features

- Daily menu from current weekly plan
- Monday to Friday weekly editor
- Food item management with ingredients
- Shopping list generation from weekly menu
- Prepared meal tracking
- Manual cloud sync button with status feedback
- iPhone-friendly PWA experience

## Quick Start

### 1. Deploy App

Host this repository on GitHub Pages and open the deployed URL on your phones.

### 2. Configure Supabase

Create a Supabase project and copy:
- Project URL
- Anon key

Create table and row in Supabase SQL Editor:

```sql
create table if not exists public.app_state (
  id text primary key,
  food_items jsonb not null default '{}'::jsonb,
  weekly_menu jsonb not null default '{"weekStarting":"","days":[]}'::jsonb,
  meal_history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.app_state (id)
values ('family_main')
on conflict (id) do nothing;
```

Enable RLS and policies:

```sql
alter table public.app_state enable row level security;

create policy if not exists "allow authenticated read"
on public.app_state for select to authenticated using (true);

create policy if not exists "allow authenticated write"
on public.app_state for insert to authenticated with check (true);

create policy if not exists "allow authenticated update"
on public.app_state for update to authenticated using (true) with check (true);
```

### 3. Configure App Settings

In app settings:
1. Enter Supabase Project URL
2. Enter Supabase anon key
3. Tap Test Connection
4. Tap Save

### 4. Sync Workflow

1. Tap Sync before editing
2. Make changes
3. Tap Sync after editing

Use the same Supabase settings on both phones.

## Usage

- Foods tab: add and edit meal options
- Week tab: edit Monday to Friday plan
- Today tab: follow current day meals from weekly plan
- Shopping tab: review weekly ingredients list

## Troubleshooting

- Connection failed: verify Supabase URL and anon key
- Sync failed: verify app_state table and RLS policies
- Data mismatch: tap Sync on both devices

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
    ├── supabaseApi.js     # Supabase API integration
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
- Verify Supabase URL and anon key in settings
- Verify app_state table exists
- Verify RLS policies allow read and write
- Check browser console for API errors

**Menu not generating?**
- Make sure food items exist in each category
- Click Regenerate Menu

**PWA not installing on iPhone?**
- Open in Safari
- Clear browser cache and retry
- Verify manifest.json is available

**Changes not saving?**
- Tap Sync after edits
- Check internet connection
- Check top status bar for sync error message

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
- Verify Supabase responses
- Review data in Supabase table app_state

## Version

Version 1.0.0 - June 2026
