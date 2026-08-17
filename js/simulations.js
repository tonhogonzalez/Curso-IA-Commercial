/**
 * CURSO IA COMMERCIAL - Interactive AI Simulations
 * 1. Self-Attention Mechanism Interactive Visualizer
 * 2. LLM VRAM & KV Cache Memory Calculator
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
  const PRESET_PHRASES = [
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
    
    // Generate synthetic attention scores mimicking self-attention
    for (let i = 0; i < n; i++) {
      const row = [];
      let sum = 0;
      for (let j = 0; j < n; j++) {
        // Higher weight for self, adjacent tokens, and semantically coupled tokens
        let dist = Math.abs(i - j);
        let score = Math.exp(-dist * 0.45);
        if (i === j) score *= 1.8;
        
        // Artificial coupling between key words
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
      // Softmax normalize
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
      let selectedTokenIdx = 1; // Default to second token

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

      // Render preset buttons
      PRESET_PHRASES.forEach((p, idx) => {
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
        const phrase = PRESET_PHRASES[currentPhraseIdx].text;
        const tokens = phrase.split(' ');
        const matrix = computeSimulatedAttention(tokens);

        if (selectedTokenIdx >= tokens.length) selectedTokenIdx = 0;

        // Render Tokens
        wordsGrid.innerHTML = '';
        tokens.forEach((tok, idx) => {
          const weight = matrix[selectedTokenIdx][idx];
          const tokenEl = document.createElement('div');
          tokenEl.className = `att-token ${idx === selectedTokenIdx ? 'selected' : ''}`;
          
          // Background intensity based on attention
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

        // Render Heatmap Matrix Table
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

        // 1. Model Weights Memory (GB)
        const bytesPerParam = bits / 8;
        const weightsGB = paramsB * bytesPerParam;

        // 2. KV Cache Memory (GB)
        const layers = paramsB <= 8 ? 32 : paramsB <= 32 ? 64 : 80;
        const kvHeads = paramsB <= 8 ? 8 : paramsB <= 32 ? 8 : 8;
        const headDim = 128;
        const bytesPerElem = 2; // KV Cache is usually stored in FP16 or FP8
        const kvBytesPerToken = 2 * layers * kvHeads * headDim * bytesPerElem;
        const kvGB = (kvBytesPerToken * ctx * batch) / (1024 * 1024 * 1024);

        // 3. CUDA Overheads & Activation Buffers (~15% base buffer + 0.8GB base runtime)
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

        // GPU Recommendations
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

  // Run initializers
  initAttentionVisualizer();
  initVramCalculator();
});
