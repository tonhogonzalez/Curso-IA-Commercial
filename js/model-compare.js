/**
 * CURSO IA COMMERCIAL - Comparador de Arquitecturas LLM & Intelligence Index
 * Integración de análisis y métricas de Artificial Analysis (artificialanalysis.ai)
 * 
 * Incluye:
 * - Artificial Analysis Quality Index (Índice de Inteligencia / Calidad)
 * - Velocidad de Inferencia (Tokens/segundo) & Latencia Primer Token (TTFT)
 * - Precios API ($/1M tokens Input & Output)
 * - Benchmarks Duros (GPQA Diamond, MATH 500, MMLU-Pro, HumanEval/SWE)
 * - Gráfico Interactivo de Dispersión "Velocidad vs Calidad / Precio" (Canvas)
 * - Radar Charts de Habilidades Multidimensionales
 * - Comparador Cara a Cara Side-by-Side
 */

(function() {
    'use strict';

    // Modelos con métricas reales alineadas con Artificial Analysis (Leaderboard 2025/2026)
    const models = [
        {
            id: 'deepseek-r1',
            name: 'DeepSeek-R1',
            company: 'DeepSeek',
            type: 'reasoning',
            params: '671B MoE (37B activos)',
            paramsNum: 671,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'RL a gran escala (GRPO) + Cold Start SFT',
            architecture: 'Transformer MoE + Multi-Head Latent Attention (MLA)',
            license: 'Open Source (MIT)',
            category: 'open-source',
            aaQualityIndex: 92, // Artificial Analysis Quality Index (0-100)
            speedTokensSec: 32, // Tokens/segundo
            ttftSec: 0.85, // Time to First Token (seg)
            inputPricePerM: 0.55, // $ por 1M tokens input
            outputPricePerM: 2.19, // $ por 1M tokens output
            benchmarks: {
                GPQA: 65.9,     // GPQA Diamond (Doctoral Level Reasoning)
                MATH: 97.3,     // MATH 500 (Olimpiadas matemáticas)
                MMLU_Pro: 84.0, // MMLU-Pro (Conocimiento general avanzado)
                Coding: 92.5,   // SWE-bench / HumanEval composite
                ArenaElo: 1360  // Arena / Composite Quality
            },
            releaseDate: '2025-01',
            highlights: 'Razonamiento profundo con RL puro (GRPO). Rendimiento comparable a o1 a una fracción del coste computacional.',
            concepts: ['MoE', 'RLHF', 'MLA', 'Cuaderno 04 (Arquitecturas)', 'Cuaderno 05 (Entrenamiento)']
        },
        {
            id: 'openai-o1',
            name: 'OpenAI o1',
            company: 'OpenAI',
            type: 'reasoning',
            params: '~300B+ MoE (estimado)',
            paramsNum: 300,
            contextWindow: '200K tokens',
            contextNum: 200000,
            training: 'Large-scale RL with Chain-of-Thought search',
            architecture: 'Transformer Decoder-Only + Test-Time Compute',
            license: 'Propietario',
            category: 'propietario',
            aaQualityIndex: 93,
            speedTokensSec: 45,
            ttftSec: 2.10,
            inputPricePerM: 15.00,
            outputPricePerM: 60.00,
            benchmarks: {
                GPQA: 77.3,
                MATH: 96.4,
                MMLU_Pro: 86.2,
                Coding: 94.0,
                ArenaElo: 1375
            },
            releaseDate: '2024-12',
            highlights: 'Pionero en escalado de cómputo en tiempo de inferencia (Test-Time Compute) para matemáticas, código y ciencias duras.',
            concepts: ['Test-Time Compute', 'Chain-of-Thought', 'RLHF', 'Cuaderno 02 (Prompting)', 'Cuaderno 05 (Paradigmas)']
        },
        {
            id: 'openai-o3-mini',
            name: 'OpenAI o3-mini',
            company: 'OpenAI',
            type: 'reasoning',
            params: '~50B (estimado)',
            paramsNum: 50,
            contextWindow: '200K tokens',
            contextNum: 200000,
            training: 'RL de alta eficiencia enfocado en STEM',
            architecture: 'Transformer Decoder-Only Compacto',
            license: 'Propietario',
            category: 'propietario',
            aaQualityIndex: 89,
            speedTokensSec: 92,
            ttftSec: 1.15,
            inputPricePerM: 1.10,
            outputPricePerM: 4.40,
            benchmarks: {
                GPQA: 79.7,
                MATH: 97.9,
                MMLU_Pro: 82.8,
                Coding: 93.2,
                ArenaElo: 1340
            },
            releaseDate: '2025-01',
            highlights: 'Razonamiento especializado ultrarrápido y accesible con control de esfuerzo de pensamiento (low/medium/high).',
            concepts: ['Chain-of-Thought', 'STEM Reasoning', 'Cuaderno 03 (Optimización)']
        },
        {
            id: 'claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            company: 'Anthropic',
            type: 'frontier',
            params: '~175B (estimado)',
            paramsNum: 175,
            contextWindow: '200K tokens',
            contextNum: 200000,
            training: 'Pre-train + RLHF + Constitutional AI',
            architecture: 'Transformer Decoder-Only',
            license: 'Propietario',
            category: 'propietario',
            aaQualityIndex: 91,
            speedTokensSec: 68,
            ttftSec: 0.72,
            inputPricePerM: 3.00,
            outputPricePerM: 15.00,
            benchmarks: {
                GPQA: 65.0,
                MATH: 78.3,
                MMLU_Pro: 88.7,
                Coding: 93.7,
                ArenaElo: 1355
            },
            releaseDate: '2024-10',
            highlights: 'Líder en programación agencial, análisis visual y redacción con matices conceptuales y Constitutional AI.',
            concepts: ['Constitutional AI', 'Agentes Autónomos', 'Cuaderno 02 (Alineamiento)', 'Cuaderno 03 (Agentes)']
        },
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            company: 'OpenAI',
            type: 'frontier',
            params: '~200B (estimado)',
            paramsNum: 200,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train omnimodal + SFT + RLHF',
            architecture: 'Transformer Omnimodal Nativo',
            license: 'Propietario',
            category: 'propietario',
            aaQualityIndex: 88,
            speedTokensSec: 82,
            ttftSec: 0.48,
            inputPricePerM: 2.50,
            outputPricePerM: 10.00,
            benchmarks: {
                GPQA: 53.6,
                MATH: 76.6,
                MMLU_Pro: 85.2,
                Coding: 90.2,
                ArenaElo: 1330
            },
            releaseDate: '2024-05',
            highlights: 'Omnimodal nativo (voz, visión, texto) con baja latencia y alta consistencia en tareas de producción general.',
            concepts: ['Multimodalidad', 'RLHF', 'Inferencia LLM', 'Cuaderno 04 (Transformers)']
        },
        {
            id: 'gemini-2-0-flash',
            name: 'Gemini 2.0 Flash',
            company: 'Google DeepMind',
            type: 'speed',
            params: '~40B (estimado)',
            paramsNum: 40,
            contextWindow: '1M tokens',
            contextNum: 1000000,
            training: 'Pre-train multimodal + RLHF masivo de alta velocidad',
            architecture: 'Transformer Multimodal Eficiente',
            license: 'Propietario',
            category: 'propietario',
            aaQualityIndex: 86,
            speedTokensSec: 152, // Extraordinaria velocidad
            ttftSec: 0.32,
            inputPricePerM: 0.10,
            outputPricePerM: 0.40,
            benchmarks: {
                GPQA: 56.8,
                MATH: 81.5,
                MMLU_Pro: 82.5,
                Coding: 89.0,
                ArenaElo: 1320
            },
            releaseDate: '2024-12',
            highlights: 'Líder absoluto en velocidad y coste: 152 tokens/s a $0.10/$0.40 por 1M con contexto masivo de 1M tokens.',
            concepts: ['KV Cache', 'Inferencia Eficiente', 'Cuaderno 03 (Inferencia)', 'Cuaderno 05 (Grounding)']
        },
        {
            id: 'deepseek-v3',
            name: 'DeepSeek-V3',
            company: 'DeepSeek',
            type: 'frontier',
            params: '671B MoE (37B activos)',
            paramsNum: 671,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train en 14.8T tokens + Multi-Token Prediction',
            architecture: 'Transformer MoE + MLA + FP8 Mixto',
            license: 'Open Source (MIT)',
            category: 'open-source',
            aaQualityIndex: 88,
            speedTokensSec: 64,
            ttftSec: 0.65,
            inputPricePerM: 0.27,
            outputPricePerM: 1.10,
            benchmarks: {
                GPQA: 59.1,
                MATH: 89.3,
                MMLU_Pro: 87.1,
                Coding: 89.5,
                ArenaElo: 1335
            },
            releaseDate: '2024-12',
            highlights: 'Arquitectura MoE hiperoptimizada (37B activos de 671B) con Multi-head Latent Attention para minimizar la memoria de KV Cache.',
            concepts: ['MoE', 'MLA', 'Multi-Token Prediction', 'Cuaderno 04 (Arquitecturas)']
        },
        {
            id: 'llama-3-3-70b',
            name: 'Llama 3.3 70B',
            company: 'Meta',
            type: 'frontier',
            params: '70B',
            paramsNum: 70,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train en 15T+ tokens + SFT + DPO',
            architecture: 'Transformer Decoder-Only Dense + GQA',
            license: 'Open Source (Llama 3.3 License)',
            category: 'open-source',
            aaQualityIndex: 85,
            speedTokensSec: 96,
            ttftSec: 0.38,
            inputPricePerM: 0.20,
            outputPricePerM: 0.60,
            benchmarks: {
                GPQA: 51.5,
                MATH: 78.4,
                MMLU_Pro: 83.2,
                Coding: 87.0,
                ArenaElo: 1315
            },
            releaseDate: '2024-12',
            highlights: 'Rendimiento de Llama 3.1 405B comprimido en 70B parámetros gracias a técnicas de destilación y post-entrenamiento.',
            concepts: ['Grouped-Query Attention (GQA)', 'DPO', 'Cuaderno 04 (RoPE/MHA)', 'Cuaderno 05 (SFT)']
        },
        {
            id: 'llama-3-1-405b',
            name: 'Llama 3.1 405B',
            company: 'Meta',
            type: 'frontier',
            params: '405B',
            paramsNum: 405,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train en 15T tokens en 16K H100s + SFT + DPO',
            architecture: 'Transformer Decoder-Only Denso Gigante + GQA',
            license: 'Open Source (Llama 3.1 License)',
            category: 'open-source',
            aaQualityIndex: 88,
            speedTokensSec: 36,
            ttftSec: 0.95,
            inputPricePerM: 1.80,
            outputPricePerM: 3.50,
            benchmarks: {
                GPQA: 51.1,
                MATH: 73.8,
                MMLU_Pro: 88.6,
                Coding: 89.0,
                ArenaElo: 1332
            },
            releaseDate: '2024-07',
            highlights: 'El mayor modelo de pesos abiertos del mundo: referencia para destilación sintética y evaluación independiente.',
            concepts: ['Supercomputación', 'GQA', 'Cuaderno 01 (Pep Martorell)', 'Cuaderno 05 (Evaluation)']
        },
        {
            id: 'qwen-2-5-72b',
            name: 'Qwen 2.5 72B',
            company: 'Alibaba Cloud',
            type: 'frontier',
            params: '72B',
            paramsNum: 72,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train en 18T tokens multilingües + SFT + RLHF',
            architecture: 'Transformer Decoder-Only + RoPE + SwiGLU',
            license: 'Open Source (Apache 2.0)',
            category: 'open-source',
            aaQualityIndex: 86,
            speedTokensSec: 84,
            ttftSec: 0.42,
            inputPricePerM: 0.35,
            outputPricePerM: 0.90,
            benchmarks: {
                GPQA: 52.0,
                MATH: 83.1,
                MMLU_Pro: 86.1,
                Coding: 86.5,
                ArenaElo: 1322
            },
            releaseDate: '2024-09',
            highlights: 'Excelente solidez matemática y en código bajo licencia permisiva Apache 2.0. Líder del ecosistema abierto asiático.',
            concepts: ['RoPE', 'SwiGLU', 'Cuaderno 04 (Codificación Posicional)', 'Cuaderno 05 (Harness)']
        },
        {
            id: 'mistral-large-2',
            name: 'Mistral Large 2',
            company: 'Mistral AI',
            type: 'frontier',
            params: '123B',
            paramsNum: 123,
            contextWindow: '128K tokens',
            contextNum: 128000,
            training: 'Pre-train enfocado en código, razonamiento y 80+ idiomas',
            architecture: 'Transformer Decoder-Only',
            license: 'Propietario / Research OK',
            category: 'propietario',
            aaQualityIndex: 84,
            speedTokensSec: 58,
            ttftSec: 0.55,
            inputPricePerM: 2.00,
            outputPricePerM: 6.00,
            benchmarks: {
                GPQA: 47.0,
                MATH: 68.8,
                MMLU_Pro: 84.0,
                Coding: 85.0,
                ArenaElo: 1305
            },
            releaseDate: '2024-07',
            highlights: 'Modelo insignia europeo de Mistral AI con gran capacidad de razonamiento multilingüe y llamada a funciones (Function Calling).',
            concepts: ['Function Calling', 'Pre-LN', 'Cuaderno 03 (Agentes)', 'Cuaderno 05 (Paradigmas)']
        }
    ];

    // State del comparador
    const state = {
        view: 'cards', // 'cards' | 'scatter' | 'table'
        filterCategory: 'all', // 'all' | 'reasoning' | 'frontier' | 'speed' | 'open-source' | 'propietario'
        searchQuery: '',
        sortBy: 'aaQualityIndex',
        sortOrder: 'desc', // 'desc' | 'asc'
        scatterXAxis: 'speedTokensSec', // 'speedTokensSec' | 'inputPricePerM' | 'ttftSec'
        scatterYAxis: 'aaQualityIndex',
        selectedModels: ['deepseek-r1', 'openai-o1', 'claude-3-5-sonnet'], // pre-selected for rich demo
        compareModalOpen: false
    };

    function injectStyles() {
        if (document.getElementById('model-compare-styles')) return;
        const style = document.createElement('style');
        style.id = 'model-compare-styles';
        style.textContent = `
            .mc-container {
                font-family: var(--font-body);
                color: var(--text-primary);
                background: var(--bg-surface);
                border: 1px solid var(--border-medium);
                border-radius: var(--radius-xl);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                box-shadow: var(--shadow-sm);
            }

            /* Header & Attribution */
            .mc-header-box {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex-wrap: wrap;
                gap: 1rem;
                padding-bottom: 1.25rem;
                border-bottom: 1px solid var(--border-subtle);
            }
            .mc-header-title {
                margin: 0;
                font-family: var(--font-display);
                font-size: 1.3rem;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .mc-attribution {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.15) 100%);
                border: 1px solid var(--border-accent);
                padding: 0.4rem 0.85rem;
                border-radius: var(--radius-full);
                font-size: 0.8rem;
                color: var(--text-accent);
                text-decoration: none;
                transition: transform 0.2s, border-color 0.2s;
            }
            .mc-attribution:hover {
                transform: translateY(-1px);
                border-color: var(--accent-violet);
            }

            /* Toolbar */
            .mc-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-primary);
                padding: 0.85rem 1.25rem;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-subtle);
            }
            .mc-filters-group {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                align-items: center;
            }
            .mc-chip-btn {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                color: var(--text-secondary);
                padding: 0.4rem 0.85rem;
                border-radius: var(--radius-full);
                font-size: 0.82rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .mc-chip-btn:hover {
                border-color: var(--accent-violet);
                color: var(--text-primary);
            }
            .mc-chip-btn.active {
                background: var(--accent-violet-dim);
                border-color: var(--accent-violet);
                color: var(--text-accent);
                font-weight: 600;
            }

            .mc-view-tabs {
                display: flex;
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-sm);
                overflow: hidden;
            }
            .mc-tab-btn {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                padding: 0.45rem 0.9rem;
                font-size: 0.84rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.4rem;
                transition: all 0.2s ease;
            }
            .mc-tab-btn.active {
                background: var(--accent-blue);
                color: #ffffff;
            }
            .mc-tab-btn:hover:not(.active) {
                color: var(--text-primary);
                background: rgba(255,255,255,0.04);
            }

            .mc-search-input {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                color: var(--text-primary);
                padding: 0.45rem 0.85rem;
                border-radius: var(--radius-sm);
                font-size: 0.85rem;
                outline: none;
                width: 180px;
                transition: border-color 0.2s;
            }
            .mc-search-input:focus {
                border-color: var(--accent-blue);
            }

            /* Floating Compare Tray */
            .mc-compare-tray {
                position: sticky;
                bottom: 1.5rem;
                z-index: 100;
                background: var(--bg-secondary);
                border: 1.5px solid var(--accent-violet);
                border-radius: var(--radius-lg);
                padding: 0.75rem 1.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                box-shadow: var(--shadow-lg), 0 0 20px rgba(139,92,246,0.25);
                animation: fadeInUp 0.3s ease;
            }
            .mc-compare-tray.hidden {
                display: none;
            }
            .mc-tray-models {
                display: flex;
                gap: 0.5rem;
                align-items: center;
                flex-wrap: wrap;
            }
            .mc-tray-pill {
                background: var(--accent-violet-dim);
                color: var(--text-primary);
                border: 1px solid var(--border-accent);
                padding: 0.25rem 0.6rem;
                border-radius: var(--radius-full);
                font-size: 0.78rem;
                display: flex;
                align-items: center;
                gap: 0.35rem;
            }
            .mc-tray-remove {
                cursor: pointer;
                color: var(--text-muted);
                font-weight: bold;
            }
            .mc-tray-remove:hover {
                color: var(--accent-rose);
            }
            .mc-btn-launch-compare {
                background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-blue) 100%);
                color: white;
                border: none;
                padding: 0.5rem 1.15rem;
                border-radius: var(--radius-md);
                font-weight: 700;
                font-size: 0.85rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(139,92,246,0.3);
                transition: transform 0.2s;
            }
            .mc-btn-launch-compare:hover {
                transform: scale(1.03);
            }

            /* Cards View */
            .mc-cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
                gap: 1.25rem;
            }
            .mc-card {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-lg);
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                gap: 0.85rem;
                transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
                position: relative;
            }
            .mc-card:hover {
                transform: translateY(-3px);
                border-color: var(--accent-violet);
                box-shadow: var(--shadow-md);
            }
            .mc-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 0.5rem;
            }
            .mc-card-title {
                margin: 0;
                font-family: var(--font-display);
                font-size: 1.15rem;
                color: var(--text-primary);
            }
            .mc-card-company {
                font-size: 0.8rem;
                color: var(--text-muted);
                margin-top: 0.15rem;
            }

            /* Score Badges */
            .mc-quality-badge {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.2) 100%);
                border: 1px solid var(--border-accent);
                padding: 0.35rem 0.65rem;
                border-radius: var(--radius-md);
                min-width: 68px;
                text-align: right;
            }
            .mc-quality-num {
                font-family: var(--font-display);
                font-size: 1.3rem;
                font-weight: 800;
                color: var(--accent-violet);
                line-height: 1;
            }
            .mc-quality-label {
                font-size: 0.62rem;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.04em;
                margin-top: 0.15rem;
            }

            /* Stats Grid */
            .mc-stats-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0.5rem;
                background: var(--bg-primary);
                padding: 0.65rem;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-subtle);
                text-align: center;
            }
            .mc-stat-item {
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
            }
            .mc-stat-val {
                font-family: var(--font-mono);
                font-size: 0.92rem;
                font-weight: 700;
                color: var(--text-primary);
            }
            .mc-stat-lbl {
                font-size: 0.68rem;
                color: var(--text-muted);
            }

            /* Radar chart container */
            .mc-radar-box {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0.25rem 0;
            }

            /* Concepts tags */
            .mc-concepts-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.35rem;
                margin-top: auto;
            }
            .mc-concept-tag {
                background: var(--bg-surface);
                border: 1px solid var(--border-subtle);
                color: var(--text-secondary);
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-size: 0.72rem;
            }
            .mc-concept-tag.linked {
                background: var(--accent-violet-dim);
                color: var(--text-accent);
                border-color: var(--border-accent);
                font-weight: 500;
            }

            /* Card select checkbox */
            .mc-select-check {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                font-size: 0.78rem;
                color: var(--text-secondary);
                cursor: pointer;
                user-select: none;
                margin-top: 0.5rem;
                padding-top: 0.5rem;
                border-top: 1px dashed var(--border-subtle);
            }

            /* Scatter Plot View */
            .mc-scatter-view {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-lg);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .mc-scatter-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .mc-scatter-canvas-wrapper {
                position: relative;
                width: 100%;
                height: 480px;
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-medium);
            }
            .mc-scatter-canvas {
                width: 100%;
                height: 100%;
                display: block;
            }
            .mc-scatter-tooltip {
                position: absolute;
                background: var(--bg-secondary);
                border: 1.5px solid var(--accent-violet);
                border-radius: var(--radius-md);
                padding: 0.6rem 0.85rem;
                font-size: 0.82rem;
                pointer-events: none;
                box-shadow: var(--shadow-md);
                display: none;
                z-index: 10;
                transform: translate(-50%, -115%);
                white-space: nowrap;
            }

            /* Table View */
            .mc-table-wrapper {
                overflow-x: auto;
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-lg);
            }
            .mc-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 0.86rem;
            }
            .mc-table th, .mc-table td {
                padding: 0.85rem 1rem;
                border-bottom: 1px solid var(--border-subtle);
            }
            .mc-table th {
                background: var(--bg-primary);
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 0.78rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
            }
            .mc-table th:hover {
                color: var(--text-primary);
            }
            .mc-table th.sorted-desc::after { content: ' ▼'; color: var(--accent-violet); }
            .mc-table th.sorted-asc::after { content: ' ▲'; color: var(--accent-violet); }
            .mc-table tr:hover td {
                background: rgba(255,255,255,0.02);
            }

            /* Modal Side-by-Side */
            .mc-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }
            .mc-modal-box {
                background: var(--bg-secondary);
                border: 1.5px solid var(--border-medium);
                border-radius: var(--radius-xl);
                max-width: 960px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                box-shadow: var(--shadow-lg);
            }
            .mc-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-subtle);
                padding-bottom: 1rem;
            }
            .mc-modal-close {
                background: transparent;
                border: none;
                color: var(--text-muted);
                font-size: 1.4rem;
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: var(--radius-sm);
            }
            .mc-modal-close:hover {
                color: var(--text-primary);
                background: rgba(255,255,255,0.05);
            }
            .mc-compare-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 1.25rem;
            }
            .mc-compare-col {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-md);
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                gap: 0.85rem;
            }

            @media (max-width: 768px) {
                .mc-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }
                .mc-search-input {
                    width: 100%;
                }
                .mc-scatter-canvas-wrapper {
                    height: 360px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // RADAR CHART RENDERER (Canvas 2D)
    // ==========================================
    function drawRadarChart(canvas, benchmarks, color = '#8b5cf6', fillAlpha = 0.25) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 22;

        ctx.clearRect(0, 0, width, height);

        const axes = [
            { key: 'GPQA', label: 'GPQA' },
            { key: 'MATH', label: 'MATH' },
            { key: 'MMLU_Pro', label: 'MMLU' },
            { key: 'Coding', label: 'Code' }
        ];
        const numAxes = axes.length;
        const angleStep = (Math.PI * 2) / numAxes;

        // Draw background circles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let level = 1; level <= 4; level++) {
            const r = (radius / 4) * level;
            ctx.beginPath();
            for (let i = 0; i < numAxes; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw axes and labels
        ctx.fillStyle = '#8e8b9e';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        axes.forEach((axis, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();

            // Label positioning
            const labelX = centerX + (radius + 14) * Math.cos(angle);
            const labelY = centerY + (radius + 14) * Math.sin(angle);
            ctx.fillText(axis.label, labelX, labelY);
        });

        // Draw polygon of model benchmarks
        ctx.beginPath();
        axes.forEach((axis, i) => {
            const val = benchmarks[axis.key] || 0; // score 0 - 100
            const normalized = Math.min(100, Math.max(0, val)) / 100;
            const r = radius * normalized;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();

        ctx.fillStyle = color.replace(')', `, ${fillAlpha})`).replace('rgb', 'rgba').replace('var(--accent-violet)', `rgba(139, 92, 246, ${fillAlpha})`).replace('var(--accent-blue)', `rgba(59, 130, 246, ${fillAlpha})`).replace('var(--accent-emerald)', `rgba(16, 185, 129, ${fillAlpha})`);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw vertex points
        axes.forEach((axis, i) => {
            const val = benchmarks[axis.key] || 0;
            const normalized = Math.min(100, Math.max(0, val)) / 100;
            const r = radius * normalized;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    // ==========================================
    // SCATTER PLOT (Speed / Cost vs Quality)
    // ==========================================
    function initScatterPlot(container, filteredModels) {
        const wrapper = container.querySelector('.mc-scatter-canvas-wrapper');
        const canvas = container.querySelector('.mc-scatter-canvas');
        const tooltip = container.querySelector('.mc-scatter-tooltip');
        if (!canvas || !wrapper) return;

        // Resize canvas to display pixels
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const pad = { top: 30, right: 40, bottom: 50, left: 60 };

        ctx.clearRect(0, 0, w, h);

        // Determine X & Y Ranges
        let xMin = 0, xMax = 180, xLabel = 'Velocidad de Inferencia (Tokens / segundo)';
        if (state.scatterXAxis === 'inputPricePerM') {
            xMin = 0; xMax = 16; xLabel = 'Coste Entrada API ($ por 1M Tokens)';
        } else if (state.scatterXAxis === 'ttftSec') {
            xMin = 0; xMax = 2.5; xLabel = 'Latencia Primer Token TTFT (segundos)';
        }

        const yMin = 75, yMax = 100, yLabel = 'Artificial Analysis Quality Index (0-100)';

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#8e8b9e';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';

        // Y Axis Grid & Labels
        for (let yVal = 80; yVal <= 100; yVal += 5) {
            const y = pad.top + (1 - (yVal - yMin) / (yMax - yMin)) * (h - pad.top - pad.bottom);
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(w - pad.right, y);
            ctx.stroke();
            ctx.fillText(yVal, pad.left - 8, y + 4);
        }

        // X Axis Grid & Labels
        ctx.textAlign = 'center';
        const xStep = state.scatterXAxis === 'speedTokensSec' ? 30 : (state.scatterXAxis === 'inputPricePerM' ? 3 : 0.5);
        for (let xVal = xMin; xVal <= xMax; xVal += xStep) {
            const x = pad.left + ((xVal - xMin) / (xMax - xMin)) * (w - pad.left - pad.right);
            ctx.beginPath();
            ctx.moveTo(x, pad.top);
            ctx.lineTo(x, h - pad.bottom);
            ctx.stroke();
            ctx.fillText(xVal, x, h - pad.bottom + 18);
        }

        // Axis Titles
        ctx.fillStyle = '#c4b5fd';
        ctx.font = '12px sans-serif';
        ctx.fillText(xLabel, pad.left + (w - pad.left - pad.right) / 2, h - 12);

        ctx.save();
        ctx.translate(16, pad.top + (h - pad.top - pad.bottom) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();

        // Calculate positions for points
        const points = filteredModels.map(m => {
            let xRaw = m.speedTokensSec;
            if (state.scatterXAxis === 'inputPricePerM') xRaw = m.inputPricePerM;
            else if (state.scatterXAxis === 'ttftSec') xRaw = m.ttftSec;

            const yRaw = m.aaQualityIndex;
            const x = pad.left + ((xRaw - xMin) / (xMax - xMin)) * (w - pad.left - pad.right);
            const y = pad.top + (1 - (yRaw - yMin) / (yMax - yMin)) * (h - pad.top - pad.bottom);

            return { model: m, x, y, xRaw, yRaw };
        });

        // Draw points
        points.forEach(p => {
            const isReasoning = p.model.type === 'reasoning';
            const isOpen = p.model.category === 'open-source';
            const color = isReasoning ? '#f59e0b' : (isOpen ? '#10b981' : '#8b5cf6');

            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label next to point
            ctx.fillStyle = '#e8e6f0';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(p.model.name, p.x + 11, p.y + 4);
        });

        // Mouse hover interaction for tooltip
        canvas.onmousemove = (e) => {
            const cRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - cRect.left;
            const mouseY = e.clientY - cRect.top;

            let hovered = null;
            for (const p of points) {
                const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
                if (dist < 14) {
                    hovered = p;
                    break;
                }
            }

            if (hovered) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${hovered.x}px`;
                tooltip.style.top = `${hovered.y}px`;
                tooltip.innerHTML = `
                    <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${hovered.model.name} (${hovered.model.company})</div>
                    <div style="color: var(--accent-violet); font-size: 0.8rem; margin: 3px 0;">🎯 AA Quality Index: <strong>${hovered.model.aaQualityIndex}/100</strong></div>
                    <div style="color: var(--text-secondary); font-size: 0.75rem;">
                        ⚡ Velocidad: <strong>${hovered.model.speedTokensSec} t/s</strong> (TTFT: ${hovered.model.ttftSec}s)<br>
                        💰 Precio: <strong>$${hovered.model.inputPricePerM}/$${hovered.model.outputPricePerM}</strong> por 1M
                    </div>
                `;
            } else {
                tooltip.style.display = 'none';
            }
        };

        canvas.onmouseleave = () => {
            tooltip.style.display = 'none';
        };
    }

    // ==========================================
    // MAIN CONTROLLER
    // ==========================================
    function initModelCompare() {
        const containers = document.querySelectorAll('.model-compare-target');
        if (containers.length === 0) return;

        injectStyles();

        containers.forEach(container => {
            function render() {
                // Filter logic
                let filtered = models.filter(m => {
                    if (state.filterCategory === 'open-source' && m.category !== 'open-source') return false;
                    if (state.filterCategory === 'propietario' && m.category !== 'propietario') return false;
                    if (state.filterCategory === 'reasoning' && m.type !== 'reasoning') return false;
                    if (state.filterCategory === 'frontier' && m.type !== 'frontier') return false;
                    if (state.filterCategory === 'speed' && m.type !== 'speed') return false;

                    if (state.searchQuery) {
                        const q = state.searchQuery.toLowerCase();
                        return m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q) || m.architecture.toLowerCase().includes(q);
                    }
                    return true;
                });

                // Sort logic
                filtered.sort((a, b) => {
                    let valA = a[state.sortBy];
                    let valB = b[state.sortBy];
                    if (typeof valA === 'string') {
                        return state.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                    }
                    return state.sortOrder === 'asc' ? (valA - valB) : (valB - valA);
                });

                container.innerHTML = `
                    <div class="mc-container">
                        
                        <!-- Header & Artificial Analysis Accreditation -->
                        <div class="mc-header-box">
                            <div>
                                <h3 class="mc-header-title">
                                    <span>🧠</span> Comparador de Modelos & Quality Index
                                </h3>
                                <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">
                                    Evaluación técnica independiente de inteligencia, rendimiento en tokens/s, latencia y costes de API.
                                </p>
                            </div>
                            <a href="https://artificialanalysis.ai/#intelligence" target="_blank" rel="noopener" class="mc-attribution" title="Ver líderboards en vivo en Artificial Analysis">
                                <span>🌐 Datos indexados de <strong>Artificial Analysis</strong></span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </div>

                        <!-- Toolbar & Controls -->
                        <div class="mc-toolbar">
                            <!-- Category Filter Chips -->
                            <div class="mc-filters-group">
                                <button class="mc-chip-btn ${state.filterCategory === 'all' ? 'active' : ''}" data-cat="all">Todos (${models.length})</button>
                                <button class="mc-chip-btn ${state.filterCategory === 'reasoning' ? 'active' : ''}" data-cat="reasoning">🧠 Razonamiento (o1, R1)</button>
                                <button class="mc-chip-btn ${state.filterCategory === 'frontier' ? 'active' : ''}" data-cat="frontier">⚡ Frontera / Multimodal</button>
                                <button class="mc-chip-btn ${state.filterCategory === 'speed' ? 'active' : ''}" data-cat="speed">🚀 Ultra-Rápidos</button>
                                <button class="mc-chip-btn ${state.filterCategory === 'open-source' ? 'active' : ''}" data-cat="open-source">🔓 Open Weights</button>
                            </div>

                            <!-- Search Input -->
                            <input type="text" class="mc-search-input" placeholder="Buscar modelo o proveedor..." value="${state.searchQuery}">

                            <!-- View Mode Tabs -->
                            <div class="mc-view-tabs">
                                <button class="mc-tab-btn ${state.view === 'cards' ? 'active' : ''}" data-view="cards">
                                    <span>🎴</span> Fichas
                                </button>
                                <button class="mc-tab-btn ${state.view === 'scatter' ? 'active' : ''}" data-view="scatter">
                                    <span>📈</span> Calidad vs Velocidad
                                </button>
                                <button class="mc-tab-btn ${state.view === 'table' ? 'active' : ''}" data-view="table">
                                    <span>📋</span> Tabla
                                </button>
                            </div>
                        </div>

                        <!-- Dynamic Content Views -->
                        <div class="mc-view-target">
                            ${state.view === 'cards' ? renderCardsHTML(filtered) : (state.view === 'scatter' ? renderScatterHTML(filtered) : renderTableHTML(filtered))}
                        </div>

                        <!-- Floating Compare Tray -->
                        <div class="mc-compare-tray ${state.selectedModels.length > 0 ? '' : 'hidden'}">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <strong style="font-size: 0.85rem; color: var(--accent-violet);">Comparativa (${state.selectedModels.length}/4):</strong>
                                <div class="mc-tray-models">
                                    ${state.selectedModels.map(id => {
                                        const m = models.find(x => x.id === id);
                                        return `<div class="mc-tray-pill">${m ? m.name : id} <span class="mc-tray-remove" data-remove="${id}">&times;</span></div>`;
                                    }).join('')}
                                </div>
                            </div>
                            <button class="mc-btn-launch-compare" ${state.selectedModels.length < 2 ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
                                Comparar Cara a Cara ⚔️
                            </button>
                        </div>

                        <!-- Side-by-Side Modal Target -->
                        <div class="mc-modal-target"></div>
                    </div>
                `;

                bindEvents(container, filtered);

                // Render radar charts for visible cards
                if (state.view === 'cards') {
                    filtered.forEach(m => {
                        const canvas = container.querySelector(`#radar-${m.id}`);
                        if (canvas) drawRadarChart(canvas, m.benchmarks, m.category === 'open-source' ? 'var(--accent-emerald)' : 'var(--accent-violet)');
                    });
                } else if (state.view === 'scatter') {
                    initScatterPlot(container, filtered);
                }
            }

            function renderCardsHTML(filtered) {
                if (filtered.length === 0) {
                    return `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No se encontraron modelos con los filtros seleccionados.</div>`;
                }

                return `
                    <div class="mc-cards-grid">
                        ${filtered.map(m => `
                            <div class="mc-card" data-id="${m.id}">
                                <div class="mc-card-header">
                                    <div>
                                        <h4 class="mc-card-title">${m.name}</h4>
                                        <div class="mc-card-company">${m.company} · ${m.license}</div>
                                    </div>
                                    <div class="mc-quality-badge" title="Artificial Analysis Quality Index">
                                        <span class="mc-quality-num">${m.aaQualityIndex}</span>
                                        <span class="mc-quality-label">AA INDEX</span>
                                    </div>
                                </div>

                                <!-- Key Stats Row -->
                                <div class="mc-stats-row">
                                    <div class="mc-stat-item">
                                        <span class="mc-stat-val" style="color: var(--accent-cyan);">${m.speedTokensSec} t/s</span>
                                        <span class="mc-stat-lbl">Velocidad</span>
                                    </div>
                                    <div class="mc-stat-item">
                                        <span class="mc-stat-val">${m.ttftSec}s</span>
                                        <span class="mc-stat-lbl">Latencia TTFT</span>
                                    </div>
                                    <div class="mc-stat-item">
                                        <span class="mc-stat-val" style="color: var(--accent-emerald);">$${m.inputPricePerM}</span>
                                        <span class="mc-stat-lbl">$/1M Input</span>
                                    </div>
                                </div>

                                <!-- Mini Radar Chart for Benchmarks -->
                                <div class="mc-radar-box">
                                    <canvas id="radar-${m.id}" width="180" height="140"></canvas>
                                </div>

                                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
                                    ${m.highlights}
                                </p>

                                <!-- Concepts linked to course notebooks -->
                                <div class="mc-concepts-list">
                                    ${m.concepts.map(c => `<span class="mc-concept-tag ${c.includes('Cuaderno') ? 'linked' : ''}">${c}</span>`).join('')}
                                </div>

                                <!-- Compare Selection Checkbox -->
                                <label class="mc-select-check">
                                    <input type="checkbox" class="mc-card-checkbox" data-id="${m.id}" ${state.selectedModels.includes(m.id) ? 'checked' : ''}>
                                    <span>Seleccionar para comparar</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            function renderScatterHTML(filtered) {
                return `
                    <div class="mc-scatter-view">
                        <div class="mc-scatter-controls">
                            <div>
                                <strong style="font-size: 0.95rem; color: var(--text-primary);">Diagrama de Dispersión Cuadrante de Valor</strong>
                                <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--text-muted);">
                                    Los modelos situados en la esquina superior derecha ofrecen la mayor calidad a máxima velocidad.
                                </p>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <span style="font-size: 0.8rem; color: var(--text-secondary);">Eje X:</span>
                                <select class="mc-select-axis mc-search-input" style="width: auto;">
                                    <option value="speedTokensSec" ${state.scatterXAxis === 'speedTokensSec' ? 'selected' : ''}>Velocidad (tokens/s)</option>
                                    <option value="inputPricePerM" ${state.scatterXAxis === 'inputPricePerM' ? 'selected' : ''}>Precio Entrada ($/1M)</option>
                                    <option value="ttftSec" ${state.scatterXAxis === 'ttftSec' ? 'selected' : ''}>Latencia TTFT (s)</option>
                                </select>
                            </div>
                        </div>

                        <div class="mc-scatter-canvas-wrapper">
                            <canvas class="mc-scatter-canvas"></canvas>
                            <div class="mc-scatter-tooltip"></div>
                        </div>
                    </div>
                `;
            }

            function renderTableHTML(filtered) {
                return `
                    <div class="mc-table-wrapper">
                        <table class="mc-table">
                            <thead>
                                <tr>
                                    <th data-sort="name">Modelo</th>
                                    <th data-sort="company">Proveedor</th>
                                    <th data-sort="aaQualityIndex" class="${state.sortBy === 'aaQualityIndex' ? 'sorted-' + state.sortOrder : ''}">AA Quality Index</th>
                                    <th data-sort="speedTokensSec" class="${state.sortBy === 'speedTokensSec' ? 'sorted-' + state.sortOrder : ''}">Velocidad (t/s)</th>
                                    <th data-sort="ttftSec" class="${state.sortBy === 'ttftSec' ? 'sorted-' + state.sortOrder : ''}">Latencia TTFT</th>
                                    <th data-sort="inputPricePerM" class="${state.sortBy === 'inputPricePerM' ? 'sorted-' + state.sortOrder : ''}">Precio In ($/1M)</th>
                                    <th data-sort="outputPricePerM" class="${state.sortBy === 'outputPricePerM' ? 'sorted-' + state.sortOrder : ''}">Precio Out ($/1M)</th>
                                    <th data-sort="contextNum">Ventana Contexto</th>
                                    <th>Comparar</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filtered.map(m => `
                                    <tr>
                                        <td><strong>${m.name}</strong></td>
                                        <td>${m.company}</td>
                                        <td><span style="font-weight: 800; color: var(--accent-violet);">${m.aaQualityIndex}</span> / 100</td>
                                        <td><span style="color: var(--accent-cyan); font-weight: 600;">${m.speedTokensSec}</span> t/s</td>
                                        <td>${m.ttftSec}s</td>
                                        <td>$${m.inputPricePerM}</td>
                                        <td>$${m.outputPricePerM}</td>
                                        <td>${m.contextWindow}</td>
                                        <td>
                                            <input type="checkbox" class="mc-card-checkbox" data-id="${m.id}" ${state.selectedModels.includes(m.id) ? 'checked' : ''}>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            function openCompareModal(container) {
                const selected = models.filter(m => state.selectedModels.includes(m.id));
                const modalTarget = container.querySelector('.mc-modal-target');

                modalTarget.innerHTML = `
                    <div class="mc-modal-overlay">
                        <div class="mc-modal-box">
                            <div class="mc-modal-header">
                                <h3 style="margin: 0; font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary);">
                                    ⚔️ Comparativa Cara a Cara (${selected.length} Modelos)
                                </h3>
                                <button class="mc-modal-close">&times;</button>
                            </div>

                            <div class="mc-compare-grid">
                                ${selected.map(m => `
                                    <div class="mc-compare-col">
                                        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
                                            <h4 style="margin: 0; font-size: 1.15rem; color: var(--accent-violet);">${m.name}</h4>
                                            <div style="font-size: 0.8rem; color: var(--text-muted);">${m.company} · ${m.license}</div>
                                        </div>

                                        <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">AA Quality Index</div>
                                            <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-violet);">${m.aaQualityIndex}/100</div>
                                        </div>

                                        <div style="font-size: 0.85rem; line-height: 1.6;">
                                            • <strong>Velocidad:</strong> ${m.speedTokensSec} tokens/s<br>
                                            • <strong>Latencia TTFT:</strong> ${m.ttftSec} s<br>
                                            • <strong>Precio Input:</strong> $${m.inputPricePerM} / 1M<br>
                                            • <strong>Precio Output:</strong> $${m.outputPricePerM} / 1M<br>
                                            • <strong>Contexto:</strong> ${m.contextWindow}<br>
                                            • <strong>Arquitectura:</strong> ${m.architecture}
                                        </div>

                                        <div style="margin-top: 0.5rem; background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-md); font-size: 0.8rem; border-left: 3px solid var(--accent-blue);">
                                            <strong>Benchmarks Duros:</strong><br>
                                            • GPQA Diamond: <strong>${m.benchmarks.GPQA}%</strong><br>
                                            • MATH 500: <strong>${m.benchmarks.MATH}%</strong><br>
                                            • MMLU-Pro: <strong>${m.benchmarks.MMLU_Pro}%</strong><br>
                                            • Code / SWE: <strong>${m.benchmarks.Coding}%</strong>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                modalTarget.querySelector('.mc-modal-close').addEventListener('click', () => {
                    modalTarget.innerHTML = '';
                });

                modalTarget.querySelector('.mc-modal-overlay').addEventListener('click', (e) => {
                    if (e.target.classList.contains('mc-modal-overlay')) {
                        modalTarget.innerHTML = '';
                    }
                });
            }

            function bindEvents(container, filtered) {
                // Category Filter Chips
                container.querySelectorAll('.mc-chip-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        state.filterCategory = btn.getAttribute('data-cat');
                        render();
                    });
                });

                // Search Input
                const searchInput = container.querySelector('.mc-search-input');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        state.searchQuery = e.target.value;
                        render();
                    });
                }

                // View Tabs
                container.querySelectorAll('.mc-tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        state.view = btn.getAttribute('data-view');
                        render();
                    });
                });

                // Scatter Axis Selector
                const selectAxis = container.querySelector('.mc-select-axis');
                if (selectAxis) {
                    selectAxis.addEventListener('change', (e) => {
                        state.scatterXAxis = e.target.value;
                        render();
                    });
                }

                // Table Sorting
                container.querySelectorAll('.mc-table th[data-sort]').forEach(th => {
                    th.addEventListener('click', () => {
                        const field = th.getAttribute('data-sort');
                        if (state.sortBy === field) {
                            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                        } else {
                            state.sortBy = field;
                            state.sortOrder = 'desc';
                        }
                        render();
                    });
                });

                // Checkbox selection for comparison
                container.querySelectorAll('.mc-card-checkbox').forEach(chk => {
                    chk.addEventListener('change', (e) => {
                        const id = chk.getAttribute('data-id');
                        if (chk.checked) {
                            if (!state.selectedModels.includes(id)) {
                                if (state.selectedModels.length >= 4) {
                                    alert('Puedes comparar un máximo de 4 modelos simultáneamente.');
                                    chk.checked = false;
                                    return;
                                }
                                state.selectedModels.push(id);
                            }
                        } else {
                            state.selectedModels = state.selectedModels.filter(x => x !== id);
                        }
                        render();
                    });
                });

                // Tray Remove Pill
                container.querySelectorAll('.mc-tray-remove').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-remove');
                        state.selectedModels = state.selectedModels.filter(x => x !== id);
                        render();
                    });
                });

                // Launch Compare Modal
                const btnLaunch = container.querySelector('.mc-btn-launch-compare');
                if (btnLaunch) {
                    btnLaunch.addEventListener('click', () => {
                        openCompareModal(container);
                    });
                }
            }

            render();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModelCompare);
    } else {
        initModelCompare();
    }
})();
