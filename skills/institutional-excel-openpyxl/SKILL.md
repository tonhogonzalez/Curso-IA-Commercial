---
name: institutional-excel-openpyxl
description: Genera scripts de Python (openpyxl / xlsxwriter), bloques de Python in Excel (=PY()) y Office Scripts (TypeScript) con acabado de modelado financiero institucional (sin cuadrícula base, márgenes de respiración, formatos condicionales Unicode, DataBarRule y fórmulas dinámicas nativas).
---

# Habilidad Agencial: Institutional Financial Excel Builder (Python OpenPyXL & M365 Excel)

Esta habilidad especializa al agente en automatizar hojas de cálculo ejecutivas con estándar de banca de inversión y consultoría estratégica, eliminando por completo la estética por defecto de Excel.

## Reglas Inmutables para Scripts Python (`openpyxl` / `xlsxwriter`)

1. **LIENZO LIMPIO Y GEOMETRÍA RESPIRABLE**:
   - Oculta SIEMPRE la cuadrícula base en todas las hojas del libro (`ws.views.sheetView[0].showGridLines = False`).
   - Deja la **Columna A** (`width = 3`) y la **Fila 1** (`height = 15`) completamente vacías como margen perimetral. Todo reporte comienza en la celda `B2`.
   - Inmoviliza paneles (`ws.freeze_panes`) justo debajo de la cabecera de la tabla principal.
   - Fija alturas de fila explícitas con alineación vertical centrada (`vertical="center"`):
     * Bloque de Título: `34pt`
     * Cabeceras de Tabla: `28pt`
     * Filas de Datos: `22pt`
     * Filas de Totales: `26pt`
   - Autoajusta el ancho de todas las columnas calculando la longitud máxima del texto formateado + `5` caracteres de holgura (mínimo `13`, máximo `45`).

2. **PALETA EJECUTIVA, BORDES CONTABLES Y AUDITORÍA DE COLOR**:
   - Familia tipográfica única en todo el libro: `'Segoe UI'` o `'Aptos'`.
   - Cabeceras de tabla en **Azul Noche (`#0F172A`)** con texto blanco (`#FFFFFF`) en negrita.
   - Filas de datos con *Zebra Striping* alternando blanco (`#FFFFFF`) y gris pizarra ultra sutil (`#F8FAFC`), con borde inferior horizontal fino (`thin`, `#E2E8F0`). Prohibido usar bordes verticales negros gruesos.
   - Filas de Totales con relleno `#F1F5F9`, fuente en negrita, borde superior `thin` (`#0F172A`) y **borde inferior doble contable** (`double`, `#0F172A`).
   - Convención financiera de auditoría para modelos parametrizables: Inputs/Parámetros manuales en texto azul (`#0000FF`), fórmulas calculadas en negro/pizarra (`#0F172A`) y vínculos a otras pestañas en verde oscuro (`#047857`).

3. **FORMATOS NUMÉRICOS CONDICIONALES Y MICRO-ANALÍTICA EN CELDA**:
   - Prohibido entregar celdas numéricas en formato `General`. Aplica máscaras explícitas:
     * Importes / Moneda: `#,##0.0 "M€";(#,##0.0) "M€";"-"` o `#,##0 €;(#,##0) €;"-"`
     * Enteros / Usuarios: `#,##0;(#,##0);"-"`
     * Variaciones porcentuales con símbolos Unicode integrados: `[Color10]"▲ "0.0%;[Red]"▼ "-0.0%;"—"0.0%`
   - Añade reglas de barras de datos (`DataBarRule`) con tonos sobrios (`#6366F1` o `#0EA5E9`) en las columnas principales de volumen.
   - Utiliza SIEMPRE **fórmulas nativas de Excel** (`=SUM(...)`, `=AVERAGE(...)`, `=SUBTOTAL(9, ...)`, `=IFERROR(...)`) en las filas de totales y bloques de KPIs superiores, nunca valores estáticos precalculados en Python.
