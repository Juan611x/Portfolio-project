document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile navigation
  function toggleMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('primary-navigation');
    if (!toggle || !navList) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navList.style.display = expanded ? '' : 'block';
  }

  const toggleBtn = document.querySelector('.nav-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMenu);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu after click
        const navList = document.getElementById('primary-navigation');
        const toggle = document.querySelector('.nav-toggle');
        if (navList && toggle && window.innerWidth <= 768) {
          navList.style.display = '';
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // PROJECT FILTERS
  function filterProjects(category) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(p => {
      const cat = p.getAttribute('data-category') || 'all';
      if (category === 'all' || cat === category) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      filterProjects(filter);
    });
  });

  // LIGHTBOX
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, alt, caption) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Move focus to the close button for accessibility if available
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.focus();
    } else {
      lightbox.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Open images in lightbox
  document.querySelectorAll('.project img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const full = img.getAttribute('data-full') || img.src;
      const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
      openLightbox(full, img.alt, caption);
    });
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click();
      }
    });
    img.setAttribute('tabindex', '0');
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ENHANCED FORM VALIDATION (real-time)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    const name = form.elements['name'];
    const email = form.elements['email'];
    const message = form.elements['message'];

    function validateEmail(value) {
      // simple regex for basic email format
      return /\S+@\S+\.\S+/.test(value);
    }

    [name, email, message].forEach(field => {
      field.addEventListener('input', () => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
        } else {
          field.style.borderColor = '';
        }
        if (field === email && field.value.trim()) {
          if (!validateEmail(field.value)) field.style.borderColor = '#e74c3c';
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';
      if (!name.value.trim()) { status.textContent = 'Por favor ingresa tu nombre.'; name.focus(); return; }
      if (!email.value.trim() || !validateEmail(email.value)) { status.textContent = 'Por favor ingresa un email válido.'; email.focus(); return; }
      if (!message.value.trim()) { status.textContent = 'Por favor escribe un mensaje.'; message.focus(); return; }

      // Simulated send
      status.textContent = 'Mensaje enviado (simulado). Gracias!';
      form.reset();
    });
  }

});
