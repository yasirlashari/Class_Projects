// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 1400);
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = -100, my = -100, cx = -100, cy = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .col-card, .cc-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hov'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hov'));
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// ── BURGER MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mm-link').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── WATCH CANVAS ──
const canvas = document.getElementById('watchCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, cx2 = W / 2, cy2 = H / 2, R = W / 2 - 10;

  function drawWatch() {
    ctx.clearRect(0, 0, W, H);

    // Bezel
    ctx.beginPath();
    ctx.arc(cx2, cy2, R, 0, Math.PI * 2);
    const bezelGrad = ctx.createRadialGradient(cx2 - 20, cy2 - 20, 5, cx2, cy2, R);
    bezelGrad.addColorStop(0, '#e8c870');
    bezelGrad.addColorStop(0.4, '#c4955a');
    bezelGrad.addColorStop(1, '#6b4a20');
    ctx.fillStyle = bezelGrad;
    ctx.fill();

    // Dial
    ctx.beginPath();
    ctx.arc(cx2, cy2, R - 8, 0, Math.PI * 2);
    const dialGrad = ctx.createRadialGradient(cx2 - 15, cy2 - 15, 5, cx2, cy2, R - 8);
    dialGrad.addColorStop(0, '#1e1a14');
    dialGrad.addColorStop(1, '#080604');
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // Tick marks
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % 5 === 0;
      const outer = R - 12;
      const inner = outer - (isMajor ? 14 : 7);
      ctx.beginPath();
      ctx.moveTo(cx2 + Math.cos(angle) * inner, cy2 + Math.sin(angle) * inner);
      ctx.lineTo(cx2 + Math.cos(angle) * outer, cy2 + Math.sin(angle) * outer);
      ctx.strokeStyle = isMajor ? 'rgba(196,149,90,0.9)' : 'rgba(196,149,90,0.35)';
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.stroke();
    }

    // Brand text
    ctx.font = '500 8px sans-serif';
    ctx.fillStyle = 'rgba(196,149,90,0.7)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('LAIBA', cx2, cy2 + 28);
    ctx.font = '300 6px sans-serif';
    ctx.fillStyle = 'rgba(255,248,235,0.3)';
    ctx.fillText('WATCH CO.', cx2, cy2 + 40);

    // Time
    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr  = (now.getHours() % 12) + min / 60;

    // Hour hand
    drawHand(ctx, cx2, cy2, (hr / 12) * Math.PI * 2 - Math.PI / 2, R * 0.42, 3.5, 'rgba(196,149,90,0.95)');
    // Minute hand
    drawHand(ctx, cx2, cy2, (min / 60) * Math.PI * 2 - Math.PI / 2, R * 0.62, 2.5, 'rgba(255,248,235,0.9)');
    // Second hand
    drawHand(ctx, cx2, cy2, (sec / 60) * Math.PI * 2 - Math.PI / 2, R * 0.72, 1.2, '#e03030', R * 0.15);

    // Center cap
    ctx.beginPath();
    ctx.arc(cx2, cy2, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#c4955a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx2, cy2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0908';
    ctx.fill();

    requestAnimationFrame(drawWatch);
  }

  function drawHand(ctx, ox, oy, angle, length, width, color, tail = 0) {
    ctx.save();
    ctx.beginPath();
    if (tail > 0) {
      ctx.moveTo(ox + Math.cos(angle + Math.PI) * tail, oy + Math.sin(angle + Math.PI) * tail);
    } else {
      ctx.moveTo(ox, oy);
    }
    ctx.lineTo(ox + Math.cos(angle) * length, oy + Math.sin(angle) * length);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  drawWatch();
}

// ── SCROLL REVEAL ──
const fadeEls = document.querySelectorAll('.col-card, .cf-item, .ci-item, .craft-p, .craft-quote, .craft-visual, .contact-left, .contact-right');
fadeEls.forEach(el => el.classList.add('fade-in'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('fade-in'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('vis'), idx * 90);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => revealObs.observe(el));

// ── COUNTER ──
function countUp(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.hnum').forEach(countUp);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// ── TESTIMONIALS ──
const slides = document.querySelectorAll('.testi-slide');
const navWrap = document.getElementById('testiNav');
let current = 0, autoT;

if (slides.length && navWrap) {
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'tn-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { clearInterval(autoT); goTo(i); start(); });
    navWrap.appendChild(dot);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    navWrap.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    navWrap.children[current].classList.add('active');
  }

  function start() { autoT = setInterval(() => goTo(current + 1), 4500); }
  start();

  // Swipe
  let sx = 0;
  const tw = document.querySelector('.testi-wrap');
  if (tw) {
    tw.addEventListener('touchstart', e => sx = e.touches[0].clientX);
    tw.addEventListener('touchend', e => {
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) { clearInterval(autoT); goTo(current + (dx > 0 ? 1 : -1)); start(); }
    });
  }
}

// ── FORM ──
const form = document.getElementById('contactForm');
const fSuccess = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      form.style.display = 'none';
      fSuccess.style.display = 'block';
      fSuccess.style.animation = 'fadeIn 0.6s ease';
    }, 400);
  });
}

// ── CARD HOVER COLOR ──
document.querySelectorAll('.cc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.col-card');
    const name = card.querySelector('h3').textContent;
    const subject = `Enquiry: ${name}`;
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
      const sel = contact.querySelector('select');
      if (sel) {
        const opt = [...sel.options].find(o => o.text.includes(name.split(' ')[0]));
        if (opt) sel.value = opt.value;
      }
    }
  });
});

// ── SMOOTH ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let found = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) found = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${found}` ? 'var(--gold)' : '';
  });
});

// CSS animation keyframe inject
const s = document.createElement('style');
s.textContent = `@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`;
document.head.appendChild(s);
