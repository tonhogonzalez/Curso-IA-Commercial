// ============================================
// CURSO IA COMMERCIAL - Lienzo (Canvas) Logic
// Draggable, editable notes with connectors, filters & Obsidian export
// ============================================

(function() {
  'use strict';

  let notes = [];
  let connections = []; // Array of { fromId, toId }
  const STORAGE_KEY = 'curso_ia_notes';
  const CONNECTIONS_KEY = 'curso_ia_connections';
  
  // DOM Elements
  const board = document.getElementById('canvas-board');
  const container = document.getElementById('lienzo-container');
  const svgLayer = document.getElementById('canvas-svg-layer');
  
  // State
  let isPanning = false;
  let startX, startY, scrollLeft, scrollTop;
  let activeFilter = 'all';
  let isConnectingMode = false;
  let connectSourceNode = null;

  function loadData() {
    try {
      notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      notes = [];
    }

    try {
      connections = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]');
    } catch (e) {
      connections = [];
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  }

  function renderBoard() {
    // Keep SVG Layer, remove existing post-its
    const existingPostIts = board.querySelectorAll('.post-it, .empty-canvas-msg');
    existingPostIts.forEach(p => p.remove());
    
    // Filter notes
    const visibleNotes = notes.filter(n => {
      if (activeFilter === 'all') return true;
      const nbNum = (n.notebookNumber || '').toLowerCase();
      const nbId = (n.notebookId || '').toLowerCase();
      if (activeFilter === '01' && (nbNum.includes('01') || nbId.includes('pep'))) return true;
      if (activeFilter === '02' && (nbNum.includes('02') || nbId.includes('ideami'))) return true;
      if (activeFilter === '03' && (nbNum.includes('03') || nbId.includes('compendio') || nbId.includes('tecnico'))) return true;
      return false;
    });

    if (visibleNotes.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-canvas-msg';
      emptyMsg.style.position = 'absolute';
      emptyMsg.style.top = '100px';
      emptyMsg.style.left = '50px';
      emptyMsg.style.color = 'var(--text-muted)';
      emptyMsg.style.fontFamily = 'var(--font-body)';
      emptyMsg.innerHTML = '<h2>El lienzo no tiene notas visibles</h2><p>Selecciona texto en los Cuadernos para añadir citas, o pulsa en <strong>"+ Nueva Nota"</strong> arriba.</p>';
      board.appendChild(emptyMsg);
      renderConnections();
      return;
    }

    visibleNotes.forEach((note, index) => {
      const el = document.createElement('div');
      el.className = 'post-it';
      el.setAttribute('data-id', note.id);
      el.setAttribute('data-color', note.color || 'violet');
      
      let x = note.x !== undefined ? note.x : (50 + (index % 5) * 320);
      let y = note.y !== undefined ? note.y : (100 + Math.floor(index / 5) * 260);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      el.innerHTML = `
        <div class="post-it-meta">
          <span>${note.notebookNumber || 'NOTA LIBRE'} · ${note.guest || 'Idea Propia'}</span>
          ${note.url ? `<a href="${note.url}" title="Ir a la fuente" style="color: inherit; text-decoration: none;">↗</a>` : ''}
        </div>
        <p class="post-it-text" contenteditable="true" spellcheck="false">${escapeHtml(note.text)}</p>
        <p class="post-it-annotation" contenteditable="true" spellcheck="false" placeholder="Escribe tu reflexión...">${escapeHtml(note.annotation || '')}</p>
        <div class="post-it-actions">
          <button class="btn-connect-from" title="Conectar con otra nota"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></button>
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
        saveData();
      };

      textEl.addEventListener('blur', saveEdits);
      annoEl.addEventListener('blur', saveEdits);
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
          connections = connections.filter(c => c.fromId !== note.id && c.toId !== note.id);
          saveData();
          renderBoard();
        }
      });

      // Connect Button
      el.querySelector('.btn-connect-from').addEventListener('click', (e) => {
        e.stopPropagation();
        handleConnectNodeClick(note.id, el);
      });

      // Node click in connect mode
      el.addEventListener('click', () => {
        if (isConnectingMode) {
          handleConnectNodeClick(note.id, el);
        }
      });

      // Draggable logic for Post-it
      let isDraggingNode = false;
      let nodeStartX, nodeStartY, initialMouseX, initialMouseY;

      el.addEventListener('mousedown', (e) => {
        if (e.target.isContentEditable || e.target.closest('button') || e.target.closest('a')) return;
        if (isConnectingMode) return;
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
        
        let newX = Math.max(0, nodeStartX + dx);
        let newY = Math.max(0, nodeStartY + dy);
        
        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
        
        note.x = newX;
        note.y = newY;
        
        // Update connecting lines in real-time
        renderConnections();
      });

      document.addEventListener('mouseup', () => {
        if (isDraggingNode) {
          isDraggingNode = false;
          el.classList.remove('dragging');
          saveData();
        }
      });
    });

    renderConnections();
  }

  function handleConnectNodeClick(nodeId, nodeEl) {
    if (!connectSourceNode) {
      connectSourceNode = { id: nodeId, el: nodeEl };
      nodeEl.classList.add('is-connecting');
    } else {
      if (connectSourceNode.id !== nodeId) {
        // Create connection
        const exists = connections.some(c => (c.fromId === connectSourceNode.id && c.toId === nodeId));
        if (!exists) {
          connections.push({ fromId: connectSourceNode.id, toId: nodeId });
          saveData();
        }
      }
      connectSourceNode.el.classList.remove('is-connecting');
      connectSourceNode = null;
      renderConnections();
    }
  }

  function renderConnections() {
    if (!svgLayer) return;
    
    // Clear paths except defs
    const oldPaths = svgLayer.querySelectorAll('path');
    oldPaths.forEach(p => p.remove());

    connections.forEach((conn, connIdx) => {
      const fromEl = board.querySelector(`.post-it[data-id="${conn.fromId}"]`);
      const toEl = board.querySelector(`.post-it[data-id="${conn.toId}"]`);

      if (fromEl && toEl) {
        const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2;
        const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2;
        const x2 = toEl.offsetLeft + toEl.offsetWidth / 2;
        const y2 = toEl.offsetTop + toEl.offsetHeight / 2;

        const dx = (x2 - x1) * 0.5;
        const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'canvas-connector-line');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.style.cursor = 'pointer';

        // Double click to remove connection
        path.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          connections.splice(connIdx, 1);
          saveData();
          renderConnections();
        });

        svgLayer.appendChild(path);
      }
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
    if (e.target !== board && e.target !== container && e.target !== svgLayer) return;
    
    isPanning = true;
    startX = e.pageX - container.offsetLeft;
    startY = e.pageY - container.offsetTop;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
  });

  container.addEventListener('mouseleave', () => { isPanning = false; });
  container.addEventListener('mouseup', () => { isPanning = false; });

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

  // --- Filter Chips ---
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderBoard();
    });
  });

  // --- Add Free Note ---
  const addBtn = document.getElementById('btn-add-note');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const newNote = {
        id: 'note_' + Date.now(),
        notebookTitle: 'Nota de Estudio',
        notebookNumber: 'LIBRE',
        guest: 'Anotación Personal',
        text: 'Escribe aquí tu nueva idea o concepto sintetizado...',
        annotation: '',
        color: 'violet',
        x: container.scrollLeft + 150,
        y: container.scrollTop + 150
      };
      notes.push(newNote);
      saveData();
      renderBoard();
    });
  }

  // --- Toggle Connect Mode ---
  const connectBtn = document.getElementById('btn-connect-mode');
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      isConnectingMode = !isConnectingMode;
      connectBtn.classList.toggle('active', isConnectingMode);
      if (!isConnectingMode && connectSourceNode) {
        connectSourceNode.el.classList.remove('is-connecting');
        connectSourceNode = null;
      }
    });
  }

  // --- Export Obsidian Canvas (.canvas) ---
  const exportObsidianBtn = document.getElementById('btn-export-obsidian');
  if (exportObsidianBtn) {
    exportObsidianBtn.addEventListener('click', () => {
      if (notes.length === 0) return alert('El lienzo está vacío.');

      const canvasJson = {
        nodes: notes.map((n, i) => ({
          id: n.id,
          type: "text",
          text: `### ${n.notebookTitle || 'Nota'} (${n.guest || ''})\n\n> ${n.text}\n\n${n.annotation ? `**Reflexión:** ${n.annotation}` : ''}`,
          x: n.x || (i * 320),
          y: n.y || 100,
          width: 320,
          height: 240,
          color: "4"
        })),
        edges: connections.map((c, i) => ({
          id: `edge_${i}_${Date.now()}`,
          fromNode: c.fromId,
          fromSide: "right",
          toNode: c.toId,
          toSide: "left"
        }))
      };

      const blob = new Blob([JSON.stringify(canvasJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'curso-ia-lienzo.canvas';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // --- Export Markdown ---
  const exportMdBtn = document.getElementById('btn-export-md');
  if (exportMdBtn) {
    exportMdBtn.addEventListener('click', () => {
      if (notes.length === 0) return alert('El lienzo está vacío.');
      
      let md = '# Lienzo de Conocimiento - Curso IA\n\n';
      notes.forEach(note => {
        md += `## ${note.notebookTitle} (${note.guest})\n`;
        md += `> ${(note.text || '').replace(/\n/g, '\n> ')}\n\n`;
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
  }

  // --- Export PPTX ---
  const exportPptBtn = document.getElementById('btn-export-ppt');
  if (exportPptBtn) {
    exportPptBtn.addEventListener('click', async () => {
      if (notes.length === 0) return alert('El lienzo está vacío.');
      
      if (typeof PptxGenJS === 'undefined') {
        return alert('La librería de exportación PPTX no se ha cargado.');
      }

      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      let slide = pptx.addSlide();
      slide.background = { color: "0A0A0F" };
      slide.addText("Notas de Curso IA", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 44, color: "FFFFFF", align: "center", bold: true, fontFace: "Outfit" });
      slide.addText("Conocimiento y Mapas Conceptuales", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 24, color: "8B5CF6", align: "center", fontFace: "Inter" });

      notes.forEach(note => {
        let s = pptx.addSlide();
        s.background = { color: "12121A" };
        s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: "1A1A2E" } });
        s.addText(`${note.notebookTitle || 'Nota'}`, { x: 0.2, y: 0.1, w: "50%", h: 0.3, fontSize: 12, color: "A8A4B8", fontFace: "Inter" });
        s.addText(`${note.guest || ''}`, { x: "50%", y: 0.1, w: "48%", h: 0.3, fontSize: 12, color: "A8A4B8", align: "right", fontFace: "Inter" });

        s.addText(`"${note.text}"`, { x: "10%", y: "20%", w: "80%", h: "40%", fontSize: 22, color: "FFFFFF", align: "center", fontFace: "Inter", italic: true });
        
        if (note.annotation) {
          s.addText(note.annotation, { x: "10%", y: "65%", w: "80%", h: "20%", fontSize: 18, color: "C4B5FD", align: "center", fontFace: "Inter", bold: true });
        }
      });

      pptx.writeFile({ fileName: 'curso-ia-notas.pptx' });
    });
  }

  // --- Clear Board ---
  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (notes.length === 0) return;
      if (confirm('¿Estás seguro de que quieres borrar TODAS las notas y conexiones del lienzo? Esta acción no se puede deshacer.')) {
        notes = [];
        connections = [];
        saveData();
        renderBoard();
      }
    });
  }

  // Initialize
  loadData();
  renderBoard();
})();
