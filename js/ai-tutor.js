/**
 * AI Tutor - Contextual Chatbot
 * Integramos OpenRouter API para tener un asistente pedagógico en la plataforma.
 *
 * PARA USO LOCAL: pega tu API key de OpenRouter en la línea de abajo y el tutor se activará.
 * VERSIÓN PÚBLICA: se deja vacía para no exponer la clave. El tutor no se muestra.
 */

(function() {
  const OPENROUTER_API_KEY = ''; // ← Pega tu clave aquí para uso local
  const MODEL_ID = 'z-ai/glm-5.2';

  // Si no hay clave, no cargamos el tutor
  if (!OPENROUTER_API_KEY) return;

  let chatHistory = [];
  
  // HTML Template for the Tutor
  const tutorHTML = `
    <!-- Floating Action Button -->
    <button id="ai-tutor-fab" aria-label="Abrir Tutor IA">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 8V4H8"></path>
        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
        <path d="M2 14h2"></path>
        <path d="M20 14h2"></path>
        <path d="M15 13v2"></path>
        <path d="M9 13v2"></path>
      </svg>
    </button>

    <!-- Chat Modal -->
    <div id="ai-tutor-chat">
      <div class="ai-chat-header">
        <div class="ai-chat-header-title">
          Tutor IA <span>BETA</span>
        </div>
        <button class="ai-chat-close" id="ai-tutor-close" aria-label="Cerrar chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="ai-chat-messages" id="ai-chat-messages">
        <!-- Initial Welcome Message -->
        <div class="ai-message ai-message-bot">
          <p>¡Hola! Soy tu Tutor IA. Estoy aquí para ayudarte a comprender este material.</p>
          <p>¿Qué duda tienes sobre lo que estás leyendo?</p>
        </div>
      </div>
      
      <div class="ai-chat-input-container">
        <textarea id="ai-chat-input" class="ai-chat-input" placeholder="Pregunta sobre el cuaderno..." rows="1"></textarea>
        <button id="ai-chat-submit" class="ai-chat-submit" aria-label="Enviar mensaje">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Parse minimal Markdown (bold, line breaks) to HTML
  function parseMD(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // Get contextual text from the page
  function getPageContext() {
    // If we are in a notebook, grab the main content text
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      // Just extract text to avoid sending HTML tags
      let text = mainContent.innerText || '';
      // Truncate if it's absurdly large, but mostly rely on the model's context window
      return text.substring(0, 40000); 
    }
    return "El usuario está en la página principal (índice) y no dentro de un cuaderno específico.";
  }

  // Inject UI into DOM
  function initTutor() {
    const container = document.createElement('div');
    container.innerHTML = tutorHTML;
    document.body.appendChild(container);

    const fab = document.getElementById('ai-tutor-fab');
    const chatModal = document.getElementById('ai-tutor-chat');
    const closeBtn = document.getElementById('ai-tutor-close');
    const inputField = document.getElementById('ai-chat-input');
    const submitBtn = document.getElementById('ai-chat-submit');
    const messagesContainer = document.getElementById('ai-chat-messages');

    // Toggle Chat
    fab.addEventListener('click', () => {
      chatModal.classList.add('visible');
      inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
      chatModal.classList.remove('visible');
    });

    // Auto-resize textarea
    inputField.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight < 100 ? this.scrollHeight : 100) + 'px';
    });

    // Handle Enter key (Shift+Enter for newline)
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    submitBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
      const userText = inputField.value.trim();
      if (!userText) return;

      // Add user message to UI
      appendMessage(userText, 'user');
      inputField.value = '';
      inputField.style.height = 'auto';
      
      // Setup Chat History for API if empty
      if (chatHistory.length === 0) {
        chatHistory.push({
          role: 'system',
          content: `Eres un Tutor Experto en Inteligencia Artificial y un pedagogo excepcional. Tu rol es ayudar al estudiante a comprender el cuaderno de estudio actual. Responde de forma clara, didáctica y utilizando lenguaje técnico preciso pero accesible. Usa analogías si es necesario. A continuación te proveo el contenido de texto de la página en la que se encuentra el usuario como contexto de estudio:

CONTEXTO DEL CUADERNO ACTUAL:
${getPageContext()}
          `
        });
      }

      chatHistory.push({ role: 'user', content: userText });

      // Add Loading indicator
      const loadingId = appendLoading();
      
      // Disable input while generating
      inputField.disabled = true;
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.href, // Optional but recommended by OpenRouter
            'X-Title': 'Curso IA Commercial', // Optional
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: MODEL_ID,
            messages: chatHistory
          })
        });

        const data = await response.json();
        removeLoading(loadingId);
        
        if (data.choices && data.choices.length > 0) {
          const aiResponse = data.choices[0].message.content;
          chatHistory.push({ role: 'assistant', content: aiResponse });
          appendMessage(aiResponse, 'bot');
        } else {
          console.error("OpenRouter Error:", data);
          appendMessage("Lo siento, ha ocurrido un error al conectar con el servidor de IA.", 'bot');
        }
      } catch (error) {
        console.error("Network Error:", error);
        removeLoading(loadingId);
        appendMessage("Lo siento, hubo un problema de red. Intenta de nuevo.", 'bot');
      } finally {
        inputField.disabled = false;
        submitBtn.disabled = false;
        inputField.focus();
      }
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
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    (function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })( initTutor);
  } else {
    initTutor();
  }
})();
