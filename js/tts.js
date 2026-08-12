// ============================================
// CURSO IA COMMERCIAL - Text to Speech
// Uses Web Speech API (Local & Free)
// ============================================

(function() {
  let isPlaying = false;
  let currentUtterance = null;
  let synth = window.speechSynthesis;
  let ttsButton = null;

  function createTTSButton() {
    ttsButton = document.createElement('button');
    ttsButton.id = 'tts-fab';
    ttsButton.setAttribute('aria-label', 'Escuchar cuaderno');
    ttsButton.title = 'Escuchar cuaderno (Text-to-Speech)';
    ttsButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
    
    // Style directly or via CSS (assuming we will add it to CSS)
    document.body.appendChild(ttsButton);

    ttsButton.addEventListener('click', toggleSpeech);
  }

  function getReadableText() {
    const content = document.querySelector('.main-content');
    if (!content) return '';
    
    // Extract text specifically from paragraphs and headings inside transcript-section
    const elements = content.querySelectorAll('.transcript-text p, .transcript-text h2, .transcript-text h3');
    let textToRead = '';
    elements.forEach(el => {
      textToRead += el.innerText + '. ';
    });
    
    return textToRead || "No se encontró texto para leer.";
  }

  function toggleSpeech() {
    if (isPlaying) {
      synth.cancel(); // Stop playing
      isPlaying = false;
      updateButtonState(false);
    } else {
      const text = getReadableText();
      if (!text) return;
      
      currentUtterance = new SpeechSynthesisUtterance(text);
      currentUtterance.lang = 'es-ES'; // Spanish language
      currentUtterance.rate = 1.0; // Normal speed
      
      // Optionally select a specific voice if available
      const voices = synth.getVoices();
      const esVoice = voices.find(v => v.lang.startsWith('es'));
      if (esVoice) {
        currentUtterance.voice = esVoice;
      }
      
      currentUtterance.onend = () => {
        isPlaying = false;
        updateButtonState(false);
      };

      currentUtterance.onerror = (e) => {
        console.error('SpeechSynthesisError:', e);
        isPlaying = false;
        updateButtonState(false);
      };

      synth.speak(currentUtterance);
      isPlaying = true;
      updateButtonState(true);
    }
  }

  function updateButtonState(playing) {
    if (playing) {
      ttsButton.classList.add('playing');
      ttsButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;
    } else {
      ttsButton.classList.remove('playing');
      ttsButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  }

  // Ensure voices are loaded (sometimes it's async)
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      // Voices loaded
    };
  }

  function initTTS() {
    if (document.querySelector('.transcript-section')) {
      createTTSButton();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTTS);
  } else {
    initTTS();
  }

})();
