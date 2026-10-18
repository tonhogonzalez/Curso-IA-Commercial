/**
 * Glossary Tooltip System
 * Detects technical, AI, M365 Copilot, Databricks/Visual Engineering, and Commercial Banking terms
 * and displays an interactive tooltip on hover across all notebooks and index pages.
 */

(function() {
  const dictionary = {
    // 1. Fundamentos IA, Matemáticas & Arquitecturas LLM (C1 - C5)
    "kv cache": "Memoria temporal (Key-Value) en Transformers que almacena tensores K y V previos para evitar recalcular tokens, acelerando la inferencia de O(N²) a O(N).",
    "rag": "Retrieval-Augmented Generation. Arquitectura que recupera documentos verificados de una base vectorial o índice externo antes de generar la respuesta del LLM.",
    "graphrag": "Evolución de RAG que estructura el conocimiento en grafos de entidades y relaciones para responder consultas globales y multi-salto.",
    "adamw": "Optimizador estándar para entrenar LLMs que desacopla el decaimiento de pesos (weight decay) de los momentos adaptativos del gradiente.",
    "transformers": "Arquitectura de red neuronal (Vaswani et al., 2017) basada en mecanismos de autoatención paralela que sustenta toda la IA generativa moderna.",
    "transformer": "Arquitectura de red neuronal (2017) basada en mecanismos de autoatención que revolucionó el procesamiento de lenguaje natural y multimodal.",
    "token": "Unidad mínima de información procesada por un LLM (aprox. 0,75 palabras en inglés o 2-3 caracteres en español mediante Byte-Pair Encoding).",
    "bpe": "Byte-Pair Encoding. Algoritmo de tokenización sub-palabra que comprime secuencias frecuentes de bytes en un vocabulario fijo libre de tokens desconocidos.",
    "inferencia": "Fase operativa en producción donde un modelo ya entrenado calcula probabilidades y genera tokens de salida a partir de un prompt.",
    "sgd": "Descenso de Gradiente Estocástico. Algoritmo de optimización que actualiza los parámetros en dirección opuesta al gradiente de la pérdida.",
    "autodiff": "Diferenciación Automática Reversa. Motor matemático que construye un grafo computacional dinámico para calcular gradientes exactos vía regla de la cadena.",
    "backpropagation": "Retropropagación del error desde la función de pérdida hacia las capas iniciales para ajustar los pesos sinápticos de la red neuronal.",
    "self-attention": "Mecanismo que proyecta tokens en vectores Query, Key y Value (softmax(QKᵀ/√dₖ)V) para ponderar la relevancia contextual de cada palabra con todas las demás.",
    "autoatención": "Mecanismo que permite a un modelo sopesar la importancia de cada token respecto al resto de la secuencia simultáneamente.",
    "pre-ln": "Arquitectura de normalización previa al bloque de atención (x + SubLayer(LN(x))) que preserva la autopista del gradiente y estabiliza el entrenamiento profundo.",
    "post-ln": "Diseño original del Transformer donde la normalización se aplica después de la suma residual, propenso a explosión de gradientes sin warmup.",
    "prompting": "Ingeniería de instrucciones y estructuración de contexto para condicionar la distribución de probabilidad de un modelo generativo.",
    "llm": "Large Language Model (Gran Modelo de Lenguaje). Red neuronal autorregresiva entrenada a gran escala para predecir y razonar sobre lenguaje y código.",
    "gpu": "Unidad de Procesamiento Gráfico. Acelerador masivamente paralelo con Tensor Cores indispensable para multiplicaciones matriciales en IA.",
    "fine-tuning": "Ajuste fino supervisado (SFT o LoRA) de un modelo base preentrenado sobre datos de dominio específico para adaptar su estilo o capacidades.",
    "rlhf": "Reinforcement Learning from Human Feedback. Fase post-entrenamiento que alinea el modelo con preferencias humanas de utilidad y seguridad.",
    "agi": "Inteligencia Artificial General. Sistema con capacidad cognitiva transversal equiparable o superior a la humana en cualquier disciplina intelectual.",
    "prompt": "Contexto e instrucción de entrada que condiciona la generación autorregresiva de un modelo de IA.",
    "alucinación": "Generación plausible en forma pero factualmente falsa producida cuando el modelo interpola estadísticamente sin anclaje documental (grounding).",
    "grounding": "Anclaje Epistémico. Vinculación estricta de las afirmaciones del modelo a fuentes de datos verificables mediante citas y recuperación en tiempo real.",
    "deep learning": "Aprendizaje Profundo. Subcampo del Machine Learning basado en redes neuronales multicapa capaces de aprender representaciones jerárquicas.",
    "machine learning": "Aprendizaje Automático. Disciplina de la IA cuyos algoritmos extraen patrones estadísticos y predictivos a partir de datos sin reglas explícitas.",
    "parámetros": "Pesos matriciales internos de una red neuronal ajustados durante el entrenamiento que codifican el conocimiento comprimido del modelo.",
    "zero-shot": "Capacidad de un modelo para resolver una tarea directamente a partir de la instrucción sin incluir ejemplos demostrativos en el prompt.",
    "few-shot": "Inclusión de entre 2 y 5 pares de ejemplo (entrada → salida ideal) dentro del prompt para fijar formato, criterio analítico y tono.",
    "chain-of-thought": "Cadena de Pensamiento (CoT). Técnica que induce al modelo a descomponer un problema complejo en pasos intermedios explícitos antes de dar la conclusión.",
    "embeddings": "Vectores densos en un espacio continuo de alta dimensión donde la cercanía geométrica (similitud coseno) refleja proximidad semántica.",
    "ventana de contexto": "Capacidad máxima de tokens (p. ej. 128k o 1M de tokens) que el modelo puede atender simultáneamente en una sola llamada de inferencia.",
    "alineamiento": "Conjunto de técnicas (SFT, RLHF, DPO, Constitutional AI) para garantizar que el modelo sea veraz, seguro y fiel a la intención del usuario.",

    // 2. M365 Copilot, Agentes & Productividad Bancaria (C6 - C7)
    "framework ocfe": "Estándar de prompting corporativo para M365 Copilot: Objetivo + Contexto (archivos/datos) + Fuente + Expectativa de formato de salida.",
    "ocfe": "Fórmula de prompting empresarial en M365 Copilot: Objetivo, Contexto, Fuente documental y Expectativa de salida.",
    "copilot studio": "Plataforma de Microsoft 365 para diseñar agentes declarativos y flujos autónomos conectados a SharePoint, Dataverse y APIs corporativas.",
    "shadow testing": "Despliegue en sombra: validación de un agente IA en paralelo al proceso humano real sin impacto en cliente hasta certificar su precisión.",
    "work iq": "Capa de inteligencia organizacional sobre Microsoft Graph que conecta correos, reuniones, documentos y flujos de trabajo del empleado.",

    // 3. Ingeniería Visual, Databricks, Python & VS Code (C8 - C9)
    "databricks": "Plataforma unificada de analítica y Lakehouse basada en Apache Spark donde se procesan grandes volúmenes de datos bancarios y digitales con PySpark.",
    "pyspark": "Interfaz de Python para Apache Spark que permite agregar millones de registros distribuidos y empaquetar payloads JSON ligeros para dashboards HTML.",
    "apache echarts": "Motor de visualización declarativa en JavaScript con soporte de WebGL/Canvas, gráficos conectados (echarts.connect), Sankey, Parallel Coordinates y universalTransition.",
    "echarts": "Motor gráfico declarativo de alto rendimiento ideal para dashboards HTML ejecutivos con cross-filtering, dataZoom y transiciones morfodinámicas.",
    "paceui": "Estética de ingeniería visual de precisión: fondos multicapa por luminancia, bordes hairline de 1px semitransparentes y tipografía tabular sin sombras difusas.",
    "tabular-nums": "Propiedad tipográfica CSS (font-variant-numeric: tabular-nums) que fuerza ancho idéntico en todos los dígitos para evitar temblores visuales en tablas y KPIs.",
    "sankey": "Diagrama de flujos proporcionales ideal para visualizar migración de ratings crediticios (Stage 1 → 2 → 3) o embudos de conversión digital.",
    "cadenas de markov": "Modelo probabilístico estocástico que calcula el efecto de remoción de cada canal o estado para atribución multicanal y matrices de transición de riesgo.",
    "xlsxwriter": "Motor Python para generar libros Excel (.xlsx) institucionales con formato matricial corporativo, fórmulas dinámicas y gráficos nativos desde Databricks.",

    // 4. Banca Comercial, Riesgo de Crédito & Rentabilidad (C6 / C9)
    "rorwa": "Return on Risk-Weighted Assets (Beneficio Neto / RWA). Métrica reina en Banca de Empresas que mide el retorno generado por cada unidad de capital regulatorio consumido.",
    "raroc": "Risk-Adjusted Return on Capital ((Ingresos − Costes − Pérdida Esperada) / Capital Económico). Rentabilidad ajustada al riesgo frente al Hurdle Rate del banco.",
    "eva": "Economic Value Added. Valor económico neto creado por un cliente o cartera una vez deducido el coste del capital regulatorio (Beneficio Neto − Capital × CoE).",
    "hurdle rate": "Rentabilidad mínima exigida por el consejo del banco (Cost of Equity, típicamente 11%–13%) a partir de la cual una operación comercial crea valor económico (EVA > 0).",
    "ftp": "Funds Transfer Pricing (Precio de Transferencia de Fondos). Tasa interna de tesorería que separa el margen comercial de activo y pasivo del riesgo de tipos de interés.",
    "nim": "Net Interest Margin (Margen de Intereses Neto / Activos Medios). Diferencial financiero entre el rendimiento del crédito y el coste de financiación.",
    "confirming": "Reverse Factoring / Financiación de cadena de suministro: el banco gestiona los pagos a proveedores de un comprador corporativo ofreciendo anticipo de facturas.",
    "factoring": "Cesión de cartera de cuentas por cobrar comerciales donde la empresa anticipa liquidez sobre sus facturas (con recurso o sin recurso de insolvencia).",
    "stp": "Straight-Through Processing. Tasa de operaciones o admisiones de crédito procesadas 100% de extremo a extremo de forma automática sin intervención manual.",
    "ead": "Exposure at Default. Exposición crediticia total estimada (saldo dispuesto + CCF × disponible no dispuesto) en el momento de un eventual incumplimiento.",
    "pd": "Probability of Default. Probabilidad estadística a 12 meses (Stage 1) o Lifetime (Stage 2/3) de que un acreditado incurra en impago (>90 días o Unlikely to Pay).",
    "lgd": "Loss Given Default (Severidad). Porcentaje de la exposición (EAD) que el banco pierde efectivamente tras ejecutar garantías reales y procesos de recobro.",
    "cor": "Cost of Risk (Coste del Riesgo en puntos básicos: Dotaciones de Insolvencia Anualizadas / Crédito Medio). Mide el consumo del margen por deterioro crediticio.",
    "npl": "Non-Performing Loans (Activos Dudosos en Stage 3). Ratio de morosidad calculado como exposición dudosa dividida entre el crédito bruto total.",
    "ifrs 9": "Normativa contable internacional de provisiones por pérdida esperada en 3 estadios: Stage 1 (normal), Stage 2 (aumento significativo de riesgo SICR) y Stage 3 (dudoso).",
    "cet1": "Common Equity Tier 1. Ratio de capital de máxima calidad regulatoria (Capital Ordinario Nivel 1 / RWA) que determina la solvencia de la entidad financiera.",
    "rwa": "Risk-Weighted Assets (Activos Ponderados por Riesgo). Denominador regulatorio de solvencia calculado según la exposición, probabilidad de impago y garantías.",
    "ebitda": "Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones; indicador central de generación de caja operativa del acreditado empresarial.",
    "dscr": "Debt Service Coverage Ratio (Flujo de Caja Operativo / Servicio de la Deuda Anual). Mide la holgura de la empresa para repagar principal e intereses."
  };

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Sort by length descending to match longer compound terms first
  const terms = Object.keys(dictionary).sort((a, b) => b.length - a.length);
  const regexPattern = new RegExp(`\\b(${terms.map(escapeRegExp).join('|')})\\b`, 'gi');

  let tooltipEl = null;

  function initGlossary() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'glossary-tooltip';
    document.body.appendChild(tooltipEl);

    const targetAreas = document.querySelectorAll('.transcript-text, .concept-card, .quote-block, .ep-desc, .c9-text');

    targetAreas.forEach(area => {
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        const parent = node.parentNode;
        if (!parent || !parent.tagName) continue;
        const parentTag = parent.tagName.toLowerCase();
        if (
          parentTag !== 'script' &&
          parentTag !== 'style' &&
          parentTag !== 'code' &&
          parentTag !== 'pre' &&
          parentTag !== 'a' &&
          parentTag !== 'button' &&
          !parent.classList.contains('glossary-term')
        ) {
          regexPattern.lastIndex = 0;
          if (node.nodeValue.trim().length > 0 && regexPattern.test(node.nodeValue)) {
            textNodes.push(node);
          }
        }
      }

      textNodes.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(regexPattern, (match) => {
          const key = match.toLowerCase();
          if (dictionary[key]) {
            return `<span class="glossary-term" data-term="${key}">${match}</span>`;
          }
          return match;
        });
        textNode.parentNode.replaceChild(span, textNode);

        while (span.firstChild) {
          span.parentNode.insertBefore(span.firstChild, span);
        }
        span.parentNode.removeChild(span);
      });
    });

    document.body.addEventListener('mouseover', (e) => {
      if (e.target.classList && e.target.classList.contains('glossary-term')) {
        const term = e.target.getAttribute('data-term');
        const definition = dictionary[term];
        const originalText = e.target.innerText;

        if (definition) {
          tooltipEl.innerHTML = `<strong>${originalText}</strong><span>${definition}</span>`;

          const rect = e.target.getBoundingClientRect();
          let top = rect.bottom + 10;
          let left = rect.left;

          if (left + 320 > window.innerWidth) {
            left = Math.max(12, window.innerWidth - 340);
          }
          if (top + 130 > window.innerHeight) {
            top = Math.max(12, rect.top - 115);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossary);
  } else {
    initGlossary();
  }

  window.GLOSSARY_DICT = dictionary;
})();
