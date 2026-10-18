---
name: databricks-deck
description: Genera una celda completa de Databricks (PySpark -> displayHTML) con Scrollytelling en 3 pasos, Morphing Geométrico en ECharts, Action Title dinámico, Spotlight CSS y escape a Pantalla Completa (Blob URL).
argument: sparkColumnsOrTable
---

Actúa como un Principal Design Engineer y Arquitecto de Datos PySpark en Databricks.

# Referencia de Habilidad Obligatoria
- Lee y aplica íntegramente: #file:skills/databricks-scrolly-deck/SKILL.md

# Objetivo
Construir un bloque de código Python para **1 única celda de Databricks** a partir de la estructura de datos o tabla indicada en `${input:sparkColumnsOrTable}` (o el script abierto en el editor).

# Restricciones Técnicas No Negociables
1. **Puente PySpark -> HTML sin f-strings**:
   - Declara la plantilla HTML como `html_deck = r"""<!DOCTYPE html>..."""` (raw string) para no escapar llaves `{}` en CSS ni JS.
   - Agrega los datos en PySpark antes de `.collect()`, generando vectores de 12 periodos (`F.collect_list`) para Sparklines y estructuras `nodes`/`links` si procede un Sankey.
   - Inyecta el JSON mediante `html_deck.replace("__PYSPARK_PAYLOAD__", payload_json)` con un serializador seguro para `Decimal` y `Date`, y renderiza con `displayHTML()`.
2. **Arquitectura Visual de Estudio (Estética Cyber-Terminal)**:
   - Lienzo oscuro `#05070E`, tarjetas `.sp-card` con iluminación especular reactiva al ratón (`--mx`, `--my` y `mask-composite: exclude`).
   - Tipografía `Inter` + `JetBrains Mono` con `font-variant-numeric: tabular-nums` en todos los números, KPIs, tablas y ejes.
3. **Coreografía Dirigida por Pasos (Step-Driven Deck)**:
   - Barra superior con al menos **3 pasos narrativos** navegables con clic y flechas del teclado (`ArrowLeft` / `ArrowRight`).
   - **Action Title dinámico** estilo consultoría ejecutiva que reescribe la conclusión cuantitativa al cambiar de paso, mover los sliders de sensibilidad o filtrar un segmento.
   - **Morphing Geométrico Universal**: comparte el mismo `id` de serie en Apache ECharts con `universalTransition: { enabled: true, divideShape: 'clone' }` para transformar las vistas en vivo.
4. **Escape del Sandbox de Databricks (Pantalla Completa Fiable)**:
   - Guarda la plantilla HTML base en memoria antes de inicializar ECharts (o reconstruye el HTML limpio con el JSON inyectado) para que el botón `↗ Pantalla Completa` abra un `Blob URL` (`URL.createObjectURL`) en una pestaña nueva a `100dvh` con todos los gráficos 100% operativos.
