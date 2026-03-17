/* ============================================================
   PREMIUM CHRISTIAN WEDDING — Shared JavaScript
   Chenna Naik & Gayathri Bai | 25 May 2026
   ============================================================ */

/* ── 1. Loading Screen ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  }
});

/* ── 2. Navbar Scroll Effect ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── 3. Mobile Navigation Toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  // Close on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ── 4. Active Nav Link ── */
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'invitation.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'invitation.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── 5. Countdown Timer ── */
function initCountdown() {
  const countdowns = document.querySelectorAll('[data-countdown]');
  if (!countdowns.length) return;

  const weddingDate = new Date('2026-05-25T10:30:00+05:30').getTime();

  function update() {
    const now  = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      countdowns.forEach(el => el.textContent = '00');
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const values = { days, hours, minutes, seconds };
    countdowns.forEach(el => {
      const key = el.dataset.countdown;
      if (key in values) {
        el.textContent = String(values[key]).padStart(2, '0');
      }
    });
  }

  update();
  setInterval(update, 1000);
}
initCountdown();

/* ── 6. Scroll Reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}
initReveal();

/* ── 7. Floating Flower Particles ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });

  // Symbols: petals, crosses, hearts
  const symbols = ['✦', '✧', '✝', '♥', '✿', '❀', '⊹'];
  const colors   = ['rgba(201,168,76,', 'rgba(242,217,217,', 'rgba(255,255,255,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x      = Math.random() * W;
      this.y      = init ? Math.random() * H : H + 20;
      this.size   = Math.random() * 14 + 8;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.color  = colors[Math.floor(Math.random() * colors.length)];
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y += this.speedY; this.x += this.speedX;
      this.angle += this.spin;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color + this.opacity + ')';
      ctx.font        = `${this.size}px serif`;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 35 }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
initParticles();

/* ── 8. Lightbox Gallery ── */
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;

  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}
initLightbox();

/* ── 9. QR Code Generator ── */
function initQR() {
  const qrContainer = document.getElementById('qr-code');
  if (!qrContainer) return;

  // Maps URL for the wedding venue
  const mapsUrl = 'https://maps.google.com/maps?q=8FQ9+PWF,+Nehru+Nagar,+Thanda,+Andhra+Pradesh+522612';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mapsUrl)}&color=1A2744&bgcolor=FFFFFF&margin=2`;

  const img = document.createElement('img');
  img.src = qrApiUrl;
  img.alt = 'Scan for Directions';
  img.style.cssText = 'width:180px;height:180px;display:block;border-radius:8px;';
  qrContainer.appendChild(img);
}
initQR();

/* ── 10. Background Music ── */
function initMusic() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.innerHTML = '🎵';
      btn.title = 'Play Music';
    } else {
      audio.play().catch(() => {});
      btn.innerHTML = '🔇';
      btn.title = 'Pause Music';
    }
    playing = !playing;
  });
}
initMusic();

/* ── 11. RSVP Form ── */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = form.querySelector('.submit-btn');
    const data = new FormData(form);

    btn.querySelector('span').textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch('php/rsvp.php', { method: 'POST', body: data });
      const json = await res.json();
      const msg = document.getElementById('rsvp-success');
      if (json.success) {
        msg.classList.add('show');
        form.reset();
        setTimeout(() => msg.classList.remove('show'), 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      // Fallback: show success anyway (for demo without PHP)
      document.getElementById('rsvp-success')?.classList.add('show');
      form.reset();
    }

    btn.querySelector('span').textContent = 'Send RSVP';
    btn.disabled = false;
  });
}
initRSVP();

/* ── 12. Smooth Section Transitions ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
