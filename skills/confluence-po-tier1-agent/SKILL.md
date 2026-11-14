---
name: confluence-po-tier1-agent
description: Arquitectura completa, instrucciones del sistema (< 8.000 caracteres) y base de conocimiento modular para crear un Agente Especialista en Confluence dentro de M365 Copilot / Copilot Studio. Conectado al Grafo de Microsoft 365 (reuniones Teams, chats, correos, PPTs, Word) para generar especificaciones técnicas y funcionales nivel Banca Tier 1 sin HTML y adaptadas dinámicamente a cualquier contexto de producto.
---

# Skill: Agente Especialista Confluence PO — Estándar Banca Tier 1 (M365 Graph)

Esta skill define el paquete completo para desplegar un **Agente Declarativo en M365 Copilot (Agent Builder / Copilot Studio)** especializado en transformar el contexto disperso de tu **Microsoft Graph** (reuniones grabadas/transcritas de Teams, hilos de chat, correos, presentaciones PPT y documentos Word) en páginas de **Confluence listas para Refinamiento, Desarrollo, UX, QA, Arquitectura y Compliance**.

El Agente es **agnóstico al dominio (context-agnostic)**: detecta automáticamente la naturaleza de la iniciativa y activa únicamente los módulos funcionales, técnicos y regulatorios pertinentes (UI/Figma, Integración Shell, Operativa Transaccional/SCA, Chatbot/GenAI o APIs/Procesos Batch), evitando plantillas rígidas o relleno genérico.

---

## 1. Inventario de Archivos del Paquete del Agente

Guarda y carga estos archivos en el Agente dentro de tu entorno M365:

| Archivo | Destino en M365 Copilot Agent | Propósito dentro del Agente |
| :--- | :--- | :--- |
| **`SKILL.md`** | Documentación maestra / Referencia | Define la arquitectura, flujo de uso, conexión al Grafo y *Starter Prompts*. |
| **`00_INSTRUCCIONES_AGENTE_COPILOT_MAX8000.md`** | Campo **"Instrucciones" (System Prompt)** | Cerebro operativo del Agente (entre 5.800 y 7.400 caracteres; siempre `< 8.000`). Controla la lectura del Grafo M365, el enrutador modular (A–E), el tono anti-IA y el formato sin HTML. |
| **`01_PLANTILLA_UNIVERSAL_MODULAR_CONFLUENCE.md`** | **Base de Conocimiento (Archivo #1)** | Esqueleto modular en Markdown nativo con el Núcleo Universal y los 5 Módulos Especialistas (A–E) adaptables a cualquier producto o plataforma. |
| **`02_CATALOGO_ESTADOS_UX_Y_PATRONES_ASCII.md`** | **Base de Conocimiento (Archivo #2)** | Librería de patrones visuales sin HTML para Confluence: Matriz de los 5 Estados Invisibles sobre Figma, wireframes tácticos en bloques monoespaciados (`text`) y plantillas `mermaid` para Draw.io. |
| **`03_CHECKLIST_REDTEAM_BANCA_TIER1.md`** | **Base de Conocimiento (Archivo #3)** | Matriz de auditoría nivel Banca Tier 1 (idempotencia, pérdida de red, concurrencia multicanal, ventanas batch del Core, *Kill Switch*, auditoría legal, analítica anti-PII y diccionario `i18n`). |
| **`04_PROMPTS_GENERICOS_GRAFO_M365.md`** | **Prompt Book del PO (Uso diario)** | 8 prompts cortos, genéricos y universales para invocar al Agente sin tener que explicar el contexto cada vez (aprovechando tu Grafo M365). |

---

## 2. Arquitectura del Flujo: Grafo M365 -> Enrutador Modular -> Confluence

```text
  MICROSOFT GRAPH (Contexto vivo de tu cuenta)
  [Reuniones Teams] + [Chats] + [Correos] + [OneDrive / SharePoint / PPT]
                                    |
                                    v
  +-----------------------------------------------------------------------+
  | AGENTE M365 COPILOT: "PO Confluence Architect (Tier 1)"               |
  |  1. Prioriza cronológicamente (lo último en Teams/chat pisa al PPT).  |
  |  2. Separa Decisiones Firmes vs. Descartes vs. Dudas [PENDIENTE].     |
  |  3. Enrutador Dinámico: activa SOLO los módulos que aplican al caso:  |
  |     [Núcleo] + [A: UI/Figma] [B: Shell] [C: SCA] [D: IA] [E: API/Batch]|
  |  4. Consulta Conocimiento interno (Archivos 01, 02 y 03).             |
  +-----------------------------------------------------------------------+
                                    |
                                    v
  SALIDA CONFLUENCE SIN HTML (Markdown nativo copiable en 1 clic)
  [Tablas Semáforo] + [Estados UX sobre Figma] + [ASCII Táctico] + [Mermaid]
```

---

## 3. Guía de Configuración en M365 Copilot Agent Builder / Copilot Studio (5 Minutos)

1. **Crear Agente:** En Microsoft 365 Copilot $\rightarrow$ *Crear un agente* (o en Copilot Studio $\rightarrow$ *Declarative Agent*).
2. **Identidad:**
   - **Nombre:** `Confluence PO Architect (Tier 1)`
   - **Descripción:** *Transforma reuniones de Teams, chats, correos y documentos de M365 en especificaciones funcionales de Confluence nivel Banca Tier 1 sin HTML.*
3. **Instrucciones (`< 8.000` caracteres):**
   - Abre `00_INSTRUCCIONES_AGENTE_COPILOT_MAX8000.md`, copia íntegramente el bloque del Prompt de Sistema y pégalo en el cuadro **Instrucciones**.
4. **Conocimiento (Knowledge) y Capacidades:**
   - Sube a SharePoint/OneDrive (o directamente al apartado *Conocimiento* del Agente) los archivos `01_PLANTILLA_UNIVERSAL_MODULAR_CONFLUENCE.md`, `02_CATALOGO_ESTADOS_UX_Y_PATRONES_ASCII.md` y `03_CHECKLIST_REDTEAM_BANCA_TIER1.md`.
   - **Activa los conectores del Grafo M365:** Correos, Reuniones/Transcripciones de Teams, Chats de Teams y Archivos de OneDrive/SharePoint (y **desactiva** la búsqueda web pública si trabajas con iniciativas confidenciales internas).
5. **Starter Prompts (Prompts de inicio rápido):** Configura los 6 inicios sugeridos de la Sección 4.

---

## 4. Starter Prompts Recomendados para Configurar en la Pantalla Inicial del Agente

| Título del Botón en Copilot | Texto del Starter Prompt |
| :--- | :--- |
| **1. Auditar Grafo Pre-Refinement** | *"Busca en mi Grafo M365 (reuniones, chats, correos y archivos recientes) todo el contexto sobre [Proyecto]. No redactes el Confluence aún: extrae decisiones firmes, contradicciones cronológicas, descartes y dudas con responsable."* |
| **2. Redactar Confluence Completo** | *"Con el contexto de [Proyecto] en mi Grafo y tus archivos de conocimiento, detecta qué arquetipos aplican (UI/Figma, Shell, Transaccional/SCA, Chatbot o Backend/API) y redacta el Confluence completo sin HTML."* |
| **3. Actualizar por Nueva Reunión (Delta)** | *"Acaba de terminar una reunión/hilo sobre [Proyecto] (referencia: [Reunión/Fecha]). Compara lo nuevo contra la especificación actual y devuélveme únicamente el Delta de cambios a aplicar en Confluence."* |
| **4. Completar Estados UX sobre Figma** | *"Para la iniciativa [Proyecto], tengo el diseño base en Figma. Genera la Matriz de los 5 Estados Invisibles (vacío, carga, límites/truncado Web vs. App, errores sin pérdida de datos y permisos) más los literales exactos."* |
| **5. Auditoría Red Team (Riesgos & QA)** | *"Actúa como comité de Arquitectura, Riesgos/Fraude y QA Lead. Audita esta especificación de Confluence buscando fallos de red, concurrencia, batch, PII, WebView o lagunas de trazabilidad legal."* |
| **6. Anexos Analítica, Auditoría e i18n** | *"A partir de esta especificación de Confluence, genera los 3 anexos operativos: Plan de Analítica sin PII, Matriz de Auditoría/Logs y Diccionario de claves i18n con límite de caracteres para móvil."* |
