(()=>{
  const toggle=document.querySelector('.mobile-menu-toggle');
  const nav=document.querySelector('.navlinks');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});}
  const form=document.getElementById('globalSearchForm');
  const field=document.getElementById('globalSearch');
  if(form&&field){form.addEventListener('submit',e=>{e.preventDefault();const q=field.value.trim();const target='/crosshair-codes/'+(q?'?q='+encodeURIComponent(q):'');location.href=target;});}
})();
