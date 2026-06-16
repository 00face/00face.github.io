(function(){
  const root=document.querySelector("[data-cylinder]");
  if(!root)return;
  const stage=root.querySelector("[data-stage]");
  const track=root.querySelector("[data-track]");
  const panels=Array.from(root.querySelectorAll(".cyl-panel"));
  const prevBtn=root.querySelector("[data-prev]");
  const nextBtn=root.querySelector("[data-next]");
  const dotsWrap=root.querySelector("[data-dots]");
  const textBtn=document.getElementById("text-size-btn");
  const contrastBtn=document.getElementById("contrast-btn");
  if(!stage||!track||!panels.length)return;
  document.body.classList.add("cylinder-ready");
  let current=0,theta=360/panels.length,radius=520,animating=false,startX=null,startY=null;
  const clamp=i=>i<0?panels.length-1:i>=panels.length?0:i;
  function canScroll(el,dir){if(!el)return false;return dir>0?el.scrollTop+el.clientHeight<el.scrollHeight-2:el.scrollTop>2}
  function buildDots(){if(!dotsWrap)return;dotsWrap.innerHTML="";panels.forEach((panel,i)=>{const b=document.createElement("button");b.className="dot";b.type="button";b.setAttribute("aria-label","Open section "+(i+1));b.addEventListener("click",()=>goTo(i));dotsWrap.appendChild(b)})}
  function updateDots(){if(!dotsWrap)return;Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle("is-active",i===current))}
  function readHash(){const id=window.location.hash.replace("#","");if(!id)return 0;const idx=panels.findIndex(p=>p.id===id);return idx>=0?idx:0}
  function measure(){
    theta=360/panels.length;
    const rect=panels[0].getBoundingClientRect();
    const fallback=window.innerHeight*(window.innerWidth<720?.56:.66);
    const panelHeight=Math.max(280,rect.height||fallback);
    const raw=panelHeight/(2*Math.tan(Math.PI/panels.length));
    let min=430;
    if(window.innerWidth<520)min=255;else if(window.innerWidth<820)min=315;else if(window.innerWidth<1200)min=380;else if(window.innerWidth>2200)min=760;else if(window.innerWidth>1600)min=620;
    radius=Math.max(min,Math.round(raw+92));
    layout();
  }
  function layout(){
    panels.forEach((panel,i)=>{
      const angle=theta*i;
      panel.style.transform=`translate(-50%, -50%) rotateX(${angle}deg) translateZ(${radius}px)`;
      panel.classList.toggle("is-active",i===current);
      panel.setAttribute("aria-hidden",i===current?"false":"true");
      panel.tabIndex=i===current?0:-1;
      if(i!==current)panel.scrollTop=0;
    });
    track.style.transform=`translateZ(${-radius}px) rotateX(${-theta*current}deg)`;
    updateDots();
    const active=panels[current];
    if(active&&active.id)history.replaceState(null,"",`#${active.id}`);
  }
  function goTo(i){if(animating)return;current=clamp(i);animating=true;layout();setTimeout(()=>{animating=false},760)}
  function next(){goTo(current+1)} function prev(){goTo(current-1)}
  stage.addEventListener("wheel",(e)=>{const active=panels[current],delta=e.deltaY||e.detail||e.wheelDelta;if((delta>0&&canScroll(active,1))||(delta<0&&canScroll(active,-1)))return;e.preventDefault();delta>0?next():prev()},{passive:false});
  stage.addEventListener("touchstart",(e)=>{if(!e.touches||e.touches.length!==1)return;startX=e.touches[0].clientX;startY=e.touches[0].clientY});
  stage.addEventListener("touchend",(e)=>{if(startX===null||startY===null)return;const endX=e.changedTouches[0].clientX,endY=e.changedTouches[0].clientY,dx=endX-startX,dy=endY-startY,active=panels[current];if(Math.abs(dy)>48&&Math.abs(dy)>=Math.abs(dx)){if(dy<0&&!canScroll(active,1))next();if(dy>0&&!canScroll(active,-1))prev()}else if(Math.abs(dx)>56){dx<0?next():prev()}startX=null;startY=null});
  window.addEventListener("keydown",(e)=>{const active=panels[current];if(e.key==="ArrowDown"||e.key==="PageDown"||e.key===" "){if(!canScroll(active,1)){next();e.preventDefault()}}else if(e.key==="ArrowUp"||e.key==="PageUp"){if(!canScroll(active,-1)){prev();e.preventDefault()}}else if(e.key==="ArrowRight"){next();e.preventDefault()}else if(e.key==="ArrowLeft"){prev();e.preventDefault()}});
  if(prevBtn)prevBtn.addEventListener("click",prev);
  if(nextBtn)nextBtn.addEventListener("click",next);
  if(textBtn)textBtn.addEventListener("click",()=>document.body.classList.toggle("large-text"));
  if(contrastBtn)contrastBtn.addEventListener("click",()=>document.body.classList.toggle("high-contrast"));
  window.addEventListener("resize",measure);
  buildDots();current=readHash();measure();
})();
