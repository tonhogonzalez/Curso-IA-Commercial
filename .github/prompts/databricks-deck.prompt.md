---
name: databricks-deck
description: Genera una celda completa de Databricks (PySpark -> displayHTML) 100% blindada Zero-CDN (nunca sale en blanco), con CSS puro, Motor Gráfico Dual (SVG Nativo + ECharts), Simulador What-If, Auto-Insights y Descarga .HTML para correo.
argument: sparkColumnsOrTable
---

Actúa como un Principal Design Engineer y Arquitecto de Datos PySpark en Databricks para Banca Comercial y Corporativa.

# Referencias Obligatorias
- Lee y aplica íntegramente: #file:skills/databricks-scrolly-deck/SKILL.md
- Lee las primitivas de animación y diseño: #file:skills/aesthetic-motion-critic/SKILL.md

# Objetivo
Construir un bloque de código Python para **1 única celda de Databricks** (o un archivo `.html` autónomo si el usuario ya pegó los datos extraídos de Databricks) a partir de `${input:sparkColumnsOrTable}`.

# Reglas Críticas Anti-Fallos en Entorno Bancario
1. **CERO DEPENDENCIA DE TAILWIND CDN (`cdn.tailwindcss.com` PROHIBIDO)**:
   - Declara todo el sistema de diseño en un bloque `<style>` puro con variables `:root` (Dark `#070a12`) y `html.light` (Light `#f8fafc`), `font-variant-numeric: tabular-nums`, `.sp-card` con iluminación Spotlight y contenedores de gráficos con altura explícita (`height: 350px`).
2. **MOTOR GRÁFICO INFALIBLE (NUNCA PANTALLA EN BLANCO)**:
   - Incluye renderizadores **SVG Vectoriales Nativos** (Barras + Línea, Waterfall P&L, Scatter Riesgo-Retorno y Sparklines de 12 meses) con animación `#MP-01` / `#MP-03` para que el dashboard funcione al 100% incluso si el firewall del banco bloquea CDNs externos. Si usas ECharts, envuélvelo en `if (typeof echarts !== 'undefined')` con fallback automático al motor SVG nativo.
3. **INTERACTIVIDAD EJECUTIVA OBLIGATORIA**:
   - **Action Title Dinámico + Narrador Automático (`#MP-10`)**: Banner superior que calcula la brecha contra el Hurdle Rate (RORWA 2,50%) y redacta las alertas de Stage 2 / STP al filtrar.
   - **Buscador Instantáneo + Pestañas de Segmento + Ordenación de Tabla (`▲▼`)**.
   - **Simulador What-If en Vivo (`#MP-09`)**: Sliders de Spread (bps) y Mora/Fricción que recalculan KPIs (con contador interpolado `#MP-02`), gráficos y tabla en tiempo real.
   - **Slide-Over Inspector 360° (`#MP-08`)**: Al hacer clic en cualquier fila o barra, despliega el panel lateral con Radar SVG de 5 ejes y desglose de la operación/segmento.
   - **Empaquetador Base64 para Correo + Exportación CSV/PDF**: Botón para descargar el `.html` autónomo, botón para bajar la vista filtrada a Excel (`.csv` con BOM UTF-8 `\uFEFF` y `;`) y botón de cambio de tema Claro/Oscuro (`☀️ / 🌙`).
