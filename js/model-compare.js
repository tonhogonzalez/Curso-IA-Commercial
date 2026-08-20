(function() {
    'use strict';

    // Model Data
    const models = [
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            company: 'OpenAI',
            params: '~200B (estimado)',
            paramsNum: 200,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train + SFT + RLHF',
            architecture: 'Transformer Decoder-Only, MoE',
            license: 'Propietario',
            benchmarks: { MMLU: 88.7, GSM8K: 95.8, HellaSwag: 95.3, HumanEval: 90.2 },
            releaseDate: '2024-05',
            highlights: 'Multimodal nativo (texto, imagen, audio). Referencia de la industria.',
            category: 'propietario'
        },
        {
            id: 'claude-3-5',
            name: 'Claude 3.5 Sonnet',
            company: 'Anthropic',
            params: '~175B (estimado)',
            paramsNum: 175,
            contextWindow: '200K tokens',
            contextNum: 200000,
            training: 'Pre-train + RLHF + Constitutional AI',
            architecture: 'Transformer Decoder-Only',
            license: 'Propietario',
            benchmarks: { MMLU: 88.7, GSM8K: 96.4, HellaSwag: 89.0, HumanEval: 92.0 },
            releaseDate: '2024-06',
            highlights: 'Ventana de contexto masiva. Constitutional AI para alineamiento.',
            category: 'propietario'
        },
        {
            id: 'gemini-2-5',
            name: 'Gemini 2.5 Pro',
            company: 'Google DeepMind',
            params: '~540B MoE (estimado)',
            paramsNum: 540,
            contextWindow: '1M tokens',
            contextNum: 1000000,
            training: 'Pre-train + SFT + RLHF',
            architecture: 'Transformer MoE, Multimodal',
            license: 'Propietario',
            benchmarks: { MMLU: 90.0, GSM8K: 96.8, HellaSwag: 93.5, HumanEval: 89.5 },
            releaseDate: '2025-03',
            highlights: 'Contexto de 1M tokens. Multimodal nativo. Razonamiento extendido.',
            category: 'propietario'
        },
        {
            id: 'llama-3-1',
            name: 'Llama 3.1 405B',
            company: 'Meta',
            params: '405B',
            paramsNum: 405,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train + SFT + RLHF + DPO',
            architecture: 'Transformer Decoder-Only, Dense',
            license: 'Open Source (Llama License)',
            benchmarks: { MMLU: 88.6, GSM8K: 96.8, HellaSwag: 89.2, HumanEval: 89.0 },
            releaseDate: '2024-07',
            highlights: 'Mayor modelo open-source. Competitivo con GPT-4.',
            category: 'open-source'
        },
        {
            id: 'mistral-large-2',
            name: 'Mistral Large 2',
            company: 'Mistral AI',
            params: '123B',
            paramsNum: 123,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train + SFT + DPO',
            architecture: 'Transformer Decoder-Only',
            license: 'Propietario (Research OK)',
            benchmarks: { MMLU: 84.0, GSM8K: 93.1, HellaSwag: 86.5, HumanEval: 84.0 },
            releaseDate: '2024-07',
            highlights: 'Excelente relación rendimiento/coste. Fuerte en código y multilingüe.',
            category: 'propietario'
        },
        {
            id: 'qwen-2-5',
            name: 'Qwen 2.5 72B',
            company: 'Alibaba Cloud',
            params: '72B',
            paramsNum: 72,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train + SFT + RLHF',
            architecture: 'Transformer Decoder-Only',
            license: 'Open Source (Apache 2.0)',
            benchmarks: { MMLU: 86.1, GSM8K: 93.2, HellaSwag: 85.5, HumanEval: 86.0 },
            releaseDate: '2024-09',
            highlights: 'Líder open-source chino. Excelente en razonamiento y código.',
            category: 'open-source'
        },
        {
            id: 'deepseek-v3',
            name: 'DeepSeek-V3',
            company: 'DeepSeek',
            params: '671B MoE (37B activos)',
            paramsNum: 671,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train + SFT + RLHF',
            architecture: 'Transformer MoE, Multi-head Latent Attention',
            license: 'Open Source (MIT)',
            benchmarks: { MMLU: 87.1, GSM8K: 89.0, HellaSwag: 88.0, HumanEval: 82.6 },
            releaseDate: '2024-12',
            highlights: 'MoE eficiente: 37B parámetros activos de 671B. Entrenamiento de bajo coste.',
            category: 'open-source'
        },
        {
            id: 'gemma-2',
            name: 'Gemma 2 27B',
            company: 'Google DeepMind',
            params: '27B',
            paramsNum: 27,
            contextWindow: '8K tokens',
            contextNum: 8000,
            training: 'Pre-train + SFT + RLHF',
            architecture: 'Transformer Decoder-Only',
            license: 'Open Source (Gemma License)',
            benchmarks: { MMLU: 75.2, GSM8K: 74.0, HellaSwag: 80.1, HumanEval: 51.8 },
            releaseDate: '2024-06',
            highlights: 'Modelo compacto de Google. Ideal para fine-tuning y edge deployment.',
            category: 'open-source'
        }
    ];

    // Educational Connections Mapping
    const educationalMapping = {
        'MoE': 'Cuaderno 04 (Arquitecturas)',
        'RLHF': 'Cuaderno 05 (Entrenamiento)',
        'DPO': 'Cuaderno 05 (Entrenamiento)',
        'Transformer': 'Cuaderno 04 (Arquitecturas)',
        'Constitutional AI': 'Cuaderno 02 (Alineamiento)'
    };

    // State
    const state = {
        view: 'cards', // 'cards' | 'table'
        filterCategory: 'all', // 'all' | 'open-source' | 'propietario'
        searchQuery: '',
        sortBy: 'name',
        sortOrder: 'asc', // 'asc' | 'desc'
        selectedModels: [], // array of model IDs
        compareModalOpen: false
    };

    const colors = [
        'var(--accent-violet)',
        'var(--accent-blue)',
        'var(--accent-emerald)',
        'var(--accent-rose)'
    ];

    function injectStyles() {
        const css = `
            .mc-container {
                font-family: var(--font-body);
                color: var(--text-primary);
                background: var(--bg-primary);
                border-radius: var(--radius-lg);
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                position: relative;
            }

            /* Toolbar */
            .mc-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-surface);
                padding: 1rem;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-subtle);
            }

            .mc-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                align-items: center;
            }

            .mc-input, .mc-select {
                background: var(--bg-primary);
                color: var(--text-primary);
                border: 1px solid var(--border-medium);
                padding: 0.5rem 1rem;
                border-radius: var(--radius-sm);
                font-family: var(--font-body);
                font-size: 0.9rem;
                outline: none;
                transition: border-color var(--transition-fast);
            }
            .mc-input:focus, .mc-select:focus {
                border-color: var(--accent-blue);
            }

            .mc-view-toggle {
                display: flex;
                background: var(--bg-primary);
                border-radius: var(--radius-sm);
                border: 1px solid var(--border-medium);
                overflow: hidden;
            }
            .mc-view-btn {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                padding: 0.5rem 1rem;
                cursor: pointer;
                font-weight: 500;
                transition: background var(--transition-fast), color var(--transition-fast);
            }
            .mc-view-btn.active {
                background: var(--bg-secondary);
                color: var(--accent-blue);
            }
            .mc-view-btn:hover:not(.active) {
                background: var(--bg-surface);
            }

            /* Cards View */
            .mc-cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 1.5rem;
            }

            .mc-card {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-md);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
                position: relative;
            }
            .mc-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--border-medium);
            }
            .mc-card.selected {
                border-color: var(--accent-blue);
                box-shadow: 0 0 0 1px var(--accent-blue);
            }

            .mc-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .mc-card-title {
                font-family: var(--font-display);
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0 0 0.25rem 0;
            }
            .mc-card-subtitle {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin: 0;
            }

            .mc-badge {
                font-size: 0.75rem;
                padding: 0.2rem 0.5rem;
                border-radius: var(--radius-xl);
                background: var(--bg-surface);
                color: var(--text-secondary);
                border: 1px solid var(--border-subtle);
            }
            .mc-badge.open-source { color: var(--accent-emerald); border-color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); }
            .mc-badge.propietario { color: var(--accent-violet); border-color: var(--accent-violet); background: rgba(139, 92, 246, 0.1); }

            .mc-radar-container {
                width: 100%;
                aspect-ratio: 1;
                position: relative;
                margin: 0.5rem 0;
            }
            .mc-radar-canvas {
                width: 100%;
                height: 100%;
            }

            .mc-card-section {
                font-size: 0.9rem;
            }
            .mc-card-section h4 {
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--text-muted);
                margin: 0 0 0.5rem 0;
            }
            .mc-card-section p {
                margin: 0 0 0.25rem 0;
                color: var(--text-secondary);
            }
            .mc-card-section strong {
                color: var(--text-primary);
            }

            .mc-edu-links {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .mc-edu-tag {
                font-size: 0.75rem;
                background: var(--bg-secondary);
                padding: 0.25rem 0.5rem;
                border-radius: var(--radius-sm);
                color: var(--accent-cyan);
                border: 1px solid rgba(6, 182, 212, 0.2);
            }

            .mc-compare-btn {
                width: 100%;
                padding: 0.75rem;
                background: var(--bg-surface);
                color: var(--text-primary);
                border: 1px solid var(--border-medium);
                border-radius: var(--radius-sm);
                cursor: pointer;
                font-weight: 500;
                transition: all var(--transition-fast);
                margin-top: auto;
            }
            .mc-compare-btn:hover {
                background: var(--bg-secondary);
            }
            .mc-compare-btn.selected {
                background: var(--accent-blue);
                color: white;
                border-color: var(--accent-blue);
            }

            /* Table View */
            .mc-table-container {
                overflow-x: auto;
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-md);
            }
            .mc-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 0.9rem;
            }
            .mc-table th, .mc-table td {
                padding: 1rem;
                border-bottom: 1px solid var(--border-subtle);
            }
            .mc-table th {
                background: var(--bg-surface);
                font-weight: 600;
                color: var(--text-secondary);
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
            }
            .mc-table th:hover {
                color: var(--text-primary);
            }
            .mc-table tr:hover td {
                background: var(--bg-surface);
            }
            .mc-table tr:last-child td {
                border-bottom: none;
            }
            .mc-sort-icon {
                display: inline-block;
                margin-left: 0.5rem;
                font-size: 0.8em;
                opacity: 0.5;
            }
            .mc-sort-icon.active {
                opacity: 1;
                color: var(--accent-blue);
            }

            .mc-table-compare-cb {
                width: 1.2rem;
                height: 1.2rem;
                cursor: pointer;
            }

            /* Comparison Floating Bar */
            .mc-floating-bar {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(150%);
                background: var(--bg-card);
                border: 1px solid var(--border-medium);
                box-shadow: var(--shadow-lg);
                padding: 1rem 2rem;
                border-radius: var(--radius-xl);
                display: flex;
                align-items: center;
                gap: 1.5rem;
                z-index: 100;
                transition: transform var(--transition-base);
            }
            .mc-floating-bar.visible {
                transform: translateX(-50%) translateY(0);
            }
            .mc-floating-text {
                font-weight: 500;
            }
            .mc-floating-actions {
                display: flex;
                gap: 0.5rem;
            }
            .mc-btn-primary {
                background: var(--accent-blue);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: var(--radius-sm);
                cursor: pointer;
                font-weight: 600;
            }
            .mc-btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .mc-btn-secondary {
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border-medium);
                padding: 0.5rem 1rem;
                border-radius: var(--radius-sm);
                cursor: pointer;
            }

            /* Comparison Modal */
            .mc-modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--transition-base);
                padding: 2rem;
            }
            .mc-modal-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }
            .mc-modal {
                background: var(--bg-card);
                border: 1px solid var(--border-medium);
                border-radius: var(--radius-lg);
                width: 100%;
                max-width: 1000px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: var(--shadow-lg);
                transform: scale(0.95);
                transition: transform var(--transition-base);
            }
            .mc-modal-overlay.active .mc-modal {
                transform: scale(1);
            }
            .mc-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-subtle);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .mc-modal-title {
                margin: 0;
                font-family: var(--font-display);
                font-size: 1.5rem;
            }
            .mc-modal-close {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
            }
            .mc-modal-body {
                padding: 1.5rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            .mc-modal-radar {
                width: 100%;
                max-width: 500px;
                aspect-ratio: 1;
                margin: 0 auto;
            }
            .mc-compare-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            .mc-compare-col {
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-md);
                padding: 1.5rem;
                background: var(--bg-surface);
            }
            .mc-legend {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            .mc-legend-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
            .mc-legend-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            /* Empty state */
            .mc-empty {
                text-align: center;
                padding: 3rem;
                color: var(--text-secondary);
                background: var(--bg-surface);
                border-radius: var(--radius-md);
                border: 1px dashed var(--border-medium);
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function getEducationalLinks(model) {
        const links = [];
        const fullText = (model.architecture + ' ' + model.training).toLowerCase();
        
        for (const [key, lesson] of Object.entries(educationalMapping)) {
            if (fullText.includes(key.toLowerCase())) {
                links.push({ key, lesson });
            }
        }
        return links;
    }

    function getFilteredAndSortedModels() {
        let result = models.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                                  m.company.toLowerCase().includes(state.searchQuery.toLowerCase());
            const matchesCategory = state.filterCategory === 'all' || m.category === state.filterCategory;
            return matchesSearch && matchesCategory;
        });

        result.sort((a, b) => {
            let valA, valB;
            switch(state.sortBy) {
                case 'name': valA = a.name; valB = b.name; break;
                case 'params': valA = a.paramsNum; valB = b.paramsNum; break;
                case 'context': valA = a.contextNum; valB = b.contextNum; break;
                case 'MMLU': valA = a.benchmarks.MMLU; valB = b.benchmarks.MMLU; break;
                case 'GSM8K': valA = a.benchmarks.GSM8K; valB = b.benchmarks.GSM8K; break;
                case 'HellaSwag': valA = a.benchmarks.HellaSwag; valB = b.benchmarks.HellaSwag; break;
                case 'HumanEval': valA = a.benchmarks.HumanEval; valB = b.benchmarks.HumanEval; break;
                default: valA = a.name; valB = b.name;
            }
            
            if (valA < valB) return state.sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return state.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }

    function toggleModelSelection(id) {
        const idx = state.selectedModels.indexOf(id);
        if (idx > -1) {
            state.selectedModels.splice(idx, 1);
        } else {
            if (state.selectedModels.length < 3) {
                state.selectedModels.push(id);
            } else {
                alert('Puedes comparar un máximo de 3 modelos.');
            }
        }
        render();
    }

    function drawRadarChart(canvasId, modelData, colorsList) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Handle High DPI displays
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        const w = rect.width;
        const h = rect.height;
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 - 25; // padding for labels
        
        const axes = ['MMLU', 'GSM8K', 'HellaSwag', 'HumanEval'];
        const numAxes = axes.length;
        const angleStep = (Math.PI * 2) / numAxes;
        const offset = -Math.PI / 2; // Start at top
        
        ctx.clearRect(0, 0, w, h);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
        ctx.lineWidth = 1;
        ctx.font = '10px var(--font-body)';
        ctx.fillStyle = 'var(--text-muted)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let level = 1; level <= 5; level++) {
            const r = radius * (level / 5);
            ctx.beginPath();
            for (let i = 0; i < numAxes; i++) {
                const angle = offset + i * angleStep;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw axes & labels
        for (let i = 0; i < numAxes; i++) {
            const angle = offset + i * angleStep;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Label
            const lx = cx + Math.cos(angle) * (radius + 15);
            const ly = cy + Math.sin(angle) * (radius + 15);
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.fillText(axes[i], lx, ly);
        }
        
        // Draw model data polygons
        const modelsToDraw = Array.isArray(modelData) ? modelData : [modelData];
        
        modelsToDraw.forEach((model, mIndex) => {
            const colorStr = colorsList ? colorsList[mIndex] : colors[0];
            
            ctx.beginPath();
            for (let i = 0; i < numAxes; i++) {
                const metric = axes[i];
                const score = model.benchmarks[metric] || 0;
                const r = radius * (score / 100);
                const angle = offset + i * angleStep;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            
            // Parse CSS variable if needed (simplistic fallback to blue if var not resolvable in canvas directly easily)
            // A better way is to use computed styles, but for simplicity we'll just set it
            ctx.fillStyle = colorStr.replace(')', ', 0.3)').replace('var(', 'rgba('); // Doesn't work perfectly with CSS vars in canvas
            
            // To safely use CSS vars in canvas, we need getComputedStyle
            const tempEl = document.createElement('div');
            tempEl.style.color = colorStr;
            document.body.appendChild(tempEl);
            const rgbColor = getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
            
            ctx.fillStyle = rgbColor.replace('rgb', 'rgba').replace(')', ', 0.3)');
            ctx.fill();
            
            ctx.strokeStyle = rgbColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw points
            for (let i = 0; i < numAxes; i++) {
                const metric = axes[i];
                const score = model.benchmarks[metric] || 0;
                const r = radius * (score / 100);
                const angle = offset + i * angleStep;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = rgbColor;
                ctx.fill();
            }
        });
    }

    function handleSort(field) {
        if (state.sortBy === field) {
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortBy = field;
            state.sortOrder = 'desc'; // default to desc for metrics
        }
        render();
    }

    function getSortIcon(field) {
        if (state.sortBy !== field) return '<span class="mc-sort-icon">▲</span>';
        return `<span class="mc-sort-icon active">${state.sortOrder === 'asc' ? '▲' : '▼'}</span>`;
    }

    function renderToolbar() {
        return `
            <div class="mc-toolbar">
                <div class="mc-filters">
                    <input type="text" class="mc-input" id="mc-search" placeholder="Buscar modelo..." value="${state.searchQuery}">
                    <select class="mc-select" id="mc-license">
                        <option value="all" ${state.filterCategory === 'all' ? 'selected' : ''}>Todos (Licencia)</option>
                        <option value="open-source" ${state.filterCategory === 'open-source' ? 'selected' : ''}>Open Source</option>
                        <option value="propietario" ${state.filterCategory === 'propietario' ? 'selected' : ''}>Propietario</option>
                    </select>
                </div>
                <div class="mc-view-toggle">
                    <button class="mc-view-btn ${state.view === 'cards' ? 'active' : ''}" data-view="cards">Tarjetas</button>
                    <button class="mc-view-btn ${state.view === 'table' ? 'active' : ''}" data-view="table">Tabla</button>
                </div>
            </div>
        `;
    }

    function renderCards(filteredModels) {
        if (filteredModels.length === 0) {
            return `<div class="mc-empty">No se encontraron modelos con esos filtros.</div>`;
        }

        let html = '<div class="mc-cards-grid">';
        
        filteredModels.forEach(m => {
            const isSelected = state.selectedModels.includes(m.id);
            const eduLinks = getEducationalLinks(m);
            const eduHtml = eduLinks.length > 0 
                ? `<div class="mc-card-section">
                     <h4>Conceptos del Curso Relacionados</h4>
                     <div class="mc-edu-links">
                       ${eduLinks.map(l => `<span class="mc-edu-tag" title="${l.lesson}">${l.key}</span>`).join('')}
                     </div>
                   </div>` 
                : '';

            html += `
                <div class="mc-card ${isSelected ? 'selected' : ''}">
                    <div class="mc-card-header">
                        <div>
                            <h3 class="mc-card-title">${m.name}</h3>
                            <p class="mc-card-subtitle">${m.company} • ${m.releaseDate}</p>
                        </div>
                        <span class="mc-badge ${m.category}">${m.license}</span>
                    </div>
                    
                    <div class="mc-radar-container">
                        <canvas id="radar-${m.id}" class="mc-radar-canvas"></canvas>
                    </div>
                    
                    <div class="mc-card-section">
                        <p><strong>Parámetros:</strong> ${m.params}</p>
                        <p><strong>Contexto:</strong> ${m.contextWindow}</p>
                    </div>
                    
                    ${eduHtml}
                    
                    <button class="mc-compare-btn ${isSelected ? 'selected' : ''}" data-id="${m.id}">
                        ${isSelected ? 'Quitar de comparación' : 'Comparar'}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function renderTable(filteredModels) {
        if (filteredModels.length === 0) {
            return `<div class="mc-empty">No se encontraron modelos con esos filtros.</div>`;
        }

        let html = `
            <div class="mc-table-container">
                <table class="mc-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th data-sort="name">Modelo ${getSortIcon('name')}</th>
                            <th data-sort="params">Parámetros ${getSortIcon('params')}</th>
                            <th data-sort="context">Contexto ${getSortIcon('context')}</th>
                            <th data-sort="MMLU">MMLU ${getSortIcon('MMLU')}</th>
                            <th data-sort="GSM8K">GSM8K ${getSortIcon('GSM8K')}</th>
                            <th data-sort="HellaSwag">HellaSwag ${getSortIcon('HellaSwag')}</th>
                            <th data-sort="HumanEval">HumanEval ${getSortIcon('HumanEval')}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        filteredModels.forEach(m => {
            const isSelected = state.selectedModels.includes(m.id);
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="mc-table-compare-cb" data-id="${m.id}" ${isSelected ? 'checked' : ''}>
                    </td>
                    <td>
                        <strong>${m.name}</strong><br>
                        <span style="font-size: 0.8em; color: var(--text-muted);">${m.company}</span>
                    </td>
                    <td>${m.params}</td>
                    <td>${m.contextWindow}</td>
                    <td>${m.benchmarks.MMLU}</td>
                    <td>${m.benchmarks.GSM8K}</td>
                    <td>${m.benchmarks.HellaSwag}</td>
                    <td>${m.benchmarks.HumanEval}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        return html;
    }

    function renderFloatingBar() {
        const count = state.selectedModels.length;
        const visibleClass = count > 0 ? 'visible' : '';
        
        return `
            <div class="mc-floating-bar ${visibleClass}">
                <div class="mc-floating-text">
                    ${count} modelo${count > 1 ? 's' : ''} seleccionado${count > 1 ? 's' : ''} para comparar
                </div>
                <div class="mc-floating-actions">
                    <button class="mc-btn-secondary" id="mc-clear-compare">Limpiar</button>
                    <button class="mc-btn-primary" id="mc-do-compare" ${count < 2 ? 'disabled' : ''}>
                        Comparar
                    </button>
                </div>
            </div>
        `;
    }

    function renderModal() {
        const activeClass = state.compareModalOpen ? 'active' : '';
        const selectedData = models.filter(m => state.selectedModels.includes(m.id));
        
        let legendHtml = '';
        let columnsHtml = '';
        
        if (selectedData.length > 0) {
            legendHtml = selectedData.map((m, i) => `
                <div class="mc-legend-item">
                    <div class="mc-legend-color" style="background: ${colors[i]}"></div>
                    <span>${m.name}</span>
                </div>
            `).join('');

            columnsHtml = selectedData.map(m => `
                <div class="mc-compare-col">
                    <h3 style="margin-top:0">${m.name}</h3>
                    <p style="color:var(--text-secondary); font-size:0.9em">${m.company}</p>
                    <hr style="border:0; border-top:1px solid var(--border-subtle); margin:1rem 0;">
                    <div class="mc-card-section">
                        <p><strong>Licencia:</strong> ${m.license}</p>
                        <p><strong>Lanzamiento:</strong> ${m.releaseDate}</p>
                        <p><strong>Parámetros:</strong> ${m.params}</p>
                        <p><strong>Contexto:</strong> ${m.contextWindow}</p>
                        <p><strong>Arquitectura:</strong> ${m.architecture}</p>
                        <p><strong>Entrenamiento:</strong> ${m.training}</p>
                        <p style="margin-top:1rem"><em>${m.highlights}</em></p>
                    </div>
                </div>
            `).join('');
        }

        return `
            <div class="mc-modal-overlay ${activeClass}" id="mc-modal-overlay">
                <div class="mc-modal" onclick="event.stopPropagation()">
                    <div class="mc-modal-header">
                        <h2 class="mc-modal-title">Comparación de Modelos</h2>
                        <button class="mc-modal-close" id="mc-close-modal">&times;</button>
                    </div>
                    <div class="mc-modal-body">
                        <div>
                            <div class="mc-legend">${legendHtml}</div>
                            <div class="mc-radar-container mc-modal-radar">
                                <canvas id="radar-compare" class="mc-radar-canvas"></canvas>
                            </div>
                        </div>
                        <div class="mc-compare-grid">
                            ${columnsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        const container = document.querySelector('.model-compare-target');
        if (!container) return;

        const filteredModels = getFilteredAndSortedModels();

        container.innerHTML = `
            <div class="mc-container">
                ${renderToolbar()}
                <div class="mc-content">
                    ${state.view === 'cards' ? renderCards(filteredModels) : renderTable(filteredModels)}
                </div>
                ${renderFloatingBar()}
                ${renderModal()}
            </div>
        `;

        attachEventListeners();

        // Draw canvases after DOM update
        setTimeout(() => {
            if (state.view === 'cards') {
                filteredModels.forEach(m => {
                    drawRadarChart(`radar-${m.id}`, m);
                });
            }
            if (state.compareModalOpen) {
                const selectedData = models.filter(m => state.selectedModels.includes(m.id));
                drawRadarChart('radar-compare', selectedData, colors);
            }
        }, 50);
    }

    function attachEventListeners() {
        // Toolbar
        document.getElementById('mc-search').addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            render();
        });
        document.getElementById('mc-license').addEventListener('change', (e) => {
            state.filterCategory = e.target.value;
            render();
        });
        document.querySelectorAll('.mc-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                state.view = e.target.dataset.view;
                render();
            });
        });

        // Cards Select
        document.querySelectorAll('.mc-compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                toggleModelSelection(e.target.dataset.id);
            });
        });

        // Table Select & Sort
        document.querySelectorAll('.mc-table-compare-cb').forEach(cb => {
            cb.addEventListener('change', (e) => {
                toggleModelSelection(e.target.dataset.id);
            });
        });
        document.querySelectorAll('.mc-table th[data-sort]').forEach(th => {
            th.addEventListener('click', (e) => {
                handleSort(e.currentTarget.dataset.sort);
            });
        });

        // Floating Bar
        const clearBtn = document.getElementById('mc-clear-compare');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                state.selectedModels = [];
                render();
            });
        }
        const doCompareBtn = document.getElementById('mc-do-compare');
        if (doCompareBtn) {
            doCompareBtn.addEventListener('click', () => {
                if (state.selectedModels.length >= 2) {
                    state.compareModalOpen = true;
                    render();
                }
            });
        }

        // Modal
        const overlay = document.getElementById('mc-modal-overlay');
        const closeBtn = document.getElementById('mc-close-modal');
        if (overlay) overlay.addEventListener('click', () => { state.compareModalOpen = false; render(); });
        if (closeBtn) closeBtn.addEventListener('click', () => { state.compareModalOpen = false; render(); });
    }

    // Initialize
    function init() {
        injectStyles();
        render();
        
        // Handle window resize to redraw charts
        window.addEventListener('resize', () => {
            let timeout;
            clearTimeout(timeout);
            timeout = setTimeout(render, 250);
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
