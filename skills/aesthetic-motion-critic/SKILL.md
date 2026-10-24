---
name: aesthetic-motion-critic
description: Ejecuta el patrón de 'Crítico Estético y Catálogo Motion-Prompt' (Nodo 2). Audita un dashboard o presentación HTML existente sin alterar sus datos e inyecta las 12 primitivas deterministas (#MP-01 a #MP-12) con CSS puro Zero-CDN, iluminación Spotlight, contadores Odometer a 60fps, gráficos SVG nativos infalibles, Slide-Over Drawer y soporte Bi-Modal Dark/Light.
---

# Habilidad Agencial: Aesthetic & Motion Critic + Catálogo `motion-prompt` (#MP-01 a #MP-12)

Esta habilidad implementa el **Segundo Nodo (Refinador de Interacción y Motion)** inspirado en la arquitectura de vocabulario determinista de `showheyohtaki/motion-prompt`. Su objetivo es erradicar las respuestas mediocres o pantallas en blanco de los LLMs inyectando **recetas de código exactas y autónomas (Zero-CDN)** sobre cualquier HTML existente sin truncar `window.REPORT_DATA`.

---

## 🛡️ Regla Cero: Blindaje Corporativo Zero-CDN (Prohibido Pantallas en Blanco)
1. **PROHIBIDO depender de `cdn.tailwindcss.com`**: En entornos corporativos bancarios y sandboxes de Databricks (`displayHTML`), el compilador JIT de Tailwind CDN suele ser bloqueado por políticas CSP o carga de forma asíncrona provocando que los contenedores midan `0px` de alto al inicializar los gráficos.
2. **CSS Puro Autocontenido + Alturas Explícitas**: Todo el diseño debe declararse en un bloque `<style>` nativo con CSS Grid/Flexbox y alturas explícitas (`min-height: 340px`) en los contenedores de visualización.
3. **Motor Gráfico con Fallback SVG Nativo**: Si se usa Apache ECharts, envuelve siempre su inicialización en un bloque `try / catch` con comprobación `typeof echarts !== 'undefined'`. Si el CDN externo está bloqueado por el firewall corporativo o el usuario abre el `.html` sin conexión a internet, renderiza automáticamente el gráfico en **SVG vectorial nativo** para garantizar que **jamás aparezca un recuadro vacío**.

---

## 🎬 Catálogo de las 12 Primitivas Deterministas (`#MP-01` a `#MP-12`)

Cuando el usuario solicite mejorar un dashboard o indique códigos `#MP-XX`, inyecta exactamente la implementación técnica correspondiente:

### `#MP-01` · Spring Pop-In & Staggered Grid Reveal
Entrada escalonada de tarjetas KPI y filas con curva física de muelle (`cubic-bezier(0.16, 1, 0.3, 1)`):
```css
@keyframes mpSpringPop {
  0% { opacity: 0; transform: translateY(14px) scale(0.96); }
  70% { opacity: 1; transform: translateY(-2px) scale(1.008); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.mp-stagger-item {
  opacity: 0;
  animation: mpSpringPop 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 55ms);
}
```

### `#MP-02` · Odometer KPI Ticker & Delta Flash (`easeOutQuart`)
Interpolación numérica a 60fps con tipografía tabular obligatoria (`font-variant-numeric: tabular-nums`) y destello cromático al actualizar:
```javascript
function mpAnimateKPI(el, targetVal, decimals = 1, suffix = '') {
  if (!el) return;
  const startVal = parseFloat(el.dataset.val || '0');
  el.dataset.val = targetVal;
  const t0 = performance.now(), dur = 520;
  el.style.transition = 'color 180ms ease';
  el.style.color = targetVal >= startVal ? '#34d399' : '#fb7185';
  function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    const ease = 1 - Math.pow(1 - p, 4); // easeOutQuart
    const curr = startVal + (targetVal - startVal) * ease;
    el.textContent = curr.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else setTimeout(() => { el.style.color = ''; }, 260);
  }
  requestAnimationFrame(tick);
}
```

### `#MP-03` · SVG Path-Draw Sparkline + End-Node Pulse
Micro-gráfico de 12 periodos en cada fila de tabla o tarjeta KPI que se dibuja solo mediante `stroke-dashoffset`:
```javascript
function mpSparklineSVG(values, color = '#06b6d4', w = 78, h = 24) {
  if (!values || !values.length) return '';
  const min = Math.min(...values), max = Math.max(...values), span = (max - min) || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * (w - 8) + 4,
    h - 4 - ((v - min) / span) * (h - 8)
  ]);
  const poly = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;vertical-align:middle;">
    <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      points="${poly}" style="stroke-dasharray:240;stroke-dashoffset:240;animation:mpDrawLine 850ms cubic-bezier(0.16,1,0.3,1) forwards;"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/>
  </svg>`;
}
```

### `#MP-04` · Specular Border Spotlight (`mask-composite: exclude`)
Iluminación radial de bordes de `1px` reactiva a la posición del ratón (`--mx`, `--my`):
```css
.sp-card { position: relative; background: var(--card, #0f1629); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; }
.sp-card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: radial-gradient(240px circle at var(--mx, -400px) var(--my, -400px), rgba(56,189,248,0.65), transparent 45%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}
```

### `#MP-05` · Zero-CDN SVG Waterfall P&L Bridge
Puente de creación de valor contable (Ingresos TIN $\rightarrow$ FTP $\rightarrow$ Comisiones $\rightarrow$ Pérdida Esperada EL $\rightarrow$ EVA Neto) renderizado en SVG puro con conectores discontinuos y barras flotantes animadas, 100% inmune a bloqueos de red.

### `#MP-06` · Interactive Crosshair Scissor / Yield Curve SVG
Gráfico vectorial de doble curva (Margen Activo vs. Coste FTP/Pasivo) con área sombreada de spread y línea vertical interactiva (*crosshair*) que muestra el diferencial exacto en puntos básicos al mover el cursor.

### `#MP-07` · Morphing View-Transition Tabs
Conmutación de pestañas sin parpadeo envolviendo la actualización del DOM en `document.startViewTransition ? document.startViewTransition(() => render()) : render()`.

### `#MP-08` · Slide-Over 360° Inspector Drawer + Radar SVG
Panel lateral derecho (`transform: translateX(105%)` $\rightarrow$ `translateX(0)`, `backdrop-filter: blur(20px)`) que al hacer clic en cualquier fila o barra dibuja el perfil pentagonal Radar en SVG puro y el desglose de subcuentas IFRS 9.

### `#MP-09` · Parametric What-If Stress Bar
Barra de simulación interactiva con sliders de Spread (+/- bps), Mora NPL y Conversión Digital que recalcula en tiempo real los KPIs, la tabla y los gráficos.

### `#MP-10` · Deterministic Auto-Insights & Red Flags Engine
Función pura en cliente `generateExecutiveNarrative(rows)` que calcula desviaciones contra el *Hurdle Rate*, detecta alertas de Stage 2/3 y redacta el titular prescriptivo estilo Comité de Dirección.

### `#MP-11` · Bi-Modal Theme Switcher (`Dark` ↔ `Light` + `@media print`)
Variables CSS en `:root` (Obsidian Dark `#070a12`) y `html.light` (Executive Slate `#f8fafc`) con persistencia y formato de impresión A4 apaisado limpio.

### `#MP-12` · Executive Command Palette (`Ctrl+K`) + Batch Action Dock
Modal flotante activado con `Ctrl+K` para filtrar o disparar escenarios de estrés con el teclado, y muelle inferior para exportar o auditar múltiples filas seleccionadas.
