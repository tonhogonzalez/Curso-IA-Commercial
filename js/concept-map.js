(function() {
    'use strict';

    const STYLES = `
        .concept-map-container {
            position: relative;
            width: 100%;
            height: 600px;
            min-height: 60vh;
            border-radius: var(--radius-lg);
            overflow: hidden;
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            font-family: var(--font-body);
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
        }
        
        .concept-map-container.is-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            border-radius: 0;
            border: none;
        }
        
        .cmap-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--bg-card);
            border-bottom: 1px solid var(--border-subtle);
            flex-wrap: wrap;
            gap: 1rem;
        }

        .cmap-filters {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .cmap-filter-btn {
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-secondary);
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full, 9999px);
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .cmap-filter-btn:hover {
            border-color: var(--text-primary);
        }

        .cmap-filter-btn.active {
            border-color: currentColor;
            color: currentColor;
            background: var(--bg-secondary);
        }
        
        .cmap-filter-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: currentColor;
        }

        .cmap-search {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .cmap-search input {
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            outline: none;
        }

        .cmap-search input:focus {
            border-color: var(--accent-blue);
        }

        .cmap-controls {
            display: flex;
            gap: 0.5rem;
        }

        .cmap-btn {
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-primary);
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition-fast);
            display: grid;
            place-items: center;
        }

        .cmap-btn:hover {
            background: var(--bg-secondary);
        }

        .cmap-canvas-wrapper {
            position: relative;
            flex: 1;
            overflow: hidden;
            background: var(--bg-primary);
            cursor: grab;
        }
        
        .cmap-canvas-wrapper:active {
            cursor: grabbing;
        }

        .cmap-canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        .cmap-tooltip {
            position: absolute;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            pointer-events: none;
            opacity: 0;
            transition: opacity var(--transition-fast);
            z-index: 10;
            max-width: 300px;
            transform: translate(-50%, -120%);
        }

        .cmap-tooltip.visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .cmap-tooltip h4 {
            margin: 0 0 0.5rem 0;
            color: var(--text-primary);
            font-family: var(--font-display);
        }
        
        .cmap-tooltip p {
            margin: 0 0 1rem 0;
            color: var(--text-secondary);
            font-size: 0.875rem;
            line-height: 1.4;
        }

        .cmap-tooltip a {
            display: inline-block;
            background: var(--accent-blue);
            color: white;
            text-decoration: none;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            pointer-events: auto;
        }

        .cmap-edge-tooltip {
            position: absolute;
            background: var(--bg-surface);
            color: var(--text-secondary);
            border: 1px solid var(--border-medium);
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity var(--transition-fast);
            transform: translate(-50%, -50%);
            white-space: nowrap;
            z-index: 9;
        }

        .cmap-edge-tooltip.visible {
            opacity: 1;
        }
        
        /* Tema claro/oscuro colores base para JS */
        :root {
            --cmap-c1: var(--accent-violet, #8b5cf6);
            --cmap-c2: var(--accent-blue, #3b82f6);
            --cmap-c3: var(--accent-cyan, #06b6d4);
            --cmap-c4: var(--accent-emerald, #10b981);
            --cmap-c5: var(--accent-amber, #f59e0b);
            --cmap-c6: #0078d4;
            --cmap-text: var(--text-primary, #f8fafc);
            --cmap-bg: var(--bg-surface, #1e293b);
            --cmap-edge: var(--border-medium, #475569);
            --cmap-edge-hover: var(--text-secondary, #94a3b8);
        }
        
        [data-theme="light"] {
            --cmap-text: var(--text-primary, #0f172a);
            --cmap-bg: var(--bg-surface, #ffffff);
            --cmap-edge: var(--border-medium, #cbd5e1);
            --cmap-edge-hover: var(--text-secondary, #64748b);
        }
    `;

    // Datos del grafo
    const CUADERNOS = [
        { id: 1, name: "Cuaderno 01", colorVar: "--cmap-c1", colorHex: "#8b5cf6" },
        { id: 2, name: "Cuaderno 02", colorVar: "--cmap-c2", colorHex: "#3b82f6" },
        { id: 3, name: "Cuaderno 03", colorVar: "--cmap-c3", colorHex: "#06b6d4" },
        { id: 4, name: "Cuaderno 04", colorVar: "--cmap-c4", colorHex: "#10b981" },
        { id: 5, name: "Cuaderno 05", colorVar: "--cmap-c5", colorHex: "#f59e0b" },
        { id: 6, name: "Cuaderno 06", colorVar: "--cmap-c6", colorHex: "#0078d4" }
    ];

    const CUADERNO_LINKS = {
        1: 'cuadernos/01-pep-martorell.html',
        2: 'cuadernos/02-javier-ideami.html',
        3: 'cuadernos/03-compendio-tecnico.html',
        4: 'cuadernos/04-el-universo-del-transformer.html',
        5: 'cuadernos/05-paradigmas-y-computacion.html',
        6: 'cuadernos/06-m365-copilot-banca-comercial.html'
    };

    const NODES = [
        // Cuaderno 01
        { id: "superinterpolador", label: "Superinterpolador Estadístico", c: 1, desc: "Los LLMs vistos como modelos probabilísticos avanzados." },
        { id: "polisemia", label: "Polisemia", c: 1, desc: "Palabras con múltiples significados dependiendo del contexto." },
        { id: "transformers_c1", label: "Transformers", c: 1, desc: "Arquitectura base para el procesamiento de lenguaje natural." },
        { id: "supercomputacion", label: "Supercomputación", c: 1, desc: "Capacidad de cómputo necesaria para entrenar modelos a gran escala." },
        // Cuaderno 02
        { id: "correlacion", label: "Correlación vs Causalidad", c: 2, desc: "La diferencia entre asociación de variables y relaciones causa-efecto." },
        { id: "metaprompting", label: "Metaprompting", c: 2, desc: "El uso de prompts para generar o gestionar otros prompts." },
        { id: "pensamiento_critico", label: "Pensamiento Crítico", c: 2, desc: "Habilidad esencial para evaluar respuestas de IA." },
        { id: "agi", label: "AGI", c: 2, desc: "Inteligencia Artificial General con capacidades humanas o superiores." },
        { id: "alineamiento", label: "Alineamiento", c: 2, desc: "Asegurar que los objetivos de la IA coinciden con los valores humanos." },
        // Cuaderno 03
        { id: "backprop", label: "Backpropagation", c: 3, desc: "Algoritmo para calcular gradientes en redes neuronales." },
        { id: "adamw", label: "AdamW", c: 3, desc: "Variante del optimizador Adam con weight decay corregido." },
        { id: "kv_cache", label: "KV Cache", c: 3, desc: "Mecanismo para optimizar la inferencia guardando Keys y Values previos." },
        { id: "rag", label: "RAG", c: 3, desc: "Generación Aumentada por Recuperación." },
        { id: "agentes", label: "Agentes Autónomos", c: 3, desc: "Sistemas capaces de planificar y ejecutar acciones." },
        { id: "embeddings", label: "Embeddings", c: 3, desc: "Representaciones vectoriales de conceptos o textos." },
        // Cuaderno 04
        { id: "self_attention", label: "Self-Attention", c: 4, desc: "Mecanismo que permite a un modelo sopesar diferentes partes del input." },
        { id: "multi_head", label: "Multi-Head Attention", c: 4, desc: "Uso de múltiples mecanismos de atención en paralelo." },
        { id: "rope", label: "RoPE / ALiBi", c: 4, desc: "Técnicas de codificación posicional relativa." },
        { id: "softmax", label: "Softmax", c: 4, desc: "Función de activación para convertir logits en probabilidades." },
        { id: "rlhf", label: "RLHF", c: 4, desc: "Aprendizaje por refuerzo a partir de retroalimentación humana." },
        { id: "grounding", label: "Grounding", c: 4, desc: "Anclar respuestas del modelo a fuentes de información reales." },
        // Cuaderno 05
        { id: "turing_conexionismo", label: "Turing vs Conexionismo", c: 5, desc: "Paradigmas fundamentales de la computación y la IA." },
        { id: "autodiff", label: "Autodiff / DAG", c: 5, desc: "Diferenciación automática basada en grafos acíclicos dirigidos." },
        { id: "sgd_adam", label: "SGD / Adam", c: 5, desc: "Optimizadores fundamentales." },
        { id: "ln", label: "Pre-LN vs Post-LN", c: 5, desc: "Variantes en la ubicación de Layer Normalization." },
        { id: "eval", label: "Evaluation Harness", c: 5, desc: "Marcos estandarizados para evaluar LLMs." },
        { id: "graphrag", label: "GraphRAG", c: 5, desc: "RAG potenciado con Grafos de Conocimiento." },
        // Cuaderno 06
        { id: "framework_ocfe", label: "Framework OCFE", c: 6, desc: "Estructuración de prompts corporativos: Objetivo, Contexto, Fuente y Expectativas." },
        { id: "copilot_studio", label: "Copilot Studio / Agentes", c: 6, desc: "Desarrollo y modelado de agentes declarativos con System Instructions especializadas." },
        { id: "copilot_notebooks", label: "Copilot Notebooks", c: 6, desc: "Espacios de inferencia acotados con Grounding restrictivo absoluto (hasta 300 archivos)." },
        { id: "banca_tier1", label: "Banca Comercial Tier 1", c: 6, desc: "Aplicaciones avanzadas en Riesgos de Crédito, KYC/AML, Sindicaciones y Cash Management." },
        { id: "excel_python", label: "Excel con Python", c: 6, desc: "Modelado financiero avanzado, simulaciones Monte Carlo, RAROC y ratios de solvencia." }
    ];

    const EDGES = [
        { source: "transformers_c1", target: "self_attention", label: "mecanismo central" },
        { source: "backprop", target: "autodiff", label: "implementación" },
        { source: "adamw", target: "sgd_adam", label: "evolución" },
        { source: "embeddings", target: "polisemia", label: "resolución" },
        { source: "rag", target: "graphrag", label: "extensión" },
        { source: "rag", target: "grounding", label: "técnica" },
        { source: "self_attention", target: "multi_head", label: "composición" },
        { source: "kv_cache", target: "self_attention", label: "optimización" },
        { source: "rlhf", target: "alineamiento", label: "método" },
        { source: "metaprompting", target: "agentes", label: "orquestación" },
        { source: "eval", target: "rlhf", label: "validación" },
        { source: "transformers_c1", target: "supercomputacion", label: "requiere" },
        { source: "superinterpolador", target: "agi", label: "debate" },
        { source: "correlacion", target: "pensamiento_critico", label: "base de" },
        { source: "self_attention", target: "softmax", label: "utiliza" },
        { source: "self_attention", target: "rope", label: "posicionamiento" },
        { source: "turing_conexionismo", target: "transformers_c1", label: "paradigma" },
        { source: "ln", target: "transformers_c1", label: "estabilidad" },
        // Edges Cuaderno 06
        { source: "framework_ocfe", target: "metaprompting", label: "ingeniería de prompts" },
        { source: "copilot_notebooks", target: "grounding", label: "sandbox restrictivo" },
        { source: "copilot_studio", target: "agentes", label: "plataforma de agentes" },
        { source: "banca_tier1", target: "framework_ocfe", label: "metodología" },
        { source: "excel_python", target: "banca_tier1", label: "análisis de riesgos" }
    ];

    class ConceptMap {
        constructor(container) {
            this.container = container;
            this.initDOM();
            
            this.canvas = this.container.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.tooltip = this.container.querySelector('.cmap-tooltip');
            this.edgeTooltip = this.container.querySelector('.cmap-edge-tooltip');
            
            // State
            this.nodes = JSON.parse(JSON.stringify(NODES));
            this.edges = JSON.parse(JSON.stringify(EDGES));
            this.width = 0;
            this.height = 0;
            
            this.transform = { x: 0, y: 0, k: 1 };
            this.dragState = { node: null, isDragging: false, isPanning: false, startX: 0, startY: 0 };
            this.hoveredNode = null;
            this.hoveredEdge = null;
            
            this.activeFilters = new Set([1, 2, 3, 4, 5, 6]);
            this.searchQuery = "";
            this.isFullscreen = false;

            this.styleCache = {
                bg: '#1e293b',
                text: '#f8fafc',
                edge: '#475569',
                edgeHover: '#94a3b8'
            };
            
            this.initPhysics();
            this.resize();
            this.bindEvents();
            this.updateThemeColors();
            
            // Start loop
            this.animationId = requestAnimationFrame(() => this.tick());
            
            // Observer for theme changes
            const observer = new MutationObserver(() => {
                this.updateThemeColors();
                this.draw();
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }

        initDOM() {
            this.container.innerHTML = `
                <div class="cmap-toolbar">
                    <div class="cmap-filters">
                        ${CUADERNOS.map(c => `
                            <button class="cmap-filter-btn active" data-c="${c.id}" style="color: var(${c.colorVar})">
                                <span class="cmap-filter-dot"></span>
                                C${c.id}
                            </button>
                        `).join('')}
                    </div>
                    <div class="cmap-search">
                        <input type="text" placeholder="Buscar concepto..." aria-label="Buscar concepto">
                    </div>
                    <div class="cmap-controls">
                        <button class="cmap-btn cmap-btn-center" aria-label="Centrar vista">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19 12h2M3 12h2M12 3v2M12 19v2M19 5l-2 2M5 19l2-2M5 5l2 2M19 19l-2-2"></path></svg>
                        </button>
                        <button class="cmap-btn cmap-btn-fs" aria-label="Pantalla completa">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="cmap-canvas-wrapper">
                    <canvas class="cmap-canvas"></canvas>
                    <div class="cmap-tooltip">
                        <h4></h4>
                        <p></p>
                        <a href="#">Ir al cuaderno</a>
                    </div>
                    <div class="cmap-edge-tooltip"></div>
                </div>
            `;
        }
        
        updateThemeColors() {
            const computedStyle = getComputedStyle(document.documentElement);
            this.styleCache.text = computedStyle.getPropertyValue('--cmap-text').trim() || '#f8fafc';
            this.styleCache.bg = computedStyle.getPropertyValue('--cmap-bg').trim() || '#1e293b';
            this.styleCache.edge = computedStyle.getPropertyValue('--cmap-edge').trim() || '#475569';
            this.styleCache.edgeHover = computedStyle.getPropertyValue('--cmap-edge-hover').trim() || '#94a3b8';
            
            CUADERNOS.forEach(c => {
                c.colorHex = computedStyle.getPropertyValue(c.colorVar).trim() || c.colorHex;
            });
        }

        initPhysics() {
            // Inicializar posiciones aleatorias
            this.nodes.forEach(n => {
                n.x = Math.random() * 800 - 400;
                n.y = Math.random() * 600 - 300;
                n.vx = 0;
                n.vy = 0;
                n.width = 150; // Calculado después pero inicial
                n.height = 40;
                
                // Map edges
                n.edges = [];
            });
            
            // Referencias directas para edges
            this.edges.forEach(e => {
                e.sourceNode = this.nodes.find(n => n.id === e.source);
                e.targetNode = this.nodes.find(n => n.id === e.target);
                if(e.sourceNode && e.targetNode) {
                    e.sourceNode.edges.push(e);
                    e.targetNode.edges.push(e);
                }
            });
        }

        tick() {
            this.updatePhysics();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.tick());
        }

        updatePhysics() {
            const alpha = 0.1; // cooling factor
            const repelStrength = 5000;
            const springLength = 150;
            const springStrength = 0.05;
            const damping = 0.8;
            
            const visibleNodes = this.nodes.filter(n => this.activeFilters.has(n.c));
            
            // 1. Repulsion
            for (let i = 0; i < visibleNodes.length; i++) {
                for (let j = i + 1; j < visibleNodes.length; j++) {
                    const n1 = visibleNodes[i];
                    const n2 = visibleNodes[j];
                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq > 0 && distSq < 90000) { // Max repulsion distance
                        const dist = Math.sqrt(distSq);
                        const force = repelStrength / distSq;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        
                        if (n1 !== this.dragState.node) {
                            n1.vx -= fx * alpha;
                            n1.vy -= fy * alpha;
                        }
                        if (n2 !== this.dragState.node) {
                            n2.vx += fx * alpha;
                            n2.vy += fy * alpha;
                        }
                    }
                }
            }
            
            // 2. Springs (Edges)
            this.edges.forEach(e => {
                if(!e.sourceNode || !e.targetNode) return;
                if(!this.activeFilters.has(e.sourceNode.c) || !this.activeFilters.has(e.targetNode.c)) return;
                
                const dx = e.targetNode.x - e.sourceNode.x;
                const dy = e.targetNode.y - e.sourceNode.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 0) {
                    const force = (dist - springLength) * springStrength;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    
                    if (e.sourceNode !== this.dragState.node) {
                        e.sourceNode.vx += fx * alpha;
                        e.sourceNode.vy += fy * alpha;
                    }
                    if (e.targetNode !== this.dragState.node) {
                        e.targetNode.vx -= fx * alpha;
                        e.targetNode.vy -= fy * alpha;
                    }
                }
            });
            
            // 3. Center gravity
            visibleNodes.forEach(n => {
                const force = 0.01;
                if (n !== this.dragState.node) {
                    n.vx += -n.x * force * alpha;
                    n.vy += -n.y * force * alpha;
                }
            });
            
            // 4. Update positions
            visibleNodes.forEach(n => {
                if (n !== this.dragState.node) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.vx *= damping;
                    n.vy *= damping;
                }
            });
        }

        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            this.ctx.save();
            this.ctx.translate(this.width / 2 + this.transform.x, this.height / 2 + this.transform.y);
            this.ctx.scale(this.transform.k, this.transform.k);
            
            const visibleNodes = this.nodes.filter(n => this.activeFilters.has(n.c));
            const visibleEdges = this.edges.filter(e => 
                e.sourceNode && e.targetNode && 
                this.activeFilters.has(e.sourceNode.c) && 
                this.activeFilters.has(e.targetNode.c)
            );
            
            // Draw edges
            visibleEdges.forEach(e => {
                this.ctx.beginPath();
                this.ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
                this.ctx.lineTo(e.targetNode.x, e.targetNode.y);
                
                const isHovered = this.hoveredEdge === e;
                const involvesHoveredNode = this.hoveredNode && (e.sourceNode === this.hoveredNode || e.targetNode === this.hoveredNode);
                
                if (isHovered || involvesHoveredNode) {
                    this.ctx.strokeStyle = this.styleCache.edgeHover;
                    this.ctx.lineWidth = 2 / this.transform.k;
                } else {
                    this.ctx.strokeStyle = this.styleCache.edge;
                    this.ctx.lineWidth = 1 / this.transform.k;
                }
                
                // Fade out edges if searching
                if (this.searchQuery && !involvesHoveredNode) {
                    this.ctx.globalAlpha = 0.2;
                }
                
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            });
            
            // Draw nodes
            this.ctx.font = '12px Inter, sans-serif';
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            
            visibleNodes.forEach(n => {
                const isHovered = this.hoveredNode === n;
                const isMatched = this.searchQuery && n.label.toLowerCase().includes(this.searchQuery);
                const isDimmed = this.searchQuery && !isMatched && !isHovered;
                
                const cObj = CUADERNOS.find(c => c.id === n.c);
                const color = cObj ? cObj.colorHex : '#888';
                
                // Medir ancho texto
                const textMetrics = this.ctx.measureText(n.label);
                n.width = Math.max(120, textMetrics.width + 30);
                n.height = 36;
                
                this.ctx.globalAlpha = isDimmed ? 0.2 : 1.0;
                
                // Sombra si está hovered
                if (isHovered || isMatched) {
                    this.ctx.shadowColor = color;
                    this.ctx.shadowBlur = 10;
                } else {
                    this.ctx.shadowBlur = 0;
                }
                
                // Fondo nodo
                this.ctx.beginPath();
                this.ctx.roundRect(n.x - n.width/2, n.y - n.height/2, n.width, n.height, 8);
                this.ctx.fillStyle = this.styleCache.bg;
                this.ctx.fill();
                
                // Borde nodo
                this.ctx.lineWidth = isHovered || isMatched ? 2 : 1;
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                
                this.ctx.shadowBlur = 0; // reset shadow
                
                // Texto
                this.ctx.fillStyle = isHovered || isMatched ? color : this.styleCache.text;
                this.ctx.fillText(n.label, n.x, n.y);
            });
            
            this.ctx.restore();
            
            // Update tooltip position if visible
            if (this.hoveredNode && this.tooltip.classList.contains('visible')) {
                const screenX = (this.hoveredNode.x * this.transform.k) + (this.width / 2) + this.transform.x;
                const screenY = (this.hoveredNode.y * this.transform.k) + (this.height / 2) + this.transform.y;
                this.tooltip.style.left = `${screenX}px`;
                this.tooltip.style.top = `${screenY - (this.hoveredNode.height/2 * this.transform.k) - 10}px`;
            }
            
            // Edge tooltip position
            if (this.hoveredEdge && !this.hoveredNode) {
                const midX = (this.hoveredEdge.sourceNode.x + this.hoveredEdge.targetNode.x) / 2;
                const midY = (this.hoveredEdge.sourceNode.y + this.hoveredEdge.targetNode.y) / 2;
                const screenX = (midX * this.transform.k) + (this.width / 2) + this.transform.x;
                const screenY = (midY * this.transform.k) + (this.height / 2) + this.transform.y;
                this.edgeTooltip.style.left = `${screenX}px`;
                this.edgeTooltip.style.top = `${screenY}px`;
                this.edgeTooltip.textContent = this.hoveredEdge.label;
                this.edgeTooltip.classList.add('visible');
            } else {
                this.edgeTooltip.classList.remove('visible');
            }
        }

        resize() {
            const rect = this.container.querySelector('.cmap-canvas-wrapper').getBoundingClientRect();
            // Handle high DPI displays
            const dpr = window.devicePixelRatio || 1;
            this.width = rect.width;
            this.height = rect.height;
            
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.scale(dpr, dpr);
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            const wrapper = this.container.querySelector('.cmap-canvas-wrapper');
            
            // Mouse / Touch events for pan and drag
            wrapper.addEventListener('mousedown', this.onPointerDown.bind(this));
            wrapper.addEventListener('mousemove', this.onPointerMove.bind(this));
            window.addEventListener('mouseup', this.onPointerUp.bind(this));
            
            wrapper.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.onPointerDown(e.touches[0]);
            }, { passive: false });
            wrapper.addEventListener('touchmove', (e) => {
                e.preventDefault();
                this.onPointerMove(e.touches[0]);
            }, { passive: false });
            window.addEventListener('touchend', this.onPointerUp.bind(this));
            
            // Zoom
            wrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = -e.deltaY * 0.001;
                const newK = Math.max(0.2, Math.min(3, this.transform.k * (1 + zoomFactor)));
                
                // Zoom towards mouse position
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - this.width/2;
                const mouseY = e.clientY - rect.top - this.height/2;
                
                this.transform.x = mouseX - (mouseX - this.transform.x) * (newK / this.transform.k);
                this.transform.y = mouseY - (mouseY - this.transform.y) * (newK / this.transform.k);
                this.transform.k = newK;
            }, { passive: false });
            
            // Tooltip clicks
            wrapper.addEventListener('click', (e) => {
                if (this.dragState.wasDragging) return; // Don't click if just finished dragging
                if (this.hoveredNode) {
                    this.showTooltip(this.hoveredNode);
                } else {
                    this.hideTooltip();
                }
            });
            
            // Toolbar interactions
            const filterBtns = this.container.querySelectorAll('.cmap-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const c = parseInt(btn.dataset.c);
                    if (this.activeFilters.has(c)) {
                        this.activeFilters.delete(c);
                        btn.classList.remove('active');
                        btn.style.color = 'var(--text-secondary)';
                    } else {
                        this.activeFilters.add(c);
                        btn.classList.add('active');
                        const cObj = CUADERNOS.find(x => x.id === c);
                        btn.style.color = `var(${cObj.colorVar})`;
                    }
                    this.hideTooltip();
                });
            });
            
            const searchInput = this.container.querySelector('.cmap-search input');
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
            });
            
            this.container.querySelector('.cmap-btn-center').addEventListener('click', () => {
                this.transform = { x: 0, y: 0, k: 1 };
            });
            
            this.container.querySelector('.cmap-btn-fs').addEventListener('click', () => {
                this.isFullscreen = !this.isFullscreen;
                if (this.isFullscreen) {
                    this.container.classList.add('is-fullscreen');
                    document.body.style.overflow = 'hidden';
                } else {
                    this.container.classList.remove('is-fullscreen');
                    document.body.style.overflow = '';
                }
                setTimeout(() => this.resize(), 50); // delay for css transition
            });
        }
        
        getGraphPos(clientX, clientY) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (clientX - rect.left - this.width/2 - this.transform.x) / this.transform.k;
            const y = (clientY - rect.top - this.height/2 - this.transform.y) / this.transform.k;
            return { x, y };
        }

        findNodeAt(x, y) {
            const visibleNodes = this.nodes.filter(n => this.activeFilters.has(n.c));
            for (let i = visibleNodes.length - 1; i >= 0; i--) {
                const n = visibleNodes[i];
                if (x >= n.x - n.width/2 && x <= n.x + n.width/2 &&
                    y >= n.y - n.height/2 && y <= n.y + n.height/2) {
                    return n;
                }
            }
            return null;
        }
        
        findEdgeAt(x, y) {
            const visibleEdges = this.edges.filter(e => 
                e.sourceNode && e.targetNode && 
                this.activeFilters.has(e.sourceNode.c) && 
                this.activeFilters.has(e.targetNode.c)
            );
            
            for (const e of visibleEdges) {
                // Distancia punto a segmento
                const l2 = Math.pow(e.sourceNode.x - e.targetNode.x, 2) + Math.pow(e.sourceNode.y - e.targetNode.y, 2);
                if (l2 === 0) continue;
                let t = ((x - e.sourceNode.x) * (e.targetNode.x - e.sourceNode.x) + (y - e.sourceNode.y) * (e.targetNode.y - e.sourceNode.y)) / l2;
                t = Math.max(0, Math.min(1, t));
                const projX = e.sourceNode.x + t * (e.targetNode.x - e.sourceNode.x);
                const projY = e.sourceNode.y + t * (e.targetNode.y - e.sourceNode.y);
                const dist = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));
                
                if (dist < 10 / this.transform.k) {
                    return e;
                }
            }
            return null;
        }

        onPointerDown(e) {
            const pos = this.getGraphPos(e.clientX, e.clientY);
            const node = this.findNodeAt(pos.x, pos.y);
            
            if (node) {
                this.dragState = {
                    node: node,
                    isDragging: true,
                    isPanning: false,
                    wasDragging: false
                };
                // Stop its velocity
                node.vx = 0;
                node.vy = 0;
            } else {
                this.dragState = {
                    node: null,
                    isDragging: false,
                    isPanning: true,
                    startX: e.clientX - this.transform.x,
                    startY: e.clientY - this.transform.y,
                    wasDragging: false
                };
            }
        }

        onPointerMove(e) {
            const pos = this.getGraphPos(e.clientX, e.clientY);
            
            if (this.dragState.isDragging && this.dragState.node) {
                this.dragState.node.x = pos.x;
                this.dragState.node.y = pos.y;
                this.dragState.wasDragging = true;
                this.hideTooltip();
            } else if (this.dragState.isPanning) {
                this.transform.x = e.clientX - this.dragState.startX;
                this.transform.y = e.clientY - this.dragState.startY;
                this.dragState.wasDragging = true;
                this.hideTooltip();
            } else {
                // Hover detection
                const hoveredNode = this.findNodeAt(pos.x, pos.y);
                if (hoveredNode !== this.hoveredNode) {
                    this.hoveredNode = hoveredNode;
                    if(this.hoveredNode) {
                        this.canvas.style.cursor = 'pointer';
                    } else {
                        this.canvas.style.cursor = 'grab';
                    }
                }
                
                if(!hoveredNode) {
                    this.hoveredEdge = this.findEdgeAt(pos.x, pos.y);
                } else {
                    this.hoveredEdge = null;
                }
            }
        }

        onPointerUp() {
            this.dragState.isDragging = false;
            this.dragState.isPanning = false;
            this.dragState.node = null;
            // wasDragging is reset on click
        }
        
        showTooltip(node) {
            const h4 = this.tooltip.querySelector('h4');
            const p = this.tooltip.querySelector('p');
            const a = this.tooltip.querySelector('a');
            
            h4.textContent = node.label;
            p.textContent = node.desc;
            
            const cObj = CUADERNOS.find(c => c.id === node.c);
            h4.style.color = `var(${cObj.colorVar})`;
            
            a.href = CUADERNO_LINKS[node.c] || '#';
            
            this.tooltip.classList.add('visible');
        }
        
        hideTooltip() {
            this.tooltip.classList.remove('visible');
        }
    }

    // Insertar estilos
    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        const target = document.querySelector('.concept-map-target');
        if (target) {
            new ConceptMap(target);
        }
    });

})();
