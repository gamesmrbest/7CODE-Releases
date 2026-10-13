(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const langButton = document.getElementById('langBtn');
  const menuButton = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const getText = (node,lang) => node.getAttribute(lang==='en'?'data-en':'data-ar');
  const chooseLanguage = lang => {
    const safe = lang==='en'?'en':'ar';
    document.documentElement.lang=safe;
    document.documentElement.dir=safe==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(node=>{
      const value=getText(node,safe);
      if(value!==null){
        // These are fixed, authored translations; no external content is inserted as HTML.
        if(node.tagName==='H1'||node.tagName==='H2')node.innerHTML=value;
        else node.textContent=value;
      }
    });
    langButton.textContent=safe==='ar'?'EN':'ع';
    langButton.setAttribute('aria-label',safe==='ar'?'Switch to English':'التبديل إلى العربية');
    menuButton.setAttribute('aria-label',safe==='ar'?'القائمة':'Menu');
    document.title=safe==='ar'?'7CODE — مساحة واحدة لكل ما تبنيه':'7CODE — One workspace for everything you build';
    try{localStorage.setItem('7code.site.language',safe)}catch{}
  };
  let language='ar';
  try{language=localStorage.getItem('7code.site.language')==='en'?'en':'ar'}catch{}
  chooseLanguage(language);
  langButton.addEventListener('click',()=>{
    language=language==='ar'?'en':'ar';
    chooseLanguage(language);
  });
  const closeMenu=()=>{
    mobileNav.hidden=true;
    menuButton.setAttribute('aria-expanded','false');
  };
  menuButton.addEventListener('click',()=>{
    const showing=mobileNav.hidden;
    mobileNav.hidden=!showing;
    menuButton.setAttribute('aria-expanded',String(showing));
  });
  mobileNav.addEventListener('click',e=>{
    if(e.target.closest('a'))closeMenu();
  });
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu();
  });
  document.querySelectorAll('.theme-control').forEach(button=>{
    button.addEventListener('click',()=>{
      const choices={emerald:'#53f695',ocean:'#62b5ff',violet:'#c89cff'};
      const theme=button.getAttribute('data-theme');
      if(!Object.hasOwn(choices,theme))return;
      document.documentElement.style.setProperty('--accent',choices[theme]);
      document.querySelectorAll('.theme-control').forEach(item=>{
        const active=item===button;
        item.classList.toggle('is-selected',active);
        item.setAttribute('aria-pressed',String(active));
      });
    });
  });
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.09});
    document.querySelectorAll('.reveal').forEach(node=>observer.observe(node));
  }else{
    document.querySelectorAll('.reveal').forEach(node=>node.classList.add('visible'));
  }
  // Only use signed release metadata to display a version. Download targets remain
  // our fixed public GitHub Releases link and cannot be replaced by feed content.
  const updateVersion=async()=>{
    try{
      const controller=new AbortController();
      const id=setTimeout(()=>controller.abort(),4500);
      const response=await fetch('/latest.json',{cache:'no-store',signal:controller.signal});
      clearTimeout(id);
      if(!response.ok)return;
      const data=await response.json();
      if(typeof data.version!=='string'||!/^v?\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(data.version))return;
      const value='v'+data.version.replace(/^v/,'');
      document.querySelectorAll('.preview-version,#heroVersion').forEach(el=>{el.textContent=value;});
      const release=document.getElementById('releaseLabel');
      if(release)release.textContent=(language==='ar'?'7CODE '+value+' · Windows 10/11 x64':'7CODE '+value+' · Windows 10/11 x64');
    }catch{ /* The static download button remains usable when the feed is unavailable. */ }
  };
  void updateVersion();
})();
