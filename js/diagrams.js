/**
 * Diagrams (Mermaid.js) Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  // We check if mermaid is loaded from CDN
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#7b61ff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7b61ff',
        lineColor: '#5a46cc',
        secondaryColor: '#1a1a2e',
        tertiaryColor: '#12121a'
      }
    });
    
    // Explicitly initialize all mermaid divs
    try {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    } catch (err) {
      console.error("Mermaid error:", err);
    }
  }
});
