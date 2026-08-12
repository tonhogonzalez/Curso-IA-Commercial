// ============================================
// CURSO IA COMMERCIAL - Lienzo (Canvas) Logic
// Draggable, editable notes with export features
// ============================================

(function() {
  'use strict';

  let notes = [];
  const STORAGE_KEY = 'curso_ia_notes';
  
  // DOM Elements
  const board = document.getElementById('canvas-board');
  const container = document.getElementById('lienzo-container');
  
  // Canvas Panning State
  let isPanning = false;
  let startX, startY, scrollLeft, scrollTop;

  function loadNotes() {
    try {
      notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      notes = [];
    }
  }

  function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function renderBoard() {
    board.innerHTML = '';
    
    if (notes.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.position = 'absolute';
      emptyMsg.style.top = '100px';
      emptyMsg.style.left = '50px';
      emptyMsg.style.color = 'var(--text-muted)';
      emptyMsg.style.fontFamily = 'var(--font-body)';
      emptyMsg.innerHTML = '<h2>El lienzo está vacío</h2><p>Ve a los Cuadernos, selecciona cualquier texto y haz clic en "Añadir al Lienzo".</p>';
      board.appendChild(emptyMsg);
      return;
    }

    notes.forEach((note, index) => {
      const el = document.createElement('div');
      el.className = 'post-it';
      el.setAttribute('data-id', note.id);
      el.setAttribute('data-color', note.color);
      
      // Keep within bounds
      let x = note.x || (50 + index * 20);
      let y = note.y || (100 + index * 20);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      el.innerHTML = `
        <div class="post-it-meta">
          <span>${note.notebookNumber} · ${note.guest}</span>
          <a href="${note.url}" title="Ir a la fuente" style="color: inherit; text-decoration: none;">↗</a>
        </div>
        <p class="post-it-text" contenteditable="true" spellcheck="false">${escapeHtml(note.text)}</p>
        <p class="post-it-annotation" contenteditable="true" spellcheck="false">${escapeHtml(note.annotation || '')}</p>
        <div class="post-it-actions">
          <button class="btn-copy" title="Copiar texto"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
          <button class="btn-delete" title="Borrar nota"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
      `;

      board.appendChild(el);

      // Event Listeners for Edit
      const textEl = el.querySelector('.post-it-text');
      const annoEl = el.querySelector('.post-it-annotation');

      const saveEdits = () => {
        note.text = textEl.innerText.trim();
        note.annotation = annoEl.innerText.trim();
        saveNotes();
      };

      textEl.addEventListener('blur', saveEdits);
      annoEl.addEventListener('blur', saveEdits);
      
      // Stop drag propagation when interacting with text
      textEl.addEventListener('mousedown', e => e.stopPropagation());
      annoEl.addEventListener('mousedown', e => e.stopPropagation());

      // Actions
      el.querySelector('.btn-copy').addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(note.text + (note.annotation ? '\n\n---\n' + note.annotation : ''));
        alert('Copiado al portapapeles');
      });

      el.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Borrar esta nota?')) {
          notes = notes.filter(n => n.id !== note.id);
          saveNotes();
          renderBoard();
        }
      });

      // Draggable logic for Post-it
      let isDraggingNode = false;
      let nodeStartX, nodeStartY, initialMouseX, initialMouseY;

      el.addEventListener('mousedown', (e) => {
        if (e.target.isContentEditable || e.target.closest('button') || e.target.closest('a')) return;
        e.stopPropagation();
        
        isDraggingNode = true;
        el.classList.add('dragging');
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        nodeStartX = el.offsetLeft;
        nodeStartY = el.offsetTop;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDraggingNode) return;
        
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;
        
        // Prevent moving outside canvas
        let newX = Math.max(0, nodeStartX + dx);
        let newY = Math.max(0, nodeStartY + dy);
        
        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDraggingNode) {
          isDraggingNode = false;
          el.classList.remove('dragging');
          
          note.x = parseInt(el.style.left);
          note.y = parseInt(el.style.top);
          saveNotes();
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Canvas Panning ---
  container.addEventListener('mousedown', (e) => {
    // Only pan if clicking on the background, not on a post-it
    if (e.target !== board && e.target !== container) return;
    
    isPanning = true;
    startX = e.pageX - container.offsetLeft;
    startY = e.pageY - container.offsetTop;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
  });

  container.addEventListener('mouseleave', () => {
    isPanning = false;
  });

  container.addEventListener('mouseup', () => {
    isPanning = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const y = e.pageY - container.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    container.scrollLeft = scrollLeft - walkX;
    container.scrollTop = scrollTop - walkY;
  });


  // --- Export Markdown ---
  document.getElementById('btn-export-md').addEventListener('click', () => {
    if (notes.length === 0) return alert('El lienzo está vacío.');
    
    let md = '# Lienzo de Conocimiento - Curso IA\n\n';
    
    notes.forEach(note => {
      md += `## ${note.notebookTitle} (${note.guest})\n`;
      md += `> ${note.text.replace(/\\n/g, '\n> ')}\n\n`;
      if (note.annotation) {
        md += `**Anotación:** ${note.annotation}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curso-ia-notas.md';
    a.click();
    URL.revokeObjectURL(url);
  });

  // --- Export PPTX ---
  document.getElementById('btn-export-ppt').addEventListener('click', async () => {
    if (notes.length === 0) return alert('El lienzo está vacío.');
    
    if (typeof PptxGenJS === 'undefined') {
      return alert('La librería de exportación PPTX no se ha cargado.');
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    // Title Slide
    let slide = pptx.addSlide();
    slide.background = { color: "0A0A0F" };
    slide.addText("Notas de Curso IA", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 44, color: "FFFFFF", align: "center", bold: true, fontFace: "Outfit" });
    slide.addText("Conocimiento extraído", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 24, color: "8B5CF6", align: "center", fontFace: "Inter" });

    // One slide per note
    notes.forEach(note => {
      let s = pptx.addSlide();
      s.background = { color: "12121A" };
      
      // Top bar
      s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: "1A1A2E" } });
      s.addText(`${note.notebookTitle}`, { x: 0.2, y: 0.1, w: "50%", h: 0.3, fontSize: 12, color: "A8A4B8", fontFace: "Inter" });
      s.addText(`${note.guest}`, { x: "50%", y: 0.1, w: "48%", h: 0.3, fontSize: 12, color: "A8A4B8", align: "right", fontFace: "Inter" });

      // Quote
      s.addText(`"${note.text}"`, { x: "10%", y: "20%", w: "80%", h: "40%", fontSize: 24, color: "FFFFFF", align: "center", fontFace: "Inter", italic: true });
      
      // Annotation
      if (note.annotation) {
        s.addText(note.annotation, { x: "10%", y: "65%", w: "80%", h: "20%", fontSize: 18, color: "C4B5FD", align: "center", fontFace: "Inter", bold: true });
      }
    });

    pptx.writeFile({ fileName: 'curso-ia-notas.pptx' });
  });

  // --- Clear Board ---
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (notes.length === 0) return;
    if (confirm('¿Estás seguro de que quieres borrar TODAS las notas del lienzo? Esta acción no se puede deshacer.')) {
      notes = [];
      saveNotes();
      renderBoard();
    }
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderBoard();
  });

})();
