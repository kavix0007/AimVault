# AimVault V2 — Supabase setup

## 1. Create the project
Create a Supabase project. Use the region closest to your visitors.

## 2. Create the database
Open **SQL Editor → New query**, paste the entire `supabase/schema.sql`, and click **Run**.

## 3. Create the admin login
Open **Authentication → Users → Add user** and create your admin email/password.

Then add that user's UUID to `public.admin_users` using the SQL at the bottom of `schema.sql` (or the admin insert you already used).

## 4. Configure the website
Open `assets/js/supabase-config.js` and replace:

- `PASTE_YOUR_SUPABASE_PROJECT_URL_HERE` with your Supabase **Project URL**
- `PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE` with your public **publishable/anon key**

Use only the public browser key. **Never use a secret/service_role key.**

## 5. Deploy
Upload the contents of this project to the root of the GitHub Pages repository. `index.html` must be at the repository root.

## 6. Admin
Open `/admin/login/` and sign in with the Supabase user that was added to `admin_users`.

## Image URLs
AimVault V2 intentionally uses **Image URL** fields. Images are not uploaded to Supabase Storage. The URL is saved in `crosshairs.image_url`.

## Categories
A crosshair can have multiple categories. One database row can contain, for example, `['cyan','dot','small']`. Category pages query the same row automatically, so there are no duplicate crosshair records.
