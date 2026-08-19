/**
 * CURSO IA COMMERCIAL - Interactive AI Simulations Suite (2026 Edition)
 * 1. Self-Attention Mechanism Interactive Visualizer
 * 2. LLM VRAM & KV Cache Memory Calculator
 * 3. 2D Semantic Embeddings & Vector Arithmetic Visualizer
 * 4. BPE Tokenizer & Subword Segmentation Interactive Engine
 * 5. LLM Sampling Simulator (Temperature, Top-K, Top-P / Nucleus)
 */

(function(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
})(function() {
  'use strict';

  // ========================================================
  // 1. SELF-ATTENTION VISUALIZER
  // ========================================================
  const ATTENTION_PRESET_PHRASES = [
    {
      title: "Procesamiento de Atención",
      text: "El modelo procesa la frase con atención espacial"
    },
    {
      title: "Pep Martorell (Polisemia)",
      text: "Los Transformers resuelven la polisemia considerando todo el contexto"
    },
    {
      title: "Javier Ideami (Causalidad)",
      text: "La correlación estadística no implica causalidad en los modelos"
    },
    {
      title: "Optimización & Inferencia",
      text: "El KV Cache almacena claves y valores acelerando la inferencia"
    }
  ];

  function computeSimulatedAttention(tokens) {
    const n = tokens.length;
    const matrix = [];
    
    for (let i = 0; i < n; i++) {
      const row = [];
      let sum = 0;
      for (let j = 0; j < n; j++) {
        let dist = Math.abs(i - j);
        let score = Math.exp(-dist * 0.45);
        if (i === j) score *= 1.8;
        
        const t1 = tokens[i].toLowerCase();
        const t2 = tokens[j].toLowerCase();
        if ((t1.includes('modelo') && t2.includes('atención')) ||
            (t1.includes('transformers') && t2.includes('contexto')) ||
            (t1.includes('correlación') && t2.includes('causalidad')) ||
            (t1.includes('cache') && t2.includes('inferencia'))) {
          score += 1.5;
        }
        
        row.push(score);
        sum += score;
      }
      const normalizedRow = row.map(val => val / sum);
      matrix.push(normalizedRow);
    }
    return matrix;
  }

  function initAttentionVisualizer() {
    const containers = document.querySelectorAll('.attention-visualizer-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      let currentPhraseIdx = 0;
      let selectedTokenIdx = 1;

      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Visualizador Interactivo de Self-Attention</span>
            </div>
            <span class="sim-badge">Mecanismo Q · Kᵀ / √dₖ</span>
          </div>

          <div class="attention-phrase-selector"></div>
          
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Haz clic o pasa el ratón sobre cualquier token (Query) para inspeccionar cuánto peso de atención proyecta hacia las demás palabras (Keys):
          </p>

          <div class="attention-words-grid"></div>
          <div class="attention-heatmap-matrix"></div>
        </div>
      `;

      const phraseSelector = container.querySelector('.attention-phrase-selector');
      const wordsGrid = container.querySelector('.attention-words-grid');
      const heatmapContainer = container.querySelector('.attention-heatmap-matrix');

      ATTENTION_PRESET_PHRASES.forEach((p, idx) => {
        const chip = document.createElement('button');
        chip.className = `phrase-chip ${idx === currentPhraseIdx ? 'active' : ''}`;
        chip.textContent = p.title;
        chip.addEventListener('click', () => {
          currentPhraseIdx = idx;
          selectedTokenIdx = 0;
          phraseSelector.querySelectorAll('.phrase-chip').forEach((c, i) => {
            c.classList.toggle('active', i === idx);
          });
          renderSimulation();
        });
        phraseSelector.appendChild(chip);
      });

      function renderSimulation() {
        const phrase = ATTENTION_PRESET_PHRASES[currentPhraseIdx].text;
        const tokens = phrase.split(' ');
        const matrix = computeSimulatedAttention(tokens);

        if (selectedTokenIdx >= tokens.length) selectedTokenIdx = 0;

        wordsGrid.innerHTML = '';
        tokens.forEach((tok, idx) => {
          const weight = matrix[selectedTokenIdx][idx];
          const tokenEl = document.createElement('div');
          tokenEl.className = `att-token ${idx === selectedTokenIdx ? 'selected' : ''}`;
          
          if (idx !== selectedTokenIdx) {
            tokenEl.style.backgroundColor = `rgba(139, 92, 246, ${Math.max(0.08, weight * 0.9)})`;
          }

          tokenEl.innerHTML = `
            <span>${tok}</span>
            <span class="att-weight">${(weight * 100).toFixed(1)}%</span>
          `;

          tokenEl.addEventListener('mouseenter', () => {
            selectedTokenIdx = idx;
            renderSimulation();
          });

          tokenEl.addEventListener('click', () => {
            selectedTokenIdx = idx;
            renderSimulation();
          });

          wordsGrid.appendChild(tokenEl);
        });

        let tableHtml = `
          <table class="heatmap-table">
            <thead>
              <tr>
                <th style="color: var(--accent-violet);">Q \\ K</th>
                ${tokens.map(t => `<th title="${t}">${t.length > 7 ? t.slice(0, 6) + '..' : t}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
        `;

        tokens.forEach((qTok, qIdx) => {
          const isSelectedRow = qIdx === selectedTokenIdx;
          tableHtml += `<tr style="${isSelectedRow ? 'outline: 2px solid var(--accent-violet); background: rgba(139, 92, 246, 0.1);' : ''}">
            <th style="text-align: right; color: ${isSelectedRow ? 'var(--accent-violet)' : 'var(--text-primary)'};">${qTok}</th>`;
          
          tokens.forEach((kTok, kIdx) => {
            const w = matrix[qIdx][kIdx];
            const bg = `rgba(139, 92, 246, ${Math.max(0.05, w * 0.85)})`;
            tableHtml += `
              <td class="heatmap-cell" style="background: ${bg}; color: ${w > 0.3 ? '#fff' : 'var(--text-secondary)'};">
                ${(w * 100).toFixed(0)}%
              </td>
            `;
          });
          tableHtml += `</tr>`;
        });

        tableHtml += `</tbody></table>`;
        heatmapContainer.innerHTML = tableHtml;
      }

      renderSimulation();
    });
  }

  // ========================================================
  // 2. VRAM & KV CACHE CALCULATOR
  // ========================================================
  function initVramCalculator() {
    const targets = document.querySelectorAll('.vram-calculator-target');
    if (targets.length === 0) return;

    targets.forEach(container => {
      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              <span>Calculadora de VRAM & KV Cache (LLMs)</span>
            </div>
            <span class="sim-badge">Estimador Hardware 2026</span>
          </div>

          <div class="calc-grid">
            <div class="calc-controls">
              
              <div class="calc-group">
                <div class="calc-label">
                  <span>Tamaño del Modelo (Parámetros)</span>
                  <span id="vram-params-val">8 Billones (8B)</span>
                </div>
                <select id="vram-model-preset" class="calc-select">
                  <option value="3.8">Phi-3 / Mini (3.8B)</option>
                  <option value="8" selected>Llama-3.1 / Gemma-2 (8B)</option>
                  <option value="14">Qwen-2.5 (14B)</option>
                  <option value="32">Qwen-2.5 / DeepSeek-R1-Distill (32B)</option>
                  <option value="70">Llama-3.3 (70B)</option>
                  <option value="405">Llama-3.1 Frontier (405B)</option>
                </select>
              </div>

              <div class="calc-group">
                <div class="calc-label">
                  <span>Precisión / Cuantización</span>
                  <span id="vram-quant-val">16 bits (FP16 / BF16)</span>
                </div>
                <select id="vram-quant-select" class="calc-select">
                  <option value="16" selected>FP16 / BF16 (16 bits — Máxima Calidad)</option>
                  <option value="8">INT8 / Q8 (8 bits — Balance)</option>
                  <option value="4">INT4 / AWQ / Q4_K_M (4 bits — Alta Eficiencia)</option>
                </select>
              </div>

              <div class="calc-group">
                <div class="calc-label">
                  <span>Longitud de Contexto</span>
                  <span id="vram-ctx-val">8,192 tokens (8k)</span>
                </div>
                <input type="range" id="vram-ctx-slider" class="calc-slider" min="2048" max="131072" step="2048" value="8192">
              </div>

              <div class="calc-group">
                <div class="calc-label">
                  <span>Usuarios Concurrentes (Batch Size)</span>
                  <span id="vram-batch-val">1 usuario</span>
                </div>
                <input type="range" id="vram-batch-slider" class="calc-slider" min="1" max="32" step="1" value="1">
              </div>

            </div>

            <div class="calc-results">
              <div class="vram-total-box">
                <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 4px;">VRAM Total Requerida</div>
                <div class="vram-total-number" id="vram-total-num">18.4 GB</div>
              </div>

              <div class="vram-breakdown">
                <div class="vram-bar-container">
                  <div class="vram-bar-weights" id="vram-bar-w" style="width: 80%;" title="Pesos del Modelo"></div>
                  <div class="vram-bar-kv" id="vram-bar-k" style="width: 15%;" title="KV Cache"></div>
                  <div class="vram-bar-act" id="vram-bar-a" style="width: 5%;" title="Buffer CUDA / Activaciones"></div>
                </div>

                <div class="vram-item">
                  <span><span style="color: var(--accent-violet);">■</span> Pesos del Modelo:</span>
                  <strong id="vram-res-weights">16.0 GB</strong>
                </div>

                <div class="vram-item">
                  <span><span style="color: var(--accent-cyan);">■</span> Memoria KV Cache:</span>
                  <strong id="vram-res-kv">1.4 GB</strong>
                </div>

                <div class="vram-item">
                  <span><span style="color: var(--accent-amber);">■</span> Sobrecarga / Activaciones (CUDA):</span>
                  <strong id="vram-res-cuda">1.0 GB</strong>
                </div>
              </div>

              <div class="gpu-recommendation" id="vram-gpu-rec">
                💡 Recomendación: 1x NVIDIA RTX 4090 (24GB) o RTX 3090
              </div>
            </div>
          </div>
        </div>
      `;

      const paramsSelect = container.querySelector('#vram-model-preset');
      const quantSelect = container.querySelector('#vram-quant-select');
      const ctxSlider = container.querySelector('#vram-ctx-slider');
      const batchSlider = container.querySelector('#vram-batch-slider');

      const paramsVal = container.querySelector('#vram-params-val');
      const quantVal = container.querySelector('#vram-quant-val');
      const ctxVal = container.querySelector('#vram-ctx-val');
      const batchVal = container.querySelector('#vram-batch-val');

      const totalNum = container.querySelector('#vram-total-num');
      const resWeights = container.querySelector('#vram-res-weights');
      const resKv = container.querySelector('#vram-res-kv');
      const resCuda = container.querySelector('#vram-res-cuda');
      const barW = container.querySelector('#vram-bar-w');
      const barK = container.querySelector('#vram-bar-k');
      const barA = container.querySelector('#vram-bar-a');
      const gpuRec = container.querySelector('#vram-gpu-rec');

      function calculate() {
        const paramsB = parseFloat(paramsSelect.value);
        const bits = parseInt(quantSelect.value);
        const ctx = parseInt(ctxSlider.value);
        const batch = parseInt(batchSlider.value);

        paramsVal.textContent = `${paramsB}B parámetros`;
        quantVal.textContent = `${bits} bits (${bits === 16 ? 'FP16' : bits === 8 ? 'INT8' : 'INT4'})`;
        ctxVal.textContent = `${ctx.toLocaleString()} tokens (${(ctx / 1024).toFixed(0)}k)`;
        batchVal.textContent = `${batch} ${batch === 1 ? 'usuario' : 'usuarios'}`;

        const bytesPerParam = bits / 8;
        const weightsGB = paramsB * bytesPerParam;

        const layers = paramsB <= 8 ? 32 : paramsB <= 32 ? 64 : 80;
        const kvHeads = paramsB <= 8 ? 8 : paramsB <= 32 ? 8 : 8;
        const headDim = 128;
        const bytesPerElem = 2;
        const kvBytesPerToken = 2 * layers * kvHeads * headDim * bytesPerElem;
        const kvGB = (kvBytesPerToken * ctx * batch) / (1024 * 1024 * 1024);

        const cudaGB = Math.max(0.8, weightsGB * 0.08);
        const totalGB = weightsGB + kvGB + cudaGB;

        totalNum.textContent = `${totalGB.toFixed(1)} GB`;
        resWeights.textContent = `${weightsGB.toFixed(1)} GB`;
        resKv.textContent = `${kvGB.toFixed(2)} GB`;
        resCuda.textContent = `${cudaGB.toFixed(1)} GB`;

        const pctW = (weightsGB / totalGB) * 100;
        const pctK = (kvGB / totalGB) * 100;
        const pctA = (cudaGB / totalGB) * 100;

        barW.style.width = `${pctW}%`;
        barK.style.width = `${pctK}%`;
        barA.style.width = `${pctA}%`;

        if (totalGB <= 12) {
          gpuRec.textContent = `💡 Hardware: 1x NVIDIA RTX 3060 / 4060 (12GB) o Apple M2/M3 (16GB)`;
        } else if (totalGB <= 16) {
          gpuRec.textContent = `💡 Hardware: 1x NVIDIA RTX 4080 (16GB) o Apple Mac (24GB)`;
        } else if (totalGB <= 24) {
          gpuRec.textContent = `💡 Hardware: 1x NVIDIA RTX 4090 / 3090 (24GB)`;
        } else if (totalGB <= 48) {
          gpuRec.textContent = `💡 Hardware: 2x RTX 4090 (48GB) o 1x NVIDIA RTX 6000 Ada / A6000`;
        } else if (totalGB <= 80) {
          gpuRec.textContent = `💡 Hardware: 1x NVIDIA A100 / H100 (80GB) o Mac Studio (96GB/128GB)`;
        } else if (totalGB <= 160) {
          gpuRec.textContent = `💡 Hardware: 2x NVIDIA H100 (80GB) en cluster NVLink o Apple M3 Max (128GB)`;
        } else if (totalGB <= 320) {
          gpuRec.textContent = `💡 Hardware: 4x NVIDIA H100 / A100 (80GB)`;
        } else {
          gpuRec.textContent = `💡 Hardware: 8x NVIDIA H100 (80GB) en nodo HGX (640GB VRAM)`;
        }
      }

      paramsSelect.addEventListener('change', calculate);
      quantSelect.addEventListener('change', calculate);
      ctxSlider.addEventListener('input', calculate);
      batchSlider.addEventListener('input', calculate);

      calculate();
    });
  }

  // ========================================================
  // 3. 2D SEMANTIC EMBEDDINGS & VECTOR ARITHMETIC VISUALIZER
  // ========================================================
  const EMBEDDING_POINTS = [
    { label: "Rey", x: 0.75, y: 0.60, cat: "realeza" },
    { label: "Reina", x: 0.72, y: 0.15, cat: "realeza" },
    { label: "Hombre", x: 0.28, y: 0.58, cat: "genero" },
    { label: "Mujer", x: 0.25, y: 0.12, cat: "genero" },
    { label: "París", x: -0.65, y: 0.70, cat: "geografia" },
    { label: "Francia", x: -0.80, y: 0.50, cat: "geografia" },
    { label: "Madrid", x: -0.60, y: 0.20, cat: "geografia" },
    { label: "España", x: -0.75, y: 0.05, cat: "geografia" },
    { label: "Perro", x: -0.30, y: -0.55, cat: "fauna" },
    { label: "Gato", x: -0.45, y: -0.50, cat: "fauna" },
    { label: "Algoritmo", x: 0.20, y: -0.70, cat: "tech" },
    { label: "Transformer", x: 0.45, y: -0.80, cat: "tech" },
    { label: "Neurona", x: 0.35, y: -0.60, cat: "tech" }
  ];

  function initEmbeddingVisualizer() {
    const containers = document.querySelectorAll('.embedding-visualizer-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      let selectedA = "Rey";
      let selectedB = "Reina";
      let arithmeticActive = false;

      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
              <span>Espacio Semántico de Embeddings & Similitud Coseno</span>
            </div>
            <span class="sim-badge">Aritmética Vectorial 2D</span>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Haz clic en dos conceptos para calcular su ángulo y similitud coseno $\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$, o ejecuta la famosa ecuación canónica de Word2Vec:
          </p>

          <div class="emb-layout">
            <div class="emb-canvas-container">
              <svg class="emb-svg-plane" viewBox="-1.1 -1.1 2.2 2.2" id="emb-svg">
                <!-- Grid Lines -->
                <line x1="-1" y1="0" x2="1" y2="0" stroke="var(--border-medium)" stroke-width="0.01" />
                <line x1="0" y1="-1" x2="0" y2="1" stroke="var(--border-medium)" stroke-width="0.01" />
                <circle cx="0" cy="0" r="0.5" fill="none" stroke="var(--border-subtle)" stroke-width="0.008" stroke-dasharray="0.02 0.02" />
                <circle cx="0" cy="0" r="1.0" fill="none" stroke="var(--border-subtle)" stroke-width="0.008" stroke-dasharray="0.02 0.02" />
                
                <!-- Dynamic Elements Layer -->
                <g id="emb-dynamic-layer"></g>
                <!-- Nodes Layer -->
                <g id="emb-nodes-layer"></g>
              </svg>
            </div>

            <div class="emb-controls-panel">
              <div class="emb-metrics-card">
                <div class="emb-metric-row">
                  <span>Vector A:</span>
                  <strong id="emb-name-a" style="color: var(--accent-violet); font-size: 1.05rem;">Rey</strong>
                </div>
                <div class="emb-metric-row">
                  <span>Vector B:</span>
                  <strong id="emb-name-b" style="color: var(--accent-cyan); font-size: 1.05rem;">Reina</strong>
                </div>
                <hr style="border: 0; border-top: 1px dashed var(--border-medium); margin: 0.75rem 0;">
                <div class="emb-metric-row">
                  <span>Similitud Coseno:</span>
                  <strong id="emb-val-cosine" style="font-size: 1.3rem; color: var(--accent-emerald);">0.92</strong>
                </div>
                <div class="emb-metric-row">
                  <span>Distancia Euclidiana:</span>
                  <span id="emb-val-dist" style="font-family: var(--font-mono); color: var(--text-secondary);">0.45</span>
                </div>
                <div class="emb-metric-row">
                  <span>Ángulo entre vectores:</span>
                  <span id="emb-val-angle" style="font-family: var(--font-mono); color: var(--text-secondary);">23.1°</span>
                </div>
              </div>

              <button class="tool-btn emb-btn-arithmetic" id="emb-btn-calc-queen" style="width: 100%; justify-content: center; margin-top: 1rem;">
                <span>👑 Demostración: Rey - Hombre + Mujer → Reina</span>
              </button>

              <div class="emb-legend" style="margin-top: 1rem; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 8px;">
                <span><span style="color: #c084fc;">●</span> Realeza</span>
                <span><span style="color: #60a5fa;">●</span> Género</span>
                <span><span style="color: #34d399;">●</span> Geografía</span>
                <span><span style="color: #f59e0b;">●</span> Fauna</span>
                <span><span style="color: #ec4899;">●</span> IA & Tech</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const svg = container.querySelector('#emb-svg');
      const dynamicLayer = container.querySelector('#emb-dynamic-layer');
      const nodesLayer = container.querySelector('#emb-nodes-layer');
      const nameA = container.querySelector('#emb-name-a');
      const nameB = container.querySelector('#emb-name-b');
      const valCosine = container.querySelector('#emb-val-cosine');
      const valDist = container.querySelector('#emb-val-dist');
      const valAngle = container.querySelector('#emb-val-angle');
      const btnArithmetic = container.querySelector('#emb-btn-calc-queen');

      function getCatColor(cat) {
        switch(cat) {
          case 'realeza': return '#c084fc';
          case 'genero': return '#60a5fa';
          case 'geografia': return '#34d399';
          case 'fauna': return '#f59e0b';
          case 'tech': return '#ec4899';
          default: return '#94a3b8';
        }
      }

      function renderNodes() {
        nodesLayer.innerHTML = '';
        EMBEDDING_POINTS.forEach(pt => {
          const isA = pt.label === selectedA;
          const isB = pt.label === selectedB;
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.style.cursor = 'pointer';

          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', pt.x);
          circle.setAttribute('cy', -pt.y);
          circle.setAttribute('r', isA || isB ? '0.045' : '0.03');
          circle.setAttribute('fill', isA ? 'var(--accent-violet)' : isB ? 'var(--accent-cyan)' : getCatColor(pt.cat));
          circle.setAttribute('stroke', isA || isB ? '#ffffff' : 'rgba(0,0,0,0.5)');
          circle.setAttribute('stroke-width', '0.01');

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', pt.x);
          text.setAttribute('y', -pt.y - 0.05);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('font-size', '0.055');
          text.setAttribute('fill', isA ? 'var(--accent-violet)' : isB ? 'var(--accent-cyan)' : 'var(--text-primary)');
          text.setAttribute('font-weight', isA || isB ? 'bold' : 'normal');
          text.textContent = pt.label;

          g.appendChild(circle);
          g.appendChild(text);

          g.addEventListener('click', (e) => {
            e.stopPropagation();
            arithmeticActive = false;
            if (selectedA !== pt.label && selectedB !== pt.label) {
              selectedB = selectedA;
              selectedA = pt.label;
            } else if (selectedA === pt.label) {
              // keep
            } else {
              selectedB = pt.label;
            }
            updateMetrics();
          });

          nodesLayer.appendChild(g);
        });
      }

      function updateMetrics() {
        const ptA = EMBEDDING_POINTS.find(p => p.label === selectedA) || EMBEDDING_POINTS[0];
        const ptB = EMBEDDING_POINTS.find(p => p.label === selectedB) || EMBEDDING_POINTS[1];

        nameA.textContent = ptA.label;
        nameB.textContent = ptB.label;

        const dot = ptA.x * ptB.x + ptA.y * ptB.y;
        const normA = Math.sqrt(ptA.x * ptA.x + ptA.y * ptA.y);
        const normB = Math.sqrt(ptB.x * ptB.x + ptB.y * ptB.y);
        const cosine = dot / (normA * normB);
        const dist = Math.sqrt(Math.pow(ptA.x - ptB.x, 2) + Math.pow(ptA.y - ptB.y, 2));
        const angleRad = Math.acos(Math.max(-1, Math.min(1, cosine)));
        const angleDeg = (angleRad * 180 / Math.PI);

        valCosine.textContent = cosine.toFixed(3);
        valDist.textContent = dist.toFixed(2);
        valAngle.textContent = `${angleDeg.toFixed(1)}°`;

        dynamicLayer.innerHTML = '';

        if (arithmeticActive) {
          const rey = EMBEDDING_POINTS.find(p => p.label === "Rey");
          const hombre = EMBEDDING_POINTS.find(p => p.label === "Hombre");
          const mujer = EMBEDDING_POINTS.find(p => p.label === "Mujer");

          const resX = rey.x - hombre.x + mujer.x;
          const resY = rey.y - hombre.y + mujer.y;

          const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          arrow.setAttribute('x1', '0');
          arrow.setAttribute('y1', '0');
          arrow.setAttribute('x2', resX);
          arrow.setAttribute('y2', -resY);
          arrow.setAttribute('stroke', '#ec4899');
          arrow.setAttribute('stroke-width', '0.015');
          arrow.setAttribute('stroke-dasharray', '0.02 0.02');
          dynamicLayer.appendChild(arrow);

          const targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          targetCircle.setAttribute('cx', resX);
          targetCircle.setAttribute('cy', -resY);
          targetCircle.setAttribute('r', '0.06');
          targetCircle.setAttribute('fill', 'none');
          targetCircle.setAttribute('stroke', '#ec4899');
          targetCircle.setAttribute('stroke-width', '0.015');
          dynamicLayer.appendChild(targetCircle);
        } else {
          const lineA = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineA.setAttribute('x1', '0');
          lineA.setAttribute('y1', '0');
          lineA.setAttribute('x2', ptA.x);
          lineA.setAttribute('y2', -ptA.y);
          lineA.setAttribute('stroke', 'rgba(139, 92, 246, 0.6)');
          lineA.setAttribute('stroke-width', '0.012');
          dynamicLayer.appendChild(lineA);

          const lineB = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineB.setAttribute('x1', '0');
          lineB.setAttribute('y1', '0');
          lineB.setAttribute('x2', ptB.x);
          lineB.setAttribute('y2', -ptB.y);
          lineB.setAttribute('stroke', 'rgba(6, 182, 212, 0.6)');
          lineB.setAttribute('stroke-width', '0.012');
          dynamicLayer.appendChild(lineB);

          const lineAB = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineAB.setAttribute('x1', ptA.x);
          lineAB.setAttribute('y1', -ptA.y);
          lineAB.setAttribute('x2', ptB.x);
          lineAB.setAttribute('y2', -ptB.y);
          lineAB.setAttribute('stroke', 'rgba(255, 255, 255, 0.25)');
          lineAB.setAttribute('stroke-dasharray', '0.02 0.02');
          lineAB.setAttribute('stroke-width', '0.008');
          dynamicLayer.appendChild(lineAB);
        }

        renderNodes();
      }

      btnArithmetic.addEventListener('click', () => {
        arithmeticActive = true;
        selectedA = "Rey";
        selectedB = "Reina";
        updateMetrics();
      });

      updateMetrics();
    });
  }

  // ========================================================
  // 4. BPE TOKENIZER & SUBWORD SEGMENTATION ENGINE
  // ========================================================
  const TOKEN_COLORS = [
    'rgba(139, 92, 246, 0.25)',
    'rgba(59, 130, 246, 0.25)',
    'rgba(6, 182, 212, 0.25)',
    'rgba(16, 185, 129, 0.25)',
    'rgba(245, 158, 11, 0.25)',
    'rgba(236, 72, 153, 0.25)'
  ];

  function simulateBpeTokenize(text) {
    if (!text) return [];
    const words = text.match(/[\wáéíóúÁÉÍÓÚñÑ]+|[^\s\wáéíóúÁÉÍÓÚñÑ]+|\s+/g) || [];
    const tokens = [];
    let fakeTokenIdBase = 1024;

    words.forEach(w => {
      if (/^\s+$/.test(w)) {
        tokens.push({ text: '·', raw: w, id: fakeTokenIdBase++, isSpace: true });
      } else if (w.length > 7) {
        const half = Math.ceil(w.length / 2);
        tokens.push({ text: w.slice(0, half), raw: w.slice(0, half), id: fakeTokenIdBase++ });
        tokens.push({ text: '##' + w.slice(half), raw: w.slice(half), id: fakeTokenIdBase++ });
      } else {
        tokens.push({ text: w, raw: w, id: fakeTokenIdBase++ });
      }
    });

    return tokens;
  }

  function initTokenizerVisualizer() {
    const containers = document.querySelectorAll('.tokenizer-visualizer-target');
    if (containers.length === 0) return;

    const PRESETS = [
      {
        title: "Transformers & Polisemia",
        text: "Los Transformers resuelven la polisemia considerando todo el contexto circundante."
      },
      {
        title: "Código Python",
        text: "def softmax(x):\n    return np.exp(x) / np.sum(np.exp(x), axis=-1)"
      },
      {
        title: "Prompt con Emojis & Símbolos",
        text: "🚀 AGI 2030: ¿Es la correlación suficiente para la causalidad? #AI_Research"
      }
    ];

    containers.forEach(container => {
      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>
              <span>Tokenizador Interactivo BPE (Byte Pair Encoding)</span>
            </div>
            <span class="sim-badge">Subword Tokenizer Live</span>
          </div>

          <div class="tokenizer-presets" style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;"></div>

          <div class="tokenizer-input-box">
            <textarea id="tokenizer-input" class="tokenizer-textarea" rows="3" placeholder="Escribe o pega cualquier texto aquí para inspeccionar su división en tokens...">${PRESETS[0].text}</textarea>
          </div>

          <div class="tokenizer-stats-bar">
            <div class="stat-pill">
              <span class="stat-label">Tokens:</span>
              <strong id="tok-count-tokens" class="stat-val" style="color: var(--accent-violet);">0</strong>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Caracteres:</span>
              <strong id="tok-count-chars" class="stat-val">0</strong>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Ratio Caracteres/Token:</span>
              <strong id="tok-count-ratio" class="stat-val">0.0</strong>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Coste Estimado (Inferencia):</span>
              <strong id="tok-count-cost" class="stat-val" style="color: var(--accent-emerald);">$0.0000</strong>
            </div>
          </div>

          <div class="tokenizer-output-display" id="tokenizer-output"></div>
        </div>
      `;

      const input = container.querySelector('#tokenizer-input');
      const presetsContainer = container.querySelector('.tokenizer-presets');
      const output = container.querySelector('#tokenizer-output');
      const countTokens = container.querySelector('#tok-count-tokens');
      const countChars = container.querySelector('#tok-count-chars');
      const countRatio = container.querySelector('#tok-count-ratio');
      const countCost = container.querySelector('#tok-count-cost');

      PRESETS.forEach((p, idx) => {
        const btn = document.createElement('button');
        btn.className = `phrase-chip ${idx === 0 ? 'active' : ''}`;
        btn.textContent = p.title;
        btn.addEventListener('click', () => {
          presetsContainer.querySelectorAll('.phrase-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          input.value = p.text;
          updateTokenization();
        });
        presetsContainer.appendChild(btn);
      });

      function updateTokenization() {
        const text = input.value;
        const tokens = simulateBpeTokenize(text);

        countTokens.textContent = tokens.length;
        countChars.textContent = text.length;
        countRatio.textContent = tokens.length > 0 ? (text.length / tokens.length).toFixed(2) : '0.0';
        
        const cost = (tokens.length * 0.00000015);
        countCost.textContent = `$${cost.toFixed(6)}`;

        output.innerHTML = '';
        tokens.forEach((t, i) => {
          const bg = TOKEN_COLORS[i % TOKEN_COLORS.length];
          const span = document.createElement('span');
          span.className = 'token-chip';
          span.style.backgroundColor = bg;
          span.setAttribute('title', `Token ID: ${t.id} | Longitud: ${t.raw.length} caracteres`);
          span.innerHTML = `<span>${escapeHtml(t.text)}</span><sub class="token-id">${t.id}</sub>`;
          output.appendChild(span);
        });
      }

      input.addEventListener('input', updateTokenization);
      updateTokenization();
    });
  }

  // ========================================================
  // 5. LLM SAMPLING SIMULATOR (TEMPERATURE, TOP-K, TOP-P)
  // ========================================================
  const CANDIDATE_NEXT_TOKENS = [
    { token: "AdamW", logit: 4.2 },
    { token: "Adam", logit: 3.1 },
    { token: "SGD", logit: 2.3 },
    { token: "RMSprop", logit: 1.8 },
    { token: "Adagrad", logit: 0.9 },
    { token: "Lion", logit: 0.5 },
    { token: "un", logit: 0.1 },
    { token: "sistema", logit: -0.8 },
    { token: "mañana", logit: -2.0 },
    { token: "azul", logit: -3.2 }
  ];

  function initSamplingVisualizer() {
    const containers = document.querySelectorAll('.sampling-visualizer-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              <span>Simulador de Muestreo (Sampling): Temperatura, Top-K y Top-P</span>
            </div>
            <span class="sim-badge">Distribución de Probabilidad Autoregresiva</span>
          </div>

          <div class="sampling-prompt-preview">
            <span style="color: var(--text-muted);">Prompt:</span>
            <strong style="color: var(--text-primary); margin-left: 6px;">"El optimizador más utilizado en Transformers es..."</strong>
          </div>

          <div class="calc-grid" style="margin-top: 1.5rem;">
            <div class="calc-controls">
              <div class="calc-group">
                <div class="calc-label">
                  <span>Temperatura ($T$)</span>
                  <span id="samp-temp-val">0.70</span>
                </div>
                <input type="range" id="samp-temp-slider" class="calc-slider" min="0.05" max="2.0" step="0.05" value="0.70">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                  Baja ($T \\to 0$): Determinista/Puntual • Alta ($T > 1$): Creativa/Caótica
                </div>
              </div>

              <div class="calc-group">
                <div class="calc-label">
                  <span>Top-P (Nucleus Sampling)</span>
                  <span id="samp-topp-val">0.90 (90%)</span>
                </div>
                <input type="range" id="samp-topp-slider" class="calc-slider" min="0.1" max="1.0" step="0.05" value="0.90">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                  Conserva los tokens cuya probabilidad acumulada sea $\\le p$.
                </div>
              </div>

              <div class="calc-group">
                <div class="calc-label">
                  <span>Top-K</span>
                  <span id="samp-topk-val">K = 5 tokens</span>
                </div>
                <input type="range" id="samp-topk-slider" class="calc-slider" min="1" max="10" step="1" value="5">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                  Trunca la selección únicamente a los $K$ mejores candidatos.
                </div>
              </div>

              <button class="tool-btn" id="samp-btn-sample" style="width: 100%; justify-content: center; margin-top: 1rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                <span>Generar Token Muestreado</span>
              </button>

              <div id="samp-sampled-result" style="display: none; margin-top: 1rem; padding: 12px; border-radius: var(--radius-md); background: var(--accent-violet-dim); border: 1px solid var(--accent-violet); text-align: center;">
                <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Token Seleccionado:</span>
                <strong id="samp-sampled-word" style="font-size: 1.4rem; color: var(--accent-violet);">AdamW</strong>
              </div>
            </div>

            <div class="calc-results">
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                <span>Distribución Posterior de Probabilidades:</span>
                <span><span style="color: var(--accent-emerald);">■</span> Válido • <span style="color: var(--text-muted);">■</span> Filtrado</span>
              </div>

              <div class="sampling-bars-container" id="sampling-bars"></div>
            </div>
          </div>
        </div>
      `;

      const tempSlider = container.querySelector('#samp-temp-slider');
      const toppSlider = container.querySelector('#samp-topp-slider');
      const topkSlider = container.querySelector('#samp-topk-slider');

      const tempVal = container.querySelector('#samp-temp-val');
      const toppVal = container.querySelector('#samp-topp-val');
      const topkVal = container.querySelector('#samp-topk-val');

      const barsContainer = container.querySelector('#sampling-bars');
      const btnSample = container.querySelector('#samp-btn-sample');
      const sampledBox = container.querySelector('#samp-sampled-result');
      const sampledWord = container.querySelector('#samp-sampled-word');

      let currentDistribution = [];

      function calculateSampling() {
        const T = parseFloat(tempSlider.value);
        const topP = parseFloat(toppSlider.value);
        const topK = parseInt(topkSlider.value);

        tempVal.textContent = T.toFixed(2);
        toppVal.textContent = `${topP.toFixed(2)} (${(topP * 100).toFixed(0)}%)`;
        topkVal.textContent = `K = ${topK} tokens`;

        const scaled = CANDIDATE_NEXT_TOKENS.map(c => ({
          token: c.token,
          scaledScore: Math.exp(c.logit / T)
        }));

        const sumScaled = scaled.reduce((acc, s) => acc + s.scaledScore, 0);
        const probabilities = scaled.map(s => ({
          token: s.token,
          prob: s.scaledScore / sumScaled
        })).sort((a, b) => b.prob - a.prob);

        let cumulativeProb = 0;
        const processed = probabilities.map((p, idx) => {
          cumulativeProb += p.prob;
          const passedTopK = idx < topK;
          const passedTopP = (cumulativeProb - p.prob) < topP;
          const active = passedTopK && passedTopP;
          return {
            ...p,
            active,
            cumulative: cumulativeProb
          };
        });

        const activeSum = processed.filter(p => p.active).reduce((acc, p) => acc + p.prob, 0);
        currentDistribution = processed.map(p => ({
          ...p,
          renormProb: p.active ? p.prob / activeSum : 0
        }));

        barsContainer.innerHTML = '';
        currentDistribution.forEach(item => {
          const row = document.createElement('div');
          row.className = `sampling-bar-row ${item.active ? 'active' : 'filtered'}`;
          
          row.innerHTML = `
            <div class="sampling-bar-label">
              <span>${item.token}</span>
              <span class="sampling-bar-pct">${(item.prob * 100).toFixed(1)}% ${item.active ? `(Adj: ${(item.renormProb * 100).toFixed(1)}%)` : ''}</span>
            </div>
            <div class="sampling-bar-track">
              <div class="sampling-bar-fill ${item.active ? 'is-active' : 'is-filtered'}" style="width: ${Math.min(100, item.prob * 100)}%;"></div>
            </div>
          `;
          barsContainer.appendChild(row);
        });
      }

      btnSample.addEventListener('click', () => {
        const rand = Math.random();
        let cumulative = 0;
        let chosen = currentDistribution[0].token;

        for (let item of currentDistribution) {
          if (item.active) {
            cumulative += item.renormProb;
            if (rand <= cumulative) {
              chosen = item.token;
              break;
            }
          }
        }

        sampledBox.style.display = 'block';
        sampledWord.textContent = `"${chosen}"`;
      });

      tempSlider.addEventListener('input', calculateSampling);
      toppSlider.addEventListener('input', calculateSampling);
      topkSlider.addEventListener('input', calculateSampling);

      calculateSampling();
    });
  }

  // ========================================================
  // 6. PIPELINE VISUAL RAG (RETRIEVAL-AUGMENTED GENERATION)
  // ========================================================
  const RAG_DOCS = [
    {
      id: "DOC-01",
      source: "Cuaderno 01 — Pep Martorell",
      title: "Polisemia y Superinterpolación",
      text: "Los Transformers resuelven la polisemia calculando atención contextual global en paralelo. La IA actúa como un superinterpolador estadístico en espacios vectoriales multidimensionales.",
      keywords: ["polisemia", "transformers", "interpolador", "atencion", "contexto", "superinterpolador", "estadistico", "pep"]
    },
    {
      id: "DOC-02",
      source: "Cuaderno 02 — Javier Ideami",
      title: "Correlación vs Causalidad & Metaprompting",
      text: "La correlación estadística (Nivel 1 de Pearl) no implica causalidad estructural (Nivel 3). El Metaprompting aprovecha la metacognición del LLM para estructurar restricciones y roles antes de la ejecución.",
      keywords: ["correlacion", "causalidad", "metaprompting", "pearl", "pensamiento", "razonamiento", "ideami", "prompting"]
    },
    {
      id: "DOC-03",
      source: "Cuaderno 03 — Compendio Técnico",
      title: "Optimización de Inferencia y KV Cache",
      text: "El KV Cache almacena en VRAM los tensores de Claves (Keys) y Valores (Values) de tokens previos, transformando la complejidad de atención de O(N^2) a O(N) por cada nuevo token generado.",
      keywords: ["kv cache", "cache", "vram", "inferencia", "memoria", "complejidad", "claves", "valores", "tokens"]
    },
    {
      id: "DOC-04",
      source: "Cuaderno 04 — Universo Transformer",
      title: "Codificación Posicional RoPE y ALiBi",
      text: "RoPE (Rotary Position Embedding) aplica matrices de rotación ortogonal 2D en el plano complejo, permitiendo una degradación natural de afinidad con la distancia y mejor extrapolación de contexto.",
      keywords: ["rope", "posicional", "rotacion", "alibi", "extrapolacion", "contexto", "embeddings", "atencion"]
    },
    {
      id: "DOC-05",
      source: "Cuaderno 01 & 03 — Geopolítica & Hardware",
      title: "Cuellos de Botella y Centros de Datos",
      text: "El escalado de modelos de frontera enfrenta cuellos de botella físicos: suministro energético para gigafactorías de cómputo, empaquetado CoWoS de GPUs y ancho de banda de memoria HBM.",
      keywords: ["hardware", "vram", "energia", "gigafactorias", "centros de datos", "chips", "cowos", "hbm", "geopolitica"]
    }
  ];

  const RAG_PRESET_QUERIES = [
    {
      query: "¿Por qué la correlación estadística no implica causalidad en los modelos de IA?",
      desc: "Consulta epistemológica sobre el Cuaderno 02"
    },
    {
      query: "¿Cómo reduce el KV Cache el consumo computacional durante la inferencia?",
      desc: "Consulta técnica sobre el Cuaderno 03"
    },
    {
      query: "¿De qué forma resuelve el mecanismo de atención la polisemia del lenguaje?",
      desc: "Consulta arquitectónica sobre el Cuaderno 01"
    },
    {
      query: "¿Qué ventajas aporta la codificación posicional rotatoria RoPE frente a APE?",
      desc: "Consulta matemática sobre el Cuaderno 04"
    }
  ];

  function computeRagScores(query) {
    const qClean = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const qWords = qClean.split(/\s+/).filter(w => w.length > 2);

    return RAG_DOCS.map(doc => {
      let score = 0.12; // base ambient similarity
      qWords.forEach(word => {
        if (doc.keywords.some(k => k.includes(word) || word.includes(k))) {
          score += 0.32;
        }
        const docTextClean = doc.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (docTextClean.includes(word)) {
          score += 0.22;
        }
      });
      score = Math.min(0.96, score + (Math.random() * 0.04));
      return {
        ...doc,
        similarity: parseFloat(score.toFixed(3))
      };
    }).sort((a, b) => b.similarity - a.similarity);
  }

  function initRagVisualizer() {
    const containers = document.querySelectorAll('.rag-visualizer-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      let currentQuery = RAG_PRESET_QUERIES[0].query;
      let topK = 2;
      let minThreshold = 0.40;

      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
              <span>Simulador de Pipeline RAG (Retrieval-Augmented Generation)</span>
            </div>
            <span class="sim-badge">Búsqueda Semántica + Inyección de Contexto</span>
          </div>

          <!-- Stage Tracker -->
          <div class="rag-stage-tracker" style="margin-bottom: 1.5rem;">
            <div class="rag-stage-step completed" id="rag-step-1">1. Embedding de Consulta</div>
            <div class="rag-stage-step completed" id="rag-step-2">2. Búsqueda Vectorial cos(θ)</div>
            <div class="rag-stage-step active" id="rag-step-3">3. Rerank & Prompt Inyectado</div>
            <div class="rag-stage-step active" id="rag-step-4">4. Respuesta Grounded</div>
          </div>

          <!-- Query Selection -->
          <div class="sim-controls-grid" style="grid-template-columns: 2fr 1fr 1fr; margin-bottom: 1.25rem;">
            <div class="sim-control-group">
              <label>Seleccionar o Escribir Consulta:</label>
              <select id="rag-query-select" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-medium); padding: 6px 10px; border-radius: var(--radius-sm); width: 100%;">
                ${RAG_PRESET_QUERIES.map((p, idx) => `<option value="${idx}">${p.query}</option>`).join('')}
              </select>
            </div>
            <div class="sim-control-group">
              <label>Top-K Chunks: <span id="rag-topk-val" style="color: var(--accent-violet); font-weight: bold;">${topK}</span></label>
              <input type="range" id="rag-topk-slider" min="1" max="4" step="1" value="${topK}">
            </div>
            <div class="sim-control-group">
              <label>Umbral Mínimo: <span id="rag-thresh-val" style="color: var(--accent-cyan); font-weight: bold;">${minThreshold.toFixed(2)}</span></label>
              <input type="range" id="rag-thresh-slider" min="0.20" max="0.80" step="0.05" value="${minThreshold}">
            </div>
          </div>

          <!-- 2 Columns Grid: Vector DB Chunks vs Augmented Prompt & Output -->
          <div class="rag-grid-layout">
            <!-- Left: Vector Knowledge Base -->
            <div class="rag-panel">
              <div class="rag-panel-title">
                <span>📚 Base Vectorial (${RAG_DOCS.length} Fragmentos Indexados)</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Similitud Coseno cos(θ)</span>
              </div>
              <div class="rag-chunk-list" id="rag-chunk-list"></div>
            </div>

            <!-- Right: Prompt Augmented & Response -->
            <div class="rag-panel">
              <div class="rag-panel-title">
                <span>⚡ Prompt Aumentado & Síntesis Grounded</span>
                <span style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 600;">● Contexto Verificado</span>
              </div>
              <div class="rag-prompt-preview" id="rag-prompt-preview"></div>
              <div style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 0.85rem;">
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-emerald); margin-bottom: 4px;">Respuesta Sintetizada por LLM:</div>
                <div id="rag-llm-response" style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.55;"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      const querySelect = container.querySelector('#rag-query-select');
      const topkSlider = container.querySelector('#rag-topk-slider');
      const topkVal = container.querySelector('#rag-topk-val');
      const threshSlider = container.querySelector('#rag-thresh-slider');
      const threshVal = container.querySelector('#rag-thresh-val');
      const chunkList = container.querySelector('#rag-chunk-list');
      const promptPreview = container.querySelector('#rag-prompt-preview');
      const llmResponse = container.querySelector('#rag-llm-response');

      function updateRagSimulation() {
        const selectedIdx = parseInt(querySelect.value);
        currentQuery = RAG_PRESET_QUERIES[selectedIdx].query;
        topK = parseInt(topkSlider.value);
        minThreshold = parseFloat(threshSlider.value);

        topkVal.textContent = topK;
        threshVal.textContent = minThreshold.toFixed(2);

        const scored = computeRagScores(currentQuery);
        const retrievedDocs = scored.filter((d, idx) => idx < topK && d.similarity >= minThreshold);

        // Render Chunks
        chunkList.innerHTML = scored.map(doc => {
          const isSelected = retrievedDocs.some(r => r.id === doc.id);
          const isHigh = doc.similarity >= 0.55;
          return `
            <div class="rag-chunk-card ${isSelected ? 'selected' : ''}">
              <div class="rag-chunk-header">
                <span class="rag-chunk-title">${doc.id}: ${doc.title}</span>
                <span class="rag-sim-score ${isHigh ? 'high' : ''}">cos(θ) = ${doc.similarity.toFixed(3)} ${isSelected ? '✓ Top-K' : ''}</span>
              </div>
              <div style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.45;">"${escapeHtml(doc.text)}"</div>
              <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Origen: ${doc.source}</div>
            </div>
          `;
        }).join('');

        // Build Prompt Preview
        let contextBlock = retrievedDocs.length > 0 
          ? retrievedDocs.map(d => `[${d.id} - ${d.source}]: ${d.text}`).join('\n\n')
          : "NO SE ENCONTRÓ INFORMACIÓN RELEVANTE EN LA BASE DE CONOCIMIENTO QUE SUPERE EL UMBRAL.";

        promptPreview.innerHTML = `<span style="color: var(--text-muted);">&lt;|system|&gt;\nEres un asistente de IA riguroso. Responde a la consulta basándote ESTRICTAMENTE en el siguiente contexto inyectado:\n\n--- INICIO DE CONTEXTO ---</span>\n<span class="context-injected">${escapeHtml(contextBlock)}</span>\n<span style="color: var(--text-muted);">--- FIN DE CONTEXTO ---\n\n&lt;|user|&gt;\n${escapeHtml(currentQuery)}\n\n&lt;|assistant|&gt;</span>`;

        // Synthesize response
        if (retrievedDocs.length === 0) {
          llmResponse.innerHTML = `<span style="color: var(--accent-rose);">⚠️ La consulta no alcanzó el umbral mínimo de similitud semántica (${minThreshold.toFixed(2)}). El modelo evita alucinaciones al no disponer de contexto grounded.</span>`;
        } else {
          const citations = retrievedDocs.map(d => `<strong>[${d.id}]</strong>`).join(' y ');
          let synthesis = "";
          if (selectedIdx === 0) {
            synthesis = `Basándome en ${citations}, la correlación estadística describe relaciones superficiales en el Nivel 1 de Judea Pearl, mientras que la causalidad estructural comprende los mecanismos y contrafácticos (Nivel 3). Por ello, el metaprompting resulta vital para estructurar problemas complejos sin incurrir en falacias correlacionales.`;
          } else if (selectedIdx === 1) {
            synthesis = `Según ${citations}, el KV Cache almacena las claves y valores en VRAM para evitar recalcular la atención de toda la secuencia en cada paso de generación, reduciendo la complejidad computacional de $O(N^2)$ a $O(N)$ por token.`;
          } else if (selectedIdx === 2) {
            synthesis = `De acuerdo con ${citations}, el mecanismo de autoatención resuelve la polisemia permitiendo que cada palabra atienda a todo el contexto circundante de forma global y bidireccional, proyectando el significado en espacios vectoriales latentes.`;
          } else {
            synthesis = `Basándome en ${citations}, RoPE aplica matrices de rotación ortogonales en pares bidimensionales en el espacio complejo, garantizando que la afinidad decaiga naturalmente con la distancia relativa y permitiendo mejor extrapolación de longitud de secuencia.`;
          }
          llmResponse.innerHTML = synthesis;
        }
      }

      querySelect.addEventListener('change', updateRagSimulation);
      topkSlider.addEventListener('input', updateRagSimulation);
      threshSlider.addEventListener('input', updateRagSimulation);

      updateRagSimulation();
    });
  }

  // ========================================================
  // 7. CICLO AGENCIAL REACT (REASONING + ACTING)
  // ========================================================
  const REACT_SCENARIOS = [
    {
      id: "vram_calc",
      title: "Cálculo de Infraestructura para LLaMA 70B",
      task: "Determinar si un modelo LLaMA 70B en INT4 con 8,192 tokens cabe en 2 GPUs RTX 4090 (48 GB VRAM total) con 10 usuarios concurrentes.",
      steps: [
        {
          type: "thought",
          title: "Thought 1 (Razonamiento)",
          content: "Para saber si el modelo cabe en 48 GB de VRAM, primero debo calcular el peso del modelo en INT4 (4 bits = 0.5 bytes por parámetro) y luego sumar el KV Cache para 10 usuarios a 8,192 tokens."
        },
        {
          type: "action",
          title: "Action 1 (Herramienta: Python REPL)",
          content: "<code>calc_weights(params=70e9, bits=4) -> 70e9 * 0.5 / (1024^3)</code>"
        },
        {
          type: "observation",
          title: "Observation 1 (Resultado)",
          content: "Memoria de pesos base = 32.60 GB."
        },
        {
          type: "thought",
          title: "Thought 2 (Razonamiento)",
          content: "Ahora calculo el KV Cache en FP16 para LLaMA 70B (80 capas, 64 cabezas GQA con 8 KV heads, head_dim 128, seq_len 8192, batch 10)."
        },
        {
          type: "action",
          title: "Action 2 (Herramienta: VRAM Calculator)",
          content: "<code>calc_kv_cache(layers=80, kv_heads=8, head_dim=128, seq_len=8192, batch=10)</code>"
        },
        {
          type: "observation",
          title: "Observation 2 (Resultado)",
          content: "Memoria KV Cache requerida = 10.00 GB. Total: 32.60 + 10.00 = 42.60 GB."
        },
        {
          type: "final",
          title: "Final Answer (Solución Agencial)",
          content: "<strong>Sí, es viable.</strong> El despliegue requiere 42.60 GB de VRAM total (32.60 GB de pesos en INT4 + 10.00 GB de KV Cache). Cabe holgadamente en las 2 GPUs RTX 4090 (48 GB) dejando 5.40 GB para overhead de CUDA."
        }
      ]
    },
    {
      id: "agent_rag",
      title: "Verificación de Polisemia y Cita en Cuaderno 01",
      task: "¿Quién explicó la resolución de la polisemia mediante Transformers y en qué contexto?",
      steps: [
        {
          type: "thought",
          title: "Thought 1 (Razonamiento)",
          content: "Debo buscar en la base de conocimientos indexada del curso qué experto analizó la polisemia y los Transformers."
        },
        {
          type: "action",
          title: "Action 1 (Herramienta: Semantic Search)",
          content: "<code>search_transcripts(query='polisemia transformers')</code>"
        },
        {
          type: "observation",
          title: "Observation 1 (Resultado)",
          content: "Match encontrado en Cuaderno 01 — Pep Martorell (Sección 06: 'Transformers y la polisemia'): 'El Transformer calcula la atención de cada palabra con respecto a todas las demás en paralelo'."
        },
        {
          type: "final",
          title: "Final Answer (Solución Agencial)",
          content: "Fue <strong>Pep Martorell</strong> en el <strong>Cuaderno 01 (Arpa Talks)</strong>, quien explicó que el mecanismo de atención paralela de los Transformers permitió resolver la ambigüedad y polisemia del lenguaje que limitaba a las redes recurrentes anteriores."
        }
      ]
    }
  ];

  function initReactAgentVisualizer() {
    const containers = document.querySelectorAll('.react-agent-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      let scenarioIdx = 0;
      let currentStep = 0;
      let autoPlayInterval = null;

      container.innerHTML = `
        <div class="sim-container">
          <div class="sim-header">
            <div class="sim-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12L2.1 12.05"></path><path d="M12 12a10 10 0 0 0 7.07-7.07"></path></svg>
              <span>Simulador de Ciclo Agencial ReAct (Reasoning + Acting)</span>
            </div>
            <span class="sim-badge">Ciclo Thought → Action → Observation → Answer</span>
          </div>

          <div class="sim-controls-grid" style="grid-template-columns: 2fr 1fr; margin-bottom: 1.25rem;">
            <div class="sim-control-group">
              <label>Seleccionar Escenario de Misión Agencial:</label>
              <select id="react-scenario-select" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-medium); padding: 6px 10px; border-radius: var(--radius-sm); width: 100%;">
                ${REACT_SCENARIOS.map((s, idx) => `<option value="${idx}">${s.title}</option>`).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-end;">
              <button class="btn-notes-action" id="btn-react-next" style="flex: 1; height: 38px;">Paso Siguiente ⏭️</button>
              <button class="btn-notes-action" id="btn-react-auto" style="flex: 1; height: 38px;">Auto ▶️</button>
              <button class="btn-notes-action danger" id="btn-react-reset" style="height: 38px;">🔄</button>
            </div>
          </div>

          <!-- Task Card -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--accent-violet);">🎯 Objetivo Asignado al Agente:</span>
            <p id="react-task-text" style="margin: 4px 0 0 0; font-size: 0.95rem; font-weight: 600; color: var(--text-primary);"></p>
          </div>

          <!-- Steps Timeline -->
          <div class="react-timeline" id="react-timeline-list"></div>
        </div>
      `;

      const scenarioSelect = container.querySelector('#react-scenario-select');
      const taskText = container.querySelector('#react-task-text');
      const timelineList = container.querySelector('#react-timeline-list');
      const btnNext = container.querySelector('#btn-react-next');
      const btnAuto = container.querySelector('#btn-react-auto');
      const btnReset = container.querySelector('#btn-react-reset');

      function renderAgentState() {
        const scenario = REACT_SCENARIOS[scenarioIdx];
        taskText.textContent = scenario.task;

        timelineList.innerHTML = '';
        for (let i = 0; i <= currentStep; i++) {
          if (i >= scenario.steps.length) break;
          const step = scenario.steps[i];
          const card = document.createElement('div');
          card.className = `react-step-card ${step.type}`;
          card.innerHTML = `
            <div class="react-step-header">
              <span>${step.title}</span>
              <span>Paso ${i + 1}/${scenario.steps.length}</span>
            </div>
            <div class="react-step-content">${step.content}</div>
          `;
          timelineList.appendChild(card);
        }

        if (currentStep >= scenario.steps.length - 1) {
          btnNext.disabled = true;
          btnNext.textContent = 'Misión Completada ✅';
          if (autoPlayInterval) clearInterval(autoPlayInterval);
        } else {
          btnNext.disabled = false;
          btnNext.textContent = 'Paso Siguiente ⏭️';
        }
      }

      function nextStep() {
        const scenario = REACT_SCENARIOS[scenarioIdx];
        if (currentStep < scenario.steps.length - 1) {
          currentStep++;
          renderAgentState();
        }
      }

      function resetAgent() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        currentStep = 0;
        renderAgentState();
      }

      btnNext.addEventListener('click', nextStep);
      btnReset.addEventListener('click', resetAgent);
      scenarioSelect.addEventListener('change', (e) => {
        scenarioIdx = parseInt(e.target.value);
        resetAgent();
      });

      btnAuto.addEventListener('click', () => {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
          btnAuto.textContent = 'Auto ▶️';
        } else {
          btnAuto.textContent = 'Pausar ⏸️';
          autoPlayInterval = setInterval(() => {
            const scenario = REACT_SCENARIOS[scenarioIdx];
            if (currentStep < scenario.steps.length - 1) {
              nextStep();
            } else {
              clearInterval(autoPlayInterval);
              autoPlayInterval = null;
              btnAuto.textContent = 'Auto ▶️';
            }
          }, 1200);
        }
      });

      renderAgentState();
    });
  }

  // ========================================================
  // 8. RETOS PRÁCTICOS INTERACTIVOS (CHALLENGE MODE)
  // ========================================================
  function initChallenges() {
    const containers = document.querySelectorAll('.challenges-target');
    if (containers.length === 0) return;

    containers.forEach(container => {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          
          <!-- RETO 1: Prompting Estructurado con Guardrails -->
          <div class="challenge-box">
            <div class="challenge-header">
              <h3 class="challenge-title">
                <span>🎯 Reto 1: Metaprompting & Guardrails Estrictos</span>
              </h3>
              <span class="bloom-pill diff-intermediate">100 Puntos · Prompt Engineering</span>
            </div>

            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.5;">
              <strong>Misión:</strong> Escribe un prompt que instruya al modelo a analizar un texto sobre IA y responder <em>estrictamente</em> con un objeto JSON válido con los campos <code>"tema_principal"</code>, <code>"confianza_score"</code> (número del 0 al 1) y <code>"terminos_clave"</code> (array).
              <strong>Restricción:</strong> El modelo NO debe incluir ningún saludo, preámbulo ni bloque markdown de formato fuera del JSON.
            </p>

            <textarea id="challenge-prompt-input" style="width: 100%; min-height: 110px; background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem;" placeholder="Escribe aquí tu prompt de producción con restricciones y roles..."></textarea>

            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <button class="btn-notes-action" id="btn-validate-prompt" style="background: var(--accent-violet); color: #fff; border-color: var(--accent-violet);">
                🚀 Validar Prompt
              </button>
              <button class="btn-notes-action" id="btn-hint-prompt">
                💡 Ver Pista
              </button>
              <span id="prompt-score-badge" style="font-weight: 700; font-size: 0.88rem; color: var(--text-muted);"></span>
            </div>

            <div class="challenge-feedback" id="prompt-feedback-box"></div>
          </div>

          <!-- RETO 2: Dimensionador de VRAM para Presupuesto de 24 GB -->
          <div class="challenge-box">
            <div class="challenge-header">
              <h3 class="challenge-title">
                <span>⚡ Reto 2: Dimensionamiento de VRAM en Hardware Límite</span>
              </h3>
              <span class="bloom-pill diff-advanced">100 Puntos · Arquitectura de Hardware</span>
            </div>

            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.5;">
              <strong>Misión:</strong> Dispones de <strong>1 GPU RTX 4090 de 24 GB</strong>. Quieres desplegar un modelo de <strong>14 Billones de Parámetros</strong> para procesar ventanas de contexto de hasta <strong>8,192 tokens</strong>.
              Selecciona la cuantización y configuración máxima de batch para operar con al menos un 10% de margen de seguridad (VRAM total &le; 21.6 GB).
            </p>

            <div class="sim-controls-grid" style="grid-template-columns: repeat(3, 1fr);">
              <div class="sim-control-group">
                <label>Precisión / Cuantización:</label>
                <select id="vram-ch-bits" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-medium); padding: 6px 10px; border-radius: var(--radius-sm); width: 100%;">
                  <option value="16">FP16 (16 bits)</option>
                  <option value="8">INT8 (8 bits)</option>
                  <option value="4" selected>INT4 (4 bits - GPTQ/AWQ)</option>
                </select>
              </div>
              <div class="sim-control-group">
                <label>Batch Size (Usuarios): <span id="vram-ch-batch-val" style="color: var(--accent-violet); font-weight: bold;">4</span></label>
                <input type="range" id="vram-ch-batch" min="1" max="16" step="1" value="4">
              </div>
              <div class="sim-control-group">
                <label>Contexto (Tokens): <span id="vram-ch-seq-val" style="color: var(--accent-cyan); font-weight: bold;">8,192</span></label>
                <input type="range" id="vram-ch-seq" min="2048" max="16384" step="2048" value="8192">
              </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <button class="btn-notes-action" id="btn-validate-vram" style="background: var(--accent-violet); color: #fff; border-color: var(--accent-violet);">
                📊 Comprobar Viabilidad en 24 GB
              </button>
            </div>

            <div class="challenge-feedback" id="vram-feedback-box"></div>
          </div>

        </div>
      `;

      // Handlers for Reto 1
      const promptInput = container.querySelector('#challenge-prompt-input');
      const btnValidatePrompt = container.querySelector('#btn-validate-prompt');
      const btnHintPrompt = container.querySelector('#btn-hint-prompt');
      const promptFeedback = container.querySelector('#prompt-feedback-box');
      const promptScoreBadge = container.querySelector('#prompt-score-badge');

      btnHintPrompt.addEventListener('click', () => {
        alert('Pista: Usa un metaprompt definiendo el rol de analizador técnico, especifica "Devuelve ÚNICAMENTE un objeto JSON válido sin texto introductorio", e incluye un ejemplo del schema con los campos exactos.');
      });

      btnValidatePrompt.addEventListener('click', () => {
        const text = (promptInput.value || '').toLowerCase();
        let score = 0;
        let checks = [];

        if (text.includes('json')) { score += 25; checks.push('✓ Especifica formato JSON'); } else { checks.push('✗ Falta especificar salida en JSON'); }
        if (text.includes('tema_principal') && text.includes('confianza_score') && text.includes('terminos_clave')) {
          score += 35;
          checks.push('✓ Incluye los 3 campos exactos requeridos');
        } else {
          checks.push('✗ Faltan uno o más campos clave ("tema_principal", "confianza_score", "terminos_clave")');
        }
        if (text.includes('unicamente') || text.includes('solamente') || text.includes('sin explicaciones') || text.includes('sin preambulo') || text.includes('no incluyas') || text.includes('strictly')) {
          score += 25;
          checks.push('✓ Añade guardrails para evitar preámbulos y texto extra');
        } else {
          checks.push('✗ Falta una restricción explícita de "no añadir preámbulos ni texto adicional"');
        }
        if (text.includes('rol') || text.includes('eres un') || text.includes('actua como') || text.includes('experto')) {
          score += 15;
          checks.push('✓ Asigna un rol o contexto sistémico');
        }

        promptScoreBadge.textContent = `Puntuación: ${score}/100`;
        promptFeedback.className = `challenge-feedback ${score >= 70 ? 'success' : 'error'}`;
        promptFeedback.innerHTML = `
          <strong>${score >= 70 ? '🎉 ¡Excelente Metaprompt de Producción!' : '⚠️ Tu prompt necesita ajustes para ser robusto en producción:'}</strong>
          <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 0.85rem;">
            ${checks.map(c => `<li>${c}</li>`).join('')}
          </ul>
        `;
      });

      // Handlers for Reto 2
      const bitsSelect = container.querySelector('#vram-ch-bits');
      const batchSlider = container.querySelector('#vram-ch-batch');
      const batchVal = container.querySelector('#vram-ch-batch-val');
      const seqSlider = container.querySelector('#vram-ch-seq');
      const seqVal = container.querySelector('#vram-ch-seq-val');
      const btnValidateVram = container.querySelector('#btn-validate-vram');
      const vramFeedback = container.querySelector('#vram-feedback-box');

      batchSlider.addEventListener('input', () => { batchVal.textContent = batchSlider.value; });
      seqSlider.addEventListener('input', () => { seqVal.textContent = parseInt(seqSlider.value).toLocaleString(); });

      btnValidateVram.addEventListener('click', () => {
        const bits = parseInt(bitsSelect.value);
        const batch = parseInt(batchSlider.value);
        const seq = parseInt(seqSlider.value);

        const weightGb = (14 * 1e9 * (bits / 8.0)) / (1024**3);
        // 14B model approximation: 40 layers, 40 heads, head_dim 128
        const kvGb = (2 * 40 * 40 * 128 * seq * batch * 2) / (1024**3);
        const totalVram = (weightGb + kvGb) * 1.15; // 15% CUDA overhead

        const isSafe = totalVram <= 21.6; // 90% of 24 GB
        const fitsInGpu = totalVram <= 24.0;

        vramFeedback.className = `challenge-feedback ${isSafe ? 'success' : 'error'}`;
        vramFeedback.innerHTML = `
          <strong>${isSafe ? '✅ ¡Configuración Óptima y Segura!' : fitsInGpu ? '⚠️ Riesgo Alto de OOM (Excede margen seguro)' : '❌ CUDA Out of Memory (OOM)'}</strong>
          <div style="font-size: 0.85rem; margin-top: 6px; line-height: 1.5;">
            • Pesos del Modelo (14B @ ${bits}-bit): <strong>${weightGb.toFixed(2)} GB</strong><br>
            • KV Cache Dinámico (Batch ${batch}, S=${seq.toLocaleString()}): <strong>${kvGb.toFixed(2)} GB</strong><br>
            • Consumo Total Estimado con Overhead CUDA: <strong>${totalVram.toFixed(2)} GB / 24.00 GB</strong>
          </div>
          ${!isSafe ? `<div style="font-size: 0.82rem; margin-top: 6px; color: var(--accent-amber);">💡 Sugerencia: En FP16 los pesos ocupan 26 GB (imposible en 24 GB). En INT4 ocupan ~6.5 GB, permitiendo soportar contextos largos si ajustas el batch size.</div>` : ''}
        `;
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Initialize all interactive visualizers
  initAttentionVisualizer();
  initVramCalculator();
  initEmbeddingVisualizer();
  initTokenizerVisualizer();
  initSamplingVisualizer();
  initRagVisualizer();
  initReactAgentVisualizer();
  initChallenges();
});

