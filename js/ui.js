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
  sync();
  window.addEventListener('scroll',sync,{passive:true});

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

  // Let mobile navigation links receive their click before the menu is closed.
  // Closing the menu on pointerdown previously removed the link before its click fired.
  mobile.addEventListener('click',(event)=>{
    const link=event.target.closest('a');
    if(!link) return;

    const href=link.getAttribute('href') || '';
    if(href.startsWith('#')){
      const target=document.querySelector(href);
      if(target){
        event.preventDefault();
        closeMenu();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        history.replaceState(null,'',`${location.pathname}${location.search}`);
      }
    } else {
      closeMenu();
    }
  });

  document.addEventListener('pointerdown',(event)=>{
    if(toggle.getAttribute('aria-expanded')==='true' && !toggle.contains(event.target) && !mobile.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown',(event)=>{if(event.key==='Escape') closeMenu()});
  window.addEventListener('resize',()=>{if(window.innerWidth>900) closeMenu()});

  // Prevent the browser from restoring an old section hash after a refresh.
  // Navigation still scrolls normally; a refresh always starts at the top of the campaign page.
  if(location.hash){
    history.replaceState(null,'',`${location.pathname}${location.search}`);
    window.scrollTo(0,0);
  }
}

export function toast(message){
  const el=document.getElementById('toast'); if(!el)return;
  el.textContent=message; el.classList.add('show'); clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}
