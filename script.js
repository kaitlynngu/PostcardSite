
const TMPLS = [
  "templates/tmpl1.jpg",
  "templates/tmpl2.jpg",
  "templates/tmpl3.jpg",
  "templates/tmpl4.jpg",
  "templates/tmpl5.svg",
];

const TMPL_NAMES = ["Cowboy Pup", "Dachshund Heart", "Sweet Kiss", "Lace Hearts", "Your Photo"];
const TMPL_IS_PHOTO = [false,false,false,false,true];
const stamps = [{'i': '🌸', 'l': 'bloom'}, {'i': '🌊', 'l': 'wave'}, {'i': '🌙', 'l': 'moon'}, {'i': '🕊️', 'l': 'peace'}, {'i': '🌿', 'l': 'herb'}, {'i': '✦', 'l': 'star'}, {'i': '🍂', 'l': 'autumn'}, {'i': '🌹', 'l': 'rose'}];
const inks = [{'c': '#8b1a1a', 'l': 'crimson'}, {'c': '#1a0f04', 'l': 'ink'}, {'c': '#1a2a4a', 'l': 'navy'}, {'c': '#1a3a1a', 'l': 'forest'}, {'c': '#5a3a1a', 'l': 'umber'}];
let selT=0, selS=0, selInk=0, stampImg=null, cardImg=null, face='front';

function mkProg(id,n){
  const el=document.getElementById(id);if(!el)return;el.innerHTML='';
  for(let i=0;i<4;i++){
    const d=document.createElement('div');
    d.className='pp '+(i<n-1?'done':i===n-1?'on':'off');
    el.appendChild(d);
  }
}

(function buildTemplates(){
  const grid=document.getElementById('tmplGrid');
  TMPLS.forEach((src,i)=>{
    const item=document.createElement('div');
    item.className='tmpl-item'+(i===0?' sel':'');
    const prev=document.createElement('div');prev.className='tmpl-preview';
    const img=document.createElement('img');img.className='tmpl-img';img.src=src;
    const chk=document.createElement('div');chk.className='tmpl-check';chk.textContent='✓';
    const lbl=document.createElement('div');lbl.className='tmpl-name';lbl.textContent=TMPL_NAMES[i];
    prev.appendChild(img);prev.appendChild(chk);
    item.appendChild(prev);item.appendChild(lbl);
    // tap = select + go to s3
    item.onclick=()=>{
      selT=i;
      grid.querySelectorAll('.tmpl-item').forEach((x,j)=>x.classList.toggle('sel',j===i));
      document.getElementById('photoUpWrap').style.display=TMPL_IS_PHOTO[i]?'block':'none';
      // update front preview
      const fi=document.getElementById('frontImg');
      if(TMPL_IS_PHOTO[i]&&cardImg)fi.src=cardImg;
      else fi.src=TMPLS[i];
      setTimeout(()=>go(3),120);
    };
    grid.appendChild(item);
  });
})();

(function buildStamps(){
  const row=document.getElementById('stampRow');
  stamps.forEach((s,i)=>{
    const t=document.createElement('div');
    t.className='st'+(i===0?' sel':'');
    t.innerHTML=`<span class="si">${s.i}</span><span class="sl">${s.l}</span>`;
    t.onclick=()=>{
      selS=i;stampImg=null;
      row.querySelectorAll('.st:not(.st-up)').forEach((x,j)=>x.classList.toggle('sel',j===i));
      document.getElementById('upSt').classList.remove('sel');
      rebuildUpSt();refreshCorner();
    };
    row.appendChild(t);
  });
  const up=document.createElement('div');up.className='st st-up';up.id='upSt';
  up.innerHTML=`<span class="si" style="font-size:14px;color:var(--muted)">＋</span><span class="sl">upload</span><input type="file" id="stFile" accept="image/*">`;
  up.onclick=function(){this.querySelector('input').click()};
  row.appendChild(up);bindStFile();
})();

function rebuildUpSt(){
  const ut=document.getElementById('upSt');
  if(stampImg&&ut.classList.contains('sel')){
    ut.innerHTML=`<img src="${stampImg}"><input type="file" id="stFile" accept="image/*">`;
  } else {
    ut.innerHTML=`<span class="si" style="font-size:14px;color:var(--muted)">＋</span><span class="sl">upload</span><input type="file" id="stFile" accept="image/*">`;
  }
  ut.onclick=function(){this.querySelector('input').click()};bindStFile();
}
function bindStFile(){
  const inp=document.getElementById('stFile');if(!inp)return;
  inp.onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();r.onload=ev=>{
      stampImg=ev.target.result;selS=-1;
      document.querySelectorAll('.st:not(.st-up)').forEach(x=>x.classList.remove('sel'));
      document.getElementById('upSt').classList.add('sel');
      rebuildUpSt();refreshCorner();
    };r.readAsDataURL(f);
  };
}

(function buildInks(){
  const row=document.getElementById('inkRow');
  inks.forEach((ink,i)=>{
    const s=document.createElement('div');
    s.className='ink'+(i===0?' sel':'');
    s.style.background=ink.c;s.title=ink.l;
    s.onclick=()=>{
      selInk=i;
      row.querySelectorAll('.ink').forEach((x,j)=>x.classList.toggle('sel',j===i));
    };
    row.appendChild(s);
  });
})();

document.getElementById('imgUp').onclick=function(e){
  if(e.target.id==='imgClr')return;document.getElementById('imgFile').click();
};
document.getElementById('imgFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=ev=>{
    cardImg=ev.target.result;
    const box=document.getElementById('imgUp');
    let im=box.querySelector('img');
    if(!im){im=document.createElement('img');box.insertBefore(im,box.firstChild);}
    im.src=cardImg;document.getElementById('imgClr').style.display='block';
    document.getElementById('frontImg').src=cardImg;
  };r.readAsDataURL(f);
};
document.getElementById('imgClr').onclick=e=>{
  e.stopPropagation();cardImg=null;
  const box=document.getElementById('imgUp');
  const im=box.querySelector('img');if(im)im.remove();
  document.getElementById('imgClr').style.display='none';
  document.getElementById('frontImg').src=TMPLS[selT];
};

function refreshCorner(){
  const c=document.getElementById('stampCorner');c.innerHTML='';
  if(stampImg){
    const im=document.createElement('img');im.src=stampImg;
    im.style.cssText='width:82%;height:82%;object-fit:cover;position:relative;z-index:1';
    c.appendChild(im);
  } else {
    const s=stamps[selS]||stamps[0];
    c.innerHTML=`<span class="bsi" style="font-size:15px;line-height:1;position:relative;z-index:1">${s.i}</span><span class="bsl" style="font-size:5px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;position:relative;z-index:1">${s.l}</span>`;
  }
}

function showFace(f){
  face=f;
  document.getElementById('flipInner').classList.toggle('flipped',f==='back');
  document.getElementById('fTab').classList.toggle('on',f==='front');
  document.getElementById('bTab').classList.toggle('on',f==='back');
}

// double-click on card to flip
(function bindFlipClick(){
  const wrap = document.getElementById('flipWrap');
  if(!wrap) return;
  wrap.addEventListener('dblclick', ()=>{
    showFace(face==='front'?'back':'front');
    // little bounce feedback
    const inner = document.getElementById('flipInner');
    inner.style.transition = 'transform .65s cubic-bezier(.4,0,.2,1)';
  });
  // show pointer cursor so it feels clickable
  wrap.style.cursor = 'pointer';
})();

function renderFinal(){
  const canvas=document.getElementById('finalC');
  const par=canvas.parentElement;
  const DPR=2,GAP=20;
  const W=par.offsetWidth||520;
  const H=Math.round(W/1.58);
  canvas.width=W*DPR;canvas.height=(H*2+GAP)*DPR;
  canvas.style.width=W+'px';canvas.style.height=(H*2+GAP)+'px';
  const ctx=canvas.getContext('2d');ctx.scale(DPR,DPR);
  const ink=inks[selInk];
  const msg=document.getElementById('msgInput').value||'Dear friend,\n\nWishing you well.';
  const from=document.getElementById('fromInput').value||'';
  const to=document.getElementById('toInput').value||'';
  const city=document.getElementById('cityInput').value||'';
  const pad=Math.round(W*.055);

  function grain(ox,oy,w,h,a,n){
    for(let i=0;i<n;i++){ctx.fillStyle=`rgba(100,65,15,${Math.random()*a})`;ctx.fillRect(ox+Math.random()*w,oy+Math.random()*h,1,1)}
  }
  function stripe(y,c){
    ctx.strokeStyle=c;ctx.lineWidth=2;ctx.setLineDash([]);
    for(let x=0;x<W;x+=16){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+8,y);ctx.stroke()}
  }
  function wrapText(text,x,y,maxW,lh){
    let cy=y;
    text.split('\n').forEach(para=>{
      if(!para.trim()){cy+=lh*.6;return}
      const words=para.split(' ');let line='';
      words.forEach(w=>{
        const test=line+w+' ';
        if(ctx.measureText(test).width>maxW&&line){ctx.fillText(line.trim(),x,cy);cy+=lh;line=w+' ';}
        else line=test;
      });
      if(line.trim())ctx.fillText(line.trim(),x,cy);cy+=lh;
    });
    return cy;
  }

  // draw front
  function drawFront(done){
    const src=(TMPL_IS_PHOTO[selT]&&cardImg)?cardImg:TMPLS[selT];
    const im=new Image();
    im.onload=()=>{
      const sc=Math.max(W/im.width,H/im.height);
      const sw=im.width*sc,sh=im.height*sc;
      ctx.drawImage(im,(W-sw)/2,(H-sh)/2,sw,sh);
      done();
    };
    im.src=src;
  }

  function drawBack(yO){
    ctx.fillStyle='#faf5e8';ctx.fillRect(0,yO,W,H);
    grain(0,yO,W,H,.018,600);
    stripe(yO+1,ink.c);
    // outer border
    ctx.strokeStyle=ink.c;ctx.lineWidth=.7;ctx.strokeRect(8,yO+8,W-16,H-16);
    // top label
    ctx.font=`${W*.016}px "Special Elite",cursive`;ctx.fillStyle=ink.c;ctx.textAlign='center';
    ctx.fillText('P O S T   C A R D',W/2,yO+H*.09);
    // divider
    const dX=W*.5;
    ctx.strokeStyle=ink.c;ctx.lineWidth=.8;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(dX,yO+H*.055);ctx.lineTo(dX,yO+H*.925);ctx.stroke();
    ctx.setLineDash([]);
    // left
    ctx.font=`${W*.023}px "Special Elite",cursive`;ctx.fillStyle=ink.c;ctx.textAlign='left';
    (function(){
      const lh=W*.031;
      // measure all wrapped lines first
      const allLines=[];
      msg.split('\n').forEach(para=>{
        if(!para.trim()){allLines.push('');return;}
        const words=para.split(' ');let line='';
        words.forEach(w=>{
          const test=line+w+' ';
          if(ctx.measureText(test).width>dX-pad*1.8&&line){allLines.push(line.trim());line=w+' ';}
          else line=test;
        });
        allLines.push(line.trim());
      });
      // vertically center within writing area
      const areaTop=yO+H*.12;
      const areaBot=yO+H*.84;
      const totalH=allLines.length*lh;
      const startY=areaTop+Math.max(0,(areaBot-areaTop-totalH)/2)+lh*.8;
      let cy=startY;
      msg.split('\n').forEach(para=>{
        if(!para.trim()){cy+=lh*.6;return;}
        const words=para.split(' ');let line='';
        words.forEach(w=>{
          const test=line+w+' ';
          if(ctx.measureText(test).width>dX-pad*1.8&&line){ctx.fillText(line.trim(),pad,cy);cy+=lh;line=w+' ';}
          else line=test;
        });
        if(line.trim())ctx.fillText(line.trim(),pad,cy);cy+=lh;
      });
    })();
    if(from){
      ctx.font=`italic ${W*.021}px Georgia,serif`;ctx.fillStyle=ink.c;
      ctx.fillText('— '+from,pad,yO+H*.87);
    }
    // right
    const rX=dX+pad*.55,rW=W-dX-pad*1.1;
    const sz=W*.1,sX=W-pad*.65-sz,sY=yO+H*.08;
    ctx.fillStyle='#fff';ctx.strokeStyle=ink.c;ctx.lineWidth=1;ctx.setLineDash([]);
    ctx.fillRect(sX,sY,sz,sz*1.22);ctx.strokeRect(sX,sY,sz,sz*1.22);
    ctx.setLineDash([2,2]);ctx.strokeRect(sX+3,sY+3,sz-6,sz*1.22-6);ctx.setLineDash([]);
    function finishBack(){
      ctx.font=`italic ${W*.028}px Georgia,serif`;ctx.fillStyle=ink.c;ctx.textAlign='left';
      ctx.fillText('To:',rX,yO+H*.43);
      const lsY=yO+H*.5,lsp=H*.11;
      ctx.strokeStyle=ink.c;ctx.lineWidth=.8;
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(rX,lsY+i*lsp);ctx.lineTo(rX+rW,lsY+i*lsp);ctx.stroke()}
      if(to){ctx.font=`${W*.022}px "Special Elite",cursive`;ctx.fillStyle=ink.c;ctx.textAlign='left';ctx.fillText(to,rX,lsY-4)}
      if(city){ctx.font=`${W*.018}px "Special Elite",cursive`;ctx.fillStyle='#8a6a3a';ctx.fillText(city,rX,lsY+lsp-4)}
      const pmX=W-pad*.85-24,pmY=yO+H*.3;
      ctx.strokeStyle=ink.c;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(pmX,pmY,23,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(pmX,pmY,18,0,Math.PI*2);ctx.stroke();
      ctx.font=`${W*.013}px "Special Elite",cursive`;ctx.fillStyle=ink.c;ctx.textAlign='center';
      ctx.fillText('SENT WITH',pmX,pmY-3);ctx.fillText('JOY & LOVE',pmX,pmY+10);
      ctx.font=`${W*.012}px "Special Elite",cursive`;ctx.fillStyle='#a07828';ctx.textAlign='left';
      ctx.fillText('THIS SIDE FOR ADDRESS ONLY',rX,yO+H*.94);
      ctx.textAlign='right';ctx.fillStyle=ink.c;ctx.fillText('✦ ✦ ✦',W-pad*.6,yO+H*.94);
      // gap
      ctx.fillStyle='#e8dfc8';ctx.fillRect(0,H,W,GAP);
      document.getElementById('ptxt').style.display='none';
      document.getElementById('psub').style.display='none';
      document.getElementById('resWrap').style.display='block';
      const dr=document.getElementById('dlRow');dr.style.display='flex';
      setupShareDownload();
    }
    if(stampImg){
      const si=new Image();si.onload=()=>{
        ctx.save();ctx.beginPath();ctx.rect(sX+4,sY+4,sz-8,sz*1.22-8);ctx.clip();
        ctx.drawImage(si,sX+4,sY+4,sz-8,sz*1.22-8);ctx.restore();finishBack();
      };si.src=stampImg;
    } else {
      const s=stamps[selS]||stamps[0];
      ctx.font=`${sz*.55}px serif`;ctx.textAlign='center';ctx.fillStyle=ink.c;
      ctx.fillText(s.i,sX+sz/2,sY+sz*.78);
      ctx.font=`${W*.013}px "Special Elite",cursive`;ctx.fillStyle='#8a6a3a';
      ctx.fillText(s.l.toUpperCase(),sX+sz/2,sY+sz*1.1+2);
      finishBack();
    }
  }

  drawFront(()=>drawBack(H+GAP));
}

function go(n, addHistory){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('s'+n).classList.add('active');
  if(n===2) mkProg('p2',1);
  if(n===3){
    mkProg('p3',2);
    refreshCorner();
    document.getElementById('photoUpWrap').style.display=TMPL_IS_PHOTO[selT]?'block':'none';
    const fi=document.getElementById('frontImg');
    if(TMPL_IS_PHOTO[selT]&&cardImg) fi.src=cardImg;
    else fi.src=TMPLS[selT];
    setTimeout(()=>showFace('back'),80);
    setTimeout(centerTextarea, 160);
  }
  if(n===4){
    mkProg('p4',3);
    document.getElementById('ptxt').style.display='block';
    document.getElementById('psub').style.display='block';
    document.getElementById('resWrap').style.display='none';
    document.getElementById('dlRow').style.display='none';
    setTimeout(renderFinal,800);
  }
  if(addHistory !== false){
    history.pushState({screen:n}, '', '#s'+n);
  }
  window.scrollTo(0,0);
}

window.addEventListener('popstate', function(e){
  var n = (e.state && e.state.screen) ? e.state.screen : 1;
  go(n, false);
});

window.addEventListener('DOMContentLoaded', function(){
  history.replaceState({screen:1}, '', '#s1');
});

function getCanvasBlob(canvas){
  return new Promise(function(resolve){
    canvas.toBlob(function(blob){ resolve(blob); }, 'image/png');
  });
}

function setupShareDownload(){
  const canvas = document.getElementById('finalC');
  const shareBtn = document.getElementById('shareBtn');
  const dlBtn = document.getElementById('dlBtn');
  if(!shareBtn || !dlBtn || !canvas) return;

  if(navigator.share){
    shareBtn.style.display = 'block';
    shareBtn.textContent = '↑ share postcard';
    dlBtn.textContent = '↓ download instead';
    dlBtn.style.background = 'transparent';
    dlBtn.style.color = 'var(--dark)';
    dlBtn.style.border = '1.5px solid #c0a870';
    dlBtn.style.boxShadow = 'none';

    shareBtn.onclick = async () => {
      try {
        const blob = await getCanvasBlob(canvas);
        const file = new File([blob], 'postcard.png', {type:'image/png'});
        if(navigator.canShare && navigator.canShare({files:[file]})){
          await navigator.share({files:[file], title:'A postcard for you', text:'Sent with love ✦'});
        } else {
          await navigator.share({title:'A postcard for you', text:'I made you a postcard ✦', url:window.location.href});
        }
      } catch(e){
        if(e.name !== 'AbortError') console.warn('Share failed:', e);
      }
    };
  }
}








// ── Vertically center textarea text ──
function centerTextarea(){
  const ta = document.getElementById('msgInput');
  if(!ta) return;
  ta.style.paddingTop = '0';
  const sh = ta.scrollHeight;
  const ch = ta.clientHeight;
  if(sh < ch){
    ta.style.paddingTop = Math.floor((ch - sh) / 2) + 'px';
  }
}
(function(){
  const ta = document.getElementById('msgInput');
  if(!ta) return;
  ta.addEventListener('input', centerTextarea);
  ta.addEventListener('focus', centerTextarea);
  ta.addEventListener('blur', centerTextarea);
})();

document.getElementById('enterBtn').onclick = () => go(2);

document.getElementById('dlBtn').onclick = () => {
  const c = document.getElementById('finalC');
  const a = document.createElement('a');
  a.download = 'postcard.png';
  a.href = c.toDataURL('image/png');
  a.click();
};
