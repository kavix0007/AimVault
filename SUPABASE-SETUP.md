# AimVault V2 — Supabase setup

AimVault is still a static GitHub Pages site. Supabase provides the database, admin authentication and image storage.

## 1. Create a Supabase project
Create a project in Supabase, then open **Project Settings → API**. Copy the project URL and the public **publishable/anon** key.

## 2. Run the database setup
Open **SQL Editor**, paste everything from `supabase/schema.sql`, and run it.

The script creates:
- `crosshairs` database table
- `admin_users` allowlist
- Row Level Security policies
- `crosshair-images` public image bucket
- existing AimVault crosshair migration

The migration is safe to re-run because the inserted rows use the table's generated IDs and `on conflict do nothing`; if you already imported the rows, don't duplicate them manually.

## 3. Create the admin account
Open **Authentication → Users → Add user** and create your admin email/password.

Then in SQL Editor run:

```sql
insert into public.admin_users(user_id)
select id from auth.users where email = 'YOUR-ADMIN-EMAIL';
```

Do not enable public sign-ups for this admin system.

## 4. Connect the website
Edit:

`assets/js/supabase-config.js`

and replace the two placeholders with your Supabase project URL and public publishable/anon key.

**Never put the service_role/secret key in the website.**

## 5. Deploy
Upload the contents of this ZIP to the root of your GitHub Pages repository. Keep `index.html` at the repository root.

Admin login: `/admin/login/`
Admin dashboard: `/admin/`

## What happens after setup
- Add one crosshair once in the dashboard.
- Select any number of categories.
- The same database row automatically appears on the homepage and every selected category page.
- Pro is a checkbox and automatically controls the Pro page.
- Editing a crosshair updates the same row everywhere.
- Delete removes it from the public library.
- Unpublished rows remain visible only to admins.
- Copy buttons work without storing a copy counter.
