# Catálogo de 8 Prompts Genéricos Conectados al Grafo M365 (Uso Diario del PO)

> **Por qué son tan cortos:** Como el Agente ya tiene cargadas sus instrucciones (`< 8.000` caracteres), la Plantilla Universal (`01`), el Catálogo UX (`02`), el Checklist Red Team (`03`) y acceso directo a tu **Microsoft Graph**, no necesitas pegarle parrafadas ni explicarle el formato cada vez. Solo dale la orden y apunta al proyecto o reunión.

---

### 1. Auditoría del Grafo Pre-Refinement (Turno 1 — Limpiar ruido)
```markdown
Busca en mi Grafo de M365 (reuniones grabadas/transcritas de Teams, hilos de chat, correos y documentos en SharePoint/OneDrive) todo el contexto reciente sobre [Nombre del Proyecto / Iniciativa].

No redactes el Confluence todavía. Ejecuta el MODO A (Auditoría Pre-Refinement):
1. Decisiones firmes ordenadas cronológicamente (indicando qué cambió respecto a presentaciones iniciales).
2. Qué quedó explícitamente fuera de alcance (Out of Scope).
3. Restricciones técnicas (Web, App, Shell, APIs, Host/Batch, Figma).
4. Impactos regulatorios, de seguridad o datos (SCA, PII, custodia, AI Act).
5. Lista de dudas sin cerrar o contradicciones entre equipos con el nombre/rol de quien debe resolverlas.
```

---

### 2. Generación Adaptativa del Confluence (Turno 2 — Ensamblador Universal)
```markdown
Con las correcciones que te indico: [pega aquí tus 2-3 ajustes al Turno 1, o di "todo correcto"], ejecuta el MODO B.

Detecta automáticamente qué arquetipos aplican a [Nombre del Proyecto] (UI/Figma, Integración Shell, Transaccional/SCA, Chatbot/IA o APIs/Batch) y genera la página completa de Confluence en Markdown nativo sin HTML usando tu Plantilla Universal.

Recuerda: cero lenguaje de relleno, marca con bloque [PENDIENTE DEFINIR CON <Nombre>] todo lo que no esté cerrado en el Grafo, e incluye el diagrama Mermaid listo para Draw.io.
```

---

### 3. Actualización Incremental tras Nueva Reunión (Delta Update)
*Úsalo cuando ya tienes el Confluence redactado y acabas de salir de una nueva reunión o discusión en Teams.*

```markdown
Acaba de celebrarse [nombre/fecha de la reunión o hilo reciente de Teams] sobre [Nombre del Proyecto].
Cruza lo nuevo del Grafo contra esta especificación actual:
[Pega el Confluence actual o referencia el archivo]

No reescribas todo el documento. Devuélveme únicamente el DELTA DE CAMBIOS en 3 bloques:
1. Reglas o criterios modificados (Antes -> Ahora, citando quién lo aprobó).
2. Nuevos casos borde o bloqueos [PENDIENTE] que han surgido.
3. Párrafos y filas de tabla exactos que debo sustituir o añadir en Confluence.
```

---

### 4. Puente sobre Figma: Los 5 Estados Invisibles + Microcopy
*Úsalo cuando Diseño ya te ha pasado el Figma y te toca redactar la especificación funcional sin repetir lo obvio.*

```markdown
Para la iniciativa [Nombre del Proyecto], el diseño visual ya está cerrado en Figma ([enlace o descripción breve de las pantallas]).

Genera exclusivamente la capa funcional que Figma no muestra:
1. Tabla de origen de datos por campo y reglas de truncado/formato diferencial entre Web y App móvil (375px).
2. Matriz completa de los 5 Estados Invisibles (Vacío, Carga/Idempotencia, Desbordamiento/Límites, Error sin pérdida de datos y Permisos/Bloqueos) con el microcopy exacto para el cliente.
3. Wireframes en bloque ASCII únicamente para modales de error o contingencias no diseñadas en Figma.
```

---

### 5. Contratos Técnicos (Shell Bridge, APIs y Resiliencia)
*Úsalo para cerrar la parte técnica con Arquitectura, Mobile y Backend antes del Sprint Planning.*

```markdown
Centrándonos en la integración técnica de [Nombre del Proyecto] según el contexto en mi Grafo M365, genera únicamente:
1. Esquema ASCII de comunicación entre contenedores/sistemas (`Shell <-> Módulo <-> BFF/Core`).
2. Tabla de Contrato de Eventos / Endpoints (payload, manejo de `HTTP 409/503/504`, silent refresh de token e intercepción de navegación "Atrás" en Web/Android/iOS).
3. Matriz de Resiliencia, comportamiento en ventanas nocturnas/batch del Core y Feature Flags (`Kill Switch`) para apagar en remoto sin pasar por Stores.
```

---

### 6. Comité Red Team (Auditoría de Arquitectura, Fraude y QA)
*Úsalo para blindar cualquier borrador de Confluence antes de compartirlo con el equipo.*

```markdown
Ejecuta el MODO C (Auditoría Red Team) usando tu Checklist Banca Tier 1 sobre esta especificación:
[Pega tu borrador de Confluence]

Audita los 7 vectores críticos (corte de 4G tras confirmar, ventanas batch, race conditions, fugas PII, deuda WebView iOS/Android, UX de errores silenciosos y custodia legal). Devuélveme la tabla de hallazgos con Severidad, Agujero detectado y el texto exacto listo para añadir al Confluence.
```

---

### 7. Paquete de Anexos Operativos (Analítica, Audit Trail e i18n)
*Úsalo cuando el Confluence funcional está aprobado y Desarrollo pide el detalle operativo de cierre.*

```markdown
A partir de la especificación validada de [Nombre del Proyecto], genera los 3 anexos operativos estándar Banca Tier 1:
1. Plan de Etiquetado de Analítica Digital (eventos, triggers y dimensiones con regla estricta Anti-PII).
2. Matriz de Trazabilidad de Auditoría Inmutable (Audit Trail) y Logs de Soporte N2.
3. Diccionario de claves `i18n` con todos los literales de pantalla y límite máximo de caracteres para móvil (`375px`).
```

---

### 8. Desglose a Jira (Vertical Slicing + Definition of Ready)
*Úsalo cuando la página de Confluence pasa a `🟢 Cerrado` para llenar el backlog del Sprint.*

```markdown
Toma el Confluence cerrado de [Nombre del Proyecto] y desglósalo en Historias de Usuario para Jira aplicando Vertical Slicing (incrementos funcionales verificables de principio a fin, separando habilitadores de Shell/API solo si bloquean al resto).

Para cada HU entrega: Título, Valor en 3 líneas, Dependencias DoR (Figma/BFF/Shell), Criterios de Aceptación (1 feliz + 1 error + 1 analítica/auditoría), Explicit Scope Cut y el orden recomendado de Sprints bajo Feature Flag.
```
