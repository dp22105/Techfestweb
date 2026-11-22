(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- Boot sequence ---------- */
  const boot = $('#boot');
  const log = $('#boot-log');
  let seen = false;
  try { seen = sessionStorage.getItem('tf-boot') === '1'; } catch (e) {}

  function endBoot() {
    boot.classList.add('gone');
    try { sessionStorage.setItem('tf-boot', '1'); } catch (e) {}
    document.body.classList.add('ready');
    revealHero();
  }
  if (reduce || seen) {
    boot.classList.add('gone');
    document.body.classList.add('ready');
    window.addEventListener('DOMContentLoaded', revealHero);
    if (document.readyState !== 'loading') revealHero();
  } else {
    const lines = [
      '> booting techfest.sys',
      '> loading 1998 ... 2026 ........ ok',
      '> linking 2,500+ colleges ....... ok',
      '> signal locked: IIT BOMBAY, POWAI',
      '> 16–18 DEC 2026 — launch'
    ];
    let i = 0, done = false;
    const finish = () => { if (!done) { done = true; endBoot(); } };
    boot.addEventListener('click', finish);
    (function next() {
      if (done) return;
      if (i >= lines.length) return setTimeout(finish, 450);
      log.textContent += (i ? '\n' : '') + lines[i++];
      setTimeout(next, 330);
    })();
  }

  function revealHero() {
    $$('.hero .rv').forEach((el, i) => {
      el.style.setProperty('--d', (i * 0.12) + 's');
      requestAnimationFrame(() => el.classList.add('in'));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.classList.contains('stat')) countUp($('b', e.target));
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.rv').forEach((el, i) => {
    if (el.closest('.hero')) return;
    el.style.setProperty('--d', (i % 3) * 0.08 + 's');
    io.observe(el);
  });

  /* ---------- Counters ---------- */
  function countUp(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const plain = el.dataset.plain;
    const fmt = (n) => plain ? String(Math.round(n)) : Math.round(n).toLocaleString('en-IN');
    if (reduce) { el.textContent = fmt(target) + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * e) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Nav, progress ---------- */
  const nav = $('.nav'), bar = $('.progress i');
  function onScroll() {
    nav.classList.toggle('stuck', scrollY > 30);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#menu a').forEach((a) => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  $$('.track').forEach((t) => {
    const txt = t.textContent;
    t.innerHTML = `<span>${txt}</span><span>${txt}</span>`;
  });

  /* ---------- Countdown (IST) ---------- */
  const START = new Date('2026-12-16T00:00:00+05:30').getTime();
  const END = new Date('2026-12-19T00:00:00+05:30').getTime();
  const pad = (n) => String(n).padStart(2, '0');
  function cd() {
    const now = Date.now();
    const note = $('#cd-note');
    let diff = START - now;
    if (now >= END) {
      note.textContent = 'See you next year';
      diff = 0;
    } else if (now >= START) {
      note.textContent = 'Techfest is live right now';
      diff = END - now;
    } else {
      note.textContent = 'until doors open';
    }
    const s = Math.floor(diff / 1000);
    $('#cd-d').textContent = pad(Math.floor(s / 86400));
    $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
    $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60));
    $('#cd-s').textContent = pad(s % 60);
  }
  cd(); setInterval(cd, 1000);

  /* ---------- Wordmark: letters light up near the pointer ---------- */
  const ltrs = $$('.ltr');
  let mx = -9999, my = -9999;
  function lightLetters() {
    ltrs.forEach((l) => {
      const r = l.getBoundingClientRect();
      const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
      const p = Math.max(0, 1 - d / 240);
      l.style.setProperty('--p', p.toFixed(3));
    });
  }
  // gentle idle wave so touch devices and reduced-motion users still see life
  if (!fine && !reduce) {
    let t = 0;
    setInterval(() => {
      t += 0.35;
      ltrs.forEach((l, i) => l.style.setProperty('--p', (Math.max(0, Math.sin(t - i * 0.7)) * 0.9).toFixed(3)));
    }, 80);
  }

  /* ---------- Custom cursor ---------- */
  const cur = $('.cursor');
  let cx = 0, cy = 0, tx = 0, ty = 0;
  if (fine) {
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY; mx = tx; my = ty;
      cur.classList.add('on');
      lightLetters();
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    $$('a,button,.card,.pillar').forEach((el) => {
      el.addEventListener('pointerenter', () => cur.classList.add('big'));
      el.addEventListener('pointerleave', () => cur.classList.remove('big'));
    });
  }

  /* ---------- Pillars accordion ---------- */
  const pillars = $$('.pillar');
  function activate(p) {
    pillars.forEach((x) => x.classList.toggle('active', x === p));
  }
  pillars.forEach((p) => {
    p.addEventListener('mouseenter', () => fine && activate(p));
    p.addEventListener('click', () => activate(p));
    p.addEventListener('focus', () => activate(p));
  });

  /* ---------- Competition filters + spotlight ---------- */
  const chips = $$('.chip'), cards = $$('.card');
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((x) => { x.classList.toggle('on', x === c); x.setAttribute('aria-selected', x === c); });
    const f = c.dataset.f;
    cards.forEach((card, i) => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hide', !show);
      card.classList.remove('pop');
      if (show) { void card.offsetWidth; card.style.animationDelay = (i * 0.04) + 's'; card.classList.add('pop'); }
    });
  }));
  cards.forEach((card) => card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- Timeline: mark what's done / next from today's date ---------- */
  const items = $$('#timeline li');
  const tl = $('#timeline');
  const fill = document.createElement('span');
  fill.className = 'fill';
  tl.prepend(fill);
  const now = Date.now();
  let nextIdx = items.findIndex((li) => new Date(li.dataset.date + 'T00:00:00+05:30').getTime() > now);
  if (nextIdx === -1) nextIdx = items.length;
  items.forEach((li, i) => {
    if (i < nextIdx) li.classList.add('done');
    if (i === nextIdx) li.classList.add('next');
  });
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const nxt = items[nextIdx];
  $('#road-today').textContent = nxt
    ? `Today is ${today}. Next up: ${$('h4', nxt).textContent}.`
    : `Today is ${today}. The festival has wrapped for 2026.`;
  new IntersectionObserver((en, ob) => {
    if (!en[0].isIntersecting) return;
    const last = items[Math.min(nextIdx, items.length - 1)];
    fill.style.height = (last.offsetTop + 14) + 'px';
    ob.disconnect();
  }, { threshold: 0.2 }).observe(tl);

  /* ---------- Background: connected-node network ---------- */
  const cv = $('#net'), ctx = cv.getContext('2d');
  let W, H, dpr, pts = [];
  const mouse = { x: -999, y: -999 };
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.min(110, Math.floor(innerWidth * innerHeight / 14000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
      r: (Math.random() * 1.4 + .6) * dpr
    }));
  }
  addEventListener('resize', size);
  addEventListener('pointermove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  size();

  const LINK = 140;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const L = LINK * dpr;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 200 * dpr && d > 1) { p.x += dx / d * .5 * dpr; p.y += dy / d * .5 * dpr; }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'rgba(238,240,245,.55)'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < L) {
          ctx.strokeStyle = `rgba(238,240,245,${(1 - d / L) * .16})`;
          ctx.lineWidth = dpr * .6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 200 * dpr) {
        ctx.strokeStyle = `rgba(200,255,46,${(1 - dm / (200 * dpr)) * .7})`;
        ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    if (!reduce && !document.hidden) requestAnimationFrame(draw);
  }
  draw();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) draw(); });
})();
