/**
 * Text Zoom Feature
 * Allows the user to increase or decrease the font size of the notebooks.
 */

(function() {
  function initTextZoom() {
    const topbar = document.querySelector('.top-nav') || document.querySelector('.topbar');
    if (!topbar) return;

    // Create the zoom controls container
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'text-zoom-controls';
    zoomContainer.innerHTML = `
      <button id="btn-zoom-out" class="zoom-btn" title="Reducir texto">A-</button>
      <span id="zoom-level-indicator">100%</span>
      <button id="btn-zoom-in" class="zoom-btn" title="Ampliar texto">A+</button>
    `;

    // Append to topbar
    topbar.appendChild(zoomContainer);

    let currentLevel = 0; // 0 = normal, 1 = large, 2 = extra large, 3 = max
    const maxLevel = 3;
    const minLevel = 0;

    const btnOut = document.getElementById('btn-zoom-out');
    const btnIn = document.getElementById('btn-zoom-in');
    const indicator = document.getElementById('zoom-level-indicator');

    function updateZoom() {
      // Remove all zoom classes
      document.body.classList.remove('text-zoom-1', 'text-zoom-2', 'text-zoom-3');
      
      if (currentLevel > 0) {
        document.body.classList.add(`text-zoom-${currentLevel}`);
      }

      // Update indicator
      indicator.innerText = `${100 + (currentLevel * 15)}%`;

      // Save preference
      localStorage.setItem('ia-curso-zoom', currentLevel);
    }

    // Load preference
    const savedLevel = localStorage.getItem('ia-curso-zoom');
    if (savedLevel !== null) {
      currentLevel = parseInt(savedLevel, 10);
      updateZoom();
    }

    btnIn.addEventListener('click', () => {
      if (currentLevel < maxLevel) {
        currentLevel++;
        updateZoom();
      }
    });

    btnOut.addEventListener('click', () => {
      if (currentLevel > minLevel) {
        currentLevel--;
        updateZoom();
      }
    });
  }

  if (document.readyState === 'loading') {
    (function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })( initTextZoom);
  } else {
    initTextZoom();
  }
})();
