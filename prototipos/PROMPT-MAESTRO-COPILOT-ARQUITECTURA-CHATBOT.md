# Guía y Prompts Maestros para Generar el HTML Interactivo de Arquitectura del Chatbot en M365 Copilot o ChatGPT

Cuando le pides a **M365 Copilot** o a **ChatGPT** un HTML complejo de más de 700 líneas en un solo mensaje, suelen ocurrir dos problemas: **1)** simplifican el diseño visual, o **2)** cortan el código a la mitad por el límite de tokens de salida (`// ... continúa el resto de nodos`).

Para garantizar que obtengas **exactamente esta misma calidad visual y de movimiento** con las especificaciones reales de tu chatbot, aquí tienes las **2 formas de hacerlo** (la Opción A en 2 turnos desde cero y la Opción B inyectando tus especificaciones sobre la plantilla base sin romper ni un píxel).

---

## OPCIÓN A · Prompt Maestro en 2 Turnos (Para que Copilot M365 o ChatGPT construya el `.HTML` completo sin recortes)

> **Por qué en 2 turnos:** Al separar el **Turno 1 (Estructura HTML + CSS + Animaciones)** del **Turno 2 (Motor JavaScript + Tus Especificaciones + Cables SVG + Simulador)**, obligas a Copilot/ChatGPT a dedicar el 100% de su ventana de salida a cada bloque sin abreviar nada.

### PASO 1 · Copia y pega este Prompt en el Turno 1 (junto con tus especificaciones al final)

```markdown
Actúa como Principal Frontend Architect y Staff AI Engineer en Banca de Empresas.
Vamos a construir un documento interactivo en un único archivo `.html` (100% autocontenido, Zero-CDN bloqueantes, solo HTML5 + CSS3 + SVG + Vanilla JS) para presentar la arquitectura de nuestro Chatbot de Commercial en los canales Web y App.

IMPORTANTE — PROTOCOLO EN 2 ENTREGAS PARA EVITAR RECORTES DE CÓDIGO:
Como el archivo completo supera las 800 líneas, lo haremos en 2 entregas exactas que yo uniré:
- En esta ENTREGA 1 generarás desde `<!DOCTYPE html>` hasta justo antes de abrir `<script>`, con TODO el CSS, las animaciones `@keyframes` y el HTML completo de las 5 secciones adaptado a mis especificaciones.
- En la ENTREGA 2 (cuando yo te diga "Continúa con la Entrega 2") generarás el bloque `<script>...</script></body></html>` completo sin usar jamás comentarios tipo `// resto de nodos aquí`.

### 1. TOKENS DE DISEÑO Y ESTÉTICA OBLIGATORIA (MODO CENTRO DE MANDO OSCURO)
Usa estas variables CSS exactas y estética glassmorphism de alta precisión:
- `:root { --bg:#050814; --panel:rgba(11,17,34,.78); --line:rgba(148,163,184,.14); --text:#e8eefc; --muted:#8b97b5; --cyan:#22d3ee; --violet:#a78bfa; --emerald:#34d399; --amber:#fbbf24; --blue:#60a5fa; --rose:#fb7185; --ease:cubic-bezier(.16,1,.3,1); }`
- Fondo `body::before` con 3 `radial-gradient` atmosféricos (cian para Conocimiento/RAG, violeta para Protocolo A2A y Agentes Python, esmeralda para APIs Core) y `body::after` con rejilla técnica de `48px x 48px` con máscara radial.
- Tipografía: `Inter, 'Segoe UI Variable', system-ui, sans-serif` y `'JetBrains Mono', Consolas, monospace` para trazas, JSON y código Python.
- Incluye obligatoriamente estas animaciones `@keyframes`: `spin` (rotación continua de anillos y avatar), `ping` (pulso esmeralda en vivo), `breathe` (respiración del orbe central), `dash` (`stroke-dashoffset: -13` para cables SVG activos), `pop` (entrada suave de mensajes y tarjetas en el chat), `procP` (onda expansiva en el nodo que está procesando).

### 2. ESTRUCTURA EXACTA DE LAS 5 SECCIONES DEL HTML (ADAPTADAS A MIS ESPECIFICACIONES)
1. **Barra superior sticky (`nav.top`)**: Marca del asistente, enlaces de ancla a las 5 secciones y badge de versión.
2. **Hero Inmersivo (`header.hero`)**:
   - `<canvas id="heroCanvas">` de fondo con partículas neuronales conectadas.
   - Columna izquierda: título con texto en gradiente (`--cyan` -> `--violet` -> `--emerald`), resumen ejecutivo (RAG + Protocolo A2A + Agentes Python) y 4 KPIs con atributo `data-to` para conteo animado.
   - Columna derecha (`#orb`): Orbe central (`ORQUESTADOR`) con 2 anillos concéntricos girando en sentidos opuestos y 6 satélites flotantes (`.orb-sat`) para Canales, Base de Conocimiento, Protocolo A2A, Agentes Python, APIs y Guardrails.
3. **Sección 01 · Centro de Mando en Vivo (`#mando`)**:
   - **Barra de 4 Escenarios clicables (`.scen-bar`)**:
     - Escenario 1 (color `--cyan`): Consulta resuelta 100% por la Base de Conocimiento (RAG).
     - Escenario 2 (color `--violet`): Consulta operativa delegada por protocolo A2A a un Agente Python especialista.
     - Escenario 3 (color `--emerald`): Consulta híbrida en paralelo (RAG + Agente Python A2A).
     - Escenario 4 (color `--amber`): Coreografía Multi-Agente A2A + aprobación Human-in-the-Loop (HITL).
   - **Grid de 2 columnas (`.cc-grid`)**:
     - **Columna izquierda (`.device-col`)**: Selector de canal (`📱 App` / `💻 Web`) que transforma mediante clases CSS (`.device.app` vs `.device.web`) el chasis entre un smartphone con isla dinámica y un navegador web corporativo. Dentro lleva la ventana de chat (`#chatMsgs`), píldoras rápidas (`.chat-quick`) e input funcional (`#chatForm`).
     - **Columna derecha (`.map-side`)**:
       - **Mapa topológico interactivo (`#archMap`)** con `<svg id="wires"></svg>` superpuesto y **6 columnas (`.mcol`)**:
         - Col 1 (`1 · Canales`): Nodos `c_app` y `c_web`.
         - Col 2 (`2 · Acceso & Guardrails`): Nodos `gw` (API Gateway / OAuth2 OBO) y `guard` (Guardrails & PII).
         - Col 3 (`3 · Cerebro Central`): Nodo grande `orch` (Orquestador / Router) y `mem` (Memoria/Estado).
         - Col 4 (`4 · Conocimiento vs A2A`): Nodos `kb_vec` (Buscador RAG), `kb_docs` (Base de Conocimiento) y `a2a_hub` (Broker Protocolo A2A).
         - Col 5 (`5 · Agentes Python A2A`): Nodos para cada uno de los agentes operativos de mis especificaciones (`data-node="ag_..."`).
         - Col 6 (`6 · APIs & Sistemas Core`): Nodos para las APIs y sistemas backend a los que se conectan los agentes (`data-node="api_..."`).
       - **Barra transversal de Observabilidad (`data-node="obs"`)** y leyenda cromática.
       - **Consola de Telemetría en Vivo (`#traceBox`)** con contador de saltos (`#stHops`), latencia (`#stLat`) y modo (`#stMode`).
4. **Sección 02 · Arquitectura de Doble Vía (`#rutas`)**:
   - Dos pipelines horizontales interactivos de 5 pasos clicables cada uno (`.pipe[data-pipe="rag"]` y `.pipe[data-pipe="a2a"]`) con barra de progreso animada y caja de explicación inferior, más 3 tarjetas de criterio de enrutamiento (Cuándo usar Solo RAG, Cuándo usar Solo A2A, Cuándo usar Híbrido Paralelo).
5. **Sección 03 · El Protocolo A2A al Microscopio (`#a2a`)**:
   - 5 tarjetas de conceptos clave A2A (`Agent Card`, `Task & Context`, `Message & Parts`, `Streaming SSE`, `Artifacts`) y un **Diagrama de Secuencia interactivo de 8 flechas (`#seqBody`)** entre `App/Web`, `Orquestador`, `Agente Python` y `API Core` sincronizado con un visor JSON lateral (`#jsonView`) con pestañas (`Agent Card`, `Request A2A`, `Artifact A2A`).
6. **Sección 04 · Ingeniería de los Agentes en Python (`#agentes`)**:
   - Tarjetas interactivas con efecto spotlight para cada Agente Python (mostrando su stack: `FastAPI`, `LangChain / LangGraph`, `Pydantic`, `httpx`, y sus APIs conectadas) + un panel de código de referencia en 4 pestañas (`1. tools_api.py`, `2. agent_graph.py`, `3. a2a_server.py`, `4. orchestrator_router.py`).
7. **Sección 05 · Seguridad Bancaria en 5 Anillos (`#seguridad`) + Drawer Lateral (`#drawer`)**:
   - 5 anillos concéntricos interactivos (`#secRings`) sincronizados al pasar el ratón con la lista de 5 controles de seguridad (`#secList`), más el panel deslizante `#drawer` que se abre al hacer clic en cualquier nodo del mapa.

---

### 3. ESPECIFICACIONES REALES DE MI CHATBOT (ADAPTA TODOS LOS TEXTOS, AGENTES, ESCENARIOS Y APIS A ESTO):
[PEGA AQUÍ LAS ESPECIFICACIONES DE TU CHATBOT:
- Canales donde vive (Web, App, etc.):
- Qué contiene la Base de Conocimiento (RAG) y qué buscador/vector store usa:
- Cómo funciona el Orquestador / Router y el protocolo A2A:
- Lista de Agentes en Python (nombre de cada agente, qué hace y qué librerías usa: LangChain, LangGraph, FastAPI...):
- A qué APIs o sistemas internos se conecta cada agente:
- 3 o 4 ejemplos de preguntas reales de usuarios (informativas, operativas e híbridas):
- Reglas de autenticación/seguridad (tokens, permisos, escalado a gestor):]

---
Genera ahora únicamente la **ENTREGA 1** completa (desde `<!DOCTYPE html>` hasta justo antes de `<script>`), sin omitir ningún estilo ni nodo HTML.
```

---

### PASO 2 · Cuando Copilot / ChatGPT termine la Entrega 1, envíale este Prompt en el Turno 2

```markdown
Perfecto. Ahora genera la **ENTREGA 2**: el bloque `<script>...</script></body></html>` completo y 100% funcional para unirlo al HTML anterior.

REGLAS ESTRICTAS PARA EL JAVASCRIPT (PROHIBIDO ABREVIAR O USAR PLACEHOLDERS):
1. **Órbita del Hero + Canvas de Red Neuronal (`#heroCanvas`)**:
   - Posiciona dinámicamente los 6 `.orb-sat` alrededor de `#orb` con `requestAnimationFrame` y dibuja 45 partículas conectadas en `#heroCanvas`.
   - Añade `IntersectionObserver` para activar `.reveal.in` y animar los contadores `[data-to]`.
2. **Diccionario completo `NODE_SPECS` y Drawer Lateral (`openDrawer(nodeId)`)**:
   - Incluye la ficha completa de los 17 nodos del mapa (`c_app`, `c_web`, `gw`, `guard`, `orch`, `mem`, `kb_vec`, `kb_docs`, `a2a_hub`, todos los agentes `ag_*`, todas las APIs `api_*` y `obs`) con: `kind`, `c`, `cb`, `ic`, `title`, `sub`, `role`, `bullets` (3 puntos reales de mis especificaciones) y `code` (fragmento Python FastAPI/LangChain o JSON real).
   - Al hacer clic en cualquier `[data-node]`, abre `#drawer` con toda su información.
3. **Motor de Cables SVG Curvos (`drawWires()`) y Fotones Animados (`firePacket(from, to, col, duration)`)**:
   - Calcula con `getBoundingClientRect()` las coordenadas de cada par de nodos en `LINKS` y dibuja curvas Bézier cúbicas `<path class="wire" id="w-${from}-${to}">` dentro de `#wires`. Recalcula en `window.onresize` y al cambiar entre App y Web.
   - `firePacket(from, to, col)` debe encender la clase `.lit` en el cable SVG y mover un `<circle r="5" fill="#fff">` a lo largo de la curva usando `path.getTotalLength()` y `path.getPointAtLength(dist)` con `requestAnimationFrame`.
   - `showNodeTip(nodeId, text)` debe mostrar una burbuja flotante `.ntip` encima del nodo activo durante 1,6 segundos.
4. **Simulador de los 4 Escenarios (`SCENARIOS` y `runScenario(key, customQuestion)`)**:
   - Define los 4 escenarios completos (`rag`, `a2a_tesoreria`, `hibrido`, `multi_a2a`) adaptados a mis especificaciones.
   - Cada escenario debe tener: `mode`, `totalMs`, `q`, `typingText`, el array `hops` (con `t`, `n`, `to`, `tag`, `cls`, `msg`, `tip`, `col` y `payload` JSON desplegable) y `answerHtml` (con tarjeta UI `.xcard`, filas `.xrow` y chips de citas `.cite`).
   - `runScenario` debe: añadir la burbuja del usuario en `#chatMsgs`, mostrar el indicador `.typing`, ejecutar cada salto con `setTimeout`, iluminar nodos (`.lit`, `.proc`), lanzar `firePacket`, añadir la fila en `#traceBox` con botón `{ JSON }` desplegable, y al final pintar la respuesta del bot con su tarjeta interactiva.
   - Conecta también el formulario `#chatForm` para que cuando el usuario escriba una pregunta libre detecte por palabras clave qué ruta simular, y el toggle `#chanToggle` para alternar `.device.app` y `.device.web`.
5. **Interactividad de las Secciones 02, 03, 04 y 05**:
   - Sección 02: clic en `.pstep` de `[data-pipe="rag"]` y `[data-pipe="a2a"]` actualiza la barra `#pf-*`, el punto `#pd-*` y el texto `#pdText-*`.
   - Sección 03: clic en cada fila `.srow` de `#seqBody` o en `#playSeqBtn` anima las 8 flechas y muestra el JSON correspondiente en `#jsonView` (`Agent Card`, `tasks/sendSubscribe`, `TaskArtifactUpdateEvent`, etc.).
   - Sección 04: clic en `.tpl-step` cambia el código en `#tplCode` entre los 4 archivos Python (`tools_api.py`, `agent_graph.py`, `a2a_server.py`, `orchestrator_router.py`) adaptados a las librerías y APIs de mis especificaciones.
   - Sección 05: hover/clic en `#secRings .ring` y `#secList .sitem` sincroniza el anillo iluminado.

Escribe el bloque `<script>...</script></body></html>` íntegro de principio a fin.
```

---

## OPCIÓN B · Modo "Inyección Directa sobre el Prototipo" (El truco más rápido y 100% libre de fallos en M365 Copilot)

Como ya tienes el archivo [`prototipos/12-arquitectura-chatbot-commercial-preview.html`](file:///c:/2026/Apps_antigravity/Curso_IA_Commercial/prototipos/12-arquitectura-chatbot-commercial-preview.html) funcionando en tu equipo con todo el diseño visual, las animaciones a 60 FPS y los cables SVG ya calibrados, si en tu entorno de trabajo quieres adaptarlo en **menos de 1 minuto** sin que Copilot M365 tenga que regenerar el CSS ni el motor gráfico, pásale solo este prompt:

```markdown
Tengo un archivo HTML interactivo de arquitectura de nuestro Chatbot de Commercial donde toda la interfaz y las animaciones dependen únicamente de 4 objetos JavaScript:
1. `NODE_SPECS` (las fichas técnicas de los nodos del mapa: canales, gateway, guardrails, orquestador, buscador RAG, base de conocimiento, broker A2A, los 5 agentes Python `ag_pos`, `ag_risk`, `ag_comex`, `ag_sim`, `ag_crm` y las 4 APIs `api_core`, `api_risk`, `api_erp`, `api_crm`).
2. `SCENARIOS` (los 4 escenarios animados: `rag`, `a2a_tesoreria`, `hibrido`, `multi_a2a` con sus preguntas `q`, sus saltos `hops` con `payload` JSON y su respuesta `answerHtml`).
3. `SEQ_PAYLOADS` (los 8 pasos del diagrama de secuencia A2A con sus JSON de Agent Card, Request A2A y Artifact).
4. `TPL_FILES` (los 4 archivos Python de referencia: `tools_api.py`, `agent_graph.py`, `a2a_server.py`, `orchestrator_router.py`).

A partir de las siguientes ESPECIFICACIONES REALES DE NUESTRO CHATBOT, genera únicamente esos 4 bloques JavaScript (`const NODE_SPECS = ...`, `const SCENARIOS = ...`, `const SEQ_PAYLOADS = ...`, `const TPL_FILES = ...`) manteniendo exactamente las mismas claves e IDs de nodos para que yo solo tenga que sustituirlos en mi archivo `.html` y también dime qué títulos de botones HTML de las columnas 5 y 6 debo cambiar:

[PEGA AQUÍ LAS ESPECIFICACIONES DE TU CHATBOT]
```

---

## Plantilla rápida para rellenar las especificaciones de tu Chatbot (antes de pegárselas a Copilot o pasármelas a mí)

Si quieres, puedes usar este guion de 6 puntos para ordenar las especificaciones de tu chatbot:

```yaml
1. Nombre del Asistente y Canales:
   - App: (ej. App Empresas iOS/Android, autenticación, firma...)
   - Web: (ej. Portal Empresas / Banca Electrónica, widget lateral...)

2. Base de Conocimiento (Ruta Informativa / RAG):
   - Qué documentos incluye: (ej. manuales de producto, FAQs operativas, tarifas, normativa Comex...)
   - Qué tecnología usa: (ej. Azure AI Search / Databricks Vector Search / pgvector, embeddings, reranker...)

3. Orquestador Central y Protocolo A2A:
   - Cómo clasifica la intención: (ej. LangGraph / Semantic Router / LLM...)
   - Cómo descubre e invoca a los agentes: (ej. Agent Cards JSON, JSON-RPC / REST / SSE, gestión de sesión en Redis...)

4. Catálogo de Agentes en Python (Ruta Operativa A2A):
   - Agente 1: [Nombre] -> [Qué consulta/hace] -> [Librerías Python: LangChain, FastAPI, etc.] -> [API que consume]
   - Agente 2: [Nombre] -> [Qué consulta/hace] -> [Librerías Python] -> [API que consume]
   - Agente 3: [Nombre] -> [Qué consulta/hace] -> [Librerías Python] -> [API que consume]
   - Agente 4: [Nombre] -> [Qué consulta/hace] -> [Librerías Python] -> [API que consume]

5. Casos de Uso / Preguntas Estrella que quieres simular en vivo:
   - Caso 1 (Solo Base de Conocimiento): "..."
   - Caso 2 (Solo Agente A2A Operativo): "..."
   - Caso 3 (Híbrido Conocimiento + Agente A2A): "..."
   - Caso 4 (Multi-Agente o escalado a Gestor / Firma): "..."

6. Seguridad, Tokens y Observabilidad:
   - Cómo viaja la identidad del cliente hasta las APIs: (ej. OAuth2 OBO, JWT, Apigee/Kong...)
   - Trazabilidad y monitorización: (ej. OpenTelemetry, LangSmith, Application Insights...)
```
