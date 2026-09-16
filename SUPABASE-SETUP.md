# AimVault V2 — Supabase setup

AimVault remains a static GitHub Pages site. Supabase provides the database and admin authentication. **Images are supplied as normal external image URLs; Supabase Storage is not used.**

## 1. Create the Supabase project
Create a Supabase project, then copy the Project URL and public publishable/anon key from Project Settings → API.

## 2. Database
Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the `crosshairs` table, `admin_users` allowlist, indexes, RLS policies and the admin helper function. No Storage bucket is created.

If your database is already working, **do not rerun the seed section just to deploy the website**. Your live database is separate from the GitHub files.

## 3. Admin account
Create the admin account under Authentication → Users, then add its UUID to `public.admin_users`.

```sql
insert into public.admin_users(user_id)
select id from auth.users where email = 'YOUR-ADMIN-EMAIL'
on conflict (user_id) do nothing;
```

## 4. Website configuration
`assets/js/supabase-config.js` contains only the public Supabase URL and publishable/anon key. Never put a service_role/secret key in the website.

## 5. Crosshair workflow
1. Open `/admin/login/`.
2. Sign in.
3. Enter name and Valorant code.
4. Paste a direct image URL (optional).
5. Select one or more categories.
6. Choose Pro if applicable.
7. Keep Published enabled when you want it public.
8. Save.

The single database row is then automatically displayed on the homepage, `/crosshair-codes/`, the selected `/crosshairs/<category>/` pages, and `/pro-crosshairs/` when Pro is checked. Editing or deleting the row updates/removes it everywhere.
