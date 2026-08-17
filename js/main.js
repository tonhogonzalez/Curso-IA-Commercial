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
          <button class="tool-btn" id="btn-zen-mode" title="Modo Enfoque (Atajo: Z)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <span>Modo Enfoque</span>
          </button>
          
          <button class="tool-btn" id="btn-print-page" title="Imprimir o guardar en PDF">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>PDF / Imprimir</span>
          </button>
        </div>
      `;

      pageHeader.parentNode.insertBefore(toolbar, pageHeader.nextSibling);

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
    }
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

  // Keyboard Shortcuts (Z for Zen, Esc to exit Zen)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    
    if (e.key === 'z' || e.key === 'Z') {
      if (isNotebook) {
        e.preventDefault();
        toggleZenMode();
      }
    } else if (e.key === 'Escape') {
      if (document.body.classList.contains('zen-mode')) {
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
