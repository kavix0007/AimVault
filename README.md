# AimVault V3 — redesigned GitHub Pages package

This package refreshes AimVault's visual identity and public-site experience while retaining the static HTML + CSS + JavaScript architecture, Supabase-backed crosshair library, admin dashboard, generator and persistent copy-count RPC.

## What's new
- New blue/violet AimVault branding derived from the supplied logo artwork.
- Redesigned responsive header, search, hero, cards, filters, category pages, guides and footer.
- Mobile navigation and site-wide search that forwards to the crosshair library.
- Homepage discovery sections and stronger category-specific supporting copy.
- Fixed a card-link bug that could create `href="null"` for crosshairs associated with unlinked/unverified players.
- Fixed TenZ page desktop minimum widths that caused horizontal overflow on mobile.
- Improved category meta descriptions and refreshed sitemap with canonical, indexable pages only.
- Preserved the Supabase client configuration, admin routes, generator, data model and copy-count flow.

## Deploy safely
1. Download and extract this ZIP.
2. Back up your current GitHub repository before deploying.
3. Review the included QA notes and compare the file list with your repository.
4. Upload the extracted contents while preserving all folders and paths.
5. Deploy through the existing GitHub Pages publishing branch.
6. Test homepage, library, category pages, TenZ, generator, admin login and mobile layout.
7. In Search Console, inspect each canonical URL and request indexing after the live test passes.

## SEO indexing policy
The sitemap contains 17 canonical pages that are intended to be indexable. TenZ is the only completed, manually maintained player page currently included. Zekken, aspas, Demon1 and nAts remain `noindex` while their profile codes/settings/content are unverified. Do not add unfinished pages to the sitemap merely to increase its URL count.

## Supabase safety
- The website continues to use the existing public Supabase publishable key in `assets/js/supabase-config.js`. This is designed for browser use; never place a service-role or secret key in frontend files.
- This ZIP does not connect to or modify your live Supabase database or DNS.
- Do not rerun `supabase/schema.sql` on a working database just to deploy the redesign. The seed section is for initial setup only. Review it before running on any database.
- `supabase/copy-count-migration.sql` is only for an existing database that lacks the copy counter/RPC; inspect the live schema first.
- The `player_profiles` table is retained in the schema for compatibility, but the current static player pages are not rendered from it.

## Main routes
- `/` homepage
- `/crosshair-codes/` full library
- `/crosshairs/<category>/` category pages
- `/pro-crosshairs/` Pro-tagged library
- `/tenz/` completed manual player profile
- `/zekken/`, `/aspas/`, `/demon1/`, `/nats/` unverified starter pages (noindex)
- `/generator.html` crosshair generator
- `/admin/` and `/admin/login/` admin dashboard and login

## Brand assets
- `assets/img/aimvault-wordmark.png` horizontal wordmark
- `assets/img/aimvault-icon.png` square icon
- `favicon.png` and `favicon.ico` updated from the supplied logo
