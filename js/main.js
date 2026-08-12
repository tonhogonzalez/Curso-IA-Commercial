// ============================================
// CURSO IA COMMERCIAL - Main JavaScript
// Navigation, Progress, Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Reading Progress Bar & Local Persistence ---
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
      
      // Save progress to local storage (throttle in a real app, but this is okay for now)
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

    // Show after a small delay
    setTimeout(() => {
      toast.classList.add('visible');
    }, 1000);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      toast.classList.remove('visible');
    });

    close.addEventListener('click', () => {
      toast.classList.remove('visible');
    });
  }

  // --- Back to Top Button ---
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

  // --- Sidebar Active Section Tracking ---
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

  // --- Mobile Menu Toggle ---
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

  // --- Smooth scroll for sidebar links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Animate elements on scroll ---
  const animateElements = document.querySelectorAll('.concept-card, .quote-block');
  if (animateElements.length > 0) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          animateObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      animateObserver.observe(el);
    });
  }

});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Determine path based on current location
    const swPath = window.location.pathname.includes('/cuadernos/') ? '../sw.js' : 'sw.js';
    navigator.serviceWorker.register(swPath).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
