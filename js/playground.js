/**
 * Python Playground (Pyodide)
 * Escanea bloques de código Python y los vuelve ejecutables.
 */

(function() {
  let pyodideInstance = null;
  let pyodideLoading = false;

  async function loadPyodideEngine() {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoading) {
      // Wait for it to finish if it's already loading
      while(pyodideLoading) {
        await new Promise(r => setTimeout(r, 100));
      }
      return pyodideInstance;
    }

    pyodideLoading = true;
    try {
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
      });
      return pyodideInstance;
    } finally {
      pyodideLoading = false;
    }
  }

  function initPlaygrounds() {
    const playgrounds = document.querySelectorAll('pre.python-playground');
    
    playgrounds.forEach((pre, index) => {
      // Create UI Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'playground-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      
      const header = document.createElement('div');
      header.className = 'playground-header';
      header.innerHTML = `
        <span class="playground-title">Python Interactivo</span>
        <button class="playground-run-btn" id="run-btn-${index}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Ejecutar
        </button>
      `;

      const outputContainer = document.createElement('div');
      outputContainer.className = 'playground-output-container hidden';
      outputContainer.innerHTML = `
        <div class="playground-output-header">Salida:</div>
        <pre class="playground-output" id="output-${index}"></pre>
      `;

      // Structure
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
      wrapper.appendChild(outputContainer);

      // Make the code editable
      const codeElement = pre.querySelector('code') || pre;
      codeElement.contentEditable = "true";
      codeElement.spellcheck = false;
      codeElement.classList.add('editable-code');

      // Run Logic
      const runBtn = header.querySelector(`#run-btn-${index}`);
      const outputPre = outputContainer.querySelector(`#output-${index}`);

      runBtn.addEventListener('click', async () => {
        runBtn.innerHTML = '<span class="ai-loading-dots" style="padding:0; margin:0; display:inline-flex; width: 24px; height: 10px;"><span></span><span></span><span></span></span> Cargando Motor...';
        runBtn.disabled = true;
        outputContainer.classList.remove('hidden');
        outputPre.innerText = "Inicializando Python...";

        try {
          const py = await loadPyodideEngine();
          runBtn.innerHTML = 'Ejecutando...';
          outputPre.innerText = "";

          // Redirect stdout to our element
          py.setStdout({ batched: (msg) => {
            outputPre.innerText += msg + "\\n";
          }});
          py.setStderr({ batched: (msg) => {
            outputPre.innerText += "Error: " + msg + "\\n";
          }});

          const pythonCode = codeElement.innerText;
          await py.runPythonAsync(pythonCode);
          
          if (outputPre.innerText === "") {
             outputPre.innerText = "[Ejecución completada sin salidas por consola]";
          }
        } catch (error) {
          outputPre.innerText = error.toString();
        } finally {
          runBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Ejecutar`;
          runBtn.disabled = false;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    (function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })( initPlaygrounds);
  } else {
    initPlaygrounds();
  }
})();
