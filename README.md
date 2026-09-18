# AimVault — fix notes & maintenance guide

This is the complete, ready-to-upload site: homepage, crosshair library,
pro-crosshairs page, all 8 category pages, the TenZ player page, and the
crosshair generator — every file connected and working together.

## ⚠️ Read this first — `zekken/`, `aspas/`, `demon1/`, `nats/` are not in this zip

Your message said the player pages had been uploaded, but only the **8
category pages** actually came through with content — I checked the raw
files on disk to be sure, and `zekken`, `aspas`, `demon1` and `nats` simply
aren't there; only `tenz/` (from earlier) has real file content. I'm not
guessing at that split — I looked.

I'm not going to fabricate those four pages, since I don't have any of
their real crosshair codes, images, or info, and inventing placeholder
pages for them would risk you uploading fake data by mistake. Everything
else you listed is genuinely fixed and included below. Please re-upload
those four player HTML files (or paste their content) and I'll fold them
into a final zip immediately — no other changes needed on your end.

`favicon.png`, `default.webp` and the `/guides/` pages also were never
uploaded in any message, so they aren't in this zip either — keep the
copies you already have on your server, unchanged.

---

## ⚠️ The one thing you need to do yourself

**`/tenz/index.html` currently has no real crosshair code, no crosshair
image, and no role/team/region text.**

I checked — the file you uploaded had these three elements completely
empty, and `app.js`'s `renderDetail()` function (the one that was supposed
to fill them in) is just a no-op comment. There was no code or image URL
anywhere in what you sent me, so the Copy button had nothing to copy and
the image box had nothing to show. I didn't invent anything to fill the
gap — I left clearly-marked placeholders instead:

- `PASTE-TENZ-CROSSHAIR-CODE-HERE` inside the `<code id="tenzCode">` tag
- an empty `src=""` on the image inside `#tenzImage` (shows an "Add the
  crosshair image URL" placeholder box until you fill it in)
- `Add role, team & region` inside `#tenzSub`

Open `/tenz/index.html`, find the big `EDIT TENZ'S INFO HERE` comment near
the top of `<main>`, and fill in the three spots it points to. The Copy
button and the new "Open in Builder" button both read the code
automatically from that one `#tenzCode` tag — you only have to change the
code in one place.

---

## Files changed, and why

| File | What changed |
|---|---|
| `index.html` | Favicon links made root-relative (`/favicon.png`); added the missing `Guides` nav link (every other page has it); added a `Loading crosshairs…` placeholder in the grid so the page doesn't look empty/broken for the half-second before Supabase responds; `defer` added to all three scripts; `aria-label`-equivalent (`aria-labelledby`) added to the search box, sort select and filter group for screen readers; small CSS-only fade-in animation added when cards render; keyboard focus rings restored (see below). |
| `crosshair-codes/index.html` | Same loading/defer/a11y fixes as above, **plus a real bug fix**: the sort `<select>` had `<option value="recent">` but `app.js` only checks for `value === 'newest'`, so "Newest" silently did nothing when chosen. Fixed the value to `newest` to match `app.js` and the homepage. |
| `pro-crosshairs/index.html` | Added the JSON-LD structured-data block every other indexable page has (this one was missing it entirely); loading placeholder; `defer` on scripts. |
| `tenz/index.html` | Fixed the empty code/image/sub-heading bug described above; the Copy button previously had no `data-code` attribute at all, so clicking it copied nothing — now it's wired up automatically; added an "Open in Builder" button next to Copy that deep-links to `generator.html?code=...` (the generator already supports reading a `?code=` param, it just had no page linking to it with a real code). |
| `generator.html` | Added the favicon, canonical URL, theme-color, and full Open Graph / Twitter tags it was missing entirely; added a small `WebApplication` JSON-LD block; replaced the placeholder "AV" text logo in the header with the real AimVault crosshair-mark SVG used on every other page, and pointed its home link at `/` instead of the relative `index.html`. The generator's actual crosshair-building code (canvas rendering, code parsing, presets, etc.) was **not touched**. |
| `crosshairs/cyan/`, `dot/`, `funny/`, `minimalist/`, `other/`, `pro/`, `small/`, `teams/` (all `index.html`) | New — these are the 8 category pages you sent. All meta tags, canonical URLs, breadcrumbs, copy and category slugs are kept exactly as you wrote them; I verified each file's `data-category` attribute matches its folder before saving it. The only additions are the same two safe, non-visual fixes used elsewhere: a "Loading crosshairs…" placeholder in the grid, and `defer` on the three scripts. `app.js`'s existing `renderCategory()` function (unchanged) does the rest — it reads `data-category` off `<body>` and queries Supabase for crosshairs in that category. |
| `assets/css/pages.css` | Restored a visible keyboard-focus outline on the search box and sort dropdown — they had `outline:none` with nothing to replace it, which is an accessibility failure for anyone navigating by keyboard. Added the same subtle card fade-in used on the homepage. Left a comment at the top noting the homepage keeps its own copy of this CSS (see below). |
| `sitemap.xml` | The 8 category URLs are now included for real, since their pages exist in this zip. `/generator.html` was added (a live, indexable page that was missing). The `zekken`/`aspas`/`demon1`/`nats` lines are still there on the assumption your live site already has them (per your first message) — delete any line for a page that doesn't actually exist yet, since a sitemap entry with no matching page shows up as a soft-404 in Search Console. |
| `robots.txt`, `app.js`, `supabase-config.js` | Reviewed, no changes made — I didn't find a real bug in either script, and `supabase-config.js` already correctly restricts itself to the public anon key with sensible URL validation. |

### Not changed, on purpose
- No crosshair codes, categories, or Supabase data touched.
- No `player_profiles` table, no automatic player-page system — pages stay static HTML, as you asked.
- No category pages created.
- No redesign — same layout, same colors, same fonts, same information architecture.

---

## One thing worth knowing (not fixed, just flagged)

`index.html` (the homepage) keeps its own full copy of the CSS inside a
`<style>` block, separate from `assets/css/pages.css` that every other page
shares. That's not broken — it's why the homepage's hero section is taller
than the inner pages — but it does mean a shared style like `.card` or
`.filter` now needs to be edited in two places if you ever change it. I
left it as-is rather than merging the two, since merging them risks
changing how the homepage looks and you asked for the smallest safe
changes. If you'd like it merged into one shared stylesheet later, that's a
quick follow-up — just ask.

---

## Adding a new player page

1. Copy the `tenz/` folder and rename it, e.g. `zekken/`.
2. Open `zekken/index.html` and update:
   - `<title>`, the `description` meta, `canonical`, `og:*` and `twitter:*` tags, and the `<link rel="canonical">` URL
   - the breadcrumb text and `<h1>`
   - the `EDIT ... INFO HERE` block: crosshair code, image URL, sub-heading
   - the "Player" fact in `.detail-facts`
3. Add `<url><loc>https://aimvault.online/zekken/</loc></url>` to `sitemap.xml`, in the player-pages section.
4. Upload the folder. No Supabase changes needed — player pages are pure static HTML, same as before.

## Adding a 9th category later, if you ever need one

All 8 categories (`cyan`, `dot`, `funny`, `minimalist`, `other`, `pro`,
`small`, `teams`) are live in this zip under `crosshairs/<slug>/index.html`.
`app.js`'s `renderCategory()` (unchanged) reads `document.body.dataset.category`
and queries Supabase for `.contains('categories', [cat])`, so if you ever
add a 9th category:

1. Copy any existing `crosshairs/<slug>/index.html` as a starting point.
2. Update `data-category="..."` on `<body>` to the new slug.
3. Update the title/description/canonical/breadcrumb text for that category.
4. Add its URL to `sitemap.xml`.

No JavaScript changes needed.

## Supabase

No SQL changes were made or are required based on what you sent me — I
didn't find an RLS error or a misconfiguration in `supabase-config.js` or in
how `app.js` queries the `crosshairs` table (`.eq('published', true)` on
every public read, anon key only). If you *are* seeing an error in the
browser console, the two most common causes for a page like this are:

- **RLS blocks anonymous reads**: your `crosshairs` table needs a policy
  like `for select using (published = true)` granted to the `anon` role.
- **Wrong project URL/key** in `supabase-config.js`: double check the
  `url` and `anonKey` match your project's Settings → API page exactly.

Send me the actual error text if you have one and I can pinpoint it exactly
rather than guessing.

## Uploading to GitHub

```
git add .
git commit -m "Fix homepage/library/player-page bugs, SEO tags, a11y, sitemap"
git push
```

If your host deploys straight from the repo (Netlify/Vercel/GitHub Pages),
that's it. If you're uploading manually, just drag the contents of this zip
into your site root, preserving the folder structure (`assets/css/`,
`assets/js/`, `crosshair-codes/`, `pro-crosshairs/`, `tenz/` all need to
stay where they are relative to `index.html`).

## Testing checklist

Everything from your original 28-point list still applies. Items worth
double-checking after this specific set of fixes:

- [ ] `/tenz/` — fill in the real code/image/sub-heading first, then confirm Copy and "Open in Builder" both work
- [ ] `/crosshair-codes/` — Sort dropdown now actually does something (previously a no-op)
- [ ] `/generator.html` — favicon and logo now show correctly; canonical tag present
- [ ] All 8 `/crosshairs/<slug>/` pages load and show only crosshairs tagged with that category in Supabase
- [ ] The "Browse by category" links on the homepage now go to real pages instead of 404s
- [ ] `sitemap.xml` — validate at https://www.xml-sitemaps.com/validate-xml-sitemap.html after uploading, and delete any player-page line for a page you haven't actually published
- [ ] Tab through the search box and sort dropdown on any library page — you should now see a visible focus ring
- [ ] Re-upload `zekken/`, `aspas/`, `demon1/`, `nats/` (real files, not just filenames) so I can wire them into the next zip
