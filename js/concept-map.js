(function() {
    'use strict';

    const STYLES = `
        .concept-map-container {
            position: relative;
            width: 100%;
            height: 660px;
            min-height: 64vh;
            border-radius: var(--radius-lg);
            overflow: hidden;
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            font-family: var(--font-body);
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
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
            padding: 0.85rem 1.15rem;
            background: var(--bg-card);
            border-bottom: 1px solid var(--border-subtle);
            flex-wrap: wrap;
            gap: 0.75rem;
            z-index: 12;
        }

        .cmap-filters {
            display: flex;
            gap: 0.4rem;
            flex-wrap: wrap;
            align-items: center;
        }

        .cmap-filter-btn {
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-secondary);
            padding: 0.28rem 0.68rem;
            border-radius: var(--radius-full, 9999px);
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 0.4rem;
            user-select: none;
        }

        .cmap-filter-btn:hover {
            border-color: var(--text-primary);
            transform: translateY(-1px);
        }

        .cmap-filter-btn.active {
            border-color: currentColor;
            color: currentColor;
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 12px -4px currentColor;
        }
        
        .cmap-filter-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: currentColor;
        }

        .cmap-search {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            max-width: 260px;
        }

        .cmap-search input {
            width: 100%;
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-primary);
            padding: 0.42rem 0.85rem;
            border-radius: var(--radius-sm);
            font-size: 0.82rem;
            outline: none;
            transition: border-color 0.15s ease;
        }

        .cmap-search input:focus {
            border-color: var(--accent-cyan, #06b6d4);
        }

        .cmap-controls {
            display: flex;
            gap: 0.4rem;
            align-items: center;
        }

        .cmap-btn {
            background: var(--bg-surface);
            border: 1px solid var(--border-medium);
            color: var(--text-primary);
            padding: 0.42rem 0.6rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition-fast);
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .cmap-btn:hover {
            background: var(--bg-secondary);
            border-color: var(--accent-cyan, #06b6d4);
        }

        .cmap-canvas-wrapper {
            position: relative;
            flex: 1;
            overflow: hidden;
            background: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.35) 0%, var(--bg-primary) 85%);
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

        /* Tarjeta de Inspección Fija con Foco Blindado */
        .cmap-tooltip {
            position: absolute;
            background: rgba(13, 18, 30, 0.96);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(99, 102, 241, 0.45);
            border-radius: 12px;
            padding: 1.1rem 1.2rem;
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06);
            pointer-events: none;
            opacity: 0;
            transition: opacity 160ms ease, transform 160ms cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 30;
            width: 310px;
            max-width: calc(100% - 24px);
            transform: translate(-50%, -108%) scale(0.96);
        }

        [data-theme="light"] .cmap-tooltip {
            background: rgba(255, 255, 255, 0.98);
            border-color: rgba(59, 130, 246, 0.45);
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
        }

        .cmap-tooltip.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translate(-50%, -112%) scale(1);
            cursor: default;
        }

        .cmap-tooltip-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.35rem;
        }

        .cmap-tooltip-badge {
            font-family: var(--font-mono);
            font-size: 0.66rem;
            font-weight: 700;
            text-transform: uppercase;
            padding: 0.15rem 0.5rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.07);
            letter-spacing: 0.04em;
        }

        .cmap-tooltip-close {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 0.9rem;
            line-height: 1;
            padding: 2px 5px;
            border-radius: 4px;
        }

        .cmap-tooltip-close:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.08);
        }
        
        .cmap-tooltip h4 {
            margin: 0 0 0.45rem 0;
            color: var(--text-primary);
            font-family: var(--font-display);
            font-size: 1.02rem;
            line-height: 1.25;
        }
        
        .cmap-tooltip p {
            margin: 0 0 0.85rem 0;
            color: var(--text-secondary);
            font-size: 0.82rem;
            line-height: 1.48;
        }

        .cmap-tooltip-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
        }

        .cmap-tooltip a.cmap-goto-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            width: 100%;
            background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
            color: #060913 !important;
            font-weight: 700;
            text-decoration: none;
            padding: 0.48rem 0.85rem;
            border-radius: 7px;
            font-size: 0.8rem;
            pointer-events: auto;
            box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cmap-tooltip a.cmap-goto-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(6, 182, 212, 0.5);
        }

        .cmap-hint-bar {
            position: absolute;
            bottom: 10px;
            left: 14px;
            z-index: 8;
            font-size: 0.72rem;
            color: var(--text-muted);
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(8px);
            padding: 0.3rem 0.7rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.07);
            pointer-events: none;
        }

        [data-theme="light"] .cmap-hint-bar {
            background: rgba(255, 255, 255, 0.85);
            border-color: rgba(15, 23, 42, 0.1);
        }

        .cmap-edge-tooltip {
            position: absolute;
            background: var(--bg-surface);
            color: var(--text-primary);
            border: 1px solid var(--border-medium);
            padding: 0.25rem 0.55rem;
            border-radius: var(--radius-sm);
            font-size: 0.72rem;
            font-weight: 600;
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
        
        :root {
            --cmap-c1: #8b5cf6;
            --cmap-c2: #3b82f6;
            --cmap-c3: #06b6d4;
            --cmap-c4: #10b981;
            --cmap-c5: #f59e0b;
            --cmap-c6: #0ea5e9;
            --cmap-c7: #ec4899;
            --cmap-c8: #a855f7;
            --cmap-c9: #14b8a6;
            --cmap-text: var(--text-primary, #f8fafc);
            --cmap-bg: var(--bg-surface, #111827);
            --cmap-edge: var(--border-medium, #334155);
            --cmap-edge-hover: #38bdf8;
        }
        
        [data-theme="light"] {
            --cmap-text: var(--text-primary, #0f172a);
            --cmap-bg: var(--bg-surface, #ffffff);
            --cmap-edge: var(--border-medium, #cbd5e1);
            --cmap-edge-hover: #0284c7;
        }
    `;

    // Los 9 Cuadernos del Curso con sus rutas y anclas
    const CUADERNOS = [
        { id: 1, short: "C1", name: "Cuaderno 01 · Pep Martorell", colorVar: "--cmap-c1", colorHex: "#8b5cf6", cx: -320, cy: -180 },
        { id: 2, short: "C2", name: "Cuaderno 02 · Javier Ideami", colorVar: "--cmap-c2", colorHex: "#3b82f6", cx: 0, cy: -220 },
        { id: 3, short: "C3", name: "Cuaderno 03 · Compendio Técnico", colorVar: "--cmap-c3", colorHex: "#06b6d4", cx: 320, cy: -180 },
        { id: 4, short: "C4", name: "Cuaderno 04 · Universo Transformer", colorVar: "--cmap-c4", colorHex: "#10b981", cx: -340, cy: 10 },
        { id: 5, short: "C5", name: "Cuaderno 05 · Paradigmas & Harness", colorVar: "--cmap-c5", colorHex: "#f59e0b", cx: 0, cy: 0 },
        { id: 6, short: "C6", name: "Cuaderno 06 · M365 Banca Comercial", colorVar: "--cmap-c6", colorHex: "#0ea5e9", cx: 340, cy: 10 },
        { id: 7, short: "C7", name: "Cuaderno 07 · Migración ChatGPT→M365", colorVar: "--cmap-c7", colorHex: "#ec4899", cx: -300, cy: 190 },
        { id: 8, short: "C8", name: "Cuaderno 08 · Agentes VS Code & PaceUI", colorVar: "--cmap-c8", colorHex: "#a855f7", cx: 0, cy: 210 },
        { id: 9, short: "C9", name: "Cuaderno 09 · Databricks, Excel & Diccionario", colorVar: "--cmap-c9", colorHex: "#14b8a6", cx: 320, cy: 190 }
    ];

    const CUADERNO_LINKS = {
        1: 'cuadernos/01-pep-martorell.html',
        2: 'cuadernos/02-javier-ideami.html',
        3: 'cuadernos/03-compendio-tecnico.html',
        4: 'cuadernos/04-el-universo-del-transformer.html',
        5: 'cuadernos/05-paradigmas-y-computacion.html',
        6: 'cuadernos/06-m365-copilot-banca-comercial.html',
        7: 'cuadernos/07-migracion-chatgpt-copilot-m365.html',
        8: 'cuadernos/08-agentes-vscode-ux-dashboards.html',
        9: 'cuadernos/09-ingenieria-visual-databricks-m365-vscode.html'
    };

    // 48 Conceptos Clave distribuidos en los 9 Cuadernos con enlace directo a la sección exacta
    const NODES = [
        // Cuaderno 01
        { id: "superinterpolador", label: "Superinterpolador Estadístico", c: 1, url: "cuadernos/01-pep-martorell.html#interpolador", desc: "Los LLMs como interpoladores de alta dimensión que navegan el espacio latente sin deducir leyes físicas fuera de su distribución." },
        { id: "polisemia", label: "Polisemia Contextual", c: 1, url: "cuadernos/01-pep-martorell.html#transformers", desc: "Resolución dinámica del significado de cada palabra según los tokens circundantes mediante mecanismos de atención." },
        { id: "transformers_c1", label: "Transformers", c: 1, url: "cuadernos/01-pep-martorell.html#transformers", desc: "Arquitectura paralela que sustituyó a las RNN secuenciales y permitió escalar el entrenamiento masivo." },
        { id: "supercomputacion", label: "Supercomputación & Soberanía", c: 1, url: "cuadernos/01-pep-martorell.html#gigafactorias", desc: "Infraestructura de cómputo (GPUs, interconexión y energía) e impacto en el sistema productivo y científico." },
        { id: "agentizacion_c1", label: "Agentización Empresarial", c: 1, url: "cuadernos/01-pep-martorell.html#agentizacion", desc: "Transición desde chatbots conversacionales hacia enjambres de agentes que ejecutan procesos de negocio." },

        // Cuaderno 02
        { id: "correlacion", label: "Correlación vs Causalidad", c: 2, url: "cuadernos/02-javier-ideami.html#causalidad", desc: "Distinción crítica entre asociación estadística en datos históricos y comprensión causal de intervenciones." },
        { id: "metaprompting", label: "Metaprompting", c: 2, url: "cuadernos/02-javier-ideami.html#prompting", desc: "Usar al propio LLM como ingeniero de prompts para auditar, refinar y estructurar instrucciones complejas." },
        { id: "pensamiento_critico", label: "Musculatura Cognitiva", c: 2, url: "cuadernos/02-javier-ideami.html#musculatura", desc: "Entrenamiento deliberado del juicio crítico humano para auditar y dirigir sistemas generativos sin atrofia cognitiva." },
        { id: "agi", label: "Horizonte AGI 2030", c: 2, url: "cuadernos/02-javier-ideami.html#horizonte-2030", desc: "Evolución hacia sistemas multimodales con razonamiento híbrido y modelos del mundo." },
        { id: "alineamiento", label: "Alineamiento & Gobernanza", c: 2, url: "cuadernos/02-javier-ideami.html#alineamiento", desc: "Garantizar que la optimización de objetivos de la IA respete las intenciones, seguridad y ética humanas." },

        // Cuaderno 03
        { id: "backprop", label: "Backpropagation", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-2", desc: "Propagación hacia atrás del error mediante la regla de la cadena para ajustar miles de millones de pesos." },
        { id: "adamw", label: "Optimizador AdamW", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-3", desc: "Optimizador con momentos adaptativos y Weight Decay desacoplado, estándar en el entrenamiento de LLMs." },
        { id: "kv_cache", label: "KV Cache & FlashAttention", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-8", desc: "Almacenamiento en VRAM de tensores Key/Value previos para reducir la complejidad de inferencia de O(N²) a O(N)." },
        { id: "rag", label: "Arquitectura RAG", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-9", desc: "Generación Aumentada por Recuperación: búsqueda vectorial e inyección documental en tiempo de inferencia." },
        { id: "agentes", label: "Flujos Agenciales ReAct", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-10", desc: "Bucle Razonamiento + Acción con uso de herramientas (Tool Calling), memoria y planificación." },
        { id: "embeddings", label: "Espacios de Embeddings", c: 3, url: "cuadernos/03-compendio-tecnico.html#modulo-4", desc: "Geometría vectorial continua donde la similitud coseno captura relaciones semánticas y financieras." },

        // Cuaderno 04
        { id: "self_attention", label: "Scaled Dot-Product Attention", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-3", desc: "Cálculo matricial Softmax(Q·Kᵀ / √d_k)·V que pondera la relevancia cruzada entre todos los tokens." },
        { id: "multi_head", label: "Multi-Head Attention", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-4", desc: "Atención en paralelo sobre múltiples subespacios de proyección para capturar sintaxis, semántica y contexto." },
        { id: "rope", label: "Codificación RoPE / ALiBi", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-6", desc: "Codificación posicional rotatoria relativa que permite extrapolar ventanas de contexto largas." },
        { id: "softmax", label: "Softmax & Temperatura", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-7", desc: "Normalización exponencial de logits en distribución de probabilidad controlada por Temperatura y Top-P." },
        { id: "rlhf", label: "RLHF / DPO", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-7", desc: "Ajuste fino post-entrenamiento basado en preferencias humanas para alinear utilidad y seguridad." },
        { id: "grounding", label: "Grounding Corporativo", c: 4, url: "cuadernos/04-el-universo-del-transformer.html#seccion-8", desc: "Anclaje estricto de las respuestas del modelo a fuentes verificables con trazabilidad de citas." },

        // Cuaderno 05
        { id: "turing_conexionismo", label: "Turing vs Conexionismo", c: 5, url: "cuadernos/05-paradigmas-y-computacion.html#m1-epistemologia", desc: "Contraste entre lógica simbólica explícita y representaciones subsimbólicas distribuidas en redes neuronales." },
        { id: "autodiff", label: "Autodiff / Grafos DAG", c: 5, url: "cuadernos/05-paradigmas-y-computacion.html#m2-autodiff", desc: "Diferenciación automática exacta sobre grafos computacionales acíclicos dirigidos en PyTorch." },
        { id: "ln", label: "Pre-LN vs Post-LN", c: 5, url: "cuadernos/05-paradigmas-y-computacion.html#m5-pre-post-ln", desc: "Normalización de capa previa en la vía residual que estabiliza el gradiente sin requerir warmup crítico." },
        { id: "eval", label: "Evaluation Harness", c: 5, url: "cuadernos/05-paradigmas-y-computacion.html#m7-harness", desc: "Bancos de pruebas estandarizados (MMLU, GSM8K, HumanEval) y jueces LLM para auditar regresiones." },
        { id: "graphrag", label: "GraphRAG & Leiden", c: 5, url: "cuadernos/05-paradigmas-y-computacion.html#m7-grounding", desc: "Extracción de grafos de entidades y detección jerárquica de comunidades para responder consultas globales." },

        // Cuaderno 06
        { id: "framework_ocfe", label: "Framework OCFE", c: 6, url: "cuadernos/06-m365-copilot-banca-comercial.html#capitulo-1", desc: "Estándar de prompting en Banca Comercial: Objetivo, Contexto, Fuente de Datos y Expectativas de Salida." },
        { id: "copilot_studio", label: "Copilot Studio / Agentes", c: 6, url: "cuadernos/06-m365-copilot-banca-comercial.html#capitulo-8", desc: "Construcción de agentes declarativos en M365 con System Instructions, conectores SharePoint y acciones." },
        { id: "copilot_notebooks", label: "Copilot Notebooks", c: 6, url: "cuadernos/06-m365-copilot-banca-comercial.html#capitulo-9", desc: " Cuadernos de trabajo acotados en M365 con Grounding exclusivo sobre expedientes de riesgos y clientes." },
        { id: "banca_tier1", label: "Banca Comercial Tier 1", c: 6, url: "cuadernos/06-m365-copilot-banca-comercial.html#intro", desc: "150 casos de uso reales en Riesgos de Crédito, Comités, KYC/AML, Sindicaciones y Cash Management." },

        // Cuaderno 07
        { id: "migracion_m365", label: "Migración ChatGPT → M365", c: 7, url: "cuadernos/07-migracion-chatgpt-copilot-m365.html#intro", desc: "Protocolo en 3 fases para portar proyectos de ChatGPT hacia el perímetro seguro de Microsoft 365 Copilot." },
        { id: "ingenieria_inversa", label: "Consolidación de Contexto", c: 7, url: "cuadernos/07-migracion-chatgpt-copilot-m365.html#fase-1", desc: "Prompts de auditoría para extraer reglas implícitas, diccionarios de datos y scripts desde hilos largos." },
        { id: "shadow_testing", label: "Shadow Testing A/B", c: 7, url: "cuadernos/07-migracion-chatgpt-copilot-m365.html#fase-3", desc: "Validación cruzada en paralelo entre agentes para certificar precisión numérica y ausencia de regresiones." },

        // Cuaderno 08
        { id: "alive_ui", label: "Estándar PaceUI / Alive UI", c: 8, url: "cuadernos/08-agentes-vscode-ux-dashboards.html#intro", desc: "Filosofía de interfaces financieras vivas con bordes de 1px, superficies Obsidian y tipografía tabular-nums." },
        { id: "vscode_skills", label: "Skills & Prompts VS Code", c: 8, url: "cuadernos/08-agentes-vscode-ux-dashboards.html#creacion-ficheros", desc: "Arquitectura de ficheros SKILL.md y .prompt.md para automatizar agentes de diseño y código en VS Code." },
        { id: "spotlight_css", label: "Spotlight & Micro-Crafts CSS", c: 8, url: "cuadernos/08-agentes-vscode-ux-dashboards.html#motor-animaciones", desc: "Iluminación radial reactiva al cursor (--mx, --my), curvas cubic-bezier y contadores interpolados a 60fps." },

        // Cuaderno 09
        { id: "databricks_html", label: "Databricks PySpark → HTML", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#puente-databricks-pyspark", desc: "Puente determinista que agrega en PySpark, inyecta window.REPORT_DATA y empaqueta el HTML para enviar por correo." },
        { id: "echarts_morph", label: "ECharts Morphing & 3D", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#laboratorio-digital-vivo", desc: "Transiciones geométricas universales (Scatter ↔ Treemap ↔ Barras), Sankey, Markov y Superficie Topográfica 3D." },
        { id: "war_room_raroc", label: "War Room Pricing & Waterfall", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#laboratorio-digital-vivo", desc: "Simulador Deal Desk con Puente P&L (Spread, FTP, Fees, CoR, EVA), Coordenadas Paralelas y Slide-Over Drawer." },
        { id: "excel_institucional", label: "Excel Institucional & Prompts", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#excel-institucional-python", desc: "Estándar sin cuadrícula, Matriz de Sensibilidad 2D, bloques =PY() y Prompts Directos para Copilot en Excel sin VBA." },
        { id: "ppt_infog_video", label: "Slides Interactivas, Infografías & Vídeo", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#boveda-prompts-skills", desc: "Diapositivas 16:9 interactivas por dentro, estudio de Infografías SVG exportables a PNG y Vídeos Explicativos (.webm)." },
        { id: "diccionario_44", label: "Diccionario 44 KPIs Commercial", c: 9, url: "cuadernos/09-ingenieria-visual-databricks-m365-vscode.html#diccionario-visual-commercial", desc: "Enciclopedia visual con fórmulas y gráficos: RORWA, RAROC, Confirming, Factoring, TPV MDR, Cash Pooling, STP, IFRS 9 y CET1." }
    ];

    const EDGES = [
        { source: "transformers_c1", target: "self_attention", label: "mecanismo base" },
        { source: "backprop", target: "autodiff", label: "implementación DAG" },
        { source: "adamw", target: "backprop", label: "optimización" },
        { source: "embeddings", target: "polisemia", label: "desambiguación" },
        { source: "rag", target: "graphrag", label: "grafos de conocimiento" },
        { source: "rag", target: "grounding", label: "anclaje documental" },
        { source: "self_attention", target: "multi_head", label: "subespacios paralelos" },
        { source: "kv_cache", target: "self_attention", label: "aceleración O(N)" },
        { source: "rlhf", target: "alineamiento", label: "preferencia humana" },
        { source: "metaprompting", target: "agentes", label: "orquestación" },
        { source: "eval", target: "rlhf", label: "auditoría de calidad" },
        { source: "transformers_c1", target: "supercomputacion", label: "escalado" },
        { source: "superinterpolador", target: "agi", label: "límites teóricos" },
        { source: "correlacion", target: "pensamiento_critico", label: "epistemología" },
        { source: "self_attention", target: "softmax", label: "ponderación" },
        { source: "self_attention", target: "rope", label: "posición relativa" },
        { source: "turing_conexionismo", target: "transformers_c1", label: "paradigma" },
        { source: "ln", target: "transformers_c1", label: "estabilidad residual" },
        { source: "agentizacion_c1", target: "agentes", label: "arquitectura" },
        // Conexiones C6, C7, C8 y C9
        { source: "framework_ocfe", target: "metaprompting", label: "estructura prompt" },
        { source: "copilot_notebooks", target: "grounding", label: "perímetro acotado" },
        { source: "copilot_studio", target: "agentes", label: "agentes M365" },
        { source: "banca_tier1", target: "framework_ocfe", label: "casos de negocio" },
        { source: "migracion_m365", target: "copilot_studio", label: "portabilidad" },
        { source: "ingenieria_inversa", target: "migracion_m365", label: "extracción contexto" },
        { source: "shadow_testing", target: "eval", label: "validación A/B" },
        { source: "shadow_testing", target: "migracion_m365", label: "certificación" },
        { source: "vscode_skills", target: "copilot_studio", label: "automatización" },
        { source: "alive_ui", target: "spotlight_css", label: "tokens & shaders" },
        { source: "alive_ui", target: "echarts_morph", label: "diseño visual" },
        { source: "vscode_skills", target: "databricks_html", label: "generación en 2 turnos" },
        { source: "databricks_html", target: "echarts_morph", label: "displayHTML()" },
        { source: "databricks_html", target: "war_room_raroc", label: "simulador P&L" },
        { source: "banca_tier1", target: "diccionario_44", label: "métricas bancarias" },
        { source: "war_room_raroc", target: "diccionario_44", label: "RORWA · EVA · FTP" },
        { source: "excel_institucional", target: "banca_tier1", label: "reporting comité" },
        { source: "ppt_infog_video", target: "vscode_skills", label: "skills multimedia" },
        { source: "ppt_infog_video", target: "databricks_html", label: "exportación local" }
    ];

    class ConceptMap {
        constructor(container) {
            this.container = container;
            this.initDOM();
            
            this.canvas = this.container.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.tooltip = this.container.querySelector('.cmap-tooltip');
            this.edgeTooltip = this.container.querySelector('.cmap-edge-tooltip');
            
            this.nodes = JSON.parse(JSON.stringify(NODES));
            this.edges = JSON.parse(JSON.stringify(EDGES));
            this.width = 0;
            this.height = 0;
            
            this.transform = { x: 0, y: 0, k: 0.92 };
            this.dragState = { node: null, isDragging: false, isPanning: false, startX: 0, startY: 0, downClientX: 0, downClientY: 0, moved: false };
            this.hoveredNode = null;
            this.selectedNode = null; // Foco bloqueado al hacer clic
            this.hoveredEdge = null;
            
            this.activeFilters = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            this.searchQuery = "";
            this.isFullscreen = false;

            this.styleCache = {
                bg: '#111827',
                text: '#f8fafc',
                edge: '#334155',
                edgeHover: '#38bdf8'
            };
            
            this.initPhysics();
            this.resize();
            this.bindEvents();
            this.updateThemeColors();
            
            this.animationId = requestAnimationFrame(() => this.tick());
            
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
                        <button type="button" class="cmap-filter-btn active cmap-filter-all" style="color: var(--accent-cyan, #06b6d4)">
                            Todos (9)
                        </button>
                        ${CUADERNOS.map(c => `
                            <button type="button" class="cmap-filter-btn active" data-c="${c.id}" title="${c.name}" style="color: var(${c.colorVar})">
                                <span class="cmap-filter-dot"></span>
                                ${c.short}
                            </button>
                        `).join('')}
                    </div>
                    <div class="cmap-search">
                        <input type="text" placeholder="🔍 Buscar concepto, RORWA, RAG, ECharts..." aria-label="Buscar concepto">
                    </div>
                    <div class="cmap-controls">
                        <button type="button" class="cmap-btn cmap-btn-center" title="Centrar y reencuadrar mapa" aria-label="Centrar vista">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19 12h2M3 12h2M12 3v2M12 19v2M19 5l-2 2M5 19l2-2M5 5l2 2M19 19l-2-2"></path></svg>
                            <span>Centrar</span>
                        </button>
                        <button type="button" class="cmap-btn cmap-btn-fs" title="Pantalla completa" aria-label="Pantalla completa">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="cmap-canvas-wrapper">
                    <canvas class="cmap-canvas"></canvas>
                    <div class="cmap-tooltip">
                        <div class="cmap-tooltip-header">
                            <span class="cmap-tooltip-badge">CUADERNO 01</span>
                            <button type="button" class="cmap-tooltip-close" aria-label="Cerrar detalle">✕</button>
                        </div>
                        <h4></h4>
                        <p></p>
                        <div class="cmap-tooltip-actions">
                            <a href="#" class="cmap-goto-btn">Ir al cuaderno y sección →</a>
                        </div>
                    </div>
                    <div class="cmap-edge-tooltip"></div>
                    <div class="cmap-hint-bar">
                        💡 <strong>Clic</strong> en un nodo para fijar el foco y abrir su tarjeta · <strong>Doble clic</strong> para ir directo al cuaderno · <strong>Rueda</strong> para zoom
                    </div>
                </div>
            `;
        }
        
        updateThemeColors() {
            const computedStyle = getComputedStyle(document.documentElement);
            this.styleCache.text = computedStyle.getPropertyValue('--cmap-text').trim() || '#f8fafc';
            this.styleCache.bg = computedStyle.getPropertyValue('--cmap-bg').trim() || '#111827';
            this.styleCache.edge = computedStyle.getPropertyValue('--cmap-edge').trim() || '#334155';
            this.styleCache.edgeHover = computedStyle.getPropertyValue('--cmap-edge-hover').trim() || '#38bdf8';
            
            CUADERNOS.forEach(c => {
                c.colorHex = computedStyle.getPropertyValue(c.colorVar).trim() || c.colorHex;
            });
        }

        initPhysics() {
            // Distribuir nodos inicialmente alrededor del centroide de su Cuaderno para evitar apelotonamiento
            this.nodes.forEach((n, idx) => {
                const cObj = CUADERNOS.find(c => c.id === n.c) || { cx: 0, cy: 0 };
                const angle = (idx * 1.37);
                const radius = 55 + (idx % 4) * 28;
                n.x = cObj.cx + Math.cos(angle) * radius;
                n.y = cObj.cy + Math.sin(angle) * radius;
                n.vx = 0;
                n.vy = 0;
                n.width = 165;
                n.height = 34;
                n.edges = [];
            });
            
            this.edges.forEach(e => {
                e.sourceNode = this.nodes.find(n => n.id === e.source);
                e.targetNode = this.nodes.find(n => n.id === e.target);
                if (e.sourceNode && e.targetNode) {
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
            const alpha = 0.085;
            const repelStrength = 9500;
            const springLength = 155;
            const springStrength = 0.045;
            const damping = 0.76;
            
            const visibleNodes = this.nodes.filter(n => this.activeFilters.has(n.c));
            
            // 1. Repulsión + Anti-solapamiento rectangular de cajas
            for (let i = 0; i < visibleNodes.length; i++) {
                for (let j = i + 1; j < visibleNodes.length; j++) {
                    const n1 = visibleNodes[i];
                    const n2 = visibleNodes[j];
                    let dx = n2.x - n1.x;
                    let dy = n2.y - n1.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq > 0 && distSq < 140000) {
                        const dist = Math.sqrt(distSq) || 1;
                        const force = repelStrength / Math.max(distSq, 400);
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

                    // Separación de cajas rectangulares para que ningún texto pise a otro
                    const minX = (n1.width + n2.width) / 2 + 14;
                    const minY = (n1.height + n2.height) / 2 + 10;
                    if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
                        const overlapX = minX - Math.abs(dx);
                        const overlapY = minY - Math.abs(dy);
                        if (overlapX < overlapY) {
                            const push = (overlapX * 0.18) * (dx >= 0 ? 1 : -1);
                            if (n1 !== this.dragState.node) n1.vx -= push;
                            if (n2 !== this.dragState.node) n2.vx += push;
                        } else {
                            const push = (overlapY * 0.18) * (dy >= 0 ? 1 : -1);
                            if (n1 !== this.dragState.node) n1.vy -= push;
                            if (n2 !== this.dragState.node) n2.vy += push;
                        }
                    }
                }
            }
            
            // 2. Muelles de aristas
            this.edges.forEach(e => {
                if (!e.sourceNode || !e.targetNode) return;
                if (!this.activeFilters.has(e.sourceNode.c) || !this.activeFilters.has(e.targetNode.c)) return;
                
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
            
            // 3. Atracción suave hacia su clúster de Cuaderno (o al centro si hay pocos filtros activos)
            const multiCluster = this.activeFilters.size > 2;
            visibleNodes.forEach(n => {
                if (n === this.dragState.node) return;
                const cObj = CUADERNOS.find(c => c.id === n.c);
                const targetX = (multiCluster && cObj) ? cObj.cx * 0.85 : 0;
                const targetY = (multiCluster && cObj) ? cObj.cy * 0.85 : 0;
                n.vx += (targetX - n.x) * 0.018 * alpha;
                n.vy += (targetY - n.y) * 0.018 * alpha;
            });
            
            // 4. Integración de velocidad
            visibleNodes.forEach(n => {
                if (n !== this.dragState.node) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.vx *= damping;
                    n.vy *= damping;
                }
            });
        }

        isConnected(n1, n2) {
            if (!n1 || !n2) return false;
            if (n1 === n2) return true;
            return this.edges.some(e =>
                (e.sourceNode === n1 && e.targetNode === n2) ||
                (e.sourceNode === n2 && e.targetNode === n1)
            );
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

            const focusNode = this.selectedNode || this.hoveredNode;
            
            // Dibujar aristas
            visibleEdges.forEach(e => {
                this.ctx.beginPath();
                this.ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
                this.ctx.lineTo(e.targetNode.x, e.targetNode.y);
                
                const isHovered = this.hoveredEdge === e;
                const involvesFocus = focusNode && (e.sourceNode === focusNode || e.targetNode === focusNode);
                
                if (isHovered || involvesFocus) {
                    this.ctx.strokeStyle = this.styleCache.edgeHover;
                    this.ctx.lineWidth = 2.2 / this.transform.k;
                    this.ctx.globalAlpha = 0.95;
                } else {
                    this.ctx.strokeStyle = this.styleCache.edge;
                    this.ctx.lineWidth = 1.1 / this.transform.k;
                    this.ctx.globalAlpha = (focusNode || this.searchQuery) ? 0.16 : 0.55;
                }
                
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            });
            
            // Dibujar nodos
            this.ctx.font = '600 11.5px Inter, sans-serif';
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            
            visibleNodes.forEach(n => {
                const isSelected = this.selectedNode === n;
                const isHovered = this.hoveredNode === n;
                const isNeighbor = focusNode && this.isConnected(focusNode, n);
                const isMatched = this.searchQuery && (
                    n.label.toLowerCase().includes(this.searchQuery) ||
                    n.desc.toLowerCase().includes(this.searchQuery)
                );

                let isDimmed = false;
                if (this.searchQuery) {
                    isDimmed = !isMatched && !isSelected && !isHovered;
                } else if (focusNode) {
                    isDimmed = !isNeighbor;
                }
                
                const cObj = CUADERNOS.find(c => c.id === n.c);
                const color = cObj ? cObj.colorHex : '#888';
                
                const textMetrics = this.ctx.measureText(`C${n.c} · ${n.label}`);
                n.width = Math.max(124, textMetrics.width + 26);
                n.height = 34;
                
                this.ctx.globalAlpha = isDimmed ? 0.22 : 1.0;
                
                if (isSelected || isHovered || isMatched) {
                    this.ctx.shadowColor = color;
                    this.ctx.shadowBlur = isSelected ? 18 : 11;
                } else {
                    this.ctx.shadowBlur = 0;
                }
                
                // Caja redondeada del nodo
                this.ctx.beginPath();
                this.ctx.roundRect(n.x - n.width/2, n.y - n.height/2, n.width, n.height, 8);
                this.ctx.fillStyle = isSelected ? color : this.styleCache.bg;
                this.ctx.fill();
                
                // Borde del nodo
                this.ctx.lineWidth = (isSelected || isHovered || isMatched) ? 2.2 : 1.2;
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                
                this.ctx.shadowBlur = 0;
                
                // Etiqueta con prefijo de cuaderno
                this.ctx.fillStyle = isSelected ? '#060913' : ((isHovered || isMatched) ? color : this.styleCache.text);
                this.ctx.fillText(`C${n.c} · ${n.label}`, n.x, n.y);
            });
            
            this.ctx.restore();
            
            // Posicionar la tarjeta de inspección manteniendo dentro de los bordes visibles del contenedor
            const activeTooltipNode = this.selectedNode;
            if (activeTooltipNode && this.tooltip.classList.contains('visible')) {
                const rawX = (activeTooltipNode.x * this.transform.k) + (this.width / 2) + this.transform.x;
                const rawY = (activeTooltipNode.y * this.transform.k) + (this.height / 2) + this.transform.y;
                const clampedX = Math.max(165, Math.min(this.width - 165, rawX));
                const clampedY = Math.max(175, Math.min(this.height - 25, rawY - (activeTooltipNode.height / 2 * this.transform.k) - 8));
                this.tooltip.style.left = `${clampedX}px`;
                this.tooltip.style.top = `${clampedY}px`;
            }
            
            // Tooltip de arista
            if (this.hoveredEdge && !this.hoveredNode && !this.selectedNode) {
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
            const wrapper = this.container.querySelector('.cmap-canvas-wrapper');
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.width = rect.width;
            this.height = rect.height;
            
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            const wrapper = this.container.querySelector('.cmap-canvas-wrapper');
            
            // CRÍTICO: Evitar que hacer clic dentro de la tarjeta (.cmap-tooltip) o en "Ir al cuaderno" pierda el foco o dispare eventos del canvas
            ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evtName => {
                this.tooltip.addEventListener(evtName, (e) => {
                    e.stopPropagation();
                });
            });

            this.tooltip.querySelector('.cmap-tooltip-close').addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedNode = null;
                this.hideTooltip();
            });

            // Eventos solo sobre el canvas
            this.canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
            this.canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
            window.addEventListener('mouseup', this.onPointerUp.bind(this));
            
            // Doble clic en un nodo abre directamente su cuaderno y sección
            this.canvas.addEventListener('dblclick', (e) => {
                const pos = this.getGraphPos(e.clientX, e.clientY);
                const node = this.findNodeAt(pos.x, pos.y);
                if (node) {
                    window.location.href = node.url || CUADERNO_LINKS[node.c];
                }
            });

            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.onPointerDown(e.touches[0]);
                }
            }, { passive: true });
            this.canvas.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    e.preventDefault();
                    this.onPointerMove(e.touches[0]);
                }
            }, { passive: false });
            this.canvas.addEventListener('touchend', this.onPointerUp.bind(this));
            
            // Zoom con rueda
            wrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = -e.deltaY * 0.001;
                const newK = Math.max(0.3, Math.min(2.6, this.transform.k * (1 + zoomFactor)));
                
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - this.width/2;
                const mouseY = e.clientY - rect.top - this.height/2;
                
                this.transform.x = mouseX - (mouseX - this.transform.x) * (newK / this.transform.k);
                this.transform.y = mouseY - (mouseY - this.transform.y) * (newK / this.transform.k);
                this.transform.k = newK;
            }, { passive: false });
            
            // Clic en el canvas para fijar/desfijar el foco en un nodo
            this.canvas.addEventListener('click', (e) => {
                if (this.dragState.moved) return;
                const pos = this.getGraphPos(e.clientX, e.clientY);
                const clickedNode = this.findNodeAt(pos.x, pos.y);
                if (clickedNode) {
                    this.selectedNode = clickedNode;
                    this.showTooltip(clickedNode);
                } else {
                    this.selectedNode = null;
                    this.hideTooltip();
                }
            });
            
            // Filtros por Cuaderno (C1 a C9 + Botón Todos)
            const allBtn = this.container.querySelector('.cmap-filter-all');
            const filterBtns = this.container.querySelectorAll('.cmap-filter-btn[data-c]');

            const syncFilterButtonsUI = () => {
                filterBtns.forEach(btn => {
                    const c = parseInt(btn.dataset.c, 10);
                    const cObj = CUADERNOS.find(x => x.id === c);
                    if (this.activeFilters.has(c)) {
                        btn.classList.add('active');
                        btn.style.color = `var(${cObj.colorVar})`;
                    } else {
                        btn.classList.remove('active');
                        btn.style.color = 'var(--text-secondary)';
                    }
                });
                if (this.activeFilters.size === CUADERNOS.length) {
                    allBtn.classList.add('active');
                } else {
                    allBtn.classList.remove('active');
                }
            };

            allBtn.addEventListener('click', () => {
                if (this.activeFilters.size === CUADERNOS.length) {
                    // Si todos estaban activos, mantenemos todos activos y centramos
                    this.transform = { x: 0, y: 0, k: 0.92 };
                } else {
                    CUADERNOS.forEach(c => this.activeFilters.add(c.id));
                }
                this.selectedNode = null;
                this.hideTooltip();
                syncFilterButtonsUI();
            });

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const c = parseInt(btn.dataset.c, 10);
                    // Si todos están activos y el usuario pulsa un cuaderno concreto, aislamos ese cuaderno (o si vuelve a pulsarlo cuando está solo, activamos todos)
                    if (this.activeFilters.size === CUADERNOS.length) {
                        this.activeFilters.clear();
                        this.activeFilters.add(c);
                        this.transform = { x: 0, y: 0, k: 1.05 };
                    } else if (this.activeFilters.has(c) && this.activeFilters.size === 1) {
                        CUADERNOS.forEach(item => this.activeFilters.add(item.id));
                        this.transform = { x: 0, y: 0, k: 0.92 };
                    } else if (this.activeFilters.has(c)) {
                        this.activeFilters.delete(c);
                    } else {
                        this.activeFilters.add(c);
                    }
                    this.selectedNode = null;
                    this.hideTooltip();
                    syncFilterButtonsUI();
                });
            });
            
            const searchInput = this.container.querySelector('.cmap-search input');
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (this.searchQuery) {
                    const match = this.nodes.find(n =>
                        this.activeFilters.has(n.c) &&
                        (n.label.toLowerCase().includes(this.searchQuery) || n.desc.toLowerCase().includes(this.searchQuery))
                    );
                    if (match) {
                        this.selectedNode = match;
                        this.showTooltip(match);
                    }
                }
            });
            
            this.container.querySelector('.cmap-btn-center').addEventListener('click', () => {
                this.transform = { x: 0, y: 0, k: 0.92 };
                this.selectedNode = null;
                this.hideTooltip();
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
                setTimeout(() => this.resize(), 50);
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
                    downClientX: e.clientX,
                    downClientY: e.clientY,
                    moved: false
                };
                node.vx = 0;
                node.vy = 0;
            } else {
                this.dragState = {
                    node: null,
                    isDragging: false,
                    isPanning: true,
                    startX: e.clientX - this.transform.x,
                    startY: e.clientY - this.transform.y,
                    downClientX: e.clientX,
                    downClientY: e.clientY,
                    moved: false
                };
            }
        }

        onPointerMove(e) {
            const pos = this.getGraphPos(e.clientX, e.clientY);
            const distMoved = Math.hypot(e.clientX - (this.dragState.downClientX || 0), e.clientY - (this.dragState.downClientY || 0));
            
            if (this.dragState.isDragging && this.dragState.node) {
                if (distMoved > 5) {
                    this.dragState.moved = true;
                    this.dragState.node.x = pos.x;
                    this.dragState.node.y = pos.y;
                }
            } else if (this.dragState.isPanning) {
                if (distMoved > 5) {
                    this.dragState.moved = true;
                    this.transform.x = e.clientX - this.dragState.startX;
                    this.transform.y = e.clientY - this.dragState.startY;
                }
            } else {
                const hoveredNode = this.findNodeAt(pos.x, pos.y);
                if (hoveredNode !== this.hoveredNode) {
                    this.hoveredNode = hoveredNode;
                    this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
                }
                
                if (!hoveredNode) {
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
        }
        
        showTooltip(node) {
            const badge = this.tooltip.querySelector('.cmap-tooltip-badge');
            const h4 = this.tooltip.querySelector('h4');
            const p = this.tooltip.querySelector('p');
            const a = this.tooltip.querySelector('a.cmap-goto-btn');
            
            const cObj = CUADERNOS.find(c => c.id === node.c);
            badge.textContent = cObj ? cObj.name : `Cuaderno 0${node.c}`;
            badge.style.color = cObj ? `var(${cObj.colorVar})` : '#38bdf8';

            h4.textContent = node.label;
            h4.style.color = cObj ? `var(${cObj.colorVar})` : '#fff';
            p.textContent = node.desc;
            
            a.href = node.url || CUADERNO_LINKS[node.c] || '#';
            a.textContent = `Ir al Cuaderno 0${node.c} →`;
            
            this.tooltip.classList.add('visible');
        }
        
        hideTooltip() {
            this.tooltip.classList.remove('visible');
        }
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);

    document.addEventListener('DOMContentLoaded', () => {
        const target = document.querySelector('.concept-map-target');
        if (target) {
            new ConceptMap(target);
        }
    });

})();
