(function() {
    'use strict';

    // ==========================================
    // ESTILOS (CSS Inyectado)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        /* Variables y base para logros */
        :root {
            --ach-bronce: #cd7f32;
            --ach-plata: #c0c0c0;
            --ach-oro: #ffd700;
        }

        /* Botón flotante */
        .achievements-fab {
            position: fixed;
            bottom: 24px;
            left: 24px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--bg-surface, #1e1e1e);
            border: 1px solid var(--border-medium, #333);
            box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.5));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            z-index: 9990;
            transition: transform var(--transition-fast, 0.2s), box-shadow var(--transition-fast, 0.2s);
        }
        .achievements-fab:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 14px 20px -3px rgba(0,0,0,0.6);
        }

        /* Contenedor de notificaciones (Toasts) */
        .achievements-toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 9999;
            pointer-events: none;
        }

        .achievement-toast {
            width: 320px;
            background: var(--bg-surface, #1e1e1e);
            border: 1px solid var(--border-medium, #333);
            border-radius: var(--radius-md, 8px);
            padding: 16px;
            display: flex;
            gap: 16px;
            box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.5));
            animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            position: relative;
            overflow: hidden;
            pointer-events: auto;
        }

        .achievement-toast.hide {
            animation: slideOutRight 0.4s ease-in forwards;
        }

        /* Shimmer effect para Oro */
        .achievement-toast[data-tier="oro"]::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255, 215, 0, 0.3), transparent);
            transform: skewX(-20deg);
            animation: shimmer 2s infinite;
        }

        .toast-icon {
            font-size: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .toast-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .toast-title {
            font-family: var(--font-display, 'Outfit', sans-serif);
            font-weight: 600;
            font-size: 1rem;
            color: var(--text-primary, #fff);
            margin: 0 0 4px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toast-desc {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 0.85rem;
            color: var(--text-secondary, #a0a0a0);
            margin: 0;
            line-height: 1.3;
        }

        /* Insignias */
        .tier-badge {
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .tier-bronce { background: rgba(205, 127, 50, 0.15); color: var(--ach-bronce); border: 1px solid var(--ach-bronce); }
        .tier-plata { background: rgba(192, 192, 192, 0.15); color: var(--ach-plata); border: 1px solid var(--ach-plata); }
        .tier-oro { background: rgba(255, 215, 0, 0.15); color: var(--ach-oro); border: 1px solid var(--ach-oro); }

        /* Modal/Panel de Galería */
        .achievements-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px);
            z-index: 9995;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--transition-base, 0.3s);
        }
        .achievements-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .achievements-modal {
            background: var(--bg-primary, #121212);
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            border-radius: var(--radius-lg, 12px);
            border: 1px solid var(--border-medium, #333);
            box-shadow: var(--shadow-xl, 0 25px 50px -12px rgba(0,0,0,0.5));
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transition: transform var(--transition-base, 0.3s);
        }
        .achievements-modal-overlay.active .achievements-modal {
            transform: scale(1);
        }

        .ach-modal-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-subtle, #2a2a2a);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ach-modal-title {
            font-family: var(--font-display, 'Outfit', sans-serif);
            font-size: 1.5rem;
            color: var(--text-primary, #fff);
            margin: 0;
        }
        .ach-close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary, #a0a0a0);
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            border-radius: var(--radius-sm, 4px);
            transition: background 0.2s, color 0.2s;
        }
        .ach-close-btn:hover {
            background: var(--bg-surface, #1e1e1e);
            color: var(--text-primary, #fff);
        }

        .ach-progress-container {
            padding: 20px 24px;
            background: var(--bg-surface, #1e1e1e);
            border-bottom: 1px solid var(--border-subtle, #2a2a2a);
        }
        .ach-progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: var(--text-secondary, #a0a0a0);
            font-size: 0.9rem;
        }
        .ach-progress-bar-bg {
            height: 12px;
            background: var(--bg-card, #252525);
            border-radius: 6px;
            overflow: hidden;
        }
        .ach-progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-violet, #8b5cf6), var(--accent-blue, #3b82f6));
            border-radius: 6px;
            transition: width 0.5s ease-out;
        }

        .ach-filters {
            display: flex;
            gap: 12px;
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-subtle, #2a2a2a);
            overflow-x: auto;
        }
        .ach-filter-btn {
            background: var(--bg-card, #252525);
            border: 1px solid var(--border-medium, #333);
            color: var(--text-secondary, #a0a0a0);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .ach-filter-btn.active, .ach-filter-btn:hover {
            background: var(--bg-surface, #1e1e1e);
            color: var(--text-primary, #fff);
            border-color: var(--accent-violet, #8b5cf6);
        }

        .ach-list {
            padding: 24px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }

        .ach-card {
            background: var(--bg-surface, #1e1e1e);
            border: 1px solid var(--border-medium, #333);
            border-radius: var(--radius-md, 8px);
            padding: 16px;
            display: flex;
            gap: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative;
        }
        .ach-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
        }
        
        .ach-card.locked {
            opacity: 0.6;
            filter: grayscale(1);
        }
        .ach-card.locked .toast-desc {
            font-style: italic;
        }
        
        .ach-card-date {
            position: absolute;
            bottom: 12px;
            right: 16px;
            font-size: 0.7rem;
            color: var(--text-muted, #777);
        }

        /* Animaciones */
        @keyframes slideInRight {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
        }
        @keyframes shimmer {
            100% { left: 200%; }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
            .achievement-toast {
                animation: none;
                transition: opacity 0.3s;
            }
            .achievement-toast.hide {
                animation: none;
                opacity: 0;
            }
            .achievement-toast[data-tier="oro"]::before {
                animation: none;
                display: none;
            }
            .achievements-fab, .achievements-modal, .ach-progress-bar-fill {
                transition: none;
            }
        }
        
        /* Light Theme Adjustments */
        [data-theme="light"] .achievements-fab,
        [data-theme="light"] .achievement-toast,
        [data-theme="light"] .ach-card,
        [data-theme="light"] .ach-progress-container,
        [data-theme="light"] .ach-modal-header,
        [data-theme="light"] .ach-filters {
            background: #ffffff;
            border-color: #e5e7eb;
        }
        [data-theme="light"] .achievements-modal {
            background: #f9fafb;
            border-color: #e5e7eb;
        }
        [data-theme="light"] .ach-progress-bar-bg { background: #e5e7eb; }
        [data-theme="light"] .toast-title, 
        [data-theme="light"] .ach-modal-title { color: #111827; }
        [data-theme="light"] .toast-desc { color: #4b5563; }
        [data-theme="light"] .ach-filter-btn { background: #f3f4f6; color: #4b5563; border-color: #d1d5db; }
        [data-theme="light"] .ach-filter-btn.active, 
        [data-theme="light"] .ach-filter-btn:hover { background: #ffffff; color: #111827; border-color: #8b5cf6; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // DEFINICIÓN DE LOGROS
    // ==========================================
    const DEFINITIONS = [
        // Bronce (Fáciles)
        { id: 'first_step', title: 'Primer Paso', description: 'Abre cualquier cuaderno por primera vez.', icon: '🔰', tier: 'bronce' },
        { id: 'explorer', title: 'Explorador', description: 'Visita los 5 cuadernos de la plataforma.', icon: '🗺️', tier: 'bronce' },
        { id: 'curious', title: 'Curioso', description: 'Utiliza la función de búsqueda por primera vez.', icon: '🔍', tier: 'bronce' },
        { id: 'open_lab', title: 'Laboratorio Abierto', description: 'Visita la página de Recursos.', icon: '🧪', tier: 'bronce' },
        { id: 'canvas_artist', title: 'Artista del Lienzo', description: 'Crea una nota en el Lienzo (muro).', icon: '🎨', tier: 'bronce' },
        
        // Plata (Medios)
        { id: 'dedicated_reader', title: 'Lector Dedicado', description: 'Lee un cuaderno hasta el 100% de progreso.', icon: '📖', tier: 'plata' },
        { id: 'quiz_sage', title: 'Sabio del Quiz', description: 'Obtén 100% en el quiz de cualquier cuaderno.', icon: '🧠', tier: 'plata' },
        { id: 'compulsive_highlighter', title: 'Subrayador Compulsivo', description: 'Crea 10 subrayados en total.', icon: '🖍️', tier: 'plata' },
        { id: 'early_night_owl', title: 'Madrugador / Noctámbulo', description: 'Estudia antes de las 7am o después de medianoche.', icon: '🦉', tier: 'plata' },
        { id: 'five_of_five', title: 'Cinco de Cinco', description: 'Completa al 100% el progreso de los 5 cuadernos.', icon: '🖐️', tier: 'plata' },
        
        // Oro (Difíciles)
        { id: 'brilliant_mind', title: 'Mente Brillante', description: 'Acierta 10 flashcards de forma consecutiva.', icon: '💡', tier: 'oro' },
        { id: 'speedster', title: 'Velocista', description: 'Aprueba el examen de certificación en menos de 45 minutos.', icon: '⚡', tier: 'oro' },
        { id: 'certified_master', title: 'Maestro Certificado', description: 'Obtén más del 90% de puntuación en el examen.', icon: '🎓', tier: 'oro' },
        { id: 'polymath', title: 'Polímata', description: 'Utiliza al menos 5 simuladores interactivos diferentes.', icon: '🧩', tier: 'oro' },
        { id: 'ai_architect', title: 'Arquitecto IA', description: 'Completa todos los cuadernos, el examen y usa todos los simuladores.', icon: '🏛️', tier: 'oro' }
    ];

    const STORAGE_KEY = 'curso_ia_achievements';

    // ==========================================
    // LÓGICA PRINCIPAL (AchievementManager)
    // ==========================================
    class AchievementManager {
        constructor() {
            this.achievements = this.loadAchievements();
            this.toastContainer = null;
            this.modalOverlay = null;
            this.initUI();
            this.initTrackers();
            
            // Revisa algunos logros inmediatos en carga
            setTimeout(() => this.checkOnLoad(), 1000);
        }

        loadAchievements() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : {};
            } catch (e) {
                console.error('Error loading achievements', e);
                return {};
            }
        }

        saveAchievements() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.achievements));
            } catch (e) {
                console.error('Error saving achievements', e);
            }
        }

        getDef(id) {
            return DEFINITIONS.find(a => a.id === id);
        }

        check(id) {
            return !!this.achievements[id];
        }

        unlock(id) {
            if (this.check(id)) return false; // Ya desbloqueado

            const def = this.getDef(id);
            if (!def) return false;

            this.achievements[id] = {
                unlockedAt: Date.now()
            };
            this.saveAchievements();
            this.showToast(def);
            
            // Si el modal está abierto, actualiza
            if (this.modalOverlay && this.modalOverlay.classList.contains('active')) {
                this.renderGallery();
            }

            return true;
        }

        getAll() {
            return DEFINITIONS.map(def => ({
                ...def,
                unlocked: this.check(def.id),
                unlockedAt: this.achievements[def.id] ? this.achievements[def.id].unlockedAt : null
            }));
        }

        getStats() {
            const all = this.getAll();
            const unlockedCount = all.filter(a => a.unlocked).length;
            const tiers = { bronce: 0, plata: 0, oro: 0 };
            
            all.forEach(a => {
                if (a.unlocked) tiers[a.tier]++;
            });

            return {
                total: all.length,
                unlocked: unlockedCount,
                percentage: Math.round((unlockedCount / all.length) * 100),
                tierCounts: tiers
            };
        }

        // ================= UI / COMPONENTES ================= //

        initUI() {
            // Contenedor Toasts
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'achievements-toast-container';
            document.body.appendChild(this.toastContainer);

            // Botón FAB
            const fab = document.createElement('button');
            fab.className = 'achievements-fab';
            fab.innerHTML = '🏆';
            fab.title = 'Logros y Recompensas';
            fab.onclick = () => this.openGallery();
            document.body.appendChild(fab);

            // Contenedor Modal
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.className = 'achievements-modal-overlay';
            this.modalOverlay.onclick = (e) => {
                if (e.target === this.modalOverlay) this.closeGallery();
            };
            
            const modal = document.createElement('div');
            modal.className = 'achievements-modal';
            
            // Cabecera Modal
            const header = document.createElement('div');
            header.className = 'ach-modal-header';
            header.innerHTML = `
                <h2 class="ach-modal-title">Logros y Recompensas</h2>
                <button class="ach-close-btn" title="Cerrar">&times;</button>
            `;
            header.querySelector('.ach-close-btn').onclick = () => this.closeGallery();
            
            // Área de Progreso
            const progressContainer = document.createElement('div');
            progressContainer.className = 'ach-progress-container';
            
            // Filtros
            const filters = document.createElement('div');
            filters.className = 'ach-filters';
            filters.innerHTML = `
                <button class="ach-filter-btn active" data-filter="all">Todos</button>
                <button class="ach-filter-btn" data-filter="bronce">Bronce</button>
                <button class="ach-filter-btn" data-filter="plata">Plata</button>
                <button class="ach-filter-btn" data-filter="oro">Oro</button>
            `;
            filters.querySelectorAll('.ach-filter-btn').forEach(btn => {
                btn.onclick = (e) => {
                    filters.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.renderGalleryList(btn.dataset.filter);
                };
            });
            
            // Lista
            this.listContainer = document.createElement('div');
            this.listContainer.className = 'ach-list';
            
            modal.appendChild(header);
            modal.appendChild(progressContainer);
            modal.appendChild(filters);
            modal.appendChild(this.listContainer);
            this.modalOverlay.appendChild(modal);
            document.body.appendChild(this.modalOverlay);
        }

        showToast(def) {
            const toast = document.createElement('div');
            toast.className = 'achievement-toast';
            toast.dataset.tier = def.tier;
            
            toast.innerHTML = `
                <div class="toast-icon">${def.icon}</div>
                <div class="toast-content">
                    <h4 class="toast-title">
                        ${def.title}
                        <span class="tier-badge tier-${def.tier}">${def.tier}</span>
                    </h4>
                    <p class="toast-desc">${def.description}</p>
                </div>
            `;
            
            this.toastContainer.appendChild(toast);
            
            // Auto-dismiss
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 500); // esperar animación
            }, 5000);
        }

        openGallery() {
            this.renderGallery();
            this.modalOverlay.classList.add('active');
        }

        closeGallery() {
            this.modalOverlay.classList.remove('active');
        }

        renderGallery() {
            const stats = this.getStats();
            
            // Actualizar progreso
            const progressContainer = this.modalOverlay.querySelector('.ach-progress-container');
            progressContainer.innerHTML = `
                <div class="ach-progress-header">
                    <span>Progreso Total</span>
                    <span><strong>${stats.unlocked}</strong> / ${stats.total} (${stats.percentage}%)</span>
                </div>
                <div class="ach-progress-bar-bg">
                    <div class="ach-progress-bar-fill" style="width: ${stats.percentage}%"></div>
                </div>
            `;
            
            // Reset filtro a "all"
            const filters = this.modalOverlay.querySelectorAll('.ach-filter-btn');
            filters.forEach(b => b.classList.remove('active'));
            filters[0].classList.add('active');
            
            this.renderGalleryList('all');
        }
        
        renderGalleryList(filter) {
            this.listContainer.innerHTML = '';
            
            let all = this.getAll();
            if (filter !== 'all') {
                all = all.filter(a => a.tier === filter);
            }
            
            // Ordenar: Desbloqueados primero, luego por tier
            const tierWeight = { 'bronce': 1, 'plata': 2, 'oro': 3 };
            all.sort((a, b) => {
                if (a.unlocked !== b.unlocked) return b.unlocked - a.unlocked;
                return tierWeight[a.tier] - tierWeight[b.tier];
            });
            
            all.forEach(a => {
                const card = document.createElement('div');
                card.className = `ach-card ${a.unlocked ? '' : 'locked'}`;
                
                const dateStr = a.unlockedAt ? new Date(a.unlockedAt).toLocaleDateString('es-ES') : '';
                
                card.innerHTML = `
                    <div class="toast-icon">${a.icon}</div>
                    <div class="toast-content">
                        <h4 class="toast-title">
                            ${a.title}
                            <span class="tier-badge tier-${a.tier}">${a.tier}</span>
                        </h4>
                        <p class="toast-desc">${a.unlocked ? a.description : '???'}</p>
                        ${a.unlocked ? `<span class="ach-card-date">${dateStr}</span>` : ''}
                    </div>
                `;
                this.listContainer.appendChild(card);
            });
        }

        // ================= RASTREO DE EVENTOS ================= //

        initTrackers() {
            // 1. Monitorear cambios en LocalStorage (otras pestañas u otros scripts)
            window.addEventListener('storage', (e) => {
                this.checkStorageEvents();
            });
            
            // Intercepción de clicks genéricos
            document.addEventListener('click', (e) => {
                // Búsqueda
                if (e.target.closest('[class*="search"]') || e.target.closest('[id*="search"]')) {
                    this.unlock('curious');
                }
            });

            // Teclas (Ctrl+K para búsqueda)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                    this.unlock('curious');
                }
            });

            // Polling suave para cambios de LS realizados en el mismo contexto
            setInterval(() => this.checkStorageEvents(), 3000);
            
            // Observador para subrayados
            const observerTarget = document.querySelector('main') || document.body;
            if (observerTarget) {
                const observer = new MutationObserver((mutations) => {
                    let hasHighlight = false;
                    mutations.forEach(m => {
                        if (m.type === 'childList') {
                            m.addedNodes.forEach(node => {
                                if (node.nodeType === 1 && 
                                   (node.tagName === 'MARK' || 
                                   (node.className && typeof node.className === 'string' && node.className.includes('highlight')))) {
                                    hasHighlight = true;
                                }
                            });
                        }
                    });
                    if (hasHighlight) {
                        this.trackHighlight();
                    }
                });
                observer.observe(observerTarget, { childList: true, subtree: true });
            }
        }

        checkOnLoad() {
            const loc = window.location.pathname.toLowerCase();
            
            // Tiempo
            const hours = new Date().getHours();
            if (hours < 7 || hours >= 24) { 
                this.unlock('early_night_owl');
            }

            // Primer paso: si es un cuaderno
            if (loc.includes('cuaderno') || loc.includes('modulo')) {
                this.unlock('first_step');
                this.trackNotebookVisit(loc);
            }
            
            // Laboratorio abierto
            if (loc.includes('recursos') || loc.includes('laboratorio')) {
                this.unlock('open_lab');
            }
            
            // Artista del lienzo
            if (loc.includes('muro') || loc.includes('lienzo')) {
                const canvasCont = document.getElementById('canvas-container') || document.body;
                canvasCont.addEventListener('click', () => {
                    setTimeout(() => this.unlock('canvas_artist'), 2000);
                });
            }
            
            this.checkStorageEvents();
        }

        trackNotebookVisit(path) {
            let visits = JSON.parse(localStorage.getItem('ach_notebook_visits') || '[]');
            const match = path.match(/(cuaderno|modulo)[-_]?(\d+|[a-z]+)/i);
            const nbId = match ? match[0] : path;
            
            if (!visits.includes(nbId)) {
                visits.push(nbId);
                localStorage.setItem('ach_notebook_visits', JSON.stringify(visits));
            }
            
            if (visits.length >= 5) {
                this.unlock('explorer');
            }
        }

        trackHighlight() {
            let count = parseInt(localStorage.getItem('ach_highlight_count') || '0');
            count++;
            localStorage.setItem('ach_highlight_count', count.toString());
            
            if (count >= 10) {
                this.unlock('compulsive_highlighter');
            }
        }
        
        checkStorageEvents() {
            let nbCompleted = 0;
            const totalNotebooks = 5; 
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                // Progreso
                if (key && key.startsWith('progress_')) {
                    const progress = parseInt(localStorage.getItem(key) || '0');
                    if (progress >= 100) {
                        this.unlock('dedicated_reader');
                        nbCompleted++;
                    }
                }
                
                // Quiz
                if (key && key.includes('quiz')) {
                    try {
                        const val = JSON.parse(localStorage.getItem(key));
                        if (val && (val.score === 100 || val.score === val.total)) {
                            this.unlock('quiz_sage');
                        }
                    } catch(e) {}
                }
                
                // Examen
                if (key && key.includes('exam_result')) {
                    try {
                        const val = JSON.parse(localStorage.getItem(key));
                        if (val) {
                            if (val.score >= 90) this.unlock('certified_master');
                            if (val.durationSeconds && val.durationSeconds < 45 * 60) this.unlock('speedster');
                        }
                    } catch(e) {}
                }
                
                // Simuladores
                if (key && key.includes('sim_usage')) {
                    try {
                        const val = JSON.parse(localStorage.getItem(key));
                        if (val && Array.isArray(val) && val.length >= 5) {
                            this.unlock('polymath');
                        }
                    } catch(e) {}
                }
                
                // Flashcards
                if (key && key.includes('flashcard_streak')) {
                    if (parseInt(localStorage.getItem(key) || '0') >= 10) {
                        this.unlock('brilliant_mind');
                    }
                }
            }
            
            if (nbCompleted >= totalNotebooks) {
                this.unlock('five_of_five');
            }
            
            if (this.check('five_of_five') && this.check('certified_master') && this.check('polymath')) {
                this.unlock('ai_architect');
            }
        }
    }

    // Inicializar globalmente
    window.CursoIA = window.CursoIA || {};
    window.CursoIA.Achievements = new AchievementManager();

})();
