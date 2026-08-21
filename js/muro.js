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
      if (activeFilter === '04' && (nbNum.includes('04') || nbId.includes('transformer'))) return true;
      if (activeFilter === '05' && (nbNum.includes('05') || nbId.includes('paradigmas') || nbId.includes('computacion') || nbId.includes('integral'))) return true;
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

  // --- Export PNG (Canvas Rendering) ---
  const exportPngBtn = document.getElementById('btn-export-png');
  if (exportPngBtn) {
    exportPngBtn.addEventListener('click', () => {
      if (notes.length === 0) return alert('El lienzo está vacío.');

      // Bounding box calculation
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      notes.forEach(n => {
        const nx = n.x !== undefined ? n.x : 100;
        const ny = n.y !== undefined ? n.y : 100;
        minX = Math.min(minX, nx);
        minY = Math.min(minY, ny);
        maxX = Math.max(maxX, nx + 320);
        maxY = Math.max(maxY, ny + 240);
      });

      const pad = 80;
      const width = Math.max(1200, (maxX - minX) + pad * 2);
      const height = Math.max(800, (maxY - minY) + pad * 2);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Background
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, width, height);

      // Grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = 0; x < width; x += 30) {
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Title watermark
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('CURSO IA COMMERCIAL · LIENZO DE CONOCIMIENTO', pad, 45);

      const offsetX = pad - minX;
      const offsetY = pad - minY;

      // 2. Draw Connections (Bezier curves)
      connections.forEach(c => {
        const fromNote = notes.find(n => n.id === c.fromId);
        const toNote = notes.find(n => n.id === c.toId);
        if (!fromNote || !toNote) return;

        const x1 = (fromNote.x || 0) + 320 + offsetX;
        const y1 = (fromNote.y || 0) + 100 + offsetY;
        const x2 = (toNote.x || 0) + offsetX;
        const y2 = (toNote.y || 0) + 100 + offsetY;
        const cp1x = x1 + Math.abs(x2 - x1) * 0.5;
        const cp2x = x2 - Math.abs(x2 - x1) * 0.5;

        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cp1x, y1, cp2x, y2, x2, y2);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Notes Cards
      notes.forEach(note => {
        const x = (note.x || 0) + offsetX;
        const y = (note.y || 0) + offsetY;
        const cardW = 320;
        const cardH = 220;

        // Card shadow & background
        ctx.fillStyle = '#131826';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 8);
        ctx.fill();
        ctx.stroke();

        // Header Meta
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText((note.notebookNumber || 'NOTA') + ' · ' + (note.guest || 'Concepto'), x + 16, y + 26);

        // Body Text
        ctx.fillStyle = '#f8fafc';
        ctx.font = '13px Inter, sans-serif';
        wrapText(ctx, note.text, x + 16, y + 54, cardW - 32, 18, 5);

        // Annotation if any
        if (note.annotation) {
          ctx.fillStyle = '#c4b5fd';
          ctx.font = 'italic 12px Inter, sans-serif';
          wrapText(ctx, 'Reflexión: ' + note.annotation, x + 16, y + 165, cardW - 32, 16, 2);
        }
      });

      function wrapText(context, text, tx, ty, maxWidth, lineHeight, maxLines) {
        if (!text) return;
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, tx, ty);
            line = words[n] + ' ';
            ty += lineHeight;
            lineCount++;
            if (lineCount >= maxLines - 1) {
              line += '...';
              break;
            }
          } else {
            line = testLine;
          }
        }
        context.fillText(line, tx, ty);
      }

      // Download Trigger
      const link = document.createElement('a');
      link.download = 'curso-ia-lienzo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // --- Templates Modal Engine ---
  const templatesModal = document.getElementById('muro-templates-modal');
  const btnTemplates = document.getElementById('btn-templates');
  const btnCloseTemplates = document.getElementById('btn-close-templates');

  if (btnTemplates && templatesModal) {
    btnTemplates.addEventListener('click', () => {
      templatesModal.style.display = 'flex';
    });
  }

  if (btnCloseTemplates && templatesModal) {
    btnCloseTemplates.addEventListener('click', () => {
      templatesModal.style.display = 'none';
    });
  }

  // Preset Template Definitions
  const PRESET_TEMPLATES = {
    transformer: {
      notes: [
        { id: 'tpl_t1', notebookTitle: 'Cuaderno 04', notebookNumber: 'CUADERNO 04', guest: 'Transformers', text: 'Input Tokens & RoPE: Codificación posicional rotacional 2D en cada par de dimensiones.', annotation: 'Entrada de secuencia.', x: 100, y: 150 },
        { id: 'tpl_t2', notebookTitle: 'Cuaderno 04', notebookNumber: 'CUADERNO 04', guest: 'Transformers', text: 'Multi-Head Attention (MHA/GQA): Scaled Dot-Product Q·K^T / √d_k con pesos Softmax.', annotation: 'Atención entre tokens.', x: 480, y: 150 },
        { id: 'tpl_t3', notebookTitle: 'Cuaderno 04', notebookNumber: 'CUADERNO 04', guest: 'Transformers', text: 'Add & RMSNorm (Pre-LN): Conexión residual y normalización cuadrática estable.', annotation: 'Estabilidad de gradiente.', x: 860, y: 150 },
        { id: 'tpl_t4', notebookTitle: 'Cuaderno 04', notebookNumber: 'CUADERNO 04', guest: 'Transformers', text: 'SwiGLU FFN: Capa feed-forward con gating no lineal Swish(x·W)·(x·V).', annotation: 'Transformación no lineal.', x: 860, y: 440 },
        { id: 'tpl_t5', notebookTitle: 'Cuaderno 04', notebookNumber: 'CUADERNO 04', guest: 'Transformers', text: 'Unembedding & Softmax: Proyección lineal a vocabulario V y distribución de probabilidad.', annotation: 'Salida autorregresiva.', x: 480, y: 440 }
      ],
      connections: [
        { fromId: 'tpl_t1', toId: 'tpl_t2' },
        { fromId: 'tpl_t2', toId: 'tpl_t3' },
        { fromId: 'tpl_t3', toId: 'tpl_t4' },
        { fromId: 'tpl_t4', toId: 'tpl_t5' }
      ]
    },
    rag: {
      notes: [
        { id: 'tpl_r1', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Grounding', text: 'Document Store & Chunking: Segmentación con solapamiento y metadatos estructurados.', annotation: 'Ingesta de datos.', x: 100, y: 150 },
        { id: 'tpl_r2', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Grounding', text: 'Embeddings Densos: Proyección a espacio vectorial d-dimensional normalizado.', annotation: 'Representación latente.', x: 480, y: 150 },
        { id: 'tpl_r3', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Grounding', text: 'Vector DB & HNSW: Búsqueda ANN por similitud coseno con filtrado facetado.', annotation: 'Indexación y búsqueda.', x: 860, y: 150 },
        { id: 'tpl_r4', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Grounding', text: 'Cross-Encoder Reranking: Reordenación de los Top-K fragmentos por relevancia semántica.', annotation: 'Filtro de precisión.', x: 860, y: 440 },
        { id: 'tpl_r5', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Grounding', text: 'LLM Generation Grounded: Inyección de fragmentos recuperados en el System Prompt.', annotation: 'Eliminación de alucinación.', x: 480, y: 440 }
      ],
      connections: [
        { fromId: 'tpl_r1', toId: 'tpl_r2' },
        { fromId: 'tpl_r2', toId: 'tpl_r3' },
        { fromId: 'tpl_r3', toId: 'tpl_r4' },
        { fromId: 'tpl_r4', toId: 'tpl_r5' }
      ]
    },
    lifecycle: {
      notes: [
        { id: 'tpl_l1', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Ciclo LLM', text: 'Preentrenamiento Causal: Modelado de lenguaje autorregresivo a escala de billones de tokens.', annotation: 'Adquisición de conocimiento base.', x: 100, y: 250 },
        { id: 'tpl_l2', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Ciclo LLM', text: 'Supervised Fine-Tuning (SFT): Instrucciones seleccionadas de alta calidad (hipótesis LIMA).', annotation: 'Alineación de formato.', x: 480, y: 250 },
        { id: 'tpl_l3', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Ciclo LLM', text: 'Alineamiento RLHF / DPO: Optimización de preferencias humanas con Reward Model y PPO.', annotation: 'Seguridad y directivas.', x: 860, y: 250 },
        { id: 'tpl_l4', notebookTitle: 'Cuaderno 05', notebookNumber: 'CUADERNO 05', guest: 'Ciclo LLM', text: 'Evaluation Harness: Benchmarks objetivos estandarizados (MMLU, GSM8K, HumanEval).', annotation: 'Certificación técnica.', x: 1240, y: 250 }
      ],
      connections: [
        { fromId: 'tpl_l1', toId: 'tpl_l2' },
        { fromId: 'tpl_l2', toId: 'tpl_l3' },
        { fromId: 'tpl_l3', toId: 'tpl_l4' }
      ]
    }
  };

  document.querySelectorAll('.muro-template-card').forEach(card => {
    card.addEventListener('click', () => {
      const tplKey = card.getAttribute('data-template');
      const tpl = PRESET_TEMPLATES[tplKey];
      if (!tpl) return;

      if (notes.length > 0 && !confirm('¿Deseas añadir esta plantilla al lienzo actual?')) return;

      // Unique ID generation for template instances
      const idMap = {};
      const newNotes = tpl.notes.map(n => {
        const newId = 'note_' + Math.random().toString(36).substring(2, 9);
        idMap[n.id] = newId;
        return { ...n, id: newId };
      });

      const newConnections = tpl.connections.map(c => ({
        fromId: idMap[c.fromId],
        toId: idMap[c.toId]
      }));

      notes.push(...newNotes);
      connections.push(...newConnections);
      saveData();
      renderBoard();

      if (templatesModal) templatesModal.style.display = 'none';
    });
  });

  // --- Glossary Drawer Engine ---
  const glossaryDrawer = document.getElementById('muro-glossary-drawer');
  const btnGlossaryDrawer = document.getElementById('btn-glossary-drawer');
  const btnCloseGlossary = document.getElementById('btn-close-glossary');
  const glossarySearchInput = document.getElementById('muro-glossary-search');
  const glossaryListEl = document.getElementById('muro-glossary-list');

  const GLOSSARY_PRESETS = [
    { title: 'Self-Attention', nb: 'CUADERNO 04', text: 'Mecanismo donde cada token atiende a todos los demás ponderado por Softmax(Q·K^T / √d_k).' },
    { title: 'RoPE (Rotary Embedding)', nb: 'CUADERNO 04', text: 'Codificación posicional rotacional en plano complejo que preserva distancia relativa (m-n).' },
    { title: 'Mixture of Experts (MoE)', nb: 'CUADERNO 05', text: 'Arquitectura con capas FFN dispersas y red de Gating Top-K para activación selectiva.' },
    { title: 'LoRA / QLoRA', nb: 'CUADERNO 03', text: 'Descomposición matricial de bajo rango W + (α/r)(B·A) para fine-tuning con >99% ahorro de params.' },
    { title: 'KV Cache', nb: 'CUADERNO 03', text: 'Almacenamiento en VRAM de tensores Key y Value calculados previamente para acelerar inferencia.' },
    { title: 'GQA (Grouped-Query Attention)', nb: 'CUADERNO 04', text: 'Variante de atención que comparte cabezas K y V entre grupos de cabezas Q, ahorrando memoria.' },
    { title: 'AdamW', nb: 'CUADERNO 03', text: 'Optimizador que desacopla el decaimiento de pesos (Weight Decay) de la adaptación del LR.' },
    { title: 'RAG (Retrieval-Augmented)', nb: 'CUADERNO 05', text: 'Inyección dinámica de contexto vectorial en el prompt para eliminar alucinaciones.' },
    { title: 'RLHF / DPO', nb: 'CUADERNO 05', text: 'Alineación de modelos de lenguaje mediante optimización de preferencias humanas.' }
  ];

  function renderGlossaryDrawer(filter = '') {
    if (!glossaryListEl) return;
    glossaryListEl.innerHTML = '';
    const filtered = GLOSSARY_PRESETS.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()) || t.text.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(term => {
      const item = document.createElement('div');
      item.className = 'muro-glossary-item';
      item.innerHTML = `
        <h5>${term.title}</h5>
        <span style="font-size: 0.68rem; color: var(--text-muted);">${term.nb}</span>
        <p>${term.text}</p>
      `;
      item.addEventListener('click', () => {
        const newNote = {
          id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          notebookTitle: term.title,
          notebookNumber: term.nb,
          guest: 'Glosario Técnico',
          text: term.text,
          annotation: 'Concepto clave del curso.',
          color: 'cyan',
          x: container.scrollLeft + 150 + (Math.random() * 80),
          y: container.scrollTop + 150 + (Math.random() * 80)
        };
        notes.push(newNote);
        saveData();
        renderBoard();
        glossaryDrawer.style.display = 'none';
      });
      glossaryListEl.appendChild(item);
    });
  }

  if (btnGlossaryDrawer && glossaryDrawer) {
    btnGlossaryDrawer.addEventListener('click', () => {
      const isVisible = glossaryDrawer.style.display !== 'none';
      glossaryDrawer.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) renderGlossaryDrawer();
    });
  }

  if (btnCloseGlossary && glossaryDrawer) {
    btnCloseGlossary.addEventListener('click', () => {
      glossaryDrawer.style.display = 'none';
    });
  }

  if (glossarySearchInput) {
    glossarySearchInput.addEventListener('input', (e) => {
      renderGlossaryDrawer(e.target.value);
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
