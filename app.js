/* ═══════════════════════════════════════════
   Yash Roadways — Interactive Layer
   Design system ported from devshah-portfolio
   ═══════════════════════════════════════════ */

/* ─── CURSOR GLOW (exact CursorGlow.tsx port) ─── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  window.addEventListener('mousemove', e => {
    cursorGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
  }, { passive: true });
}

/* ─── NAV: scroll glass ─── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ─── Hamburger ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Counter animation ─── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('[data-target]').forEach(n => animateCounter(n, +n.dataset.target)); });
  }, { threshold: 0.5 }).observe(heroStats);
}

/* ─── Stagger delays ─── */
document.querySelectorAll('.service-card, .why-card, .client-card, .hs-card, .client-card-full').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 0.07}s`;
});

/* ─── Contact form ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>✅ Enquiry Sent!</span>';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
  });
}

/* ═══════════════════════════════════════════
   TYPEWRITER (exact port from Hero.tsx)
   Cycles through transport-themed titles
   ═══════════════════════════════════════════ */
const TITLES = [
  'Fleet Owners & Transport Contractors',
  'Cold Chain Specialists',
  'Pan-India Freight Solutions',
  'Dairy Logistics Experts',
  'Dedicated Fleet Partners',
];

const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  const TYPE_SPEED = 70, DELETE_SPEED = 35, HOLD_TIME = 2400;

  function typeLoop() {
    const current = TITLES[wordIndex];
    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => { isDeleting = true; typeLoop(); }, HOLD_TIME);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % TITLES.length;
      setTimeout(typeLoop, 300);
      return;
    }
    charIndex += isDeleting ? -1 : 1;
    typewriterEl.textContent = current.slice(0, charIndex);
    setTimeout(typeLoop, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }
  setTimeout(typeLoop, 600);
}

/* ═══════════════════════════════════════════
   SCRAMBLE TEXT on hero title
   ═══════════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

function scramble(el, finalLines, delay = 350) {
  setTimeout(() => {
    const dot = el.querySelector('.hero-title-dot');
    const lines = finalLines;
    let iter = 0;

    const iv = setInterval(() => {
      let html = '';
      lines.forEach((line, li) => {
        const chars = line.split('').map((ch, i) => {
          if (i < iter) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        html += chars;
        if (li < lines.length - 1) html += '<br />';
      });
      html += '<span class="hero-title-dot">.</span>';
      el.innerHTML = html;
      iter += 0.55;
      if (iter >= Math.max(...lines.map(l => l.length))) clearInterval(iv);
    }, 38);
  }, delay);
}

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) scramble(heroTitle, ['YASH', 'ROADWAYS'], 400);

/* ═══════════════════════════════════════════
   PARTICLE NETWORK (exact ParticleNetwork.tsx port)
   Terracotta particles + mouse interaction
   ═══════════════════════════════════════════ */
const heroSection = document.getElementById('home');
if (heroSection) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  heroSection.appendChild(canvas);

  const ctx  = canvas.getContext('2d');
  const C    = '201,90,40';
  const N    = 80, CD = 130, MD = 190;
  let ps = [], mx = -9999, my = -9999, raf = 0;

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = W() * dpr; canvas.height = H() * dpr;
    ctx.resetTransform(); ctx.scale(dpr, dpr);
  }

  function init() {
    ps = Array.from({ length: N }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2 + 1, a: Math.random() * 0.38 + 0.22,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W(), H());

    for (const p of ps) {
      const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
      if (d < MD && d > 0) { const f = ((MD - d) / MD) * 0.013; p.vx += dx/d*f; p.vy += dy/d*f; }
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > 1.7) { p.vx = p.vx/spd*1.7; p.vy = p.vy/spd*1.7; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W()) p.vx *= -1;
      if (p.y < 0 || p.y > H()) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${C},${p.a})`; ctx.fill();
    }

    for (let i = 0; i < ps.length; i++) for (let j = i+1; j < ps.length; j++) {
      const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
      if (d < CD) {
        ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
        ctx.strokeStyle = `rgba(${C},${(1-d/CD)*0.16})`; ctx.lineWidth = 0.7; ctx.stroke();
      }
    }

    for (const p of ps) {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < MD) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(${C},${(1-d/MD)*0.55})`; ctx.lineWidth = 1.1; ctx.stroke();
      }
    }

    raf = requestAnimationFrame(draw);
  }

  resize(); init(); draw();

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
}

/* ═══════════════════════════════════════════
   FLOATING TRANSPORT SYMBOLS
   (port of FLOAT_SYMBOLS from Hero.tsx)
   ═══════════════════════════════════════════ */
const FLOAT_SYMBOLS = [
  { char: '→',   x:  5, y:  8, delay:  0, dur: 18, size: 18, op: 0.20 },
  { char: 'KM',  x: 12, y: 45, delay:  3, dur: 22, size: 13, op: 0.16 },
  { char: '↑',   x: 20, y: 72, delay:  6, dur: 19, size: 18, op: 0.18 },
  { char: '▲',   x: 28, y: 25, delay:  1, dur: 25, size: 13, op: 0.16 },
  { char: '◦',   x: 36, y: 58, delay:  8, dur: 17, size: 22, op: 0.20 },
  { char: 'MT',  x: 44, y: 88, delay:  4, dur: 21, size: 12, op: 0.16 },
  { char: '●',   x: 52, y: 15, delay:  2, dur: 23, size: 10, op: 0.18 },
  { char: '→',   x: 60, y: 50, delay:  7, dur: 20, size: 16, op: 0.16 },
  { char: '∞',   x: 68, y: 78, delay:  5, dur: 26, size: 20, op: 0.18 },
  { char: '24h', x: 76, y: 30, delay:  9, dur: 18, size: 11, op: 0.16 },
  { char: '↗',   x: 84, y: 62, delay:  1, dur: 24, size: 18, op: 0.18 },
  { char: '◎',   x: 92, y: 12, delay:  6, dur: 20, size: 14, op: 0.16 },
  { char: '▸',   x:  8, y: 35, delay:  3, dur: 22, size: 16, op: 0.18 },
  { char: 'FTL', x: 16, y: 85, delay:  7, dur: 19, size: 11, op: 0.15 },
  { char: '→',   x: 32, y: 40, delay:  2, dur: 21, size: 20, op: 0.18 },
  { char: '⊙',   x: 48, y: 68, delay:  5, dur: 23, size: 16, op: 0.16 },
  { char: 'km',  x: 64, y: 20, delay:  0, dur: 18, size: 12, op: 0.18 },
  { char: '↑',   x: 80, y: 48, delay:  4, dur: 25, size: 20, op: 0.16 },
  { char: '◦',   x: 88, y: 82, delay:  8, dur: 22, size: 18, op: 0.18 },
  { char: '▲',   x: 24, y: 55, delay:  6, dur: 20, size: 12, op: 0.16 },
  { char: '→',   x: 40, y: 18, delay:  1, dur: 21, size: 15, op: 0.18 },
  { char: '⬡',   x: 56, y: 90, delay:  3, dur: 17, size: 16, op: 0.15 },
  { char: '▹',   x: 72, y: 38, delay:  9, dur: 24, size: 15, op: 0.18 },
];

if (heroSection) {
  const symWrap = document.createElement('div');
  symWrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;';
  FLOAT_SYMBOLS.forEach(sym => {
    const s = document.createElement('span');
    s.textContent = sym.char;
    s.style.cssText = `
      position:absolute;
      left:${sym.x}%;top:${sym.y}%;
      font-size:${sym.size}px;
      font-family:'JetBrains Mono',monospace;
      color:#C95A28;
      opacity:0;
      pointer-events:none;
      animation:symbolFloat ${sym.dur}s ${sym.delay}s linear infinite both;
      --sym-opacity:${sym.op};
    `;
    symWrap.appendChild(s);
  });
  heroSection.appendChild(symWrap);
}
