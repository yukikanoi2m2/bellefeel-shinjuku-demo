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
// Case comparison is handled by cases-v27.js.
