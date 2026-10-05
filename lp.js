'use strict';
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');
const overlay = document.querySelector('.overlay');
function closeMenu() { menuButton.classList.remove('active'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','メニューを開く'); navigation.classList.remove('open'); navigation.inert=true; overlay.hidden=true; document.body.classList.remove('menu-open'); }
menuButton.addEventListener('click', () => {
 if(menuButton.classList.contains('active')) { closeMenu(); return; }
 menuButton.classList.add('active');menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','メニューを閉じる'); navigation.classList.add('open');navigation.inert=false;overlay.hidden=false;document.body.classList.add('menu-open');
});
overlay.addEventListener('click',closeMenu);
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&menuButton.classList.contains('active')){closeMenu();menuButton.focus();}
 if(e.key==='Tab'&&menuButton.classList.contains('active')){
  const focusables=[menuButton,...navigation.querySelectorAll('a')];
  const first=focusables[0],last=focusables[focusables.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
const titles={A:'STRUCTURE / 輪郭のバランス',B:'SKIN / 肌の印象',C:'BEAUTY DESIGN / 立体感'};
const cases=Array.from({length:6},(_,i)=>({set:['A','B','C'][i%3],name:titles[['A','B','C'][i%3]],image:'ai-case-'+(i+1)+'.png'}));
const list=document.getElementById('case-list');
for(const [index,item] of cases.entries()){
 const card=document.createElement('article');card.className='case-card concept-card';card.dataset.set=item.set;
 card.innerHTML=`<figure class="concept-photo"><img src="${item.image}" alt="架空の女性の美容コンセプト。患者様の症例や治療前後を示す写真ではありません" loading="lazy" decoding="async" draggable="false"><span>BEAUTY DESIGN ${String(index+1).padStart(2,'0')}</span></figure><div class="case-caption"><span>${String(index+1).padStart(2,'0')}</span><div><h3>${item.name}</h3><small>AI CONCEPT / 施術効果を示すものではありません</small></div></div>`;
 list.appendChild(card);
}
const dots=document.querySelector('.carousel-dots'),count=document.querySelector('.carousel-count');
let current=0;
const visibleCards=()=>[...list.querySelectorAll('.case-card')].filter(c=>!c.hidden);
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function renderPosition(){const visible=visibleCards();count.textContent=`${String(current+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;dots.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-current',i===current?'true':'false');});}
function goTo(index){const visible=visibleCards();if(!visible.length)return;current=(index+visible.length)%visible.length;const card=visible[current];list.scrollTo({left:card.offsetLeft-visible[0].offsetLeft,behavior:reduced()?'instant':'smooth'});renderPosition();}
function resetCarousel(){current=0;dots.replaceChildren();visibleCards().forEach((card,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`${i+1}枚目の写真を見る`);b.addEventListener('click',()=>goTo(i));dots.appendChild(b);});list.scrollTo({left:0,behavior:'instant'});renderPosition();}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});list.querySelectorAll('.case-card').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.set!==button.dataset.filter);resetCarousel();}));
document.querySelector('.carousel-prev').addEventListener('click',()=>goTo(current-1));document.querySelector('.carousel-next').addEventListener('click',()=>goTo(current+1));
list.addEventListener('keydown',e=>{if(e.target!==list)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();goTo(current+(e.key==='ArrowRight'?1:-1));}});
list.addEventListener('scroll',()=>{const visible=visibleCards();const edge=list.getBoundingClientRect().left;let closest=0,distance=Infinity;visible.forEach((card,i)=>{const d=Math.abs(card.getBoundingClientRect().left-edge);if(d<distance){distance=d;closest=i;}});current=closest;renderPosition();},{passive:true});
resetCarousel();
const carousel=document.querySelector('.case-carousel');
const autoplayButton=document.querySelector('.carousel-autoplay');
let autoplay=!reduced(),inView=!('IntersectionObserver' in window),hovering=false,focused=false,pointerActive=false;
let lastAdvance=Date.now(),resumeAfter=0;
function delayAutoplay(){resumeAfter=Date.now()+10000;}
function syncAutoplayButton(){autoplayButton.textContent=autoplay?'Ⅱ 自動再生を停止':'▷ 自動再生を開始';autoplayButton.setAttribute('aria-label',autoplay?'ビジュアルの自動再生を一時停止':'ビジュアルの自動再生を開始');autoplayButton.setAttribute('aria-pressed',String(!autoplay));count.setAttribute('aria-live',autoplay?'off':'polite');}
autoplayButton.addEventListener('click',()=>{autoplay=!autoplay;lastAdvance=Date.now();syncAutoplayButton();});
carousel.addEventListener('mouseenter',()=>{hovering=true;});
carousel.addEventListener('mouseleave',()=>{hovering=false;delayAutoplay();});
carousel.addEventListener('focusin',e=>{focused=e.target!==autoplayButton;});
carousel.addEventListener('focusout',e=>{focused=!!e.relatedTarget&&e.relatedTarget!==autoplayButton&&carousel.contains(e.relatedTarget);delayAutoplay();});
carousel.addEventListener('pointerdown',()=>{pointerActive=true;delayAutoplay();});
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,()=>{if(pointerActive){pointerActive=false;delayAutoplay();}});
for(const type of ['input','click','keydown','wheel'])carousel.addEventListener(type,delayAutoplay,{passive:true});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',delayAutoplay));
// Touch scrolling can continue after pointerup; restart the reading time on each scroll.
list.addEventListener('scroll',()=>{lastAdvance=Date.now();},{passive:true});
document.addEventListener('visibilitychange',()=>{lastAdvance=Date.now();});
if('IntersectionObserver' in window){const viewObserver=new window.IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)lastAdvance=Date.now();},{threshold:.25});viewObserver.observe(carousel);}
window.setInterval(()=>{const now=Date.now();if(!autoplay||!inView||hovering||focused||pointerActive||document.hidden||visibleCards().length<2||now<resumeAfter||now-lastAdvance<6000)return;goTo(current+1);lastAdvance=now;},1000);
syncAutoplayButton();
// Scroll reveal is provided by the spring motion controller.
