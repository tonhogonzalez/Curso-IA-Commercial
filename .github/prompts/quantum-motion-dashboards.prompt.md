---
name: quantum-motion-dashboards
description: Genera terminales de telemetría ejecutiva y dashboards de alta densidad a 60fps usando física procedural en Canvas2D (ecuaciones motion-prompt #002-#009), pilas de arquitectura 3D isométricas y un HUD magnético flotante con micro-gráficos en vivo.
mode: agent
---

# SKILL: QUANTUM MOTION DASHBOARDS (60FPS PROCEDURAL TELEMETRY ENGINE)

Actúa como un Principal Staff Creative Technologist y Arquitecto de Sistemas de Visualización Cuantitativa. Tu objetivo es generar un dashboard o terminal de telemetría de grado institucional (100% funcional, en un único archivo autónomo o módulo completo sin código omitido ni placeholders) adaptado al dominio que pida el usuario.

## 1. REGLAS INQUEBRANTABLES (ANTI-LAZY GENERATION)

1. **PROHIBIDO usar librerías de gráficos estáticas o transiciones CSS simples** para los datos. Todo gráfico debe renderizarse en `<canvas>` a 60 FPS reales mediante `requestAnimationFrame` y escalado Retina (`devicePixelRatio`).
2. **PROHIBIDO usar tooltips nativos (`title="..."`) o estáticos.** Absolutamente todas las barras, puntos de curva, nodos de red, capas 3D, celdas de matriz y filas de tabla deben registrar sus coordenadas en `CanvasHitRegistry` y disparar el **Floating Magnetic Telemetry HUD** al pasar el ratón por encima.
3. **PROHIBIDO sobreescribir datos bruscamente al cambiar de filtro o escenario.** Todo cambio de escenario modifica únicamente `target[]` y el motor `SpringChannel` interpola `x[]`, `v[]` y la derivada instantánea `|du/dt|` en tiempo real.
4. **CERO comentarios tipo `// ... resto del código` o `// implementar aquí`.** Escribe todas las funciones de principio a fin.

---

## 2. SISTEMA VISUAL Y LAYOUT EJECUTIVO (DARK GLASS BENTO)

- **Paleta:** Lienzo `#06070a` con rejilla técnica de `28px` (`rgba(255,255,255,0.025)`). Tarjetas `.glass-card` en `rgba(12, 15, 23, 0.88)` con `backdrop-filter: blur(16px)`, borde `1px solid rgba(255,255,255,0.08)` y efecto **Cursor Spotlight** (`radial-gradient(460px circle at var(--mx) var(--my), rgba(56,189,248,0.085), transparent 65%)`).
- **Tipografía:** `Space Grotesk` (títulos), `Inter` (etiquetas UI) y `JetBrains Mono` con `font-variant-numeric: tabular-nums` obligatorio en cada número, métrica, coordenada, fórmula y tabla.
- **Colores Semánticos:** Flujo primario Cyan (`#38bdf8`), Secundario Indigo (`#6366f1`), Saludable/SLA Emerald (`#10b981`), Advertencia Amber (`#f59e0b`), Anomalía/Contagio Rose (`#f43f5e`).
- **Estructura de la Interfaz (12 Columnas sin espacios muertos):**
  1. **Top Command Bar:** Indicador LIVE 60FPS, **3 Botones de Escenario en Vivo** (Nominal, Pico de Estrés/Anomalía, Cambio de Régimen), conmutador **`X-Ray Motion Specs`** (muestra etiquetas flotantes con la ecuación matemática exacta sobre cada tarjeta) y botón para abrir el **Deep Forensics Drawer**.
  2. **Fila de 4 KPIs Superiores (3 cols c/u):** Valor principal con `#004 Kinetic Scramble`, badge de delta/SLA y un `<canvas>` interactivo incrustado en cada KPI (histograma de 24 tramos, barras de cohortes por resorte `#002`, escudo con láser cónico perimetral `#008` y barra de fases de latencia `#007`).
  3. **Viz A (5 cols) — Serie Temporal de 48 Tramos + Abanico de Confianza (P05-P95):** Curva spline interpolada por resortes (`#002`), cinta de derivada de velocidad `|du/dt|` (`#007`), barras inferiores de impulso de anomalía y *Click-to-Pin* (fijar corte temporal en todo el dashboard).
  4. **Viz B (4 cols) — Topología de Red + Campo Vectorial Dipolar (`#003` + `#005`):** Grafo de 8 nodos sobre una matriz de 13×7 agujas magnéticas que se orientan hacia el cursor y hacia los nodos críticos, fusionando isocontornos *metaball* de calor cuando sube el riesgo.
  5. **Viz C (3 cols) — Pila Arquitectónica 3D Isométrica (`#006`):** 4 capas en proyección isométrica a 30° con botón `Explode Z-Axis` y elevación individual en el eje Z al pasar el ratón por encima de cada capa.
  6. **Fila Analítica Secundaria (4 + 4 + 4 cols):**
     - **Viz D:** Matriz de superficie 7×6 (Cohortes × Tramos de Latencia/Riesgo) con doble métrica por celda.
     - **Viz E:** Flamegraph / Cascada de Hidratación y Memoria (Cold vs. Warm execution + Heap).
     - **Viz F:** Atractor de Espacio de Fases Kepleriano (`#009`, órbitas elípticas donde los *outliers* aceleran en el periapsis) + Radar de Resiliencia de 6 Ejes.
  7. **Tabla de Auditoría de Eventos en Vivo + Drawer Lateral Forense.**

---

## 3. KERNEL MATEMÁTICO OBLIGATORIO (COPIAR E INTEGRAR EN `<script>`)

```javascript
// 1. Escalado Retina High-DPI sin deformación
function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(10, Math.floor(rect.width));
  const h = Math.max(10, Math.floor(rect.height));
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

// 2. Motor Diferencial de Resortes Subamortiguados (#002) + Derivada |du/dt| (#007)
class SpringChannel {
  constructor(size, omega = 14, zeta = 0.28) {
    this.x = new Float32Array(size);
    this.v = new Float32Array(size);
    this.target = new Float32Array(size);
    this.derivative = new Float32Array(size);
    this.omega = omega;
    this.zeta = zeta;
  }
  step(dt) {
    const dtClamped = Math.min(dt, 0.033);
    for (let i = 0; i < this.x.length; i++) {
      const prev = this.x[i];
      const force = -Math.pow(this.omega, 2) * (this.x[i] - this.target[i]) - 2 * this.zeta * this.omega * this.v[i];
      this.v[i] += force * dtClamped;
      this.x[i] += this.v[i] * dtClamped;
      this.derivative[i] = Math.abs(this.x[i] - prev) / (dtClamped || 0.016);
    }
  }
}

// 3. Registro Espacial de Colisiones en Canvas para el HUD Magnético
class CanvasHitRegistry {
  constructor(canvas, onHover, onLeave) {
    this.canvas = canvas;
    this.regions = [];
    this.mouse = { x: -999, y: -999, clientX: 0, clientY: 0, inside: false };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.clientX = e.clientX;
      this.mouse.clientY = e.clientY;
      this.mouse.inside = true;
      this.checkHits(onHover, onLeave);
    });
    canvas.addEventListener('mouseleave', () => {
      this.mouse.inside = false;
      onLeave();
    });
  }
  clear() { this.regions.length = 0; }
  addRect(x, y, w, h, payload) { this.regions.push({ type: 'rect', x, y, w, h, payload }); }
  addCircle(x, y, r, payload) { this.regions.push({ type: 'circle', x, y, r, payload }); }
  checkHits(onHover, onLeave) {
    if (!this.mouse.inside) return onLeave();
    for (let i = this.regions.length - 1; i >= 0; i--) {
      const reg = this.regions[i];
      const hit = reg.type === 'rect'
        ? (this.mouse.x >= reg.x && this.mouse.x <= reg.x + reg.w && this.mouse.y >= reg.y && this.mouse.y <= reg.y + reg.h)
        : (Math.hypot(this.mouse.x - reg.x, this.mouse.y - reg.y) <= reg.r);
      if (hit) return onHover(this.mouse.clientX, this.mouse.clientY, reg.payload, reg);
    }
    onLeave();
  }
}

// 4. Proyección Isométrica 3D (#006)
function projectIso(x, y, z, originX, originY) {
  const angle = Math.PI / 6;
  return {
    px: originX + (x - y) * Math.cos(angle),
    py: originY + (x + y) * Math.sin(angle) - z
  };
}
```
