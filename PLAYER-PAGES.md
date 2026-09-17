# AimVault Manual Pro Player Pages

Player pages are now **100% manual**. They do not use Supabase `player_profiles` and the admin dashboard does not manage players.

## Existing pages
- `/tenz/`
- `/zekken/`
- `/aspas/`
- `/demon1/`
- `/nats/`

Only pages with complete, verified content should be added to the sitemap.

## Add a new player
1. Copy `_templates/player.html`.
2. Create a new folder at the root, for example `yay/`.
3. Put the copied file inside as `yay/index.html`.
4. Replace every `EDIT`/`PLAYER_` placeholder with that player's real information.
5. Change the canonical URL to `https://aimvault.online/yay/`.
6. Add the new URL to `sitemap.xml` after the page is complete.
7. Add an internal link to the page from `/pro-crosshairs/` or another relevant page.
8. Commit/push to GitHub Pages.

## What you can edit on every page
- Player name
- URL slug
- Page title
- SEO meta description
- Player image URL
- Intro text
- Unique description
- Crosshair code
- Crosshair image URL
- Color
- Outlines
- Center dot
- Inner lines
- Outer lines
- Movement error
- Firing error
- Long SEO text
- Why to try the crosshair

## Important
Do not use a Supabase `player_profiles` table for these pages. Supabase remains responsible for the main crosshair database only. The `player` field on a crosshair can still contain a player name, and cards link to `/<slug>/` automatically.
