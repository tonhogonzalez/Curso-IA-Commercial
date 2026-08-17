/**
 * CURSO IA COMMERCIAL - Interactive Quiz Engine
 * Pedagogical quizzes for self-assessment at the end of each notebook.
 */

(function(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
})(function() {
  'use strict';

  const QUIZ_DATA = {
    "01-pep-martorell": [
      {
        question: "¿Por qué la arquitectura Transformer supuso una revolución sobre las redes recurrentes (RNN)?",
        options: [
          "Porque procesa todos los tokens en paralelo y calcula atención global cruzada, resolviendo la polisemia gracias a todo el contexto circundante.",
          "Porque elimina por completo la necesidad de usar memoria GPU durante el preentrenamiento.",
          "Porque funciona mediante reglas lógicas deterministas programadas por ingenieros."
        ],
        correct: 0,
        explanation: "Los Transformers sustituyeron la secuencialidad lenta de las RNNs por mecanismos de Self-Attention altamente paralelizables en GPUs, capturando relaciones complejas de largo alcance y resolviendo la ambigüedad del lenguaje."
      },
      {
        question: "Según Pep Martorell, ¿por qué la IA actúa como un 'superinterpolador estadístico'?",
        options: [
          "Porque realiza deducciones causales directas idénticas al razonamiento biológico humano.",
          "Porque predice y sintetiza navegando dentro del espacio multidimensional de datos donde fue entrenada, sin inventar leyes físicas de la nada.",
          "Porque comprime tablas relacionales SQL sin pérdida de precisión."
        ],
        correct: 1,
        explanation: "La IA no posee un modelo mental causal intrínseco del mundo; es un extraordinario sistema de interpolación matemática que encuentra correlaciones extremadamente sutiles en espacios de millones de dimensiones."
      },
      {
        question: "¿Cuál es la diferencia operativa clave entre el software tradicional y los sistemas basados en IA?",
        options: [
          "El software tradicional es determinista y predecible; los modelos de IA son probabilísticos y estocásticos.",
          "El software clásico requiere hardware cuántico y la IA solo servidores convencionales.",
          "El software tradicional falla con frecuencia de sintaxis mientras que la IA nunca se equivoca."
        ],
        correct: 0,
        explanation: "El software tradicional sigue flujos deterministas ($A \\rightarrow B$). La IA calcula distribuciones de probabilidad sobre el siguiente token, introduciendo variabilidad, creatividad y la necesidad de validación constante."
      }
    ],

    "02-javier-ideami": [
      {
        question: "¿Cuál es la diferencia crítica entre Correlación y Causalidad según Javier Ideami?",
        options: [
          "La correlación solo ocurre en visión artificial, mientras que la causalidad es exclusiva de los LLMs.",
          "La correlación detecta que dos variables varían juntas estadísticamente; la causalidad comprende el mecanismo estructural que produce el efecto.",
          "No existe ninguna diferencia; con suficientes datos toda correlación se convierte en causalidad."
        ],
        correct: 1,
        explanation: "Como explica Ideami citando a Judea Pearl, los modelos actuales son maestros de la correlación estadística en el Nivel 1 de la escalera causal, pero no razonan de forma nativa sobre intervenciones (¿qué pasaría si...?) ni contrafácticos (Nivel 3)."
      },
      {
        question: "¿En qué consiste la técnica de 'Metaprompting' recomendada para tareas complejas?",
        options: [
          "En pedirle al propio modelo de lenguaje que diseñe, optimice y estruture el prompt y los criterios de evaluación antes de ejecutar la tarea.",
          "En escribir prompts muy breves de una sola palabra para ahorrar dinero.",
          "En evitar darle instrucciones al modelo para no sesgar su creatividad."
        ],
        correct: 0,
        explanation: "El metaprompting utiliza la propia capacidad de razonamiento del LLM como arquitecto del prompt, definiendo roles, restricciones, formatos y rúbricas de autocorrección antes de generar la respuesta final."
      },
      {
        question: "¿Por qué es crucial entrenar la 'musculatura cognitiva' en la era de la IA?",
        options: [
          "Para no atrofiar el pensamiento crítico y ser capaces de auditar, cuestionar y verificar con rigor las respuestas generadas por los modelos.",
          "Porque los humanos dejaremos de programar en 2026 y solo se necesitará velocidad de lectura.",
          "Porque la IA solo responderá a usuarios que posean certificaciones universitarias."
        ],
        correct: 0,
        explanation: "Si delegamos ciegamente la síntesis y el razonamiento sin ejercitar la cognición propia, perdemos la capacidad de detectar alucinaciones y sesgos sutiles en sistemas cada vez más persuasivos."
      }
    ],

    "03-compendio-tecnico": [
      {
        question: "¿Cuál es el propósito fundamental del KV Cache durante la inferencia de un LLM?",
        options: [
          "Comprimir el modelo a 1 bit por parámetro para que quepa en un teléfono.",
          "Almacenar en VRAM los tensores de Claves (K) y Valores (V) de los tokens previos para evitar recalcularlos en cada paso autoregresivo.",
          "Entrenar los pesos del modelo en tiempo real mientras el usuario escribe."
        ],
        correct: 1,
        explanation: "En la generación token por token, el KV Cache transforma la complejidad de recálculo de $O(N^2)$ a $O(1)$ por token nuevo, acelerando drásticamente la velocidad de generación a cambio de memoria VRAM."
      },
      {
        question: "¿Qué ventaja diferencial introduce el optimizador AdamW frente a Adam estándar?",
        options: [
          "Desacopla el decaimiento de pesos (Weight Decay) de la actualización basada en gradientes adaptativos, mejorando la generalización.",
          "Elimina el uso de matrices de atención en la red.",
          "Multiplica por 10 la tasa de aprendizaje sin riesgo de divergencia."
        ],
        correct: 0,
        explanation: "Ilya Loshchilov y Frank Hutter demostraron que en Adam clásico el weight decay se escala erróneamente con las medias de los gradientes. AdamW aplica la regularización $L_2$ directamente sobre los pesos, logrando un entrenamiento más estable y con mejor generalización."
      },
      {
        question: "En sistemas RAG, ¿qué valor diferencial aporta GraphRAG frente a la búsqueda vectorial convencional?",
        options: [
          "No necesita ningún modelo de embeddings ni base de datos.",
          "Construye grafos de conocimiento jerárquicos que conectan entidades, facilitando la síntesis temática global sobre grandes colecciones de documentos.",
          "Garantiza un 100% de precisión matemática en operaciones aritméticas complejas."
        ],
        correct: 1,
        explanation: "Mientras que el RAG vectorial clásico recupera fragmentos aislados por similitud semántica (búsqueda puntual), GraphRAG agrupa comunidades temáticas y sintetiza resúmenes cruzados entre múltiples documentos interconectados."
      }
    ]
  };

  function initQuizzes() {
    const pageId = window.location.pathname.split('/').pop().replace('.html', '');
    const questions = QUIZ_DATA[pageId];
    if (!questions) return;

    const targets = document.querySelectorAll('.quiz-target');
    if (targets.length === 0) return;

    const storageKey = `quiz_${pageId}`;
    let savedState = {};
    try {
      savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch(e) {
      savedState = {};
    }

    targets.forEach(container => {
      container.innerHTML = `
        <div class="quiz-section">
          <div class="quiz-header">
            <span class="sim-badge" style="margin-bottom: 0.5rem; display: inline-block;">Autoevaluación Pedagógica</span>
            <h3>Comprueba tu Aprendizaje</h3>
            <p>Pon a prueba los conceptos clave tratados en este cuaderno con retroalimentación inmediata.</p>
          </div>
          <div class="quiz-cards-container"></div>
          <div style="text-align: center; margin-top: 1.5rem;">
            <button id="quiz-reset-btn" class="tool-btn" style="display: none;">Reiniciar Cuestionario</button>
          </div>
        </div>
      `;

      const cardsContainer = container.querySelector('.quiz-cards-container');
      const resetBtn = container.querySelector('#quiz-reset-btn');

      function renderQuestions() {
        cardsContainer.innerHTML = '';
        let answeredCount = 0;
        let correctCount = 0;

        questions.forEach((q, qIdx) => {
          const card = document.createElement('div');
          card.className = 'quiz-card';
          
          const isAnswered = savedState[qIdx] !== undefined;
          const userChoice = savedState[qIdx];
          const isCorrect = userChoice === q.correct;

          if (isAnswered) {
            answeredCount++;
            if (isCorrect) {
              correctCount++;
              card.classList.add('answered-correct');
            } else {
              card.classList.add('answered-wrong');
            }
          }

          let optionsHtml = '';
          q.options.forEach((opt, optIdx) => {
            let extraClass = '';
            if (isAnswered) {
              extraClass += ' disabled';
              if (optIdx === q.correct) extraClass += ' correct';
              else if (optIdx === userChoice) extraClass += ' incorrect';
            }

            optionsHtml += `
              <button class="quiz-opt${extraClass}" data-q="${qIdx}" data-opt="${optIdx}">
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-violet);">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${opt}</span>
              </button>
            `;
          });

          let feedbackHtml = '';
          if (isAnswered) {
            feedbackHtml = `
              <div class="quiz-feedback visible ${isCorrect ? 'correct' : 'wrong'}">
                <strong>${isCorrect ? '✓ ¡Correcto!' : '✗ Respuesta incorrecta.'}</strong>
                <p style="margin-top: 4px;">${q.explanation}</p>
              </div>
            `;
          }

          card.innerHTML = `
            <div class="quiz-question">
              <span class="quiz-question-num">0${qIdx + 1}.</span>
              <span>${q.question}</span>
            </div>
            <div class="quiz-options">
              ${optionsHtml}
            </div>
            ${feedbackHtml}
          `;

          // Bind option clicks
          if (!isAnswered) {
            card.querySelectorAll('.quiz-opt').forEach(btn => {
              btn.addEventListener('click', () => {
                const optIdx = parseInt(btn.getAttribute('data-opt'));
                savedState[qIdx] = optIdx;
                localStorage.setItem(storageKey, JSON.stringify(savedState));
                renderQuestions();
              });
            });
          }

          cardsContainer.appendChild(card);
        });

        if (answeredCount > 0) {
          resetBtn.style.display = 'inline-flex';
          resetBtn.textContent = `Reiniciar Cuestionario (${correctCount}/${questions.length} correctas)`;
        } else {
          resetBtn.style.display = 'none';
        }
      }

      resetBtn.addEventListener('click', () => {
        savedState = {};
        localStorage.removeItem(storageKey);
        renderQuestions();
      });

      renderQuestions();
    });
  }

  initQuizzes();
});
