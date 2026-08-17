/**
 * Python Playground (Pyodide)
 * Escanea bloques de código Python y los vuelve ejecutables con carga diferida (Lazy Load).
 */

(function() {
  let pyodideInstance = null;
  let pyodideLoading = false;

  function injectPyodideScript() {
    return new Promise((resolve, reject) => {
      if (typeof loadPyodide !== 'undefined') {
        return resolve();
      }
      const existingScript = document.querySelector('script[src*="pyodide.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  async function loadPyodideEngine() {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoading) {
      while(pyodideLoading) {
        await new Promise(r => setTimeout(r, 100));
      }
      return pyodideInstance;
    }

    pyodideLoading = true;
    try {
      await injectPyodideScript();
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
    if (playgrounds.length === 0) return;
    
    playgrounds.forEach((pre, index) => {
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

      wrapper.appendChild(header);
      wrapper.appendChild(pre);
      wrapper.appendChild(outputContainer);

      const codeElement = pre.querySelector('code') || pre;
      codeElement.contentEditable = "true";
      codeElement.spellcheck = false;
      codeElement.classList.add('editable-code');

      const runBtn = header.querySelector(`#run-btn-${index}`);
      const outputPre = outputContainer.querySelector(`#output-${index}`);

      runBtn.addEventListener('click', async () => {
        runBtn.innerHTML = 'Inicializando Pyodide...';
        runBtn.disabled = true;
        outputContainer.classList.remove('hidden');
        outputPre.innerText = "Cargando entorno de ejecución WebAssembly...";

        try {
          const py = await loadPyodideEngine();
          runBtn.innerHTML = 'Ejecutando...';
          outputPre.innerText = "";

          py.setStdout({ batched: (msg) => {
            outputPre.innerText += msg + "\n";
          }});
          py.setStderr({ batched: (msg) => {
            outputPre.innerText += "Error: " + msg + "\n";
          }});

          const pythonCode = codeElement.innerText;
          await py.runPythonAsync(pythonCode);
          
          if (outputPre.innerText.trim() === "") {
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
    document.addEventListener('DOMContentLoaded', initPlaygrounds);
  } else {
    initPlaygrounds();
  }
})();
