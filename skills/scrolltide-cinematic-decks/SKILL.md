---
name: scrolltide-cinematic-decks
description: Diseño y generación de presentaciones interactivas cinematográficas 2.5D/3D estilo Scrolltide con vídeos .MP4 limpios (assets/scrolltide/), tarjetas 3:4 en vivo, carril Zephyr, tarjetas Synapse y motores Canvas/Shader sin solapamientos.
---

# Skill: Scrolltide Cinematic Decks (Vídeos .MP4 Limpios + Shaders 2.5D/3D)

Usa esta skill siempre que el usuario pida crear o mejorar una **presentación ejecutiva, pitch de proyecto de IA, explicación de arquitectura o propuesta comercial** con estética cinematográfica estilo **Scrolltide** (`Ridge`, `Zephyr`, `Synapse`, `Selene`, `Helix`, `Dune`, `Rednova`, `Aurora`, `Eclipse`, `Nebula`, `Nocturne`).

## 1. Inventario de Recursos `.MP4` Limpios en `assets/scrolltide/`
El repositorio cuenta con **92 vídeos `.MP4` limpios de texto (37 Plantillas Hero + 55 Shaders)** y sus correspondientes posters `*-poster.jpg` en `assets/scrolltide/`:
- **37 Fondos Hero Cinematográficos Limpios:** `ridge.mp4`, `zephyr.mp4`, `synapse.mp4` (`aether.mp4`), `selene.mp4` (`moon.mp4`), `helix.mp4` (`aperture.mp4`), `aurora.mp4`, `glacier.mp4`, `dune.mp4`, `rednova.mp4`, `eclipse.mp4`, `nebula.mp4`, `nocturne.mp4`, `meridian.mp4`, `kage.mp4`, `anchor.mp4`, `clover.mp4`, `ember.mp4`, `frost.mp4`, `tide.mp4`, `comet.mp4`, `tundra.mp4`, `twilight.mp4`, `oasis.mp4`, `monsoon.mp4`, `harbor.mp4`, `aethera.mp4`, `monoio.mp4`, `glowinn.mp4`, `lagoon-hero.mp4`, `brook.mp4`, `prairie.mp4`, `meadow.mp4`, `willow.mp4`, `arbor.mp4`, `orchid.mp4`, `garden.mp4`, `flying-garden.mp4`.
- **55 Fondos Shader en `.MP4` Limpios:** `shader-chrome*.mp4`, `shader-halftone*.mp4`, `shader-cobalt.mp4`, `shader-cell*.mp4`, `shader-aurora-*.mp4`, `shader-noir-mesh.mp4`, `shader-dusk-mesh.mp4`, `shader-mesh-*.mp4`, `shader-mint-haze.mp4`, `shader-*-flow.mp4`, `shader-flame-*.mp4`, `shader-swirl-*.mp4`, `shader-ember-wash.mp4`.
- **Grabaciones de Referencia del Catálogo Original (con UI en inglés):** Guardadas en `assets/scrolltide/previews/*-preview.mp4`. **Regla estricta:** Úsalas únicamente cuando el usuario pulse un botón explícito de *"Ver Demo Original de Referencia (EN)"* sin superponer texto HTML encima.

## 2. Reglas de Oro contra Solapamientos Visuales
1. **Cero texto sobre texto:** Todo `<video>` que tenga encima titulares HTML, métricas o tarjetas debe apuntar a los archivos limpios de `assets/scrolltide/<slug>.mp4`.
2. **Separación Vídeo vs. Shader Canvas:** Cuando el usuario selecciona un fondo Shader procedural en `<canvas>`, el elemento `<video>` debe ponerse en `opacity: 0` (y viceversa, cuando selecciona `Vídeo .MP4`, el `<canvas>` de shader baja su opacidad a `0` o actúa solo como viñeta sutil).
3. **Titulares Cinéticos Compatibles con Chromium:** No combinar `-webkit-background-clip: text; -webkit-text-fill-color: transparent` en el padre con `filter: blur()` en `<span class="word">` hijos. Aplicar color blanco puro `#f8fafc` o aplicar el `background-clip: text` en el propio `<span>` una vez completada la animación.
4. **HUD Despejado:** Los controles del motor 3D nunca deben flotar encima del objeto 3D ni tapar el centro visual del vídeo; colócalos integrados en la barra de control o en una píldora compacta inferior.
