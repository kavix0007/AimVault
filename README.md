# AimVault — Flat Deployable Version

This version keeps the same root-level deployment format as the old site:

- `index.html` — complete homepage, database, search, filters, copy buttons, categories, pro section and SEO content
- `default.webp` — original AimVault preview background
- `robots.txt` — crawl rules + sitemap
- `sitemap.xml` — only the real homepage is listed for Phase 1
- `CNAME` — `aimvault.online`
- `.nojekyll` — GitHub Pages compatibility

The homepage uses the original crosshair dataset from the old `index.html` and keeps the existing browser-local copy counter behavior.

Future category/pro/guide URLs should only be added to the sitemap after real pages exist.
