(function(){
  const cfg = window.AimVaultSupabaseConfig || {};
  const client = typeof cfg.getClient === 'function' ? cfg.getClient() : null;
  const CATEGORY_LABELS = {pro:'Pro',dot:'Dot',cyan:'Cyan',small:'Small',funny:'Funny',minimalist:'Minimalist',teams:'Teams',other:'Other'};
  const CATEGORY_ORDER = ['pro','dot','cyan','small','funny','minimalist','teams','other'];
  let PLAYER_PROFILES = new Map();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fallbackMsg='<div class="panel empty">Database is not configured yet. Check <code>/assets/js/supabase-config.js</code>.</div>';
  const image=item=>item.image_url?`<img src="${esc(item.image_url)}" alt="${esc(item.name)} Valorant crosshair" loading="lazy" draggable="false" referrerpolicy="no-referrer" onerror="this.style.display='none'">`:'<div class="image-placeholder">No image</div>';
  const categoryLabel=c=>CATEGORY_LABELS[c]||String(c||'Other').replace(/\b\w/g,m=>m.toUpperCase());
  const uniq=list=>{const seen=new Set();return (list||[]).filter(x=>x&&x.id&&!seen.has(x.id)&&(seen.add(x.id),true));};
  function playerSlug(name){ return String(name||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function playerLink(item){ const slug=playerSlug(item.player); return slug && PLAYER_PROFILES.has(slug) ? '/'+slug+'/' : null; }
  function card(item, link){
    const badge=item.is_pro?'<div class="badge-pro">PRO</div>':'';
    const href=link?` href="${link(item)}"`:'';
    const title=link?`<a${href}>${esc(item.name)}</a>`:esc(item.name);
    const cats=(item.categories||[]).map(c=>categoryLabel(c)).map(esc).join(' • ');
    return `<article class="panel card"><div class="preview">${badge}${image(item)}</div><h3>${title}</h3><div class="meta">${cats}${item.player?' • '+esc(item.player):''}</div><code class="code">${esc(item.code)}</code><div class="card-actions"><button class="btn btn-dark copy" data-code="${encodeURIComponent(item.code)}">⧉ Copy code</button></div></article>`;
  }
  function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.className='toast';t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(window.__avt);window.__avt=setTimeout(()=>t.classList.remove('show'),1600)}
  document.addEventListener('click',e=>{const b=e.target.closest('.copy');if(!b)return;const code=decodeURIComponent(b.dataset.code||'');navigator.clipboard?.writeText(code).then(()=>toast('Code copied.')).catch(()=>window.prompt('Copy code:',code))});
  document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear()});
  async function getProfiles(){ if(!client) return; const {data,error}=await client.from('player_profiles').select('name,slug').eq('published',true); if(!error) PLAYER_PROFILES=new Map((data||[]).map(x=>[x.slug,x])); }
  async function getAll(){
    if(!client) return [];
    const {data,error}=await client.from('crosshairs').select('*').eq('published',true).order('created_at',{ascending:false});
    if(error) throw error; return uniq(data);
  }
  async function renderLibrary(){
    if(document.body.dataset.page!=='library') return;
    const grid=document.getElementById('crosshairGrid'); if(!grid)return;
    if(!client){grid.innerHTML=fallbackMsg;return}
    try{
      await getProfiles();
      const all=await getAll();
      const filtersEl=document.getElementById('filters'), search=document.getElementById('search'), sort=document.getElementById('sort');
      let available=CATEGORY_ORDER.filter(c=>all.some(x=>(x.categories||[]).includes(c)));
      available=[...available,...Array.from(new Set(all.flatMap(x=>x.categories||[]))).filter(c=>!CATEGORY_ORDER.includes(c))];
      const cats=['All',...available]; let active='All';
      function apply(){
        const q=(search?.value||'').toLowerCase().trim();
        let list=all.filter(x=>(active==='All'||(x.categories||[]).includes(active)) && (`${x.name} ${(x.categories||[]).join(' ')} ${x.player||''} ${(x.tags||[]).join(' ')}`).toLowerCase().includes(q));
        const s=sort?.value||'newest';
        if(s==='newest') list.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        if(filtersEl)filtersEl.innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" data-filter="${esc(c)}">${esc(c==='All'?'All':categoryLabel(c))}</button>`).join('');
        grid.innerHTML=list.length?list.map(x=>card(x,x.player?playerLink:null)).join(''):'<div class="panel empty">No crosshairs found.</div>';
      }
      filtersEl?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){active=b.dataset.filter;apply()}});
      search?.addEventListener('input',apply);sort?.addEventListener('change',apply);apply();
    }catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load crosshairs. Check Supabase RLS/public read access.</div>'}
  }
  async function renderCategory(){
    const grid=document.getElementById('crosshairGrid'); const cat=document.body.dataset.category; if(!grid||!cat)return;
    if(!client){grid.innerHTML=fallbackMsg;return}
    try{
      await getProfiles();
      const {data,error}=await client.from('crosshairs').select('*').eq('published',true).contains('categories',[cat]).order('created_at',{ascending:false});
      if(error)throw error;
      const list=uniq(data);
      grid.innerHTML=list.length?list.map(x=>card(x, x.player?playerLink:null)).join(''):`<div class="panel empty">No ${esc(categoryLabel(cat).toLowerCase())} crosshairs yet.</div>`;
    }catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load this category. Check Supabase RLS/public read access.</div>'}
  }
  async function renderPro(){
    if(document.body.dataset.page!=='pro')return; const grid=document.getElementById('crosshairGrid');if(!grid)return;
    if(!client){grid.innerHTML=fallbackMsg;return}
    try{await getProfiles(); const {data,error}=await client.from('crosshairs').select('*').eq('published',true).eq('is_pro',true).order('created_at',{ascending:false});if(error)throw error;const list=uniq(data);grid.innerHTML=list.length?list.map(x=>card(x,x.player?playerLink:null)).join(''):'<div class="panel empty">No Pro crosshairs yet.</div>'}catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load Pro crosshairs.</div>'}
  }
  async function renderDetail(){
    const slug=document.body.dataset.playerSlug; if(!slug||!client)return;
    try{
      const {data:profile,error:pe}=await client.from('player_profiles').select('*').eq('slug',slug).eq('published',true).maybeSingle();
      if(pe) throw pe;
      if(!profile){ const el=document.getElementById('playerError'); if(el)el.textContent='Player profile not found.'; return; }
      const set=(id,val)=>{const e=document.getElementById(id);if(e&&val!=null)e.textContent=val};
      set('playerName',profile.name); set('playerNameHero',profile.name); set('playerName2',profile.name+' Crosshair Code'); set('playerName3',profile.name); set('playerTitle',profile.title||'Valorant Pro Crosshair'); set('playerDesc',profile.description||'');
      const canonical='https://aimvault.online/'+profile.slug+'/';
      const title=document.getElementById('pageTitle'); if(title)title.textContent=profile.name+' Valorant Crosshair Code | AimVault'; const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle)ogTitle.setAttribute('content',profile.name+' Valorant Crosshair Code | AimVault'); const ogDesc=document.querySelector('meta[property="og:description"]'); if(ogDesc)ogDesc.setAttribute('content',profile.meta_description||('Copy '+profile.name+' Valorant crosshair code and settings on AimVault.')); const ogImg=document.querySelector('meta[property="og:image"]'); if(ogImg&&profile.image_url)ogImg.setAttribute('content',profile.image_url);
      const meta=document.getElementById('pageDescription'); if(meta)meta.setAttribute('content',profile.meta_description||('Copy '+profile.name+' Valorant crosshair code and settings on AimVault.'));
      const canon=document.getElementById('pageCanonical'); if(canon)canon.setAttribute('href',canonical);
      const hero=document.getElementById('playerImage'); if(hero&&profile.image_url)hero.src=profile.image_url;
      const {data:crosshairs,error:ce}=await client.from('crosshairs').select('*').eq('published',true).eq('player',profile.name).order('created_at',{ascending:false});
      if(ce)throw ce;
      const list=uniq(crosshairs);
      const grid=document.getElementById('playerCrosshairGrid');
      if(grid) grid.innerHTML=list.length?list.map(x=>card(x,null)).join(''):'<div class="panel empty">No published crosshairs for this player yet.</div>';
      const primary=list[0];
      if(primary){
        const im=document.getElementById('playerCrosshairImage'); if(im)im.innerHTML=image(primary);
        set('playerCode',primary.code);
        const b=document.getElementById('playerCopyBtn'); if(b)b.dataset.code=encodeURIComponent(primary.code);
        const url=document.getElementById('playerImageUrl'); if(url){url.textContent=primary.image_url||'No image URL'; if(primary.image_url)url.href=primary.image_url; else url.removeAttribute('href');}
      }
    }catch(e){console.error(e);const el=document.getElementById('playerError');if(el)el.textContent='Could not load this player. Check Supabase public read access.';}
  }
  window.AimVaultApp={client,esc,getAll,renderLibrary,renderCategory,renderPro,renderDetail,toast};
  document.addEventListener('DOMContentLoaded',()=>{renderLibrary();renderCategory();renderPro();renderDetail()});
})();
