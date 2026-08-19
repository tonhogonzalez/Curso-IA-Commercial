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
    ],

    "04-el-universo-del-transformer": [
      {
        question: "¿Por qué es matemáticamente necesario el factor de escala 1/√d_k en la autoatención?",
        options: [
          "Porque la varianza del producto escalar de dos vectores aleatorios crece proporcionalmente con d_k, empujando la función softmax a regiones de saturación donde los gradientes se desvanecen.",
          "Porque reduce el consumo de memoria VRAM a una fracción logarítmica O(log N).",
          "Porque invierte el orden temporal de las secuencias para acelerar la decodificación."
        ],
        correct: 0,
        explanation: "Como se demuestra formalmente, Var(q · k) = d_k. Al dividir por √d_k, la varianza se normaliza a 1.0, manteniendo las puntuaciones en la región sensible de la softmax donde el gradiente no se extingue."
      },
      {
        question: "¿Cuál es la ventaja arquitectónica de Rotary Position Embedding (RoPE) frente a la codificación absoluta (APE)?",
        options: [
          "Suma vectores estáticos fijos únicamente al inicio de la primera capa para no alterar los pesos.",
          "Aplica una rotación geométrica ortogonal en Q y K que preserva la norma vectorial, haciendo que la atención dependa de la distancia relativa (m - n) y facilitando la extrapolación de contexto.",
          "Elimina la necesidad de usar matrices de proyección de Valores (V)."
        ],
        correct: 1,
        explanation: "RoPE rota los vectores en el plano complejo con matrices ortogonales, garantizando que el producto escalar resultante dependa exclusivamente del desplazamiento relativo entre tokens y habilitando técnicas de escalado como YaRN."
      },
      {
        question: "En sistemas de IA en producción, ¿cuál es el propósito del Anclaje (Grounding) y los arneses de evaluación (Harness)?",
        options: [
          "El Grounding inyecta hechos verídicos externos (RAG/GraphRAG) para mitigar alucinaciones, y el Harness evalúa científicamente las capacidades cognitivas del modelo bajo benchmarks estandarizados (MMLU, GSM8K).",
          "El Grounding comprime los pesos a 1 bit y el Harness mide la temperatura física de la GPU.",
          "El Grounding sustituye al tokenizador BPE por uno binario y el Harness elimina el aprendizaje por refuerzo."
        ],
        correct: 0,
        explanation: "El Grounding dota al modelo de veracidad fáctica consultando fuentes de verdad externas en tiempo real, mientras que arneses como lm-evaluation-harness someten al LLM a pruebas reproducibles de razonamiento y conocimiento."
      }
    ],

    "05-paradigmas-y-computacion": [
      {
        question: "¿Por qué el aprendizaje automático invierte el flujo computacional clásico de Turing?",
        options: [
          "Porque en lugar de programar reglas lógicas explícitas a mano, el modelo deduce de forma autónoma la función de transformación óptima f(x) mediante optimización sobre datos de entrada y salida.",
          "Porque prescinde por completo del uso de hardware y microprocesadores de silicio.",
          "Porque elimina toda incertidumbre y convierte los modelos en sistemas 100% deterministas."
        ],
        correct: 0,
        explanation: "El paradigma conexionista de Machine Learning invierte la algoritmia tradicional: toma muestras históricas de entrada y salida para que los algoritmos de optimización (descenso de gradiente) ajusten los pesos matriciales y aproximen la función subyacente."
      },
      {
        question: "En minería de reglas de asociación, ¿qué indica un valor de Lift(X => Y) superior a 1?",
        options: [
          "Que los ítems X e Y son estadísticamente independientes.",
          "Que existe una correlación positiva fuerte, indicando que la presencia de X incrementa significativamente la probabilidad de aparición de Y respecto a lo esperado por azar.",
          "Que la regla de asociación es inválida y debe ser podada de inmediato."
        ],
        correct: 1,
        explanation: "El Lift mide la razón entre la co-ocurrencia real observada y la probabilidad esperada bajo independencia estadística. Si Lift > 1, la presencia del antecedente X ejerce una tracción positiva sobre la aparición del consecuente Y."
      },
      {
        question: "¿Cuál es la principal ventaja operativa del algoritmo Dynamic Itemset Counting (DIC) frente a Apriori clásico?",
        options: [
          "Segmenta la base de datos en bloques de tamaño M e inicia el conteo de candidatos de forma asíncrona sobre la marcha, reduciendo drásticamente las lecturas secuenciales a disco.",
          "Permite ejecutar minería asociativa sin definir ningún soporte mínimo.",
          "Transforma los datos de transacciones en imágenes para procesarlos con redes convolucionales."
        ],
        correct: 0,
        explanation: "Mientras que Apriori requiere k lecturas completas a disco para k-itemsets, DIC evalúa candidatos en puntos de control intermedios y siembra nuevos candidatos de forma asíncrona, logrando reducciones de hasta un 45% en operaciones de I/O."
      },
      {
        question: "¿Por qué la Diferenciación Automática en Modo Inverso (Reverse-Mode AD) es el estándar universal en Deep Learning frente al Modo Directo?",
        options: [
          "Porque evalúa el gradiente completo respecto a billones de parámetros en una única pasada hacia atrás con coste computacional O(1) relativo al paso forward, mientras que el Modo Directo exigiría una pasada por cada parámetro O(N).",
          "Porque no requiere almacenar ninguna activación en la memoria VRAM de la GPU.",
          "Porque calcula de forma determinista la inversa de la Matriz Hessiana en tiempo lineal."
        ],
        correct: 0,
        explanation: "El Modo Inverso calcula el Producto Vector-Jacobiano (VJP) desde la pérdida escalar de salida hacia todos los parámetros de entrada simultáneamente en un único pase backward, permitiendo entrenar modelos masivos de forma computacionalmente viable."
      },
      {
        question: "En el procesamiento secuencial con redes recurrentes (RNNs), ¿cuál es el trade-off crítico entre BPTT y RTRL?",
        options: [
          "BPTT es eficiente en tiempo O(T·d²) pero demanda memoria O(T·d) al retener toda la cinta temporal; RTRL elimina el almacenamiento de historial pero su tiempo escala de forma prohibitiva a O(T·d⁴).",
          "BPTT solo calcula derivadas de orden cero y RTRL utiliza derivadas simbólicas exactas.",
          "BPTT no permite el uso de GPUs mientras que RTRL requiere clústeres cuánticos."
        ],
        correct: 0,
        explanation: "BPTT (Modo Inverso temporal) es muy rápido pero está acotado por la VRAM para secuencias largas. RTRL (Modo Directo temporal) permite aprendizaje online sin guardar historial, pero la multiplicación continua de tensores de sensibilidad de cuarto orden lo vuelve impracticable para modelos reales."
      },
      {
        question: "¿Qué ventaja diferencial aporta la optimización de Orden Cero (SPSA) en hardware neuromórfico biológicamente plausible?",
        options: [
          "Estima el gradiente con solo dos pasadas de inferencia y aprovecha el propio ruido térmico del silicio para las perturbaciones estocásticas, superando el 'Weight Transport Problem' de la retropropagación.",
          "Garantiza encontrar el mínimo global de cualquier función no convexa en una sola iteración.",
          "Elimina la necesidad de suministrar energía eléctrica al chip."
        ],
        correct: 0,
        explanation: "En la biología y en chips neuromórficos analógicos (Loihi, TrueNorth), no existen vías de retropropagación simétrica analógica. Los métodos de orden cero como SPSA utilizan perturbaciones locales guiadas por señales globales de refuerzo (dopamina/moduladores), operando con consumos de milivatios."
      },
      {
        question: "¿Por qué el 'ruido de gradiente' introducido por los minilotes en SGD favorece una mayor generalización en modelos de Deep Learning?",
        options: [
          "Porque expulsa la optimización de mínimos estrechos y empinados (sharp minima) y la empuja hacia mínimos planos (flat minima), cuya menor curvatura y valores propios del Hessiano reducen la sensibilidad ante datos no vistos.",
          "Porque reduce el número de parámetros del modelo a la mitad en cada época.",
          "Porque anula completamente las oscilaciones transversales sin requerir hiperparámetros."
        ],
        correct: 0,
        explanation: "La varianza estocástica actúa como una fuerza perturbadora que no puede estabilizarse en valles estrechos, guiando los pesos hacia cuencas de atracción planas y robustas donde pequeñas variaciones en la distribución de entrada no alteran la pérdida."
      },
      {
        question: "En la formulación analítica de Adam, ¿cuál es el origen matemático del término de corrección de sesgo 1/(1 - β₁ᵗ)?",
        options: [
          "Al inicializar m₀ = 0, la esperanza del momento acumulado queda escalada por la suma de la serie geométrica finita (1 - β₁ᵗ), subestimando la velocidad real del gradiente en las iteraciones iniciales.",
          "Proviene de invertir la matriz de covarianza de los pesos en cada paso.",
          "Es una constante heurística para evitar divisiones por cero en el denominador."
        ],
        correct: 0,
        explanation: "Dado que m₀ se inicializa en cero, la esperanza E[m_t] = E[g_t](1 - β₁ᵗ). Para obtener un estimador insesgado de la media del gradiente, es matemáticamente necesario dividir por el factor (1 - β₁ᵗ), el cual tiende a 1 conforme t crece."
      },
      {
        question: "¿Por qué la regularización L₂ integrada en Adam quiebra el decaimiento de pesos y cómo lo resuelve AdamW?",
        options: [
          "En Adam clásico, la penalización cuadrática se divide por la raíz del segundo momento √(v_t), subregularizando pesos con gradientes grandes y castigando en exceso a pesos dispersos; AdamW desacopla el decaimiento aplicándolo de forma directa sobre los parámetros.",
          "En Adam clásico, L₂ hace que la tasa de aprendizaje colapse monótonamente a cero como en AdaGrad; AdamW elimina la constante épsilon.",
          "AdamW sustituye la penalización L₂ por una norma L₁ para forzar esparcidad matricial."
        ],
        correct: 0,
        explanation: "Loshchilov y Hutter demostraron que al ligar la regularización al gradiente adaptativo, el decaimiento efectivo queda distorsionado por √(v_t). AdamW preserva la regularización homogénea de Tikhonov desacoplando el decaimiento de pesos del gradiente adaptativo puro."
      },
      {
        question: "¿Por qué la varianza del producto escalar crece como Var(q · k) = d_k y cómo lo normaliza la autoatención?",
        options: [
          "Al ser suma de d_k variables independientes de varianza 1, la varianza acumulada es d_k; al dividir por √d_k, la varianza se normaliza a 1.0, evitando la saturación de la softmax y el desvanecimiento de gradientes.",
          "Porque el producto escalar cuadruplica el tamaño de los tensores de activación.",
          "Porque elimina la necesidad de calcular derivadas en el paso hacia atrás."
        ],
        correct: 0,
        explanation: "Dado que Var(q_i · k_i) = 1, Var(q · k) = d_k. Puntuaciones sin escalar saturan la función softmax en asíntotas de derivada nula; el factor 1/√d_k restaura la varianza unitaria y la salud del gradiente."
      },
      {
        question: "En Multi-Head Attention (MHA), ¿por qué utilizar h cabezas independientes con d_k = d_model / h mantiene la misma complejidad computacional que una sola cabeza?",
        options: [
          "Porque el factor h en el denominador de las proyecciones y productos de atención por cabeza se cancela de forma exacta al sumar los h cabezales en paralelo, manteniendo el coste en O(n²·d_model + n·d_model²).",
          "Porque los cabezales se ejecutan de forma secuencial eliminando el paralelismo.",
          "Porque omite el uso de matrices de proyección de Valores V."
        ],
        correct: 0,
        explanation: "El coste por cabeza es O((n·d_model² + n²·d_model)/h). Al multiplicar por h cabezas, el divisor se cancela exactamente, aumentando la expresividad en subespacios sin sobrecoste computacional."
      },
      {
        question: "¿Por qué la tarea Match2 se resuelve con 1 sola capa de autoatención pero Match3 exige apilamiento secuencial (D ≥ 2)?",
        options: [
          "Match2 es una afinidad bilateral de segundo orden resoluble con mapeo trigonométrico en dimensión m=3; Match3 es intrínsecamente triádica y por el teorema de complejidad de comunicación para DISJ exige apilar capas para que la segunda capa combine pares preprocesados.",
          "Match2 solo opera en matrices 2D mientras que Match3 requiere matrices 3D.",
          "Match3 requiere optimizadores de segundo orden para converger."
        ],
        correct: 0,
        explanation: "La autoatención estándar realiza operaciones puramente bilaterales. Resolver problemas triádicos (ternas) sin coste exponencial exige que la primera capa resuelva pares temporales y la segunda capa integre el tercer elemento de la secuencia."
      },
      {
        question: "¿Por qué la Codificación Posicional Sinusoidal original permite aprender relaciones de distancia relativa de forma lineal?",
        options: [
          "Porque por las identidades trigonométricas de adición de ángulos, el vector posicional en pos+k equivale a multiplicar el vector en pos por una matriz de rotación pura R_i(k) que depende exclusivamente del desfase k.",
          "Porque suma un número entero creciente a cada vector de embedding.",
          "Porque sustituye los embeddings por vectores aleatorios no entrenables."
        ],
        correct: 0,
        explanation: "La formulación sinusoidal garantiza que PE(pos+k) = M(k)·PE(pos), donde M(k) es una matriz ortogonal diagonal por bloques. Esto permite que el producto escalar Q·K aproxime distancias relativas mediante simples proyecciones lineales."
      },
      {
        question: "En el decodificador causal del Transformer, ¿cuál es el propósito matemático de fijar M_causal(i, j) = -∞ para j > i?",
        options: [
          "Anular el peso de atención asignado a tokens futuros tras la función softmax (e^(-∞) → 0), garantizando la generación autorregresiva estricta durante el entrenamiento en paralelo.",
          "Reducir a la mitad el consumo de memoria VRAM del codificador.",
          "Eliminar la necesidad de calcular gradientes en el decodificador."
        ],
        correct: 0,
        explanation: "La máscara causal triangular superior fuerza que los logits futuros se vuelvan infinitamente negativos, haciendo que la softmax les asigne una probabilidad de atención exactamente igual a 0.0."
      },
      {
        question: "En arquitecturas Transformer profundas, ¿cuál es la ventaja matemática fundamental de Pre-LN sobre Post-LN?",
        options: [
          "En Pre-LN, la salida acumulada x_L = x_0 + ∑ F_l(x_l) genera un término de identidad puro I en la retropropagación, transportando la señal del gradiente sin atenuación hasta la primera capa e impidiendo el desvanecimiento de gradientes.",
          "Pre-LN duplica la cantidad de parámetros del bloque de atención.",
          "Pre-LN sustituye la normalización por un optimizador de segundo orden."
        ],
        correct: 0,
        explanation: "En Pre-LN, ∂L/∂x_0 = (∂L/∂x_L)(I + ∑ ∂F_l/∂x_0). La presencia del término identidad I proporciona una autopista directa y robusta de gradientes a través de toda la profundidad de la red sin requerir complejas planificaciones de warmup."
      },
      {
        question: "En el muestreo estocástico de un LLM, ¿qué efecto matemático produce configurar una Temperatura T > 1?",
        options: [
          "Divide los logits por un factor mayor a 1, reduciendo las diferencias relativas entre puntuaciones y generando una distribución softmax más plana (mayor entropía), incrementando la creatividad y variedad de tokens muestreados.",
          "Anula completamente los primeros K tokens dominantes.",
          "Fuerza una búsqueda puramente codiciosa (Greedy Search) determinista."
        ],
        correct: 0,
        explanation: "Al dividir los logits por T > 1, las magnitudes relativas se comprimen, suavizando los picos de probabilidad y distribuyendo la masa entre más alternativas léxicas."
      },
      {
        question: "¿Cuál es la ventaja de adaptabilidad de Top-P (Nucleus Sampling) frente a Top-K?",
        options: [
          "Trunca la distribución basándose en la masa de probabilidad acumulada (p): si hay alta certeza estrecha el conjunto a 1-2 tokens, mientras que si hay ambigüedad amplía automáticamente el abanico de candidatos.",
          "Top-P selecciona un número constante de 10 palabras en cada paso.",
          "Top-P desactiva la capa de desembebido (Unembedding)."
        ],
        correct: 0,
        explanation: "Top-P ajusta dinámicamente el tamaño del conjunto candidato en función de la confianza del modelo, a diferencia de Top-K que mantiene un número rígido de opciones."
      },
      {
        question: "¿Por qué la técnica de Label Smoothing mezcla la etiqueta objetivo con una distribución uniforme de ruido ε/|V|?",
        options: [
          "Evita que el optimizador fuerce los logits hacia magnitudes infinitas buscando probabilidad 1.0, previniendo la saturación de la softmax y mejorando la calibración y generalización.",
          "Aumenta la tasa de aprendizaje un 50% en las últimas capas.",
          "Elimina la necesidad de usar funciones de pérdida de entropía cruzada."
        ],
        correct: 0,
        explanation: "Al reemplazar los objetivos duros one-hot por distribuciones suaves, Label Smoothing limita la penalización del error y frena la sobreconfianza patológica de la red."
      },
      {
        question: "En el pipeline de alineación, ¿cuál fue la tesis validada por el paper seminal LIMA (Less Is More for Alignment)?",
        options: [
          "Que un conjunto reducido (apenas 1,000 ejemplos) de SFT con un estándar de calidad, riqueza y consistencia humana excepcional es suficiente para activar todo el conocimiento latente del preentrenamiento.",
          "Que se requieren millones de diálogos sintéticos para aprender a conversar.",
          "Que el entrenamiento no supervisado puede ser omitido por completo."
        ],
        correct: 0,
        explanation: "LIMA demostró que casi todo el conocimiento y capacidades del LLM se forjan en el preentrenamiento causal; el SFT de alta calidad actúa como una fina capa de formato conversacional y estilo."
      },
      {
        question: "Desde el punto de vista de la teoría de la información y la atención, ¿cómo opera el Grounding para mitigar las alucinaciones?",
        options: [
          "Expande la entrada con el contexto fáctico X' = [C; X], haciendo que la softmax asigne pesos probabilísticos masivos a las claves de las fuentes de verdad externas, contrayendo la entropía de salida y anclando el subespacio vectorial de generación.",
          "Elimina todos los pesos del modelo y los sustituye por un motor de base de datos relacional SQL.",
          "Desactiva las capas de autoatención durante la fase de decodificación."
        ],
        correct: 0,
        explanation: "Al inyectar el contexto fáctico C en el prompt, las proyecciones Q, K y V incorporan la información de verdad, guiando los pesos de la softmax hacia los tokens de evidencia y evitando que el modelo muestree de la cola estocástica."
      },
      {
        question: "¿Cuál es la ventaja estructural de GraphRAG jerárquico frente al RAG semántico clásico?",
        options: [
          "Construye un grafo de conocimiento particionado en comunidades mediante el algoritmo de Leiden con resúmenes precalculados, permitiendo resolver consultas holísticas y transversales sobre todo el corpus (QFS), donde el RAG clásico de chunks locales falla.",
          "GraphRAG no necesita embeddings ni bases de datos vectoriales.",
          "GraphRAG reduce la longitud de los prompts a un único token."
        ],
        correct: 0,
        explanation: "El RAG clásico recupera fragmentos aislados por similitud local. GraphRAG estructura el conocimiento global en jerarquías de comunidad con resúmenes sintéticos, facilitando la síntesis temática de documentos completos."
      },
      {
        question: "¿Cuál es el propósito técnico fundamental de un Evaluation Harness (ej. lm-evaluation-harness de EleutherAI)?",
        options: [
          "Automatizar la evaluación cuantitativa, científica y reproducible de modelos bajo condiciones estrictas (temperatura T=0, plantillas unificadas y parsers de regex) sobre benchmarks de frontera como MMLU, GSM8K y ARC.",
          "Servir como interfaz de chat para usuarios finales en aplicaciones web.",
          "Acelerar la velocidad de cómputo en inferencia mediante cuantización de tensores."
        ],
        correct: 0,
        explanation: "Un Harness estandariza la batería de exámenes, el formateo de prompts y la extracción objetiva de respuestas numéricas o de opción múltiple, evitando la subjetividad de pruebas no controladas."
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
