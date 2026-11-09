---
description: Genera una presentación interactiva cinematográfica estilo Scrolltide (.HTML autónomo o con vídeos .MP4 limpios de assets/scrolltide/) sin solapamientos de capas
agent: agent
---
# /scrolltide.deck · Generador Maestro de Presentaciones Cinematográficas (Vídeos .MP4 Limpios + Shaders 2.5D/3D)

Actúa como **Principal Creative Technologist** (nivel Apple Keynote / Linear / Scrolltide).
Tu objetivo es construir una presentación interactiva en un archivo `.html` de calidad museística, utilizando los **92 vídeos `.mp4` limpios de texto (37 Plantillas Hero + 55 Shaders)** en `assets/scrolltide/` o el motor procedural en GPU cuando el usuario pida un archivo 100% portable sin carpetas externas.

## 1. Catálogo de 92 Vídeos `.MP4` 100% Limpios Disponibles en `assets/scrolltide/`
Nunca uses vídeos de `/previews/*-preview.mp4` con texto en inglés quemado como fondo de una escena con texto HTML encima. Utiliza siempre los **92 Clean Plates** ya descargados en el proyecto:

| Arquetipo / Plantilla | Vídeo `.MP4` Limpio (`assets/scrolltide/...`) | Poster Limpio (`assets/scrolltide/...`) | Atmósfera Visual y Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| **1. Ridge** | `ridge.mp4` | `ridge-poster.jpg` | Caverna rocosa abriéndose hacia un planeta iluminado y cordillera con niebla. Ideal para Visión Estratégica, OKRs y Cumbres de Transformación. |
| **2. Zephyr** | `zephyr.mp4` | `zephyr-poster.jpg` | Pabellón arquitectónico futurista suspendido sobre bruma sage. Ideal para Plataformas Tecnológicas, Onboarding y Velocidad Operativa. |
| **3. Synapse / Aether** | `synapse.mp4` / `aether.mp4` | `synapse-poster.jpg` | Escalera luminosa ascendiendo hacia una aurora estelar. Ideal para Sistemas Agénticos, IA Contextual y Toma de Decisiones. |
| **4. Selene / Moon** | `selene.mp4` / `moon.mp4` | `selene-poster.jpg` | Horizonte lunar esmeralda con niebla en movimiento. Ideal para Hojas de Ruta por Olas, Expediciones de Negocio y Lanzamientos. |
| **5. Helix / Aperture** | `helix.mp4` / `aperture.mp4` | `helix-poster.jpg` | Domo inmersivo 360º de pantallas y datos rodeando al observador. Ideal para Gobierno del Dato, Telemetría, KYB y Control Analítico. |
| **6. Dune** | `dune.mp4` | `dune-poster.jpg` | Monolito de roca abriéndose al sol ámbar entre nubes bajas. Ideal para Apertura de Comité de Dirección y Desbloqueo de Cuellos de Botella. |
| **7. Rednova** | `rednova.mp4` | `rednova-poster.jpg` | Eclipse solar anular sobre dunas doradas. Ideal para Transformación Comercial, Riesgos y Cambio de Paradigma. |
| **8. Aurora** | `aurora.mp4` | `aurora-poster.jpg` | Monolito de luz ámbar en el horizonte con coupé clásico. Ideal para Propuestas de Valor Premium y Banca Privada/Empresas. |
| **9. Eclipse** | `eclipse.mp4` | `eclipse-poster.jpg` | Catarata basáltica monumental entre bruma nórdica. Ideal para Flujos de Caja, Liquidez, Circulante y Procesos Transaccionales. |
| **10. Nebula** | `nebula.mp4` | `nebula-poster.jpg` | Puente de piedra natural entre cumbres y mar de nubes. Ideal para Puentes Omnicanal (Digital ↔ Gestor) e Integración de Sistemas. |
| **11. Nocturne** | `nocturne.mp4` | `nocturne-poster.jpg` | Valle nocturno bajo luna llena con arquitectura cálida. Ideal para Retención de Cartera, Fidelización y Cercanía al Cliente. |
| **12. Meridian / Tide / Frost / Ember / Comet / Kage / Anchor** | `meridian.mp4`, `tide.mp4`, `frost.mp4`, `ember.mp4`, `comet.mp4`, `kage.mp4`, `anchor.mp4` | `*-poster.jpg` | Fondos cinematográficos limpios adicionales para tarjetas 3:4, capítulos o secciones profundas. |
| **13. Shaders GPU en `.MP4`** | `shader-chrome.mp4`, `shader-halftone.mp4`, `shader-cobalt.mp4`, `shader-cell.mp4`, `shader-aurora-noir.mp4`, `shader-noir-mesh.mp4` | `shader-*-poster.jpg` | Fondos abstractos de alta tecnología (metal líquido, malla halftone, flujo cobalto, tejido celular, aurora negra). |

> **Nota de rutas relativas:** Si el archivo `.html` se guarda en la raíz del proyecto, usa `assets/scrolltide/<nombre>.mp4`. Si se guarda dentro de `cuadernos/` o `presentaciones/`, usa `../assets/scrolltide/<nombre>.mp4`.

---

## 2. Reglas de Coherencia Visual Anti-Solapamiento (NO NEGOCIABLES)
1. **Prohibido mezclar texto quemado con texto HTML:** Jamás uses un vídeo de `assets/scrolltide/previews/*-preview.mp4` detrás de titulares o tarjetas con texto. Usa exclusivamente los vídeos limpios de `assets/scrolltide/<slug>.mp4`.
2. **Exclusión mutua o armonía entre Vídeo y Canvas 3D:**
   - Si el modo de fondo es un **Shader Procedural** (`liquid`, `aurora`, `halftone`, `ridge`), pon `videoElement.style.opacity = '0'` para que el vídeo no compita con el Shader.
   - Si el modo de fondo es **Vídeo `.MP4` Limpio**, aplica un *scrim* atmosférico (`linear-gradient(180deg, rgba(4,7,12,0.52) 0%, rgba(4,7,12,0.18) 45%, rgba(4,7,12,0.86) 100%)`) y mantén el objeto 3D en el tercio derecho (`cx = w * 0.70`) sin que ningún panel HUD flotante lo pise.
3. **Tipografía Cinética Visible en todos los navegadores:**
   - **Nunca** apliques `-webkit-background-clip: text; -webkit-text-fill-color: transparent` en un contenedor padre (`<h1>` / `<h3>`) si sus hijos (`.kinetic-word`) usan `display: inline-block` con `transform` o `filter: blur()`, porque Chromium oculta el texto. Aplica el color (`#f8fafc`) o el gradiente directamente en cada `<span class="kinetic-word">`.
4. **Arquitectura de 4 Actos (Presentación Completa tipo `Ridge`) o Escenario Sticky por Capítulos:**
   - **Acto I (Hero 100vh en 5 Zonas):** Barra superior minimalista + Foco central con Titular, Subtítulo y 1 CTA + Horizonte inferior dividido (Manifiesto con contraste *Sans + Instrument Serif Italic* a la izquierda y resumen + CTA secundario a la derecha).
   - **Acto II (Reel de 4 Tarjetas Cinematográficas 3:4):** 4 tarjetas verticales con vídeos limpios distintos (`zephyr.mp4`, `synapse.mp4`, `eclipse.mp4`, `nebula.mp4`), insignia superior en `Space Mono`, métrica grande inferior y descripción ejecutiva debajo.
   - **Acto III (Escenario Deep-Dive Interactivo):** Selector de las 4 iniciativas + carril de 4 pasos estilo *Zephyr* a la izquierda + tarjeta de telemetría en vivo estilo *Synapse* a la derecha.
   - **Acto IV (Hoja de Ruta por Olas + Footer Monumental):** 3 columnas trimestrales con KPI de impacto y cierre tipográfico.
5. **Entrega 100% íntegra:** Nunca cortes ni abrevies el archivo `.html`.
