/**
 * Motor del Sistema de Exámenes Online Avanzado y Certificación
 * Soporta Modo Simulación Oficial (Temporizado, Ciego, Diagnóstico y Certificado)
 * y Modo Estudio / Práctica Guiada (Feedback instantáneo y justificación técnica).
 */

(function() {
  'use strict';

  let currentMode = 'exam'; // 'exam' | 'study'
  let currentFilterModule = 0; // 0 = Todos, 1-10 = Módulo específico
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { qId: selectedOptionIndex }
  let flaggedQuestions = new Set(); // Set of qIds
  let timerInterval = null;
  let remainingSeconds = 90 * 60; // 90 min = 5400 seg
  let examCompleted = false;
  let filteredQuestions = [];

  const STORAGE_KEY = 'exam_ia_master_state';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof EXAM_DATA === 'undefined') {
      console.error('EXAM_DATA no está definido.');
      return;
    }
    initApp();
  });

  function initApp() {
    updateFilteredQuestions();
    loadSavedState();
    setupEventListeners();
    renderUI();
  }

  function updateFilteredQuestions() {
    if (currentFilterModule === 0) {
      filteredQuestions = [...EXAM_DATA.questions];
    } else {
      filteredQuestions = EXAM_DATA.questions.filter(q => q.module === currentFilterModule);
    }
    if (currentQuestionIndex >= filteredQuestions.length) {
      currentQuestionIndex = 0;
    }
  }

  function setupEventListeners() {
    // Modo toggle buttons
    const btnModeExam = document.getElementById('btn-mode-exam');
    const btnModeStudy = document.getElementById('btn-mode-study');
    const moduleSelect = document.getElementById('exam-module-select');

    if (btnModeExam) {
      btnModeExam.addEventListener('click', () => setMode('exam'));
    }
    if (btnModeStudy) {
      btnModeStudy.addEventListener('click', () => setMode('study'));
    }
    if (moduleSelect) {
      moduleSelect.addEventListener('change', (e) => {
        currentFilterModule = parseInt(e.target.value, 10);
        updateFilteredQuestions();
        renderUI();
      });
    }

    // Navigation buttons
    document.getElementById('btn-prev')?.addEventListener('click', () => navigate(-1));
    document.getElementById('btn-next')?.addEventListener('click', () => navigate(1));
    document.getElementById('btn-flag')?.addEventListener('click', toggleFlag);
    document.getElementById('btn-finish-exam')?.addEventListener('click', promptFinishExam);
    document.getElementById('btn-restart-exam')?.addEventListener('click', restartExam);
    document.getElementById('btn-print-certificate')?.addEventListener('click', printCertificate);
    document.getElementById('btn-review-answers')?.addEventListener('click', toggleReviewMode);
  }

  function setMode(mode) {
    currentMode = mode;
    document.getElementById('btn-mode-exam')?.classList.toggle('active', mode === 'exam');
    document.getElementById('btn-mode-study')?.classList.toggle('active', mode === 'study');
    
    const timerEl = document.getElementById('exam-timer-wrapper');
    if (mode === 'exam' && !examCompleted) {
      if (timerEl) timerEl.style.display = 'flex';
      startTimer();
    } else {
      if (timerEl) timerEl.style.display = 'none';
      stopTimer();
    }
    renderUI();
  }

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        stopTimer();
        alert('⏳ ¡El tiempo límite de 90 minutos ha finalizado! Se entregará tu examen automáticamente.');
        finishExam();
      }
      saveState();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const timerDisplay = document.getElementById('exam-timer-value');
    if (!timerDisplay) return;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    if (remainingSeconds < 300) { // Menos de 5 min
      timerDisplay.style.color = 'var(--accent-rose, #ef4444)';
    } else {
      timerDisplay.style.color = 'var(--accent-cyan, #06b6d4)';
    }
  }

  function navigate(delta) {
    const newIdx = currentQuestionIndex + delta;
    if (newIdx >= 0 && newIdx < filteredQuestions.length) {
      currentQuestionIndex = newIdx;
      renderUI();
    }
  }

  function jumpToQuestion(idx) {
    if (idx >= 0 && idx < filteredQuestions.length) {
      currentQuestionIndex = idx;
      renderUI();
    }
  }

  function toggleFlag() {
    const q = filteredQuestions[currentQuestionIndex];
    if (!q) return;
    if (flaggedQuestions.has(q.id)) {
      flaggedQuestions.delete(q.id);
    } else {
      flaggedQuestions.add(q.id);
    }
    saveState();
    renderUI();
  }

  function selectOption(optionIndex) {
    const q = filteredQuestions[currentQuestionIndex];
    if (!q || examCompleted) return;
    userAnswers[q.id] = optionIndex;
    saveState();
    renderUI();
  }

  function promptFinishExam() {
    const answeredCount = Object.keys(userAnswers).length;
    const total = EXAM_DATA.questions.length;
    const pending = total - answeredCount;

    let msg = `¿Deseas entregar y calificar tu examen?\n\n- Preguntas respondidas: ${answeredCount} / ${total}\n- Preguntas sin responder: ${pending}`;
    if (pending > 0) {
      msg += `\n⚠️ Tienes ${pending} preguntas sin responder.`;
    }

    if (confirm(msg)) {
      finishExam();
    }
  }

  function finishExam() {
    examCompleted = true;
    stopTimer();
    saveState();
    renderUI();
    // Scroll al panel de resultados
    document.getElementById('exam-results-panel')?.scrollIntoView({ behavior: 'smooth' });
  }

  function restartExam() {
    if (confirm('¿Estás seguro de reiniciar el examen? Se borrarán todas las respuestas actuales y comenzará una nueva convocatoria.')) {
      userAnswers = {};
      flaggedQuestions.clear();
      remainingSeconds = 90 * 60;
      examCompleted = false;
      currentQuestionIndex = 0;
      localStorage.removeItem(STORAGE_KEY);
      if (currentMode === 'exam') startTimer();
      renderUI();
    }
  }

  function renderUI() {
    renderProgressBar();
    renderQuestionGrid();
    renderActiveQuestion();
    renderActionButtons();
    renderResultsPanel();
    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('exam-content-area'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function renderProgressBar() {
    const answeredCount = Object.keys(userAnswers).length;
    const total = EXAM_DATA.questions.length;
    const percent = Math.round((answeredCount / total) * 100);

    const barFill = document.getElementById('exam-progress-bar-fill');
    const barText = document.getElementById('exam-progress-text');
    if (barFill) barFill.style.width = `${percent}%`;
    if (barText) barText.textContent = `${answeredCount} de ${total} Respondidas (${percent}%)`;
  }

  function renderQuestionGrid() {
    const gridContainer = document.getElementById('exam-question-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    filteredQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'grid-num-btn';
      btn.textContent = q.id;

      if (idx === currentQuestionIndex) {
        btn.classList.add('active');
      }

      const isAnswered = userAnswers[q.id] !== undefined;
      const isFlagged = flaggedQuestions.has(q.id);

      if (isAnswered) {
        if (examCompleted || currentMode === 'study') {
          const isCorrect = userAnswers[q.id] === q.correct;
          btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else {
          btn.classList.add('answered');
        }
      }

      if (isFlagged) {
        btn.classList.add('flagged');
      }

      btn.addEventListener('click', () => jumpToQuestion(idx));
      gridContainer.appendChild(btn);
    });
  }

  function renderActiveQuestion() {
    const questionCard = document.getElementById('active-question-card');
    if (!questionCard) return;

    const q = filteredQuestions[currentQuestionIndex];
    if (!q) {
      questionCard.innerHTML = '<p>No hay preguntas en este módulo.</p>';
      return;
    }

    const isFlagged = flaggedQuestions.has(q.id);
    const selectedOpt = userAnswers[q.id];
    const isAnswered = selectedOpt !== undefined;

    let optionsHtml = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, optIdx) => {
      let optClass = 'exam-option';
      if (selectedOpt === optIdx) optClass += ' selected';

      // Feedback visual si estamos en modo estudio o examen entregado
      if (examCompleted || currentMode === 'study') {
        if (optIdx === q.correct) {
          optClass += ' opt-correct';
        } else if (selectedOpt === optIdx && selectedOpt !== q.correct) {
          optClass += ' opt-incorrect';
        }
      }

      optionsHtml += `
        <div class="${optClass}" data-opt-idx="${optIdx}">
          <div class="opt-letter">${letters[optIdx]}</div>
          <div class="opt-text">${optText}</div>
        </div>
      `;
    });

    let feedbackBoxHtml = '';
    if ((examCompleted || currentMode === 'study') && isAnswered) {
      const isCorrect = selectedOpt === q.correct;
      feedbackBoxHtml = `
        <div class="exam-justification-box ${isCorrect ? 'correct-box' : 'incorrect-box'}">
          <div class="justification-header">
            ${isCorrect ? '✅ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}
            <span class="correct-badge">Opción Correcta: <strong>${letters[q.correct]}</strong></span>
          </div>
          <div class="justification-text">
            <strong>Justificación Técnica:</strong> ${q.justification}
          </div>
        </div>
      `;
    }

    questionCard.innerHTML = `
      <div class="question-header">
        <div class="q-meta-tags">
          <span class="q-badge-num">Pregunta ${q.id} de ${EXAM_DATA.totalQuestions}</span>
          <span class="q-badge-mod">M${q.module}: ${q.moduleName}</span>
        </div>
        <button id="btn-toggle-flag" class="flag-action-btn ${isFlagged ? 'flagged' : ''}" title="Marcar para revisión">
          ${isFlagged ? '🚩 Marcada' : '🏳️ Marcar'}
        </button>
      </div>

      <h3 class="question-text">${q.question}</h3>

      <div class="options-container">
        ${optionsHtml}
      </div>

      ${feedbackBoxHtml}
    `;

    // Bind option click
    questionCard.querySelectorAll('.exam-option').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-opt-idx'), 10);
        selectOption(idx);
      });
    });

    // Bind flag toggle inside card
    document.getElementById('btn-toggle-flag')?.addEventListener('click', toggleFlag);
  }

  function renderActionButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const q = filteredQuestions[currentQuestionIndex];

    if (btnPrev) btnPrev.disabled = currentQuestionIndex === 0;
    if (btnNext) btnNext.disabled = currentQuestionIndex === filteredQuestions.length - 1;

    const btnFinish = document.getElementById('btn-finish-exam');
    if (btnFinish) {
      btnFinish.style.display = examCompleted ? 'none' : 'inline-flex';
    }
  }

  function renderResultsPanel() {
    const resultsPanel = document.getElementById('exam-results-panel');
    if (!resultsPanel) return;

    if (!examCompleted) {
      resultsPanel.style.display = 'none';
      return;
    }

    resultsPanel.style.display = 'block';

    // Cálculo estadístico
    let totalScore = 0;
    const moduleStats = {};
    EXAM_DATA.modules.forEach(m => {
      moduleStats[m.id] = { name: m.name, correct: 0, total: 0 };
    });

    EXAM_DATA.questions.forEach(q => {
      moduleStats[q.module].total++;
      if (userAnswers[q.id] === q.correct) {
        totalScore++;
        moduleStats[q.module].correct++;
      }
    });

    const percent = Math.round((totalScore / EXAM_DATA.totalQuestions) * 100);
    const passed = percent >= EXAM_DATA.passingScore;

    // Render stats
    document.getElementById('res-score-number').textContent = `${totalScore} / ${EXAM_DATA.totalQuestions}`;
    document.getElementById('res-score-percent').textContent = `${percent}%`;
    
    const badgeStatus = document.getElementById('res-status-badge');
    if (badgeStatus) {
      badgeStatus.textContent = passed ? '🏆 APROBADO (Certificado Concedido)' : '❌ NO SUPERADO (Requiere Repaso)';
      badgeStatus.className = `res-status-badge ${passed ? 'passed' : 'failed'}`;
    }

    // Render module breakdown bars
    const moduleListEl = document.getElementById('res-modules-breakdown');
    if (moduleListEl) {
      moduleListEl.innerHTML = '';
      EXAM_DATA.modules.forEach(m => {
        const stat = moduleStats[m.id];
        const mPercent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        
        const row = document.createElement('div');
        row.className = 'mod-stat-row';
        row.innerHTML = `
          <div class="mod-stat-header">
            <span class="mod-stat-title">${stat.name}</span>
            <span class="mod-stat-score">${stat.correct}/${stat.total} (${mPercent}%)</span>
          </div>
          <div class="mod-stat-bar">
            <div class="mod-stat-fill ${mPercent >= 75 ? 'fill-good' : (mPercent >= 50 ? 'fill-mid' : 'fill-low')}" style="width: ${mPercent}%;"></div>
          </div>
        `;
        moduleListEl.appendChild(row);
      });
    }

    // Configurar Certificado
    const certSection = document.getElementById('certificate-wrapper');
    if (certSection) {
      if (passed) {
        certSection.style.display = 'block';
        setupCertificateData(percent);
      } else {
        certSection.style.display = 'none';
      }
    }
  }

  function setupCertificateData(percent) {
    const studentInput = document.getElementById('cert-student-name');
    const updateCertName = () => {
      const name = studentInput.value.trim() || 'Ingeniero / Investigador en IA';
      document.getElementById('cert-rendered-name').textContent = name;
    };
    if (studentInput) {
      studentInput.addEventListener('input', updateCertName);
      updateCertName();
    }

    const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('cert-rendered-date').textContent = dateStr;
    document.getElementById('cert-rendered-grade').textContent = `Calificación de Honor: ${percent}% (Nivel de Maestría)`;
    
    // Hash único de verificación
    const hash = 'AGY-CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    document.getElementById('cert-rendered-hash').textContent = `ID de Verificación: ${hash}`;
  }

  function printCertificate() {
    window.print();
  }

  function toggleReviewMode() {
    setMode('study');
    window.scrollTo({ top: document.querySelector('.exam-main-panel').offsetTop - 80, behavior: 'smooth' });
  }

  function saveState() {
    const state = {
      userAnswers,
      flaggedQuestions: Array.from(flaggedQuestions),
      remainingSeconds,
      examCompleted,
      currentMode
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        userAnswers = state.userAnswers || {};
        flaggedQuestions = new Set(state.flaggedQuestions || []);
        remainingSeconds = state.remainingSeconds !== undefined ? state.remainingSeconds : (90 * 60);
        examCompleted = !!state.examCompleted;
        currentMode = state.currentMode || 'exam';

        if (currentMode === 'exam' && !examCompleted) {
          startTimer();
        }
      } else if (currentMode === 'exam') {
        startTimer();
      }
    } catch(e) {
      console.warn('Error cargando estado del examen:', e);
    }
  }

})();
