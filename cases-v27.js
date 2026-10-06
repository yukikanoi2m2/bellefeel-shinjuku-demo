'use strict';
// 公式サイトの比較画像をそのまま表示します。A-Cセット全体の結果ではありません。
const caseBase='https://bellefeelclinic.com/wp/wp-content/uploads/2026/04/';
const realCases=[
  {name:'糸リフト｜ヴィーナスリフト 10本',tags:['A','B'],image:'IMG_6175-1024x1020.jpg',slug:'糸リフト【ヴィーナスリフト】-2',type:'糸リフト'},
  {name:'ヒアルロン酸｜頬・貴族部位',tags:['A','C'],image:'IMG_3583-1024x1014.jpg',slug:'ヒアルロン酸-注入【カスタマイズヒアル】',type:'ヒアルロン酸'},
  {name:'ヒアルロン酸｜頬・顎',tags:['A'],image:'124c0669b0e9137348720d8eb9aea256-1024x1020.jpg',slug:'ヒアルロン酸-注入【カスタマイズ】-6',type:'ヒアルロン酸'},
  {name:'ヒアルロン酸｜ほうれい線',tags:['C'],image:'IMG_2995-1024x1022.jpg',slug:'ヒアルロン酸-注入【法令線】',type:'ヒアルロン酸'},
  {name:'ヒアルロン酸｜チーク・鼻翼基部・顎',tags:['A','C'],image:'e13234510cf1cc671fac126b92ba15bb-1024x1022.jpg',slug:'ヒアルロン酸-注入【カスタマイズ】-5',type:'ヒアルロン酸'},
  {name:'糸リフト｜ヴィーナスリフト 10本',tags:['A','B'],image:'7d0a61e08aa6f1d2751c15c689498eb6-1024x1021.jpg',slug:'糸リフト【ヴィーナスリフト】',type:'糸リフト'},
  {name:'ヒアルロン酸｜顎',tags:['A'],image:'4b6f8d9a7cb1635018d7ce802851d63b-1024x1020.jpg',slug:'ヒアルロン酸-注入【顎】-2',type:'ヒアルロン酸'},
  {name:'ヒアルロン酸｜口唇',tags:['C'],image:'dc6310b33061ee88cbb144bbe7b05dd7-1024x1019.jpg',slug:'ヒアルロン酸-注入【口唇】-2',type:'ヒアルロン酸'},
  {name:'ヒアルロン酸｜チーク・貴族部位・顎',tags:['A','C'],image:'IMG_5550-1024x1022.jpg',slug:'ヒアルロン酸-注入【カスタマイズ】-4',type:'ヒアルロン酸'}
];
const realTrack=document.getElementById('real-case-track');
const realCount=document.querySelector('.real-case-count');
const realFilters=document.querySelector('.real-case-filters');
const realThumbs=document.querySelector('.real-case-thumbs');
const realFilterNote=document.querySelector('.real-case-filter-note');
const realReduced=matchMedia('(prefers-reduced-motion: reduce)');
let realVisible=realCases.map((_,i)=>i),realPosition=0;
const sourceLink=item=>`https://bellefeelclinic.com/case/${encodeURIComponent(item.slug)}/`;
function renderRealCase(){
  const index=realVisible[realPosition],item=realCases[index],src=caseBase+item.image;
  realTrack.innerHTML=`<article class="real-case-card" data-case="${index}"><div class="real-case-heading"><span>CASE ${String(index+1).padStart(2,'0')} / 新宿院</span><h3>${item.name}</h3></div><figure class="real-case-photo"><img src="${src}" alt="${item.name}の公式症例比較写真。左が施術前、右が施術後" decoding="async"><figcaption>公式掲載の比較写真 / 施術前・施術後</figcaption></figure><div class="real-case-meta"><span>${item.type} / 担当：中務 秀一</span><a href="${sourceLink(item)}" target="_blank" rel="noopener">施術内容・費用・リスク ↗</a></div></article>`;
  realCount.textContent=`${String(realPosition+1).padStart(2,'0')} / ${String(realVisible.length).padStart(2,'0')}`;
  realThumbs.innerHTML=realVisible.map((n,j)=>`<button type="button" class="real-case-thumb ${j===realPosition?'is-active':''}" aria-label="症例${j+1}：${realCases[n].name}" aria-current="${j===realPosition?'true':'false'}" data-position="${j}"><img src="${caseBase+realCases[n].image}" alt="" loading="lazy" decoding="async"><small>${String(j+1).padStart(2,'0')}</small></button>`).join('');
  realThumbs.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{realPosition=Number(button.dataset.position);renderRealCase();}));
  realThumbs.scrollTo({left:Math.max(0,realPosition*76-100),behavior:realReduced.matches?'instant':'smooth'});
}
function setRealCategory(category){
  realVisible=realCases.map((item,i)=>category==='all'||item.tags.includes(category)?i:-1).filter(i=>i>=0);realPosition=0;
  realFilters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
  realFilterNote.textContent=category==='B'?'Bに含まれる糸リフトの関連症例を掲載。ポテンツァおよびBセット全体の実症例は準備中です。':category==='C'?'口元・輪郭に関する関連症例です。貴族リフト／ハイフまたはCセット全体の結果ではありません。':'掲載写真は新宿院・中務医師の関連施術例です。A〜Cセットそのものの結果ではありません。';
  renderRealCase();
}
realFilters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>setRealCategory(button.dataset.category)));
document.querySelector('.real-case-prev').addEventListener('click',()=>{realPosition=(realPosition-1+realVisible.length)%realVisible.length;renderRealCase();});
document.querySelector('.real-case-next').addEventListener('click',()=>{realPosition=(realPosition+1)%realVisible.length;renderRealCase();});
setRealCategory('all');
