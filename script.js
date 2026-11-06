const cv=document.getElementById("scope"),cx=cv.getContext("2d"),sp=document.getElementById("spec"),sx=sp.getContext("2d");
const CAP={square:"A square wave uses only odd harmonics, each circle a third, a fifth, a seventh as big. The overshoot near each corner is the Gibbs phenomenon, and it never fully goes away.",
saw:"A sawtooth uses every harmonic, with amplitudes 1, 1/2, 1/3 and so on. It needs many circles to get a clean ramp.",
tri:"A triangle wave’s amplitudes fall off as 1/n², so a handful of circles already looks almost perfect."};
const WV={square:n=>n%2?4/(Math.PI*n):0,saw:n=>(n%2?1:-1)*2/(Math.PI*n),tri:n=>n%2?8/(Math.PI*Math.PI*n*n)*(((n-1)/2)%2?-1:1):0};
let S={w:"square",N:5,speed:1,play:true,circles:true,t:0},W,H,SW,SH,dpr,ys=[],R,x0,tx,cy,css;
const $=id=>document.getElementById(id);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduce)S.play=false;
function terms(N){const a=[];for(let n=1;a.length<N&&n<500;n++){const c=WV[S.w](n);if(c)a.push({n,a:c})}return a}
function size(){dpr=devicePixelRatio||1;[cv,sp].forEach(c=>{const r=c.getBoundingClientRect();c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr)});
  W=cv.width/dpr;H=cv.height/dpr;SW=sp.width/dpr;SH=sp.height/dpr;
  R=Math.min(H*.24,W*.11);x0=Math.max(R*1.45,W*.17);tx=x0+R*1.6+20;cy=H/2;ys=[];prefill()}
function sample(t,list){let y=0;list.forEach(k=>y+=k.a*Math.sin(k.n*t));return y}
function prefill(){const L=terms(S.N),cap=Math.max(10,Math.floor((W-tx-10)/2));ys=[];for(let i=0;i<cap;i++)ys.push(sample(S.t-i*.035*S.speed,L))}
function draw(){
  css=getComputedStyle(document.documentElement);const c1=css.getPropertyValue("--c1").trim(),c2=css.getPropertyValue("--c2").trim(),gr=css.getPropertyValue("--grid").trim(),dm=css.getPropertyValue("--dim").trim();
  cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
  cx.strokeStyle=gr;cx.lineWidth=1;cx.beginPath();for(let x=0;x<W;x+=40){cx.moveTo(x,0);cx.lineTo(x,H)}for(let y=cy%40;y<H;y+=40){cx.moveTo(0,y);cx.lineTo(W,y)}cx.stroke();
  cx.strokeStyle=dm;cx.globalAlpha=.4;cx.beginPath();cx.moveTo(tx,cy);cx.lineTo(W,cy);cx.stroke();cx.globalAlpha=1;
  const L=terms(S.N);let x=x0,y=cy;
  L.forEach(k=>{const r=Math.abs(k.a)*R,ang=k.n*S.t,nx=x+k.a*R*Math.cos(ang),ny=y-k.a*R*Math.sin(ang);
    if(S.circles&&r>1.2){cx.strokeStyle=c1;cx.globalAlpha=.35;cx.lineWidth=1.2;cx.beginPath();cx.arc(x,y,r,0,7);cx.stroke();
      cx.globalAlpha=.9;cx.beginPath();cx.moveTo(x,y);cx.lineTo(nx,ny);cx.stroke();cx.globalAlpha=1}
    x=nx;y=ny});
  cx.save();cx.shadowColor=c2;cx.shadowBlur=14;cx.strokeStyle=c2;cx.lineWidth=2.5;cx.lineJoin="round";
  cx.setLineDash([4,5]);cx.globalAlpha=.7;cx.beginPath();cx.moveTo(x,y);cx.lineTo(tx,y);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1;
  cx.beginPath();cx.moveTo(tx,cy-ys[0]*R);ys.forEach((v,i)=>cx.lineTo(tx+i*2,cy-v*R));cx.stroke();
  cx.fillStyle=c2;cx.beginPath();cx.arc(x,y,4.5,0,7);cx.fill();cx.restore();
  // spectrum
  sx.setTransform(dpr,0,0,dpr,0,0);sx.clearRect(0,0,SW,SH);
  const all=terms(24),bw=SW/24,mx=Math.max(...all.map(k=>Math.abs(k.a)));sx.font="10px 'Space Grotesk',sans-serif";sx.textAlign="center";
  all.forEach((k,i)=>{const h=Math.abs(k.a)/mx*(SH-30);sx.globalAlpha=i<S.N?1:.25;sx.fillStyle=c1;sx.fillRect(i*bw+3,SH-18-h,bw-6,h);
    sx.globalAlpha=1;sx.fillStyle=dm;sx.fillText(k.n,i*bw+bw/2,SH-5)});
  $("info").innerHTML=`<b>${S.N}</b> circle${S.N>1?"s":""}`+(S.N===1?" · just a sine wave":"");
}
function tick(){if(S.play){S.t+=.035*S.speed;ys.unshift(sample(S.t,terms(S.N)));const cap=Math.max(10,Math.floor((W-tx-10)/2));if(ys.length>cap)ys.length=cap}draw();requestAnimationFrame(tick)}
function refresh(){prefill();setWave();$("cap").textContent=CAP[S.w];$("nv").textContent=S.N;$("n").value=S.N}
$("waves").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.w=b.dataset.w;[...$("waves").children].forEach(x=>x.setAttribute("aria-pressed",x===b));refresh()});
$("n").oninput=e=>{S.N=+e.target.value;refresh()};
let au=null;
function setWave(){if(!au)return;const L=terms(S.N),real=new Float32Array(L[L.length-1].n+1),imag=new Float32Array(real.length);
  L.forEach(k=>imag[k.n]=k.a);au.o.setPeriodicWave(au.ctx.createPeriodicWave(real,imag))}
$("snd").onclick=()=>{
  if(!au){const ctx=new(window.AudioContext||window.webkitAudioContext)(),g=ctx.createGain(),o=ctx.createOscillator();
    g.gain.value=0;o.frequency.value=196;o.connect(g);g.connect(ctx.destination);o.start();au={ctx,g,o,on:false}}
  au.on=!au.on;au.ctx.resume();au.g.gain.setTargetAtTime(au.on?.12:0,au.ctx.currentTime,.05);
  $("snd").textContent=au.on?"Sound off":"Sound on";$("snd").setAttribute("aria-pressed",au.on);setWave()};
$("sp").oninput=e=>{S.speed=+e.target.value};
$("play").onclick=()=>{S.play=!S.play;$("play").textContent=S.play?"Pause":"Play"};
$("circ").onclick=()=>{S.circles=!S.circles;$("circ").textContent=S.circles?"Hide circles":"Show circles";$("circ").setAttribute("aria-pressed",S.circles)};
sp.addEventListener("pointerdown",e=>{const r=sp.getBoundingClientRect();S.N=Math.min(24,Math.max(1,Math.ceil((e.clientX-r.left)/(r.width/24))));refresh()});
addEventListener("resize",size);
if(reduce)$("play").textContent="Play";
size();refresh();tick();
