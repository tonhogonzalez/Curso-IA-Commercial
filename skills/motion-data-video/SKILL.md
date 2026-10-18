---
name: motion-data-video
description: Crea vídeos explicativos animados de datos y negocio (Motion Data Storyteller) con línea de tiempo por escenas, locución automática por voz en español (Web Speech API), subtítulos dinámicos sincronizados y grabación/descarga nativa a archivo de vídeo (.webm/.mp4).
---

# Skill: Generador de Vídeos Explicativos Animados de Datos y Negocio (Motion Data Storyteller)

## Cuándo activar esta Skill
Activa esta skill cuando el usuario pida un **vídeo explicativo del contenido**, una presentación auto-narrada de resultados mensuales, o una píldora audiovisual interactiva sobre un producto comercial, embudo digital o evolución del P&L.

## Especificaciones Técnicas del Reproductor/Generador de Vídeo
1. **Motor de Escenas Secuenciales (Timeline Engine)**:
   - Divide la explicación en 4 a 6 escenas de 8–12 segundos cada una (ej. *Escena 1: Tesis Ejecutiva*, *Escena 2: Embudo Digital Web/App*, *Escena 3: Cuello de Botella UX*, *Escena 4: Puente P&L y RORWA*, *Escena 5: Plan de Acción*).
   - En cada cambio de escena, ejecuta `chart.setOption(..., true)` con `universalTransition: true`, anima los contadores numéricos con `requestAnimationFrame` e ilumina el nodo clave.
2. **Locución Neuronal Sincronizada + Subtítulos de Cine**:
   - Integra `window.speechSynthesis` (con selector On/Off de voz en español `es-ES`) que narra el guion ejecutivo de cada escena y avanza automáticamente a la siguiente escena al terminar la frase (`utterance.onend`), o mediante temporizador si el audio está silenciado.
   - Muestra una banda inferior de subtítulos (*Lower Third*) sincronizada con la locución y una barra de progreso temporal clicable.
3. **Grabación a Vídeo Descargable (`.webm`)**:
   - Incluye un botón `⏺ Grabar Vídeo` usando `canvas.captureStream(30)` y `MediaRecorder` para exportar la animación si el usuario desea adjuntar un archivo de vídeo en Teams o por correo.
