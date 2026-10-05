/* Short progressive opening. Native page and controls remain available on any failure. */
(()=>{
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let intro=null,animations=[],failsafe=0;
 function finish(){
  clearTimeout(failsafe);animations.forEach(a=>a.cancel());animations=[];
  if(intro){intro.remove();intro=null;}
  document.body.classList.remove('intro-active');
  document.querySelectorAll('[data-intro-inert]').forEach(el=>{el.inert=false;el.removeAttribute('data-intro-inert');});
  document.dispatchEvent(new Event('brand-intro-finished'));
 }
 async function openIntro(){
  if(media.matches||intro||typeof Element.prototype.animate!=='function')return;
  intro=document.createElement('div');intro.className='brand-intro';intro.setAttribute('role','dialog');intro.setAttribute('aria-modal','true');intro.setAttribute('aria-label','SeoulとJapanが出会う、Bellefeel × 4EVERのオープニング');
  const logo=document.querySelector('.hero-brand').outerHTML;
  intro.innerHTML=`<div class="intro-field" aria-hidden="true"></div><div class="intro-field" aria-hidden="true"></div><div class="intro-stage"><div class="intro-orbit" aria-hidden="true"></div><div class="intro-orbit second" aria-hidden="true"></div><div class="intro-place intro-seoul">Seoul<small>KOREA / 4EVER</small></div><div class="intro-place intro-japan">Japan<small>TOKYO / BELLEFEEL</small></div><div class="intro-brand">${logo}<p>KOREA × JAPAN / TOGETHER IN SHINJUKU</p></div></div><p class="intro-caption">TWO PERSPECTIVES. ONE BEAUTY.</p><button class="intro-skip" type="button">SKIP →</button>`;
  document.body.appendChild(intro);
  for(const el of document.body.children){if(el!==intro&&['HEADER','MAIN','NAV','ASIDE'].includes(el.tagName)&&!el.inert){el.inert=true;el.setAttribute('data-intro-inert','');}}
  document.body.classList.add('intro-active');intro.querySelector('button').addEventListener('click',finish);
  intro.querySelector('button').focus({preventScroll:true});
  failsafe=setTimeout(finish,4800);
  const animate=(el,frames,options)=>{const a=el.animate(frames,{fill:'both',easing:'cubic-bezier(.22,1,.36,1)',...options});animations.push(a);return a;};
  try{
   const distance=Math.min(innerWidth*.21,170);
   animate(intro.querySelector('.intro-seoul'),[{opacity:0,transform:'translateX(-55px)'},{opacity:1,transform:'translateX(0)'},{opacity:1,transform:'translateX(0)',offset:.48},{opacity:0,transform:`translateX(${distance}px) scale(.8)`}],{duration:1550});
   animate(intro.querySelector('.intro-japan'),[{opacity:0,transform:'translateX(55px)'},{opacity:1,transform:'translateX(0)'},{opacity:1,transform:'translateX(0)',offset:.48},{opacity:0,transform:`translateX(${-distance}px) scale(.8)`}],{duration:1550,delay:100});
   intro.querySelectorAll('.intro-orbit').forEach((el,i)=>animate(el,[{opacity:0,transform:`rotate(${i?35:-35}deg) scale(.75)`},{opacity:.75,offset:.4},{opacity:0,transform:`rotate(${i?-15:15}deg) scale(.45)`}],{duration:1950}));
   animate(intro.querySelector('.intro-brand'),[{opacity:0,transform:'translateY(22px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)'}],{delay:1300,duration:650});
   const exit=animate(intro,[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{delay:2600,duration:800});
   await exit.finished;finish();
  }catch{finish();}
 }
 document.addEventListener('keydown',e=>{if(!intro)return;if(e.key==='Escape')finish();if(e.key==='Tab'){e.preventDefault();intro.querySelector('button').focus();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&intro)finish();});media.addEventListener('change',()=>{if(media.matches)finish();});
 // First visit per tab. Footer replay makes the storyboard easy to review.
 try{if(!sessionStorage.getItem('bellefeel-intro-v21')&&!location.hash){sessionStorage.setItem('bellefeel-intro-v21','1');openIntro();}}catch{if(!location.hash)openIntro();}
 const replay=document.createElement('button');replay.className='intro-replay';replay.type='button';replay.textContent='オープニングをもう一度見る';replay.addEventListener('click',openIntro);document.querySelector('footer').appendChild(replay);
 // Placeholder links respond accessibly and leave actual treatment URLs easy to replace.
 const dialog=document.createElement('dialog');dialog.className='treatment-dialog';document.body.appendChild(dialog);
 const names={'face-line':'フェイスライン・たるみ','skin':'毛穴・ニキビ跡・肌質','volume':'ほうれい線・口元・ボリューム'};
 document.querySelectorAll('.beauty-link[data-treatment]').forEach(a=>a.addEventListener('click',e=>{
  if(!a.getAttribute('href').startsWith('#treatment-'))return;e.preventDefault();
  dialog.innerHTML=`<h2>${names[a.dataset.treatment]}</h2><p>施術の詳しいページは準備中です。<br>今のお悩みや治療の選択肢は、Bellefeel新宿院の公式LINEでご相談いただけます。</p><div class="treatment-dialog-actions"><a href="https://s.lmes.jp/landing-qr/2005005664-KqWeMrqA?uLand=kCD6br" target="_blank" rel="noopener">自分に合う治療を相談する ↗</a><button type="button">閉じる</button></div>`;
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.showModal();
 }));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
})();
