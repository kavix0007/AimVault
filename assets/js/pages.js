/*
  AimVault — shared page script.
  Depends on /assets/data/crosshairs.js being loaded first
  (window.AIMVAULT_CROSSHAIRS).

  Uses the SAME localStorage key as the homepage so copy counts
  stay consistent across every page on the site.
*/
(function(){
  const COUNT_KEY='aimvault_copy_counts_v2';
  const ALL = window.AIMVAULT_CROSSHAIRS || [];

  function getCounts(){
    try{return JSON.parse(localStorage.getItem(COUNT_KEY)||'{}')}catch(e){return {}}
  }
  function countFor(item){
    const counts=getCounts();
    return Number(item.copies||0)+Number(counts[item.code]||0);
  }
  function formatCopies(n){
    n=Number(n)||0;
    if(n>=1000000)return (n/1000000).toFixed(n%1000000>=100000?1:0)+'M';
    if(n>=1000)return (n/1000).toFixed(n%1000>=100?1:0)+'K';
    return String(n);
  }
  function safe(s){
    return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function miniPreview(item){
    const img=item.image
      ? `<img src="${safe(item.image)}" alt="${safe(item.name)} Valorant crosshair" loading="lazy" draggable="false">`
      : `<div class="image-placeholder">Add image URL</div>`;
    const badge=item.isPro?'<div class="badge-pro">PRO</div>':'';
    return `<div class="preview">${badge}${img}</div>`;
  }
  function slugFor(item){
    return String(item.name).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
  function card(item, opts){
    opts = opts || {};
    const total=countFor(item);
    const player=item.player?` • ${safe(item.player)}`:'';
    const linkAttr = opts.linkTo ? ` href="${opts.linkTo(item)}"` : '';
    const titleHtml = opts.linkTo ? `<a${linkAttr}>${safe(item.name)}</a>` : safe(item.name);
    return `<article class="panel card">
      ${miniPreview(item)}
      <h3>${titleHtml}</h3>
      <div class="meta">${safe(item.category)}${player}</div>
      <code class="code">${safe(item.code)}</code>
      <div class="copy-count">${formatCopies(total)} ${total===1?'copy':'copies'}</div>
      <div class="card-actions">
        <button class="btn btn-dark copy" data-code="${encodeURIComponent(item.code)}">⧉ Copy code</button>
      </div>
    </article>`;
  }
  function toast(m){
    let t=document.getElementById('toast');
    if(!t){
      t=document.createElement('div');
      t.className='toast';
      t.id='toast';
      document.body.appendChild(t);
    }
    t.textContent=m;t.classList.add('show');
    clearTimeout(window.__aimvaultToastT);
    window.__aimvaultToastT=setTimeout(()=>t.classList.remove('show'),1600);
  }
  async function copyCode(code, onDone){
    const item=ALL.find(x=>x.code===code);
    try{
      await navigator.clipboard.writeText(code);
      if(item){
        const counts=getCounts();
        counts[code]=(Number(counts[code])||0)+1;
        localStorage.setItem(COUNT_KEY,JSON.stringify(counts));
      }
      toast('Code copied.');
      if(onDone) onDone();
    }catch(e){
      window.prompt('Copy code:',code);
    }
  }

  // Delegate copy-button clicks anywhere on the page.
  document.addEventListener('click',e=>{
    const c=e.target.closest('.copy');
    if(c){
      copyCode(decodeURIComponent(c.dataset.code), ()=>{
        if(window.AimVaultRerender) window.AimVaultRerender();
      });
    }
  });

  document.addEventListener('DOMContentLoaded',()=>{
    const y=document.getElementById('year');
    if(y) y.textContent=new Date().getFullYear();
  });

  /**
   * Render a static (non-interactive) grid of crosshairs into a container.
   * Used on category pages / pro pages / related-crosshair sections.
   */
  function renderGrid(containerId, list, opts){
    const el=document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = list.length ? list.map(x=>card(x,opts)).join('') : '<div class="panel empty">No crosshairs found.</div>';
  }

  /**
   * Wire up a searchable/sortable grid (used on /crosshair-codes/).
   * baseList: the fixed list of items available to this page.
   */
  function initLibrary(config){
    const grid=document.getElementById(config.gridId);
    const search=document.getElementById(config.searchId);
    const sort=document.getElementById(config.sortId);
    const filtersEl=document.getElementById(config.filtersId);
    const filters=config.filters || ['All'];
    let active='All';

    function apply(){
      const q=(search && search.value || '').toLowerCase().trim();
      const sortVal=sort ? sort.value : 'copies';
      let list=config.items.filter(x=>{
        const categoryOk = active==='All' || x.category===active;
        const searchOk=(x.name+' '+x.category+' '+x.player).toLowerCase().includes(q);
        return categoryOk && searchOk;
      });
      if(sortVal==='copies') list.sort((a,b)=>countFor(b)-countFor(a));
      if(sortVal==='recent' || sortVal==='newest') list.sort((a,b)=>new Date(b.added)-new Date(a.added));
      grid.innerHTML = list.length ? list.map(x=>card(x,config.cardOpts)).join('') : '<div class="panel empty">No crosshairs found.</div>';
      if(filtersEl){
        filtersEl.innerHTML = filters.map(x=>`<button class="filter ${x===active?'active':''}" data-filter="${x}">${x}</button>`).join('');
      }
    }
    if(filtersEl){
      filtersEl.addEventListener('click',e=>{
        const f=e.target.closest('[data-filter]');
        if(f){active=f.dataset.filter;apply();}
      });
    }
    if(search) search.addEventListener('input',apply);
    if(sort) sort.addEventListener('change',apply);
    window.AimVaultRerender = apply;
    apply();
  }

  window.AimVault = {
    ALL, getCounts, countFor, formatCopies, safe, miniPreview, slugFor,
    card, toast, copyCode, renderGrid, initLibrary
  };
})();
