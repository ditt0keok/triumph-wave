/* ==========================================================================
   TRIUMPH WAVE — interaksi ringan (tanpa framework)
   1. Menu mobile
   2. Penanda nav aktif saat scroll
   3. Animasi muncul saat scroll
   4. Toast & validasi form contact
   ========================================================================== */

/* ---------- 1. Menu mobile ---------- */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

function setMenu(open) {
  siteNav.classList.toggle('is-open', open);
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}

navToggle.addEventListener('click', () => {
  setMenu(!siteNav.classList.contains('is-open'));
});

// Tutup menu setelah salah satu tautan dipilih
siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Tutup menu dengan tombol Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

// Kalau resize ke desktop, pastikan menu tidak nyangkut terbuka
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) setMenu(false);
});

/* ---------- 2. Nav aktif mengikuti bagian yang terlihat ---------- */
const navLinks = Array.from(document.querySelectorAll('.site-nav__link'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* ---------- 3. Animasi reveal saat scroll ---------- */
const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  // JS mati / pengguna memilih mengurangi animasi → tetap tampilkan semua
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ---------- 4. Toast & form contact ---------- */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

const form = document.getElementById('contact-form');
const status = form.querySelector('.contact-form__status');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();

  if (!name || !email || !message) {
    status.textContent = 'Lengkapi semua kolom dulu ya.';
    status.classList.add('is-error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = 'Format email belum benar. Coba lagi.';
    status.classList.add('is-error');
    return;
  }

  status.classList.remove('is-error');
  status.textContent = `Terima kasih, ${name}! Pesan diterima (mode demo).`;
  form.reset();
  showToast('Pesan tersimpan di demo — belum dikirim ke server.');
});
