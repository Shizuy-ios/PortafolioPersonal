'use strict';

/* ==================== MENÚ MÓVIL ==================== */

const initMobileMenu = () => {
  const header = document.getElementById('header');
  if (!header) return;

  const container = header.querySelector('.container');
  if (!container) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'menu-toggle';
  toggleBtn.className = 'menu-toggle';
  toggleBtn.setAttribute('aria-label', 'Abrir menú');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = '<span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span>';

  const navList = header.querySelector('.header__nav-list');
  if (!navList) return;

  container.insertBefore(toggleBtn, navList);

  const openMenu = () => {
    const isOpen = navList.classList.toggle('header__nav-list--open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  };

  const closeMenu = () => {
    navList.classList.remove('header__nav-list--open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openMenu);

  navList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navList.classList.contains('header__nav-list--open')) {
      closeMenu();
    }
  });

  const handleResize = () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  };

  window.addEventListener('resize', handleResize);
};

/* ==================== ANIMACIONES AL HACER SCROLL ==================== */

const initScrollAnimations = () => {
  const targets = document.querySelectorAll(
    '.section__title, .card, .project, .methodology__step, .contact-list__item, .about-list li'
  );

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
};

/* ==================== FILTRO DE PROYECTOS ==================== */

const initProjectFilters = () => {
  const projectsSection = document.getElementById('proyectos');
  if (!projectsSection) return;

  const projectsGrid = projectsSection.querySelector('.projects');
  if (!projectsGrid) return;

  const projects = projectsGrid.querySelectorAll('.project');
  if (projects.length === 0) return;

  const filterContainer = document.createElement('div');
  filterContainer.id = 'project-filters';
  filterContainer.className = 'project-filters';
  filterContainer.setAttribute('role', 'group');
  filterContainer.setAttribute('aria-label', 'Filtrar proyectos');

  const categories = ['todos', 'web', 'programacion', 'hardware', 'videojuegos'];
  const labels = {
    todos: 'Todos',
    web: 'Web',
    programacion: 'Programación',
    hardware: 'Hardware',
    videojuegos: 'Videojuegos'
  };

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat;
    btn.textContent = labels[cat];
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', cat === 'todos' ? 'true' : 'false');
    filterContainer.appendChild(btn);
  });

  projectsGrid.parentNode.insertBefore(filterContainer, projectsGrid);

  const filterButtons = filterContainer.querySelectorAll('.filter-btn');

  const filterProjects = (category) => {
    projects.forEach((project) => {
      const projectCategory = project.dataset.category || 'todos';
      const isMatch = category === 'todos' || projectCategory === category;

      if (isMatch) {
        project.classList.remove('project--hidden');
        setTimeout(() => {
          project.classList.add('is-visible');
        }, 50);
      } else {
        project.classList.add('project--hidden');
        project.classList.remove('is-visible');
      }
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');
      filterProjects(btn.dataset.filter);
    });
  });
};

/* ==================== VALIDACIÓN DE FORMULARIO ==================== */

const initContactForm = () => {
  const contactSection = document.getElementById('contacto');
  if (!contactSection) return;

  const content = contactSection.querySelector('.section__content');
  if (!content) return;

  const formId = 'contact-form';
  const existingForm = document.getElementById(formId);
  if (existingForm) return;

  const form = document.createElement('form');
  form.id = formId;
  form.className = 'contact-form';
  form.setAttribute('novalidate', '');

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'correo', label: 'Correo electrónico', type: 'email', required: true },
    { name: 'asunto', label: 'Asunto', type: 'text', required: false },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
  ];

  fields.forEach((field) => {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = `contact-${field.name}`;
    label.textContent = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 5;
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.id = `contact-${field.name}`;
    input.name = field.name;
    input.className = 'form-input';
    input.setAttribute('aria-label', field.label);
    input.placeholder = `Tu ${field.label.toLowerCase()}`;

    if (field.required) {
      input.setAttribute('required', '');
    }

    const error = document.createElement('span');
    error.className = 'form-error';
    error.id = `error-${field.name}`;
    error.setAttribute('role', 'alert');

    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(error);
    form.appendChild(group);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = 'Enviar mensaje';
  form.appendChild(submitBtn);

  const confirmation = document.createElement('div');
  confirmation.id = 'form-confirmation';
  confirmation.className = 'form-confirmation';
  confirmation.setAttribute('role', 'status');
  confirmation.setAttribute('aria-live', 'polite');
  form.appendChild(confirmation);

  content.appendChild(form);

  const validateField = (input) => {
    const errorEl = document.getElementById(`error-${input.name}`);
    if (!errorEl) return true;

    const value = input.value.trim();

    if (input.hasAttribute('required') && value === '') {
      errorEl.textContent = 'Este campo es obligatorio.';
      input.classList.add('form-input--error');
      input.classList.remove('form-input--valid');
      return false;
    }

    if (input.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorEl.textContent = 'Ingresa un correo electrónico válido.';
        input.classList.add('form-input--error');
        input.classList.remove('form-input--valid');
        return false;
      }
    }

    errorEl.textContent = '';
    input.classList.remove('form-input--error');
    input.classList.add('form-input--valid');
    return true;
  };

  const validateForm = () => {
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('form-input--error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const confirmationEl = document.getElementById('form-confirmation');
    if (confirmationEl) {
      confirmationEl.textContent = '¡Mensaje enviado! Me pondré en contacto contigo pronto.';
      confirmationEl.classList.add('form-confirmation--success');
    }

    form.reset();
    inputs.forEach((input) => {
      input.classList.remove('form-input--valid', 'form-input--error');
    });

    setTimeout(() => {
      if (confirmationEl) {
        confirmationEl.textContent = '';
        confirmationEl.classList.remove('form-confirmation--success');
      }
    }, 5000);
  });
};

/* ==================== BOTÓN VOLVER ARRIBA ==================== */

const initBackToTop = () => {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.setAttribute('title', 'Volver arriba');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
};

/* ==================== MODO OSCURO / CLARO ==================== */

const initThemeToggle = () => {
  const header = document.getElementById('header');
  if (!header) return;

  const container = header.querySelector('.container');
  if (!container) return;

  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.className = 'theme-toggle';
  themeBtn.setAttribute('aria-label', 'Cambiar tema');
  themeBtn.setAttribute('title', 'Cambiar entre modo oscuro y claro');
  themeBtn.setAttribute('type', 'button');
  themeBtn.innerHTML = '&#9728;';
  container.appendChild(themeBtn);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
    localStorage.setItem('theme', theme);
  };

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
};

/* ==================== EFECTOS INTERACTIVOS EN BOTONES ==================== */

const initButtonEffects = () => {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.96)';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

/* ==================== INICIALIZACIÓN ==================== */

const init = () => {
  initMobileMenu();
  initScrollAnimations();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initThemeToggle();
  initButtonEffects();
};

document.addEventListener('DOMContentLoaded', init);