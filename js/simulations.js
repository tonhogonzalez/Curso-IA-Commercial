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
});
