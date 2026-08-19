// Data Store de las 50 Preguntas del Examen de Certificación Técnica: IA Generativa Avanzada
const EXAM_DATA = {
  title: "Examen de Certificación Técnica: IA Generativa Avanzada",
  subtitle: "Evaluación de Nivel de Maestría sobre Algoritmos, Optimización, Inferencia y Arquitecturas",
  passingScore: 75, // 75% para aprobar
  totalQuestions: 50,
  modules: [
    { id: 1, name: "M1: Paradigmas y Computación", range: [1, 3] },
    { id: 2, name: "M2: Optimización Paramétrica del Error", range: [4, 8] },
    { id: 3, name: "M3: Algoritmos de Optimización de Gradiente", range: [9, 14] },
    { id: 4, name: "M4: Arquitecturas y Espacios de Representación", range: [15, 20] },
    { id: 5, name: "M5: La Revolución del Transformer", range: [21, 26] },
    { id: 6, name: "M6: El Paradigma GPT e Inferencia", range: [27, 32] },
    { id: 7, name: "M7: Grounding y Evaluation Harness", range: [33, 37] },
    { id: 8, name: "M8: Inferencia Eficiente en LLMs", range: [38, 42] },
    { id: 9, name: "M9: Recuperación de Información Avanzada (RAG & GraphRAG)", range: [43, 46] },
    { id: 10, name: "M10: Sistemas y Flujos Agenciales", range: [47, 50] }
  ],
  questions: [
    // --- MÓDULO 1: PARADIGMAS Y COMPUTACIÓN ---
    {
      id: 1,
      module: 1,
      moduleName: "Paradigmas y Computación",
      question: "¿Cuál es la diferencia fundamental entre el paradigma de la Máquina de Turing clásica y el Machine Learning conexionista?",
      options: [
        "Turing procesa información en paralelo de forma probabilística, mientras que el conexionismo es estrictamente secuencial y determinista.",
        "Turing requiere que el programador humano defina explícitamente las reglas lógicas (if-then-else) para transformar entradas en salidas; el conexionismo ajusta parámetros continuos (pesos y sesgos) para aproximar de forma autónoma una función de mapeo basada en datos.",
        "El conexionismo no puede actuar como aproximador universal de funciones continuas, limitándose a reglas binarias discretas.",
        "No existe diferencia matemática, ya que ambos operan exclusivamente mediante el álgebra lineal de primer orden sobre espacios vectoriales densos."
      ],
      correct: 1,
      justification: "La algoritmia tradicional procesa datos basándose en instrucciones deterministas diseñadas manualmente. El Machine Learning conexionista optimiza parámetros numéricos continuos utilizando datos de entrada y salida para aproximar de forma probabilística una función de mapeo universal."
    },
    {
      id: 2,
      module: 1,
      moduleName: "Paradigmas y Computación",
      question: "En la minería de reglas de asociación, ¿qué establece la propiedad monótona de la poda en el algoritmo Apriori?",
      options: [
        "Si un conjunto de elementos es frecuente, todos sus superconjuntos también deben ser frecuentes.",
        "Si un conjunto de elementos es infrecuente, todos sus subconjuntos también deben ser frecuentes.",
        "Si un conjunto de elementos es frecuente, todos sus subconjuntos también deben ser frecuentes; recíprocamente, si un conjunto es infrecuente, todos sus superconjuntos son infrecuentes y pueden podarse.",
        "La frecuencia de un conjunto de elementos se calcula multiplicando el soporte por el lift cuadrático del conjunto de tamaño k-1."
      ],
      correct: 2,
      justification: "El principio monótono de Apriori dicta que un conjunto de elementos solo puede ser frecuente si todos sus subconjuntos lo son. Esto permite podar el espacio de búsqueda de superconjuntos infrecuentes sin necesidad de escanear la base de datos de manera redundante."
    },
    {
      id: 3,
      module: 1,
      moduleName: "Paradigmas y Computación",
      question: "¿Cómo optimiza el algoritmo de Recuento Dinámico de Conjuntos de Elementos (DIC) el cuello de botella de lecturas (I/O) de Apriori?",
      options: [
        "Almacenando la base de datos en un solo bloque binario comprimido mediante codificación Huffman de 2 bits.",
        "Dividiendo la base de datos en múltiples bloques o intervalos de transacciones, lo que permite añadir de forma asíncrona conjuntos de elementos candidatos en puntos de control intermedios a lo largo de una sola pasada.",
        "Eliminando por completo el concepto de soporte y operando únicamente bajo el cálculo del lift asintótico.",
        "Forzando al hardware a procesar las transacciones de forma secuencial síncrona sin utilizar la memoria VRAM de la GPU."
      ],
      correct: 1,
      justification: "Mientras que Apriori requiere k pasadas completas sobre la base de datos para conjuntos de tamaño k, DIC divide la base de datos en intervalos y evalúa y 'siembra' candidatos de mayor tamaño de manera asíncrona sobre la marcha, reduciendo drásticamente los accesos a disco."
    },

    // --- MÓDULO 2: OPTIMIZACIÓN PARAMÉTRICA DEL ERROR ---
    {
      id: 4,
      module: 2,
      moduleName: "Optimización Paramétrica del Error",
      question: "Si se tiene una función con una única salida escalar y millones de parámetros de entrada ($n \\gg 1$), ¿cuál es el coste de calcular el gradiente completo mediante Diferenciación Automática en Modo Directo frente al Modo Inverso?",
      options: [
        "El Modo Directo requiere una sola pasada, mientras que el Modo Inverso requiere n pasadas completas del grafo.",
        "Ambos modos requieren exactamente el mismo coste temporal y espacial $O(n^2)$.",
        "El Modo Directo requiere n evaluaciones completas del grafo para obtener el gradiente; el Modo Inverso (Retropropagación) calcula el gradiente completo en una sola pasada hacia atrás con un coste proporcional a una sola evaluación.",
        "El Modo Inverso requiere almacenar infinitos números duales en cada nodo, duplicando el coste espacial por cada parámetro."
      ],
      correct: 2,
      justification: "El Modo Directo propaga tangentes en sentido forward, calculando la derivada respecto a una sola entrada por pasada ($O(n)$ pasadas para el gradiente). El Modo Inverso propaga adjuntos de atrás hacia adelante, calculando el gradiente de la salida escalar respecto a todas las entradas en una sola pasada backward."
    },
    {
      id: 5,
      module: 2,
      moduleName: "Optimización Paramétrica del Error",
      question: "En redes recurrentes, ¿cuál es el compromiso temporal y espacial entre Backpropagation Through Time (BPTT) y Real-Time Recurrent Learning (RTRL)?",
      options: [
        "BPTT requiere un coste computacional de $O(n^4)$ por paso, mientras que RTRL es lineal $O(n)$ en memoria.",
        "BPTT requiere desplegar la red a lo largo de la secuencia, exigiendo una memoria espacial de $O(T)$ para almacenar activaciones históricas; RTRL no requiere memoria histórica pero exige un coste computacional y de memoria de $O(n^4)$ por cada paso temporal.",
        "RTRL es el estándar en LLMs comerciales debido a que su complejidad computacional es logarítmica respecto a la secuencia.",
        "BPTT calcula el Jacobiano exacto en tiempo real sin requerir una pasada hacia atrás (backward pass)."
      ],
      correct: 1,
      justification: "BPTT despliega la red en el tiempo e incurre en $O(T)$ de memoria para almacenar los estados que se usarán en el paso backward. RTRL actualiza las derivadas en sentido forward en cada paso eliminando el almacenamiento temporal, pero su coste computacional es prohibitivo ($O(n^4)$ para $n$ estados ocultos)."
    },
    {
      id: 6,
      module: 2,
      moduleName: "Optimización Paramétrica del Error",
      question: "¿Cuántas evaluaciones de la función de pérdida requiere el algoritmo estocástico de orden cero SPSA para aproximar el gradiente completo de dimensión n?",
      options: [
        "Exactamente n llamadas de inferencia.",
        "Únicamente dos evaluaciones de la función de pérdida por cada paso de optimización, independientemente de la dimensión n del vector de parámetros.",
        "Requiere una cantidad exponencial de llamadas, del orden de $2^n$ evaluaciones.",
        "Cero evaluaciones, ya que SPSA calcula analíticamente la matriz de segundas derivadas parciales."
      ],
      correct: 1,
      justification: "El algoritmo SPSA estima el gradiente perturbando todos los parámetros simultáneamente utilizando un vector aleatorio $\\xi$ (como una distribución de Rademacher) y requiere solo 2 evaluaciones de la pérdida: $f(\\theta + c\\xi)$ y $f(\\theta - c\\xi)$ por paso."
    },
    {
      id: 7,
      module: 2,
      moduleName: "Optimización Paramétrica del Error",
      question: "¿Cuál es el límite del algoritmo determinista de orden cero de Nelder-Mead cuando se escala a problemas de optimización de alta dimensionalidad en deep learning?",
      options: [
        "El simplex de $n+1$ vértices colapsa en volumen y su complejidad para reorientarse geométricamente en un espacio de dimensión n escala de forma ineficiente.",
        "No admite funciones de pérdida no continuas.",
        "Exige el cálculo exacto de la matriz Hessiana invertida en cada reflexión.",
        "Requiere una tasa de aprendizaje adaptativa que decrece monótonamente a paso infinitesimal en la primera iteración."
      ],
      correct: 0,
      justification: "Nelder-Mead mantiene un simplex de $n+1$ puntos y utiliza transformaciones geométricas. En espacios de miles de dimensiones, el simplex sufre de degeneración geométrica y su convergencia es extremadamente lenta, siendo inútil para optimizar redes neuronales profundas de gran escala."
    },
    {
      id: 8,
      module: 2,
      moduleName: "Optimización Paramétrica del Error",
      question: "Desde una perspectiva de plausibilidad biológica y hardware neuromórfico, ¿por qué la optimización de Orden Cero (como Weight Perturbation) es más factible que la retropropagación clásica (BP)?",
      options: [
        "Porque WP elimina la necesidad de evaluar la función de pérdida.",
        "BP exige una simetría perfecta de pesos en sentido forward y backward (problema del transporte de pesos) y almacenamiento analógico exacto de activaciones; los métodos de Orden Cero aprenden mediante perturbaciones locales y una señal global de refuerzo, aprovechando el ruido intrínseco del silicio o las sinapsis como recurso de exploración.",
        "El hardware neuromórfico requiere operaciones matriciales deterministas de precisión FP64 incompatibles con el ruido de orden cero.",
        "El cerebro biológico calcula analíticamente gradientes de segundo orden mediante la optimización de Newton."
      ],
      correct: 1,
      justification: "La retropropagación clásica sufre del 'Weight Transport Problem' (el cerebro no puede transmitir gradientes usando los mismos pesos sinápticos en sentido inverso de forma exacta). Los métodos de orden cero perturbativos simulan la plasticidad sináptica guiada por señales de recompensa globales (moduladas biológicamente por la dopamina), lo que los hace ideales para hardware neuromórfico ruidoso y descentralizado."
    },

    // --- MÓDULO 3: ALGORITMOS DE OPTIMIZACIÓN DE GRADIENTE ---
    {
      id: 9,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "¿Por qué se prefiere el ruido estocástico inducido por los minilotes en SGD sobre el gradiente exacto del dataset completo para entrenar redes profundas?",
      options: [
        "Porque el gradiente exacto provoca divergencia por explosión de gradientes en la primera iteración.",
        "El ruido de SGD actúa como un regularizador implícito, ayudando al optimizador a escapar de mínimos locales poco óptimos y puntos de silla, y sesgando la convergencia hacia mínimos más planos que mejoran la generalización en datos no vistos.",
        "Reducir el batch size a 1 anula por completo la varianza del estimador de gradiente.",
        "SGD estocástico es el único algoritmo que permite el uso de decaimiento de pesos desacoplado."
      ],
      correct: 1,
      justification: "El ruido de muestreo en los minilotes altera dinámicamente la superficie de pérdida en cada iteración, permitiendo romper la inercia en zonas planas, escapar de mínimos locales estrechos y converger hacia cuencas de atracción más anchas y robustas (mínimos planos)."
    },
    {
      id: 10,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "¿Cómo mitiga el algoritmo de SGD con Momentum las oscilaciones transversales destructivas en superficies de pérdida con alta anisotropía?",
      options: [
        "Dividiendo la tasa de aprendizaje por la varianza móvil del gradiente.",
        "Introduciendo un término de inercia o velocidad acumulada mediante un promedio móvil exponencial de gradientes históricos que cancela las componentes oscilatorias opuestas y acelera el descenso en direcciones consistentes.",
        "Forzando al gradiente a tomar un valor constante de cero en las dimensiones de alta curvatura.",
        "Aplicando una rotación compleja sobre los pesos semánticos de la capa de salida."
      ],
      correct: 1,
      justification: "En valles estrechos anisotrópicos (donde la pérdida cambia rápidamente en una dirección pero lentamente en otra), SGD clásico oscila en zigzag. Momentum acumula velocidad en la dirección constante del canal de descenso y promedia a cero las oscilaciones ruidosas laterales."
    },
    {
      id: 11,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "¿Cuál es el defecto intrínseco de diseño en el algoritmo AdaGrad que provoca que el entrenamiento se detenga prematuramente en capas profundas?",
      options: [
        "El segundo momento se inicializa en infinito, anulando el paso inicial.",
        "El término acumulador de gradientes al cuadrado $G_t$ crece de manera monótona en cada iteración, lo que provoca que la tasa de aprendizaje adaptativa decaiga de forma acumulativa hasta volverse infinitesimalmente pequeña.",
        "La inestabilidad numérica provocada por divisiones por cero al no incluir un parámetro epsilon.",
        "El desacoplamiento erróneo de la penalización cuadrática L2 en su fórmula de actualización."
      ],
      correct: 1,
      justification: "Como AdaGrad acumula la suma de todos los gradientes al cuadrado históricos ($G_t = G_{t-1} + g_t^2$), la raíz cuadrada de este denominador se vuelve extremadamente grande a lo largo del tiempo, reduciendo la tasa de aprendizaje efectiva a cero mucho antes de alcanzar el mínimo óptimo."
    },
    {
      id: 12,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "¿Cómo corrige RMSProp la disminución monótona de la tasa de aprendizaje de AdaGrad?",
      options: [
        "Sustituyendo la suma monótona acumulada de gradientes al cuadrado por un promedio móvil exponencial ponderado por un factor de decaimiento $\\beta$, limitando la memoria de la varianza a una ventana temporal reciente.",
        "Multiplicando el gradiente por la inversa de la tasa de aprendizaje global.",
        "Añadiendo un término residual aditivo idéntico a la inicialización de pesos.",
        "Forzando a que la constante de amortiguación epsilon sea dinámica y proporcional al número de épocas."
      ],
      correct: 0,
      justification: "RMSProp introduce un factor de olvido exponencial ($\\beta$) en el cálculo del segundo momento ($v_t = \\beta v_{t-1} + (1-\\beta)g_t^2$). Esto evita que el acumulador crezca indefinidamente, permitiendo al modelo seguir aprendiendo y adaptándose en fases avanzadas del entrenamiento."
    },
    {
      id: 13,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "Deduzca el propósito matemático de dividir los momentos acumulados en Adam por $(1 - \\beta_1^t)$ y $(1 - \\beta_2^t)$ durante las iteraciones iniciales.",
      options: [
        "Se realiza para asegurar que la tasa de aprendizaje sea ortogonal a la matriz de embeddings.",
        "Dado que los estimadores $m_t$ y $v_t$ se inicializan en cero, sufren un sesgo severo hacia el origen; la corrección divide por estos términos para garantizar que los momentos sean estimaciones estadísticamente insesgadas del primer y segundo momento real.",
        "Es un factor de escala heurístico para emular el enmascaramiento de atención de Vaswani.",
        "Sirve para forzar el decaimiento de pesos de forma desacoplada de la tasa de aprendizaje."
      ],
      correct: 1,
      justification: "Al inicializar $m_0 = 0$, la expansión recursiva de $m_t$ como promedio móvil exponencial introduce un factor de escala de $(1-\\beta_1^t)$ en su esperanza matemática ($\\mathbb{E}[m_t] = \\mathbb{E}[g_t](1-\\beta_1^t)$). Para recuperar una estimación insesgada del momento real, se debe dividir el acumulador bruto por este factor."
    },
    {
      id: 14,
      module: 3,
      moduleName: "Algoritmos de Optimización de Gradiente",
      question: "En optimizadores adaptativos como Adam, ¿por qué la regularización L2 clásica (Tikhonov) aplicada directamente sobre la pérdida es matemáticamente distinta del decaimiento de pesos (Weight Decay) implementado en AdamW?",
      options: [
        "L2 incrementa exponencialmente los gradientes de los parámetros dispersos en lugar de reducirlos.",
        "Al añadir la penalización L2 a la pérdida en Adam, el gradiente de penalización se incorpora en las estimaciones de los momentos adaptativos $m_t$ y $v_t$. Esto provoca que los pesos con gradientes históricamente grandes se penalicen menos de lo debido, y los pesos con gradientes pequeños se penalicen en exceso; AdamW soluciona esto aplicando el decaimiento de forma directa y desacoplada sobre los pesos.",
        "AdamW anula la tasa de aprendizaje adaptativa de RMSProp para comportarse como SGD puro.",
        "No existe diferencia, ya que AdamW y Adam con L2 producen exactamente las mismas trayectorias paramétricas."
      ],
      correct: 1,
      justification: "Loshchilov y Hutter (2019) demostraron que al incorporar el gradiente de regularización L2 dentro del promedio móvil exponencial del segundo momento ($v_t$), su efecto se divide por la magnitud del gradiente adaptativo. Al desacoplar matemáticamente el decaimiento de pesos, AdamW sustrae una fracción constante del peso de manera limpia e independiente en cada paso."
    },

    // --- MÓDULO 4: ARQUITECTURAS Y ESPACIOS DE REPRESENTACIÓN ---
    {
      id: 15,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "¿Qué codifican la distancia geométrica y la alineación angular en un espacio de embeddings continuo de un gran modelo de lenguaje (LLM)?",
      options: [
        "El orden alfabético estricto de los caracteres de la secuencia.",
        "La tasa de compresión por tokenización de subpalabras en formato FP8.",
        "Relaciones semánticas y sintácticas complejas entre conceptos del lenguaje, donde la similitud de dirección (coseno) y la distancia euclídea reflejan la afinidad conceptual.",
        "El número de condición singular de la matriz de proyección FFN."
      ],
      correct: 2,
      justification: "Los embeddings continuos proyectan tokens discretos a un espacio vectorial denso ($d_{\\text{model}}$). La topología geométrica de este espacio está optimizada para que tokens con afinidad semántica o gramatical similar compartan vecindad y alineación angular (similitud de coseno)."
    },
    {
      id: 16,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "Si asumimos que los componentes individuales de los vectores de consulta $q$ y clave $k$ son variables independientes e idénticamente distribuidas (i.i.d.) con media cero y varianza unitaria, demuestre cuál es la varianza de su producto escalar $q \\cdot k$ en función de su dimensión $d_k$.",
      options: [
        "$\\text{Var}(q \\cdot k) = \\sqrt{d_k}$",
        "$\\text{Var}(q \\cdot k) = d_k^2$",
        "$\\text{Var}(q \\cdot k) = d_k$",
        "$\\text{Var}(q \\cdot k) = 1.0$"
      ],
      correct: 2,
      justification: "Como $q \\cdot k = \\sum_{i=1}^{d_k} q_i k_i$, y cada término $q_i k_i$ tiene media 0 y varianza 1 (dado que $\\text{Var}(q_i k_i) = \\mathbb{E}[q_i^2]\\mathbb{E}[k_i^2] = 1 \\cdot 1 = 1$), la varianza de la suma de las $d_k$ variables independientes es la suma de sus varianzas: $\\text{Var}(q \\cdot k) = d_k$."
    },
    {
      id: 17,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "¿Cuál es el impacto de no utilizar el factor de escala $1/\\sqrt{d_k}$ en la autoatención sobre la dinámica de optimización del Transformer?",
      options: [
        "Provoca que la softmax colapse a una distribución uniforme donde todos los tokens reciben la misma atención.",
        "Provoca que los productos escalares alcancen magnitudes numéricas muy elevadas, saturando la softmax en regiones asintóticas sumamente planas donde sus derivadas se aproximan a cero. Esto causa un desvanecimiento severo del gradiente (vanishing gradient) que detiene el entrenamiento de las proyecciones $W_Q$ y $W_K$.",
        "Hace que la matriz de atención se vuelva mal condicionada debido a que reduce el número de condición a valores cercanos a cero.",
        "El modelo se ve obligado a procesar la secuencia de forma puramente lineal y secuencial como una LSTM ordinaria."
      ],
      correct: 1,
      justification: "Sin el divisor $\\sqrt{d_k}$, la varianza de las puntuaciones de atención crece linealmente con la dimensión de las claves. Al aplicar la softmax, se asigna casi toda la masa de probabilidad a una sola posición. Las derivadas en esta región saturada de la softmax se anulan, bloqueando la propagación de gradientes hacia atrás en el grafo."
    },
    {
      id: 18,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "¿Cómo soluciona la inestabilidad de convergencia en el entrenamiento la técnica de 'Tokens Embebidos Condicionados' (Conditioned Embedded Tokens)?",
      options: [
        "Reemplazando los embeddings continuos por variables discretas de un solo bit.",
        "Añadiendo aditivamente una matriz de corrección $C$ a la matriz de embeddings original $X$ ($X_{\\text{condicionado}} = X + C$), calculada para forzar analíticamente una reducción de su número de condición $\\kappa(X+C) < \\kappa(X)$, lo que estabiliza el flujo de gradientes en las capas de atención profundas.",
        "Multiplicando la matriz de atención por la inversa de la matriz FFN original.",
        "Forzando al optimizador Adam a utilizar exclusivamente un método de orden cero SPSA."
      ],
      correct: 1,
      justification: "Un elevado número de condición ($\\kappa \\gg 1$) en las representaciones iniciales amplifica la varianza de las derivadas en las capas de atención. Al inyectar una perturbación ortogonal controlada $C$ basada en la descomposición de valores singulares (SVD), se regularizan las distancias singulares y se estabilizan los gradientes."
    },
    {
      id: 19,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "En la teoría de expresividad de Transformers, ¿cuál es la cota de dimensionalidad requerida para que un único bloque de autoatención aproxime óptimamente la tarea de promedio disperso ($q$-Sparse Averaging)?",
      options: [
        "La dimensión de embedding m debe ser infinitamente pequeña, del orden de $m \\le \\log q$.",
        "La dimensión de embedding m debe cumplir la relación de cota inferior $m \\gtrsim q$ para codificar de forma fidedigna las posiciones y relaciones semánticas requeridas en el promedio.",
        "No requiere restricciones de embedding, ya que cualquier red MLP de ancho constante puede resolver la tarea sin atención en tiempo logarítmico.",
        "El número de cabezales de atención debe ser estrictamente proporcional al tamaño de la secuencia al cuadrado ($h = N^2$)."
      ],
      correct: 1,
      justification: "La tarea $q$-SA exige consolidar información promedio de un conjunto de $q$ tokens dispersos. El análisis de capacidad representacional demuestra que el ancho del subespacio de embedding $m$ debe ser al menos proporcional a $q$ para evitar el colapso de representación de la atención."
    },
    {
      id: 20,
      module: 4,
      moduleName: "Arquitecturas y Espacios de Representación",
      question: "Explique por qué una sola capa de autoatención ordinaria de segundo orden (bilateral) puede resolver la tarea Match2 pero es teóricamente incapaz de resolver la tarea Match3 de forma exacta.",
      options: [
        "Match3 requiere operaciones de punto flotante FP64 incompatibles con la softmax causal.",
        "Autoatención estándar calcula afinidad por productos escalares entre pares (consultas y claves), lo que limita su campo asociativo a relaciones bilaterales (Match2); Match3 exige evaluar interacciones ternarias simultáneas, requiriendo un coste representacional de memoria e hilos polinómico impracticable para una sola capa, a menos que se apilen capas secuenciales o se use atención de orden superior.",
        "Match2 exige un enmascaramiento causal bidireccional que anula la capacidad representacional de Match3.",
        "Match3 es una tarea soluble exclusivamente mediante el algoritmo asociativo de Apriori clásico."
      ],
      correct: 1,
      justification: "La autoatención ordinaria opera bajo la matriz bilineal $QK^T$, evaluando coincidencias punto a punto (segundo orden). Match3 busca ternas que sumen cero. Mediante reducción de complejidad de comunicación (DISJ de Yao), se demuestra que resolver Match3 en una sola capa de atención bilateral exigiría que el embedding m escalara con la longitud de secuencia $N$ ($mpH \\ge \\Omega(N/\\log \\log N)$), rompiendo la eficiencia del modelo."
    },

    // --- MÓDULO 5: LA REVOLUCIÓN DEL TRANSFORMER ---
    {
      id: 21,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "¿Por qué las LSTMs sufren de serialización de hilos en hardware GPU moderno bajo el modelo de programación SIMT?",
      options: [
        "Porque las LSTMs requieren precisión numérica exponencial no paralelizable.",
        "Debido a su dependencia recursiva secuencial ($h_t = f(h_{t-1}, x_t)$), donde la computación del paso t no puede iniciarse hasta completar el paso t-1, forzando a los núcleos paralelos de la GPU a esperar secuencialmente la disponibilidad del dato anterior y subutilizando el hardware.",
        "Las GPUs no poseen unidades de cálculo de funciones sigmoideas necesarias para las compuertas de la LSTM.",
        "Porque las LSTMs no admiten la inyección de codificación posicional sinusoidal."
      ],
      correct: 1,
      justification: "El modelo SIMT (Single Instruction, Multiple Threads) de las GPUs está optimizado para ejecutar la misma operación sobre miles de datos independientes en paralelo. La recursión temporal intrínseca de las RNNs destruye esta paralelización, obligando al hardware a serializar la ejecución a lo largo del tiempo de la secuencia."
    },
    {
      id: 22,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "En el paper original 'Attention Is All You Need', demuestre por qué la codificación posicional sinusoidal permite al modelo aprender a atender por posiciones relativas de forma lineal.",
      options: [
        "Porque anula las dimensiones impares del embedding para forzar la ortogonalidad relativa.",
        "Para cualquier desfase constante k, el vector posicional en $pos+k$ se puede expresar como una función lineal del vector posicional en $pos$ utilizando una matriz de rotación pura $M(k)$ que depende exclusivamente del desfase k y es independiente de la posición absoluta $pos$.",
        "Forzando al modelo a comportarse de manera determinista idéntica a una convolución local 1D.",
        "Al sumar un ruido aleatorio que reduce el número de condición a la unidad exacta."
      ],
      correct: 1,
      justification: "Utilizando las identidades trigonométricas de adición de ángulos ($\\sin(a+b)$ y $\\cos(a+b)$), se demuestra que existe una matriz block-diagonal $M(k)$ tal que $PE(pos+k) = M(k)PE(pos)$. Esto permite que la proyección lineal de autoatención aprenda a modelar afinidades proporcionales a la distancia física entre tokens."
    },
    {
      id: 23,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "¿Cuál es el beneficio de diseño de Multi-Head Attention (MHA) al subdividir la dimensión del modelo $d_{\\text{model}}$ en h cabezales de dimensión $d_k = d_{\\text{model}}/h$?",
      options: [
        "Multiplica el coste de computación de la autoatención por un factor de $h^2$.",
        "Permite al modelo enfocar de manera simultánea y paralela la atención en diferentes subespacios de representación y posiciones contextuales sin incrementar el coste computacional total respecto a la atención de un solo cabezal completo.",
        "Elimina por completo la necesidad de redes FFN no lineales al final del bloque.",
        "Garantiza que el número de condición de cada submatriz sea siempre menor a 2."
      ],
      correct: 1,
      justification: "MHA proyecta los embeddings semánticos a subespacios de menor dimensionalidad ($d_k$). Al paralelizar en h cabezales, la complejidad agregada del producto de matrices es idéntica a la de procesar un solo cabezal colosal de dimensión $d_{\\text{model}}$, pero con el beneficio de capturar diferentes relaciones lógicas simultáneamente (ej. sintaxis, localidad, pronombres)."
    },
    {
      id: 24,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "¿Cómo se implementa la restricción causal de enmascaramiento en el bloque de autoatención del Decodificador del Transformer?",
      options: [
        "Multiplicando la matriz de valores V por una matriz diagonal nula.",
        "Sumando de forma aditiva un valor de $-\\infty$ a los logits de atención (antes de aplicar la softmax) para todas las posiciones futuras, lo que anula probabilísticamente el peso de atención hacia tokens no generados.",
        "Truncando la secuencia de entrada en el primer token del prompt.",
        "Ejecutando una llamada asíncrona al módulo de orquestación de agentes."
      ],
      correct: 1,
      justification: "Para que el entrenamiento sea autorregresivo y paralelo, se debe impedir que el token t atienda a los tokens posteriores. Al sumar $-\\infty$ en la matriz de compatibilidad previa a la softmax, la exponencial de estos términos se convierte en 0, bloqueando de forma absoluta la fuga de información del futuro."
    },
    {
      id: 25,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "¿Cuál es la diferencia matemática en el flujo del gradiente entre la arquitectura Post-LN (original de 2017) y la moderna arquitectura Pre-LN?",
      options: [
        "Post-LN evita la normalización de capa en el paso hacia atrás.",
        "En Pre-LN, la normalización de capa se ubica en las ramas de la subcapa antes de las operaciones de atención/FFN, lo que crea una autopista limpia de identidad (residual connect) que propaga de forma íntegra e inalterada los gradientes hacia las primeras capas, evitando el desvanecimiento de gradiente que sufre Post-LN.",
        "Pre-LN duplica de forma exponencial la varianza de la softmax causal en cada bloque.",
        "Post-LN es la única arquitectura que converge de manera estable sin requerir una etapa de precalentamiento (warmup)."
      ],
      correct: 1,
      justification: "En Post-LN, el gradiente debe atravesar la normalización de capa en cada bloque residual ($x_{l+1} = \\text{LN}(x_l + F(x_l))$), lo que atenúa progresivamente su magnitud y provoca inestabilidad en redes muy profundas. Pre-LN aplica la normalización directamente sobre la función de mapeo interno ($x_{l+1} = x_l + F(\\text{LN}(x_l))$), manteniendo el flujo del gradiente libre a través de la suma de identidades."
    },
    {
      id: 26,
      module: 5,
      moduleName: "La Revolución del Transformer",
      question: "En el diseño de redes ultra-profundas de frontera, ¿qué problema de entrenamiento soluciona el esquema de normalización Peri-LN frente a Pre-LN?",
      options: [
        "El sesgo del segundo momento en el optimizador AdamW.",
        "La inestabilidad provocada por la variabilidad y divergencia de los embeddings de entrada al inicio del entrenamiento, aplicando un pre-filtro de normalización balanceado sobre las capas de proyección inicial y final.",
        "Anula las dependencias causales eliminando el enmascaramiento del decodificador.",
        "Permite realizar la decodificación especulativa con modelos borrador sin coste de VRAM."
      ],
      correct: 1,
      justification: "Peri-LN complementa y optimiza el flujo de Pre-LN para evitar inestabilidad y divergencia de embeddings en fases críticas iniciales del entrenamiento, logrando convergencia directa en modelos de escala trillonaria de parámetros."
    },

    // --- MÓDULO 6: EL PARADIGMA GPT E INFERENCIA ---
    {
      id: 27,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "¿Cómo afecta matemáticamente el hiperparámetro de Temperatura (T) a la distribución de probabilidad de la softmax sobre los logits de salida de un LLM?",
      options: [
        "Multiplica linealmente la masa probabilística acumulada del Top-K.",
        "Modifica la escala de los logits dividiéndolos por el factor T antes de la softmax; un valor $T \\to 0$ extrema la distribución convirtiendo el muestreo en determinista (búsqueda codiciosa), mientras que un valor $T > 1$ reduce las distancias relativas entre logits, aplanando la distribución y promoviendo la aleatoriedad.",
        "Anula la probabilidad de los tokens de alta frecuencia en el vocabulario.",
        "Fuerza a que la pérdida de entropía cruzada secuencial sea siempre simétrica."
      ],
      correct: 1,
      justification: "La softmax se formula como $\\exp(z_i / T) / \\sum \\exp(z_j / T)$. Al variar la escala mediante T, se controla de forma directa el grado de entropía de la distribución probabilística de los tokens candidatos de salida."
    },
    {
      id: 28,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "¿Cuál es el beneficio dinámico de la técnica de muestreo Top-P (Nucleus Sampling) frente al muestreo clásico de Top-K?",
      options: [
        "Top-P mantiene un número fijo e inalterable de candidatos en cada paso secuencial.",
        "Selecciona dinámicamente el conjunto mínimo de tokens candidatos cuya probabilidad acumulada alcanza el umbral de confianza p, adaptando el tamaño del conjunto de búsqueda en tiempo real según la certeza del modelo en cada token.",
        "Top-P requiere la decodificación en paralelo de múltiples hilos especulativos.",
        "Elimina de forma absoluta la posibilidad de alucinaciones en el modelo generativo."
      ],
      correct: 1,
      justification: "En contextos con alta predictibilidad (ej. gramática estructurada), el núcleo de tokens viables es estrecho (pocas opciones concentran el 90% de probabilidad); en contextos ambiguos, la distribución es plana y dispersa. Top-P se adapta automáticamente a esta dinámica, a diferencia de Top-K que siempre retiene el mismo número k de candidatos ignorando la varianza de certidumbre."
    },
    {
      id: 29,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "¿Cuál es el objetivo matemático de preentrenamiento autorregresivo en los modelos GPT?",
      options: [
        "Clasificar secuencialmente si un par de oraciones son lógicamente equivalentes.",
        "Maximizar la log-verosimilitud condicional de predecir el siguiente token de la secuencia basándose en la historia completa de los tokens precedentes en el corpus de entrenamiento sin etiquetar.",
        "Minimizar el número de condición singulares de las matrices de proyección de atención FFN.",
        "Forzar al modelo a predecir únicamente tokens en formato binario discreto."
      ],
      correct: 1,
      justification: "El modelado de lenguaje causal (CLM) se formula como maximizar la probabilidad condicional conjunta $\\sum_{i=1}^{M} \\log P(x_i | x_{1}, \\dots, x_{i-1}; \\theta)$. Esto empuja implícitamente al modelo a aprender representaciones profundas de gramática, sintaxis y sentido común para aproximar el lenguaje."
    },
    {
      id: 30,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "¿Qué ventaja de optimización aporta el suavizado de etiquetas (Label Smoothing) en la pérdida de entropía cruzada durante el preentrenamiento de LLMs?",
      options: [
        "Anula de forma definitiva la necesidad de usar decaimiento de pesos (Weight Decay).",
        "Evita que el modelo asigne una certeza probabilística absoluta ($1.0$) a un único token del dataset, previniendo la saturación de la softmax y regularizando el entrenamiento contra el sobreajuste y la memorización ciega de ruido.",
        "Elimina por completo las alucinaciones en tareas de traducción de idiomas.",
        "Reduce la complejidad computacional del mecanismo de autoatención bidireccional."
      ],
      correct: 1,
      justification: "Al suavizar la distribución de verdad fáctica con un pequeño factor $\\epsilon_{ls}$, el objetivo de entropía cruzada no penaliza al modelo por asignar una pequeña fracción de probabilidad a tokens alternativos viables, lo que evita que los pesos tomen magnitudes colosales que saturan los gradientes de retropropagación."
    },
    {
      id: 31,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "En el contexto de la alineación de postentrenamiento, ¿qué postula la hipótesis LIMA (Less Is More for Alignment)?",
      options: [
        "Que se requiere al menos un trillón de tokens conversacionales ruidosos para alinear un modelo.",
        "Que la práctica totalidad del conocimiento fáctico y capacidades del modelo se adquieren durante la etapa de preentrenamiento causal masivo; la alineación conversacional (SFT) es un proceso de aprendizaje de formato y estilo que requiere únicamente de un conjunto pequeño (ej. 1,000 muestras) de ejemplos de altísima calidad y consistencia.",
        "La alineación del modelo debe realizarse exclusivamente mediante optimización de primer orden sin decaimiento de pesos.",
        "Que las alucinaciones se eliminan reduciendo el número de capas del decodificador causal."
      ],
      correct: 1,
      justification: "Zhou et al. (2023) demostraron que un modelo preentrenado masivamente puede aprender a comportarse de forma conversacional y útil con un ajuste fino supervisado sumamente acotado si las muestras de entrenamiento poseen un estándar de oro de edición humana y formato instructivo limpio."
    },
    {
      id: 32,
      module: 6,
      moduleName: "El Paradigma GPT e Inferencia",
      question: "En el pipeline de alineación RLHF, ¿cuál es el rol del modelo de recompensa y cómo se optimiza la política del LLM mediante PPO?",
      options: [
        "El modelo de recompensa calcula analíticamente la pérdida L2 sobre los gradientes de SFT.",
        "El modelo de recompensa evalúa y puntúa la calidad de las respuestas del modelo generativo basándose en preferencias humanas previamente aprendidas; la política se optimiza mediante PPO (Proximal Policy Optimization) maximizando esta recompensa estimada bajo una penalización de divergencia KL para evitar que la política se aleje en exceso del modelo base inicial.",
        "PPO anula el uso de logits reduciendo las probabilidades de salida a una representación binaria casi discreta.",
        "El modelo de recompensa actúa como un servidor de inferencia de baja latencia para decodificación especulativa."
      ],
      correct: 1,
      justification: "RLHF calibra un modelo de recompensa escalar a partir de comparaciones de preferencia binarias humanas. PPO entrena la política (pesos del LLM) utilizando esta recompensa, acotando el paso de actualización mediante regiones de confianza recortadas para estabilizar el aprendizaje por refuerzo y mitigar el colapso del lenguaje."
    },

    // --- MÓDULO 7: PILARES OPERATIVOS: GROUNDING Y HARNESS ---
    {
      id: 33,
      module: 7,
      moduleName: "Grounding y Evaluation Harness",
      question: "Defina el concepto de Grounding en sistemas de IA Generativa y explique cómo influye a nivel de prompt e inferencia del Transformer.",
      options: [
        "Es la reducción de los pesos del modelo a precisión de un solo bit para ejecutarse localmente.",
        "Consiste en anclar las respuestas del modelo a fuentes de información fidedignas y verificables de carácter externo (inyectadas dinámicamente como contexto de prompt), lo que reorienta las distribuciones probabilísticas de atención del Transformer y reduce de inmediato la tasa de alucinación semántica.",
        "El Grounding exige el reentrenamiento completo de las capas de embeddings de la primera capa del codificador.",
        "Es la fase de evaluación científica e instrumental de las capacidades de generalización cognitiva."
      ],
      correct: 1,
      justification: "Al proveer hechos fácticos exactos recuperados externamente (ej. de bases de datos contractuales o vectoriales), el espacio atencional del modelo se acota a procesar la veracidad contextual, disminuyendo drásticamente su dependencia de la memoria paramétrica estocástica aprendida en el preentrenamiento."
    },
    {
      id: 34,
      module: 7,
      moduleName: "Grounding y Evaluation Harness",
      question: "En la ingeniería de evaluación, ¿cuál es el propósito operativo de un 'Harness' (Arnés de Evaluación) automatizado?",
      options: [
        "Optimizar la velocidad de la fase de decodificación causal en hardware GPU.",
        "Proveer una infraestructura de software estandarizada, científica y reproducible para someter a múltiples modelos de lenguaje de forma sistemática y ciega bajo los mismos bancos de preguntas fijos, aislando sesgos de prompting para cuantificar objetivamente su rendimiento técnico.",
        "Reducir los costos de almacenamiento físico del caché de claves y valores (KV Cache).",
        "Automatizar el etiquetado conversacional de SFT utilizando optimización de orden cero."
      ],
      correct: 1,
      justification: "Un Harness de evaluación (como el de EleutherAI) automatiza las pasadas de examen sobre benchmarks (ej. MMLU, GSM8K), implementando filtros rigurosos de extracción (expresiones regulares) y unificando el formato de prompt para garantizar comparaciones fidedignas y científicas entre arquitecturas."
    },
    {
      id: 35,
      module: 7,
      moduleName: "Grounding y Evaluation Harness",
      question: "¿Qué capacidad cognitiva evalúa de forma específica el benchmark MMLU (Massive Multitask Language Understanding)?",
      options: [
        "El sentido común predictivo físico e intuitivo del mundo real.",
        "La exactitud del razonamiento matemático de múltiples pasos y lógica secuencial.",
        "La capacidad de generalización del conocimiento fáctico y resolución de problemas de opción múltiple a través de 57 materias académicas, profesionales y científicas de amplio espectro.",
        "El número de tokens procesados por segundo en hardware GPU local."
      ],
      correct: 2,
      justification: "MMLU es el benchmark estándar de oro de la industria para evaluar el conocimiento general amplio acumulado por un modelo en ciencias, humanidades, leyes, medicina y matemáticas en escenarios zero-shot y few-shot (típicamente 5-shot)."
    },
    {
      id: 36,
      module: 7,
      moduleName: "Grounding y Evaluation Harness",
      question: "¿Qué habilidad mide el benchmark GSM8K (Grade School Math 8K)?",
      options: [
        "La memorización del vocabulario y tokens de subpalabras dispersas.",
        "La capacidad del modelo para ejecutar razonamiento matemático multietapa de nivel escolar básico, requiriendo que la red verbalice y deduzca de forma lógica paso a paso la cadena de operaciones que le lleva al resultado numérico final exacto.",
        "El cálculo analítico en milisegundos de la inversa de la matriz Hessiana.",
        "La extrapolación de la ventana de contexto de autoatención causal."
      ],
      correct: 1,
      justification: "GSM8K evalúa la capacidad de razonamiento lógico secuencial y resolución de problemas verbales de aritmética. Su métrica exige exactitud exacta (Exact Match) en el valor numérico final de la respuesta, obligando a usar técnicas de cadena de pensamiento (Chain of Thought)."
    },
    {
      id: 37,
      module: 7,
      moduleName: "Grounding y Evaluation Harness",
      question: "¿Cuál es la propiedad de evaluación del benchmark HellaSwag?",
      options: [
        "Medir la latencia inter-token en tareas de traducción en tiempo real.",
        "Evaluar la capacidad de razonamiento y sentido común físico del mundo real para completar de manera predictiva situaciones cotidianas, requiriendo que el modelo elija la continuación más plausible de una historia entre múltiples distractores adversarios generados algorítmicamente.",
        "Estimar la veracidad fáctica de las alucinaciones en consultas médicas complejas.",
        "Medir la exactitud geométrica de las proyecciones de embeddings en espacios hiperdimensionales."
      ],
      correct: 1,
      justification: "HellaSwag es un benchmark diseñado específicamente para desafiar el sentido común cotidiano de la física y las interacciones humanas ordinarias. Utiliza técnicas de filtrado adversario para descartar opciones fáciles que los modelos de lenguaje clásicos resolvían memorizando patrones asociativos de palabras clave simples."
    },

    // --- MÓDULO 8: INFERENCIA EFICIENTE EN LLMS ---
    {
      id: 38,
      module: 8,
      moduleName: "Inferencia Eficiente en LLMs",
      question: "Explique la diferencia física de cuello de botella entre la fase de Prefill y la fase de Decode en la inferencia de LLMs.",
      options: [
        "Prefill está limitado por el espacio de VRAM físico; Decode está limitado por la latencia de la red de comunicación.",
        "La fase de Prefill procesa toda la secuencia de entrada en paralelo en un solo paso de cómputo, siendo intensiva en cálculo y estando limitada por la velocidad FLOP-bound de la GPU; la fase de Decode genera tokens de forma secuencial autorregresiva (paso por paso), requiriendo cargar cíclicamente todos los parámetros del modelo en memoria, lo que la vuelve estrictamente memory-bandwidth-bound.",
        "Decode es altamente paralelizable en hilos SIMT de GPU; Prefill requiere una ejecución serial determinista pura.",
        "Prefill optimiza la latencia ITL; Decode optimiza la métrica del TTFT."
      ],
      correct: 1,
      justification: "El prefill explota el paralelismo de hilos de la GPU al computar la autoatención del prompt de forma masiva. El decode, al ser serial paso por paso, pasa la mayor parte del tiempo transfiriendo bytes de parámetros de la memoria global de video a las unidades lógicas de cálculo, dejando a los núcleos de cálculo inactivos la mayor parte del tiempo por limitaciones del bus de datos físico."
    },
    {
      id: 39,
      module: 8,
      moduleName: "Inferencia Eficiente en LLMs",
      question: "¿Cómo optimiza el espacio de memoria VRAM de inferencia concurrente la técnica de Caching de Prefijos (RadixAttention)?",
      options: [
        "Reduciendo de manera homogénea la precisión de todos los embeddings de salida a INT4.",
        "Almacenando y reutilizando dinámicamente los estados de atención (KV Cache) correspondientes a los prefijos de sistema, instrucciones fijas y plantillas estáticas comunes entre múltiples usuarios utilizando una estructura de árbol Radix en el servidor de inferencia.",
        "Eliminando de forma permanente la capa de normalización residual de la autoatención causal.",
        "Forzando al decodificador causal a procesar la secuencia en una única capa."
      ],
      correct: 1,
      justification: "RadixAttention permite que si varios usuarios comparten la misma instrucción base (ej. 'Eres un asistente experto de leyes...'), la porción del caché KV calculada para ese texto fijo se conserve y se comparta dinámicamente en RAM de video, evitando recalcularla de forma redundante y reduciendo drásticamente el Time-to-First-Token (TTFT)."
    },
    {
      id: 40,
      module: 8,
      moduleName: "Inferencia Eficiente en LLMs",
      question: "¿Cuál es el postulado de la técnica de poda H2O (Heavy-Hitter Oracle) sobre el comportamiento de la atención en LLMs?",
      options: [
        "Que todos los tokens de la secuencia reciben exactamente la misma masa de atención a lo largo de secuencias largas.",
        "Que una pequeña fracción crítica de tokens ('heavy hitters') acumulan de forma sistemática la mayor parte de la probabilidad de la atención global; H2O retiene estos tokens de forma permanente en el KV Cache y desborda dinámicamente los tokens irrelevantes para mantener un tamaño de caché controlado.",
        "Que la compresión de baja precisión INT4 debe aplicarse exclusivamente sobre la capa FFN.",
        "La poda de atención anula la validez del factor de escala $1/\\sqrt{d_k}$."
      ],
      correct: 1,
      justification: "El análisis empírico demuestra que tokens de puntuación gramatical, conjunciones cruciales o palabras temáticas nucleares actúan como 'anclas' de atención permanente. Conservar estos tokens pesados y podar los secundarios en secuencias largas estabiliza el modelo y reduce el uso de VRAM a niveles constantes de ventana de memoria fija."
    },
    {
      id: 41,
      module: 8,
      moduleName: "Inferencia Eficiente en LLMs",
      question: "¿Cómo implementa el framework 'Don't Waste Bits!' la cuantización adaptativa de KV Cache por token?",
      options: [
        "Aplicando una precisión constante de 4 bits uniformemente sobre todos los elementos de la secuencia.",
        "Utilizando un micro-controlador de red neuronal ligero online de tres capas que evalúa características locales de cada token en tiempo real (ej. varianza de atención, entropía) para predecir su importancia relativa y asignarle una clase de precisión dinámica de forma asíncrona dentro del conjunto {2-bit, 4-bit, 8-bit, FP16}.",
        "Reduciendo la precisión semántica de la matriz de valores V a un formato binario determinista de 1 bit.",
        "Desacoplando por completo el decaimiento de pesos de los promedios móviles exponenciales de gradientes."
      ],
      correct: 1,
      justification: "En lugar de comprimir toda la secuencia con baja precisión perdiendo fidelidad y razonamiento sintáctico, 'Don't Waste Bits!' cuantiza de manera agresiva (a 2 o 4 bits) solo los tokens con baja entropía semántica y nulo impacto atencional, resguardando en precisión de 8 bits o FP16 aquellos tokens críticos que definen la cohesión del texto."
    },
    {
      id: 42,
      module: 8,
      moduleName: "Inferencia Eficiente en LLMs",
      question: "Describa la mecánica operativa y los pasos de validación probabilística de la técnica de Decodificación Especulativa (Speculative Decoding).",
      options: [
        "Utiliza una GPU externa no conectada a la red para ejecutar inferencias analógicas ruidosas.",
        "Un modelo borrador (pequeño y de baja latencia) genera secuencialmente una cadena de tokens tentativos rápida; a continuación, el modelo objetivo (el LLM masivo y costoso) toma estos tokens propuestos y los evalúa de manera simultánea en paralelo en un solo paso de prefill. Finalmente, se aplica un filtro de aceptación probabilístico (muestreo de rechazo) para confirmar los tokens correctos y descartar las desviaciones del borrador, logrando aceleraciones de hasta 3x sin pérdida de precisión.",
        "Consiste en reentrenar cíclicamente la política conversacional del LLM objetivo usando el optimizador SGD con regularización L2.",
        "Elimina el decode serial autorregresivo forzando al modelo objetivo a comportarse como un codificador bidireccional BERT."
      ],
      correct: 1,
      justification: "Como la decodificación está limitada por el ancho de banda de memoria, evaluar múltiples tokens candidatos en paralelo en un solo paso de prefill del modelo objetivo aprovecha su capacidad de cálculo latente. Si los tokens propuestos por el modelo borrador son válidos bajo la distribución del modelo grande, se confirman de golpe, saltándose la costosa inferencia serial secuencial."
    },

    // --- MÓDULO 9: RECUPERACIÓN DE INFORMACIÓN AVANZADA (RAG Y GRAPHRAG) ---
    {
      id: 43,
      module: 9,
      moduleName: "Recuperación de Información Avanzada",
      question: "¿Cuál es el límite del RAG semántico clásico basado en fragmentación (Chunks) estática y búsqueda de similitud vectorial local (K-NN)?",
      options: [
        "Su coste computacional es exponencial respecto a la dimensionalidad del modelo.",
        "Carece de una noción global del corpus; la fragmentación arbitraria rompe la cohesión semántica y estructural de relaciones lógicas complejas distribuidas en el texto, impidiendo al sistema responder consultas analíticas de alto nivel, transversales o resúmenes temáticos del dataset completo.",
        "Exige el uso de modelos de lenguaje autorregresivos entrenados mediante optimización de segundo orden.",
        "Requiere almacenar la base de datos de manera secuencial triangular inferior estricta en el decodificador."
      ],
      correct: 1,
      justification: "El RAG convencional realiza búsquedas por similitud matemática de baja escala sobre fragmentos de texto inconexos. Si la consulta exige deducir tendencias globales del dataset (ej. '¿Cuáles son los mayores riesgos citados en todos estos reportes?'), el sistema KNN local falla al no disponer de una síntesis jerárquica de la información."
    },
    {
      id: 44,
      module: 9,
      moduleName: "Recuperación de Información Avanzada",
      question: "¿Cómo estructura GraphRAG la información jerárquica del corpus de texto externo y qué rol juega el algoritmo de Leiden?",
      options: [
        "Multiplicando la matriz de adyacencia del grafo por la raíz de la dimensión del modelo.",
        "Traduce el texto no estructurado en un Grafo de Conocimiento mapeando entidades (nodos) y relaciones lógicas (bordes); a continuación, el algoritmo de Leiden agrupa el grafo de forma recursiva en comunidades semánticas locales densamente conectadas y las escala en una jerarquía multinivel, sobre las cuales se pregeneran resúmenes ejecutivos sintéticos para responder de forma global consultas transversales con bajo costo de tokens.",
        "El algoritmo de Leiden calcula el número de condición singulares de los vectores de soporte del hiperplano de la SVM.",
        "Consiste en inyectar de forma aditiva un ruido aleatorio que normaliza la varianza del producto escalar de claves y consultas."
      ],
      correct: 1,
      justification: "GraphRAG combina la fidelidad estructurada de los grafos con el razonamiento del LLM. Leiden maximiza la modularidad de la red de entidades para identificar clústeres temáticos robustos en niveles macro, meso y micro. El LLM resume cada clúster de forma asíncrona, creando una base documental sintética idónea para búsquedas complejas globales (Query-Focused Summarization - QFS)."
    },
    {
      id: 45,
      module: 9,
      moduleName: "Recuperación de Información Avanzada",
      question: "En la búsqueda vectorial a escala de miles de millones de elementos, ¿cómo optimiza la latencia el índice HNSW (Hierarchical Navigable Small World)?",
      options: [
        "Ejecutando una búsqueda secuencial exhaustiva linear $O(N)$ sobre todos los elementos sin compresión.",
        "Estructurando los vectores como nodos en un grafo multicapa de 'pequeño mundo'; las capas superiores poseen pocos nodos y conexiones de largo alcance para saltar rápidamente a través del espacio hiperdimensional, mientras que las capas inferiores refinan localmente la búsqueda de vecinos con alta densidad de conexiones de corto alcance en tiempo logarítmico.",
        "Reduciendo las dimensiones de todos los embeddings inyectando una matriz residual diagonal nula de 1 bit.",
        "Eliminando el uso de métricas de distancia e implementando exclusivamente la regularización de Tikhonov."
      ],
      correct: 1,
      justification: "HNSW es el estándar industrial para búsqueda aproximada de vecinos más cercanos (ANN). Funciona bajo el principio de saltos rápidos sobre capas dispersas para luego sumergirse jerárquicamente en clústeres densos de alta fidelidad, evitando la latencia prohibitiva de comparar secuencialmente la consulta contra cada vector de la base."
    },
    {
      id: 46,
      module: 9,
      moduleName: "Recuperación de Información Avanzada",
      question: "¿Cuál es el principio matemático de Product Quantization (IVF-PQ) para comprimir bases de datos vectoriales de gran tamaño con mínimo impacto de recuperación (Recall)?",
      options: [
        "Descartar de forma permanente los coeficientes impares de las matrices de proyección de atención.",
        "Divide cada vector de alta dimensión en M subvectores independientes y los cuantiza de forma local mapeándolos contra un vocabulario fijo de centroides locales precalculados mediante k-means; el vector original se almacena como una secuencia de M índices representables con 1 byte cada uno, permitiendo estimar distancias de consulta de forma asíncrona mediante tablas de búsqueda ultrarrápidas sin descomprimir los vectores.",
        "Forzar a que la distancia de coseno sea siempre ortogonal al producto interno unitario.",
        "Reemplazar la normalización de capa en el decodificador causal por una inicialización residual en el plano complejo de RoPE."
      ],
      correct: 1,
      justification: "PQ comprime masivamente los vectores de embeddings al submuestrear su representación en subespacios de menor rango y cuantizarlos a índices enteros sumamente ligeros. Al usar tablas de búsqueda asíncronas para el cálculo de distancias (Asymmetric Distance Computation - ADC), se reduce la huella de memoria RAM en más del 90% con nula penalización de latencia."
    },

    // --- MÓDULO 10: SISTEMAS Y FLUJOS AGENCIALES ---
    {
      id: 47,
      module: 10,
      moduleName: "Sistemas y Flujos Agenciales",
      question: "¿Cuál es el ciclo recursivo e interactivo que rige el patrón de diseño de agentes ReAct (Reasoning and Acting)?",
      options: [
        "Thought -> Optimizer -> Execution.",
        "Thought -> Action -> Observation -> Loop; donde el agente verbaliza paso a paso en lenguaje natural su razonamiento (Thought) sobre el estado actual, emite de forma estructurada una acción o llamada a herramienta externa (Action), lee de vuelta el resultado textual del entorno (Observation), y reevalúa recursivamente el contexto para avanzar o emitir la respuesta final.",
        "Input -> Grounding -> Evaluation Harness -> Output.",
        "Es un ciclo puramente mental de cadena de pensamiento que no interactúa con herramientas de API externas."
      ],
      correct: 1,
      justification: "ReAct (Yao et al., 2022) rompe el confinamiento interno del LLM de su memoria paramétrica clásica al habilitarle un bucle interactivo de razonamiento explícito estructurado con ejecución de código y APIs externas de manera continua y autocorrectiva."
    },
    {
      id: 48,
      module: 10,
      moduleName: "Sistemas y Flujos Agenciales",
      question: "En arquitecturas agenciales sofisticadas, ¿cómo se diferencia el patrón Self-Refine de la arquitectura Reflexion?",
      options: [
        "Self-Refine anula el uso de herramientas externas de orquestación de APIs.",
        "Self-Refine es un bucle directo de borrador-autocrítica-refinamiento sintáctico a corto plazo; Reflexion introduce una estructura formal de Memoria a Largo Plazo y autorreflexión retrospectiva, donde el agente analiza de manera retrospectiva el árbol de decisiones de trayectorias pasadas fallidas para extraer lecciones de aprendizaje formales que almacena en su memoria histórica para reajustar de forma inmediata su estrategia en futuros intentos.",
        "Reflexion es compatible exclusivamente con el optimizador SGD de orden cero.",
        "No existe diferencia, ya que ambos patrones realizan exclusivamente el enmascaramiento causal bidireccional."
      ],
      correct: 1,
      justification: "Reflexion emula procesos metacognitivos humanos avanzados al permitir que el agente 'aprenda de sus propios fracasos' persistiendo bitácoras de fallos de ejecución lógicas en una base de datos para guiar y optimizar el árbol de búsqueda causal de decisiones futuras."
    },
    {
      id: 49,
      module: 10,
      moduleName: "Sistemas y Flujos Agenciales",
      question: "¿Qué estándar unificado de comunicación cliente-servidor implementa el protocolo MCP (Model Context Protocol)?",
      options: [
        "Una conexión bidireccional de baja latencia diseñada para preentrenamiento de modelos en INT4.",
        "Un estándar técnico abierto cliente-servidor que desacopla el desarrollo de herramientas y recursos del modelo de lenguaje, definiendo interfaces estandarizadas para tres operaciones críticas: Recursos (Resources/acceso seguro a datos), Herramientas (Tools/llamadas interactivas de API) y Prompts (plantillas contextuales de prompt de sistema).",
        "Es la normalización doble residual aplicada a los bloques residuales de Peri-LN.",
        "Un protocolo exclusivo para decodificación especulativa sobre hardware neuromórfico local."
      ],
      correct: 1,
      justification: "Desarrollado para erradicar el acoplamiento y fragmentación técnica, MCP proporciona un marco unificado de comunicación de código abierto para que cualquier agente diseñado por diferentes desarrolladores pueda consumir dinámicamente datos y herramientas desde servidores remotos que hablen el protocolo estándar de forma inmediata."
    },
    {
      id: 50,
      module: 10,
      moduleName: "Sistemas y Flujos Agenciales",
      question: "En el diseño de interfaces seguras para agentes de inteligencia artificial (ACI - Agent-Computer Interface), ¿qué establece el principio 'Poka-yoke' de diseño industrial aplicado al software?",
      options: [
        "Que se debe restringir de forma absoluta el acceso del agente al prompt de sistema original.",
        "Es un principio de prevención a prueba de fallos y diseño defensivo donde las interfaces, APIs expuestas y herramientas de ejecución de software se diseñan con limitaciones técnicas intrínsecas, validaciones estrictas de tipo y guardarraíles semánticos infranqueables para evitar de forma preventiva que un agente cometa un error catastrófico (como sustraer fondos o borrar bases de datos) ante un fallo lógico en su bucle ReAct o una vulnerabilidad de inyección de prompt.",
        "Consiste en aplicar un suavizado de etiquetas (Label Smoothing) en la entropía cruzada.",
        "Que las alucinaciones del modelo borrador se corrijan en la fase de veracidad paralela de la GPU."
      ],
      correct: 1,
      justification: "Los agentes pueden sufrir de desvíos, alucinaciones o secuestros de directrices si se exponen a prompts hostiles. Diseñar APIs agenciales bajo el enfoque 'Poka-yoke' significa que el canal de ejecución física impide errores por diseño (ej. una API que solo admite valores de un enumerado preestablecido, o montos máximos diarios infranqueables bajo validación de firma criptográfica robusta)."
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXAM_DATA;
}
