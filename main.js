/* ================================================================
   ADRIÁN CARMONA CÓRDOBA — main.js v3
   Custom cursor · Parallax · Section BG · Text scramble ·
   Card 3D tilt · Language toggle · Scroll reveal ·
   Typewriter · Gallery · Video · Lightbox · Contact
   ================================================================ */
'use strict';

/* ── 1. CUSTOM CURSOR ─────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = -200, mouseY = -200, ringX = -200, ringY = -200;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

(function animateCursor() {
  if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
  if (ring) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

const hoverSel = 'a,button,.skill-card,.art-item,.video-wrap,.g-thumb,.acc-head,.c-link,.lang-btn,.nav-hamburger,.art-expand,.lb-close,.proj-img-wrap';
document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) ring && ring.classList.add('hover'); });
document.addEventListener('mouseout',  e => { if (e.target.closest(hoverSel)) ring && ring.classList.remove('hover'); });
document.addEventListener('mouseleave', () => { if (dot) dot.style.opacity = '0'; if (ring) ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { if (dot) dot.style.opacity = '1'; if (ring) ring.style.opacity = '1'; });


/* ── 2. LANGUAGE TOGGLE ────────────────────────────────────────── */
let currentLang = localStorage.getItem('acLang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('acLang', lang);

  const btnEN = document.getElementById('btnEN');
  const btnES = document.getElementById('btnES');
  if (btnEN) btnEN.classList.toggle('active', lang === 'en');
  if (btnES) btnES.classList.toggle('active', lang === 'es');

  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt !== null) el.innerHTML = txt;
  });
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    const ph = el.getAttribute('data-placeholder-' + lang);
    if (ph) el.placeholder = ph;
  });

  const gl = document.getElementById('galleryLabel');
  if (gl) {
    const txt = gl.getAttribute('data-' + lang);
    if (txt) gl.textContent = txt;
  }
}


/* ── 3. NAVBAR SCROLL ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });


/* ── 4. MOBILE MENU ────────────────────────────────────────────── */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  if (h) h.classList.toggle('open');
  if (m) m.classList.toggle('open');
}


/* ── 5. SECTION COLOUR INDICATOR ─────────────────────────────── */
const sectionColours = {
  'hero':     '#E05010',
  'about':    '#07B5D4',
  'skills':   '#E05010',
  'demos':    '#FFBA00',
  'work3d':   '#FF4500',
  'gamedev':  '#06AECA',
  'vfx':      '#FFE500',
  'timeline': '#F4E8CE',
  'cv':       '#36C26A',
  'contact':  '#E05010',
};

const secIndicator = document.getElementById('secIndicator');

if (secIndicator) {
  const colourObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const col = sectionColours[e.target.id];
        if (col) secIndicator.style.background = col;
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(s => colourObs.observe(s));
}


/* ── 6. MOUSE PARALLAX (hero shapes) ─────────────────────────── */
let parallaxX = 0, parallaxY = 0;
let targetPX = 0, targetPY = 0;

document.addEventListener('mousemove', e => {
  targetPX = (e.clientX / window.innerWidth  - 0.5);
  targetPY = (e.clientY / window.innerHeight - 0.5);
}, { passive: true });

const parallaxEls = document.querySelectorAll('[data-parallax]');

if (parallaxEls.length) {
  (function animateParallax() {
    parallaxX += (targetPX - parallaxX) * 0.06;
    parallaxY += (targetPY - parallaxY) * 0.06;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 20;
      el.style.transform = `translate(${parallaxX * speed}px, ${parallaxY * speed}px)`;
    });

    requestAnimationFrame(animateParallax);
  })();
}


/* ── 7. SCROLL REVEAL ─────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children].filter(
            c => c.classList.contains('reveal') || c.classList.contains('reveal-l') || c.classList.contains('reveal-r')
          )
        : [];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('vis');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => revealObs.observe(el));

// Section label and section-rule reveal
const labelObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      labelObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-label, .section-rule').forEach(el => labelObs.observe(el));


/* ── 8. SECTION TITLE WORD REVEAL ─────────────────────────────── */
// Wrap each word in .title-word > span for clip animation
document.querySelectorAll('.section-title').forEach(el => {
  if (el.querySelector('.title-word')) return; // already wrapped

  // Get all text nodes / child nodes
  const html = el.innerHTML;
  // Wrap words accounting for <br> and <span>
  const words = html.split(/(<br\s*\/?>|<[^>]+>|\s+)/).filter(Boolean);
  el.innerHTML = words.map(w => {
    if (w.match(/^</) || w.trim() === '') return w;
    return `<span class="title-word"><span>${w}</span></span>`;
  }).join('');
});

const titleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      // Text scramble on the title
      scrambleEl(e.target);
      titleObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-title').forEach(el => titleObs.observe(el));


/* ── 9. TEXT SCRAMBLE ─────────────────────────────────────────── */
function scrambleEl(container) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—0123456789';

  container.querySelectorAll('.title-word > span').forEach((span, wi) => {
    const original = span.textContent;
    if (!original.trim()) return;

    const delay = wi * 90 + 200; // ms delay before scramble starts
    setTimeout(() => {
      let frame = 0;
      const totalFrames = original.length * 4;

      const interval = setInterval(() => {
        span.textContent = original.split('').map((ch, ci) => {
          if (ch === ' ') return ' ';
          if (ci < frame / 4) return original[ci];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        frame++;
        if (frame >= totalFrames) {
          span.textContent = original;
          clearInterval(interval);
        }
      }, 28);
    }, delay);
  });
}


/* ── 10. 3D CARD TILT ─────────────────────────────────────────── */
function addTilt(selector, intensity = 12) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5);
      const y = ((e.clientY - rect.top)  / rect.height - 0.5);
      card.style.transform = `perspective(700px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-3px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Apply tilt after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addTilt('.skill-card', 10);
  addTilt('.art-item:not(.art-item--full)', 8);
});


/* ── 11. TYPEWRITER ROLES ──────────────────────────────────────── */
const rolesEN = ['3D Worlds', 'Game Experiences', 'Visual Effects', 'Cinematic Art', 'Interactive Stories'];
const rolesES = ['Mundos 3D', 'Experiencias de Juego', 'Efectos Visuales', 'Arte Cinematográfico', 'Historias Interactivas'];

let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  if (!roleEl) return;
  const roles = currentLang === 'es' ? rolesES : rolesEN;
  const full  = roles[roleIdx % roles.length];

  if (!deleting) {
    roleEl.textContent = full.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === full.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    roleEl.textContent = full.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx++; }
  }
  setTimeout(typeRole, deleting ? 38 : 72);
}
setTimeout(typeRole, 1600);


/* ── 12. ABOUT GALLERY ─────────────────────────────────────────── */
const galleryItems = [
  { src: 'images/renderBusto3Dimportante.jpeg', en: 'Character Bust — Blender · Cycles',            es: 'Busto de Personaje — Blender · Cycles'          },
  { src: 'images/celda.jpg',                    en: 'Dungeon Cell — Maya · Arnold',                  es: 'Celda de Mazmorra — Maya · Arnold'              },
  { src: 'images/renderTrexLowPoly3D.png',      en: 'T-Rex Low Poly — Blender · Cycles',            es: 'T-Rex Low Poly — Blender · Cycles'              },
  { src: 'images/botella.jpg',                  en: 'Glass Bottle & Can — Maya · Arnold · Photoshop', es: 'Botella de Cristal y Lata — Maya · Arnold · Photoshop' },
  { src: 'images/renderdonut3D.jpg',            en: 'Donut Study — Blender · Cycles',               es: 'Estudio Donut — Blender · Cycles'               },
];
let galleryActive = 0;

function setGallery(idx) {
  galleryActive = idx;
  const mainImg = document.getElementById('galleryMain');
  const label   = document.getElementById('galleryLabel');
  const thumbs  = document.querySelectorAll('.g-thumb');
  const d       = galleryItems[idx];
  if (!d || !mainImg) return;

  mainImg.style.opacity = '0';
  setTimeout(() => { mainImg.src = d.src; mainImg.style.opacity = '1'; }, 180);

  if (label) {
    const txt = d[currentLang === 'es' ? 'es' : 'en'];
    label.textContent = txt;
    label.setAttribute('data-en', d.en);
    label.setAttribute('data-es', d.es);
  }
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

setInterval(() => {
  galleryActive = (galleryActive + 1) % galleryItems.length;
  setGallery(galleryActive);
}, 4500);


/* ── 13. ACCORDION ─────────────────────────────────────────────── */
function toggleAcc(id) {
  const card = document.getElementById(id);
  if (!card) return;
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.acc-card.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}


/* ── 14. VIDEO PLAYER ──────────────────────────────────────────── */
function playVideo(wrapper) {
  const video = wrapper.querySelector('video');
  const thumb = wrapper.querySelector('.vid-thumb');
  if (!video || !thumb) return;

  thumb.classList.add('hidden');
  wrapper.onclick = null;
  video.setAttribute('controls', '');
  video.play().catch(() => {});

  video.addEventListener('ended', () => {
    thumb.classList.remove('hidden');
    video.removeAttribute('controls');
    video.currentTime = 0;
    wrapper.onclick = () => playVideo(wrapper);
  }, { once: true });
}

/* (bottle video hover removed — now uses standard video-wrap player) */


/* ── 15. LIGHTBOX ──────────────────────────────────────────────── */
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lb-close')) return;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── 15b. VIDEO LIGHTBOX ───────────────────────────────────────── */
function openVideoLightbox(src) {
  const vlb    = document.getElementById('videoLightbox');
  const vid    = document.getElementById('lbVideo');
  const srcEl  = document.getElementById('lbVideoSrc');
  if (!vlb || !vid || !srcEl) return;
  srcEl.src = src;
  vid.load();
  vlb.classList.add('open');
  document.body.style.overflow = 'hidden';
  vid.play().catch(() => {});
}

function closeVideoLightbox(e) {
  if (e && e.target !== document.getElementById('videoLightbox') && !e.target.classList.contains('lb-close')) return;
  const vlb = document.getElementById('videoLightbox');
  const vid = document.getElementById('lbVideo');
  if (!vlb) return;
  if (vid) { vid.pause(); vid.currentTime = 0; }
  vlb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb  = document.getElementById('lightbox');
    const vlb = document.getElementById('videoLightbox');
    if (lb  && lb.classList.contains('open'))  { lb.classList.remove('open');  document.body.style.overflow = ''; }
    if (vlb && vlb.classList.contains('open')) { closeVideoLightbox(); }
  }
});


/* ── 16. CONTACT FORM ──────────────────────────────────────────── */
/* ── GOOGLE APPS SCRIPT URL ────────────────────────────────────────
   Pega aquí la URL que obtienes al implementar google-apps-script.gs
   FORMSPREE — reemplaza Apps Script
   1. Ve a https://formspree.io → Sign up con tu Gmail
   2. "New Form" → ponle nombre → Create Form
   3. Copia la URL del endpoint (ej: https://formspree.io/f/xpzvbwqr)
   4. Pégala abajo sustituyendo PEGA_AQUÍ_TU_ENDPOINT
   ────────────────────────────────────────────────────────────────── */
const FORMSPREE_URL = 'https://formspree.io/f/mzdygrab';

function submitForm(e) {
  e.preventDefault();
  const name    = document.getElementById('fName').value.trim();
  const email   = document.getElementById('fEmail').value.trim();
  const message = document.getElementById('fMsg').value.trim();
  const status  = document.getElementById('fStatus');
  const btn     = e.target.querySelector('button[type="submit"]');

  if (!name || !email || !message) return;

  if (btn) { btn.disabled = true; btn.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…'; }
  if (status) { status.style.display = 'none'; }

  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: 'Portfolio — mensaje de ' + name,
      _replyto: email
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      if (status) {
        status.textContent = currentLang === 'es'
          ? '✓ Mensaje enviado. Te responderé pronto.'
          : '✓ Message sent. I\'ll get back to you soon.';
        status.style.color = '#36C26A';
        status.style.display = 'block';
      }
      e.target.reset();
      setTimeout(() => { if (status) status.style.display = 'none'; }, 6000);
    } else {
      throw new Error('error');
    }
  })
  .catch(() => {
    if (status) {
      status.textContent = currentLang === 'es'
        ? '✗ Error al enviar. Escríbeme a adriancarmonacordoba@gmail.com'
        : '✗ Could not send. Email me at adriancarmonacordoba@gmail.com';
      status.style.color = '#C80A0A';
      status.style.display = 'block';
    }
  })
  .finally(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = currentLang === 'es' ? 'Enviar mensaje' : 'Send message';
    }
  });
}


/* ── 17. MAGNETIC BUTTONS ──────────────────────────────────────── */
function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.btn, .nav-logo, .lang-btn');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.28;
      const dy   = (e.clientY - cy) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}


/* ── 18. CURSOR COLOUR PER SECTION ─────────────────────────────── */
const cursorColours = {
  'hero':     '#E05010',
  'about':    '#06AECA',
  'skills':   '#C08A00',
  'demos':    '#36C26A',
  'work3d':   '#FF4500',
  'gamedev':  '#C0304A',
  'vfx':      '#FFE500',
  'timeline': '#E05010',
  'cv':       '#36C26A',
  'contact':  '#E05010',
};

const cursorColObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const col = cursorColours[e.target.id];
      if (col && dot) dot.style.background = col;
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('section[id]').forEach(s => cursorColObs.observe(s));


/* ── 19. SECTION PARALLAX LAYERS ───────────────────────────────── */
// Give existing deco elements a gentle float on mousemove
const decoParallaxEls = document.querySelectorAll(
  '.deco-circle, .deco-circle-2, .deco-diamond, .deco-diamond-2, .deco-line, .deco-cross'
);

if (decoParallaxEls.length) {
  document.addEventListener('mousemove', () => {}, { passive: true }); // already tracked above

  (function animateDeco() {
    decoParallaxEls.forEach((el, i) => {
      const speed = (i % 2 === 0) ? 8 : -6;
      el.style.transform = `translate(${parallaxX * speed}px, ${parallaxY * speed}px)`;
    });
    requestAnimationFrame(animateDeco);
  })();
}


/* ── 20. CURSOR TRAIL SPARKS ────────────────────────────────────── */
let lastSparkX = 0, lastSparkY = 0;
const SPARK_DIST = 60; // px moved before spawning a spark

document.addEventListener('mousemove', e => {
  const dx = e.clientX - lastSparkX;
  const dy = e.clientY - lastSparkY;
  if (Math.sqrt(dx * dx + dy * dy) < SPARK_DIST) return;
  lastSparkX = e.clientX;
  lastSparkY = e.clientY;

  const spark = document.createElement('div');
  spark.style.cssText = `
    position:fixed;
    left:${e.clientX}px; top:${e.clientY}px;
    width:4px; height:4px;
    border-radius:50%;
    background:${dot ? dot.style.background || '#E05010' : '#E05010'};
    pointer-events:none;
    z-index:9998;
    opacity:0.6;
    transform:translate(-50%,-50%);
    transition:opacity 0.55s ease, transform 0.55s ease;
  `;
  document.body.appendChild(spark);
  requestAnimationFrame(() => {
    spark.style.opacity = '0';
    spark.style.transform = `translate(${(Math.random()-0.5)*30}px, ${-20 - Math.random()*20}px) scale(0)`;
  });
  setTimeout(() => spark.remove(), 600);
}, { passive: true });


/* ── 21. INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);

  const mainImg = document.getElementById('galleryMain');
  if (mainImg) mainImg.style.transition = 'opacity 0.35s ease';

  initMagneticButtons();

  // Art-item videos: muted hover preview, click opens video lightbox
  document.querySelectorAll('.art-item .art-video-fill video').forEach(v => {
    const item = v.closest('.art-item');
    if (!item) return;
    item.addEventListener('mouseenter', () => { v.muted = true; v.play().catch(() => {}); });
    item.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
  });
});