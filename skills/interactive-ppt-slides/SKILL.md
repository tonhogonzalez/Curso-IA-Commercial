---
name: interactive-ppt-slides
description: Diseña diapositivas 16:9 interactivas por dentro (con pestañas clicables, simuladores de escenarios, transiciones Morph !!objeto, desencadenadores nativos de PowerPoint y mazos HTML 16:9 interactivos).
---

# Skill: Presentaciones e Híbridos PowerPoint Interactivos Dentro de Cada Slide

## Cuándo activar esta Skill
Activa esta skill cuando el usuario pida presentaciones ejecutivas donde **cada diapositiva sea interactiva por dentro** (cambiar pestañas sin pasar de slide, mover sliders de sensibilidad en pleno comité, hacer drill-down por canal Web/App o usar transiciones *Morph* `!!objeto` y *Triggers* en PowerPoint).

## 3 Arquitecturas de Interactividad Intra-Diapositiva

### 1. PowerPoint Nativo sin Macros: Convención `!!` (Transición Transformar / Morph) + Desencadenadores (Triggers)
- **Nomenclatura `!!` en el Panel de Selección**: En `python-pptx` o en PowerPoint manual, asigna el mismo nombre con doble signo de exclamación (`shape.name = "!!barra_rorwa"`, `shape.name = "!!kpi_card_1"`) entre dos diapositivas consecutivas con `Transición -> Transformar (Morph)` (duración `0.6s`). PowerPoint interpolará posición, tamaño y color a 60fps como si fuera una app reactiva.
- **Botones de Pestaña Intra-Slide**: Crea una barra de navegación superior en la diapositiva (`[ 1. Visión Global ]`, `[ 2. Detalle Canal App ]`, `[ 3. Sensibilidad Riesgo ]`) con hipervínculos internos (`action.target_slide`) o desencadenadores de animación (`Trigger on click of shape`) para mostrar/ocultar capas dentro de la misma lámina sin avanzar linealmente.

### 2. Diapositiva Panorámica 16:9 en HTML Interactivo (Micro-App Slide Deck)
Cuando el usuario quiera presentar desde el navegador o incrustar en PowerPoint vía *Web Viewer*, genera un contenedor con relación de aspecto bloqueada `16:9` (`max-width: 1280px; aspect-ratio: 16/9`) que incluya dentro de la misma lámina:
- **Conmutador de Pestañas Internas (Tabs)**: Cambia entre *Embudo Digital*, *Cascada P&L* y *Matriz de Riesgo* con `document.startViewTransition()`.
- **Simulador de Comité en Vivo**: 2 sliders integrados en la esquina superior derecha de la slide que recalculan los KPIs, el gráfico ECharts y el *Action Title* en tiempo real ante preguntas del Comité.
- **Píldoras de Objeciones CRO/CFO Clicables**: Botones en el pie de la diapositiva que despliegan un *Drawer* o *Callout* con el desglose técnico de defensa.
