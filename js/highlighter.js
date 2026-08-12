// ============================================
// CURSO IA COMMERCIAL - Text Highlighter
// Captures text selections and saves to the Canvas
// ============================================

(function() {
  'use strict';

  let highlightBtn = null;
  let currentSelection = '';
  let currentRange = null;

  // Create the floating buttons container
  function createHighlightButton() {
    highlightBtn = document.createElement('div');
    highlightBtn.id = 'highlight-btn-group';
    highlightBtn.style.display = 'none';
    highlightBtn.style.position = 'absolute';
    highlightBtn.style.zIndex = '9999';
    highlightBtn.style.display = 'flex';
    highlightBtn.style.gap = '8px';
    
    const btnLienzo = document.createElement('button');
    btnLienzo.className = 'highlight-action-btn';
    btnLienzo.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
      Al Lienzo
    `;
    
    const btnTutor = document.createElement('button');
    btnTutor.className = 'highlight-action-btn';
    btnTutor.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      Explicar
    `;

    highlightBtn.appendChild(btnLienzo);
    highlightBtn.appendChild(btnTutor);
    document.body.appendChild(highlightBtn);

    highlightBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    btnLienzo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveSelection();
    });

    btnTutor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      askTutor();
    });
  }

  // Handle selection changes
  function onSelectionChange() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      currentSelection = text;
      currentRange = selection.getRangeAt(0);

      // Position the button
      const rect = currentRange.getBoundingClientRect();
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      highlightBtn.style.display = 'flex';
      
      // Try to center above the selection
      let top = rect.top + scrollY - 45;
      let left = rect.left + scrollX + (rect.width / 2) - (highlightBtn.offsetWidth / 2);
      
      // Keep on screen
      if (top < scrollY) top = rect.bottom + scrollY + 10;
      if (left < 10) left = 10;

      highlightBtn.style.top = `${top}px`;
      highlightBtn.style.left = `${left}px`;
      
    } else {
      hideButton();
    }
  }

  function hideButton() {
    if (highlightBtn) {
      highlightBtn.style.display = 'none';
      currentSelection = '';
      currentRange = null;
    }
  }

  // Get current notebook context (requires metadata in DOM)
  function getContext() {
    const titleEl = document.querySelector('.page-title');
    const badgeEl = document.querySelector('.meta-badge');
    const guestEl = document.querySelector('.guest-info h3');
    
    const notebookTitle = titleEl ? titleEl.textContent.trim() : document.title;
    const notebookNumber = badgeEl ? badgeEl.textContent.trim() : 'Cuaderno';
    const guestName = guestEl ? guestEl.textContent.trim() : '';

    return {
      title: notebookTitle,
      number: notebookNumber,
      guest: guestName,
      url: window.location.pathname + window.location.hash
    };
  }

  // Save to localStorage
  function saveSelection() {
    if (!currentSelection) return;

    try {
      const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
      const context = getContext();
      
      // Random accent color
      const colors = ['violet', 'cyan', 'amber', 'emerald', 'pink'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const newNote = {
        id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        text: currentSelection,
        annotation: '', // User can add annotations later in the canvas
        notebookNumber: context.number,
        notebookTitle: context.title,
        guest: context.guest,
        url: context.url,
        color: color,
        timestamp: Date.now(),
        x: Math.floor(Math.random() * 100) + 50, // Initial random position on canvas
        y: Math.floor(Math.random() * 100) + 50
      };

      notes.push(newNote);
      localStorage.setItem('curso_ia_notes', JSON.stringify(notes));

      showToast('Enviado al Lienzo');
      hideButton();
      window.getSelection().removeAllRanges();
      
    } catch (e) {
      console.error('Error saving note:', e);
      showToast('Error al guardar', true);
    }
  }

  // Ask AI Tutor
  function askTutor() {
    if (!currentSelection) return;
    
    // Check if AI Tutor is initialized
    const fab = document.getElementById('ai-tutor-fab');
    const input = document.getElementById('ai-chat-input');
    const submitBtn = document.getElementById('ai-chat-submit');
    
    if (fab && input && submitBtn) {
      // Open tutor
      const chatModal = document.getElementById('ai-tutor-chat');
      if (chatModal) {
        chatModal.classList.add('visible');
      }
      
      // Send message
      input.value = `Explícame este fragmento:\n"${currentSelection}"`;
      
      // Trigger submission
      submitBtn.click();
      
      hideButton();
      window.getSelection().removeAllRanges();
    } else {
      showToast('Tutor IA no disponible', true);
    }
  }

  // Show confirmation toast
  function showToast(message, isError = false) {
    let toast = document.getElementById('highlight-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'highlight-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = isError ? 'var(--accent-rose)' : 'var(--accent-emerald)';
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  // Setup event listeners
  (function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })( () => {
    createHighlightButton();

    // Document mouse up for selection
    document.addEventListener('mouseup', () => {
      setTimeout(onSelectionChange, 10);
    });

    // Handle selection by keyboard
    document.addEventListener('keyup', (e) => {
      if (e.shiftKey && e.key.includes('Arrow')) {
        setTimeout(onSelectionChange, 10);
      }
    });

    // Hide when clicking elsewhere
    document.addEventListener('mousedown', (e) => {
      if (e.target !== highlightBtn && !highlightBtn.contains(e.target)) {
        hideButton();
      }
    });
  });

})();
