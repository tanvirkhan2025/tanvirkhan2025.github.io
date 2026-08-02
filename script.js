// Year stamp
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (dark is the default brand look; light is opt-in, remembered)
const THEME_KEY = 'site-theme';
const themeToggle = document.getElementById('themeToggle');
const themeChangeListeners = [];

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }
  themeChangeListeners.forEach(fn => fn(theme));
}

let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// Animated stat counters
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countObserver.observe(el));
}

// 3D tilt effect on cards
const tiltEls = document.querySelectorAll('.tilt-card, .hero-photo-card');
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isTouch && !reduceMotion) {
  tiltEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });
}

// 3D hero background (Three.js) — degrades gracefully if the CDN script fails to load
(function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined' || reduceMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 34;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const { clientWidth, clientHeight } = canvas.parentElement;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Gold wireframe polyhedra — color adapts to the active theme
  const goldByTheme = { dark: 0xe0b94f, light: 0xa9740f };
  const gold = goldByTheme[currentTheme] || goldByTheme.dark;
  const shapes = [];
  const geoTypes = [
    new THREE.IcosahedronGeometry(9, 0),
    new THREE.OctahedronGeometry(6, 0),
    new THREE.TetrahedronGeometry(5, 0),
  ];
  geoTypes.forEach((geo, i) => {
    const edges = new THREE.EdgesGeometry(geo);
    const material = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.5 });
    const mesh = new THREE.LineSegments(edges, material);
    mesh.position.set((i - 1) * 16, (i % 2 === 0 ? 4 : -6), -10 - i * 6);
    scene.add(mesh);
    shapes.push(mesh);
  });

  // Particle field
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: gold, size: 0.5, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  themeChangeListeners.push((theme) => {
    const hex = goldByTheme[theme] || goldByTheme.dark;
    shapes.forEach(mesh => mesh.material.color.setHex(hex));
    particleMat.color.setHex(hex);
  });

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function animate() {
    requestAnimationFrame(animate);
    shapes.forEach((mesh, i) => {
      mesh.rotation.x += 0.0015 + i * 0.0005;
      mesh.rotation.y += 0.002 + i * 0.0004;
    });
    particles.rotation.y += 0.0003;
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 6 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();
