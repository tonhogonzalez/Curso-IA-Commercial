// ============================================
// CURSO IA COMMERCIAL - Main JavaScript
// Theme Engine, Reading Tools, Zen Mode, Navigation
// ============================================

(function(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
})(function() {
  'use strict';

  // --- 1. Theme Switcher Engine ---
  const THEME_KEY = 'curso_ia_theme';
  
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    // Inject Theme Toggle Button into Top Navigation
    const topNav = document.querySelector('.top-nav');
    if (topNav) {
      let navActions = topNav.querySelector('.nav-actions');
      if (!navActions) {
        navActions = document.createElement('div');
        navActions.className = 'nav-actions';
        topNav.appendChild(navActions);
      }

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'theme-toggle-btn';
      toggleBtn.id = 'theme-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Cambiar tema (Claro / Oscuro)');
      toggleBtn.setAttribute('title', 'Alternar modo claro / oscuro');
      toggleBtn.innerHTML = `
        <!-- Sun icon (shown in dark mode) -->
        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;

      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem(THEME_KEY, nextTheme);
      });

      navActions.appendChild(toggleBtn);
    }
  }

  initTheme();

  // --- 1b. Mobile Hamburger Menu ---
  (function initMobileMenu() {
    const topNav = document.querySelector('.top-nav');
    const navLinks = document.querySelector('.nav-links');
    if (!topNav || !navLinks) return;

    // Ensure a menu-toggle button exists (cuaderno pages have it, index/muro may not)
    let menuToggle = topNav.querySelector('.menu-toggle');
    if (!menuToggle) {
      menuToggle = document.createElement('button');
      menuToggle.className = 'menu-toggle';
      menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '☰';
      topNav.insertBefore(menuToggle, topNav.firstChild);
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!topNav.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      }
    });
  })();

  // --- 2. Reading Progress Bar & Local Persistence ---
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const pageId = window.location.pathname.split('/').pop() || 'index';
  const progressKey = `progress_${pageId}`;

  // Check if we have saved progress
  const savedScroll = localStorage.getItem(progressKey);
  if (savedScroll && parseInt(savedScroll) > 500) {
    showProgressToast(parseInt(savedScroll));
  }

  if (progressBarFill) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBarFill.style.width = Math.min(progress, 100) + '%';
      
      localStorage.setItem(progressKey, scrollTop);
    });
  }

  function showProgressToast(targetScroll) {
    const toastHTML = `
      <div id="progress-toast">
        <span id="progress-toast-text">Parece que dejaste esta lectura a medias.</span>
        <button id="progress-toast-btn">Continuar</button>
        <button id="progress-toast-close" aria-label="Cerrar">&times;</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    const toast = document.getElementById('progress-toast');
    const btn = document.getElementById('progress-toast-btn');
    const close = document.getElementById('progress-toast-close');

    setTimeout(() => {
      if (toast) toast.classList.add('visible');
    }, 1000);

    if (btn) {
      btn.addEventListener('click', () => {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        toast.classList.remove('visible');
      });
    }

    if (close) {
      close.addEventListener('click', () => {
        toast.classList.remove('visible');
      });
    }
  }

  // --- 3. Notebook Reading Toolbar & Reading Time Calculation ---
  const contentWrapper = document.querySelector('.content-wrapper');
  const isNotebook = window.location.pathname.includes('/cuadernos/');

  if (isNotebook && contentWrapper) {
    // Calculate reading time
    const textContent = contentWrapper.innerText || '';
    const words = textContent.trim().split(/\s+/).length;
    const readingTimeMin = Math.max(3, Math.ceil(words / 200));

    // Create or inject Toolbar right after .page-header
    const pageHeader = contentWrapper.querySelector('.page-header');
    if (pageHeader) {
      const toolbar = document.createElement('div');
      toolbar.className = 'notebook-toolbar';
      toolbar.innerHTML = `
        <div class="reading-meta-group">
          <span class="reading-time-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>~${readingTimeMin} min de lectura completa</span>
          </span>
        </div>

        <div class="notebook-tools">
          <button class="tool-btn" id="btn-listen-notebook" title="Escuchar cuaderno con narrador de audio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Escuchar</span>
          </button>

          <button class="tool-btn" id="btn-zen-mode" title="Modo Enfoque (Atajo: Z)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <span>Modo Enfoque</span>
          </button>
          
          <button class="tool-btn" id="btn-print-page" title="Imprimir o guardar en PDF (Atajo: P)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>PDF / Imprimir</span>
          </button>

          <button class="tool-btn" id="btn-shortcuts-help" title="Ver atajos de teclado (Atajo: ?)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Atajos</span>
          </button>
        </div>
      `;

      pageHeader.parentNode.insertBefore(toolbar, pageHeader.nextSibling);

      // Listen Full Notebook
      const listenBtn = toolbar.querySelector('#btn-listen-notebook');
      if (listenBtn) {
        listenBtn.addEventListener('click', () => {
          if (window.CursoIATTS) {
            window.CursoIATTS.playAll();
          }
        });
      }

      // Print Handler
      const printBtn = toolbar.querySelector('#btn-print-page');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      // Zen Mode Handler
      const zenBtn = toolbar.querySelector('#btn-zen-mode');
      if (zenBtn) {
        zenBtn.addEventListener('click', toggleZenMode);
      }

      // Shortcuts Help Handler
      const shortcutsBtn = toolbar.querySelector('#btn-shortcuts-help');
      if (shortcutsBtn) {
        shortcutsBtn.addEventListener('click', showShortcutsModal);
      }
    }

    // Inject Inter-Notebook Pagination Footer
    initNotebookPagination();
    // Inject Section Link Copying
    initSectionLinkCopy();
  }

  // --- 3b. Inter-Notebook Pagination Footer ---
  function initNotebookPagination() {
    const NOTEBOOKS_LIST = [
      { id: '01-pep-martorell.html', num: '01', title: 'La Naturaleza de la IA y su Impacto', guest: 'Pep Martorell (Arpa Talks)' },
      { id: '02-javier-ideami.html', num: '02', title: 'Pensamiento Crítico y Prompting', guest: 'Javier Ideami (Tengo un Plan)' },
      { id: '03-compendio-tecnico.html', num: '03', title: 'Compendio Técnico de IA Generativa', guest: 'Compendio Especializado' },
      { id: '04-el-universo-del-transformer.html', num: '04', title: 'El Universo del Transformer y LLMs', guest: 'Compendio Docente Avanzado' },
      { id: '05-paradigmas-y-computacion.html', num: '05', title: 'Compendio Integral: Paradigmas al Grounding y Harness', guest: 'Compendio Integral de 7 Módulos' }
    ];

    const currentFile = window.location.pathname.split('/').pop();
    const currentIdx = NOTEBOOKS_LIST.findIndex(nb => nb.id === currentFile);
    if (currentIdx === -1) return;

    const prevNb = currentIdx > 0 ? NOTEBOOKS_LIST[currentIdx - 1] : null;
    const nextNb = currentIdx < NOTEBOOKS_LIST.length - 1 ? NOTEBOOKS_LIST[currentIdx + 1] : { id: '../recursos.html', num: 'LAB', title: 'Laboratorio de Recursos & Simuladores', guest: 'Herramientas y Playground' };

    const paginationEl = document.createElement('div');
    paginationEl.className = 'notebook-pagination-grid';
    paginationEl.innerHTML = `
      ${prevNb ? `
        <a href="${prevNb.id}" class="pagination-card pagination-prev">
          <span class="pag-dir">← Cuaderno Anterior</span>
          <span class="pag-num">CUADERNO ${prevNb.num}</span>
          <span class="pag-title">${prevNb.title}</span>
          <span class="pag-guest">${prevNb.guest}</span>
        </a>
      ` : `<div></div>`}
      
      ${nextNb ? `
        <a href="${nextNb.id}" class="pagination-card pagination-next">
          <span class="pag-dir">${nextNb.num === 'LAB' ? 'Ir al Laboratorio →' : 'Siguiente Cuaderno →'}</span>
          <span class="pag-num">${nextNb.num === 'LAB' ? 'RECURSOS' : 'CUADERNO ' + nextNb.num}</span>
          <span class="pag-title">${nextNb.title}</span>
          <span class="pag-guest">${nextNb.guest}</span>
        </a>
      ` : `<div></div>`}
    `;

    const siteFooter = document.querySelector('.site-footer');
    if (siteFooter && siteFooter.parentNode) {
      siteFooter.parentNode.insertBefore(paginationEl, siteFooter);
    }
  }

  // --- 3c. Section Link Copying with Toast ---
  function initSectionLinkCopy() {
    const sectionHeaders = document.querySelectorAll('.transcript-section .section-header');
    sectionHeaders.forEach(header => {
      const section = header.closest('.transcript-section');
      if (!section || !section.id) return;

      const linkBtn = document.createElement('button');
      linkBtn.className = 'section-anchor-btn';
      linkBtn.setAttribute('title', 'Copiar enlace a esta sección');
      linkBtn.setAttribute('aria-label', 'Copiar enlace directo');
      linkBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      `;

      linkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
        navigator.clipboard.writeText(url).then(() => {
          showQuickToast('🔗 Enlace a la sección copiado al portapapeles');
        }).catch(() => {
          showQuickToast('Error al copiar enlace');
        });
      });

      header.appendChild(linkBtn);
    });
  }

  function showQuickToast(message) {
    let toast = document.getElementById('quick-action-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'quick-action-toast';
      toast.className = 'quick-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // --- 3d. Keyboard Shortcuts Modal ---
  function showShortcutsModal() {
    let modal = document.getElementById('shortcuts-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'shortcuts-modal-overlay';
      modal.className = 'shortcuts-modal-overlay';
      modal.innerHTML = `
        <div class="shortcuts-modal-card">
          <div class="shortcuts-modal-header">
            <h3>⚡ Atajos de Teclado del Curso</h3>
            <button id="shortcuts-modal-close" class="shortcuts-close-btn">&times;</button>
          </div>
          <div class="shortcuts-grid">
            <div class="shortcut-item">
              <kbd>Z</kbd>
              <span>Alternar Modo Enfoque (Zen Reader)</span>
            </div>
            <div class="shortcut-item">
              <kbd>T</kbd>
              <span>Alternar Tema Claro / Oscuro</span>
            </div>
            <div class="shortcut-item">
              <kbd>P</kbd>
              <span>Imprimir o Exportar a PDF</span>
            </div>
            <div class="shortcut-item">
              <kbd>K</kbd>
              <span>Play / Pausar Narrador de Audio</span>
            </div>
            <div class="shortcut-item">
              <kbd>?</kbd>
              <span>Abrir esta ventana de ayuda</span>
            </div>
            <div class="shortcut-item">
              <kbd>Esc</kbd>
              <span>Cerrar diálogos / Salir de Modo Enfoque</span>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#shortcuts-modal-close').addEventListener('click', () => {
        modal.classList.remove('visible');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('visible');
      });
    }
    modal.classList.add('visible');
  }

  // --- 4. Zen Mode Logic ---
  let zenExitBtn = null;

  function toggleZenMode() {
    const isZen = document.body.classList.toggle('zen-mode');
    
    if (isZen) {
      if (!zenExitBtn) {
        zenExitBtn = document.createElement('button');
        zenExitBtn.id = 'zen-exit-btn';
        zenExitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Salir de Modo Enfoque (Esc)</span>
        `;
        zenExitBtn.addEventListener('click', () => {
          document.body.classList.remove('zen-mode');
          if (zenExitBtn) zenExitBtn.remove();
          zenExitBtn = null;
        });
        document.body.appendChild(zenExitBtn);
      }
    } else {
      if (zenExitBtn) {
        zenExitBtn.remove();
        zenExitBtn = null;
      }
    }
  }

  // Keyboard Shortcuts (Z for Zen, T for theme, P for print, ? for help, Esc to exit)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    
    if (e.key === 'z' || e.key === 'Z') {
      if (isNotebook) {
        e.preventDefault();
        toggleZenMode();
      }
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    } else if (e.key === 'p' || e.key === 'P') {
      if (isNotebook && (e.ctrlKey || e.metaKey)) {
        // native print
      } else if (isNotebook) {
        e.preventDefault();
        window.print();
      }
    } else if (e.key === '?') {
      e.preventDefault();
      showShortcutsModal();
    } else if (e.key === 'Escape') {
      const modal = document.getElementById('shortcuts-modal-overlay');
      if (modal && modal.classList.contains('visible')) {
        modal.classList.remove('visible');
      } else if (document.body.classList.contains('zen-mode')) {
        toggleZenMode();
      }
    }
  });

  // --- 5. Back to Top Button ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 6. Sidebar Active Section Tracking ---
  const sections = document.querySelectorAll('.transcript-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  if (sections.length > 0 && sidebarLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // --- 7. Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }

    // Close sidebar on link click (mobile)
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1100) {
          sidebar.classList.remove('open');
          if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
      });
    });
  }

  // --- 8. Smooth scroll for sidebar links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // --- 9. Animate elements on scroll ---
  const animateElements = document.querySelectorAll('.concept-card, .quote-block, .sim-container, .quiz-section');
  if (animateElements.length > 0) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          animateObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      animateObserver.observe(el);
    });
  }
});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = window.location.pathname.includes('/cuadernos/') ? '../sw.js' : 'sw.js';
    navigator.serviceWorker.register(swPath).then(registration => {
      console.log('ServiceWorker registration successful');
    }, err => {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}
