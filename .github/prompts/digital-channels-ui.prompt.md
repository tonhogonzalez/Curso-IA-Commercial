---
name: digital-channels-ui
description: Genera un dashboard o terminal ejecutivo para análisis de Canales Digitales (Web & App) en Banca Comercial con Lucide Icons, Embudo Sankey de fricción UX, Matriz de Transición de Markov, Frontera Eficiente y Superficie 3D ECharts-GL.
argument: channelDataContext
---

Actúa como un Principal UX/UI Engineer y Especialista en Analítica Cuantitativa de Canales Digitales (Web & App) para Banca Comercial.

# Referencias Obligatorias en el Workspace
- Habilidad de Canales Digitales: #file:skills/digital-channels-telemetry/SKILL.md
- Habilidad de Refinamiento Estético: #file:skills/aesthetic-motion-critic/SKILL.md

# Objetivo
Crear un terminal analítico interactivo (en HTML autocontenido o celda `PySpark -> displayHTML`) para el caso de uso de canales digitales indicado en `${input:channelDataContext}`.

# Especificaciones Obligatorias
1. **Identidad Visual Tecnológica & Lucide Icons**:
   - Carga `https://unpkg.com/lucide@latest` y ejecuta `lucide.createIcons()`.
   - Codificación cromática por canal: **Cian (`#06B6D4`)** para App Móvil, **Índigo (`#6366F1`)** para Web Corporativa/Empresas, **Esmeralda (`#10B981`)** para Conversión/Objetivo cumplido y **Rosa (`#F43F5E`)** para Fricción UX / Drop-off / Latencia crítica.
   - Conmutador superior instantáneo: `Omnicanal` | `App Móvil` | `Web Empresas` | `Híbrido Gestor`.
2. **Visualizaciones Cuantitativas Adaptadas a Digital Commercial**:
   - **Vista 1 — Embudo Multinivel Sankey (`type: 'sankey'`)**: Flujo desde Sesiones/Login -> Simulador -> Solicitud Iniciada -> desglose en Contratación Final, Abandono por Fricción UX y Rechazo en Admisión STP.
   - **Vista 2 — Matriz de Transición de Navegación (Markov Heatmap)**: Probabilidad condicional $P(S_{t+1} \mid S_t)$ de salto entre secciones de la App/Web.
   - **Vista 3 — Frontera Eficiente Comercial / Superficie 3D (`ECharts-GL`)**: Relación entre Latencia/Fricción UX, Precio/Comisión y Ratio de Conversión Neta.
3. **Tabla Telemétrica + Slide-Over Inspector Drawer**:
   - Tabla inferior con Sparklines SVG vectoriales de 12 periodos por etapa o producto digital.
   - Al hacer clic en cualquier fila o nodo del gráfico, despliega el panel lateral derecho con `backdrop-filter: blur(24px)` mostrando el gráfico Radar de 5 ejes del canal/producto (*Conversión UX, Tiempo de Respuesta, Aprobación STP, Margen/LTV, Retención*).
