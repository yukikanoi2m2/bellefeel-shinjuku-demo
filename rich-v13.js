(()=>{
 const portrait=document.querySelector('.three-d-portrait');
 if(!portrait)return;
 const buttons=[...portrait.querySelectorAll('[data-layer]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  portrait.dataset.activeLayer=button.dataset.layer;
  buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 }));
})();
