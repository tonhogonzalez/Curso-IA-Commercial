---
name: databricks-scrolly-deck
description: Genera presentaciones interactivas dirigidas por pasos (Scrollytelling) y dashboards ejecutivos en una sola celda de Databricks (PySpark -> displayHTML) sin colisión de llaves, con Morphing Geométrico en Apache ECharts, Action Titles dinámicos y botón de escape a Pantalla Completa vía Blob URL.
---

# Habilidad Agencial: Databricks PySpark Scrollytelling & Executive Deck Builder

Esta habilidad especializa al agente en construir aplicaciones analíticas y presentaciones ejecutivas interactivas dentro de celdas de Databricks (`PySpark` $\rightarrow$ `displayHTML()`), eliminando las limitaciones del `<iframe>` y la degradación de código por `f-strings`.

## Reglas Inmutables de Arquitectura (PySpark $\rightarrow$ HTML)

1. **PROHIBIDO USAR F-STRINGS EN EL BLOQUE HTML**:
   - Jamás declares el HTML usando `f"""<!DOCTYPE html>..."""`, ya que obliga a escapar llaves dobles `{{ }}` en CSS y JavaScript, provocando errores `ValueError` o `KeyError` y reduciendo la complejidad visual.
   - Declara SIEMPRE el HTML como una cadena cruda `html_template = r"""<!DOCTYPE html>..."""` con un único marcador `window.REPORT_DATA = __PYSPARK_PAYLOAD__;` y realiza la inyección limpia con `.replace("__PYSPARK_PAYLOAD__", payload_json)` justo antes de invocar `displayHTML()`.

2. **CAPA DE PRE-CÁLCULO VECTORIAL EN PYSPARK**:
   - Agrega siempre los datos en el clúster con PySpark antes de ejecutar `.collect()`.
   - Empaqueta las series temporales de 12 periodos como vectores nativos mediante `F.collect_list()` para alimentar micro-sparklines SVG en el navegador.
   - Si hay flujos de conversión o admisión, pre-calcula las listas `nodes` y `links` (`source`, `target`, `value`) para diagramas Sankey.
   - Usa un serializador seguro en `json.dumps(..., default=spark_json_default)` que convierta `Decimal` a `float` y `date/datetime` a `isoformat()`.

3. **ARQUITECTURA DEL HTML EN 3 BLOQUES ESTRICTOS**:
   - **Bloque 1 (Motor de Estilos y Tokens)**: Tailwind CDN + Variables CSS (`:root`) + `JetBrains Mono` con `font-variant-numeric: tabular-nums` obligatorio en todos los KPIs, tablas y ejes + Shader CSS `.sp-card` de iluminación especular reactiva al ratón (`--mx`, `--my` con `mask-composite: exclude`).
   - **Bloque 2 (Payload de Datos Aislado)**: `<script id="data-payload">window.REPORT_DATA = __PYSPARK_PAYLOAD__;</script>`.
   - **Bloque 3 (Motor Reactivo y Coreografía de Pasos)**: Estado global único (`state`), navegación por pasos (`goToStep(1..N)`) con soporte de teclado (`ArrowRight` / `ArrowLeft`), y **Action Title dinámico** estilo consultoría estratégica que reescribe la conclusión ejecutiva según los filtros o sliders de sensibilidad activos.

4. **INTERACTIVIDAD AVANZADA CON APACHE ECHARTS & ECHARTS-GL**:
   - Activa `universalTransition: { enabled: true, divideShape: 'clone' }` compartiendo el mismo `id` de serie para transformar físicamente un gráfico en otro (ej. Cuadrante Scatter $\leftrightarrow$ Treemap Jerárquico $\leftrightarrow$ Ranking de Barras).
   - Sincroniza múltiples lienzos con `echarts.connect()`.
   - Configura tooltips con Glassmorphism (`backdrop-filter: blur(10px)`), bordes de 1px semitransparentes y formato numérico `Intl.NumberFormat('es-ES')`.

5. **ESCAPE DEL SANDBOX DE DATABRICKS (BOTÓN PANTALLA COMPLETA BLOB URL)**:
   - Incluye siempre un botón `↗ Pantalla Completa` que tome el código fuente de la plantilla inyectada (guardado en un `<template id="raw-source">` o reconstruyendo el documento antes de inicializar instancias colisionadas) y abra un `Blob` (`URL.createObjectURL(new Blob([cleanHtml], {type: 'text/html;charset=utf-8'}))`) en una pestaña nueva a `100dvh`.
