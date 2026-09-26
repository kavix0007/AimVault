# AimVault V2

Valorant crosshair library built for GitHub Pages + Supabase.

## Stack
- HTML/CSS/vanilla JavaScript
- GitHub Pages hosting
- Supabase PostgreSQL
- Supabase Auth for the private admin area
- Image URLs only (no image upload and no Supabase Storage)

## Main system
- One database record per crosshair
- Select multiple categories when adding a crosshair
- The same record automatically appears on the homepage and every selected category page
- Pro checkbox automatically controls the Pro page
- Add / edit / delete / publish / unpublish
- Image URL field only
- No copy counter
- Public pages show only published crosshairs
- Admin can manage all crosshairs
- Duplicate rendering is prevented by database row ID

## GitHub structure
`index.html` is at the repository root. Public category pages live under `/crosshairs/<category>/`.

See `SUPABASE-SETUP.md` for database and admin setup.


## Live Copy Counts

AimVault now displays a persistent copy count on database-backed crosshair cards. A count increases only after a successful Copy Code action. The public site uses the `increment_crosshair_copy(uuid)` Supabase RPC so visitors do not receive database update privileges.

For an existing Supabase project, run `supabase/copy-count-migration.sql` once in the Supabase SQL Editor before deploying the updated files.
