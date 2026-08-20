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

    // Inicializar todo
    initBackpropVisualizer();
    initGradientDescentVisualizer();

});
