---
name: paceui-styler
description: Transforma cualquier dashboard HTML en una aplicación analítica de alta fidelidad con estándar Tier 1 Global Banking (Bi-modal Dark/Light, Drill-down Modals, Matriz Riesgo-Retorno, Stress Testing paramétrico, Ordenación y Filtros reactivos).
---

# Habilidad Agencial: PaceUI Tier 1 Global Banking Styler

Esta habilidad especializa al agente en auditar, enriquecer y transformar dashboards analíticos en interfaces de grado institucional de Banca Corporativa y CIB (Tier 1).

## Reglas Inmutables de la Habilidad
1. **100% Autónomo**: Todo el código debe ser HTML5 + CSS3 + Vanilla JavaScript en un solo archivo ejecutable offline con doble clic (`file:///`).
2. **Sistema Bi-Modal Obligatorio**:
   - Variables CSS en `:root` para Dark Mode (PaceUI Core #0a0a0a).
   - Variables CSS en `html.light` para Light Mode (Executive Slate #f8fafc).
   - Alternador dinámico con persistencia en `localStorage` y atajo de teclado <kbd>T</kbd>.
3. **Inspección en Profundidad (Drill-Down)**:
   - Toda tarjeta KPI debe tener un evento `click` que despliegue el modal `#drilldownModal` con subcuentas IFRS 9 y conciliación.
   - Las barras del gráfico de evolución y las divisiones territoriales también deben admitir drill-down detallado.
4. **Matriz de Riesgo vs Retorno**:
   - Incorporar un diagrama de dispersión SVG interactivo que cruce Rentabilidad Ajustada al Riesgo (RAROC) frente a Probabilidad de Incumplimiento (PD).
   - Cuadrantes analíticos (Zona Óptima y Zona de Vigilancia) y burbujas clicables para abrir la Ficha 360° del cliente.
5. **Laboratorio de Stress Testing**:
   - Modal de simulación paramétrica con sliders para choque de tipos de interés (Euríbor) y de mora (NPL), recalculando dinámicamente CET1, NII y CoR.
6. **Filtros Reactivos y Acciones en Lote**:
   - Buscador universal instantáneo por CIF, Empresa, CNAE y Gestor.
   - Pestañas de producto financiero y filtros de sector y rating.
   - Cabeceras de tabla con ordenación interactiva (`▲▼`).
   - Checkboxes de selección de filas y muelle flotante de acciones en lote (`#batchDock`).
7. **Rendimiento y Accesibilidad**:
   - Animaciones a 60 FPS aceleradas por hardware (exclusivamente `transform` y `opacity`).
   - Tabular-nums en todos los dígitos para evitar saltos visuales.
   - Estilos `@media print` optimizados para generación de PDF sin elementos de navegación.
