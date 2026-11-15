# AimVault V3 QA notes

## Static checks performed
- Confirmed all sitemap URLs resolve to files in the package (directory index or root file).
- Confirmed sitemap XML parses and includes canonical, indexable pages only.
- Confirmed the current noindex starter player pages are excluded from the sitemap.
- Confirmed each public SEO page has a canonical URL and one H1.
- Confirmed the public app retains the existing Supabase client and copy-count RPC.
- Fixed player-card anchor generation so unknown player slugs do not become `href="null"`.
- Removed the TenZ page's forced desktop min-width rules and added responsive layout overrides.
- Kept admin pages noindex and preserved existing authentication guard.

## Must test after deployment in a real browser
- Homepage crosshair cards load from Supabase.
- Library search, category filters and copy-count updates work.
- Category pages show the correct database rows.
- Pro page shows published rows where `is_pro=true`.
- TenZ copy/download/share buttons work.
- Generator preview, code export and import controls work.
- Admin login, create, edit, publish/unpublish and delete work (test delete only with a disposable row).
- Mobile menu, global search, cards and player page have no horizontal overflow.
- Search Console live URL inspection passes for each sitemap URL.

## Safety
No live database, DNS or GitHub repository was modified by preparing this package. Back up the repository before deployment.
