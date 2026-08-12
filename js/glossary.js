/**
 * Glossary Tooltip System
 * Detects technical terms and displays a tooltip on hover.
 */

(function() {
  const dictionary = {
    "kv cache": "Memoria temporal (Key-Value) en Transformers que evita recalcular tokens previos, acelerando la inferencia exponencialmente.",
    "rag": "Retrieval-Augmented Generation. Técnica que permite a un modelo buscar información externa en una base de datos antes de generar una respuesta.",
    "graphrag": "Evolución de RAG que utiliza grafos de conocimiento para conectar conceptos, mejorando respuestas complejas que requieren síntesis global.",
    "adamw": "Algoritmo de optimización avanzado que ajusta los pesos de la red neuronal durante el entrenamiento, previniendo el sobreajuste (weight decay).",
    "transformers": "Arquitectura de red neuronal (2017) basada en mecanismos de atención que revolucionó el procesamiento de lenguaje natural y la IA generativa.",
    "transformer": "Arquitectura de red neuronal (2017) basada en mecanismos de atención que revolucionó el procesamiento de lenguaje natural.",
    "token": "La unidad básica de información que procesa un modelo (puede ser una palabra entera, sílabas o un solo carácter).",
    "inferencia": "La fase operativa donde un modelo de IA ya entrenado se utiliza para generar respuestas (outputs) a partir de nuevos datos (prompts).",
    "sgd": "Descenso de Gradiente Estocástico. Algoritmo matemático para actualizar parámetros iterativamente minimizando la función de pérdida.",
    "self-attention": "Mecanismo que permite a un modelo sopesar la importancia de cada palabra respecto al resto de la frase simultáneamente, capturando el contexto global.",
    "autoatención": "Mecanismo que permite a un modelo sopesar la importancia de cada palabra respecto al resto de la frase simultáneamente, capturando el contexto global.",
    "prompting": "El arte y la técnica de diseñar las entradas (prompts) óptimas para obtener la mejor respuesta posible de un modelo de IA.",
    "llm": "Large Language Model (Gran Modelo de Lenguaje). Modelo de IA entrenado con cantidades masivas de texto capaz de entender y generar lenguaje natural.",
    "gpu": "Unidad de Procesamiento Gráfico. Chip especializado originalmente para gráficos, ahora fundamental para acelerar los cálculos matemáticos masivos de la IA.",
    "fine-tuning": "Ajuste fino. Proceso de entrenar adicionalmente un modelo ya preentrenado con un conjunto de datos específico para especializarlo en una tarea.",
    "rlhf": "Reinforcement Learning from Human Feedback. Técnica para alinear el comportamiento de un modelo con los valores humanos, premiando respuestas útiles y seguras.",
    "agi": "Inteligencia Artificial General. Nivel teórico de IA en el que un sistema puede comprender, aprender y aplicar conocimientos de forma indistinguible o superior a un ser humano.",
    "prompt": "Instrucción o texto de entrada que se proporciona a un modelo de lenguaje para que genere una respuesta.",
    "alucinación": "Fenómeno donde un modelo de lenguaje genera información falsa, inventada o sin sentido, presentándola como un hecho real.",
    "deep learning": "Aprendizaje Profundo. Subcampo del machine learning basado en redes neuronales artificiales con múltiples capas (profundas).",
    "machine learning": "Aprendizaje Automático. Rama de la IA que se enfoca en desarrollar algoritmos que permiten a los ordenadores aprender patrones a partir de datos.",
    "parámetros": "Los 'pesos' internos o conexiones de una red neuronal que se ajustan durante el entrenamiento. A mayor número de parámetros, mayor suele ser la capacidad del modelo.",
    "zero-shot": "Capacidad de un modelo para realizar una tarea correctamente sin haber recibido ejemplos previos en el prompt.",
    "few-shot": "Técnica de dar a un modelo unos pocos ejemplos (shots) en el prompt para guiarlo a realizar una tarea con el formato y tono deseados.",
    "embeddings": "Representación matemática (vectores numéricos) de palabras o conceptos, donde conceptos similares están cercanos en un espacio multidimensional.",
    "ventana de contexto": "El límite de texto (en tokens) que un modelo puede 'recordar' o procesar en una sola interacción.",
    "alineamiento": "El proceso de asegurar que los objetivos, valores y comportamientos de una IA coincidan con las intenciones y principios éticos humanos."
  };

  // Compile dictionary keys into a regex for fast searching
  // Sort by length descending to match longer terms first (e.g. "Self-Attention" before "Attention")
  const terms = Object.keys(dictionary).sort((a, b) => b.length - a.length);
  const regexPattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

  let tooltipEl = null;

  function initGlossary() {
    // 1. Create Tooltip DOM Element
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'glossary-tooltip';
    document.body.appendChild(tooltipEl);

    // 2. Scan content and replace terms
    const targetAreas = document.querySelectorAll('.transcript-text, .concept-card, .quote-block, .ep-desc');
    
    targetAreas.forEach(area => {
      // Use TreeWalker to only parse Text Nodes (avoiding messing up HTML tags)
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        // Skip text nodes inside already processed spans, script tags, code blocks, or links
        const parentTag = node.parentNode.tagName.toLowerCase();
        if (parentTag !== 'script' && parentTag !== 'style' && parentTag !== 'code' && parentTag !== 'pre' && parentTag !== 'a' && !node.parentNode.classList.contains('glossary-term')) {
          // Reset lastIndex for global regex before testing
          regexPattern.lastIndex = 0;
          if (node.nodeValue.trim().length > 0 && regexPattern.test(node.nodeValue)) {
            textNodes.push(node);
          }
        }
      }

      // Replace text nodes with HTML wrapped elements
      textNodes.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(regexPattern, (match) => {
          const key = match.toLowerCase();
          if (dictionary[key]) {
            return `<span class="glossary-term" data-term="${key}">${match}</span>`;
          }
          return match; // fallback
        });
        textNode.parentNode.replaceChild(span, textNode);
        
        // Unwrap the helper span, keeping only the inner content
        while (span.firstChild) {
          span.parentNode.insertBefore(span.firstChild, span);
        }
        span.parentNode.removeChild(span);
      });
    });

    // 3. Setup Hover Interactions (Event Delegation)
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.classList && e.target.classList.contains('glossary-term')) {
        const term = e.target.getAttribute('data-term');
        const definition = dictionary[term];
        const originalText = e.target.innerText;
        
        if (definition) {
          tooltipEl.innerHTML = `<strong>${originalText}</strong><span>${definition}</span>`;
          
          // Position calculation for position: fixed
          const rect = e.target.getBoundingClientRect();
          let top = rect.bottom + 10;
          let left = rect.left;
          
          // Adjust if tooltip goes off right edge
          if (left + 320 > window.innerWidth) {
            left = window.innerWidth - 340;
          }
          
          tooltipEl.style.top = top + 'px';
          tooltipEl.style.left = left + 'px';
          tooltipEl.classList.add('visible');
        }
      }
    });

    document.body.addEventListener('mouseout', (e) => {
      if (e.target.classList && e.target.classList.contains('glossary-term')) {
        tooltipEl.classList.remove('visible');
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    (function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })( initGlossary);
  } else {
    initGlossary();
  }

  // Export dictionary globally for the Recursos page
  window.GLOSSARY_DICT = dictionary;

})();
