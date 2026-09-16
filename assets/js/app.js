(function(){
  const cfg=window.AIMVAULT_SUPABASE||{};
  const ready=cfg.url && !cfg.url.includes('YOUR-PROJECT') && cfg.anonKey && !cfg.anonKey.includes('YOUR-PUBLISHABLE');
  let client=null;
  if(ready && window.supabase) client=window.supabase.createClient(cfg.url,cfg.anonKey);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const slug=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const fallbackMsg='<div class="panel empty">Database is not configured yet. Add your Supabase URL and publishable/anon key in <code>/assets/js/supabase-config.js</code>.</div>';
  async function getAll(){
    if(!client) return [];
    const {data,error}=await client.from('crosshairs').select('*').eq('published',true).order('created_at',{ascending:false});
    if(error) throw error; return data||[];
  }
  function image(item){return item.image_url?`<img src="${esc(item.image_url)}" alt="${esc(item.name)} Valorant crosshair" loading="lazy" draggable="false">`:'<div class="image-placeholder">No image</div>'}
  function card(item,link){
    const badge=item.is_pro?'<div class="badge-pro">PRO</div>':'';
    const href=link?` href="${link(item)}"`:'';
    const title=link?`<a${href}>${esc(item.name)}</a>`:esc(item.name);
    const cats=(item.categories||[]).map(esc).join(' • ');
    return `<article class="panel card"><div class="preview">${badge}${image(item)}</div><h3>${title}</h3><div class="meta">${cats}${item.player?' • '+esc(item.player):''}</div><code class="code">${esc(item.code)}</code><div class="card-actions"><button class="btn btn-dark copy" data-code="${encodeURIComponent(item.code)}">⧉ Copy code</button></div></article>`;
  }
  function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.className='toast';t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(window.__avt);window.__avt=setTimeout(()=>t.classList.remove('show'),1600)}
  document.addEventListener('click',e=>{const b=e.target.closest('.copy');if(!b)return;const code=decodeURIComponent(b.dataset.code||'');navigator.clipboard?.writeText(code).then(()=>toast('Code copied.')).catch(()=>window.prompt('Copy code:',code))});
  document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear()});
  async function renderLibrary(){
    if(document.body.dataset.page!=='library')return; const grid=document.getElementById('crosshairGrid'); if(!grid)return;
    if(!client){grid.innerHTML=fallbackMsg;return}
    try{
      const all=await getAll(); const filtersEl=document.getElementById('filters'), search=document.getElementById('search'), sort=document.getElementById('sort');
      const cats=['All',...Array.from(new Set(all.flatMap(x=>x.categories||[])))]; let active='All';
      function apply(){const q=(search?.value||'').toLowerCase().trim();let list=all.filter(x=>(active==='All'||(x.categories||[]).includes(active)) && (`${x.name} ${(x.categories||[]).join(' ')} ${x.player||''}`).toLowerCase().includes(q));const s=sort?.value||'newest';if(s==='newest')list.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));if(filtersEl)filtersEl.innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');grid.innerHTML=list.length?list.map(x=>card(x,x.is_pro&&x.name.toLowerCase()==='tenz'?()=>'/pro-crosshairs/tenz/':null)).join(''):'<div class="panel empty">No crosshairs found.</div>'}
      filtersEl?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){active=b.dataset.filter;apply()}});search?.addEventListener('input',apply);sort?.addEventListener('change',apply);apply();
    }catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load crosshairs. Check your Supabase setup and RLS policies.</div>'}
  }
  async function renderCategory(){const grid=document.getElementById('crosshairGrid');if(!grid)return;const cat=document.body.dataset.category;if(!cat)return;if(!client){grid.innerHTML=fallbackMsg;return}try{const {data,error}=await client.from('crosshairs').select('*').eq('published',true).contains('categories',[cat]).order('created_at',{ascending:false});if(error)throw error;grid.innerHTML=data?.length?data.map(x=>card(x)).join(''):'<div class="panel empty">No crosshairs in this category yet.</div>'}catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load this category.</div>'}}
  async function renderPro(){if(document.body.dataset.page!=='pro')return; const grid=document.getElementById('crosshairGrid');if(!grid)return;if(!client){grid.innerHTML=fallbackMsg;return}try{const {data,error}=await client.from('crosshairs').select('*').eq('published',true).eq('is_pro',true).order('created_at',{ascending:false});if(error)throw error;grid.innerHTML=data?.length?data.map(x=>card(x,x.name.toLowerCase()==='tenz'?()=>'/pro-crosshairs/tenz/':null)).join(''):'<div class="panel empty">No Pro crosshairs yet.</div>'}catch(e){console.error(e);grid.innerHTML='<div class="panel empty">Could not load Pro crosshairs.</div>'}}
  async function renderDetail(){const name=document.body.dataset.detailName; if(!name)return; if(!client)return; try{const {data,error}=await client.from('crosshairs').select('*').eq('published',true).eq('name',name).maybeSingle();if(error)throw error;if(!data)return;const im=document.getElementById('tenzImage');if(im)im.innerHTML=image(data);const sub=document.getElementById('tenzSub');if(sub)sub.textContent=(data.categories||[]).join(' • ')+' crosshair';const code=document.getElementById('tenzCode');if(code)code.textContent=data.code;const btn=document.getElementById('tenzCopyBtn');if(btn)btn.dataset.code=encodeURIComponent(data.code)}catch(e){console.error(e)}}
  window.AimVaultApp={client,esc,slug,getAll,renderLibrary,renderCategory,renderPro,renderDetail,toast};
  document.addEventListener('DOMContentLoaded',()=>{renderLibrary();renderCategory();renderPro();renderDetail()});
})();
