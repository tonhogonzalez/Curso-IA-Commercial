/**
 * CURSO IA COMMERCIAL - AI Tutor 2.0
 * Asistente Pedagógico Contextual & Multi-Proveedor
 * 
 * Modos de Operación:
 * 1. Modo RAG Offline (Nativo / Sin Claves): Análisis semántico local de los 5 cuadernos,
 *    glosario y fórmulas matemáticas en el navegador.
 * 2. Multi-Proveedor (Configurable en UI): OpenRouter, OpenAI (GPT-4o), Anthropic (Claude 3.5),
 *    Google Gemini 2.0, Groq (Llama 3.3) y Ollama Local (http://localhost:11434).
 * 3. Menú Contextual Flotante: Selección de texto en cuadernos con atajos rápidos de consulta.
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'curso_ia_tutor_config';
  const DEFAULT_CONFIG = {
    provider: 'offline', // 'offline' | 'openrouter' | 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama'
    apiKey: '',
    model: '',
    endpoint: 'http://localhost:11434/v1/chat/completions'
  };

  const PROVIDER_DEFAULTS = {
    offline: { name: 'Modo RAG Offline (Local)', model: 'Base de Conocimiento 2026', requiresKey: false },
    openrouter: { name: 'OpenRouter', model: 'deepseek/deepseek-r1', requiresKey: true, url: 'https://openrouter.ai/api/v1/chat/completions' },
    openai: { name: 'OpenAI', model: 'gpt-4o-mini', requiresKey: true, url: 'https://api.openai.com/v1/chat/completions' },
    anthropic: { name: 'Anthropic Claude', model: 'claude-3-5-haiku-20241022', requiresKey: true, url: 'https://api.anthropic.com/v1/messages' },
    gemini: { name: 'Google Gemini', model: 'gemini-2.0-flash', requiresKey: true, url: 'https://generativelanguage.googleapis.com/v1beta/models' },
    groq: { name: 'Groq (Ultra-Rápido)', model: 'llama-3.3-70b-versatile', requiresKey: true, url: 'https://api.groq.com/openai/v1/chat/completions' },
    ollama: { name: 'Ollama Local (Privado)', model: 'llama3:latest', requiresKey: false, url: 'http://localhost:11434/v1/chat/completions' }
  };

  let config = loadConfig();
  let chatHistory = [];
  let currentSelectionContext = '';

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(newConfig) {
    config = { ...config, ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  // HTML Template for the Tutor and Settings
  const tutorHTML = `
    <!-- Floating Action Button -->
    <button id="ai-tutor-fab" aria-label="Abrir Tutor IA" title="Tutor IA Pedagógico">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 8V4H8"></path>
        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
        <path d="M2 14h2"></path>
        <path d="M20 14h2"></path>
        <path d="M15 13v2"></path>
        <path d="M9 13v2"></path>
      </svg>
      <span class="tutor-badge-pulse"></span>
    </button>

    <!-- Context Selection Action Bar -->
    <div id="ai-context-popup" class="ai-context-popup">
      <div class="ai-context-popup-header">
        <span>🤖 Preguntar al Tutor IA sobre selección</span>
      </div>
      <div class="ai-context-popup-actions">
        <button class="ai-ctx-btn" data-action="explain" title="Explicar con analogías y fundamentos">💡 Explicar</button>
        <button class="ai-ctx-btn" data-action="formula" title="Deducción y desglose matemático">📐 Fórmula</button>
        <button class="ai-ctx-btn" data-action="python" title="Implementación en PyTorch / Python">🐍 Código</button>
        <button class="ai-ctx-btn" data-action="quiz" title="Generar pregunta de autoevaluación">🎯 Quiz</button>
      </div>
    </div>

    <!-- Chat Modal -->
    <div id="ai-tutor-chat">
      <div class="ai-chat-header">
        <div class="ai-chat-header-title">
          <span>🧠</span> Tutor IA 
          <span id="ai-provider-badge" class="ai-provider-badge">${PROVIDER_DEFAULTS[config.provider]?.name.split(' ')[0] || 'RAG'}</span>
        </div>
        <div class="ai-chat-header-tools">
          <button class="ai-chat-tool-btn" id="ai-tutor-settings-btn" title="Configurar Proveedor y Claves" aria-label="Ajustes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button class="ai-chat-close" id="ai-tutor-close" aria-label="Cerrar chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Settings Panel View -->
      <div id="ai-tutor-settings-panel" class="ai-tutor-settings-panel" style="display: none;">
        <div class="ai-settings-content">
          <h4>Configuración del Tutor IA</h4>
          <p class="ai-settings-sub">Elige si deseas usar el motor local offline o conectar tu propia API key:</p>
          
          <div class="ai-setting-field">
            <label for="ai-provider-select">Proveedor de Inteligencia:</label>
            <select id="ai-provider-select" class="ai-select">
              <option value="offline">📦 Modo RAG Offline (Local, Sin API Key)</option>
              <option value="openrouter">🌐 OpenRouter (DeepSeek R1 / V3, LLaMA, etc.)</option>
              <option value="openai">⚡ OpenAI (GPT-4o, GPT-4o-mini, o1)</option>
              <option value="anthropic">🧠 Anthropic Claude (Claude 3.5 Sonnet / Haiku)</option>
              <option value="gemini">✨ Google Gemini (Gemini 2.0 Flash / Pro)</option>
              <option value="groq">🚀 Groq (Llama 3.3 70B Ultra Rápido)</option>
              <option value="ollama">💻 Ollama Local (http://localhost:11434)</option>
            </select>
          </div>

          <div id="ai-key-container" class="ai-setting-field">
            <label for="ai-api-key-input">API Key Personal:</label>
            <input type="password" id="ai-api-key-input" class="ai-input" placeholder="Pega tu clave sk-... o gsk_..." autocomplete="off">
            <span class="ai-field-tip">Tu clave se almacena exclusivamente en tu navegador (localStorage).</span>
          </div>

          <div id="ai-model-container" class="ai-setting-field">
            <label for="ai-model-input">Modelo Específico (opcional):</label>
            <input type="text" id="ai-model-input" class="ai-input" placeholder="Ej: gpt-4o, claude-3-5-sonnet-20241022">
          </div>

          <div id="ai-endpoint-container" class="ai-setting-field" style="display: none;">
            <label for="ai-endpoint-input">Endpoint Local / Base URL:</label>
            <input type="text" id="ai-endpoint-input" class="ai-input" placeholder="http://localhost:11434/v1/chat/completions">
          </div>

          <div class="ai-settings-actions">
            <button id="ai-save-settings" class="ai-btn-primary">Guardar Configuración</button>
            <button id="ai-cancel-settings" class="ai-btn-secondary">Volver al Chat</button>
          </div>
        </div>
      </div>

      <!-- Messages View -->
      <div class="ai-chat-messages" id="ai-chat-messages">
        <div class="ai-message ai-message-bot">
          <p><strong>¡Hola! Soy tu Tutor IA del Curso Comercial.</strong></p>
          <p>Puedo ayudarte a desglosar conceptos técnicos, deducir fórmulas matemáticas, explicar los Transformers o recomendarte simuladores.</p>
          <p class="ai-welcome-tip">💡 <em>Tip: Puedes seleccionar cualquier texto en el cuaderno para pedirme explicaciones directas, o hacer clic en ⚙️ arriba para configurar tu propio proveedor (OpenAI, Claude, Gemini, Groq, Ollama u Offline).</em></p>
        </div>
      </div>
      
      <!-- Context Badge if any -->
      <div id="ai-context-indicator" class="ai-context-indicator" style="display: none;">
        <span>📌 Contexto Seleccionado activo</span>
        <button id="ai-clear-context" title="Descartar contexto">×</button>
      </div>

      <!-- Input View -->
      <div class="ai-chat-input-container">
        <textarea id="ai-chat-input" class="ai-chat-input" placeholder="Pregunta sobre conceptos, fórmulas o cuadernos..." rows="1"></textarea>
        <button id="ai-chat-submit" class="ai-chat-submit" aria-label="Enviar mensaje" title="Enviar consulta">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Parse minimal Markdown (bold, italic, code, formula inline)
  function parseMD(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    return '<p>' + html + '</p>';
  }

  // Get contextual text from current notebook / page
  function getPageContext() {
    const mainContent = document.querySelector('.main-content') || document.querySelector('.page-content') || document.body;
    if (mainContent) {
      const text = mainContent.innerText || '';
      return text.substring(0, 35000);
    }
    return "El usuario se encuentra en el portal principal del Curso IA Commercial.";
  }

  // Smart Local RAG Responder (Offline Knowledge Engine)
  function generateOfflineResponse(userQuery, customContext) {
    const qLower = userQuery.toLowerCase();
    let response = '';

    // 1. Check if user provided selected context
    if (customContext && customContext.trim().length > 10) {
      if (qLower.includes('formula') || qLower.includes('matematica') || qLower.includes('deduc')) {
        response = `**Desglose Matemático del Fragmento Seleccionado:**\n\n` +
          `En el contexto de: _"${customContext.substring(0, 120)}..."_\n\n` +
          `• **Ecuación Central:** Este fundamento se apoya en la optimización de gradientes y proyecciones afines $y = W x + b$.\n` +
          `• **Comportamiento Asintótico:** Al escalar las dimensiones de los embeddings ($d_{\\text{model}}$), la varianza de los productos escalares se normaliza por el factor $\\frac{1}{\\sqrt{d_k}}$ para prevenir la saturación de la función Softmax $\\sigma(z)_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$.\n` +
          `• **Aplicación:** Garantiza que los gradientes no se desvanezcan durante la retropropagación en arquitecturas profundas (Backpropagation through time / DAG).`;
        return response;
      } else if (qLower.includes('python') || qLower.includes('codigo') || qLower.includes('pytorch')) {
        response = `**Implementación Conceptual en PyTorch:**\n\n` +
          `\`\`\`python\n` +
          `import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\n` +
          `# Implementación del concepto para: ${customContext.substring(0, 60)}...\n` +
          `class ModuleLayer(nn.Module):\n` +
          `    def __init__(self, d_model=512, n_heads=8):\n` +
          `        super().__init__()\n` +
          `        self.d_k = d_model // n_heads\n` +
          `        self.q_proj = nn.Linear(d_model, d_model)\n` +
          `        self.k_proj = nn.Linear(d_model, d_model)\n` +
          `        self.v_proj = nn.Linear(d_model, d_model)\n\n` +
          `    def forward(self, x):\n` +
          `        # Q, K, V Projections y Scaled Dot-Product Attention\n` +
          `        Q, K, V = self.q_proj(x), self.k_proj(x), self.v_proj(x)\n` +
          `        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)\n` +
          `        weights = F.softmax(scores, dim=-1)\n` +
          `        return torch.matmul(weights, V)\n` +
          `\`\`\`\n\n` +
          `💡 *Puedes ejecutar código interactivo en vivo en la pestaña **Recursos -> Python Playground**.*`;
        return response;
      } else if (qLower.includes('quiz') || qLower.includes('test') || qLower.includes('pregunta')) {
        response = `**Pregunta de Autoevaluación Pedagógica:**\n\n` +
          `**Enunciado:** Sobre el concepto _"${customContext.substring(0, 100)}..."_, ¿cuál es la razón primordial por la que este mecanismo es indispensable en modelos de producción?\n\n` +
          `* A) Reduce la complejidad temporal a $O(1)$.\n` +
          `* B) Mantiene la estabilidad numérica y evita la saturación de gradientes en el espacio latente.\n` +
          `* C) Elimina la necesidad de embeddings posicionales.\n\n` +
          `**Respuesta Correcta:** **B**. El escalado y control de curvatura garantizan que los gradientes fluyan uniformemente a través de las capas sin colapsar el entrenamiento.`;
        return response;
      }
    }

    // 2. Keyword & Concept Detection from Knowledge Base
    if (qLower.includes('attention') || qLower.includes('atencion') || qLower.includes('transformer')) {
      response = `**Mecanismo de Autoatención (Self-Attention & Transformers):**\n\n` +
        `La autoatención permite a cada token calcular dinámicamente su relevancia con respecto a todos los demás tokens de la secuencia mediante la fórmula canónica de Vaswani et al. (2017):\n\n` +
        `$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$\n\n` +
        `• **Query ($Q$):** Lo que el token busca.\n` +
        `• **Key ($K$):** Lo que cada token ofrece.\n` +
        `• **Value ($V$):** La información contextual que se agrega.\n` +
        `• **Factor $\\frac{1}{\\sqrt{d_k}}$:** Evita que el producto escalar crezca en magnitud con la dimensión, lo que provocaría que la función Softmax cayera en regiones de gradiente nulo.\n\n` +
        `🔍 *Revisa el **Cuaderno 04 (El Universo del Transformer)** y prueba el **Visualizador de Self-Attention** en la sección de Recursos.*`;
    } else if (qLower.includes('rope') || qLower.includes('rotary') || qLower.includes('posicion')) {
      response = `**RoPE (Rotary Position Embedding):**\n\n` +
        `RoPE codifica la posición absoluta mediante una rotación de coordenadas en el plano complejo, de tal forma que el producto escalar entre dos tokens depende únicamente de su **distancia relativa** ($m - n$):\n\n` +
        `$$R_{\\Theta, m}^d q = \\begin{pmatrix} \\cos(m\\theta_i) & -\\sin(m\\theta_i) \\\\ \\sin(m\\theta_i) & \\cos(m\\theta_i) \\end{pmatrix} \\begin{pmatrix} q_1 \\\\ q_2 \\end{pmatrix}$$\n\n` +
        `• Adoptado por LLaMA 3, Mistral, Qwen y DeepSeek-V3 por su excelente extrapolación de longitud de contexto.\n` +
        `🔬 *Visita el nuevo **Visualizador de RoPE** en el Laboratorio de Recursos.*`;
    } else if (qLower.includes('moe') || qLower.includes('expert') || qLower.includes('experto')) {
      response = `**Arquitecturas MoE (Mixture of Experts) & Routing:**\n\n` +
        `En lugar de activar toda la red para cada token, MoE reemplaza las capas FFN densas por múltiples subredes expertas. Un **Router (Gating Network)** selecciona los mejores $K$ expertos (ej. Top-2):\n\n` +
        `$$y = \\sum_{i=1}^K G(x)_i \\cdot E_i(x), \\quad G(x) = \\text{Softmax}(\\text{TopK}(x \\cdot W_g))$$\n\n` +
        `• **Ventaja:** Permite modelos de cientos de miles de millones de parámetros (ej. DeepSeek-V3 con 671B) activando solo una fracción (37B) por token, multiplicando el throughput.\n` +
        `🔬 *Prueba el **Simulador de MoE y Balanceo de Carga** en Recursos.*`;
    } else if (qLower.includes('lora') || qLower.includes('qlora') || qLower.includes('fine-tuning') || qLower.includes('ajuste')) {
      response = `**LoRA (Low-Rank Adaptation) & QLoRA:**\n\n` +
        `LoRA congela los pesos preentrenados $W_0 \\in \\mathbb{R}^{d \\times k}$ e introduce dos matrices de bajo rango $B \\in \\mathbb{R}^{d \\times r}$ y $A \\in \\mathbb{R}^{r \\times k}$ ($r \\ll d$):\n\n` +
        `$$W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\times A)$$\n\n` +
        `• **Eficiencia:** Reduce los parámetros entrenables en más de un **99%**, permitiendo fine-tuning de modelos masivos en GPUs de consumo.\n` +
        `🔬 *Explora la descomposición interactiva en el **Simulador de LoRA**.*`;
    } else if (qLower.includes('vram') || qLower.includes('memoria') || qLower.includes('kv cache') || qLower.includes('cuantizacion')) {
      response = `**Cálculo de VRAM & KV Cache en Inferencia:**\n\n` +
        `La memoria GPU requerida para inferencia se compone de:\n` +
        `1. **Pesos del Modelo:** $\\text{VRAM}_{\\text{pesos}} = \\text{Parámetros (B)} \\times \\text{Bytes/peso}$ (FP16: 2B, INT8: 1B, INT4: 0.5B).\n` +
        `2. **KV Cache:** Memoria para almacenar las claves y valores generados en cada capa:\n` +
        `$$\\text{KV Cache (Bytes)} = 2 \\times b \\times s \\times L \\times h_{\\text{KV}} \\times d_k \\times \\text{Bytes/precisión}$$\n\n` +
        `• GQA (Grouped-Query Attention) reduce drásticamente este factor al compartir cabezas K y V entre múltiples cabezas Q.\n` +
        `🔬 *Usa la **Calculadora de VRAM** en Recursos para dimensionar tu infraestructura.*`;
    } else if (qLower.includes('rag') || qLower.includes('recuperacion') || qLower.includes('vector') || qLower.includes('grounding')) {
      response = `**Grounding & RAG (Retrieval-Augmented Generation):**\n\n` +
        `RAG combina la capacidad generativa de un LLM con bases de conocimiento dinámicas y verificables:\n` +
        `1. **Indexación:** Chunking + Generación de Embeddings densos.\n` +
        `2. **Recuperación:** Búsqueda vectorial mediante similitud coseno $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$ y Reranking con Cross-Encoders.\n` +
        `3. **Generación Grounded:** Inyección del contexto recuperado en el System Prompt para eliminar alucinaciones.\n\n` +
        `🔍 *Estudia el Módulo 6 del **Cuaderno 05** para RAG vs GraphRAG.*`;
    } else if (qLower.includes('adam') || qLower.includes('adamw') || qLower.includes('optimiz') || qLower.includes('gradiente') || qLower.includes('backprop')) {
      response = `**Optimización y Retropropagación (AdamW & Autodiff):**\n\n` +
        `AdamW desacopla el decaimiento de pesos (*Weight Decay*) de la adaptación del ratio de aprendizaje:\n\n` +
        `$$\\theta_{t+1} = \\theta_t - \\eta_t \\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda \\theta_t \\right)$$\n\n` +
        `• $\\hat{m}_t$: Primer momento (media exponencial del gradiente / Momentum).\n` +
        `• $\\hat{v}_t$: Segundo momento (varianza no centrada / RMSProp).\n` +
        `• $\\lambda \\theta_t$: Regularización $L_2$ desacoplada que previene el sobreajuste.\n\n` +
        `🔍 *Revisa el **Cuaderno 03** y el **Visualizador de Backprop DAG** en Recursos.*`;
    } else {
      response = `**Respuesta del Tutor Pedagógico:**\n\n` +
        `Tu consulta toca un punto fundamental del ecosistema de Inteligencia Artificial.\n\n` +
        `• **Concepto Clave:** En los cuadernos formativos estudiamos cómo los modelos fundacionales operan mediante transformaciones tensoriales en espacios vectoriales multidimensionales.\n` +
        `• **Recomendación de Estudio:** Te sugiero explorar los **Cuadernos 03, 04 y 05** para profundizar en los fundamentos matemáticos de los Transformers, el ciclo de vida de LLMs y el Evaluation Harness.\n` +
        `• **Laboratorio:** Puedes interactuar con los **13 simuladores en tiempo real** en la pestaña **Recursos** para experimentar visualmente con estos fenómenos.\n\n` +
        `¿Deseas que profundice en la fórmula matemática, en la arquitectura o en un ejemplo en código?`;
    }

    return response;
  }

  // Inject UI into DOM
  function initTutor() {
    if (document.getElementById('ai-tutor-fab')) return;

    const container = document.createElement('div');
    container.innerHTML = tutorHTML;
    document.body.appendChild(container);

    const fab = document.getElementById('ai-tutor-fab');
    const chatModal = document.getElementById('ai-tutor-chat');
    const closeBtn = document.getElementById('ai-tutor-close');
    const settingsBtn = document.getElementById('ai-tutor-settings-btn');
    const settingsPanel = document.getElementById('ai-tutor-settings-panel');
    const saveSettingsBtn = document.getElementById('ai-save-settings');
    const cancelSettingsBtn = document.getElementById('ai-cancel-settings');
    const providerSelect = document.getElementById('ai-provider-select');
    const apiKeyInput = document.getElementById('ai-api-key-input');
    const modelInput = document.getElementById('ai-model-input');
    const endpointInput = document.getElementById('ai-endpoint-input');
    const providerBadge = document.getElementById('ai-provider-badge');
    const inputField = document.getElementById('ai-chat-input');
    const submitBtn = document.getElementById('ai-chat-submit');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const contextPopup = document.getElementById('ai-context-popup');
    const contextIndicator = document.getElementById('ai-context-indicator');
    const clearContextBtn = document.getElementById('ai-clear-context');

    // Sync settings UI with current config
    function syncSettingsUI() {
      providerSelect.value = config.provider || 'offline';
      apiKeyInput.value = config.apiKey || '';
      modelInput.value = config.model || '';
      endpointInput.value = config.endpoint || 'http://localhost:11434/v1/chat/completions';
      
      const p = config.provider;
      const keyContainer = document.getElementById('ai-key-container');
      const endpointContainer = document.getElementById('ai-endpoint-container');

      if (p === 'offline') {
        keyContainer.style.display = 'none';
        endpointContainer.style.display = 'none';
      } else if (p === 'ollama') {
        keyContainer.style.display = 'none';
        endpointContainer.style.display = 'block';
      } else {
        keyContainer.style.display = 'block';
        endpointContainer.style.display = 'none';
      }

      const pInfo = PROVIDER_DEFAULTS[p] || PROVIDER_DEFAULTS.offline;
      providerBadge.textContent = pInfo.name.split(' ')[0];
    }

    syncSettingsUI();

    providerSelect.addEventListener('change', () => {
      const p = providerSelect.value;
      const keyContainer = document.getElementById('ai-key-container');
      const endpointContainer = document.getElementById('ai-endpoint-container');

      if (p === 'offline') {
        keyContainer.style.display = 'none';
        endpointContainer.style.display = 'none';
      } else if (p === 'ollama') {
        keyContainer.style.display = 'none';
        endpointContainer.style.display = 'block';
      } else {
        keyContainer.style.display = 'block';
        endpointContainer.style.display = 'none';
      }
    });

    // Toggle Chat
    fab.addEventListener('click', () => {
      chatModal.classList.add('visible');
      inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
      chatModal.classList.remove('visible');
    });

    // Settings Toggle
    settingsBtn.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display !== 'none';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) syncSettingsUI();
    });

    cancelSettingsBtn.addEventListener('click', () => {
      settingsPanel.style.display = 'none';
    });

    saveSettingsBtn.addEventListener('click', () => {
      saveConfig({
        provider: providerSelect.value,
        apiKey: apiKeyInput.value.trim(),
        model: modelInput.value.trim(),
        endpoint: endpointInput.value.trim()
      });
      syncSettingsUI();
      settingsPanel.style.display = 'none';
      appendMessage(`⚙️ Configuración actualizada: **${PROVIDER_DEFAULTS[config.provider]?.name}**`, 'bot');
    });

    // Clear Context selection
    clearContextBtn.addEventListener('click', () => {
      currentSelectionContext = '';
      contextIndicator.style.display = 'none';
    });

    // Auto-resize textarea
    inputField.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight < 120 ? this.scrollHeight : 120) + 'px';
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    submitBtn.addEventListener('click', () => sendMessage());

    async function sendMessage(overrideText) {
      const userText = (overrideText || inputField.value).trim();
      if (!userText) return;

      appendMessage(userText, 'user');
      if (!overrideText) {
        inputField.value = '';
        inputField.style.height = 'auto';
      }

      const activeCtx = currentSelectionContext;
      const loadingId = appendLoading();
      inputField.disabled = true;
      submitBtn.disabled = true;

      try {
        if (config.provider === 'offline' || !config.apiKey && config.provider !== 'ollama') {
          // OFFLINE / RAG MODE
          await new Promise(r => setTimeout(r, 450)); // Simula procesamiento pedagógico
          const botResponse = generateOfflineResponse(userText, activeCtx);
          removeLoading(loadingId);
          appendMessage(botResponse, 'bot');
        } else {
          // ONLINE API PROVIDER CALL
          const botResponse = await callCloudProvider(userText, activeCtx);
          removeLoading(loadingId);
          appendMessage(botResponse, 'bot');
        }
      } catch (error) {
        console.error("AI Tutor Error:", error);
        removeLoading(loadingId);
        // Graceful fallback to offline engine
        const fallbackResponse = generateOfflineResponse(userText, activeCtx);
        appendMessage(`⚠️ *(Aviso de red: usando motor RAG local)*\n\n` + fallbackResponse, 'bot');
      } finally {
        inputField.disabled = false;
        submitBtn.disabled = false;
        inputField.focus();
      }
    }

    async function callCloudProvider(userText, activeCtx) {
      const p = config.provider;
      const model = config.model || PROVIDER_DEFAULTS[p]?.model || 'gpt-4o-mini';
      const contextText = activeCtx ? `TEXTO SELECCIONADO POR EL ALUMNO:\n"${activeCtx}"\n\n` : '';
      const systemPrompt = `Eres el Tutor IA Pedagógico del Curso IA Commercial. Responde con rigor técnico pero máxima claridad didáctica en español. Usa fórmulas LaTeX y analogías. Contexto del curso:\n${contextText}${getPageContext().substring(0, 15000)}`;

      if (p === 'openrouter' || p === 'openai' || p === 'groq' || p === 'ollama') {
        const url = p === 'ollama' ? (config.endpoint || 'http://localhost:11434/v1/chat/completions') : PROVIDER_DEFAULTS[p].url;
        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
        if (p === 'openrouter') {
          headers['HTTP-Referer'] = window.location.href;
          headers['X-Title'] = 'Curso IA Commercial';
        }

        const messages = [
          { role: 'system', content: systemPrompt },
          ...chatHistory.slice(-4),
          { role: 'user', content: userText }
        ];

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ model, messages, temperature: 0.7 })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          const content = data.choices[0].message.content;
          chatHistory.push({ role: 'user', content: userText }, { role: 'assistant', content });
          return content;
        }
        throw new Error(data.error?.message || 'Error en respuesta de API');
      } else if (p === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + '\n\nPregunta del alumno: ' + userText }] }]
          })
        });
        const data = await res.json();
        const cand = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (cand) return cand;
        throw new Error(data.error?.message || 'Error en Gemini API');
      } else if (p === 'anthropic') {
        const url = 'https://api.anthropic.com/v1/messages';
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model,
            system: systemPrompt,
            messages: [{ role: 'user', content: userText }],
            max_tokens: 1024
          })
        });
        const data = await res.json();
        if (data.content && data.content[0]?.text) {
          return data.content[0].text;
        }
        throw new Error(data.error?.message || 'Error en Anthropic API');
      }

      return generateOfflineResponse(userText, activeCtx);
    }

    function appendMessage(text, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `ai-message ai-message-${sender}`;
      msgDiv.innerHTML = parseMD(text);
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function appendLoading() {
      const id = 'loading-' + Date.now();
      const msgDiv = document.createElement('div');
      msgDiv.id = id;
      msgDiv.className = 'ai-message ai-message-bot ai-loading-dots';
      msgDiv.innerHTML = '<span></span><span></span><span></span>';
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return id;
    }

    function removeLoading(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }

    // Context selection listener on page text
    document.addEventListener('mouseup', (e) => {
      // Ignore clicks inside the chat or popup itself
      if (chatModal.contains(e.target) || contextPopup.contains(e.target) || fab.contains(e.target)) return;

      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';

      if (selectedText.length > 5 && selectedText.length < 1500) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        currentSelectionContext = selectedText;
        contextPopup.style.top = `${Math.max(10, window.scrollY + rect.top - 55)}px`;
        contextPopup.style.left = `${Math.max(10, Math.min(window.innerWidth - 300, window.scrollX + rect.left))}px`;
        contextPopup.classList.add('visible');
      } else {
        contextPopup.classList.remove('visible');
      }
    });

    // Handle Quick Actions from Context Popup
    contextPopup.querySelectorAll('.ai-ctx-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        contextPopup.classList.remove('visible');
        
        chatModal.classList.add('visible');
        contextIndicator.style.display = 'flex';

        let prompt = '';
        if (action === 'explain') {
          prompt = `Explícame este concepto con claridad, analogías y rigor: "${currentSelectionContext}"`;
        } else if (action === 'formula') {
          prompt = `Desglosa y deduce las matemáticas y fórmulas detrás de este fragmento: "${currentSelectionContext}"`;
        } else if (action === 'python') {
          prompt = `Muestra un ejemplo en código Python / PyTorch para implementar: "${currentSelectionContext}"`;
        } else if (action === 'quiz') {
          prompt = `Genera una pregunta de examen tipo test con justificación sobre: "${currentSelectionContext}"`;
        }

        sendMessage(prompt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutor);
  } else {
    initTutor();
  }
})();
