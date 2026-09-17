# AimVault Player Pages

## How the system works

Player profiles are stored in Supabase in `player_profiles`. Each published profile gets a clean SEO URL such as:

- `/tenz/`
- `/zekken/`
- `/aspas/`

The admin dashboard lets you add/edit the player name, slug, profile image URL, page title, unique description, SEO description, and published status.

## Adding a new player

1. Open `/admin/`.
2. Use **Add / Edit Pro Player**.
3. Enter the player name. The slug is generated automatically; keep it short and lowercase.
4. Add a profile image URL.
5. Write unique useful player information in **Unique description**.
6. Add a short SEO description.
7. Publish the profile.
8. The GitHub Action **Sync AimVault player pages** runs every 30 minutes, or you can run it immediately from GitHub → Actions → Sync AimVault player pages → Run workflow.

The action creates the real static `/slug/index.html` page, so the clean URL is crawlable by GitHub Pages instead of relying on a JavaScript-only 404 route.

## Crosshair association

In **Add Crosshair**, put the exact player name in the **Player** field. The public player page automatically loads that player's published crosshairs from Supabase.

One crosshair remains one database record even if it belongs to multiple categories.

## Image policy

AimVault uses **Image URL only**. There is no image upload field and no Supabase Storage dependency.
