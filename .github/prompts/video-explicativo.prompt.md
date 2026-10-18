---
mode: agent
description: Genera un reproductor de vídeo explicativo animado de datos y negocio con locución automática en español, subtítulos dinámicos y grabación a archivo .webm.
---
Aplica las reglas de `skills/motion-data-video/SKILL.md`.
Construye una aplicación HTML autocontenida que funcione como un Vídeo Explicativo Animado por Escenas (Motion Data Storyteller):
- Línea de tiempo de 4 a 5 escenas con reproducción automática (`▶ Reproducir Vídeo`), locución por voz en español (`window.speechSynthesis`), subtítulos sincronizados estilo cine y transiciones automáticas en Apache ECharts (`universalTransition: true`).
- Incluye botón `⏺ Grabar Vídeo (.webm)` y botón para descargar el reproductor `.html` portable para enviarlo por correo.
