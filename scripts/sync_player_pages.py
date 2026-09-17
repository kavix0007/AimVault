import json, re, shutil, urllib.request, urllib.parse
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
CONFIG = (ROOT / 'assets/js/supabase-config.js').read_text(encoding='utf-8')
url = re.search(r"url:\s*'([^']+)'", CONFIG).group(1).rstrip('/')
key = re.search(r"anonKey:\s*'([^']+)'", CONFIG).group(1)
req = urllib.request.Request(
    url + '/rest/v1/player_profiles?select=slug&published=eq.true&order=slug.asc',
    headers={'apikey': key, 'Authorization': 'Bearer ' + key}
)
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        profiles = json.load(r)
    slugs=[]
    for row in profiles:
        slug=str(row.get('slug','')).strip().lower()
        if re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
            slugs.append(slug)
except Exception:
    # Offline packaging fallback: preserve existing player directories.
    slugs=[d.name for d in ROOT.iterdir() if d.is_dir() and (d/'index.html').exists() and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', d.name) and d.name not in {'admin','assets','crosshair-codes','crosshairs','guides','pro-crosshairs','supabase','_templates','scripts'}]

template=(ROOT/'_templates/player.html').read_text(encoding='utf-8')
marker='<!-- AIMVAULT GENERATED PLAYER PAGE -->'
# Generate/refresh pages for every published profile.
for slug in slugs:
    d=ROOT/slug
    d.mkdir(exist_ok=True)
    page=template.replace('__PLAYER_SLUG__', slug)
    if marker not in page:
        page=page.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n'+marker, 1)
    (d/'index.html').write_text(page, encoding='utf-8')
    (d/'.aimvault-generated').write_text('Generated from Supabase player_profiles.\n', encoding='utf-8')

# Remove generated player directories whose profiles are no longer published.
for marker_file in ROOT.glob('*/.aimvault-generated'):
    slug=marker_file.parent.name
    if slug not in slugs:
        shutil.rmtree(marker_file.parent)

# Keep sitemap aligned with clean player URLs.
sitemap=ROOT/'sitemap.xml'
if sitemap.exists():
    ns='http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', ns)
    tree=ET.parse(sitemap); root=tree.getroot()
    # Remove old clean-player URLs and old /pro-crosshairs/<player>/ URLs.
    for u in list(root):
        loc=u.find(f'{{{ns}}}loc')
        if loc is None or not loc.text: continue
        path=urllib.parse.urlparse(loc.text).path.strip('/')
        parts=path.split('/') if path else []
        if (len(parts)==1 and parts[0] not in {'crosshair-codes','pro-crosshairs','generator','guides'}) or (parts[:1]==['pro-crosshairs'] and len(parts)==2):
            root.remove(u)
    existing={u.find(f'{{{ns}}}loc').text for u in root if u.find(f'{{{ns}}}loc') is not None}
    for slug in slugs:
        loc=f'https://aimvault.online/{slug}/'
        if loc not in existing:
            el=ET.SubElement(root, f'{{{ns}}}url')
            ET.SubElement(el, f'{{{ns}}}loc').text=loc
    tree.write(sitemap, encoding='UTF-8', xml_declaration=True)

print('Published player pages:', ', '.join(slugs) if slugs else '(none)')
