(function() {
    'use strict';

    // --- State ---
    let annotations = {};
    let pageId = '';
    let panelOpen = false;
    let editingId = null;

    // --- Initialization ---
    function init() {
        // Wait for DOM content
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkContent);
        } else {
            checkContent();
        }
    }

    function checkContent() {
        if (document.querySelector('.transcript-text')) {
            setup();
        } else {
            // Observe in case content is injected dynamically
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.transcript-text')) {
                    obs.disconnect();
                    setup();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function setup() {
        injectStyles();
        
        // Determine page ID from URL
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || 'index.html';
        pageId = `annotations_${filename}`;
        
        loadAnnotations();
        setupParagraphs();
        createSidebar();
        createFloatingButton();
        
        updateIndicators();
        updateSidebar();
    }

    // --- Storage ---
    function loadAnnotations() {
        try {
            const stored = localStorage.getItem(pageId);
            if (stored) {
                const arr = JSON.parse(stored);
                // Convert to object map for easier access
                annotations = {};
                arr.forEach(item => {
                    annotations[item.id] = item;
                });
            }
        } catch (e) {
            console.error('Error loading annotations', e);
            annotations = {};
        }
    }

    function saveAnnotations() {
        try {
            const arr = Object.values(annotations);
            localStorage.setItem(pageId, JSON.stringify(arr));
            updateIndicators();
            updateSidebar();
        } catch (e) {
            console.error('Error saving annotations', e);
        }
    }

    // --- Utility ---
    function hashText(text) {
        // Stable ID based on the first 100 characters of the text content
        const str = text.trim().substring(0, 100);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; 
        }
        return 'note_' + Math.abs(hash).toString(16);
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        });
    }

    // --- UI Setup ---
    function setupParagraphs() {
        const containers = document.querySelectorAll('.transcript-text');
        
        let indexCount = 0;
        containers.forEach(container => {
            const paragraphs = container.querySelectorAll('p');
            paragraphs.forEach(p => {
                if (!p.textContent.trim()) return; // Skip empty paragraphs
                
                const id = hashText(p.textContent);
                p.dataset.noteId = id;
                p.dataset.noteIndex = indexCount++;
                p.style.position = 'relative';
                
                const wrapper = document.createElement('div');
                wrapper.className = 'annotation-wrapper';
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);

                const icon = document.createElement('button');
                icon.className = 'annotation-icon';
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;
                icon.title = "Añadir nota";
                icon.onclick = () => toggleEditor(id, wrapper, p);
                
                const indicator = document.createElement('span');
                indicator.className = 'annotation-indicator';
                
                const tools = document.createElement('div');
                tools.className = 'annotation-tools';
                tools.appendChild(indicator);
                tools.appendChild(icon);
                
                wrapper.appendChild(tools);
            });
        });
    }

    function toggleEditor(id, wrapper, p) {
        const existingEditor = wrapper.querySelector('.annotation-editor');
        
        if (existingEditor) {
            // Close it
            closeEditor(existingEditor, id);
        } else {
            // Open it
            const noteData = annotations[id] || { text: '' };
            
            const editor = document.createElement('div');
            editor.className = 'annotation-editor open';
            
            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Escribe tu nota sobre este párrafo...';
            textarea.value = noteData.text;
            
            const footer = document.createElement('div');
            footer.className = 'annotation-editor-footer';
            
            const charCount = document.createElement('span');
            charCount.className = 'annotation-char-count';
            charCount.textContent = `${textarea.value.length} caracteres`;
            
            const actions = document.createElement('div');
            actions.className = 'annotation-editor-actions';
            
            const btnSave = document.createElement('button');
            btnSave.className = 'btn-save-note';
            btnSave.textContent = 'Guardar y cerrar';
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete-note';
            btnDelete.textContent = 'Eliminar';
            if (!noteData.text) btnDelete.style.display = 'none';

            let debounceTimer;
            textarea.addEventListener('input', () => {
                charCount.textContent = `${textarea.value.length} caracteres`;
                
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    saveNoteText(id, p, textarea.value);
                    if (textarea.value.trim().length > 0) {
                        btnDelete.style.display = 'inline-block';
                    }
                }, 500);
            });

            btnSave.onclick = () => {
                saveNoteText(id, p, textarea.value);
                closeEditor(editor, id);
            };
            
            btnDelete.onclick = () => {
                if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
                    delete annotations[id];
                    saveAnnotations();
                    closeEditor(editor, id);
                }
            };
            
            actions.appendChild(btnDelete);
            actions.appendChild(btnSave);
            footer.appendChild(charCount);
            footer.appendChild(actions);
            
            editor.appendChild(textarea);
            editor.appendChild(footer);
            
            wrapper.appendChild(editor);
            
            // Focus
            setTimeout(() => textarea.focus(), 100);
        }
    }
    
    function saveNoteText(id, p, text) {
        const trimmed = text.trim();
        if (trimmed) {
            annotations[id] = {
                id: id,
                text: trimmed,
                context: p.textContent.trim().substring(0, 150) + '...',
                index: parseInt(p.dataset.noteIndex, 10),
                updatedAt: new Date().toISOString()
            };
        } else {
            delete annotations[id];
        }
        saveAnnotations();
    }

    function closeEditor(editorElement, id) {
        editorElement.classList.remove('open');
        setTimeout(() => {
            if (editorElement.parentNode) {
                editorElement.parentNode.removeChild(editorElement);
            }
        }, 300); // match transition
    }

    function updateIndicators() {
        document.querySelectorAll('.annotation-wrapper').forEach(wrapper => {
            const p = wrapper.querySelector('p');
            const indicator = wrapper.querySelector('.annotation-indicator');
            const id = p.dataset.noteId;
            
            if (annotations[id]) {
                indicator.style.display = 'block';
                wrapper.classList.add('has-annotation');
            } else {
                indicator.style.display = 'none';
                wrapper.classList.remove('has-annotation');
            }
        });
    }

    // --- Sidebar & Floating Button ---
    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'btn-floating-notes';
        btn.className = 'btn-floating-notes';
        btn.innerHTML = `📝 Mis Notas <span class="notes-count">0</span>`;
        btn.onclick = toggleSidebar;
        document.body.appendChild(btn);
    }

    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'annotations-sidebar';
        sidebar.className = 'annotations-sidebar';
        
        const header = document.createElement('div');
        header.className = 'sidebar-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Mis Notas';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'btn-close-sidebar';
        closeBtn.onclick = toggleSidebar;
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn-export-notes';
        exportBtn.innerHTML = 'Exportar Notas';
        exportBtn.onclick = exportNotes;
        
        const list = document.createElement('div');
        list.id = 'annotations-list';
        list.className = 'annotations-list';
        
        sidebar.appendChild(header);
        sidebar.appendChild(exportBtn);
        sidebar.appendChild(list);
        
        const overlay = document.createElement('div');
        overlay.id = 'annotations-overlay';
        overlay.className = 'annotations-overlay';
        overlay.onclick = toggleSidebar;
        
        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
    }

    function toggleSidebar() {
        panelOpen = !panelOpen;
        const sidebar = document.getElementById('annotations-sidebar');
        const overlay = document.getElementById('annotations-overlay');
        
        if (panelOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            updateSidebar();
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }
    }

    function updateSidebar() {
        const countEls = document.querySelectorAll('.notes-count');
        const notesCount = Object.keys(annotations).length;
        countEls.forEach(el => el.textContent = notesCount);
        
        const list = document.getElementById('annotations-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (notesCount === 0) {
            list.innerHTML = '<div class="empty-state">No tienes notas en este cuaderno. Haz clic en el ícono del lápiz junto a los párrafos para añadir notas.</div>';
            return;
        }
        
        // Sort by index in document
        const sorted = Object.values(annotations).sort((a, b) => a.index - b.index);
        
        sorted.forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';
            
            const context = document.createElement('div');
            context.className = 'note-context';
            context.textContent = `"${note.context.substring(0, 50)}..."`;
            context.onclick = () => scrollToNote(note.id);
            
            const text = document.createElement('div');
            text.className = 'note-text';
            text.textContent = note.text;
            
            const meta = document.createElement('div');
            meta.className = 'note-meta';
            
            const date = document.createElement('span');
            date.textContent = formatDate(note.updatedAt);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'note-item-delete';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.onclick = () => {
                if (confirm('¿Eliminar esta nota?')) {
                    delete annotations[note.id];
                    saveAnnotations();
                    // Close editor if open
                    const wrapper = document.querySelector(`[data-note-id="${note.id}"]`)?.closest('.annotation-wrapper');
                    if (wrapper) {
                        const editor = wrapper.querySelector('.annotation-editor');
                        if (editor) closeEditor(editor, note.id);
                    }
                }
            };
            
            meta.appendChild(date);
            meta.appendChild(deleteBtn);
            
            item.appendChild(context);
            item.appendChild(text);
            item.appendChild(meta);
            
            list.appendChild(item);
        });
    }

    function scrollToNote(id) {
        const p = document.querySelector(`[data-note-id="${id}"]`);
        if (p) {
            if (window.innerWidth < 768) {
                toggleSidebar(); // Close sidebar on mobile
            }
            p.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight effect
            p.style.transition = 'background-color 0.5s ease';
            p.style.backgroundColor = 'var(--bg-surface)';
            setTimeout(() => {
                p.style.backgroundColor = 'transparent';
            }, 1500);
        }
    }

    function exportNotes() {
        const sorted = Object.values(annotations).sort((a, b) => a.index - b.index);
        
        if (sorted.length === 0) {
            alert('No hay notas para exportar.');
            return;
        }

        const titleText = document.querySelector('h1')?.textContent || 'Cuaderno';
        
        let markdown = `# Mis Notas — ${titleText}\n\n`;
        
        sorted.forEach(note => {
            markdown += `## Párrafo: "${note.context}"\n`;
            markdown += `${note.text}\n`;
            markdown += `*Editado: ${formatDate(note.updatedAt)}*\n\n---\n\n`;
        });
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = pageId.replace('annotations_', '').replace('.html', '');
        a.download = `notas-${cleanName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Styles ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .annotation-wrapper {
                position: relative;
                margin-bottom: 1rem;
            }
            .annotation-tools {
                position: absolute;
                top: 0;
                right: -2rem;
                display: flex;
                align-items: center;
                gap: 4px;
                opacity: 0.15;
                transition: opacity var(--transition-fast) ease;
            }
            .annotation-wrapper:hover .annotation-tools,
            .annotation-wrapper.has-annotation .annotation-tools {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .annotation-tools {
                    right: 0;
                    top: -1.5rem;
                }
            }
            
            .annotation-icon {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: color var(--transition-fast) ease, background var(--transition-fast) ease;
            }
            .annotation-icon:hover {
                color: var(--accent-violet);
                background: var(--bg-surface);
            }
            
            .annotation-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--accent-violet);
                display: none;
                animation: pulse-dot 2s infinite;
            }
            
            @keyframes pulse-dot {
                0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
                70% { box-shadow: 0 0 0 4px rgba(139, 92, 246, 0); }
                100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
            }
            
            .annotation-editor {
                margin-top: 0.5rem;
                border-left: 3px solid var(--accent-violet);
                background: var(--bg-card);
                border-radius: 0 var(--radius-md) var(--radius-md) 0;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                overflow: hidden;
                max-height: 0;
                opacity: 0;
                transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
            }
            .annotation-editor.open {
                max-height: 300px;
                opacity: 1;
            }
            
            .annotation-editor textarea {
                width: 100%;
                min-height: 80px;
                background: var(--bg-surface);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-sm);
                color: var(--text-primary);
                font-family: var(--font-body);
                padding: 0.75rem;
                resize: vertical;
                font-size: 0.95rem;
            }
            .annotation-editor textarea:focus {
                outline: none;
                border-color: var(--accent-violet);
            }
            
            .annotation-editor-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.85rem;
            }
            .annotation-char-count {
                color: var(--text-muted);
            }
            .annotation-editor-actions {
                display: flex;
                gap: 0.5rem;
            }
            .annotation-editor-actions button {
                padding: 0.4rem 0.75rem;
                border-radius: var(--radius-sm);
                font-size: 0.85rem;
                cursor: pointer;
                border: none;
                transition: background var(--transition-fast) ease;
            }
            .btn-save-note {
                background: var(--accent-violet);
                color: white;
            }
            .btn-save-note:hover {
                filter: brightness(1.1);
            }
            .btn-delete-note {
                background: transparent;
                color: var(--accent-rose);
                border: 1px solid var(--border-subtle) !important;
            }
            .btn-delete-note:hover {
                background: rgba(244, 63, 94, 0.1);
            }
            
            /* Sidebar */
            .annotations-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                max-width: 100vw;
                height: 100vh;
                background: var(--bg-card);
                border-left: 1px solid var(--border-subtle);
                box-shadow: var(--shadow-lg);
                z-index: 800;
                transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
            }
            .annotations-sidebar.open {
                right: 0;
            }
            
            .annotations-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.5);
                z-index: 799;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(2px);
            }
            .annotations-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }
            
            .sidebar-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-subtle);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .sidebar-header h3 {
                margin: 0;
                font-family: var(--font-display);
                color: var(--text-primary);
            }
            .btn-close-sidebar {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .btn-export-notes {
                margin: 1rem;
                padding: 0.75rem;
                background: var(--bg-surface);
                border: 1px solid var(--border-subtle);
                color: var(--text-primary);
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 500;
                transition: all var(--transition-fast) ease;
            }
            .btn-export-notes:hover {
                border-color: var(--accent-violet);
                color: var(--accent-violet);
            }
            
            .annotations-list {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .empty-state {
                text-align: center;
                color: var(--text-muted);
                padding: 2rem 1rem;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            
            .note-item {
                background: var(--bg-surface);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-md);
                padding: 1rem;
                border-left: 3px solid var(--accent-violet);
            }
            .note-context {
                font-style: italic;
                color: var(--text-muted);
                font-size: 0.85rem;
                margin-bottom: 0.75rem;
                cursor: pointer;
                transition: color var(--transition-fast) ease;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .note-context:hover {
                color: var(--text-primary);
            }
            .note-text {
                color: var(--text-primary);
                font-size: 0.95rem;
                line-height: 1.5;
                margin-bottom: 1rem;
                white-space: pre-wrap;
            }
            .note-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.75rem;
                color: var(--text-muted);
            }
            .note-item-delete {
                background: none;
                border: none;
                color: var(--accent-rose);
                cursor: pointer;
                opacity: 0.7;
            }
            .note-item-delete:hover {
                opacity: 1;
                text-decoration: underline;
            }
            
            .btn-floating-notes {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                box-shadow: var(--shadow-md);
                color: var(--text-primary);
                padding: 0.75rem 1.25rem;
                border-radius: 2rem;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 700;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .btn-floating-notes:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .notes-count {
                background: var(--accent-violet);
                color: white;
                font-size: 0.75rem;
                padding: 0.1rem 0.5rem;
                border-radius: 1rem;
            }
            
            @media (max-width: 768px) {
                .btn-floating-notes {
                    bottom: 1rem;
                    right: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Start
    init();

})();
