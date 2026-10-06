/* Ambient hero motion; all movement stops for reduced-motion visitors. */
(()=>{
 const hero=document.querySelector('.hero-stage');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!hero||reduced.matches)return;
 const activate=()=>document.body.classList.add('hero-activated');
 document.addEventListener('brand-intro-finished',activate,{once:true});
 if(!document.body.classList.contains('intro-active')) activate();
 const fine=matchMedia('(pointer:fine)');
 if(fine.matches){
  hero.addEventListener('pointermove',event=>{
   const rect=hero.getBoundingClientRect();
   const x=((event.clientX-rect.left)/rect.width-.5)*3;
   const y=((event.clientY-rect.top)/rect.height-.5)*2;
   hero.style.setProperty('--hero-x',`${x.toFixed(2)}px`);
   hero.style.setProperty('--hero-y',`${y.toFixed(2)}px`);
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');});
 }
})();
