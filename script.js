/* AASHU BIRTHDAY UNIVERSE — V4
   No external JS libraries. Everything works from a static Render site.
*/
(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // ---------- Loader ----------
  function releaseLoader() {
    document.documentElement.classList.add("loaded");
    const el = $("#loader");
    if (el) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
    }
  }
  document.addEventListener("DOMContentLoaded", () => setTimeout(releaseLoader, 250));
  window.addEventListener("load", () => setTimeout(releaseLoader, 350));
  setTimeout(releaseLoader, 1800);

  // ---------- Stars ----------
  const starCanvas = $("#stars");
  const starCtx = starCanvas.getContext("2d");
  let sw = 0, sh = 0, stars = [];
  function resizeStars() {
    sw = innerWidth; sh = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    starCanvas.width = sw * dpr;
    starCanvas.height = sh * dpr;
    starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({length: Math.min(260, Math.max(100, Math.floor(sw / 4)))}, () => ({
      x: Math.random() * sw, y: Math.random() * sh,
      r: Math.random() * 1.4 + .15, v: Math.random() * .24 + .03,
      p: Math.random() * Math.PI * 2
    }));
  }
  resizeStars();
  addEventListener("resize", resizeStars);
  function animateStars() {
    starCtx.clearRect(0, 0, sw, sh);
    for (const q of stars) {
      q.y -= q.v; q.p += .01;
      if (q.y < -3) q.y = sh + 3;
      starCtx.globalAlpha = .12 + .5 * (.5 + .5 * Math.sin(q.p));
      starCtx.fillStyle = "#fff";
      starCtx.beginPath(); starCtx.arc(q.x, q.y, q.r, 0, Math.PI * 2); starCtx.fill();
    }
    requestAnimationFrame(animateStars);
  }
  animateStars();

  // ---------- Cursor ----------
  const cursor = $("#cursor");
  addEventListener("pointermove", e => {
    if (cursor) { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; }
  });

  // ---------- Navigation ----------
  $("#enter")?.addEventListener("click", () => $("#countdown")?.scrollIntoView({behavior:"smooth"}));

  // ---------- Countdown ----------
  const targetDate = new Date("2026-09-16T00:00:00+05:30");
  const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, "0");
  function countdown() {
    let diff = targetDate.getTime() - Date.now();
    const day = $("#d"), hour = $("#h"), minute = $("#m"), sec = $("#s"), text = $("#countText");
    if (!day || !hour || !minute || !sec) return;
    if (diff <= 0) {
      day.textContent = hour.textContent = minute.textContent = sec.textContent = "00";
      if (text) text.textContent = "THE DAY IS HERE, AASHU! 🎂✨";
      return;
    }
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    day.textContent = pad(d); hour.textContent = pad(h); minute.textContent = pad(m); sec.textContent = pad(s);
    if (text) text.textContent = "Counting every tiny second until your day… ✦";
  }
  countdown();
  setInterval(countdown, 1000);

  // ---------- Gift ----------
  $("#gift")?.addEventListener("click", () => {
    const g = $("#gift"), msg = $("#giftMessage"), hint = $("#giftHint");
    g.classList.toggle("open");
    msg?.classList.toggle("show");
    if (hint) hint.textContent = g.classList.contains("open") ? "You found the surprise. 💖" : "Tap the gift box 🎁";
    fireworks(18);
  });

  // ---------- Letter ----------
  const letter = `Aashu,

There are people you meet, and then there are people who slowly become part of your everyday life. Somewhere between random conversations, stupid jokes and those “one last thing” chats that somehow never end… you became one of those people.

I hope this birthday gives you the kind of happiness that doesn't need a reason. I hope you laugh a lot, dream bigger, find beautiful little moments everywhere, and always have people around you who genuinely care.

And because I'm your best friend, I obviously have one official birthday request: please stay exactly as wonderfully weird as you are. 😂 The world already has enough normal people.

Happy Birthday, Aashu. Keep shining. Keep smiling. And never forget that you're one of the rare ones. ✨

— Rɪʏᴀɴ 🎀`;
  let typed = false, letterIndex = 0;
  const typedEl = $("#typed");
  if (typedEl && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !typed) { typed = true; typeLetter(); }
    }, {threshold:.15});
    observer.observe(typedEl);
  } else if (typedEl) {
    typed = true; typeLetter();
  }
  function typeLetter() {
    if (!typedEl || letterIndex >= letter.length) return;
    typedEl.textContent += letter[letterIndex++];
    setTimeout(typeLetter, 13);
  }

  // ---------- Real 1-hour birthday song ----------
  const audio=$("#audio"), musicBtn=$("#music");
  musicBtn?.addEventListener("click",async()=>{if(!audio)return;try{if(audio.paused){await audio.play();musicBtn.textContent="Ⅱ";}else{audio.pause();musicBtn.textContent="▶";}}catch(e){musicBtn.textContent="▶";}});
  // ---------- Arcade ----------
  const arcade = $("#arcade");
  let gameCleanup = () => {};
  $$(".tabs button").forEach(btn => btn.addEventListener("click", () => {
    $$(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gameCleanup();
    renderGame(btn.dataset.game);
  }));

  function board(inner, hudLeft = "READY", hudRight = "") {
    arcade.innerHTML = `<div class="board"><div class="hud"><span>${hudLeft}</span><span>${hudRight}</span></div>${inner}</div>`;
    return $(".board", arcade);
  }
  function scoreResult(boardEl, title, small = "Aashu Arcade champion ✦") {
    const r = document.createElement("div");
    r.className = "result show";
    r.innerHTML = `<strong>${title}</strong><small>${small}</small>`;
    boardEl.appendChild(r);
  }

  function starGame() {
    const b = board('<button id="gs" class="cta center-start">START ✦</button>', "SCORE 0", "20 SEC");
    let score = 0, time = 20, timer = null, alive = true;
    const start = $("#gs");
    const spawn = () => {
      if (!alive || time <= 0 || score >= 12) return;
      const x = document.createElement("button"); x.className = "target"; x.textContent = "✦";
      x.style.left = (5 + Math.random()*88) + "%"; x.style.top = (14 + Math.random()*75) + "%";
      x.addEventListener("click", () => {
        if (!alive) return;
        score++; x.remove(); b.querySelector(".hud span").textContent = "SCORE " + score;
        if (score >= 12) finish(true); else spawn();
      });
      b.appendChild(x);
    };
    const finish = win => {
      if (!alive) return; alive = false; clearInterval(timer);
      $$(".target", b).forEach(x => x.remove());
      if (win) { scoreResult(b, "YOU DID IT! ⭐", "12 stars collected"); fireworks(35); }
      else { start.style.display = "block"; start.textContent = "TRY AGAIN ✦"; }
    };
    start.addEventListener("click", () => {
      start.style.display = "none"; score = 0; time = 20; alive = true; spawn();
      timer = setInterval(() => {
        time--; b.querySelector(".hud span:last-child").textContent = time + " SEC";
        if (time <= 0) finish(false);
      }, 1000);
    });
    gameCleanup = () => { alive = false; clearInterval(timer); };
  }

  function heartGame() {
    const b = board('<button id="gs" class="cta center-start">START ✦</button>', "HEARTS 0", "15 SEC");
    let score=0,time=15,timer=null,alive=true;
    const start=$("#gs");
    function spawn(){
      if(!alive || time<=0)return;
      const x=document.createElement("button");x.className="target";x.textContent=["💖","💕","💗"][Math.floor(Math.random()*3)];
      x.style.left=(5+Math.random()*88)+"%";x.style.top=(14+Math.random()*75)+"%";
      x.onclick=()=>{if(!alive)return;score++;x.remove();b.querySelector(".hud span").textContent="HEARTS "+score;spawn();};
      b.appendChild(x);
    }
    start.onclick=()=>{start.style.display="none";spawn();timer=setInterval(()=>{time--;b.querySelector(".hud span:last-child").textContent=time+" SEC";if(time<=0){alive=false;clearInterval(timer);$$(".target",b).forEach(x=>x.remove());scoreResult(b,"HEARTS COLLECTED 💕",score+" tiny hearts for Aashu");fireworks(18)}},1000)};
    gameCleanup=()=>{alive=false;clearInterval(timer)};
  }

  function memoryGame() {
    const b=board('<div class="memory-game"></div>',"MEMORY","MATCH 8");
    const vals=["🌙","🌙","🎀","🎀","🦋","🦋","✨","✨"].sort(()=>Math.random()-.5);
    let open=[],done=0,busy=false;
    vals.forEach(v=>{
      const x=document.createElement("button");x.className="memory-tile";x.textContent=v;
      x.onclick=()=>{
        if(busy||x.classList.contains("open")||x.classList.contains("done"))return;
        x.classList.add("open");open.push(x);
        if(open.length===2){
          busy=true;setTimeout(()=>{
            if(open[0].textContent===open[1].textContent){open.forEach(q=>q.classList.add("done"));done+=2;if(done===8){scoreResult(b,"PERFECT MATCH 🧠","All pairs unlocked");fireworks(22)}}
            else open.forEach(q=>q.classList.remove("open"));
            open=[];busy=false;
          },500);
        }
      };
      $(".memory-game",b).appendChild(x);
    });
    gameCleanup=()=>{};
  }

  function luckyGame() {
    const b=board('<div class="lucky-grid"></div>',"LUCKY BOX","CHOOSE ONE");
    for(let i=0;i<9;i++){
      const x=document.createElement("button");x.className="lucky";x.textContent="🎁";
      x.onclick=()=>{$$(".lucky",b).forEach(q=>q.disabled=true);x.textContent="💖";scoreResult(b,"LUCKY! 🎁","Extra birthday magic unlocked");fireworks(20)};
      $(".lucky-grid",b).appendChild(x);
    }
    gameCleanup=()=>{};
  }

  function reactionGame() {
    const b=board('<button class="reaction-light" id="reactionBtn">WAIT…</button>',"REACTION","GO WHEN GREEN");
    const btn=$("#reactionBtn");let active=true,started=false,startTime=0,timer=null;
    const delay=900+Math.random()*2800;
    timer=setTimeout(()=>{if(!active)return;btn.classList.add("go");btn.textContent="TAP!";started=true;startTime=performance.now()},delay);
    btn.onclick=()=>{
      if(!active)return;
      if(!started){btn.textContent="Too early 😭";clearTimeout(timer);setTimeout(()=>renderGame("reaction"),900);return;}
      const ms=Math.round(performance.now()-startTime);active=false;scoreResult(b,ms+" ms ⚡","Fast reflexes!");fireworks(12);
    };
    gameCleanup=()=>{active=false;clearTimeout(timer)};
  }

  function emojiGame() {
    const b=board('<button id="gs" class="cta center-start">START ✦</button>',"EMOJIS 0","20 SEC");
    const start=$("#gs");let score=0,time=20,timer=null,active=true;
    function spawn(){
      if(!active||time<=0)return;
      const x=document.createElement("button");x.className="target";x.textContent=["🌸","🦋","✨","🎀","🌙"][Math.floor(Math.random()*5)];
      x.style.left=(4+Math.random()*90)+"%";x.style.top=(14+Math.random()*75)+"%";
      x.onclick=()=>{score++;x.remove();b.querySelector(".hud span").textContent="EMOJIS "+score;spawn()};
      b.appendChild(x);
    }
    start.onclick=()=>{start.style.display="none";spawn();timer=setInterval(()=>{time--;b.querySelector(".hud span:last-child").textContent=time+" SEC";if(time<=0){active=false;clearInterval(timer);$$(".target",b).forEach(x=>x.remove());scoreResult(b,score+" EMOJIS 🌈","Sparkle level: maximum");fireworks(15)}},1000)};
    gameCleanup=()=>{active=false;clearInterval(timer)};
  }

  function numberGame() {
    const b=board('<div class="number-pad"></div>',"NUMBER RUSH","1 → 9");
    let next=1,locked=false;
    const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
    nums.forEach(n=>{
      const x=document.createElement("button");x.className="number-btn";x.textContent=n;
      x.onclick=()=>{
        if(locked)return;
        if(n===next){x.disabled=true;x.textContent="✓";next++;if(next===10){locked=true;scoreResult(b,"9/9 🔢","Perfect number rush");fireworks(18)}}
        else {x.animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],250)}
      };
      $(".number-pad",b).appendChild(x);
    });
    gameCleanup=()=>{locked=true};
  }

  function bubbleGame() {
    const b=board("", "BUBBLES 0", "20 SEC");
    let score=0,time=20,active=true,timer=null;
    function spawn(){
      if(!active||time<=0)return;
      const x=document.createElement("button");x.className="bubble";x.textContent="•";
      const size=28+Math.random()*45;x.style.width=x.style.height=size+"px";
      x.style.left=(3+Math.random()*(92-size/2))+"%";x.style.top=(15+Math.random()*70)+"%";
      x.onclick=()=>{score++;x.remove();b.querySelector(".hud span").textContent="BUBBLES "+score;spawn()};
      b.appendChild(x);
    }
    for(let i=0;i<3;i++)spawn();
    timer=setInterval(()=>{time--;b.querySelector(".hud span:last-child").textContent=time+" SEC";spawn();if(time<=0){active=false;clearInterval(timer);$$(".bubble",b).forEach(x=>x.remove());scoreResult(b,score+" BUBBLES 🫧","Pop champion unlocked");fireworks(16)}},1000);
    gameCleanup=()=>{active=false;clearInterval(timer)};
  }

  function colorGame() {
    const b=board('<div class="color-grid"></div>',"COLOR MATCH","MATCH TARGET");
    const names=["LILAC","PINK","MOON","SKY"];
    let target=Math.floor(Math.random()*4),round=0,locked=false;
    b.querySelector(".hud span:last-child").textContent="TARGET "+names[target];
    for(let i=0;i<12;i++){
      const x=document.createElement("button");x.className="color-btn";
      const n=Math.floor(Math.random()*4);x.textContent=names[n];
      x.onclick=()=>{
        if(locked)return;
        if(n===target){round++;x.disabled=true;x.textContent="✓";if(round>=5){locked=true;scoreResult(b,"COLOR MASTER 🎨","Five perfect matches");fireworks(20)}else{target=Math.floor(Math.random()*4);b.querySelector(".hud span:last-child").textContent="TARGET "+names[target];}}
        else{x.animate([{transform:"scale(.9)"},{transform:"scale(1)"}],200)}
      };
      $(".color-grid",b).appendChild(x);
    }
    gameCleanup=()=>{locked=true};
  }

  function spinnerGame() {
    const b=board('<div class="spinner-wheel" id="spin">✦</div><div class="spin-result" id="spinResult">Tap to spin your birthday luck.</div>',"WISH SPINNER","ONE TAP");
    const wheel=$("#spin"),res=$("#spinResult");let spins=0;
    wheel.onclick=()=>{
      spins++;wheel.style.transform=`rotate(${720+Math.random()*720}deg)`;
      const wishes=["More laughter 😂","Big dreams ✨","Peaceful days 🌙","Lucky moments 🍀","Unlimited sparkle 🎀"];
      setTimeout(()=>{res.textContent=wishes[Math.floor(Math.random()*wishes.length)];if(spins>=1)fireworks(10)},850);
    };
    gameCleanup=()=>{};
  }

  function renderGame(name) {
    const games={stars:starGame,hearts:heartGame,memory:memoryGame,lucky:luckyGame,reaction:reactionGame,emoji:emojiGame,number:numberGame,bubble:bubbleGame,color:colorGame,spinner:spinnerGame};
    (games[name]||starGame)();
  }
  renderGame("stars");

  // ---------- Photo lightbox ----------
  const lb=$("#lightbox"), lbImg=$("#lightboxImg"), lbClose=$("#lightboxClose"), lbCap=$("#lightboxCaption");
  $$(".photo-card").forEach(card=>card.addEventListener("click",()=>{if(lbImg)lbImg.src=card.dataset.photo;if(lbCap)lbCap.textContent=card.querySelector("span")?.textContent||"Aashu ✦";lb?.classList.add("open")}));
  lbClose?.addEventListener("click",()=>lb?.classList.remove("open"));lb?.addEventListener("click",e=>{if(e.target===lb)lb.classList.remove("open")});document.addEventListener("keydown",e=>{if(e.key==="Escape")lb?.classList.remove("open")});

  $("#wish")?.addEventListener("click",()=>{
    const text=$("#wishText");
    if(text)text.textContent="Whatever you wished for… I hope it finds you. ✨💖";
    fireworks(28);
    setTimeout(()=>{if(text)text.textContent="And yes, that counts as a little birthday magic. 🎀"},2600);
  });

  // ---------- Fireworks ----------
  const fire=$("#fire"), fctx=fire.getContext("2d");
  let particles=[];
  function resizeFire(){const dpr=Math.min(devicePixelRatio||1,2);fire.width=innerWidth*dpr;fire.height=innerHeight*dpr;fctx.setTransform(dpr,0,0,dpr,0,0);}
  resizeFire();addEventListener("resize",resizeFire);
  function firework(x=Math.random()*innerWidth,y=.2*innerHeight){
    for(let i=0;i<70;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*6;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,size:1+Math.random()*2});}
  }
  function fireworks(n=10){for(let i=0;i<n;i++)setTimeout(()=>firework(innerWidth*.12+Math.random()*innerWidth*.76,innerHeight*.1+Math.random()*innerHeight*.52),i*55);}
  function fireLoop(){
    fctx.clearRect(0,0,innerWidth,innerHeight);
    particles=particles.filter(p=>p.life>0);
    for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=.016;fctx.globalAlpha=p.life;fctx.fillStyle="#fff";fctx.beginPath();fctx.arc(p.x,p.y,p.size,0,Math.PI*2);fctx.fill();}
    fctx.globalAlpha=1;requestAnimationFrame(fireLoop);
  }
  fireLoop();

  $("#boom")?.addEventListener("click",()=>{
    fireworks(38);
    setTimeout(()=>$("#finale")?.classList.add("ending"),1000);
    setTimeout(()=>$("#finale")?.classList.remove("ending"),5200);
  });
})();
