/* ═══════════════════════════════════════════════════════════
   DISPATCH DESK — main.js
   Handles: navbar scroll, mobile menu, scroll reveal,
            counter animation, form submission
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Navbar scroll behaviour ───────────────────────────────
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


// ─── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ─── Scroll Reveal ─────────────────────────────────────────
const revealElements = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ─── Counter Animation ─────────────────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start     = performance.now();
  const isMillion = target >= 1_000_000;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);

    let current = Math.floor(eased * target);

    if (isMillion) {
      // Show as e.g. "1.2M"
      el.textContent = (current / 1_000_000).toFixed(1) + 'M';
    } else {
      el.textContent = current.toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe all counter elements
const counterEls = document.querySelectorAll('.stat-num, .big-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target, 2000);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));


// ─── Smooth active nav highlight ───────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// ─── Contact Form ──────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simulate send (replace with actual fetch/API call)
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.disabled  = true;
  btn.innerHTML = 'Sending…';

  setTimeout(() => {
    contactForm.reset();
    btn.disabled  = false;
    btn.innerHTML = originalText;
    showToast();
  }, 1200);
});


// ─── Parallax tilt on hero stat cards ──────────────────────
const statCards = document.querySelectorAll('.stat-card');

statCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(400px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ─── Service card entrance stagger ─────────────────────────
// (already handled by CSS delay classes + IntersectionObserver above)


// ─── Cursor glow effect (desktop only) ─────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(13,53,53,0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function animateGlow() {
    currentX += (glowX - currentX) * 0.08;
    currentY += (glowY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top  = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}


// ─── Floating orb subtle mouse parallax ─────────────────────
const orbs = document.querySelectorAll('.orb');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function moveOrbs() {
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 10;
    orb.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
  });
  requestAnimationFrame(moveOrbs);
}
moveOrbs();


// ─── Add active nav link style ──────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `
  .nav-links a.active {
    color: var(--gold) !important;
    background: rgba(212,175,55,0.08) !important;
  }
`;
document.head.appendChild(styleEl);
