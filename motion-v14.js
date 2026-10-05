/* Brewns spring reveal / scrub / hover patterns adapted to this static LP.
   One shared, idle-aware RAF; native scrolling and existing controls retained. */
(()=>{
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const spring=(value=0)=>({value,target:value,velocity:0});
 function step(s,dt,tension=170,friction=25){
  if(Math.abs(s.target-s.value)<.0008&&Math.abs(s.velocity)<.001){s.value=s.target;s.velocity=0;return false;}
  s.velocity+=(tension*(s.target-s.value)-friction*s.velocity)*dt;s.value+=s.velocity*dt;return true;
 }
 let raf=0,last=0,dirty=true,ribbonOffset=0;
 const reveals=[],scrubs=[],hovers=[],ambient=[];
 const reading=spring(0);
 const ribbon=document.querySelector('.motion-ribbon');let ribbonVisible=false;
 const hero=document.querySelector('.hero');
 const progress=document.querySelector('.reading-progress');
 const timeline=document.querySelector('.brand-timeline');
 function wake(){if(!raf&&!document.hidden&&!media.matches){raf=window.requestAnimationFrame(frame);}}
 const titleSelector='.motion-heading-line';
 const revealSelector='.set-card,.cross-photo>article,.heritage-mosaic>div,.brand-timeline li,.philosophy article,.layers article,.diagnosis-flow article,.point-item,.reason-card,.doctor-card,.price-package,.clinic-gallery>div,.beauty-link,.story-bridge';
 const revealElements=[...document.querySelectorAll(titleSelector),...document.querySelectorAll(revealSelector)];
 for(const [i,el] of revealElements.entries()){
  const rect=el.getBoundingClientRect();const above=rect.bottom<0;
  const visible=rect.top<(window.innerHeight||800)&&rect.bottom>0;
  const item={el,s:spring(above?1:0),seen:above||visible,delay:0,order:el.matches(titleSelector)?i%2:i%3};
  el.classList.add('motion-reveal');el.style.setProperty('--reveal-opacity','1');
  reveals.push(item);
 }
 // Observe the unclipped heading wrapper; clipping a text line changes its intersection area.
 const revealByElement=new Map();
 for(const item of reveals){const target=item.el.matches(titleSelector)?item.el.parentElement:item.el;item.observed=target;const list=revealByElement.get(target)||[];list.push(item);revealByElement.set(target,list);}
 let revealObserver;
 if('IntersectionObserver' in window){
  revealObserver=new window.IntersectionObserver(entries=>{
   for(const e of entries){if(!e.isIntersecting)continue;const items=revealByElement.get(e.target)||[];for(const item of items){if(item.seen)continue;item.seen=true;item.delay=performance.now()+item.order*85;}revealObserver.unobserve(e.target);}
   wake();
  },{threshold:0,rootMargin:'0px 0px 25px 0px'});
  for(const [target,items] of revealByElement){if(items.some(x=>!x.seen))revealObserver.observe(target);}
 }else{reveals.forEach(x=>{x.seen=true;x.s.target=1;});}
 function addScrub(selector,parentSelector,apply){
  document.querySelectorAll(selector).forEach(el=>{const parent=el.closest(parentSelector)||el;const item={el,parent,s:spring(.5),active:true,apply};scrubs.push(item);});
 }
 addScrub('.hero-visual>img','.hero', (el,p)=>{el.style.transform=`translate3d(0,${(p-.25)*(window.innerWidth<768?-64:-110)}px,0) scale(${1.05-p*.045})`;});
 addScrub('.hero-swirl','.hero',(el,p)=>{el.style.transform=`translate3d(${p*100}px,${p*-90}px,0) rotate(${p*25-12}deg)`;});
 addScrub('.about-swirl','.about',(el,p)=>{el.style.transform=`translate3d(${(p-.5)*65}px,${(p-.5)*-85}px,0) rotate(${p*16-8}deg)`;});
 addScrub('.cross-photo>article>img','.cross-photo',(el,p)=>{el.style.transform=`translate3d(0,${(p-.5)*-52}px,0) scale(1.1)`;});
 addScrub('.heritage-mosaic>div>img','.heritage-mosaic',(el,p)=>{el.style.transform=`translate3d(0,${(p-.5)*-32}px,0) scale(1.07)`;});
 addScrub('.journey-chapter figure img','.journey-chapter',(el,p)=>{el.style.transform=`translate3d(0,${(p-.5)*-32}px,0) scale(1.08)`;});
 if(timeline)scrubs.push({el:timeline,parent:timeline,s:spring(0),active:true,apply:(el,p)=>el.style.setProperty('--timeline-progress',`${clamp((p-.15)/.7)*100}%`)});
 // Reveal uses translate, while pointer tilt uses rotate: transforms do not compete.
 document.querySelectorAll('.set-card,.price-package,.portrait-stage,.rich-line-cta,.beauty-link').forEach(el=>{
  const item={el,x:spring(0),y:spring(0),lift:spring(0),active:false};hovers.push(item);
  el.addEventListener('pointermove',e=>{
   if(!fine.matches||media.matches||e.pointerType==='touch')return;
   const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
   item.active=true;item.x.target=clamp((e.clientY-r.top)/r.height,0,1)*-8+4;
   item.y.target=clamp((e.clientX-r.left)/r.width,0,1)*8-4;
   item.lift.target=el.classList.contains('portrait-stage')?0:4;wake();
  });
  const reset=()=>{item.active=false;item.x.target=0;item.y.target=0;item.lift.target=0;wake();};
  el.addEventListener('pointerleave',reset);el.addEventListener('pointercancel',reset);
  el.addEventListener('focusin',()=>{if(media.matches)return;item.lift.target=3;wake();});el.addEventListener('focusout',reset);
 });
 // Continuous, spring-smoothed motion only while its subject is on screen.
 document.querySelectorAll('.menu-pair img,.visia-device img,.price-visual img,.rich-line-cta .cta-arrow').forEach((el,i)=>{
  ambient.push({el,parent:el.closest('.set-card,.visia-box,.price-package,.rich-line-cta')||el,active:false,y:spring(0),angle:spring(0),phase:i*.9,arrow:el.classList.contains('cta-arrow')});
 });
 const portrait=document.querySelector('.three-d-portrait'),scan=document.querySelector('.skin-scan-line');
 const layerButtons=portrait?[...portrait.querySelectorAll('[data-layer]')]:[];
 const layerControl=document.querySelector('.layer-autoplay');
 let portraitVisible=false,layerTime=0,layerIndex=0,autoLayers=!media.matches;
 const scanPosition=spring(0);
 function syncLayers(){if(layerControl){layerControl.setAttribute('aria-pressed',String(autoLayers));layerControl.textContent=autoLayers?'Ⅱ 3D図解の自動表示を停止':'▶ 3D図解を自動表示';}}
 layerButtons.forEach(button=>button.addEventListener('click',()=>{autoLayers=false;layerTime=0;syncLayers();}));
 if(layerControl)layerControl.addEventListener('click',()=>{autoLayers=!autoLayers;layerTime=0;syncLayers();wake();});
 syncLayers();
 let visibilityObserver;
 if('IntersectionObserver' in window){
  visibilityObserver=new window.IntersectionObserver(entries=>{
   for(const e of entries){if(e.target===ribbon)ribbonVisible=e.isIntersecting;if(e.target===portrait)portraitVisible=e.isIntersecting;for(const item of ambient){if(item.parent===e.target)item.active=e.isIntersecting;}for(const item of scrubs){if(item.parent===e.target)item.active=e.isIntersecting;}}
   dirty=true;wake();
  },{rootMargin:'120px'});
  new Set(scrubs.map(x=>x.parent)).forEach(el=>visibilityObserver.observe(el));if(ribbon)visibilityObserver.observe(ribbon);new Set(ambient.map(x=>x.parent)).forEach(el=>visibilityObserver.observe(el));if(portrait)visibilityObserver.observe(portrait);
 }
 function measure(){
  const vh=window.innerHeight||800;
  for(const item of scrubs){if(!item.active)continue;const r=item.parent.getBoundingClientRect();item.s.target=clamp((vh-r.top)/(vh+r.height));}
  const max=Math.max(1,document.documentElement.scrollHeight-vh);reading.target=clamp((window.scrollY||0)/max);
  if(!visibilityObserver){for(const item of ambient){const r=item.parent.getBoundingClientRect();item.active=r.top<vh&&r.bottom>0;}if(portrait){const r=portrait.getBoundingClientRect();portraitVisible=r.top<vh&&r.bottom>0;}}
  dirty=false;
 }
 function frame(now){
  raf=0;if(document.hidden||media.matches)return;
  const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;
  if(dirty)measure();let moving=false;
  for(const item of reveals){
   if(item.seen&&now>=item.delay)item.s.target=1;
   if(item.seen&&now<item.delay)moving=true;
   moving=step(item.s,dt,150,24)||moving;const p=clamp(item.s.value);
   item.el.style.setProperty('--reveal-opacity',String(.18+p*.82));
   item.el.style.setProperty('--reveal-y',`${(1-p)*(window.innerWidth<768?28:50)}px`);
   if(item.el.classList.contains('motion-heading-line'))item.el.style.setProperty('--reveal-clip',`${(1-p)*95}%`);
  }
  for(const item of scrubs){if(!item.active)continue;moving=step(item.s,dt,105,23)||moving;item.apply(item.el,clamp(item.s.value));}
  for(const item of hovers){
   moving=step(item.x,dt,180,23)||moving;moving=step(item.y,dt,180,23)||moving;moving=step(item.lift,dt,180,23)||moving;
   item.el.style.rotate=`${item.x.value} ${item.y.value} 0 ${Math.hypot(item.x.value,item.y.value)}deg`;
   item.el.style.translate=`0 ${-item.lift.value}px`;
   item.el.style.transformStyle='preserve-3d';
  }
  for(const item of ambient){
   if(!item.active)continue;const phase=now/1000*.95+item.phase;
   item.y.target=Math.sin(phase)*(item.arrow?7:window.innerWidth<768?8:14);
   item.angle.target=item.arrow?0:Math.cos(phase*.8)*3;
   step(item.y,dt,85,20);step(item.angle,dt,85,20);
   item.el.style.transform=item.arrow?`translate3d(${item.y.value}px,0,0)`:`translate3d(0,${item.y.value}px,0) rotate(${item.angle.value}deg)`;
   moving=true;
  }
  if(portraitVisible&&scan&&autoLayers){
   scanPosition.target=(Math.sin(now/1000*1.25)+1)/2;step(scanPosition,dt,80,20);
   scan.style.top=`${28+scanPosition.value*39}%`;scan.style.opacity=String(.25+scanPosition.value*.4);
   layerTime+=dt;if(layerTime>=3.6){layerTime=0;layerIndex=(layerIndex+1)%layerButtons.length;const button=layerButtons[layerIndex];if(button){portrait.dataset.activeLayer=button.dataset.layer;layerButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}}
   moving=true;
  }else if(scan){scan.style.opacity='0';}
  moving=step(reading,dt,180,28)||moving;
  if(progress)progress.style.setProperty('--reading',String(reading.value));
  if(ribbon&&ribbonVisible){
   const track=ribbon.firstElementChild,first=track&&track.firstElementChild;
   if(first){const width=first.getBoundingClientRect().width;if(width>0){ribbonOffset=(ribbonOffset+dt*(window.innerWidth<768?30:46))%width;track.style.setProperty('--ribbon-x',`${-ribbonOffset}px`);moving=true;}}
  }
  if(moving)wake();else last=0;
 }
 function resetMotion(){
  if(raf)window.cancelAnimationFrame(raf);raf=0;last=0;
  for(const item of reveals){item.el.style.setProperty('--reveal-opacity','1');item.el.style.setProperty('--reveal-y','0px');item.el.style.setProperty('--reveal-clip','0%');item.s.value=1;item.s.target=1;item.seen=true;}
  for(const item of scrubs){item.el.style.transform='';}
  for(const item of ambient){item.el.style.transform='';}if(scan)scan.style.opacity='0';autoLayers=false;syncLayers();
  for(const item of hovers){item.el.style.rotate='';item.el.style.translate='';}
  if(ribbon&&ribbon.firstElementChild)ribbon.firstElementChild.style.setProperty('--ribbon-x','0px');
 }
 media.addEventListener('change',()=>{if(media.matches)resetMotion();else{dirty=true;wake();}});
 window.addEventListener('scroll',()=>{dirty=true;wake();},{passive:true});
 window.addEventListener('resize',()=>{dirty=true;wake();},{passive:true});
 window.addEventListener('load',()=>{dirty=true;wake();},{once:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)window.cancelAnimationFrame(raf);raf=0;last=0;}else{dirty=true;wake();}});
 if(media.matches)resetMotion();else wake();
})();
