/**
 * Edit Mode System
 * Allows users to edit the notebook content and saves it to localStorage.
 */

(function() {
  const pageKey = 'ia-curso-content-' + window.location.pathname;

  // 1. Load saved content immediately (synchronously)
  function loadSavedContent() {
    const savedContent = localStorage.getItem(pageKey);
    if (savedContent) {
      const contentArea = document.querySelector('.content-wrapper') || document.querySelector('.content-area');
      if (contentArea) {
        // We only want to replace the sections, not the title/header unless they want to.
        contentArea.innerHTML = savedContent;
      }
    }
  }

  // Load immediately before other scripts run their DOMContentLoaded
  loadSavedContent();

  function initEditMode() {
    const contentArea = document.querySelector('.content-wrapper') || document.querySelector('.content-area');
    if (!contentArea) return;

    // Create floating Edit Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';
    toolbar.innerHTML = `
      <button id="btn-toggle-edit" class="edit-btn">✏️ Modo Edición</button>
      <button id="btn-save-edit" class="edit-btn hidden">💾 Guardar</button>
      <button id="btn-restore-edit" class="edit-btn danger hidden">🔄 Restaurar Original</button>
    `;
    document.body.appendChild(toolbar);

    const btnToggle = document.getElementById('btn-toggle-edit');
    const btnSave = document.getElementById('btn-save-edit');
    const btnRestore = document.getElementById('btn-restore-edit');

    let isEditing = false;

    btnToggle.addEventListener('click', () => {
      isEditing = true;
      contentArea.contentEditable = "true";
      contentArea.classList.add('is-editing');
      
      btnToggle.classList.add('hidden');
      btnSave.classList.remove('hidden');
      btnRestore.classList.remove('hidden');
    });

    btnSave.addEventListener('click', () => {
      isEditing = false;
      contentArea.contentEditable = "false";
      contentArea.classList.remove('is-editing');
      
      btnToggle.classList.remove('hidden');
      btnSave.classList.add('hidden');
      btnRestore.classList.add('hidden');

      saveContent();
      
      // We must reload the page so that glossary and playgrounds re-initialize
      // on the newly cleaned saved HTML.
      window.location.reload();
    });

    btnRestore.addEventListener('click', () => {
      if (confirm("¿Estás seguro de que quieres perder tus apuntes y restaurar el contenido original del curso?")) {
        localStorage.removeItem(pageKey);
        window.location.reload();
      }
    });

    function saveContent() {
      // We need to clone the content area and clean up injected scripts (glossary, playgrounds)
      const clone = contentArea.cloneNode(true);
      
      // 1. Clean Glossary
      const glossarySpans = clone.querySelectorAll('.glossary-term');
      glossarySpans.forEach(span => {
        const text = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(text, span);
      });

      // 2. Clean Pyodide Playground Wrappers
      const wrappers = clone.querySelectorAll('.playground-wrapper');
      wrappers.forEach(wrapper => {
        const pre = wrapper.querySelector('pre.python-playground');
        if (pre) {
          // Remove editable-code class
          const code = pre.querySelector('code') || pre;
          code.removeAttribute('contenteditable');
          code.removeAttribute('spellcheck');
          code.classList.remove('editable-code');
          wrapper.parentNode.replaceChild(pre, wrapper);
        }
      });

      // 3. Clean Mermaid if it has been rendered
      // Mermaid replaces the original text with an SVG. If we save the SVG, the text is lost!
      // This is tricky. We should look for the original text. Mermaid stores it in data-processed="true"
      // Wait, Mermaid v9 parses and replaces inside the div. We might lose the original text.
      // Better strategy: we do not clean Mermaid because Mermaid replaces the text with SVG. 
      // If we save the SVG, it will just show the SVG next time. That's acceptable for static editing.
      // However, we remove contentEditable attributes just in case.
      clone.contentEditable = "false";
      clone.classList.remove('is-editing');

      localStorage.setItem(pageKey, clone.innerHTML);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditMode);
  } else {
    initEditMode();
  }
})();
