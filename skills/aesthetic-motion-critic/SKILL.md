---
name: aesthetic-motion-critic
description: Ejecuta el patrón de 'Crítico Estético y Refinador de Motion' (Nodo 2). Audita un dashboard o presentación HTML existente sin alterar sus datos e inyecta iluminación Spotlight al cursor, curvas cubic-bezier(0.16,1,0.3,1), números tabulares, Cross-Filtering reactivo, Slide-Over Drawer con Radar y Command Palette (Ctrl+K).
---

# Habilidad Agencial: Aesthetic & Motion Critic (Patrón de Refinamiento en 2 Pasos)

Esta habilidad implementa el **Segundo Nodo (Refinador de Interacción y Motion)** para superar la compresión de CSS/JS de los LLMs. Su único objetivo es tomar un archivo HTML funcional y elevar su ingeniería visual e interactiva a nivel de estudio de diseño (Linear, Vercel, Raycast, Bloomberg Terminal) sin perder ni truncar los datos existentes.

## Protocolo de Auditoría e Inyección Obligatoria

1. **PRESERVACIÓN ÍNTEGRA DE DATOS**:
   - Mantén intacto el bloque `window.REPORT_DATA` / `window.DATA` y las fórmulas de negocio existentes.

2. **SISTEMA DE SUPERFICIES & SPOTLIGHT CSS**:
   - Sustituye sombras difusas (`shadow-lg`, `shadow-xl`) por contraste de superficie multicapa, `backdrop-filter: blur(16px)` y bordes de precisión de `1px solid rgba(255,255,255,0.08)` con gradiente superior sutil.
   - Añade el listener global `mousemove` que inyecta `--mx` y `--my` en cada tarjeta `.sp-card`, proyectando un brillo radial especular en el fondo (`::before`) y en el borde de 1px (`::after` con `mask-composite: exclude`).

3. **TIPOGRAFÍA NUMÉRICA Y FÍSICAS DE ANIMACIÓN**:
   - Aplica `font-variant-numeric: tabular-nums` (`tabular-nums`) a absolutamente todos los KPIs, celdas de tabla, badges de variación y tooltips.
   - Reemplaza `transition: all 0.3s ease` por `cubic-bezier(0.16, 1, 0.3, 1)` (180ms-250ms) y añade coreografía escalonada de entrada (`animation-delay: calc(var(--i) * 60ms)`).
   - Envuelve las mutaciones de filtrado del DOM en `document.startViewTransition()` cuando el navegador lo soporte, e interpola todos los KPIs con `requestAnimationFrame` (`easeOutQuart`, 600ms).

4. **CROSS-FILTERING, INSPECTOR DRAWER Y COMMAND PALETTE (`Ctrl+K`)**:
   - Conecta el evento `chart.on('click', ...)` de ECharts con el estado global para que hacer clic en una barra, nodo o burbuja filtre las demás gráficas, recalcule los KPIs superiores, resalte la fila en la tabla inferior y muestre la píldora `Filtro Activo [X] ✕`.
   - Añade una columna de **Micro-SVG Sparklines** generados dinámicamente en la tabla de detalle.
   - Implementa un **Slide-Over Inspector Drawer** lateral derecho (`backdrop-filter: blur(24px)`) con un gráfico Radar multidimensional del elemento seleccionado.
   - Implementa una **Paleta de Comandos Ejecutiva (`Ctrl+K` / `Cmd+K`)** que permita cargar escenarios de simulación predefinidos o cambiar la geometría del gráfico en vivo.
