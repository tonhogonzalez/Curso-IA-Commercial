// ============================================
// CURSO IA COMMERCIAL - Text to Speech 2.0
// Smart Synchronous Audio Narrator with Karaoke Highlight
// ============================================

(function() {
  'use strict';

  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not supported in this browser.');
    return;
  }

  const synth = window.speechSynthesis;
  let voices = [];
  let isPlaying = false;
  let isPaused = false;
  let currentRate = 1.0;
  let currentVoice = null;
  let textQueue = [];
  let currentQueueIndex = 0;
  let activeElement = null;

  // DOM elements
  let playerContainer = null;
  let playPauseBtn = null;
  let stopBtn = null;
  let speedBtn = null;
  let trackTitleEl = null;
  let trackProgressEl = null;

  function loadVoices() {
    voices = synth.getVoices().filter(v => v.lang.startsWith('es') || v.lang.includes('Spanish'));
    if (voices.length === 0) {
      voices = synth.getVoices();
    }
    // Prefer natural / neutral Spanish voices if present
    currentVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')) || voices[0];
  }

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();

  // Create Modern Floating Glassmorphism Player Dock
  function createPlayerUI() {
    if (document.getElementById('tts-dock-player')) return;

    playerContainer = document.createElement('div');
    playerContainer.id = 'tts-dock-player';
    playerContainer.className = 'tts-dock';
    playerContainer.innerHTML = `
      <div class="tts-dock-drag">
        <span class="tts-wave-icon">
          <span></span><span></span><span></span><span></span>
        </span>
        <div class="tts-info">
          <span class="tts-track-title" id="tts-track-title">Narrador de Cuaderno</span>
          <span class="tts-track-sub" id="tts-track-sub">Listo para reproducir</span>
        </div>
      </div>
      <div class="tts-controls">
        <button class="tts-btn" id="tts-prev-btn" title="Párrafo anterior" aria-label="Anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button class="tts-btn tts-btn-primary" id="tts-play-btn" title="Reproducir / Pausar" aria-label="Reproducir">
          <svg id="tts-icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <svg id="tts-icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        </button>
        <button class="tts-btn" id="tts-next-btn" title="Párrafo siguiente" aria-label="Siguiente">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
        <button class="tts-btn" id="tts-speed-btn" title="Velocidad de reproducción">1.0x</button>
        <button class="tts-btn tts-btn-close" id="tts-stop-btn" title="Cerrar reproductor" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="tts-progress-line" id="tts-progress-line" style="width: 0%;"></div>
    `;

    document.body.appendChild(playerContainer);

    playPauseBtn = document.getElementById('tts-play-btn');
    stopBtn = document.getElementById('tts-stop-btn');
    speedBtn = document.getElementById('tts-speed-btn');
    trackTitleEl = document.getElementById('tts-track-title');
    trackProgressEl = document.getElementById('tts-progress-line');

    playPauseBtn.addEventListener('click', togglePlayPause);
    stopBtn.addEventListener('click', stopReading);
    
    document.getElementById('tts-prev-btn').addEventListener('click', () => {
      if (currentQueueIndex > 0) {
        currentQueueIndex = Math.max(0, currentQueueIndex - 2);
        synth.cancel();
        playNextInQueue();
      }
    });

    document.getElementById('tts-next-btn').addEventListener('click', () => {
      if (currentQueueIndex < textQueue.length) {
        synth.cancel();
        playNextInQueue();
      }
    });

    speedBtn.addEventListener('click', () => {
      const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
      const nextIdx = (speeds.indexOf(currentRate) + 1) % speeds.length;
      currentRate = speeds[nextIdx];
      speedBtn.textContent = `${currentRate}x`;
      if (isPlaying && !isPaused) {
        // Restart current piece at new speed
        const currentItem = textQueue[currentQueueIndex - 1];
        if (currentItem) {
          currentQueueIndex--;
          synth.cancel();
          playNextInQueue();
        }
      }
    });
  }

  // Inject "🎧 Escuchar Sección" Buttons into all .section-header elements
  function injectSectionAudioButtons() {
    const sections = document.querySelectorAll('.transcript-section');
    sections.forEach((sec, idx) => {
      const header = sec.querySelector('.section-header');
      if (!header || header.querySelector('.tts-section-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'tts-section-btn';
      btn.setAttribute('aria-label', `Escuchar sección ${idx}`);
      btn.title = 'Escuchar esta sección con narrador';
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <span>Escuchar</span>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSection(sec);
      });

      header.appendChild(btn);
    });
  }

  function playSection(sectionEl) {
    stopReading();
    const titleEl = sectionEl.querySelector('.section-title');
    const title = titleEl ? titleEl.innerText : 'Sección';

    // Collect readable elements inside section
    const elements = sectionEl.querySelectorAll('.transcript-text > p, .transcript-text > h3, .transcript-text > h4, .transcript-text > blockquote, .concept-card p, .quote-block p');
    textQueue = [];

    elements.forEach(el => {
      const rawText = el.innerText.trim();
      if (rawText.length > 2) {
        textQueue.push({ el, text: cleanTextForTTS(rawText) });
      }
    });

    if (textQueue.length === 0) return;

    currentQueueIndex = 0;
    showPlayer();
    if (trackTitleEl) trackTitleEl.textContent = title;
    playNextInQueue();
  }

  function playAllNotebook() {
    stopReading();
    const sections = document.querySelectorAll('.transcript-section');
    textQueue = [];

    sections.forEach(sec => {
      const titleEl = sec.querySelector('.section-title');
      if (titleEl) {
        textQueue.push({ el: titleEl, text: titleEl.innerText });
      }
      const elements = sec.querySelectorAll('.transcript-text > p, .transcript-text > h3, .transcript-text > h4, .transcript-text > blockquote, .concept-card p, .quote-block p');
      elements.forEach(el => {
        const rawText = el.innerText.trim();
        if (rawText.length > 2) {
          textQueue.push({ el, text: cleanTextForTTS(rawText) });
        }
      });
    });

    if (textQueue.length === 0) return;

    currentQueueIndex = 0;
    showPlayer();
    const nbTitle = document.querySelector('.page-title');
    if (trackTitleEl) trackTitleEl.textContent = nbTitle ? nbTitle.innerText : 'Cuaderno Completo';
    playNextInQueue();
  }

  function cleanTextForTTS(text) {
    // Remove math delimiters, raw markdown, or citations like [150, 178]
    return text
      .replace(/\[\d+(?:,\s*\d+)*\]/g, '') // remove [150, 178]
      .replace(/\$\$[\s\S]*?\$\$/g, 'ecuación matemática')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/\\mathcal\{O\}/g, 'orden de')
      .replace(/\\mathcal\{L\}/g, 'función de pérdida')
      .replace(/\\approx/g, 'aproximadamente')
      .replace(/\\le/g, 'menor o igual que')
      .replace(/\\ge/g, 'mayor o igual que')
      .replace(/\\times/g, 'por')
      .replace(/\\to/g, 'hacia')
      .replace(/\\sqrt\{([^}]+)\}/g, 'raíz cuadrada de $1')
      .replace(/[\\^_{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function playNextInQueue() {
    if (currentQueueIndex >= textQueue.length) {
      stopReading();
      return;
    }

    const currentItem = textQueue[currentQueueIndex];
    currentQueueIndex++;

    // Update highlight
    if (activeElement) {
      activeElement.classList.remove('speaking-highlight');
    }
    activeElement = currentItem.el;
    if (activeElement) {
      activeElement.classList.add('speaking-highlight');
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update progress
    const progressPct = (currentQueueIndex / textQueue.length) * 100;
    if (trackProgressEl) trackProgressEl.style.width = `${progressPct}%`;
    const subEl = document.getElementById('tts-track-sub');
    if (subEl) subEl.textContent = `Párrafo ${currentQueueIndex} de ${textQueue.length}`;

    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    utterance.lang = 'es-ES';
    utterance.rate = currentRate;
    if (currentVoice) utterance.voice = currentVoice;

    utterance.onend = () => {
      if (isPlaying && !isPaused) {
        playNextInQueue();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS item error:', e);
        if (isPlaying && !isPaused) playNextInQueue();
      }
    };

    isPlaying = true;
    isPaused = false;
    updatePlayPauseIcons(true);
    synth.speak(utterance);
  }

  function togglePlayPause() {
    if (!isPlaying) {
      playAllNotebook();
      return;
    }

    if (isPaused) {
      synth.resume();
      isPaused = false;
      updatePlayPauseIcons(true);
    } else {
      synth.pause();
      isPaused = true;
      updatePlayPauseIcons(false);
    }
  }

  function stopReading() {
    synth.cancel();
    isPlaying = false;
    isPaused = false;
    currentQueueIndex = 0;
    if (activeElement) {
      activeElement.classList.remove('speaking-highlight');
      activeElement = null;
    }
    updatePlayPauseIcons(false);
    if (trackProgressEl) trackProgressEl.style.width = '0%';
    hidePlayer();
  }

  function updatePlayPauseIcons(playing) {
    const playIcon = document.getElementById('tts-icon-play');
    const pauseIcon = document.getElementById('tts-icon-pause');
    const waveIcon = document.querySelector('.tts-wave-icon');
    if (playIcon && pauseIcon) {
      playIcon.style.display = playing ? 'none' : 'block';
      pauseIcon.style.display = playing ? 'block' : 'none';
    }
    if (waveIcon) {
      if (playing) waveIcon.classList.add('active');
      else waveIcon.classList.remove('active');
    }
  }

  function showPlayer() {
    if (playerContainer) {
      playerContainer.classList.add('visible');
    }
  }

  function hidePlayer() {
    if (playerContainer) {
      playerContainer.classList.remove('visible');
    }
  }

  // Keyboard shortcut (Space / K when not typing to play/pause TTS if open)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if ((e.key === 'k' || e.key === 'K') && playerContainer && playerContainer.classList.contains('visible')) {
      e.preventDefault();
      togglePlayPause();
    }
  });

  function init() {
    const isNotebook = window.location.pathname.includes('/cuadernos/');
    if (isNotebook) {
      createPlayerUI();
      injectSectionAudioButtons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global toolbar
  window.CursoIATTS = {
    playAll: playAllNotebook,
    stop: stopReading,
    toggle: togglePlayPause
  };

})();
