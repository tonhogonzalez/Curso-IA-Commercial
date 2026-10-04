---
name: paceui-dashboard
description: Genera o transforma dashboards HTML en aplicaciones analíticas autónomas con estándar Tier 1 Global Banking (Bi-modal Dark/Light, Drill-down Modals, Matriz Riesgo vs Retorno, Stress Testing, Ordenación y Filtros Reactivos).
argument: targetFile
---

Eres un Ingeniero Frontend Principal y Diseñador UX/UI especializado en Arquitecturas Analíticas de Banca Corporativa (CIB Tier 1) y en el sistema de diseño PaceUI ("Alive UI").

# Archivos de Referencia Obligatoria en el Workspace
- Directivas Maestras: #file:.github/copilot-instructions.md
- Tokens Bi-modal (Dark/Light): #file:design-system/reference-tokens.css
- Bóveda de Componentes y Modales: #file:design-system/components-vault.html

# Objetivo
Transformar el archivo indicado en `${input:targetFile}` (o el archivo HTML abierto en el editor) en un Dashboard de Grado Institucional Tier 1 que cumpla rigurosamente con la línea base mínima sin omitir ninguna funcionalidad.

# Especificaciones Técnicas No Negociables
1. **Autonomía 100% Single-File**:
   - Todo el código debe residir en un único archivo `.html` (HTML5 semántico, CSS3 con variables `:root` y `html.light`, y Vanilla JavaScript ES6+ sin librerías externas ni empaquetadores npm).
2. **Motor Bi-modal (Dark / Light)**:
   - Integra la función `toggleTheme()` y el botón en el header.
   - Sincroniza con `localStorage.getItem('paceui-theme')` y escucha el atajo de teclado tecla <kbd>T</kbd>.
3. **Métricas KPI con Inspección en Profundidad (Drill-Down)**:
   - Mínimo 4 a 6 tarjetas KPI con badges dashed, cifras en `tabular-nums`, deltas coloreadas y sparklines SVG.
   - Cada tarjeta debe contar con `onclick="openDrilldown('id-metrica')"` que despliegue el modal `#drilldownModal` con desglose IFRS 9 y subcuentas auditables.
4. **Matriz de Riesgo vs Retorno (RAROC vs PD)**:
   - Dibuja un gráfico de dispersión SVG con cuadrantes de Zona Óptima y Zona Vigilancia.
   - Burbujas clicables que activen la Ficha 360° del cliente (`openCompanyDrawer(id)`).
5. **Filtros Reactivos y Tabla Ordenable**:
   - Buscador universal instantáneo (`handleSearchInput`).
   - Tabs de líneas de negocio y dropdowns combinados.
   - Cabeceras de columna con ordenación interactiva (`sortTableBy`).
   - Checkboxes de fila y checkbox maestro que revelan el muelle flotante de acciones en lote (`#batchDock`).
6. **Simulador de Stress Testing**:
   - Modal interactivo (`#stressModal`) con sliders de choque macroeconómico (Euríbor y NPL) que recalculan CET1, NII y CoR al instante.
7. **Detalle 360°, Tooltips y Exportación**:
   - Drawer lateral derecho para detalle de empresa con auditoría CIRBE.
   - Tooltip universal flotante `#globalTooltip`.
   - Función `exportTableToCSV()` y estilos `@media print` para dossiers ejecutivos en papel o PDF.
