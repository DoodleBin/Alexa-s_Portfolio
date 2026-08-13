  // Signature element: gentle mouse-reactive node network, evoking graphs / systems / HCI
  (function(){
    const canvas = document.getElementById('netCanvas');
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr;
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };

    function resize(){
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.max(18, Math.floor((w*h)/9000));
      nodes = Array.from({length: count}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.18,
        vy: (Math.random()-0.5)*0.18,
        r: 1.4 + Math.random()*1.6
      }));
    }

    function step(){
      ctx.clearRect(0,0,w,h);
      for(const n of nodes){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          const maxDist = w*0.16;
          if(dist < maxDist){
            const mdA = Math.hypot(a.x-mouse.x, a.y-mouse.y);
            const near = mdA < w*0.22;
            ctx.strokeStyle = near ? 'rgba(255,90,60,0.5)' : 'rgba(23,38,35,0.10)';
            ctx.lineWidth = near ? 1.1 : 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      for(const n of nodes){
        const md = Math.hypot(n.x-mouse.x, n.y-mouse.y);
        const near = md < w*0.22;
        ctx.fillStyle = near ? '#FF5A3C' : 'rgba(23,38,35,0.28)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r*1.6 : n.r, 0, Math.PI*2);
        ctx.fill();
      }
      if(!reduceMotion) requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    resize();
    step();
    if(reduceMotion){
      // draw a single static frame
      step();
    }
  })();