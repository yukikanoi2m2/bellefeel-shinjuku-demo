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
  let frame=0, point=null;
  hero.addEventListener('pointermove',event=>{
   point=[event.clientX,event.clientY];
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    const rect=hero.getBoundingClientRect();
    const x=Math.max(-1,Math.min(1,((point[0]-rect.left)/rect.width-.5)*2));
    const y=Math.max(-1,Math.min(1,((point[1]-rect.top)/rect.height-.5)*2));
    hero.style.setProperty('--hero-x',`${(x*5).toFixed(2)}px`);
    hero.style.setProperty('--hero-y',`${(y*3).toFixed(2)}px`);
    hero.dataset.gaze=x>.2?'right':x<-.35?'left':'center';
   });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=0;delete hero.dataset.gaze;hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');});
 }
})();
