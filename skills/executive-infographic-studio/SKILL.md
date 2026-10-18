---
name: executive-infographic-studio
description: Genera infografías ejecutivas de alta densidad visual (estilo Visual Capitalist, McKinsey y Financial Times) en SVG/HTML con conectores animados, diagramas de flujo de negocio, anatomía P&L y exportación a PNG 4K / PDF para enviar por correo o incrustar en PowerPoint.
---

# Skill: Estudio de Infografías Ejecutivas de Alta Densidad (SVG + Bento + Exportación PNG/PDF)

## Cuándo activar esta Skill
Activa esta skill cuando el usuario necesite explicar visualmente un circuito operativo, un producto de Banca Comercial (ej. Confirming, Factoring, Admisión STP, Cash Pooling), la anatomía de una métrica (RORWA, RAROC, P&L) o un resumen ejecutivo en formato **Infografía Póster / Lámina de Alta Densidad** lista para exportar como imagen o enviar por correo.

## Reglas de Diseño Infográfico Nivel Estudio
1. **Arquitectura Visual en 4 Zonas**:
   - **Cabecera Editorial**: Kicker técnico + Titular de tesis cuantitativa + Subtítulo contextual + Badge de fuente/fecha.
   - **Diagrama Central Vectorial (SVG de Alta Precisión)**: Nodos numerados (`01` a `05`), iconos vectoriales limpios, conectores Bézier curvos con partículas animadas (`stroke-dasharray` + `@keyframes flow`) que muestran la dirección del dinero, de los datos o del riesgo.
   - **Banda Comparativa / Anatomía Matemática**: Desglose visual de la fórmula (ej. `EAD × PD × LGD = Pérdida Esperada` o `TIN Cliente - FTP + Fees = Margen Comercial`) con barras proporcionales y códigos de color semánticos.
   - **Pie de Evidencia y Exportación Local**: Botón de exportación directa del nodo infográfico a PNG/SVG e impresión limpia `@media print`.
2. **Prohibido texto plano**: Ningún bloque de la infografía puede tener más de 22 palabras seguidas sin ir acompañado de una cifra gigante (`tabular-nums`), un badge porcentual o un micro-diagrama SVG.
