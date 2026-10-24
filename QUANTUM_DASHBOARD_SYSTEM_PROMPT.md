# BLUEPRINT MAESTRO: ARQUITECTURA DE DASHBOARDS CUÁNTICOS CON FÍSICA PROCEDURAL (`MOTION-PROMPT`)

## 1. Propósito del Sistema
Este documento define la arquitectura técnica, el motor matemático y las reglas de diseño para que un Agente de IA genere **Terminales de Telemetría Ejecutiva de Alta Densidad** en un único archivo autónomo (o aplicación modular) combinando:
1. **Arquitectura de Datos Institucional** (estética tipo Linear / Vercel / Bloomberg / Palantir).
2. **Motor Procedural Canvas2D a 60 FPS** inspirado en `showheyohtaki/motion-prompt`, donde cada animación obedece a ecuaciones diferenciales, campos vectoriales o proyecciones 3D con una **función cognitiva real** sobre los datos.
3. **HUD de Telemetría Magnética Flotante** con micro-visualizaciones en vivo dentro del propio tooltip e inspección cruzada (*cross-filtering*).

---

## 2. Por qué funciona este enfoque (Principios de Ingeniería para la IA)

1. **Prohibición de animaciones decorativas vacías:** Ningún elemento se mueve "porque sí". Cada patrón de `motion-prompt` representa una dimensión del dato:
   - *Resorte subamortiguado (`#002`)* → Elasticidad o inercia al cambiar entre cohortes o escenarios.
   - *Campo dipolar (`#003`)* → Dirección y presión del flujo entre nodos de un sistema.
   - *Scramble criptográfico (`#004`)* → Confirmación visual de que un KPI acaba de recibir un paquete de telemetría nuevo.
   - *Metaballs / Isocontornos (`#005`)* → Radio de contagio o correlación de anomalías.
   - *Proyección Isométrica Z-Stack (`#006`)* → Desglose de capas de arquitectura (ej. CDN → App Shell → Micro-Frontends → API).
   - *Derivada de velocidad $|du/dt|$ (`#007`)* → Volatilidad instantánea o *jitter* de latencia.
   - *Láser Cónico Perimetral (`#008`)* → Alerta periférica no intrusiva (sustituye popups molestos).
   - *Atractor Kepleriano (`#009`)* → Detección de *outliers* en espacio de fases (velocidad vs. valor).

2. **Separación entre Estado Objetivo (`Target`) y Estado Físico (`Current`):**
   - La IA nunca debe sobreescribir directamente los datos de un gráfico al cambiar un filtro.
   - Debe mutar el array `targetValues[]` y dejar que el bucle `requestAnimationFrame` interpole `currentValues[]` mediante física de resortes:
     $$a = -\omega^2 (x - x_{\text{target}}) - 2\zeta\omega v$$

---

## 3. Especificación Técnica del Motor (Cómo está hecho)

### 3.1. Sistema de Diseño y Tokens Visuales (Dark Glass & High-Craft UI)
- **Lienzo Base (Carbon Obsidian):** `#06070a` con rejilla técnica sutil de fondo (`background-size: 28px 28px`, opacidad `3%`).
- **Superficies Elevadas (Glass Cards):** `rgba(12, 15, 23, 0.88)` con `backdrop-filter: blur(16px)` y bordes de `1px solid rgba(255, 255, 255, 0.08)`.
- **Iluminación Reactiva al Cursor (Spotlight Card):** Cada tarjeta calcula en el evento `mousemove` las variables CSS `--mx` y `--my` para proyectar un gradiente radial (`radial-gradient(460px circle at var(--mx) var(--my), rgba(56, 189, 248, 0.09), transparent 65%)`).
- **Tipografía:**
  - `Space Grotesk` para titulares e identificadores de sección.
  - `Inter` para etiquetas de interfaz y descripciones analíticas.
  - `JetBrains Mono` con `font-variant-numeric: tabular-nums` **obligatorio** en todas las métricas, coordenadas, tablas y ejes para evitar que los números "bailen" al actualizarse a 60 FPS.
- **Paleta Semántica Restringida:**
  - Normal / Flujo Primario: Cyan (`#38bdf8`) e Indigo (`#6366f1`).
  - SLA Óptimo / Saludable: Emerald (`#10b981`).
  - Advertencia / Latencia Media: Amber (`#f59e0b`).
  - Anomalía Crítica / Fraude / Contagio: Rose (`#f43f5e`).

### 3.2. Escalado Retina (High-DPI Canvas Manager)
Todo elemento `<canvas>` debe redimensionarse multiplicando su tamaño CSS por `window.devicePixelRatio` (limitado a `2` para rendimiento óptimo) y escalando el contexto:

```javascript
function syncCanvasDPI(canvas) {
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
```

### 3.3. Catálogo de Ecuaciones `motion-prompt` Integradas
Cada visualización implementa una firma estandarizada `render(ctx, w, h, dt, state)`:

| ID | Nombre del Patrón | Formulación Matemática / Algoritmo | Aplicación en Dashboards de Datos |
| :--- | :--- | :--- | :--- |
| **`#002`** | **Underdamped Spring Cascade** | $a_i = -\omega^2(y_i - y_i^*) - 2\zeta\omega v_i$ con retardo por índice $i \cdot \Delta\tau$ | Transición suave entre series temporales, barras de progreso e histogramas al cambiar de escenario o filtro. |
| **`#003`** | **Magnetic Dipole Vector Field** | $\theta(x,y) = \text{atan2}(y - y_c, x - x_c) + \frac{\pi}{2}\sin(r)$ | Mapas de topología de red, flujo de capital o balanceo de carga entre microservicios. |
| **`#004`** | **Kinetic Cryptographic Scramble** | Sustitución estocástica de glifos (`0123456789ABCDEF`) con decaimiento lineal $p = t/T$ | Indicador de refresco en vivo en KPIs principales cuando entra un nuevo bloque de datos. |
| **`#005`** | **Liquid Metaball Iso-Field** | $E(x,y) = \sum_{k} \frac{R_k^2}{(x-x_k)^2 + (y-y_k)^2} \ge \tau$ | Visualización de zonas de calor, contagio de riesgo entre nodos o agrupación de incidentes. |
| **`#006`** | **3D Isometric Z-Layer Stack** | Proyección isométrica $(X - Y)\cos 30^\circ, (X + Y)\sin 30^\circ - Z$ con $Z_i$ reactivo al hover | Desglose de arquitecturas multicapa (ej. CDN → Web App Shell → Micro-Frontends → Core). |
| **`#007`** | **Velocity Smear Derivative** | Estela proporcional a la derivada instantánea $\left\|\frac{du}{dt}\right\| = \frac{\|y_t - y_{t-1}\|}{\Delta t}$ | Detección visual de picos de volatilidad, jitter de red o aceleración de gasto. |
| **`#008`** | **Dual Conic Perimeter Laser** | `conic-gradient(from var(--angle), transparent 72%, #f43f5e 96%, #fff 100%)` rotando a 60 FPS | Alerta crítica perimetral en tarjetas con SLA roto o ataque detectado, sin bloquear la interfaz. |
| **`#009`** | **Keplerian Phase-Space Orbit** | $r(\theta) = \frac{a(1-e^2)}{1 + e\cos\theta}, \quad \dot{\theta} \propto \frac{1}{r^2}$ | Gráficos de dispersión orbitales donde las anomalías aceleran visiblemente al acercarse al núcleo. |

### 3.4. Arquitectura del HUD Flotante de Telemetría Magnética (Rich Hover Tooltip)
En lugar de usar el atributo `title` nativo o un tooltip estático, el sistema implementa un HUD flotante acoplado por física de resortes:
- **Posicionamiento con Resorte Crítico:** El contenedor `#telemetryHud` persigue las coordenadas `(mouseX + 18, mouseY + 18)` mediante `hx += (tx - hx) * 0.28` y reajusta sus bordes automáticamente si se acerca al límite de la ventana (`window.innerWidth`, `window.innerHeight`).
- **Estructura de Datos del Payload de Hover:**
  Cada elemento visual del Canvas calcula la distancia al ratón (`Math.hypot(mx - x, my - y)`) y, al detectar colisión, emite un objeto estandarizado:

```javascript
showHud(clientX, clientY, {
  tag: 'VIZ-A // BUCKET #34 (16:40 UTC)',
  badge: '#002 + #007',
  title: '€184.2M Net Flow',
  delta: '+14.8% vs P50',
  deltaColor: '#10b981',
  rows: [
    ['Confidence Band (P05–P95)', '€152.0M — €211.4M'],
    ['Velocity Derivative |du/dt|', '1.84 m/s² (Elevated)'],
    ['Fraud Anomaly Impulse', '18.4 pts (Z = +2.4σ)'],
    ['Dominant Channel', 'Host App Shell (52%)']
  ],
  sparkData: [120, 132, 128, 145, 160, 155, 172, 184], // Renderiza mini-canvas en vivo
  sparkColor: '#38bdf8',
  formula: 'y(t) = y_0 + A·e^(-ζωt)·sin(ω_d·t) | ζ=0.28, ω=14'
});
```

- **Micro-Canvas Interno:** El propio tooltip contiene un `<canvas width="260" height="44">` que dibuja al vuelo la serie `sparkData` con área sombreada y punto terminal iluminado.

---

## 4. Plantilla de Prompt Maestro (Copia y Pega para cualquier Proyecto)

```markdown
Actúa como un Principal Staff Creative Technologist y Arquitecto de Sistemas de Visualización Cuantitativa.

Quiero que diseñes y programes en un único archivo `index.html` autónomo (HTML5 + CSS Grid/Glassmorphism + Canvas2D API de alta densidad a 60 FPS) una terminal interactiva de telemetría llamada **"[NOMBRE DEL PROYECTO]"** enfocada en el dominio de **[DOMINIO: ej. Ciberseguridad Cloud / Trading Algorítmico / Logística Global / Admisión de Riesgo Bancario]**.

### 1. ARQUITECTURA VISUAL Y ESTÉTICA
- **Estética:** Dark UI de grado institucional (inspirada en Linear, Vercel, Palantir Foundry y Bloomberg Terminal).
- **Paleta:** Fondo `#06070a`, paneles `rgba(12,15,23,0.88)` con `backdrop-filter: blur(16px)`, bordes sutiles `rgba(255,255,255,0.08)` e iluminación radial spotlight que sigue al cursor en cada tarjeta (`--mx`, `--my`).
- **Tipografía:** `Space Grotesk` para cabeceras, `Inter` para UI y `JetBrains Mono` (`tabular-nums`) obligatorio para todos los números, métricas, ejes y tablas.
- **Layout Bento sin espacios muertos:**
  1. Barra superior ejecutiva con estado del sistema, selector de **3 Escenarios en Vivo** (ej. Nominal, Estrés/Anomalía, Pico de Demanda), conmutador de modo **X-Ray Motion Specs** (que muestra superpuestas las fórmulas matemáticas de cada tarjeta) y botón de inspección profunda.
  2. Cinta de **4 KPIs Superiores** donde cada tarjeta incluye su propia micro-visualización interactiva en Canvas (histograma de 24 barras, barras de cohortes con resorte, medidor de vectores de riesgo con láser perimetral y desglose de latencia por fases).
  3. **6 Visualizaciones Analíticas Sincronizadas** en cuadrícula de 12 columnas + tabla de auditoría en tiempo real.

### 2. MOTOR MATEMÁTICO `MOTION-PROMPT` (60 FPS CANVAS2D)
No uses librerías de gráficos estáticas. Programa un motor procedural en `requestAnimationFrame` con soporte Retina (`devicePixelRatio`) que implemente estos patrones con función cognitiva real:
- **`#002 Underdamped Spring Cascade`:** Todas las curvas, barras y superficies deben interpolar su posición entre escenarios usando ecuaciones diferenciales de resorte ($a = -\omega^2(x - x^*) - 2\zeta\omega v$) con desfase por índice.
- **`#003 Magnetic Dipole Vector Field` + `#005 Metaball Iso-Contours`:** Una visualización de topología de red donde una matriz de agujas vectoriales se orienta hacia el cursor y hacia los nodos con anomalías, fusionando isocontornos de calor cuando sube el riesgo.
- **`#004 Kinetic Scramble Decode`:** Los dígitos de los KPIs principales ejecutan una breve descodificación hexadecimal de 350ms al cambiar de escenario antes de fijar el valor final.
- **`#006 3D Isometric Z-Layer Stack`:** Una visualización en proyección isométrica 3D de 4 capas arquitectónicas de **[CAPAS DE TU ARQUITECTURA: ej. Edge CDN -> Web App Shell -> Micro-Frontends -> Core API]** que se despliega en el eje Z (`Explode Z-Axis`) y eleva cada capa al pasar el ratón por encima.
- **`#007 Instantaneous Velocity Derivative |du/dt|`:** Cintas de volatilidad y estelas de velocidad proporcionales a la derivada instantánea de la serie temporal.
- **`#008 Dual Conic Perimeter Laser`:** Borde láser cónico giratorio activado automáticamente en tarjetas que superan el umbral de alerta.
- **`#009 Keplerian Phase-Space Attractor`:** Gráfico orbital de detección de anomalías donde los lotes u operaciones críticas giran en órbitas elípticas acelerando en el periapsis, acompañado de un radar poligonal de 6 ejes.

### 3. SISTEMA DE INTERACCIÓN Y TELEMETRÍA EN HOVER (OBLIGATORIO)
- **Floating Magnetic Telemetry HUD:** Crea un único HUD flotante translúcido que siga al cursor con amortiguación suave cada vez que el usuario pase el ratón por encima de CUALQUIER barra, punto de curva, nodo de red, capa 3D, celda de matriz o fila de tabla.
- El HUD debe mostrar en vivo:
  1. Identificador del elemento y etiqueta del patrón `motion-prompt` activo.
  2. Valor principal y delta porcentual / Z-score.
  3. Tabla de 4 métricas secundarias desglosadas.
  4. **Un micro-gráfico sparkline renderizado en vivo en un `<canvas>` dentro del propio tooltip**.
  5. La ecuación matemática exacta y parámetros ($\omega, \zeta, |du/dt|$) aplicados a ese punto.
- **Cross-Filtering y Click-to-Pin:** Hacer clic en un tramo temporal del gráfico principal o en un nodo de la topología debe fijar (`Pin`) ese corte de datos en todo el dashboard y abrir el desglose forense si se solicita.

Entrega el código completo, funcional, sin placeholders ni fragmentos omitidos.
```

---

## 5. Cómo adaptarlo a tus propios proyectos paso a paso

### Caso 1: Observabilidad de Canales Digitales y Arquitectura Web App Shell
- **Viz A (Serie Temporal 48 tramos):** Tráfico concurrente (req/s) separado por Host App Shell, MFE Pagos, MFE Posición Global y MFE Contratación, superpuesto con picos de error 5xx.
- **Viz B (Topología Dipolar `#003 + #005`):** Flujo entre Akamai/Cloudflare WAF → BFF (Backend for Frontend) → App Shell → Micro-Frontends federados → Core Bancario.
- **Viz C (Pila 3D Isométrica `#006`):** Las 4 capas de carga en el navegador: Service Worker Cache, App Shell Skeleton, Module Federation Remote Bundles y Estado Redux/Bus de Eventos.
- **Viz D (Matriz 7×6):** Segmento de cliente (Particulares, PyMEs, Empresas, Banca Privada) × Tiempo de Interactividad (TTI <500ms a >3s), mostrando tasa de abandono del funnel.

### Caso 2: Admisión de Riesgo de Crédito y Prevención de Fraude
- **Viz A (Serie Temporal + Fan de Confianza):** Volumen de préstamos pre-concedidos frente a banda de pérdida esperada (EL P05-P95) e impulsos de reglas de fraude disparadas.
- **Viz B (Topología Dipolar `#003`):** Grafo de contagio de fraude (dispositivos compartidos, IPs, cuentas mula y comercios sospechosos).
- **Viz D (Matriz de Superficie):** Rating interno (AAA a Substandard) × Canal de entrada, mostrando Probability of Default (PD) en puntos básicos y Exposure at Default (EAD).
- **Viz F (Atractor Kepleriano `#009`):** Operaciones en tiempo real orbitando según su Fraud Score (excentricidad $e$) e importe; las operaciones que caen al periapsis central se bloquean automáticamente.

### Caso 3: Monitorización de Pipelines de Datos e IA (Databricks / PySpark / LangGraph)
- **Viz A:** Rendimiento de ingesta en Delta Lake (filas/s) y consumo de DBUs/Tokens por hora.
- **Viz B:** Grafo multi-agente (LangGraph / MCP): Orquestador → Agente SQL → Agente Vectorial → Guardrails, donde el campo vectorial muestra cuellos de botella de latencia.
- **Viz C (Pila 3D `#006`):** Arquitectura Medallion: Bronze (Raw Ingestion) → Silver (Cleaned & Enriched) → Gold (Feature Store) → Serving / AI Agents.
- **Viz E (Flamegraph):** Tiempo de ejecución y memoria consumida por cada etapa del DAG de Spark o nodo del grafo de agentes.

---

## ANEXO TÉCNICO OBLIGATORIO: KERNEL BASE DE EJECUCIÓN (NO SIMPLIFICAR)

```javascript
// 1. GESTOR DE ALTA DENSIDAD RETINA (DPI-AWARE)
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

// 2. MOTOR DE RESORTES SUBAMORTIGUADOS (#002 + #007 DERIVADA)
class SpringChannel {
  constructor(size, omega = 14, zeta = 0.28) {
    this.x = new Float32Array(size);
    this.v = new Float32Array(size);
    this.target = new Float32Array(size);
    this.derivative = new Float32Array(size); // |du/dt| para #007
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

// 3. REGISTRO ESPACIAL DE COLISIONES PARA EL HUD MAGNÉTICO EN CANVAS
class CanvasHitRegistry {
  constructor(canvas, onHoverCallback, onLeaveCallback) {
    this.canvas = canvas;
    this.regions = []; // { type: 'rect'|'circle', x, y, w, h, r, payload }
    this.mouse = { x: -999, y: -999, clientX: 0, clientY: 0, inside: false };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.clientX = e.clientX;
      this.mouse.clientY = e.clientY;
      this.mouse.inside = true;
      this.checkHits(onHoverCallback, onLeaveCallback);
    });
    canvas.addEventListener('mouseleave', () => {
      this.mouse.inside = false;
      onLeaveCallback();
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

// 4. PROYECCIÓN ISOMÉTRICA 3D PARA ARQUITECTURA DE CAPAS (#006)
function projectIso(x, y, z, originX, originY) {
  const angle = Math.PI / 6; // 30 grados
  return {
    px: originX + (x - y) * Math.cos(angle),
    py: originY + (x + y) * Math.sin(angle) - z
  };
}
```
