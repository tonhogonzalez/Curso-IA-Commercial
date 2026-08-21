(function(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
})(function() {
    'use strict';

    // Inyectar estilos para los simuladores avanzados
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* Estilos generales para simuladores avanzados */
        .advanced-sim-container {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow-md);
            font-family: var(--font-body);
            color: var(--text-primary);
        }
        
        .sim-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .sim-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .sim-badge {
            background: linear-gradient(135deg, var(--accent-violet), var(--accent-blue));
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        
        .sim-grid {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 1.5rem;
        }
        
        @media (max-width: 900px) {
            .sim-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .sim-controls {
            background-color: var(--bg-card);
            padding: 1.25rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .control-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            display: flex;
            justify-content: space-between;
        }
        
        .control-slider {
            width: 100%;
            accent-color: var(--accent-blue);
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
            font-family: inherit;
        }
        
        .btn-primary {
            background-color: var(--accent-blue);
            color: white;
        }
        
        .btn-primary:hover {
            background-color: var(--accent-violet);
        }
        
        .btn-secondary {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            border: 1px solid var(--border-medium);
        }
        
        .btn-secondary:hover {
            border-color: var(--accent-blue);
            color: var(--accent-blue);
        }

        .btn-row {
            display: flex;
            gap: 0.5rem;
        }
        .btn-row .btn {
            flex: 1;
        }
        
        .sim-display {
            background-color: var(--bg-card);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            min-height: 400px;
        }
        
        .stats-panel {
            margin-top: 1rem;
            background-color: var(--bg-card);
            padding: 1rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
            font-family: var(--font-mono);
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        /* Backprop SVG Specific */
        #backprop-svg {
            width: 100%;
            height: 100%;
            min-height: 400px;
        }
        
        .node {
            fill: var(--bg-surface);
            stroke: var(--border-medium);
            stroke-width: 2;
            transition: all var(--transition-base);
        }
        
        .node-text {
            fill: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 12px;
            text-anchor: middle;
            dominant-baseline: middle;
        }
        
        .edge {
            stroke: var(--border-subtle);
            stroke-width: 2;
            transition: stroke var(--transition-base);
        }
        
        .edge-label {
            fill: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 10px;
            background: var(--bg-card);
        }
        
        .gradient-arrow {
            fill: var(--accent-rose);
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
        
        /* Gradient Descent Canvas Specific */
        .canvas-container {
            position: relative;
            width: 100%;
            height: 400px;
            cursor: crosshair;
        }
        
        #gd-canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        
        .gd-legend {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.25rem;
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        /* Select styling */
        select.sim-select {
            width: 100%;
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            background-color: var(--bg-primary);
            color: var(--text-primary);
            border: 1px solid var(--border-medium);
            font-family: inherit;
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================
    // SIMULADOR 8: Backpropagation Visualizer
    // ==========================================
    const initBackpropVisualizer = () => {
        const targets = document.querySelectorAll('.backprop-visualizer-target');
        if (!targets.length) return;

        targets.forEach(target => {
            target.innerHTML = `
                <div class="advanced-sim-container">
                    <div class="sim-header">
                        <h3 class="sim-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-violet)"><path d="M16 4v6l4 2-4 2v6"/><path d="M8 22v-6l-4-2 4-2V4"/><path d="M2 12h20"/></svg>
                            Retropropagación (Backpropagation)
                        </h3>
                        <span class="sim-badge">Simulador Interactivo</span>
                    </div>
                    
                    <div class="sim-grid">
                        <div class="sim-controls">
                            <div class="control-group">
                                <label class="control-label">
                                    Entrada 1 (x₁)
                                    <span id="bp-x1-val">1.0</span>
                                </label>
                                <input type="range" class="control-slider" id="bp-x1" min="-2" max="2" step="0.1" value="1.0">
                            </div>
                            
                            <div class="control-group">
                                <label class="control-label">
                                    Entrada 2 (x₂)
                                    <span id="bp-x2-val">-1.0</span>
                                </label>
                                <input type="range" class="control-slider" id="bp-x2" min="-2" max="2" step="0.1" value="-1.0">
                            </div>
                            
                            <div class="control-group">
                                <label class="control-label">
                                    Valor Objetivo (y_true)
                                    <span id="bp-y-val">0.8</span>
                                </label>
                                <input type="range" class="control-slider" id="bp-y" min="0" max="1" step="0.05" value="0.8">
                            </div>

                            <hr style="border: 0; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;">

                            <div class="btn-row">
                                <button class="btn btn-primary" id="btn-forward">Paso Hacia Adelante</button>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-primary" id="btn-backward" disabled style="background-color: var(--accent-emerald)">Paso Hacia Atrás (Gradientes)</button>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-secondary" id="btn-update" disabled style="background-color: var(--accent-amber); color: #000;">Actualizar Pesos</button>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-secondary" id="btn-reset-bp">Reiniciar Pesos</button>
                            </div>
                        </div>
                        
                        <div>
                            <div class="sim-display">
                                <svg id="backprop-svg" viewBox="0 0 600 400"></svg>
                            </div>
                            <div class="stats-panel" id="bp-stats">
                                <div>Esperando iniciar...</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Lógica del simulador de backprop
            const svg = target.querySelector('#backprop-svg');
            const btnForward = target.querySelector('#btn-forward');
            const btnBackward = target.querySelector('#btn-backward');
            const btnUpdate = target.querySelector('#btn-update');
            const btnReset = target.querySelector('#btn-reset-bp');
            const inputX1 = target.querySelector('#bp-x1');
            const inputX2 = target.querySelector('#bp-x2');
            const inputY = target.querySelector('#bp-y');
            const stats = target.querySelector('#bp-stats');

            const LEARNING_RATE = 0.5;

            // Estado de la red neuronal
            let nn = {
                inputs: [1.0, -1.0],
                target: 0.8,
                weights: {
                    w1: { val: 0.2, grad: 0, from: 'i1', to: 'h1' },
                    w2: { val: -0.4, grad: 0, from: 'i1', to: 'h2' },
                    w3: { val: 0.5, grad: 0, from: 'i1', to: 'h3' },
                    w4: { val: 0.8, grad: 0, from: 'i2', to: 'h1' },
                    w5: { val: 0.1, grad: 0, from: 'i2', to: 'h2' },
                    w6: { val: -0.3, grad: 0, from: 'i2', to: 'h3' },
                    w7: { val: 0.6, grad: 0, from: 'h1', to: 'o1' },
                    w8: { val: -0.5, grad: 0, from: 'h2', to: 'o1' },
                    w9: { val: 0.4, grad: 0, from: 'h3', to: 'o1' }
                },
                nodes: {
                    i1: { x: 100, y: 150, val: 1.0, type: 'input' },
                    i2: { x: 100, y: 250, val: -1.0, type: 'input' },
                    h1: { x: 300, y: 100, val: 0, raw: 0, delta: 0, type: 'hidden' },
                    h2: { x: 300, y: 200, val: 0, raw: 0, delta: 0, type: 'hidden' },
                    h3: { x: 300, y: 300, val: 0, raw: 0, delta: 0, type: 'hidden' },
                    o1: { x: 500, y: 200, val: 0, raw: 0, delta: 0, type: 'output' }
                },
                loss: 0
            };

            const sigmoid = x => 1 / (1 + Math.exp(-x));
            const sigmoidDeriv = x => sigmoid(x) * (1 - sigmoid(x));

            const initWeights = () => {
                ['w1','w2','w3','w4','w5','w6','w7','w8','w9'].forEach(w => {
                    nn.weights[w].val = (Math.random() * 2 - 1).toFixed(2) * 1;
                    nn.weights[w].grad = 0;
                });
            };

            const drawNetwork = () => {
                svg.innerHTML = ''; // Clear SVG
                
                // Draw edges
                Object.keys(nn.weights).forEach(wKey => {
                    const w = nn.weights[wKey];
                    const fromNode = nn.nodes[w.from];
                    const toNode = nn.nodes[w.to];
                    
                    const color = w.val >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
                    const opacity = Math.min(Math.abs(w.val) + 0.2, 1);
                    
                    svg.innerHTML += `
                        <line class="edge" id="edge-${wKey}" 
                            x1="${fromNode.x}" y1="${fromNode.y}" 
                            x2="${toNode.x}" y2="${toNode.y}" 
                            stroke="${color}" opacity="${opacity}">
                        </line>
                        <text class="edge-label" x="${(fromNode.x + toNode.x)/2}" y="${(fromNode.y + toNode.y)/2 - 10}" 
                            text-anchor="middle" fill="var(--text-secondary)">
                            ${wKey}: ${w.val.toFixed(2)}
                        </text>
                    `;
                });

                // Draw nodes
                Object.keys(nn.nodes).forEach(nKey => {
                    const node = nn.nodes[nKey];
                    const label = nKey.toUpperCase();
                    const val = node.val.toFixed(2);
                    
                    svg.innerHTML += `
                        <circle class="node" id="node-${nKey}" cx="${node.x}" cy="${node.y}" r="25"></circle>
                        <text class="node-text" x="${node.x}" y="${node.y - 5}">${label}</text>
                        <text class="node-text" id="val-${nKey}" x="${node.x}" y="${node.y + 10}" fill="var(--accent-blue)" font-size="10">${val}</text>
                    `;
                });
            };

            const doForwardPass = () => {
                nn.nodes.i1.val = parseFloat(inputX1.value);
                nn.nodes.i2.val = parseFloat(inputX2.value);
                nn.target = parseFloat(inputY.value);

                // Hidden layer
                ['h1', 'h2', 'h3'].forEach(h => {
                    let sum = 0;
                    Object.keys(nn.weights).forEach(wKey => {
                        const w = nn.weights[wKey];
                        if (w.to === h) {
                            sum += nn.nodes[w.from].val * w.val;
                        }
                    });
                    nn.nodes[h].raw = sum;
                    nn.nodes[h].val = sigmoid(sum);
                });

                // Output layer
                let sumOut = 0;
                Object.keys(nn.weights).forEach(wKey => {
                    const w = nn.weights[wKey];
                    if (w.to === 'o1') {
                        sumOut += nn.nodes[w.from].val * w.val;
                    }
                });
                nn.nodes.o1.raw = sumOut;
                nn.nodes.o1.val = sigmoid(sumOut);

                // MSE Loss
                nn.loss = 0.5 * Math.pow(nn.nodes.o1.val - nn.target, 2);

                drawNetwork();
                
                stats.innerHTML = `
                    <div style="color: var(--accent-blue); font-weight: bold;">Paso Hacia Adelante (Forward Pass) Completado</div>
                    <div>Salida de la red: ${nn.nodes.o1.val.toFixed(4)}</div>
                    <div>Objetivo: ${nn.target.toFixed(4)}</div>
                    <div>Pérdida (MSE): ${nn.loss.toFixed(4)}</div>
                `;

                btnForward.disabled = true;
                btnBackward.disabled = false;
                btnUpdate.disabled = true;
            };

            const doBackwardPass = () => {
                // Deltas
                const o1 = nn.nodes.o1;
                // dE/dout = (out - target)
                const dE_dout = (o1.val - nn.target);
                // dout/dnet = sigmoid'(net)
                const dout_dnet = sigmoidDeriv(o1.raw);
                o1.delta = dE_dout * dout_dnet; // dE/dnet_o1

                ['h1', 'h2', 'h3'].forEach(h => {
                    const node = nn.nodes[h];
                    // dE/dh = delta_o1 * w_ho
                    let dE_dh = 0;
                    Object.keys(nn.weights).forEach(wKey => {
                        const w = nn.weights[wKey];
                        if (w.from === h && w.to === 'o1') {
                            dE_dh += o1.delta * w.val;
                        }
                    });
                    node.delta = dE_dh * sigmoidDeriv(node.raw);
                });

                // Calculate gradients
                Object.keys(nn.weights).forEach(wKey => {
                    const w = nn.weights[wKey];
                    const fromNode = nn.nodes[w.from];
                    const toNode = nn.nodes[w.to];
                    w.grad = toNode.delta * fromNode.val;
                });

                drawNetwork();
                // Highlight gradients
                Object.keys(nn.weights).forEach(wKey => {
                    const w = nn.weights[wKey];
                    const fromNode = nn.nodes[w.from];
                    const toNode = nn.nodes[w.to];
                    const gradColor = w.grad > 0 ? '#ef4444' : '#22c55e'; // Red if grad > 0 (will decrease weight), Green if grad < 0
                    
                    svg.innerHTML += `
                        <text class="edge-label" x="${(fromNode.x + toNode.x)/2}" y="${(fromNode.y + toNode.y)/2 + 10}" 
                            text-anchor="middle" fill="${gradColor}" font-weight="bold">
                            ∇: ${w.grad.toFixed(3)}
                        </text>
                    `;
                });

                stats.innerHTML = `
                    <div style="color: var(--accent-emerald); font-weight: bold;">Paso Hacia Atrás (Backward Pass) Completado</div>
                    <div>Error en salida (δ): ${o1.delta.toFixed(4)}</div>
                    <div>Gradientes calculados mediante la Regla de la Cadena.</div>
                    <div style="font-size: 0.8em; margin-top: 0.5rem;">Fórmula: ∂L/∂w = δ_destino × salida_origen</div>
                `;

                btnBackward.disabled = true;
                btnUpdate.disabled = false;
            };

            const updateWeights = () => {
                Object.keys(nn.weights).forEach(wKey => {
                    const w = nn.weights[wKey];
                    w.val = w.val - LEARNING_RATE * w.grad;
                });

                drawNetwork();
                
                stats.innerHTML = `
                    <div style="color: var(--accent-amber); font-weight: bold;">Pesos Actualizados</div>
                    <div>Fórmula: w_nuevo = w_actual - (tasa_aprendizaje × gradiente)</div>
                    <div>Tasa de aprendizaje (η): ${LEARNING_RATE}</div>
                `;

                btnUpdate.disabled = true;
                btnForward.disabled = false;
            };

            // Event Listeners
            inputX1.addEventListener('input', (e) => { target.querySelector('#bp-x1-val').textContent = e.target.value; btnForward.disabled = false; btnBackward.disabled = true; btnUpdate.disabled = true; });
            inputX2.addEventListener('input', (e) => { target.querySelector('#bp-x2-val').textContent = e.target.value; btnForward.disabled = false; btnBackward.disabled = true; btnUpdate.disabled = true; });
            inputY.addEventListener('input', (e) => { target.querySelector('#bp-y-val').textContent = e.target.value; btnForward.disabled = false; btnBackward.disabled = true; btnUpdate.disabled = true; });

            btnForward.addEventListener('click', doForwardPass);
            btnBackward.addEventListener('click', doBackwardPass);
            btnUpdate.addEventListener('click', updateWeights);
            btnReset.addEventListener('click', () => {
                initWeights();
                drawNetwork();
                stats.innerHTML = '<div>Pesos reiniciados. Listo para iniciar.</div>';
                btnForward.disabled = false;
                btnBackward.disabled = true;
                btnUpdate.disabled = true;
            });

            // Initialize
            drawNetwork();
        });
    };

    // ==========================================
    // SIMULADOR 9: Gradient Descent Visualizer
    // ==========================================
    const initGradientDescentVisualizer = () => {
        const targets = document.querySelectorAll('.gradient-descent-target');
        if (!targets.length) return;

        targets.forEach(target => {
            target.innerHTML = `
                <div class="advanced-sim-container">
                    <div class="sim-header">
                        <h3 class="sim-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue)"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            Descenso de Gradiente 2D
                        </h3>
                        <span class="sim-badge">Simulador Interactivo</span>
                    </div>
                    
                    <div class="sim-grid">
                        <div class="sim-controls">
                            <div class="control-group">
                                <label class="control-label">Optimizador</label>
                                <select id="gd-optimizer" class="sim-select">
                                    <option value="sgd">SGD (Descenso de Gradiente Estocástico)</option>
                                    <option value="momentum">SGD + Momentum</option>
                                    <option value="adam" selected>Adam</option>
                                    <option value="adamw">AdamW</option>
                                </select>
                            </div>
                            
                            <div class="control-group">
                                <label class="control-label">
                                    Tasa de Aprendizaje (LR)
                                    <span id="gd-lr-val">0.05</span>
                                </label>
                                <input type="range" class="control-slider" id="gd-lr" min="0.001" max="0.5" step="0.005" value="0.05">
                            </div>
                            
                            <div class="control-group">
                                <label class="control-label">
                                    Momentum (β₁)
                                    <span id="gd-mom-val">0.9</span>
                                </label>
                                <input type="range" class="control-slider" id="gd-mom" min="0.0" max="0.99" step="0.01" value="0.9">
                            </div>

                            <hr style="border: 0; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;">

                            <div class="btn-row">
                                <button class="btn btn-primary" id="btn-gd-run">Ejecutar (1 Optimizador)</button>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-secondary" id="btn-gd-compare" style="background-color: var(--accent-violet); color: white; border: none;">Comparar Todos</button>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-secondary" id="btn-gd-clear">Limpiar</button>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">* Haz clic en el mapa para establecer el punto de inicio.</p>
                        </div>
                        
                        <div>
                            <div class="canvas-container">
                                <canvas id="gd-canvas"></canvas>
                                <div class="gd-legend">
                                    <div class="legend-item"><div class="legend-color" style="background: #3b82f6;"></div> SGD</div>
                                    <div class="legend-item"><div class="legend-color" style="background: #06b6d4;"></div> Momentum</div>
                                    <div class="legend-item"><div class="legend-color" style="background: #8b5cf6;"></div> Adam</div>
                                    <div class="legend-item"><div class="legend-color" style="background: #10b981;"></div> AdamW</div>
                                </div>
                            </div>
                            <div class="stats-panel" id="gd-stats">
                                <div>Posición Inicial: Selecciona en el mapa</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const canvas = target.querySelector('#gd-canvas');
            const ctx = canvas.getContext('2d');
            const container = target.querySelector('.canvas-container');
            
            // Adjust canvas size
            const resizeCanvas = () => {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                drawBackground();
                drawPaths();
            };

            const optimSelect = target.querySelector('#gd-optimizer');
            const lrInput = target.querySelector('#gd-lr');
            const momInput = target.querySelector('#gd-mom');
            const btnRun = target.querySelector('#btn-gd-run');
            const btnCompare = target.querySelector('#btn-gd-compare');
            const btnClear = target.querySelector('#btn-gd-clear');
            const stats = target.querySelector('#gd-stats');

            // Himmelblau's function domain: [-5, 5] x [-5, 5]
            const domain = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
            
            // State
            let startPos = { x: -3, y: -3 }; // Default start
            let paths = []; // Array of { optimizer, points: [{x, y}], color }
            let animationId = null;

            // Math functions
            const f = (x, y) => Math.pow(x*x + y - 11, 2) + Math.pow(x + y*y - 7, 2);
            const df = (x, y) => {
                const dx = 4*x*(x*x + y - 11) + 2*(x + y*y - 7);
                const dy = 2*(x*x + y - 11) + 4*y*(x + y*y - 7);
                return { dx, dy };
            };

            // Mapping coords
            const mapToCanvas = (x, y) => {
                return {
                    cx: ((x - domain.xMin) / (domain.xMax - domain.xMin)) * canvas.width,
                    cy: canvas.height - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * canvas.height
                };
            };
            const mapFromCanvas = (cx, cy) => {
                return {
                    x: domain.xMin + (cx / canvas.width) * (domain.xMax - domain.xMin),
                    y: domain.yMin + ((canvas.height - cy) / canvas.height) * (domain.yMax - domain.yMin)
                };
            };

            // Render contour map
            let bgImageData = null;
            const precomputeBackground = () => {
                bgImageData = ctx.createImageData(canvas.width, canvas.height);
                const data = bgImageData.data;
                
                for(let cy = 0; cy < canvas.height; cy++) {
                    for(let cx = 0; cx < canvas.width; cx++) {
                        const {x, y} = mapFromCanvas(cx, cy);
                        const val = f(x, y);
                        
                        // Map value to color (dark blue to bright yellow)
                        // Log scale for better visibility of minima
                        const normVal = Math.min(Math.log10(val + 1) / 3, 1);
                        
                        const r = Math.floor(normVal * 255);
                        const g = Math.floor(normVal * 150);
                        const b = Math.floor(255 - normVal * 200);
                        
                        const idx = (cy * canvas.width + cx) * 4;
                        data[idx] = r;
                        data[idx+1] = g;
                        data[idx+2] = b;
                        data[idx+3] = 255;
                    }
                }
            };

            const drawBackground = () => {
                if (!bgImageData || bgImageData.width !== canvas.width) {
                    precomputeBackground();
                }
                ctx.putImageData(bgImageData, 0, 0);
                
                // Draw starting point if it exists
                const p = mapToCanvas(startPos.x, startPos.y);
                ctx.beginPath();
                ctx.arc(p.cx, p.cy, 5, 0, Math.PI*2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'black';
                ctx.stroke();
            };

            const drawPaths = () => {
                paths.forEach(pathObj => {
                    if (pathObj.points.length < 2) return;
                    
                    ctx.beginPath();
                    const startP = mapToCanvas(pathObj.points[0].x, pathObj.points[0].y);
                    ctx.moveTo(startP.cx, startP.cy);
                    
                    for(let i=1; i<pathObj.points.length; i++) {
                        const p = mapToCanvas(pathObj.points[i].x, pathObj.points[i].y);
                        ctx.lineTo(p.cx, p.cy);
                    }
                    
                    ctx.strokeStyle = pathObj.color;
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    
                    // Draw end point
                    const last = pathObj.points[pathObj.points.length-1];
                    const lp = mapToCanvas(last.x, last.y);
                    ctx.beginPath();
                    ctx.arc(lp.cx, lp.cy, 4, 0, Math.PI*2);
                    ctx.fillStyle = pathObj.color;
                    ctx.fill();
                    ctx.stroke();
                });
            };

            const optimizersDef = {
                'sgd': { color: '#3b82f6' },       // blue
                'momentum': { color: '#06b6d4' },  // cyan
                'adam': { color: '#8b5cf6' },      // violet
                'adamw': { color: '#10b981' }      // emerald
            };

            // Run simulation
            const runSimulation = (optKeys) => {
                if (animationId) cancelAnimationFrame(animationId);
                
                const lr = parseFloat(lrInput.value);
                const beta1 = parseFloat(momInput.value);
                const beta2 = 0.999;
                const epsilon = 1e-8;
                const weightDecay = 0.01;
                
                paths = optKeys.map(key => ({
                    key,
                    color: optimizersDef[key].color,
                    points: [{x: startPos.x, y: startPos.y}],
                    // Optimizer state
                    x: startPos.x, y: startPos.y,
                    m_x: 0, m_y: 0,
                    v_x: 0, v_y: 0,
                    t: 0
                }));

                const maxSteps = 300;
                let step = 0;

                const animate = () => {
                    if (step >= maxSteps) return;
                    
                    paths.forEach(path => {
                        let {x, y, m_x, m_y, v_x, v_y, t, key} = path;
                        const grads = df(x, y);
                        let {dx, dy} = grads;
                        
                        t++;
                        
                        if (key === 'sgd') {
                            x -= lr * dx;
                            y -= lr * dy;
                        } 
                        else if (key === 'momentum') {
                            m_x = beta1 * m_x + (1 - beta1) * dx;
                            m_y = beta1 * m_y + (1 - beta1) * dy;
                            x -= lr * m_x;
                            y -= lr * m_y;
                        }
                        else if (key === 'adam') {
                            m_x = beta1 * m_x + (1 - beta1) * dx;
                            m_y = beta1 * m_y + (1 - beta1) * dy;
                            v_x = beta2 * v_x + (1 - beta2) * dx*dx;
                            v_y = beta2 * v_y + (1 - beta2) * dy*dy;
                            
                            const m_x_hat = m_x / (1 - Math.pow(beta1, t));
                            const m_y_hat = m_y / (1 - Math.pow(beta1, t));
                            const v_x_hat = v_x / (1 - Math.pow(beta2, t));
                            const v_y_hat = v_y / (1 - Math.pow(beta2, t));
                            
                            x -= lr * m_x_hat / (Math.sqrt(v_x_hat) + epsilon);
                            y -= lr * m_y_hat / (Math.sqrt(v_y_hat) + epsilon);
                        }
                        else if (key === 'adamw') {
                            // Apply weight decay before gradient update in true AdamW fashion
                            x -= lr * weightDecay * x;
                            y -= lr * weightDecay * y;
                            
                            m_x = beta1 * m_x + (1 - beta1) * dx;
                            m_y = beta1 * m_y + (1 - beta1) * dy;
                            v_x = beta2 * v_x + (1 - beta2) * dx*dx;
                            v_y = beta2 * v_y + (1 - beta2) * dy*dy;
                            
                            const m_x_hat = m_x / (1 - Math.pow(beta1, t));
                            const m_y_hat = m_y / (1 - Math.pow(beta1, t));
                            const v_x_hat = v_x / (1 - Math.pow(beta2, t));
                            const v_y_hat = v_y / (1 - Math.pow(beta2, t));
                            
                            x -= lr * m_x_hat / (Math.sqrt(v_x_hat) + epsilon);
                            y -= lr * m_y_hat / (Math.sqrt(v_y_hat) + epsilon);
                        }
                        
                        // Clip to domain just for visual stability if it diverges
                        x = Math.max(domain.xMin - 1, Math.min(domain.xMax + 1, x));
                        y = Math.max(domain.yMin - 1, Math.min(domain.yMax + 1, y));

                        path.x = x; path.y = y;
                        path.m_x = m_x; path.m_y = m_y;
                        path.v_x = v_x; path.v_y = v_y;
                        path.t = t;
                        
                        path.points.push({x, y});
                    });

                    step++;
                    
                    drawBackground();
                    drawPaths();
                    
                    // Update stats with first optimizer
                    const mainPath = paths[0];
                    const currentL = f(mainPath.x, mainPath.y);
                    stats.innerHTML = `
                        <div>Paso: ${step}</div>
                        <div>Pérdida (Loss): ${currentL.toFixed(4)}</div>
                        <div>Posición (x, y): (${mainPath.x.toFixed(2)}, ${mainPath.y.toFixed(2)})</div>
                    `;

                    animationId = requestAnimationFrame(animate);
                };
                
                animate();
            };

            // Event Listeners
            lrInput.addEventListener('input', e => target.querySelector('#gd-lr-val').textContent = e.target.value);
            momInput.addEventListener('input', e => target.querySelector('#gd-mom-val').textContent = e.target.value);
            
            canvas.addEventListener('click', e => {
                const rect = canvas.getBoundingClientRect();
                const cx = e.clientX - rect.left;
                const cy = e.clientY - rect.top;
                startPos = mapFromCanvas(cx, cy);
                paths = [];
                drawBackground();
                stats.innerHTML = `
                    <div>Posición Inicial: (${startPos.x.toFixed(2)}, ${startPos.y.toFixed(2)})</div>
                    <div>Pérdida Inicial: ${f(startPos.x, startPos.y).toFixed(4)}</div>
                `;
            });

            btnRun.addEventListener('click', () => {
                runSimulation([optimSelect.value]);
            });

            btnCompare.addEventListener('click', () => {
                runSimulation(['sgd', 'momentum', 'adam', 'adamw']);
            });
            
            btnClear.addEventListener('click', () => {
                if (animationId) cancelAnimationFrame(animationId);
                paths = [];
                drawBackground();
                stats.innerHTML = '<div>Posición Inicial: Selecciona en el mapa</div>';
            });

            window.addEventListener('resize', resizeCanvas);
            
            // Initial setup
            setTimeout(resizeCanvas, 100);
        });
    };

    // =========================================================================
    // 3. VISUALIZADOR DE RoPE (Rotary Position Embedding)
    // =========================================================================
    const initRopeVisualizer = () => {
        const targets = document.querySelectorAll('.rope-visualizer-target');
        if (targets.length === 0) return;

        const html = `
            <div class="advanced-sim-container" id="rope-sim-wrapper">
                <div class="sim-header">
                    <div class="sim-title">
                        <span>🔄</span> Visualizador de RoPE (Rotary Position Embedding)
                    </div>
                    <span class="sim-badge">LLaMA 3 · Mistral · DeepSeek</span>
                </div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
                    RoPE rota los pares de coordenadas $(q_{2i}, q_{2i+1})$ en el plano complejo con un ángulo $m\\theta_i$. El producto escalar $\\langle R_m q, R_n k \\rangle$ depende únicamente de la distancia relativa $(m - n)$, permitiendo a los LLMs extrapolar longitudes de contexto masivas.
                </p>
                <div class="sim-grid">
                    <div class="sim-controls">
                        <div class="control-group">
                            <label>Posición Query ($m$): <span id="rope-m-val" class="math-preview">2</span></label>
                            <input type="range" id="rope-m-slider" min="0" max="24" value="2" step="1">
                        </div>
                        <div class="control-group">
                            <label>Posición Key ($n$): <span id="rope-n-val" class="math-preview">6</span></label>
                            <input type="range" id="rope-n-slider" min="0" max="24" value="6" step="1">
                        </div>
                        <div class="control-group">
                            <label>Frecuencia Base $\\Theta$: <span id="rope-theta-val" class="math-preview">10,000</span></label>
                            <select id="rope-theta-select" class="ai-select" style="margin-top: 4px;">
                                <option value="10000">10,000 (Original / GPT-NeoX)</option>
                                <option value="500000" selected>500,000 (LLaMA 3 / Long Context)</option>
                                <option value="10000000">10,000,000 (DeepSeek-V3 128K)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Canal del Embedding ($i$): <span id="rope-dim-val" class="math-preview">Canal 0 (Frecuencia Rápida)</span></label>
                            <select id="rope-dim-select" class="ai-select" style="margin-top: 4px;">
                                <option value="0" selected>Par (0, 1) - θ₀ (Alta frecuencia)</option>
                                <option value="1">Par (2, 3) - θ₁ (Media frecuencia)</option>
                                <option value="2">Par (62, 63) - θ_d (Baja frecuencia)</option>
                            </select>
                        </div>
                        <div class="sim-btn-group" style="margin-top: 1rem;">
                            <button id="btn-rope-reset" class="sim-btn" style="background: var(--bg-surface); border: 1px solid var(--border-medium);">Centrar Ángulos</button>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: #0d0f17; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; position: relative;">
                            <canvas id="rope-canvas" width="600" height="340" style="width: 100%; height: 340px; display: block;"></canvas>
                        </div>
                        <div id="rope-metrics" class="sim-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
                            <!-- Injected metrics -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        targets.forEach(target => {
            target.innerHTML = html;

            const mSlider = target.querySelector('#rope-m-slider');
            const nSlider = target.querySelector('#rope-n-slider');
            const thetaSelect = target.querySelector('#rope-theta-select');
            const dimSelect = target.querySelector('#rope-dim-select');
            const mVal = target.querySelector('#rope-m-val');
            const nVal = target.querySelector('#rope-n-val');
            const thetaVal = target.querySelector('#rope-theta-val');
            const dimVal = target.querySelector('#rope-dim-val');
            const metricsEl = target.querySelector('#rope-metrics');
            const canvas = target.querySelector('#rope-canvas');
            const ctx = canvas.getContext('2d');

            // Vector inicial q y k en 2D (magnitud normalizada)
            let q0 = { x: 0.85, y: 0.25 };
            let k0 = { x: 0.70, y: 0.50 };

            function getTheta_i(dimIdx, baseTheta, d = 64) {
                // theta_i = baseTheta ^ (-2i / d)
                return 1.0 / Math.pow(baseTheta, (2 * dimIdx) / d);
            }

            function draw() {
                const m = parseInt(mSlider.value, 10);
                const n = parseInt(nSlider.value, 10);
                const baseTheta = parseFloat(thetaSelect.value);
                const dimIdx = parseInt(dimSelect.value, 10);

                mVal.textContent = m;
                nVal.textContent = n;
                thetaVal.textContent = baseTheta.toLocaleString('es-ES');
                dimVal.textContent = dimSelect.options[dimSelect.selectedIndex].text;

                const theta_i = getTheta_i(dimIdx, baseTheta);
                const angle_m = m * theta_i * 1.5; // Escalado visual para ver rotación
                const angle_n = n * theta_i * 1.5;

                // Rotar vectores: R_m * q = [cos -sin; sin cos] * q
                const q_rot = {
                    x: q0.x * Math.cos(angle_m) - q0.y * Math.sin(angle_m),
                    y: q0.x * Math.sin(angle_m) + q0.y * Math.cos(angle_m)
                };

                const k_rot = {
                    x: k0.x * Math.cos(angle_n) - k0.y * Math.sin(angle_n),
                    y: k0.x * Math.sin(angle_n) + k0.y * Math.cos(angle_n)
                };

                // Producto escalar rotado: <R_m q, R_n k>
                const dotProduct = q_rot.x * k_rot.x + q_rot.y * k_rot.y;
                const relDistance = Math.abs(m - n);
                const relAngle = (angle_m - angle_n);

                // Render Canvas
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h);

                const cx = w / 3;
                const cy = h / 2;
                const r = 110;

                // Círculo unitario y ejes
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx - r - 20, cy);
                ctx.lineTo(cx + r + 20, cy);
                ctx.moveTo(cx, cy - r - 20);
                ctx.lineTo(cx, cy + r + 20);
                ctx.stroke();

                // Vector Query (R_m * q) - Púrpura
                ctx.strokeStyle = '#a855f7';
                ctx.fillStyle = '#a855f7';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + q_rot.x * r, cy - q_rot.y * r);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx + q_rot.x * r, cy - q_rot.y * r, 5, 0, Math.PI * 2);
                ctx.fill();

                // Vector Key (R_n * k) - Cyan
                ctx.strokeStyle = '#06b6d4';
                ctx.fillStyle = '#06b6d4';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + k_rot.x * r, cy - k_rot.y * r);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx + k_rot.x * r, cy - k_rot.y * r, 5, 0, Math.PI * 2);
                ctx.fill();

                // Etiquetas en Canvas
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.fillStyle = '#a855f7';
                ctx.fillText(`R_m·q (Pos ${m})`, cx + q_rot.x * r + 8, cy - q_rot.y * r - 4);

                ctx.fillStyle = '#06b6d4';
                ctx.fillText(`R_n·k (Pos ${n})`, cx + k_rot.x * r + 8, cy - k_rot.y * r + 16);

                // Gráfico lateral: Decaimiento del Producto Escalar vs Distancia Relativa
                const graphX = w * 0.65;
                const graphY = 40;
                const graphW = w * 0.3;
                const graphH = h - 80;

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(graphX, graphY, graphW, graphH);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px Inter, sans-serif';
                ctx.fillText('Atención <R_m q, R_n k> vs Distancia Relativa', graphX, graphY - 10);

                // Curva de atención
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let d = 0; d <= 24; d++) {
                    const simAngle = d * theta_i * 1.5;
                    const simDot = (q0.x * k0.x + q0.y * k0.y) * Math.cos(simAngle);
                    const px = graphX + (d / 24) * graphW;
                    const py = graphY + graphH / 2 - (simDot * (graphH / 2.5));
                    if (d === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();

                // Punto actual en el gráfico
                const curPx = graphX + (relDistance / 24) * graphW;
                const curPy = graphY + graphH / 2 - (dotProduct * (graphH / 2.5));
                ctx.fillStyle = '#f43f5e';
                ctx.beginPath();
                ctx.arc(curPx, curPy, 6, 0, Math.PI * 2);
                ctx.fill();

                // Render metrics
                metricsEl.innerHTML = `
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Distancia Relativa (m - n)</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--text-primary); margin-top: 2px;">${relDistance} tokens</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Ángulo Relativo (Δθ)</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-cyan); margin-top: 2px;">${(relAngle).toFixed(3)} rad</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Producto Escalar RoPE</span>
                        <strong style="display: block; font-size: 1.1rem; color: ${dotProduct >= 0 ? '#10b981' : '#f43f5e'}; margin-top: 2px;">${dotProduct.toFixed(4)}</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Invarianza Traslacional</span>
                        <strong style="display: block; font-size: 1.1rem; color: #a855f7; margin-top: 2px;">100% Relativa</strong>
                    </div>
                `;
            }

            mSlider.addEventListener('input', draw);
            nSlider.addEventListener('input', draw);
            thetaSelect.addEventListener('change', draw);
            dimSelect.addEventListener('change', draw);
            target.querySelector('#btn-rope-reset').addEventListener('click', () => {
                mSlider.value = 4;
                nSlider.value = 4;
                draw();
            });

            draw();
        });
    };

    // =========================================================================
    // 4. SIMULADOR DE MoE (Mixture of Experts & Routing)
    // =========================================================================
    const initMoeRouterVisualizer = () => {
        const targets = document.querySelectorAll('.moe-router-target');
        if (targets.length === 0) return;

        const html = `
            <div class="advanced-sim-container" id="moe-sim-wrapper">
                <div class="sim-header">
                    <div class="sim-title">
                        <span>🔀</span> Simulador de Mixture of Experts (MoE) & Router Gating
                    </div>
                    <span class="sim-badge">DeepSeek-V3 · Mixtral 8x7B</span>
                </div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
                    MoE activa selectivamente solo un subconjunto de expertos (Top-$K$) por cada token mediante una red de Gating $G(x) = \\text{Softmax}(\\text{TopK}(x \\cdot W_g))$. Observa cómo se distribuye la carga computacional y la reducción drástica de parámetros activos.
                </p>
                <div class="sim-grid">
                    <div class="sim-controls">
                        <div class="control-group">
                            <label>Token de Entrada:</label>
                            <select id="moe-token-select" class="ai-select">
                                <option value="math">Token: "Integral(∫ x² dx)" [Matemáticas]</option>
                                <option value="code">Token: "def forward(self, x):" [Código]</option>
                                <option value="lang">Token: "El viento susurra" [Lenguaje/Poesía]</option>
                                <option value="bio">Token: "Estructura AlphaFold" [Biología/Química]</option>
                                <option value="sys">Token: "CUDA_VISIBLE_DEVICES" [Sistemas/GPU]</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Estrategia de Routing (Top-K):</label>
                            <select id="moe-topk-select" class="ai-select">
                                <option value="1">Top-1 (Switch Transformer - Máxima Sparsity)</option>
                                <option value="2" selected>Top-2 (Mixtral / DeepSeek Standard)</option>
                                <option value="4">Top-4 (High Capacity Routing)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Ruido de Gating (Noisy Gating $\\epsilon$): <span id="moe-noise-val" class="math-preview">0.15</span></label>
                            <input type="range" id="moe-noise-slider" min="0" max="1" value="0.15" step="0.05">
                        </div>
                        <div class="sim-btn-group" style="margin-top: 1rem;">
                            <button id="btn-moe-simulate-batch" class="sim-btn sim-btn-primary" style="width: 100%;">⚡ Simular Batch de 100 Tokens</button>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                        <!-- Expert Routing Cards Grid -->
                        <div id="moe-experts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem;">
                            <!-- Injected expert cards -->
                        </div>
                        <!-- Metrics & Loss -->
                        <div id="moe-metrics-panel" class="sim-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem;">
                            <!-- Injected metrics -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        targets.forEach(target => {
            target.innerHTML = html;

            const tokenSelect = target.querySelector('#moe-token-select');
            const topkSelect = target.querySelector('#moe-topk-select');
            const noiseSlider = target.querySelector('#moe-noise-slider');
            const noiseVal = target.querySelector('#moe-noise-val');
            const gridEl = target.querySelector('#moe-experts-grid');
            const metricsEl = target.querySelector('#moe-metrics-panel');
            const btnBatch = target.querySelector('#btn-moe-simulate-batch');

            const experts = [
                { id: 0, name: 'Experto 0: Matemáticas & Cálculo', icon: '📐', baseAffinity: { math: 0.92, code: 0.35, lang: 0.10, bio: 0.40, sys: 0.15 } },
                { id: 1, name: 'Experto 1: Sintaxis & Código', icon: '💻', baseAffinity: { math: 0.45, code: 0.95, lang: 0.15, bio: 0.10, sys: 0.85 } },
                { id: 2, name: 'Experto 2: Semántica & Literatura', icon: '📖', baseAffinity: { math: 0.05, code: 0.10, lang: 0.96, bio: 0.20, sys: 0.05 } },
                { id: 3, name: 'Experto 3: Razonamiento Lógico', icon: '🧠', baseAffinity: { math: 0.85, code: 0.70, lang: 0.60, bio: 0.65, sys: 0.50 } },
                { id: 4, name: 'Experto 4: Bioinformática & Ciencias', icon: '🧬', baseAffinity: { math: 0.40, code: 0.20, lang: 0.25, bio: 0.98, sys: 0.10 } },
                { id: 5, name: 'Experto 5: Inferencia & Sistemas GPU', icon: '⚡', baseAffinity: { math: 0.20, code: 0.75, lang: 0.05, bio: 0.10, sys: 0.97 } },
                { id: 6, name: 'Experto 6: Lingüística Multilingüe', icon: '🌐', baseAffinity: { math: 0.10, code: 0.30, lang: 0.88, bio: 0.15, sys: 0.10 } },
                { id: 7, name: 'Experto 7: General / Heurísticas', icon: '🔮', baseAffinity: { math: 0.50, code: 0.50, lang: 0.50, bio: 0.50, sys: 0.50 } }
            ];

            let batchCounts = new Array(8).fill(12);

            function softmax(arr) {
                const max = Math.max(...arr);
                const exps = arr.map(x => Math.exp(x - max));
                const sum = exps.reduce((a, b) => a + b, 0);
                return exps.map(x => x / sum);
            }

            function updateMoE() {
                const token = tokenSelect.value;
                const topK = parseInt(topkSelect.value, 10);
                const noise = parseFloat(noiseSlider.value);
                noiseVal.textContent = noise.toFixed(2);

                // Calcular gating scores con ruido
                const rawScores = experts.map(exp => {
                    const base = exp.baseAffinity[token] || 0.1;
                    const jitter = (Math.random() - 0.5) * noise * 0.8;
                    return base + jitter;
                });

                const probs = softmax(rawScores);

                // Identificar Top-K
                const indexedProbs = probs.map((p, i) => ({ index: i, prob: p, exp: experts[i] }));
                indexedProbs.sort((a, b) => b.prob - a.prob);

                const activeIndices = new Set(indexedProbs.slice(0, topK).map(item => item.index));

                // Normalizar peso de los Top-K seleccionados
                const topKSum = indexedProbs.slice(0, topK).reduce((acc, item) => acc + item.prob, 0);
                const weightsMap = {};
                indexedProbs.slice(0, topK).forEach(item => {
                    weightsMap[item.index] = (item.prob / topKSum);
                });

                // Render Expert Cards
                gridEl.innerHTML = '';
                experts.forEach(exp => {
                    const isActive = activeIndices.has(exp.id);
                    const weight = weightsMap[exp.id] || 0;
                    const probPercent = Math.round(probs[exp.id] * 100);

                    const card = document.createElement('div');
                    card.style.background = isActive ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface)';
                    card.style.border = isActive ? '2px solid var(--accent-violet)' : '1px solid var(--border-subtle)';
                    card.style.borderRadius = 'var(--radius-md)';
                    card.style.padding = '0.75rem';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.gap = '0.35rem';
                    card.style.boxShadow = isActive ? '0 0 12px rgba(139, 92, 246, 0.3)' : 'none';
                    card.style.transition = 'all 0.2s';

                    card.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 1.2rem;">${exp.icon}</span>
                            <span style="font-size: 0.7rem; font-weight: 700; background: ${isActive ? 'var(--accent-violet)' : 'rgba(255,255,255,0.06)'}; color: #fff; padding: 2px 6px; border-radius: 4px;">
                                ${isActive ? 'ACTIVO' : 'DORMIDO'}
                            </span>
                        </div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-top: 2px;">Exp. ${exp.id}</div>
                        <div style="font-size: 0.72rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${exp.name.split(':')[1]}</div>
                        
                        <!-- Probability bar -->
                        <div style="background: rgba(255,255,255,0.08); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 4px;">
                            <div style="background: ${isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'}; width: ${probPercent}%; height: 100%;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                            <span>Score: ${probPercent}%</span>
                            ${isActive ? `<strong style="color: var(--accent-violet);">${Math.round(weight * 100)}% W</strong>` : ''}
                        </div>
                    `;
                    gridEl.appendChild(card);
                });

                // Calcular Load Balancing Loss: L_aux = alpha * N * sum(f_i * P_i)
                const totalBatch = batchCounts.reduce((a, b) => a + b, 0);
                const f_i = batchCounts.map(c => c / totalBatch);
                const loadLoss = 8 * f_i.reduce((acc, f, i) => acc + f * probs[i], 0);

                const activeParams = (topK * 7.5).toFixed(1);
                const totalParams = (8 * 7.5).toFixed(1);
                const computeSavings = Math.round((1 - (topK / 8)) * 100);

                metricsEl.innerHTML = `
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Parámetros Activos</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-violet); margin-top: 2px;">${activeParams}B / ${totalParams}B</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Ahorro Computacional</span>
                        <strong style="display: block; font-size: 1.1rem; color: #10b981; margin-top: 2px;">-${computeSavings}% FLOPs</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Load Balancing Loss (L_aux)</span>
                        <strong style="display: block; font-size: 1.1rem; color: ${loadLoss < 1.3 ? '#10b981' : '#f59e0b'}; margin-top: 2px;">${loadLoss.toFixed(3)}</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Especialización</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-cyan); margin-top: 2px;">Top-${topK} Gated</strong>
                    </div>
                `;
            }

            tokenSelect.addEventListener('change', updateMoE);
            topkSelect.addEventListener('change', updateMoE);
            noiseSlider.addEventListener('input', updateMoE);

            btnBatch.addEventListener('click', () => {
                // Simula 100 tokens y actualiza el contador de carga
                for (let t = 0; t < 100; t++) {
                    const rIdx = Math.floor(Math.random() * 8);
                    batchCounts[rIdx]++;
                }
                updateMoE();
            });

            updateMoE();
        });
    };

    // =========================================================================
    // 5. COMPARADOR DE VARIANTES DE ATENCIÓN (MHA vs MQA vs GQA)
    // =========================================================================
    const initAttentionVariantsVisualizer = () => {
        const targets = document.querySelectorAll('.attention-variants-target');
        if (targets.length === 0) return;

        const html = `
            <div class="advanced-sim-container" id="attention-variants-wrapper">
                <div class="sim-header">
                    <div class="sim-title">
                        <span>⚡</span> Comparativa de Mecanismos: MHA vs MQA vs GQA
                    </div>
                    <span class="sim-badge">KV Cache & Throughput Optimization</span>
                </div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
                    En inferencia autorregresiva, la memoria GPU está limitada por el <strong>KV Cache</strong>. Compara cómo Multi-Head Attention (MHA), Multi-Query Attention (MQA) y Grouped-Query Attention (GQA) reducen el ancho de banda y multiplican la longitud de contexto.
                </p>
                <div class="sim-grid">
                    <div class="sim-controls">
                        <div class="control-group">
                            <label>Arquitectura de Atención:</label>
                            <select id="attn-arch-select" class="ai-select">
                                <option value="gqa" selected>GQA (Grouped-Query - 32 Q, 8 KV Heads) [LLaMA 3]</option>
                                <option value="mha">MHA (Multi-Head - 32 Q, 32 KV Heads) [Original]</option>
                                <option value="mqa">MQA (Multi-Query - 32 Q, 1 KV Head) [Falcon / StarCoder]</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Longitud de Contexto ($s$): <span id="attn-seq-val" class="math-preview">8,192 tokens</span></label>
                            <input type="range" id="attn-seq-slider" min="1024" max="131072" value="8192" step="1024">
                        </div>
                        <div class="control-group">
                            <label>Batch Size Concurrente ($b$): <span id="attn-batch-val" class="math-preview">4</span></label>
                            <input type="range" id="attn-batch-slider" min="1" max="32" value="4" step="1">
                        </div>
                        <div class="control-group">
                            <label>Precisión KV Cache:</label>
                            <select id="attn-dtype-select" class="ai-select">
                                <option value="2" selected>FP16 / BF16 (2 Bytes por valor)</option>
                                <option value="1">FP8 / INT8 (1 Byte por valor)</option>
                                <option value="0.5">INT4 KV Cache (0.5 Bytes por valor)</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Canvas / Graphic Diagram of Q, K, V Head grouping -->
                        <div style="background: #0d0f17; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
                            <canvas id="attn-diagram-canvas" width="600" height="220" style="width: 100%; height: 220px; display: block;"></canvas>
                        </div>
                        <!-- Metrics & VRAM Estimation -->
                        <div id="attn-metrics-panel" class="sim-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
                            <!-- Injected metrics -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        targets.forEach(target => {
            target.innerHTML = html;

            const archSelect = target.querySelector('#attn-arch-select');
            const seqSlider = target.querySelector('#attn-seq-slider');
            const batchSlider = target.querySelector('#attn-batch-slider');
            const dtypeSelect = target.querySelector('#attn-dtype-select');
            const seqVal = target.querySelector('#attn-seq-val');
            const batchVal = target.querySelector('#attn-batch-val');
            const metricsEl = target.querySelector('#attn-metrics-panel');
            const canvas = target.querySelector('#attn-diagram-canvas');
            const ctx = canvas.getContext('2d');

            function renderDiagram() {
                const arch = archSelect.value;
                const seqLen = parseInt(seqSlider.value, 10);
                const batch = parseInt(batchSlider.value, 10);
                const bytesPerVal = parseFloat(dtypeSelect.value);

                seqVal.textContent = `${seqLen.toLocaleString('es-ES')} tokens`;
                batchVal.textContent = batch;

                const numQHeads = 32;
                let numKVHeads = 32;
                let archLabel = 'MHA';
                if (arch === 'gqa') {
                    numKVHeads = 8;
                    archLabel = 'GQA (4x grupos)';
                } else if (arch === 'mqa') {
                    numKVHeads = 1;
                    archLabel = 'MQA (1 KV Head)';
                }

                // Cálculo exacto de KV Cache: 2 * b * s * L * h_kv * d_k * bytes
                const L = 32; // 32 capas (modelo 8B estándar)
                const d_k = 128;
                const kvBytes = 2 * batch * seqLen * L * numKVHeads * d_k * bytesPerVal;
                const kvGB = (kvBytes / (1024 ** 3));
                const baselineBytes = 2 * batch * seqLen * L * 32 * d_k * bytesPerVal;
                const savingsPct = Math.round((1 - (kvBytes / baselineBytes)) * 100);

                // Dibujar diagrama esquemático en Canvas
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h);

                ctx.fillStyle = '#f8fafc';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.fillText(`Topología: ${archLabel} — (32 Query Heads → ${numKVHeads} Key/Value Heads)`, 20, 25);

                const topY = 60;
                const botY = 165;
                const blockW = (w - 40) / 32;

                // Dibujar 32 Query Heads
                for (let i = 0; i < 32; i++) {
                    const x = 20 + i * blockW;
                    ctx.fillStyle = '#a855f7';
                    ctx.fillRect(x + 1, topY, blockW - 2, 28);
                }

                ctx.fillStyle = '#c084fc';
                ctx.font = '10px Inter, sans-serif';
                ctx.fillText('32 Query Heads (Q₁ ... Q₃₂)', 20, topY + 42);

                // Dibujar Key/Value Heads y líneas de agrupación
                if (arch === 'mha') {
                    for (let i = 0; i < 32; i++) {
                        const x = 20 + i * blockW;
                        ctx.fillStyle = '#06b6d4';
                        ctx.fillRect(x + 1, botY, blockW - 2, 28);
                        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                        ctx.beginPath();
                        ctx.moveTo(x + blockW / 2, topY + 28);
                        ctx.lineTo(x + blockW / 2, botY);
                        ctx.stroke();
                    }
                    ctx.fillText('32 Key/Value Heads dedicadas (1 a 1)', 20, botY + 42);
                } else if (arch === 'gqa') {
                    const groupW = blockW * 4;
                    for (let g = 0; g < 8; g++) {
                        const gx = 20 + g * groupW;
                        ctx.fillStyle = '#06b6d4';
                        ctx.fillRect(gx + 2, botY, groupW - 4, 28);

                        // Líneas de los 4 Q hacia este KV
                        ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
                        for (let q = 0; q < 4; q++) {
                            const qx = gx + q * blockW + blockW / 2;
                            ctx.beginPath();
                            ctx.moveTo(qx, topY + 28);
                            ctx.lineTo(gx + groupW / 2, botY);
                            ctx.stroke();
                        }
                    }
                    ctx.fillText('8 Key/Value Heads compartidas (Grupos de 4 Q)', 20, botY + 42);
                } else if (arch === 'mqa') {
                    const totalW = w - 40;
                    ctx.fillStyle = '#06b6d4';
                    ctx.fillRect(20, botY, totalW, 28);

                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
                    for (let i = 0; i < 32; i++) {
                        const qx = 20 + i * blockW + blockW / 2;
                        ctx.beginPath();
                        ctx.moveTo(qx, topY + 28);
                        ctx.lineTo(w / 2, botY);
                        ctx.stroke();
                    }
                    ctx.fillText('1 Única Key/Value Head compartida para todas las 32 Q', 20, botY + 42);
                }

                // Render metrics
                metricsEl.innerHTML = `
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Memoria KV Cache</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-cyan); margin-top: 2px;">${kvGB >= 1 ? kvGB.toFixed(2) + ' GB' : (kvGB * 1024).toFixed(0) + ' MB'}</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Ahorro de VRAM vs MHA</span>
                        <strong style="display: block; font-size: 1.1rem; color: #10b981; margin-top: 2px;">-${savingsPct}% Memoria</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Throughput Estimado</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-violet); margin-top: 2px;">${(32 / numKVHeads).toFixed(1)}x Tokens/s</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Longitud Máxima Soportada</span>
                        <strong style="display: block; font-size: 1.1rem; color: #38bdf8; margin-top: 2px;">${(seqLen / 1024).toFixed(0)}K Tokens</strong>
                    </div>
                `;
            }

            archSelect.addEventListener('change', renderDiagram);
            seqSlider.addEventListener('input', renderDiagram);
            batchSlider.addEventListener('input', renderDiagram);
            dtypeSelect.addEventListener('change', renderDiagram);

            renderDiagram();
        });
    };

    // =========================================================================
    // 6. SIMULADOR DE LoRA & QLoRA (Low-Rank Adaptation)
    // =========================================================================
    const initLoraVisualizer = () => {
        const targets = document.querySelectorAll('.lora-visualizer-target');
        if (targets.length === 0) return;

        const html = `
            <div class="advanced-sim-container" id="lora-sim-wrapper">
                <div class="sim-header">
                    <div class="sim-title">
                        <span>🧩</span> Descomposición Matricial LoRA & QLoRA
                    </div>
                    <span class="sim-badge">Fine-Tuning Eficiente de LLMs</span>
                </div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
                    LoRA mantiene congelada la matriz de pesos original $W_0 \\in \\mathbb{R}^{d \\times k}$ y entrena únicamente dos matrices de bajo rango $B \\in \\mathbb{R}^{d \\times r}$ y $A \\in \\mathbb{R}^{r \\times k}$ con un factor de escala $\\frac{\\alpha}{r}$.
                </p>
                <div class="sim-grid">
                    <div class="sim-controls">
                        <div class="control-group">
                            <label>Dimensión de la Capa ($d = k$):</label>
                            <select id="lora-dim-select" class="ai-select">
                                <option value="4096" selected>4096 × 4096 (LLaMA 3 8B - Attention Proj)</option>
                                <option value="8192">8192 × 8192 (LLaMA 3 70B - Proyección)</option>
                                <option value="2048">2048 × 2048 (Modelo Compacto 2B)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Rango Intrínsico ($r$): <span id="lora-rank-val" class="math-preview">8</span></label>
                            <input type="range" id="lora-rank-slider" min="1" max="64" value="8" step="1">
                        </div>
                        <div class="control-group">
                            <label>Escalado Alpha ($\\alpha$): <span id="lora-alpha-val" class="math-preview">16</span></label>
                            <input type="range" id="lora-alpha-slider" min="1" max="64" value="16" step="1">
                        </div>
                        <div class="control-group">
                            <label>Técnica de Cuantización Base:</label>
                            <select id="lora-quant-select" class="ai-select">
                                <option value="fp16" selected>LoRA Estándar (Pesos base en FP16 - 16 bits)</option>
                                <option value="qlora">QLoRA (Pesos base cuantizados a NF4 - 4 bits)</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Matrix Visualization Diagram -->
                        <div style="background: #0d0f17; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
                                <!-- W0 Matrix -->
                                <div style="text-align: center;">
                                    <div id="lora-w0-box" style="width: 130px; height: 130px; background: rgba(148, 163, 184, 0.15); border: 2px dashed #64748b; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-weight: 700; font-size: 0.95rem;">
                                        W₀ [Congelado]
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;" id="lora-w0-dims">4096 × 4096</span>
                                </div>

                                <span style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">+</span>

                                <!-- Scale Factor -->
                                <div style="text-align: center; font-family: var(--font-mono); font-size: 1rem; color: var(--accent-cyan);" id="lora-scale-label">
                                    (α/r = 2.0) ×
                                </div>

                                <!-- B Matrix -->
                                <div style="text-align: center;">
                                    <div id="lora-b-box" style="width: 28px; height: 130px; background: rgba(168, 85, 247, 0.25); border: 2px solid var(--accent-violet); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #c084fc; font-weight: 700; font-size: 0.8rem; writing-mode: vertical-rl;">
                                        B (d×r)
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;" id="lora-b-dims">4096×8</span>
                                </div>

                                <span style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">×</span>

                                <!-- A Matrix -->
                                <div style="text-align: center;">
                                    <div id="lora-a-box" style="width: 130px; height: 28px; background: rgba(6, 182, 212, 0.25); border: 2px solid var(--accent-cyan); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-weight: 700; font-size: 0.8rem;">
                                        A (r×k)
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;" id="lora-a-dims">8×4096</span>
                                </div>
                            </div>
                        </div>
                        <!-- Metrics & Savings -->
                        <div id="lora-metrics-panel" class="sim-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
                            <!-- Injected metrics -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        targets.forEach(target => {
            target.innerHTML = html;

            const dimSelect = target.querySelector('#lora-dim-select');
            const rankSlider = target.querySelector('#lora-rank-slider');
            const alphaSlider = target.querySelector('#lora-alpha-slider');
            const quantSelect = target.querySelector('#lora-quant-select');
            const rankVal = target.querySelector('#lora-rank-val');
            const alphaVal = target.querySelector('#lora-alpha-val');
            const scaleLabel = target.querySelector('#lora-scale-label');
            const bDims = target.querySelector('#lora-b-dims');
            const aDims = target.querySelector('#lora-a-dims');
            const w0Dims = target.querySelector('#lora-w0-dims');
            const bBox = target.querySelector('#lora-b-box');
            const aBox = target.querySelector('#lora-a-box');
            const metricsEl = target.querySelector('#lora-metrics-panel');

            function updateLoRA() {
                const d = parseInt(dimSelect.value, 10);
                const r = parseInt(rankSlider.value, 10);
                const alpha = parseInt(alphaSlider.value, 10);
                const quant = quantSelect.value;

                rankVal.textContent = r;
                alphaVal.textContent = alpha;
                scaleLabel.textContent = `(α/r = ${(alpha / r).toFixed(2)}) ×`;

                w0Dims.textContent = `${d} × ${d}`;
                bDims.textContent = `${d} × ${r}`;
                aDims.textContent = `${r} × ${d}`;

                // Dynamic width scaling for visual feedback
                const bWidth = Math.max(16, Math.min(60, r * 1.5));
                bBox.style.width = `${bWidth}px`;
                aBox.style.height = `${bWidth}px`;

                const fullParams = d * d;
                const loraParams = 2 * d * r;
                const trainablePct = ((loraParams / fullParams) * 100).toFixed(3);
                const reductionPct = (100 - parseFloat(trainablePct)).toFixed(2);

                // GPU VRAM for training estimate (FP16 full vs LoRA/QLoRA)
                let baseVramGB = (fullParams * (quant === 'qlora' ? 0.5 : 2)) / (1024 ** 3);
                let adapterVramMB = (loraParams * 4 * 3) / (1024 ** 2); // 3x for weights, gradients, optimizer AdamW

                metricsEl.innerHTML = `
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Parámetros Entrenables</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-violet); margin-top: 2px;">${(loraParams / 1000).toFixed(1)}K (${trainablePct}%)</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Reducción de Gradientes</span>
                        <strong style="display: block; font-size: 1.1rem; color: #10b981; margin-top: 2px;">-${reductionPct}%</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Memoria de Adaptadores</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--accent-cyan); margin-top: 2px;">${adapterVramMB.toFixed(1)} MB</strong>
                    </div>
                    <div style="background: var(--bg-surface); padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Requisito GPU Entrenamiento</span>
                        <strong style="display: block; font-size: 1.1rem; color: #f59e0b; margin-top: 2px;">${quant === 'qlora' ? 'GPU 8GB-12GB (Consumo)' : 'GPU 16GB-24GB'}</strong>
                    </div>
                `;
            }

            dimSelect.addEventListener('change', updateLoRA);
            rankSlider.addEventListener('input', updateLoRA);
            alphaSlider.addEventListener('input', updateLoRA);
            quantSelect.addEventListener('change', updateLoRA);

            updateLoRA();
        });
    };

    // Inicializar todo
    initBackpropVisualizer();
    initGradientDescentVisualizer();
    initRopeVisualizer();
    initMoeRouterVisualizer();
    initAttentionVariantsVisualizer();
    initLoraVisualizer();

});
