'use strict';
// Photos and procedure names are taken from Bellefeel Clinic's official lifting page.
const realCases = [
  {name:'HIFU / ハイフ', before:'case01-01.webp', after:'case01-02.webp'},
  {name:'THREAD LIFT / 糸リフト', before:'case02-01.webp', after:'case02-02.webp'},
  {name:'LIPOSUCTION / 脂肪吸引', before:'case03-01.webp', after:'case03-02.webp'},
  {name:'FACE LIFT / フェイスリフト', before:'case04-01.webp', after:'case04-02.webp'}
];
const realTrack = document.getElementById('real-case-track');
const realCount = document.querySelector('.real-case-count');
const realReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let realCurrent = 0;
let realIntroPlayed = false;
let realAnimation = null;
function syncRealCount() { realCount.textContent = `${String(realCurrent + 1).padStart(2,'0')} / ${String(realCases.length).padStart(2,'0')}`; }
function animateComparison(card) {
  if (realReduced.matches || card.dataset.touched) return;
  cancelAnimationFrame(realAnimation);
  const input = card.querySelector('input');
  const compare = card.querySelector('.real-comparison');
  const start = performance.now();
  const duration = 2500;
  function frame(now) {
    if (card.dataset.touched || card !== realTrack.children[realCurrent]) return;
    const progress = Math.min(1, (now - start) / duration);
    const eased = .5 - .5 * Math.cos(progress * Math.PI);
    const position = Math.round(22 + 36 * eased);
    input.value = String(position);
    compare.style.setProperty('--split', `${position}%`);
    if (progress < 1) realAnimation = requestAnimationFrame(frame);
  }
  realAnimation = requestAnimationFrame(frame);
}
for (const [index, item] of realCases.entries()) {
  const card = document.createElement('article');
  card.className = 'real-case-card';
  card.innerHTML = `<div class="real-case-heading"><span>CASE ${String(index+1).padStart(2,'0')}</span><h3>${item.name}</h3></div><div class="real-comparison" style="--split:50%"><img class="real-before" src="https://bellefeelclinic.com/hl-assets/assets/img/lifting-new/img-${item.before}" alt="${item.name}の施術前" loading="lazy" decoding="async"><img class="real-after" src="https://bellefeelclinic.com/hl-assets/assets/img/lifting-new/img-${item.after}" alt="${item.name}の施術後" loading="lazy" decoding="async"><span class="real-label before">BEFORE</span><span class="real-label after">AFTER</span><span class="real-divider" aria-hidden="true"><i>↔</i></span><input type="range" min="5" max="95" value="50" aria-label="${item.name}の施術前後を比較。左右に動かしてください"></div><p class="real-case-hint">左右にドラッグして比較</p>`;
  const slider = card.querySelector('input');
  const compare = card.querySelector('.real-comparison');
  slider.addEventListener('input', () => { card.dataset.touched = 'true'; cancelAnimationFrame(realAnimation); compare.style.setProperty('--split', `${slider.value}%`); });
  realTrack.appendChild(card);
}
function showRealCase(index, animate = true) {
  realCurrent = (index + realCases.length) % realCases.length;
  realTrack.querySelectorAll('.real-case-card').forEach((card, i) => { card.hidden = i !== realCurrent; });
  syncRealCount();
  if (animate) animateComparison(realTrack.children[realCurrent]);
}
document.querySelector('.real-case-prev').addEventListener('click', () => showRealCase(realCurrent - 1));
document.querySelector('.real-case-next').addEventListener('click', () => showRealCase(realCurrent + 1));
realTrack.addEventListener('keydown', event => {
  if (event.target.matches('input')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();showRealCase(realCurrent + (event.key === 'ArrowRight' ? 1 : -1));}
});
showRealCase(0, false);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (!realIntroPlayed && entries[0].isIntersecting) {
      realIntroPlayed = true;
      animateComparison(realTrack.children[realCurrent]);
      observer.disconnect();
    }
  }, {threshold:.3});
  observer.observe(realTrack);
} else {realIntroPlayed = true;}
