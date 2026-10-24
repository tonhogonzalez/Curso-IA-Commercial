---
name: databricks-scrolly-deck
description: Genera celdas PySpark -> displayHTML() y extractores de contexto en Databricks 100% blindados contra bloqueos de red corporativos (Zero-CDN CSS nativo + Motor Gráfico Dual SVG/ECharts + Empaquetador Base64 para enviar por correo).
---

# Habilidad Agencial: Databricks PySpark → HTML Zero-CDN & Extractor de Contexto

Esta habilidad resuelve los **dos problemas críticos del trabajo real en Databricks dentro de banca**:
1. **Cómo extraer el contexto de un DataFrame en Databricks** para pasárselo limpio a VS Code o M365 Copilot sin desbordar tokens ni exponer millones de filas.
2. **Cómo lograr que `displayHTML()` y los archivos `.html` enviados por correo jamás salgan en blanco**, eliminando la dependencia de `cdn.tailwindcss.com` y añadiendo un motor gráfico SVG nativo de respaldo automático si el firewall corporativo bloquea el CDN de ECharts.

---

## 1. Extractor de Contexto en Databricks (`export_ai_context`)
Cuando el analista explora datos en Databricks y quiere llevarse el contexto a **VS Code** o **M365 Copilot**, debe ejecutar este bloque ligero que imprime el esquema, estadísticas agregadas y un JSON compacto listo para copiar y pegar:

```python
import json
from decimal import Decimal
from datetime import date, datetime
from pyspark.sql import functions as F

def _safe_json(obj):
    if isinstance(obj, Decimal): return float(obj)
    if isinstance(obj, (date, datetime)): return obj.isoformat()
    return str(obj)

def export_ai_context(df, group_col=None, max_rows=25):
    """Imprime en la celda de Databricks el bloque exacto para copiar y pegar en VS Code o M365 Copilot."""
    schema_str = ", ".join([f"{f.name} ({f.dataType.simpleString().upper()})" for f in df.schema.fields])
    sample_rows = [r.asDict(recursive=True) for r in df.limit(max_rows).collect()]
    payload = {"schema": schema_str, "row_count_sample": len(sample_rows), "rows": sample_rows}
    print("=== COPIA DESDE AQUÍ Y PEGA EN VS CODE O M365 COPILOT ===")
    print(f"ESQUEMA_COLUMNAS: {schema_str}")
    print("WINDOW_REPORT_DATA_JSON:")
    print(json.dumps(payload, default=_safe_json, ensure_ascii=False))
    print("=== FIN DEL CONTEXTO DATABRICKS ===")
```

---

## 2. Reglas Inmutables para que `displayHTML()` NUNCA salga en blanco

1. **PROHIBIDO USAR `cdn.tailwindcss.com` EN DATABRICKS**:
   - El script JIT de Tailwind CDN es bloqueado frecuentemente por el Content Security Policy (CSP) del `iframe` de Databricks o se ejecuta después del script principal, dejando los contenedores con `height: 0px`.
   - Usa **SIEMPRE un bloque `<style>` de CSS3 puro** con CSS Grid (`.kpi-grid`, `.main-grid`), variables `:root` / `html.light` y alturas explícitas en píxeles (`height: 360px; min-height: 360px;`).
2. **PROHIBIDO USAR F-STRINGS EN LA PLANTILLA HTML**:
   - Declara siempre `html_template = r"""<!DOCTYPE html>..."""` con el marcador `window.REPORT_DATA = __PYSPARK_PAYLOAD__;` y reemplázalo con `.replace("__PYSPARK_PAYLOAD__", payload_json)`.
3. **MOTOR GRÁFICO DUAL (SVG NATIVO INFALIBLE + ECHARTS OPCIONAL)**:
   - Nunca llames a `echarts.init(...)` sin verificar antes `if (typeof window.echarts !== 'undefined')`.
   - Incluye siempre la función de renderizado **SVG Vectorial Nativo (`renderNativeSvgChart`)** como motor primario o fallback automático. Así, tanto dentro del clúster aislado del banco como al abrir el `.html` desde Outlook sin internet, todas las gráficas (Barras, Combo Línea, Waterfall P&L, Scatter RAROC vs PD y Sparklines) se ven y animan al 100%.
4. **BARRA SUPERIOR DE DESCARGA `.HTML` PORTABLE EN BASE64**:
   - Codifica el HTML final hidratado en Base64 y muestra un banner superior con `<a href="data:text/html;base64,..." download="Informe_Comite.html">` para descargar el archivo en 1 clic y adjuntarlo por correo o Teams.
