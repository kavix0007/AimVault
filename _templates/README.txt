AIMVAULT — MANUAL PRO PLAYER PAGES
==================================

These pages are plain static HTML. They do not use Supabase, they do not use a
database, and they do not touch your crosshair library or your admin panel.
If Supabase were switched off completely, /tenz/ would still work perfectly.


WHAT TO UPLOAD
--------------
_templates/player.html      master template (noindex, never linked)
tenz/index.html             finished TenZ page
zekken/index.html           starter page (noindex until you fill it in)
aspas/index.html            starter page (noindex until you fill it in)
demon1/index.html           starter page (noindex until you fill it in)
nats/index.html             starter page (noindex until you fill it in)
sitemap.xml                 replaces your current sitemap.xml

Nothing else is changed. index.html, assets/, crosshair-codes/, crosshairs/,
guides/, admin/, supabase/, robots.txt, CNAME, favicon.png and generator.html
are all untouched.


THE ONLY TWO PLACES YOU EDIT
----------------------------
Open any player page in a text editor. Near the top you will find:

  1. EDIT PLAYER INFORMATION HERE   -> window.PLAYER = { ... }
     Name, photo URL, crosshair code, crosshair image URL, settings,
     FAQ, related links. The whole visible page is built from this.

  2. SEO BLOCK                      -> <title>, description, canonical, og:*
     Facebook, Discord and X do not run JavaScript, so these tags are written
     out as plain HTML. Change the player name and the slug in the two URLs.


ADDING A NEW PLAYER (example: Zekken)
-------------------------------------
1. Copy  _templates/player.html
2. Make a folder called  zekken
3. Save the copy inside it as  zekken/index.html
4. In block 1, set  name: "Zekken"  and  slug: "zekken", then fill in the rest
5. In block 2, change PLAYER NAME to Zekken and player-slug to zekken
   (3 places: canonical, og:url, and the titles)
6. Change  <meta name="robots" content="noindex,follow">
   to       <meta name="robots" content="index,follow,max-image-preview:large">
7. Add to sitemap.xml:  <url><loc>https://aimvault.online/zekken/</loc></url>
8. Commit and push. The page is live at https://aimvault.online/zekken/


IMAGES
------
imageUrl           = the player PHOTO
crosshairImageUrl  = the crosshair SCREENSHOT
They are two different pictures. Do not swap them.

Both use object-fit: contain inside a fixed 420px box, so nothing is stretched
or cropped. If a URL is empty, still says PASTE_..., or fails to load, you get a
tidy placeholder instead of a broken-image icon, and the layout does not move.

Use a direct image link (ending in .jpg, .png or .webp). Links to a web page
that merely contains an image will not work. If an image host blocks hotlinking,
save the file into your repo and use a local path such as /assets/img/tenz.webp.


ABOUT "Not available"
---------------------
Every blank field prints "Not available" on purpose. TenZ's sensitivity, DPI,
resolution and mouse are left blank because I could not verify them. Fill them
in from a source you trust rather than publishing a guess.

His team is also blank for the same reason. His crosshair settings are filled
in because they are read directly from the crosshair code you supplied.
