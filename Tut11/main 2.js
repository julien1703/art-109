// main.js — particles, floaters movement, nav toggle, ball physics, footer trigger
(function(){
  // helpers
  const $ = sel=>document.querySelector(sel);

  // NAV toggle
  const navToggle = document.querySelector('.nav-toggle');
  const creativeNav = document.querySelector('.creative-nav');
  navToggle && navToggle.addEventListener('click', ()=>{
    creativeNav.classList.toggle('open');
  });

  // setup floaters subtle motion
  const floaters = document.querySelectorAll('.floater');
  function animateFloaters(){
    floaters.forEach((f,i)=>{
      const speed = parseFloat(f.dataset.speed || '0.7');
      const t = Date.now()/1000;
      const x = Math.sin(t*speed + i)* (20 + i*12);
      const y = Math.cos(t*(0.6*speed) + i)* (12 + i*8);
      const rot = (Math.sin(t*0.3+i)+1)*20;
      f.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    });
    requestAnimationFrame(animateFloaters);
  }
  animateFloaters();

  // position floaters randomly on load
  (function placeFloaters(){
    const area = document.querySelector('.hero');
    if(!area) return;
    const rect = area.getBoundingClientRect();
    floaters.forEach((f)=>{
      const left = Math.random()*(rect.width*0.9);
      const top = Math.random()*(rect.height*0.9);
      f.style.left = `${left}px`;
      f.style.top = `${top}px`;
    });
  })();

  // background gradient canvas (soft moving blobs)
  const bgCanvas = document.getElementById('bgCanvas');
  if(bgCanvas){
    const ctx = bgCanvas.getContext('2d');
    function resize(){bgCanvas.width = bgCanvas.clientWidth; bgCanvas.height = bgCanvas.clientHeight}
    window.addEventListener('resize', resize); resize();
    const blobs = [
      {x:0.2,y:0.3,r:220, color:'rgba(122,92,255,0.12)'},
      {x:0.7,y:0.5,r:180, color:'rgba(110,255,249,0.12)'},
      {x:0.5,y:0.2,r:240, color:'rgba(255,102,196,0.08)'}
    ];
    function drawBg(){
      ctx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
      const t = Date.now()/5000;
      blobs.forEach((b,i)=>{
        const x = (b.x + Math.sin(t*(0.4+i*0.2))*0.05) * bgCanvas.width;
        const y = (b.y + Math.cos(t*(0.3+i*0.25))*0.04) * bgCanvas.height;
        const grd = ctx.createRadialGradient(x,y,b.r*0.1,x,y,b.r);
        grd.addColorStop(0,b.color);
        grd.addColorStop(1,'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
      });
      requestAnimationFrame(drawBg);
    }
    drawBg();
  }

  // particle canvas (follow mouse)
  const pCanvas = document.getElementById('particleCanvas');
  if(pCanvas){
    const ctx = pCanvas.getContext('2d');
    function resizeP(){pCanvas.width = pCanvas.clientWidth; pCanvas.height = pCanvas.clientHeight}
    window.addEventListener('resize', resizeP); resizeP();
    const particles = [];
    function spawn(x,y){
      for(let i=0;i<8;i++){
        particles.push({x,y:vx=x,yv:y, vx:(Math.random()-0.5)*3, vy:(Math.random()-0.5)*3, life:60+Math.random()*40, r:1+Math.random()*3, hue:Math.random()*360});
      }
    }
    let mouse = {x:0,y:0,down:false};
    pCanvas.addEventListener('mousemove', e=>{const r=pCanvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;spawn(mouse.x,mouse.y)});
    pCanvas.addEventListener('click', e=>{const r=pCanvas.getBoundingClientRect();spawn(e.clientX-r.left,e.clientY-r.top)});
    function tick(){
      ctx.clearRect(0,0,pCanvas.width,pCanvas.height);
      for(let i=particles.length-1;i>=0;i--){
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life--;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue},90%,60%, ${Math.max(p.life/100,0)})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
        if(p.life<=0) particles.splice(i,1);
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  // bouncing ball simple physics that responds to mouse
  const ball = document.getElementById('ball');
  if(ball){
    let bx = 0, by = 0, bvx = 2, bvy = 1, gravity = 0.3;
    function resizeBallArea(){
      const area = document.querySelector('.play-area');
      if(!area) return; const r = area.getBoundingClientRect();
      // ensure ball stays in area
    }
    window.addEventListener('resize', resizeBallArea); resizeBallArea();
    document.querySelector('.play-area').addEventListener('mousemove', e=>{
      const r = e.currentTarget.getBoundingClientRect();
      const mx = e.clientX - r.left; const my = e.clientY - r.top;
      // push ball away from mouse
      const rect = ball.getBoundingClientRect();
      const centerX = rect.left + rect.width/2 - r.left; const centerY = rect.top + rect.height/2 - r.top;
      const dx = centerX - mx; const dy = centerY - my; const dist = Math.hypot(dx,dy);
      if(dist < 120){ bvx += dx/dist*0.5; bvy += dy/dist*0.5; }
    });
    function step(){
      const area = document.querySelector('.play-area');
      const r = area.getBoundingClientRect();
      bx += bvx; by += bvy; bvy += gravity;
      if(bx < 0){ bx = 0; bvx *= -0.8 }
      if(bx > r.width-48){ bx = r.width-48; bvx *= -0.8 }
      if(by < 0){ by = 0; bvy *= -0.8 }
      if(by > r.height-48){ by = r.height-48; bvy *= -0.7 }
      ball.style.transform = `translate(${bx}px, ${by}px)`;
      requestAnimationFrame(step);
    }
    // init ball near center
    const playArea = document.querySelector('.play-area');
    if(playArea){ const rr = playArea.getBoundingClientRect(); bx = rr.width/2 - 24; by = rr.height/2 - 24; }
    step();
  }

  // footer bottom detection
  const footer = document.querySelector('.site-footer');
  function checkBottom(){
    const scrollY = window.scrollY || window.pageYOffset; const h = document.documentElement.scrollHeight - window.innerHeight;
    if(scrollY >= h - 8){ footer.classList.add('at-bottom'); } else { footer.classList.remove('at-bottom'); }
  }
  window.addEventListener('scroll', checkBottom); checkBottom();

  // simple hover follow effect for floaters on mousemove
  document.addEventListener('mousemove', e=>{
    const hw = window.innerWidth/2; const hh = window.innerHeight/2;
    floaters.forEach((f,i)=>{
      const dx = (e.clientX - hw) * (0.002 + i*0.001);
      const dy = (e.clientY - hh) * (0.002 + i*0.001);
      f.style.transform += ` translate(${dx}px, ${dy}px)`;
    });
  });

})();
