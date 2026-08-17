/**
 * Diagrams (Mermaid.js) Lazy Loading & Theme Initialization
 */

(function(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
})(function() {
  const mermaidElements = document.querySelectorAll('.mermaid');
  if (mermaidElements.length === 0) return;

  function loadMermaid() {
    return new Promise((resolve, reject) => {
      if (typeof mermaid !== 'undefined') {
        return resolve();
      }
      const existingScript = document.querySelector('script[src*="mermaid"]');
      if (existingScript) {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  loadMermaid().then(() => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isLight ? 'default' : 'dark',
      themeVariables: {
        primaryColor: '#8b5cf6',
        primaryTextColor: isLight ? '#12111a' : '#fff',
        primaryBorderColor: '#8b5cf6',
        lineColor: '#3b82f6',
        secondaryColor: isLight ? '#f0eff6' : '#1a1a2e',
        tertiaryColor: isLight ? '#ffffff' : '#12121a'
      }
    });

    try {
      mermaid.init(undefined, mermaidElements);
    } catch (err) {
      console.warn("Mermaid init error:", err);
    }
  }).catch(err => {
    console.warn("Could not load Mermaid:", err);
  });
});
