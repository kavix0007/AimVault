# AimVault — SEO-reviewed GitHub Pages package

This package preserves the existing static HTML + CSS + JavaScript architecture, Supabase-backed crosshair library, admin pages, generator, and persistent copy counter.

## Deploy
1. Back up your current GitHub repository first.
2. Extract this ZIP and preserve the directory structure when uploading.
3. Commit the files to the repository's publishing branch.
4. Check GitHub Settings → Pages. Keep the existing custom domain `aimvault.online` and existing DNS records unless GitHub reports a domain/certificate issue.
5. After deployment, test `/`, `/crosshair-codes/`, `/crosshairs/dot/`, `/tenz/`, and `/generator.html` in a normal browser.
6. In Google Search Console, inspect the preferred URLs and request indexing after the live test passes.

## SEO changes in this package
- Improved homepage title and description.
- Expanded the dot-crosshair page with useful explanatory content and import steps aligned with the dot-code search intent.
- Added short, distinct supporting copy to crosshair category pages.
- Sitemap now lists indexable, completed pages only; it excludes duplicate TenZ route and unfinished player profiles.
- Legacy `/pro-crosshairs/tenz/` is `noindex,follow` and canonicalizes to `/tenz/`.
- Zekken, aspas, Demon1, and nAts pages are `noindex` until their code/settings/content are verified. They do not copy placeholder codes and are not linked from database cards as completed profiles.
- Supabase config uses the project's public publishable key, not a service-role key.

## Important database safety
- This ZIP does not connect to or modify your live Supabase database.
- Do not rerun `supabase/schema.sql` on an existing database just to deploy the frontend. The seed section is intended for initial setup and may create duplicate rows if run again.
- `supabase/copy-count-migration.sql` is only for an existing database that does not yet have the copy counter/RPC; check the current database first and run it only if needed.
- The TenZ code in the schema seed was aligned with the manually maintained `/tenz/` page for new installations only. This does not update any existing live database row. Compare the live TenZ record in the admin panel before changing it; don't overwrite it without confirming the desired code.
- No DNS records are changed by this package.

## Site paths
- `/` — homepage
- `/crosshair-codes/` — full library
- `/crosshairs/<category>/` — category pages
- `/pro-crosshairs/` — pro library
- `/tenz/` — completed static TenZ profile
- `/zekken/`, `/aspas/`, `/demon1/`, `/nats/` — unverified starter pages, excluded from indexing until completed
- `/admin/` and `/admin/login/` — private admin panel and login
- `/generator.html` — crosshair generator

The public Supabase publishable key is intentionally present in the browser configuration. Never put a service-role key, password, or GitHub token in frontend files.
