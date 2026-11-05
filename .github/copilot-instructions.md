# Directivas Maestras del Workspace: Estándar Tier 1 Global Banking & PaceUI

Este archivo define las reglas obligatorias e inmutables para cualquier agente de IA (GitHub Copilot, Cursor, Antigravity, Claude Code) que genere o refactorice dashboards analíticos en este espacio de trabajo.

---

## 🏛️ 1. Principio Fundamental: Estándar Mínimo Obligatorio
Cualquier dashboard generado en este proyecto **DEBE poseer como línea base mínima** el estándar visual y funcional de **Banca Corporativa Global / CIB Tier 1**. Queda terminantemente prohibido generar dashboards estáticos, tablas sin búsqueda reactiva, o tarjetas numéricas sin capacidad de inspección o drill-down.

Todo archivo debe ser **100% autónomo en HTML5 + CSS3 + Vanilla JS**, ejecutable con doble clic directo en el navegador (`file:///`), sin dependencias de Node.js, Webpack, Vite ni frameworks npm.

---

## 🎨 2. Sistema de Tokens Bi-modal (Dark Mode & Executive Light Mode)
Todo dashboard debe implementar soporte nativo para alternancia de tema sin recargar la página:
1. **Modo Oscuro (PaceUI Core Obsidian - Default)**:
   - Fondo: `--background: #0a0a0a`
   - Tarjetas y Contenedores: `--card: #171717` (hover: `#1f1f1f`)
   - Bordes: `--border: #282828` (sutil: `rgba(255, 255, 255, 0.08)`)
   - Textos: `--foreground: #fafafa`, muted: `--muted-foreground: #a1a1a1`
2. **Modo Claro (Executive Slate / Bloomberg Boardroom)**:
   - Activado mediante la clase `html.light` en la raíz del documento.
   - Fondo: `--background: #f8fafc`
   - Tarjetas: `--card: #ffffff` (hover: `#f1f5f9`)
   - Bordes: `--border: #e2e8f0`
   - Textos: `--foreground: #0f172a`, muted: `--muted-foreground: #64748b`
3. **Persistencia y Botón Switcher**:
   - Botón visible en el navbar superior (`☀️ Modo Claro` / `🌙 Modo Oscuro`) con guardado en `localStorage.getItem('paceui-theme')`.
   - Atajo de teclado: Tecla <kbd>T</kbd>.

---

## 📊 3. Especificación de Componentes Visuales Obligatorios

### A. Cabecera Ejecutiva y Ticker en Vivo
- Navbar flotante con desenfoque de cristal (`backdrop-filter: blur(14px)`).
- Indicador de estado de mercado en vivo (`🔴 En Vivo: ON (5s) / OFF`) con simulación de ticks aleatorios y micro-pulso esmeralda (`#10b981`).
- Acceso a atajos de teclado (`?`), simulador de estrés y exportación CSV/Impresión.

### B. Tarjetas KPI ("Alive Metrics" con Drill-Down)
- Mínimo 4 a 6 métricas financieras clave (ej. EAD, Margen Financiero, RORWA/RAROC, Mora NPL, CoR, CET1).
- Cada tarjeta debe incluir:
  * Etiqueta de categoría en píldora con borde discontinuo (`border: 1px dashed var(--border-dashed)`).
  * Cifra numérica principal en tipografía grande con `font-variant-numeric: tabular-nums;`.
  * Badge semántico de variación (verde `#10b981` positivo / rojo `#f43f5e` adverso).
  * Subtítulo explicativo de subcomponentes regulatorios (Stage 1, 2, 3 IFRS 9).
  * Micro-gráfico Sparkline dibujado en SVG puro con animación cinemática.
  * **Drill-down al hacer clic**: Al pulsar cualquier tarjeta KPI, DEBE abrirse el modal `#drilldownModal` mostrando el desglose contable, subcuentas y botón de descarga de informe en PDF.

### C. Visualizaciones Gráficas Avanzadas
1. **Gráfico de Evolución Temporal**:
   - Barras o líneas interactivas en SVG puro con etiquetas de meses.
   - Tooltips reactivos al posar el cursor con datos de producción y variación.
   - Al hacer clic en cualquier mes, DEBE abrirse la auditoría de ese periodo.
2. **Matriz de Riesgo vs Retorno (RAROC vs PD)**:
   - Diagrama de dispersión / burbujas en SVG interactivo.
   - Cuadrantes sombreados: *Zona Óptima* (Alto RAROC, Bajo PD) y *Zona de Vigilancia* (Bajo RAROC, Alto PD).
   - Cada burbuja representa una empresa o clúster; al hacer clic, abre la **Ficha 360°** de la empresa.
3. **Distribución Territorial / Divisiones**:
   - Barras de progreso de cumplimiento presupuestario con desglose por zonas geográficas.
   - Clic para filtrar o auditar la territorial seleccionada.

---

## 🔍 4. Motor de Tablas, Filtros y Acciones en Lote

### A. Filtros Multidimensionales Reactivos
- **Buscador en tiempo real** por Nombre de Empresa, CIF, CNAE, Sector o Gestor (con `oninput` insensible a mayúsculas y acentos).
- **Pestañas de Negocio** (Tabs): Todos, Factoring, Confirming, ICO Verde, etc.
- **Selectores de Sector y Rating** combinables entre sí.

### B. Tabla Ordenable y Checkboxes Masivos
- Cabeceras de columna con ordenación interactiva (`▲▼`) al hacer clic (Empresa, Sector, Rating, Límite, Propensión).
- Checkbox individual en cada fila + **Checkbox Maestro** en cabecera.
- **Muelle Flotante de Acciones en Lote (`#batchDock`)**: Aparece suavemente en el inferior de la pantalla cuando hay 1 o más filas seleccionadas, con botones para "Emitir Ofertas en Lote" y "Descargar CIRBE Masivo".

---

## 🧪 5. Laboratorio Paramétrico de Stress Testing (What-If)
Todo dashboard debe incorporar un simulador paramétrico de estrés accesible vía botón o atajo de teclado (<kbd>S</kbd>):
- Sliders para simular choque de tipos Euríbor (+0 a +300 bps) y choque de morosidad NPL (+0.0 a +2.5%).
- Recálculo matemático en tiempo real del ratio CET1, Margen de Intereses (NII) y Coste del Riesgo (CoR).

---

## ⚡ 6. Cinemática a 60 FPS y Rendimiento
- Prohibido animar propiedades que causen reflows (`width`, `height`, `top`, `margin`). Usar exclusivamente `transform` y `opacity`.
- Curva de animación institucional: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Compatibilidad universal de impresión con regla `@media print` que oculte navbars y adapte el contraste a tinta negra sobre papel blanco.

---

## 🏛️ 7. Sistemas Multi-Agente para Comités de Riesgo y Crédito (`/comite-multiagente`)
Cuando se solicite implementar flujos autónomos de decisión crediticia, comités de riesgos bancarios o suscripción de deuda (disponible vía prompt `/comite-multiagente` o skill `multiagent-risk-committee`):
1. **Grafo de Estado Determinista (LangGraph StateGraph):** Queda prohibido usar un único agente generalista. Se debe instanciar la red de 5 roles:
   - `FinancialAuditorAgent` (Balances, P&L, EBITDA normalizado, DSCR).
   - `MacroSectorAnalyst` (Sensibilidad a tipos BCE y materias primas).
   - `CovenantsComplianceOfficer` (Límites de apalancamiento y Basilea IV).
   - `RiskChallengerAgent` (**Abogado del Diablo**: obligatorio para auditar vulnerabilidades, fraudes contables y concentración).
   - `CommitteeChairAgent` (Consenso ponderado, dictamen y redacción del *Credit Memo*).
2. **Compuerta Human-in-the-Loop (HITL):** El flujo debe suspenderse antes de aprobar fondos (`interrupt_before`), exigiendo la validación y firma de un analista o director de riesgos humano.

---

## 👆 8. Física de Resortes, Microinteracciones y Manipulación Táctil a 120 FPS (`/kinetic-touch-physics`)
Cuando se solicite diseñar microinteracciones de alta fidelidad, componentes táctiles o animaciones orgánicas (disponible vía prompt `/kinetic-touch-physics` o skill `kinetic-touch-physics`):
1. **Física de Oscilador Armónico Amortiguado:** Reemplazar `ease-in` y transiciones lineales fijas por física matemática de resortes ($m \ddot{x} + c \dot{x} + kx = 0$) con rigidez (`stiffness`), masa (`mass`) y ratio de amortiguamiento ($\zeta \approx 0.75$ para rebote y $\zeta = 1.0$ para navegación críticamente amortiguada).
2. **Manipulación Táctil 1:1 y Lanzamiento Inercial:** Captura de eventos de puntero, resistencia elástica logarítmica (*rubber banding*) en topes y transferencia de la velocidad instantánea del usuario ($\vec{v} = \Delta y / \Delta t$) al soltar (*fling/toss*).
3. **Componentes de Autor:** Implementación de hojas deslizantes inferiores (*Drawers* tipo Vaul con compresión del fondo), notificaciones apilables con inercia (*Toasts* tipo Sonner) y tarjetas con respuesta háptica visual a 120 FPS sin layout thrashing.

---

## 🎯 9. Suite del Product Owner de Canales Digitales (`/po-digital-channels`)
Cuando el usuario opere en calidad de **Product Owner de Canales Digitales de Banca Comercial** (Web Empresas, App Corporativa, H2H / APIs):
1. **Confluence & PRDs (`/po-confluence`):** Generar documentación con formato institucional Atlassian Confluence, incluyendo obligatoriamente criterios de aceptación en sintaxis **Gherkin (`Given / When / Then`)** que cubran caminos felices y casos límite bancarios (poderes mancomunados insuficientes, sesiones caducadas, caídas de firma PKI) y contratos de API OpenAPI 3.1.
2. **Databricks Analytics (`/po-databricks`):** Proveer consultas PySpark y SQL optimizadas para el Lakehouse (Delta Lake) que calculen métricas de producto clave: ratio STP (Straight-Through Processing), embudos de drop-off entre pasos de contratación, P95 de latencia de APIs bancarias y métricas de ciclo (Time-to-Yes, Time-to-Sign, Time-to-Cash).
3. **Esquemas Técnicos y C4 (`/po-arch`):** Generar o auditar diagramas de integración de sistemas en **Mermaid** o **PlantUML** (Core Bancario, API Gateways mTLS, microservicios de lending, motores de riesgo y pasarelas de firma digital).
