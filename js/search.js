// ============================================
// CURSO IA COMMERCIAL - Global Search Engine
// ⌘K / Ctrl+K Command Palette Style (Web Worker version)
// ============================================

(function () {
  'use strict';

  // --- State ---
  let searchWorker = null;
  let isOpen = false;
  let selectedIndex = 0;
  let currentResults = [];
  let latestQuery = '';

  // --- Determine base path ---
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/cuadernos/')) {
      return '../';
    }
    return '';
  }

  // --- Initialize Worker ---
  function initWorker() {
    const basePath = getBasePath();
    searchWorker = new Worker(basePath + 'js/search-worker.js');
    searchWorker.onmessage = function(e) {
      if (e.data.query === latestQuery) {
        renderResults(e.data.results, e.data.query);
      }
    };
  }

  // --- Build Search Overlay DOM ---
  function createSearchUI() {
    const backdrop = document.createElement('div');
    backdrop.id = 'search-backdrop';
    
    backdrop.innerHTML = `
      <div id="search-modal">
        <div id="search-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="search-input" placeholder="Buscar cuadernos, conceptos, citas..." autocomplete="off">
          <button id="search-close" aria-label="Cerrar buscador">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="search-results">
          <!-- Results injected here -->
        </div>
        <div id="search-footer">
          <span id="search-result-count"></span>
          <span class="search-footer-brand">Curso IA Commercial</span>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSearch();
    });
    
    backdrop.querySelector('#search-close').addEventListener('click', closeSearch);

    const input = document.getElementById('search-input');
    input.addEventListener('input', onSearchInput);
    input.addEventListener('keydown', onSearchKeydown);
  }

  // --- Add search trigger button to nav ---
  function addSearchButton() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    const navLinks = nav.querySelector('.nav-links');

    const btn = document.createElement('button');
    btn.id = 'search-trigger';
    btn.setAttribute('aria-label', 'Buscar');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span class="search-trigger-text">Buscar</span>
      <kbd class="search-trigger-kbd">Ctrl K</kbd>
    `;

    btn.addEventListener('click', openSearch);

    if (navLinks) {
      nav.insertBefore(btn, navLinks);
    } else {
      nav.appendChild(btn);
    }
  }

  function normalizeText(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // --- Highlight terms in text ---
  function highlightTerms(text, terms) {
    if (!terms || terms.length === 0) return escapeHtml(text);

    let result = escapeHtml(text);
    const normResult = normalizeText(result);
    
    let highlights = [];
    
    for (const term of terms) {
      let idx = 0;
      while ((idx = normResult.indexOf(term, idx)) !== -1) {
        highlights.push({start: idx, end: idx + term.length});
        idx += term.length;
      }
    }
    
    if (highlights.length === 0) return result;
    
    highlights.sort((a, b) => a.start - b.start);
    const merged = [highlights[0]];
    for (let i = 1; i < highlights.length; i++) {
      const prev = merged[merged.length - 1];
      const curr = highlights[i];
      if (curr.start <= prev.end) {
        prev.end = Math.max(prev.end, curr.end);
      } else {
        merged.push(curr);
      }
    }
    
    for (let i = merged.length - 1; i >= 0; i--) {
      const {start, end} = merged[i];
      result = result.substring(0, start) + '<mark class="search-highlight">' + result.substring(start, end) + '</mark>' + result.substring(end);
    }
    
    return result;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Render Results ---
  function renderResults(results, query) {
    const container = document.getElementById('search-results');
    const countEl = document.getElementById('search-result-count');
    currentResults = results;
    selectedIndex = 0;

    if (!query || query.trim().length < 2) {
      container.innerHTML = `
        <div id="search-empty">
          <div class="search-empty-icon">🔍</div>
          <p>Escribe para buscar en el contenido de todos los cuadernos</p>
          <div class="search-shortcuts">
            <span><kbd>↑↓</kbd> Navegar</span>
            <span><kbd>↵</kbd> Abrir</span>
            <span><kbd>Esc</kbd> Cerrar</span>
          </div>
        </div>
      `;
      countEl.textContent = '';
      return;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div id="search-empty">
          <div class="search-empty-icon">∅</div>
          <p>No se encontraron resultados para «<strong>${escapeHtml(query)}</strong>»</p>
          <p class="search-empty-hint">Prueba con otras palabras o términos más cortos</p>
        </div>
      `;
      countEl.textContent = '0 resultados';
      return;
    }

    const basePath = getBasePath();
    let html = '';
    let currentNotebookId = null;

    results.forEach((r, i) => {
      if (r.notebook.id !== currentNotebookId) {
        currentNotebookId = r.notebook.id;
        html += `
          <div class="search-group-header">
            <span class="search-group-badge">Cuaderno ${r.notebook.number}</span>
            <span class="search-group-title">${escapeHtml(r.notebook.guest)}</span>
          </div>
        `;
      }

      const url = basePath + r.notebook.file + '#' + r.sectionId;
      const highlightedContext = highlightTerms(r.context, r.terms);
      const isSelected = i === selectedIndex ? ' selected' : '';

      html += `
        <a href="${url}" class="search-result-item${isSelected}" data-index="${i}">
          <div class="search-result-section">
            <span class="search-result-number">${r.sectionNumber}</span>
            <span class="search-result-title">${escapeHtml(r.sectionTitle)}</span>
          </div>
          <div class="search-result-context">${highlightedContext}</div>
        </a>
      `;
    });

    container.innerHTML = html;
    countEl.textContent = results.length + (results.length === 1 ? ' resultado' : ' resultados');

    container.querySelectorAll('.search-result-item').forEach((el) => {
      el.addEventListener('mouseenter', () => selectResult(parseInt(el.dataset.index)));
      el.addEventListener('click', closeSearch);
    });
  }

  function selectResult(index) {
    if (index < 0 || index >= currentResults.length) return;
    const container = document.getElementById('search-results');
    container.querySelectorAll('.search-result-item').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
    });
    selectedIndex = index;
    const selected = container.querySelector('.search-result-item.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  // --- Event Handlers ---
  let searchDebounce = null;

  function onSearchInput(e) {
    const query = e.target.value;
    latestQuery = query;

    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      if (searchWorker) {
        searchWorker.postMessage(query);
      }
    }, 80);
  }

  function onSearchKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectResult(Math.min(selectedIndex + 1, currentResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectResult(Math.max(selectedIndex - 0, 0) - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults.length > 0) {
        const selected = document.querySelector('.search-result-item.selected');
        if (selected) {
          closeSearch();
          window.location.href = selected.getAttribute('href');
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
  }

  // --- Open / Close ---
  function openSearch() {
    const backdrop = document.getElementById('search-backdrop');
    if (!backdrop) return;

    isOpen = true;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    const input = document.getElementById('search-input');
    input.value = '';
    input.focus();

    renderResults([], '');

    requestAnimationFrame(() => {
      backdrop.querySelector('#search-modal').classList.add('visible');
    });
  }

  function closeSearch() {
    const backdrop = document.getElementById('search-backdrop');
    if (!backdrop) return;

    isOpen = false;
    const modal = backdrop.querySelector('#search-modal');
    modal.classList.remove('visible');

    setTimeout(() => {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }, 200);
  }

  // --- Global keyboard shortcut ---
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) closeSearch();
      else openSearch();
    }
    if (e.key === '/' && !isOpen) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      e.preventDefault();
      openSearch();
    }
  });

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', () => {
    createSearchUI();
    addSearchButton();
    initWorker();
  });

})();
