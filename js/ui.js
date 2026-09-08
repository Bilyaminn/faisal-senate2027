export function initNavigation(){
  const header=document.getElementById('siteHeader');
  const toggle=document.getElementById('menuToggle');
  const mobile=document.getElementById('mobileNav');
  const closeMenu=()=>{
    mobile.hidden=true;
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    document.body.classList.remove('menu-open');
  };
  const sync=()=>header.classList.toggle('scrolled',window.scrollY>28);
  sync(); window.addEventListener('scroll',sync,{passive:true});
  toggle.addEventListener('click',(event)=>{
    event.stopPropagation();
    const open=toggle.getAttribute('aria-expanded')==='true';
    if(open) closeMenu();
    else {
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close navigation');
      mobile.hidden=false;
      document.body.classList.add('menu-open');
    }
  });
  document.addEventListener('pointerdown',(event)=>{
    if(toggle.getAttribute('aria-expanded')==='true' && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape') closeMenu()});
  window.addEventListener('resize',()=>{if(window.innerWidth>900) closeMenu()});
}

export function toast(message){
  const el=document.getElementById('toast'); if(!el)return;
  el.textContent=message; el.classList.add('show'); clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}
