// ============================================
// CURSO IA COMMERCIAL - Text Highlighter & Study Notes Engine
// Multi-color highlight, contextual study notes, and Markdown/PDF exporter
// ============================================

(function() {
  'use strict';

  let highlightBtn = null;
  let currentSelection = '';
  let currentRange = null;

  const COLOR_MAP = {
    yellow: { label: 'Idea Clave', bg: '#fef08a', text: '#854d0e', border: '#facc15', cssVar: 'var(--accent-amber)' },
    emerald: { label: 'Práctico / Código', bg: '#a7f3d0', text: '#065f46', border: '#34d399', cssVar: 'var(--accent-emerald)' },
    violet: { label: 'Cita / Debate', bg: '#ddd6fe', text: '#5b21b6', border: '#a78bfa', cssVar: 'var(--accent-violet)' }
  };

  // 1. Create the Floating Selection Toolbar
  function createHighlightButton() {
    if (document.getElementById('highlight-btn-group')) return;

    highlightBtn = document.createElement('div');
    highlightBtn.id = 'highlight-btn-group';
    highlightBtn.className = 'highlight-toolbar';
    highlightBtn.style.display = 'none';

    highlightBtn.innerHTML = `
      <div class="highlight-colors">
        <button class="hl-color-btn hl-yellow" data-color="yellow" title="Subrayar: Idea Clave (Amarillo)"></button>
        <button class="hl-color-btn hl-emerald" data-color="emerald" title="Subrayar: Práctico / Código (Verde)"></button>
        <button class="hl-color-btn hl-violet" data-color="violet" title="Subrayar: Cita / Debate (Violeta)"></button>
      </div>
      <div class="hl-divider"></div>
      <button class="hl-action-btn" id="hl-btn-lienzo" title="Enviar al Lienzo de Conocimiento">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Lienzo</span>
      </button>
      <button class="hl-action-btn" id="hl-btn-tutor" title="Preguntar al Tutor IA sobre este texto">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Explicar</span>
      </button>
    `;

    document.body.appendChild(highlightBtn);

    highlightBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // Color buttons
    highlightBtn.querySelectorAll('.hl-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const color = btn.getAttribute('data-color');
        saveSelection(color);
      });
    });

    // Action buttons
    const btnLienzo = document.getElementById('hl-btn-lienzo');
    if (btnLienzo) {
      btnLienzo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveSelection('violet', true);
      });
    }

    const btnTutor = document.getElementById('hl-btn-tutor');
    if (btnTutor) {
      btnTutor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        askTutor();
      });
    }
  }

  // Handle selection changes
  function onSelectionChange() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    // Check if selection is within the notes drawer
    const drawer = document.getElementById('study-notes-drawer');
    if (drawer && drawer.contains(selection.anchorNode)) {
      hideButton();
      return;
    }

    if (text.length > 2) {
      currentSelection = text;
      try {
        currentRange = selection.getRangeAt(0);
        const rect = currentRange.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        highlightBtn.style.display = 'flex';
        
        let top = rect.top + scrollY - 48;
        let left = rect.left + scrollX + (rect.width / 2) - (highlightBtn.offsetWidth / 2);
        
        if (top < scrollY + 10) top = rect.bottom + scrollY + 10;
        if (left < 10) left = 10;
        if (left + highlightBtn.offsetWidth > window.innerWidth - 10) {
          left = window.innerWidth - highlightBtn.offsetWidth - 10;
        }

        highlightBtn.style.top = `${top}px`;
        highlightBtn.style.left = `${left}px`;
      } catch (err) {
        hideButton();
      }
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

  // Notebook context helper
  function getContext() {
    const titleEl = document.querySelector('.page-title');
    const badgeEl = document.querySelector('.meta-badge');
    const guestEl = document.querySelector('.guest-info h3') || document.querySelector('.ep-guest');
    
    const notebookTitle = titleEl ? titleEl.textContent.trim() : document.title.replace('| Curso IA Commercial', '').trim();
    const notebookNumber = badgeEl ? badgeEl.textContent.trim() : 'Cuaderno';
    const guestName = guestEl ? guestEl.textContent.trim() : '';

    return {
      title: notebookTitle,
      number: notebookNumber,
      guest: guestName,
      url: window.location.pathname.split('/').pop() + window.location.hash
    };
  }

  // Save highlight to localStorage
  function saveSelection(color = 'yellow', forceCanvas = false) {
    if (!currentSelection) return;

    try {
      const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
      const context = getContext();
      
      const newNote = {
        id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        text: currentSelection,
        annotation: '',
        color: color,
        notebookNumber: context.number,
        notebookTitle: context.title,
        guest: context.guest,
        url: context.url,
        timestamp: Date.now(),
        x: Math.floor(Math.random() * 100) + 50,
        y: Math.floor(Math.random() * 100) + 50
      };

      notes.unshift(newNote);
      localStorage.setItem('curso_ia_notes', JSON.stringify(notes));

      const label = COLOR_MAP[color] ? COLOR_MAP[color].label : 'Nota';
      showToast(forceCanvas ? '📌 Guardado en el Lienzo' : `✨ Guardado en Mis Notas (${label})`);
      hideButton();
      window.getSelection().removeAllRanges();
      
      updateNotesBadge();
      renderNotesList();
      
    } catch (e) {
      console.error('Error saving note:', e);
      showToast('Error al guardar', true);
    }
  }

  // Ask AI Tutor
  function askTutor() {
    if (!currentSelection) return;
    
    const fab = document.getElementById('ai-tutor-fab');
    const input = document.getElementById('ai-chat-input');
    const submitBtn = document.getElementById('ai-chat-submit');
    
    if (fab && input && submitBtn) {
      const chatModal = document.getElementById('ai-tutor-chat');
      if (chatModal) chatModal.classList.add('visible');
      
      input.value = `Explícame este fragmento con precisión técnica y un ejemplo:\n"${currentSelection}"`;
      submitBtn.click();
      
      hideButton();
      window.getSelection().removeAllRanges();
    } else {
      showToast('Tutor IA no disponible', true);
    }
  }

  // Toast notifications
  function showToast(message, isError = false) {
    let toast = document.getElementById('highlight-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'highlight-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = isError ? 'var(--accent-rose, #f43f5e)' : 'var(--accent-violet, #8b5cf6)';
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  // 2. Study Notes Drawer UI
  function createStudyNotesDrawer() {
    if (document.getElementById('study-notes-drawer')) return;

    // Create Drawer FAB Toggle Button
    const fabNotes = document.createElement('button');
    fabNotes.id = 'fab-study-notes';
    fabNotes.className = 'fab-study-notes';
    fabNotes.setAttribute('aria-label', 'Abrir Mis Notas de Estudio');
    fabNotes.setAttribute('title', 'Mis Notas de Estudio & Resúmenes');
    fabNotes.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
      <span class="notes-count-badge" id="notes-count-badge">0</span>
    `;
    document.body.appendChild(fabNotes);

    // Create Drawer Overlay & Panel
    const drawerOverlay = document.createElement('div');
    drawerOverlay.id = 'study-notes-overlay';
    drawerOverlay.className = 'notes-drawer-overlay';

    const drawer = document.createElement('div');
    drawer.id = 'study-notes-drawer';
    drawer.className = 'notes-drawer-panel';
    drawer.innerHTML = `
      <div class="notes-drawer-header">
        <div class="notes-drawer-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <h3>Mis Notas de Estudio</h3>
          <span class="notes-pill-badge" id="drawer-notes-count">0 notas</span>
        </div>
        <button class="notes-drawer-close" id="notes-drawer-close" aria-label="Cerrar notas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Controls & Filters -->
      <div class="notes-drawer-toolbar">
        <input type="text" id="notes-search-input" class="notes-search-input" placeholder="Filtrar notas por palabra clave...">
        
        <div class="notes-filter-chips">
          <button class="notes-chip active" data-filter="all">Todas</button>
          <button class="notes-chip chip-yellow" data-filter="yellow">Ideas Clave</button>
          <button class="notes-chip chip-emerald" data-filter="emerald">Práctica</button>
          <button class="notes-chip chip-violet" data-filter="violet">Citas</button>
        </div>
      </div>

      <!-- Notes Content List -->
      <div class="notes-drawer-body" id="notes-drawer-body">
        <div class="notes-empty-state">
          <p>Aún no has guardado notas.</p>
          <small>Selecciona cualquier texto en un cuaderno para subrayarlo con color y agregarlo a tu resumen personal.</small>
        </div>
      </div>

      <!-- Footer Export Actions -->
      <div class="notes-drawer-footer">
        <button class="btn-notes-action" id="btn-export-notes-md" title="Descargar resumen estructurado en Markdown">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Exportar Markdown
        </button>
        <button class="btn-notes-action" id="btn-print-notes-pdf" title="Imprimir o guardar en PDF">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Imprimir / PDF
        </button>
        <button class="btn-notes-action danger" id="btn-clear-all-notes" title="Borrar todas las notas">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Limpiar
        </button>
      </div>
    `;

    document.body.appendChild(drawerOverlay);
    document.body.appendChild(drawer);

    // Toggle Drawer
    fabNotes.addEventListener('click', () => {
      openNotesDrawer();
    });

    drawerOverlay.addEventListener('click', closeNotesDrawer);
    document.getElementById('notes-drawer-close').addEventListener('click', closeNotesDrawer);

    // Filter Chips
    drawer.querySelectorAll('.notes-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        drawer.querySelectorAll('.notes-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderNotesList();
      });
    });

    // Search input
    document.getElementById('notes-search-input').addEventListener('input', () => {
      renderNotesList();
    });

    // Actions
    document.getElementById('btn-export-notes-md').addEventListener('click', exportNotesToMarkdown);
    document.getElementById('btn-print-notes-pdf').addEventListener('click', printNotes);
    document.getElementById('btn-clear-all-notes').addEventListener('click', clearAllNotes);

    updateNotesBadge();
  }

  function openNotesDrawer() {
    const overlay = document.getElementById('study-notes-overlay');
    const drawer = document.getElementById('study-notes-drawer');
    if (overlay && drawer) {
      overlay.classList.add('visible');
      drawer.classList.add('visible');
      renderNotesList();
    }
  }

  function closeNotesDrawer() {
    const overlay = document.getElementById('study-notes-overlay');
    const drawer = document.getElementById('study-notes-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('visible');
      drawer.classList.remove('visible');
    }
  }

  function updateNotesBadge() {
    const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
    const badge = document.getElementById('notes-count-badge');
    const drawerBadge = document.getElementById('drawer-notes-count');
    
    if (badge) {
      badge.textContent = notes.length;
      badge.style.display = notes.length > 0 ? 'inline-block' : 'none';
    }
    if (drawerBadge) {
      drawerBadge.textContent = `${notes.length} ${notes.length === 1 ? 'nota' : 'notas'}`;
    }
  }

  // Render list of notes inside drawer
  function renderNotesList() {
    const container = document.getElementById('notes-drawer-body');
    if (!container) return;

    const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
    const activeFilter = document.querySelector('.notes-chip.active')?.getAttribute('data-filter') || 'all';
    const searchQuery = (document.getElementById('notes-search-input')?.value || '').toLowerCase().trim();

    let filtered = notes.filter(note => {
      const matchFilter = activeFilter === 'all' || note.color === activeFilter;
      const matchSearch = !searchQuery || 
        (note.text && note.text.toLowerCase().includes(searchQuery)) ||
        (note.annotation && note.annotation.toLowerCase().includes(searchQuery)) ||
        (note.notebookTitle && note.notebookTitle.toLowerCase().includes(searchQuery));
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="notes-empty-state">
          <p>${notes.length === 0 ? 'Aún no has guardado notas de estudio.' : 'No se encontraron notas con los filtros actuales.'}</p>
          <small>${notes.length === 0 ? 'Selecciona texto en cualquier cuaderno para subrayarlo con color y agregarlo aquí.' : 'Prueba a cambiar el filtro o el término de búsqueda.'}</small>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(note => {
      const colorInfo = COLOR_MAP[note.color] || COLOR_MAP.yellow;
      const dateStr = note.timestamp ? new Date(note.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
      
      return `
        <div class="note-study-card" data-note-id="${note.id}" style="border-left: 4px solid ${colorInfo.border};">
          <div class="note-card-meta">
            <div class="note-card-tags">
              <span class="note-tag-badge" style="background: ${colorInfo.bg}; color: ${colorInfo.text};">${colorInfo.label}</span>
              <span class="note-source-badge">${note.notebookNumber || 'Cuaderno'}</span>
            </div>
            <span class="note-date">${dateStr}</span>
          </div>

          <blockquote class="note-quote-text">${escapeHTML(note.text)}</blockquote>

          <div class="note-annotation-container">
            <textarea class="note-annotation-input" placeholder="Añadir comentario o reflexión personal..." data-id="${note.id}">${escapeHTML(note.annotation || '')}</textarea>
          </div>

          <div class="note-card-actions">
            ${note.url ? `<a href="${note.url}" class="note-link-btn" title="Ir a la sección de origen">🔗 Ir a sección</a>` : ''}
            <button class="note-delete-btn" data-id="${note.id}" title="Eliminar nota">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners to annotations and delete buttons
    container.querySelectorAll('.note-annotation-input').forEach(textarea => {
      textarea.addEventListener('input', function() {
        const id = this.getAttribute('data-id');
        updateNoteAnnotation(id, this.value);
      });
    });

    container.querySelectorAll('.note-delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteNote(id);
      });
    });
  }

  function updateNoteAnnotation(id, annotation) {
    try {
      const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
      const target = notes.find(n => n.id === id);
      if (target) {
        target.annotation = annotation;
        localStorage.setItem('curso_ia_notes', JSON.stringify(notes));
      }
    } catch (e) {
      console.error('Error updating note annotation:', e);
    }
  }

  function deleteNote(id) {
    try {
      let notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
      notes = notes.filter(n => n.id !== id);
      localStorage.setItem('curso_ia_notes', JSON.stringify(notes));
      updateNotesBadge();
      renderNotesList();
      showToast('Nota eliminada');
    } catch (e) {
      console.error('Error deleting note:', e);
    }
  }

  function clearAllNotes() {
    if (!confirm('¿Estás seguro de que deseas eliminar todas tus notas de estudio? Esta acción no se puede deshacer.')) return;
    localStorage.setItem('curso_ia_notes', '[]');
    updateNotesBadge();
    renderNotesList();
    showToast('Todas las notas han sido eliminadas');
  }

  // 3. Export to Markdown
  function exportNotesToMarkdown() {
    const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
    if (notes.length === 0) {
      alert('No tienes notas guardadas para exportar.');
      return;
    }

    let md = `# 📚 Mis Notas de Estudio — Curso IA Commercial\n\n`;
    md += `*Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}*\n\n---\n\n`;

    // Group by Notebook
    const grouped = {};
    notes.forEach(note => {
      const groupKey = note.notebookTitle ? `${note.notebookNumber} — ${note.notebookTitle}` : 'Notas Generales';
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(note);
    });

    for (const [groupName, groupNotes] of Object.entries(grouped)) {
      md += `## 📖 ${groupName}\n\n`;
      
      groupNotes.forEach((note, idx) => {
        const colorLabel = COLOR_MAP[note.color]?.label || 'Nota';
        md += `### ${idx + 1}. [${colorLabel}] ${note.guest ? `(${note.guest})` : ''}\n\n`;
        md += `> "${note.text.replace(/\n/g, '\n> ')}"\n\n`;
        if (note.annotation && note.annotation.trim()) {
          md += `**📝 Comentario / Reflexión:**\n${note.annotation}\n\n`;
        }
        if (note.url) {
          md += `*Enlace:* \`${note.url}\`\n\n`;
        }
        md += `---\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Notas_Estudio_Curso_IA_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Archivo Markdown descargado');
  }

  // 4. Print / PDF Export
  function printNotes() {
    const notes = JSON.parse(localStorage.getItem('curso_ia_notes') || '[]');
    if (notes.length === 0) {
      alert('No tienes notas guardadas para imprimir.');
      return;
    }

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Por favor habilita las ventanas emergentes para imprimir.');
      return;
    }

    let notesHtml = notes.map(note => {
      const colorInfo = COLOR_MAP[note.color] || COLOR_MAP.yellow;
      return `
        <div style="margin-bottom: 24px; padding: 16px; border-left: 4px solid ${colorInfo.border}; background: #fafafa; page-break-inside: avoid; border-radius: 4px; font-family: system-ui, sans-serif;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <strong>${note.notebookNumber || ''} — ${note.notebookTitle || 'Cuaderno'}</strong>
            <span>${colorInfo.label}</span>
          </div>
          <blockquote style="margin: 0 0 10px 0; font-style: italic; color: #222; font-size: 14px; line-height: 1.6;">
            "${escapeHTML(note.text)}"
          </blockquote>
          ${note.annotation ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #ddd; font-size: 13px; color: #444;">
              <strong>Reflexión:</strong> ${escapeHTML(note.annotation)}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Notas de Estudio — Curso IA Commercial</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #111; }
          h1 { font-size: 22px; border-bottom: 2px solid #333; padding-bottom: 8px; }
          .header-meta { color: #666; font-size: 13px; margin-bottom: 24px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>📚 Resumen Personal de Estudio — Curso IA Commercial</h1>
        <div class="header-meta">Generado el ${new Date().toLocaleDateString()} · Total: ${notes.length} notas seleccionadas</div>
        ${notesHtml}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Initialize
  (function(fn) { 
    if (document.readyState === 'loading') { 
      document.addEventListener('DOMContentLoaded', fn); 
    } else { 
      fn(); 
    } 
  })(() => {
    createHighlightButton();
    createStudyNotesDrawer();

    document.addEventListener('mouseup', () => {
      setTimeout(onSelectionChange, 20);
    });

    document.addEventListener('keyup', (e) => {
      if (e.shiftKey && e.key.includes('Arrow')) {
        setTimeout(onSelectionChange, 20);
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (highlightBtn && !highlightBtn.contains(e.target)) {
        hideButton();
      }
    });
  });

})();
