// ============================================
// CURSO IA COMMERCIAL - Flashcards & Spaced Repetition
// Interactive Study Deck for Master Technical Concepts
// ============================================

(function() {
  'use strict';

  const FLASHCARDS_DATA = [
    {
      id: 1,
      category: 'fundamentos',
      categoryLabel: 'Fundamentos & Filosofía',
      cuaderno: 'Cuaderno 01',
      question: '¿Por qué Pep Martorell define a los LLMs como "Superinterpoladores Estadísticos"?',
      answer: 'Porque operan calculando la continuidad probabilística entre puntos de datos existentes en un espacio de alta dimensionalidad (interpolación), en lugar de descubrir principios causales nuevos fuera de su distribución (extrapolación).'
    },
    {
      id: 2,
      category: 'fundamentos',
      categoryLabel: 'Fundamentos & Filosofía',
      cuaderno: 'Cuaderno 01',
      question: '¿Cómo resuelve la arquitectura Transformer el problema de la Polisemia del lenguaje?',
      answer: 'A diferencia de Word2Vec (un vector estático por palabra), la autoatención modula dinámicamente el vector de cada token según el contexto de toda la frase, haciendo que "banco" (financiero) y "banco" (asiento) adquieran representaciones vectoriales distintas.'
    },
    {
      id: 3,
      category: 'prompting',
      categoryLabel: 'Prompting & Cognición',
      cuaderno: 'Cuaderno 02',
      question: '¿Qué es el Metaprompting según Javier Ideami?',
      answer: 'Es el paradigma de utilizar al modelo de lenguaje como arquitecto de prompts, indicándole cómo estructurar instrucciones complejas mediante reglas negativas estrictas, rúbricas de evaluación y variables dinámicas en lugar de escribir prompts planos.'
    },
    {
      id: 4,
      category: 'prompting',
      categoryLabel: 'Prompting & Cognición',
      cuaderno: 'Cuaderno 02',
      question: '¿Por qué la correlación estadística en un LLM no equivale a comprensión causal?',
      answer: 'Los LLMs aprenden covarianzas estadísticas entre tokens $P(w_{t+1}|w_{\\le t})$. Identifican que dos conceptos aparecen juntos, pero carecen de un modelo del mundo físico para discernir si A causa B o si existe una variable de confusión oculta.'
    },
    {
      id: 5,
      category: 'optimizacion',
      categoryLabel: 'Optimización & Matemáticas',
      cuaderno: 'Cuaderno 03',
      question: '¿Por qué el optimizador AdamW supera a Adam clásico en redes profundas?',
      answer: 'Adam clásico acopla incorrectamente el Weight Decay ($L_2$) con las medias móviles del gradiente adaptativo. AdamW desacopla la regularización aplicándola directamente a los pesos ($w_{t+1} = (1 - \\gamma\\lambda)w_t - \\gamma \\hat{m}_t / (\\sqrt{\\hat{v}_t} + \\epsilon)$), mejorando la generalización.'
    },
    {
      id: 6,
      category: 'optimizacion',
      categoryLabel: 'Optimización & Matemáticas',
      cuaderno: 'Cuaderno 03',
      question: '¿Cómo resuelve la Backpropagation el cálculo de derivadas en grafos profundos?',
      answer: 'Aplica la regla de la cadena multivariable de forma recursiva desde la pérdida final hacia atrás, acumulando los jacobianos locales de cada capa para evitar el recálculo exponencial de derivadas.'
    },
    {
      id: 7,
      category: 'inferencia',
      categoryLabel: 'Inferencia & Hardware',
      cuaderno: 'Cuaderno 03',
      question: '¿Qué problema resuelve el KV Cache en la inferencia autorregresiva de LLMs?',
      answer: 'En la fase de generación (decoding), evita recalcular los tensores de Claves (K) y Valores (V) de todos los tokens previos en cada paso, reduciendo la complejidad computacional por token generado de $\\mathcal{O}(N^2)$ a $\\mathcal{O}(1)$ a cambio de memoria VRAM.'
    },
    {
      id: 8,
      category: 'rag',
      categoryLabel: 'RAG & Agentes',
      cuaderno: 'Cuaderno 03',
      question: '¿Cuál es la diferencia fundamental entre RAG vectorial estándar y GraphRAG?',
      answer: 'RAG vectorial busca fragmentos de texto aislados por proximidad semántica (preguntas puntuales). GraphRAG extrae entidades y relaciones en un grafo de conocimiento jerárquico, permitiendo sintetizar respuestas globales sobre colecciones masivas de documentos.'
    },
    {
      id: 9,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: '¿Por qué es indispensable el factor de escala $1/\\sqrt{d_k}$ en la fórmula de Autoatención?',
      answer: 'Porque la varianza del producto escalar de dos vectores $q \\cdot k$ crece linealmente con la dimensión $d_k$. Sin dividir por $\\sqrt{d_k}$, los valores crecen en magnitud y saturan la función softmax, haciendo que sus derivadas se acerquen a cero y desvanezcan los gradientes.'
    },
    {
      id: 10,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: '¿Por qué la arquitectura Transformer aprovecha mejor las GPUs que las RNNs/LSTMs?',
      answer: 'Las RNNs procesan los tokens secuencialmente paso a paso ($h_t = f(h_{t-1}, x_t)$), provocando starvation de hilos CUDA. El Transformer calcula la atención de todos los tokens en paralelo mediante multiplicaciones de matrices masivas (SIMT).'
    },
    {
      id: 11,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: '¿Cuál es la ventaja de Rotary Position Embedding (RoPE) frente a APE (Sinusoidal)?',
      answer: 'RoPE rota las Consultas y Claves con matrices ortogonales en el plano complejo, preservando la norma de los vectores y garantizando que el producto escalar resultante dependa exclusivamente de la distancia relativa $(m - n)$, permitiendo una extrapolación de contexto superior.'
    },
    {
      id: 12,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: '¿Cómo funciona la técnica ALiBi (Attention with Linear Biases)?',
      answer: 'Prescinde de embeddings posicionales y resta una penalización lineal proporcional a la distancia física entre tokens de los scores de atención ($QK^T / \\sqrt{d_k} - m \\cdot d$), permitiendo entrenar con secuencias cortas e inferir con secuencias largas sin pérdida de perplejidad.'
    },
    {
      id: 13,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: 'En Multi-Head Attention (MHA), ¿por qué no explota el coste computacional al usar múltiples cabezas?',
      answer: 'Porque la dimensión por cabeza se reduce exactamente a $d_k = d_v = d_{\\text{model}} / h$. Cada cabeza computa en un subespacio reducido (ej. 64 en vez de 512), manteniendo el coste total equivalente a una sola atención de dimensión completa.'
    },
    {
      id: 14,
      category: 'transformers',
      categoryLabel: 'Arquitectura & Transformers',
      cuaderno: 'Cuaderno 04',
      question: '¿Cuál es la diferencia entre la normalización Post-LN y Pre-LN en Transformers?',
      answer: 'Post-LN normaliza después de la suma residual (más expresiva pero inestable al inicio). Pre-LN normaliza antes de cada subcapa ($x + \\text{Sublayer}(\\text{LayerNorm}(x))$), creando una autopista directa de gradiente que hace el entrenamiento altamente estable sin warm-ups complejos.'
    },
    {
      id: 15,
      category: 'inferencia',
      categoryLabel: 'Inferencia & Hardware',
      cuaderno: 'Cuaderno 04',
      question: '¿En qué se diferencian el muestreo Top-P (Nucleus) y Top-K en la decodificación de LLMs?',
      answer: 'Top-K restringe la selección a los $K$ tokens fijos con mayor probabilidad. Top-P selecciona dinámicamente el conjunto más pequeño de tokens cuya probabilidad acumulada suma al menos $p$ (ej. 0.90), adaptando el abanico según la certeza del modelo.'
    },
    {
      id: 16,
      category: 'fundamentos',
      categoryLabel: 'Fundamentos & Filosofía',
      cuaderno: 'Cuaderno 04',
      question: '¿Qué es el Grounding (Anclaje) y cómo mitiga las alucinaciones en LLMs?',
      answer: 'Es la inyección dinámica de contextos verificables y fácticos (RAG) en el prompt del modelo antes de la inferencia, forzándolo a fundamentar sus respuestas en datos de referencia en lugar de rellenar lagunas estocásticamente.'
    },
    {
      id: 17,
      category: 'fundamentos',
      categoryLabel: 'Fundamentos & Filosofía',
      cuaderno: 'Cuaderno 04',
      question: '¿Qué es un Evaluation Harness (como lm-evaluation-harness)?',
      answer: 'Es un framework estandarizado para evaluar LLMs de forma reproducible frente a baterías científicas independientes como MMLU (conocimiento general), GSM8K (razonamiento matemático), ARC y HellaSwag.'
    },
    {
      id: 18,
      category: 'inferencia',
      categoryLabel: 'Inferencia & Hardware',
      cuaderno: 'Cuaderno 03',
      question: '¿Cómo reduce la cuantización INT4 el consumo de VRAM frente a FP16?',
      answer: 'Almacena cada peso en 4 bits (0.5 bytes) en lugar de 16 bits (2 bytes), reduciendo la huella de memoria en un 75% con pérdidas de precisión y perplejidad casi imperceptibles gracias a métodos como AWQ y GPTQ.'
    },
    {
      id: 19,
      category: 'rag',
      categoryLabel: 'RAG & Agentes',
      cuaderno: 'Cuaderno 03',
      question: '¿Qué es el patrón ReAct en agentes autónomos?',
      answer: 'Es un paradigma cíclico que alterna razonamiento explícito (Thought), invocación de herramientas externas (Action) y lectura de resultados (Observation) para resolver problemas complejos de múltiples pasos.'
    },
    {
      id: 20,
      category: 'optimizacion',
      categoryLabel: 'Optimización & Matemáticas',
      cuaderno: 'Cuaderno 04',
      question: '¿Qué diferencia existe entre el preentrenamiento causal (CLM) y la alineación (RLHF / DPO)?',
      answer: 'El preentrenamiento enseña al modelo el lenguaje y patrones del mundo prediciendo el siguiente token. La alineación ajusta las respuestas para que sean seguras, útiles, veraces y cumplan con las preferencias y directrices éticas humanas.'
    }
  ];

  const STORAGE_KEY = 'curso_ia_flashcards_mastery';

  function initFlashcards() {
    const target = document.querySelector('.flashcards-target');
    if (!target) return;

    let savedMastery = [];
    try {
      savedMastery = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(e) {
      savedMastery = [];
    }

    let activeFilter = 'todos';
    let currentCardIndex = 0;
    let isFlipped = false;
    let filteredCards = [...FLASHCARDS_DATA];

    function filterCards() {
      if (activeFilter === 'todos') {
        filteredCards = [...FLASHCARDS_DATA];
      } else {
        filteredCards = FLASHCARDS_DATA.filter(c => c.category === activeFilter);
      }
      currentCardIndex = 0;
      isFlipped = false;
      render();
    }

    function toggleMastery(cardId) {
      const idx = savedMastery.indexOf(cardId);
      if (idx > -1) {
        savedMastery.splice(idx, 1);
      } else {
        savedMastery.push(cardId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMastery));
      render();
    }

    function nextCard() {
      if (filteredCards.length === 0) return;
      currentCardIndex = (currentCardIndex + 1) % filteredCards.length;
      isFlipped = false;
      render();
    }

    function prevCard() {
      if (filteredCards.length === 0) return;
      currentCardIndex = (currentCardIndex - 1 + filteredCards.length) % filteredCards.length;
      isFlipped = false;
      render();
    }

    function shuffleCards() {
      for (let i = filteredCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredCards[i], filteredCards[j]] = [filteredCards[j], filteredCards[i]];
      }
      currentCardIndex = 0;
      isFlipped = false;
      render();
    }

    function resetProgress() {
      if (confirm('¿Deseas reiniciar el progreso de todas las tarjetas de estudio?')) {
        savedMastery = [];
        localStorage.removeItem(STORAGE_KEY);
        render();
      }
    }

    function render() {
      const totalCards = FLASHCARDS_DATA.length;
      const masteredCount = savedMastery.length;
      const masteredPct = Math.round((masteredCount / totalCards) * 100);

      const currentCard = filteredCards[currentCardIndex];
      const isMastered = currentCard ? savedMastery.includes(currentCard.id) : false;

      target.innerHTML = `
        <div class="fc-container">
          <!-- Header and Mastery Stats -->
          <div class="fc-header">
            <div>
              <h3 class="fc-title">Tarjetas de Repaso Espaciado</h3>
              <p class="fc-subtitle">Domina los 20 conceptos técnicos y matemáticos fundamentales de los 4 cuadernos formativos.</p>
            </div>
            <div class="fc-stats-badge">
              <div class="fc-stats-label">Nivel de Dominio</div>
              <div class="fc-stats-value">${masteredCount} / ${totalCards} (${masteredPct}%)</div>
              <div class="fc-progress-bar-bg">
                <div class="fc-progress-bar-fill" style="width: ${masteredPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Category Filter Chips -->
          <div class="fc-filter-chips">
            <button class="fc-chip ${activeFilter === 'todos' ? 'active' : ''}" data-cat="todos">Todos (${totalCards})</button>
            <button class="fc-chip ${activeFilter === 'fundamentos' ? 'active' : ''}" data-cat="fundamentos">Fundamentos</button>
            <button class="fc-chip ${activeFilter === 'transformers' ? 'active' : ''}" data-cat="transformers">Transformers</button>
            <button class="fc-chip ${activeFilter === 'optimizacion' ? 'active' : ''}" data-cat="optimizacion">Optimización</button>
            <button class="fc-chip ${activeFilter === 'inferencia' ? 'active' : ''}" data-cat="inferencia">Inferencia & Hardware</button>
            <button class="fc-chip ${activeFilter === 'prompting' ? 'active' : ''}" data-cat="prompting">Prompting</button>
            <button class="fc-chip ${activeFilter === 'rag' ? 'active' : ''}" data-cat="rag">RAG & Agentes</button>
          </div>

          ${filteredCards.length === 0 ? `
            <div class="fc-empty">No hay tarjetas para esta categoría.</div>
          ` : `
            <!-- Main Flashcard Scene -->
            <div class="fc-scene">
              <div class="fc-card ${isFlipped ? 'flipped' : ''}" id="fc-main-card">
                <!-- Front Side -->
                <div class="fc-card-face fc-card-front">
                  <div class="fc-card-header">
                    <span class="fc-category-tag">${currentCard.categoryLabel}</span>
                    <span class="fc-cuaderno-tag">${currentCard.cuaderno}</span>
                  </div>
                  <div class="fc-card-body">
                    <div class="fc-question-icon">❓</div>
                    <div class="fc-question-text">${currentCard.question}</div>
                  </div>
                  <div class="fc-card-footer">
                    <span class="fc-hint">Haz clic en la tarjeta para ver la respuesta</span>
                  </div>
                </div>

                <!-- Back Side -->
                <div class="fc-card-face fc-card-back">
                  <div class="fc-card-header">
                    <span class="fc-category-tag">${currentCard.categoryLabel}</span>
                    <span class="fc-badge-answer">Explicación Técnica</span>
                  </div>
                  <div class="fc-card-body">
                    <div class="fc-answer-text">${currentCard.answer}</div>
                  </div>
                  <div class="fc-card-footer">
                    <span class="fc-hint">Haz clic para volver a la pregunta</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation & Actions Bar -->
            <div class="fc-controls-bar">
              <div class="fc-nav-buttons">
                <button class="fc-btn" id="fc-prev-btn" title="Tarjeta anterior">← Anterior</button>
                <span class="fc-counter">${currentCardIndex + 1} de ${filteredCards.length}</span>
                <button class="fc-btn" id="fc-next-btn" title="Siguiente tarjeta">Siguiente →</button>
              </div>

              <div class="fc-action-buttons">
                <button class="fc-btn fc-btn-mastery ${isMastered ? 'is-mastered' : ''}" id="fc-mastery-btn">
                  ${isMastered ? '✓ Dominado' : 'Marcar como Dominado'}
                </button>
                <button class="fc-btn fc-btn-secondary" id="fc-shuffle-btn" title="Barajar tarjetas">🔀 Barajar</button>
                <button class="fc-btn fc-btn-danger" id="fc-reset-btn" title="Reiniciar progreso">↺ Reiniciar</button>
              </div>
            </div>
          `}
        </div>
      `;

      // Attach events
      target.querySelectorAll('.fc-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          activeFilter = btn.getAttribute('data-cat');
          filterCards();
        });
      });

      const cardEl = target.querySelector('#fc-main-card');
      if (cardEl) {
        cardEl.addEventListener('click', () => {
          isFlipped = !isFlipped;
          cardEl.classList.toggle('flipped', isFlipped);
          // Auto-render math in back if flipped
          if (isFlipped && window.renderMathInElement) {
            window.renderMathInElement(cardEl, {
              delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
              ],
              throwOnError: false
            });
          }
        });
      }

      const prevBtn = target.querySelector('#fc-prev-btn');
      if (prevBtn) prevBtn.addEventListener('click', prevCard);

      const nextBtn = target.querySelector('#fc-next-btn');
      if (nextBtn) nextBtn.addEventListener('click', nextCard);

      const masteryBtn = target.querySelector('#fc-mastery-btn');
      if (masteryBtn && currentCard) {
        masteryBtn.addEventListener('click', () => toggleMastery(currentCard.id));
      }

      const shuffleBtn = target.querySelector('#fc-shuffle-btn');
      if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleCards);

      const resetBtn = target.querySelector('#fc-reset-btn');
      if (resetBtn) resetBtn.addEventListener('click', resetProgress);

      // Trigger Math rendering if available
      if (window.renderMathInElement) {
        window.renderMathInElement(target, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      }
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlashcards);
  } else {
    initFlashcards();
  }

})();
