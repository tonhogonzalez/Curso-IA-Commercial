---
name: digital-channels-telemetry
description: Especialista en diseño y analítica cuantitativa para Canales Digitales (Web & App) en Banca Comercial. Integra Lucide Icons, estética Cyber-Terminal, Embudos Sankey de fricción UX, Matrices de Transición de Markov entre pantallas, Frontera Eficiente Comercial y Superficies 3D en ECharts-GL.
---

# Habilidad Agencial: Digital Channels (Web & App) Telemetry & Commercial Intelligence

Esta habilidad especializa al agente en transformar datos de sesiones digitales (Web Corporativa, App Móvil, Onboarding, Simuladores y Contratación) y métricas de Banca Comercial en consolas analíticas de estética tecnológica y rigor cuantitativo.

## Reglas Inmutables de la Habilidad

1. **ESTÉTICA TECNOLÓGICA & LUCIDE ICONS**:
   - Lienzo oscuro de alta precisión (`#04060C` / `#060913`) con acentos semánticos diferenciados por canal: **Cian (`#06B6D4`)** para App Móvil, **Índigo (`#6366F1`)** para Web Corporativa, **Esmeralda (`#10B981`)** para Conversión/RORWA óptimo y **Rosa (`#F43F5E`)** para Fricción UX / Drop-off / Error API.
   - Carga obligatoria de **Lucide Icons** (`https://unpkg.com/lucide@latest`) e invocación de `lucide.createIcons()` tras cada renderizado dinámico. Cada KPI, etapa del funnel y pestaña debe llevar su icono vectorial (`cpu`, `smartphone`, `globe`, `git-merge`, `activity`, `zap`, `shield-alert`).

2. **MODELOS VISUALES CUANTITATIVOS APLICADOS A WEB & APP**:
   - **Embudo Multinivel Sankey (`type: 'sankey'`)**: Trazabilidad completa desde el tráfico inicial (*Login / Home*) $\rightarrow$ *Simulador de Producto* $\rightarrow$ desglose entre *Conversión Final*, *Abandono por Fricción UX (Drop-off)* y *Filtro de Admisión/Riesgo (STP Reject)*.
   - **Matriz de Transición de Navegación de Markov (`type: 'heatmap'`)**: Matriz $N \times N$ que muestra la probabilidad condicional $P(S_{t+1} \mid S_t)$ de que un usuario salte de una sección de la App/Web a otra en la misma sesión.
   - **Frontera Eficiente Comercial (Markowitz UX/Ventas)**: Cruza en un Scatter Plot la *Fricción / Latencia (ms o Drop-off %)* en el eje X frente al *Ratio de Conversión / LTV* en el eje Y, dibujando la curva teórica de frontera eficiente.
   - **Superficie Topográfica 3D Rigurosa (`echarts-gl` `type: 'surface'`)**: Modela la sensibilidad simultánea de dos variables continuas (ej. *Eje X: Latencia API o Precio TIN*, *Eje Y: Pasos del Funnel o Plazo*, *Eje Z: Conversión Neta o Margen Comercial*) con ejes cartesianos etiquetados y proyección de curvas de nivel. Prohibido usar primitivas 3D decorativas sin ejes ni escala matemática.

3. **CONMUTADOR OMNICANAL REACTIVO**:
   - Incluye selector instantáneo `Omnicanal (Todos)` | `App Móvil` | `Web Empresas` | `Flujo Híbrido (Gestor)` que recalcula los KPIs superiores con interpolación `requestAnimationFrame` (`easeOutQuart`) y actualiza todas las gráficas con `universalTransition: true`.
