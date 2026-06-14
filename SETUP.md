# Quick Setup Guide

## Step 1: Deploy the App (GitHub Pages)

1. Create or use your existing GitHub repository for this project.
2. Push your latest code.
3. In GitHub repo settings, open Pages.
4. Set source to branch main and folder root.
5. Save and wait for deployment.

Your app URL will be:
https://YOUR_USERNAME.github.io/food-schedule/

## Step 2: Create Supabase Project

1. Open https://supabase.com and create a new project.
2. In project settings, copy:
   - Project URL
   - Anon key

## Step 3: Create Required Table

In Supabase SQL Editor, run:

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

## Step 4: Enable RLS and Policies

In Supabase SQL Editor, run:

```sql
alter table public.app_state enable row level security;

create policy if not exists "allow authenticated read"
on public.app_state
for select
to authenticated
using (true);

create policy if not exists "allow authenticated write"
on public.app_state
for insert
to authenticated
with check (true);

create policy if not exists "allow authenticated update"
on public.app_state
for update
to authenticated
using (true)
with check (true);
```

Note:
- If you are not using Supabase Auth yet, create temporary anon policies for internal testing.

## Step 5: Configure App on iPhone

1. Open app URL on iPhone Safari.
2. Tap Settings button.
3. Enter Supabase Project URL.
4. Enter Supabase anon key.
5. Tap Test Connection.
6. Tap Save.

## Step 6: Add to Home Screen

1. Tap Safari Share button.
2. Tap Add to Home Screen.
3. Name it Food Schedule.

## Step 7: Configure Wife's Phone

Repeat Step 5 and Step 6 on your wife's phone with the same Supabase URL and anon key.

## Done

You can now:
- Add food items
- Edit Monday to Friday weekly menu
- See current day menu from weekly plan
- Generate shopping list
- Sync data across devices via Supabase

## Need Help?

- App not loading: check GitHub Pages deployment
- Connection failed: verify Supabase URL and anon key
- Sync not working: verify table, RLS, and policies
- Data mismatch: tap manual Sync on both devices

Security note:
Keep your Supabase anon key private and only use it in trusted family devices.
