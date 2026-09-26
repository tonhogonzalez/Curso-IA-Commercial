const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Guía Operativa de Prompts: Migración de ChatGPT Projects a Microsoft Copilot M365. Ingeniería inversa de contexto, extracción de código Python y reglas de negocio, configuración de System Prompts deterministas en Copilot Studio / Agent Builder y validación mediante Shadow Testing A/B.">
  <meta name="keywords" content="Migración ChatGPT a Copilot, Microsoft 365 Copilot, ChatGPT Projects, Code Interpreter, Python en Excel, Copilot Studio, Agent Builder, System Prompt, Shadow Testing, Auditoría de Datos, Automatización Excel">
  <title>Cuaderno 07 — Guía Operativa de Prompts: Migración de ChatGPT Projects a Microsoft Copilot M365 | Curso IA Commercial</title>
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../css/styles.css">
  <style>
    .ocfe-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.6rem 0.75rem;
      font-size: 0.78rem;
      margin-top: 0.75rem;
    }
    .ocfe-item {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      line-height: 1.4;
    }
    .ocfe-tag {
      font-weight: 700;
      font-size: 0.68rem;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 4px;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }
    .ocfe-tag.goal { background: rgba(139, 92, 246, 0.18); color: var(--accent-violet); }
    .ocfe-tag.ctx  { background: rgba(59, 130, 246, 0.18); color: var(--accent-blue); }
    .ocfe-tag.src  { background: rgba(245, 158, 11, 0.18); color: var(--accent-amber); }
    .ocfe-tag.exp  { background: rgba(16, 185, 129, 0.18); color: var(--accent-emerald); }
    .ocfe-desc { color: var(--text-secondary); }

    .prompt-block-wrapper {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin: 1.5rem 0;
      box-shadow: var(--shadow-sm);
    }
    .prompt-block-wrapper.pro-version {
      border-color: rgba(16, 185, 129, 0.45);
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, var(--bg-surface) 100%);
    }
    .prompt-block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .prompt-block-title {
      margin: 0;
      font-size: 1.08rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .version-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .version-pill.original {
      background: rgba(59, 130, 246, 0.15);
      color: var(--accent-blue);
      border: 1px solid rgba(59, 130, 246, 0.35);
    }
    .version-pill.optimized {
      background: rgba(16, 185, 129, 0.16);
      color: var(--accent-emerald);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .copyable-prompt-pre {
      background: var(--bg-primary);
      border: 1px solid var(--border-medium);
      border-left: 4px solid var(--accent-violet);
      border-radius: var(--radius-md);
      padding: 1.15rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--text-primary);
      white-space: pre-wrap;
      line-height: 1.58;
      margin: 0.75rem 0;
      overflow-x: auto;
    }
    .pro-version .copyable-prompt-pre {
      border-left-color: var(--accent-emerald);
    }
    .tech-note-box {
      background: rgba(245, 158, 11, 0.07);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-left: 4px solid var(--accent-amber);
      border-radius: var(--radius-md);
      padding: 1.15rem 1.35rem;
      margin: 1.25rem 0;
      font-size: 0.9rem;
    }
    .tech-note-title {
      font-weight: 700;
      color: var(--accent-amber);
      margin-bottom: 0.4rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    .phase-banner {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      margin-bottom: 0.75rem;
    }
    .phase-1 { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16,185,129,0.3); }
    .phase-2 { background: rgba(139, 92, 246, 0.15); color: var(--accent-violet); border: 1px solid rgba(139,92,246,0.3); }
    .phase-3 { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); border: 1px solid rgba(59,130,246,0.3); }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <nav class="top-nav">
    <button class="menu-toggle" aria-label="Abrir menú">☰</button>
    <a href="../index.html" class="nav-brand">
      <div class="nav-brand-icon">IA</div>
      <div class="nav-brand-text"><span>Curso IA</span> Commercial</div>
    </a>
    <div class="nav-links">
      <a href="../index.html" class="nav-link">Cuadernos</a>
      <a href="../muro.html" class="nav-link">Lienzo</a>
      <a href="../recursos.html" class="nav-link">Recursos</a>
      <a href="../examen.html" class="nav-link">Examen Oficial</a>
    </div>
  </nav>

  <!-- Reading Progress -->
  <div class="progress-bar">
    <div class="progress-bar-fill"></div>
  </div>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-title">Estructura del Cuaderno</div>
      <a href="#intro" class="sidebar-link active">
        <span class="sidebar-link-number">00</span>
        Arquitectura de Migración & Notas M365
      </a>
      <a href="#fase-1" class="sidebar-link">
        <span class="sidebar-link-number">01</span>
        Fase 1: Extracción de Contexto (ChatGPT)
      </a>
      <a href="#fase-2" class="sidebar-link">
        <span class="sidebar-link-number">02</span>
        Fase 2: System Prompt en Copilot M365
      </a>
      <a href="#fase-3" class="sidebar-link">
        <span class="sidebar-link-number">03</span>
        Fase 3: Validación & Shadow Testing
      </a>
      <a href="#resumen-operativo" class="sidebar-link">
        <span class="sidebar-link-number">04</span>
        Checklist de Producción & Errores Comunes
      </a>
    </div>
  </aside>
  <div class="sidebar-overlay"></div>

  <!-- Main Content -->
  <main class="main-content">
    <div class="content-wrapper">

      <!-- Page Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a href="../index.html">Cuadernos</a>
          <span class="separator">/</span>
          <span>Cuaderno 07</span>
        </div>

        <div class="page-meta">
          <span class="meta-badge">CUADERNO 07</span>
          <span class="meta-badge blue">Microsoft 365 Copilot</span>
          <span class="meta-badge green">Migración & Shadow Testing</span>
          <span class="meta-info">Guía Operativa Copiable + Notas Técnicas M365</span>
        </div>

        <h1 class="page-title">Guía Operativa de Prompts: Migración de ChatGPT Projects a Microsoft Copilot M365</h1>
        <p class="page-subtitle">Esta guía contiene los prompts listos para copiar y usar en cada una de las fases de la migración de tu flujo de trabajo mensual de Excel, junto con versiones potenciadas de máxima efectividad y notas técnicas críticas de arquitectura Microsoft 365 Copilot.</p>

        <!-- Ficha de Objetivos Pedagógicos (Taxonomía de Bloom) -->
        <div class="bloom-card">
          <div class="bloom-header">
            <h3 class="bloom-title">🎯 Objetivos de Aprendizaje & Competencias Operativas</h3>
            <div class="bloom-meta-pills">
              <span class="bloom-pill time">⏱️ 25 min lectura · Ejecución directa</span>
              <span class="bloom-pill diff-advanced">Nivel: Operativo / Arquitecto de Flujos</span>
            </div>
          </div>
          <div class="bloom-grid">
            <div class="bloom-col">
              <div class="bloom-col-header understand">🧠 1. Auditar (Fase 1)</div>
              <ul>
                <li>Extraer la <strong>deuda técnica conversacional</strong> acumulada tras meses de correcciones en hilos de ChatGPT Projects.</li>
                <li>Auditar si la generación de Excel dependía de <strong>scripts de Python (Code Interpreter)</strong> o de manipulación textual.</li>
                <li>Destilar una Especificación Técnica completa con esquemas de entrada/salida y reglas negativas explícitas.</li>
              </ul>
            </div>
            <div class="bloom-col">
              <div class="bloom-col-header analyze">⚙️ 2. Configurar (Fase 2)</div>
              <ul>
                <li>Compilar las reglas de negocio en un <strong>System Prompt determinista</strong> para Copilot Studio o Agent Builder.</li>
                <li>Habilitar obligatoriamente <strong>Code Interpreter (Python)</strong> en el agente de M365 Copilot y gestionar el límite de 8.000 caracteres.</li>
                <li>Establecer un <strong>Checklist de Autocontrol</strong> de sumas, conteo de filas y errores <code>#¡REF!</code> / <code>NaN</code>.</li>
              </ul>
            </div>
            <div class="bloom-col">
              <div class="bloom-col-header apply">🔬 3. Validar (Fase 3)</div>
              <ul>
                <li>Ejecutar pruebas en paralelo (<strong>Shadow Testing</strong>) con datos cerrados del mes anterior ($t-1$).</li>
                <li>Realizar auditorías comparativas celda a celda entre el <strong>Archivo A (ChatGPT)</strong> y el <strong>Archivo B (Copilot)</strong>.</li>
                <li>Generar parches automáticos sobre el System Prompt a partir de las discrepancias detectadas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================
           SECCIÓN 00: ARQUITECTURA DE MIGRACIÓN Y NOTAS TÉCNICAS M365
           ======================================================== -->
      <section id="intro" class="transcript-section">
        <div class="section-header">
          <span class="section-number">00</span>
          <h2 class="section-title">Por qué fallan las migraciones directas y Arquitectura en M365 Copilot</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p class="editorial-lead">
            Cuando un flujo de trabajo mensual de Excel ha evolucionado dentro de un <strong>Project o hilo histórico de ChatGPT</strong>, el usuario rara vez tiene un único prompt limpio: lo que tiene es un historial de decenas de correcciones incrementales (<em>«no redondees esa columna», «excluye las filas con saldo cero», «cambia el formato de fecha»</em>) y bloques fragmentados de Python ejecutados en segundo plano.
          </p>
          <p>
            Si intentas migrar a <strong>Microsoft 365 Copilot</strong> copiando únicamente el último mensaje enviado en ChatGPT, el nuevo agente fallará porque carece de esa <strong>memoria episódica implícita</strong>. Para que la migración sea 100% determinista y auditable, aplicamos una ingeniería inversa en tres fases:
          </p>

          <div class="mermaid">
flowchart LR
    subgraph F1["Fase 1: En ChatGPT Project"]
      A["Prompt 1.1\nAuditoría de Código Python"] --> B["Prompt 1.2\nEspecificación Técnica + Reglas Negativas"]
    end
    subgraph F2["Fase 2: En M365 Copilot / Studio"]
      B --> C["System Prompt Determinista\n+ Code Interpreter Activo"]
    end
    subgraph F3["Fase 3: Shadow Testing A/B"]
      C --> D["Prompt 3.1\nEjecución Mes Anterior (t-1)"]
      D --> E["Prompt 3.2\nAuditoría Archivo A vs Archivo B"]
      E -. "Ajuste de Regla" .-> C
    end
          </div>

          <div class="tech-note-box">
            <div class="tech-note-title">⚠️ 3 Reglas Técnicas Críticas en Microsoft 365 Copilot antes de empezar</div>
            <ol style="margin: 0.5rem 0 0 1.2rem; color: var(--text-secondary); line-height: 1.65;">
              <li><strong>Activación obligatoria de <em>Code Interpreter</em> (Python):</strong> En <em>Copilot Studio</em> o <em>Agent Builder</em>, debes activar explícitamente la casilla <strong>Code Interpreter (Intérprete de código)</strong>. Sin ella, Copilot intentará procesar el Excel usando solo el modelo de lenguaje (LLM), lo que trunca tablas de más de ~50 filas, impide generar un archivo <code>.xlsx</code> descargable exacto y provoca errores de suma.</li>
              <li><strong>Límite de caracteres en <em>Instructions</em> (~8.000 caracteres):</strong> El cuadro de configuración de instrucciones de un Agente en M365 tiene un límite de longitud. Si en la Fase 1 descubres que tu proceso utiliza tablas de mapeo gigantescas (ej. cientos de cuentas contables o códigos de departamento) o un script Python muy largo, pon la lógica y las reglas en <strong>Instructions</strong> y sube el diccionario de mapeo o el script base como un archivo de referencia en <strong>Knowledge (Conocimiento)</strong>.</li>
              <li><strong>Subida de archivos en el Chat vs. Conocimiento indexado (RAG):</strong> Cuando ejecutes el procesamiento mensual o la comparativa de la Fase 3, <strong>adjunta los archivos Excel directamente en el mensaje del chat (icono del clip / adjuntar)</strong>. Nunca subas el Excel mensual bruto como fuente de conocimiento RAG de SharePoint para cálculos totales, porque el indexador semántico trocea (<em>chunking</em>) las hojas y pierde filas en los sumatorios.</li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ========================================================
           FASE 1: EXTRACCIÓN Y CONSOLIDACIÓN DE CONTEXTO (EN CHATGPT)
           ======================================================== -->
      <section id="fase-1" class="transcript-section">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2 class="section-title">Fase 1: Extracción y Consolidación de Contexto (En ChatGPT)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <span class="phase-banner phase-1">🔍 FASE 1 · EJECUTAR EN EL HILO HISTÓRICO DE CHATGPT</span>
          <p>
            Ejecuta estos prompts dentro del <strong>Project / Chat actual de ChatGPT</strong> donde tienes acumuladas todas las interacciones históricas. Para cada paso dispones de tu <strong>Versión Base Original</strong> y de la <strong>Versión Optimizada de Máxima Efectividad</strong> (diseñada para evitar que ChatGPT recorte código o resuma reglas).
          </p>

          <!-- PROMPT 1.1 -->
          <h3 style="color: var(--accent-violet); margin-top: 2rem;">Prompt 1.1: Comprobación de código subyacente (Python / Code Interpreter)</h3>
          <p>
            Usa este prompt primero para saber si el resultado depende de scripts de análisis de datos o de manipulación lingüística de tablas.
          </p>

          <!-- 1.1 Original -->
          <div class="prompt-block-wrapper">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">Prompt 1.1 — Comprobación de código subyacente</h4>
              <span class="version-pill original">📄 Versión Base Original (Íntegra)</span>
            </div>
            <pre class="copyable-prompt-pre" id="p1-1-orig">Actúa como un arquitecto de software y auditor de datos. Revisa todo nuestro historial en este hilo y responde a lo siguiente:

1. ¿Generaste el fichero Excel final ejecutando scripts de Python (mediante el entorno de ejecución de código) o simplemente mediante instrucciones de texto y fórmulas?
2. Si usaste Python, muéstrame el código fuente COMPLETO y definitivo del último script exitoso que generó el archivo descargable, incluyendo todas las librerías importadas, transformaciones de datos, mapeos y reglas condicionales.
3. Si no usaste Python, confirma qué método empleaste para producir el archivo.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--text-muted);">Ejecutar en: ChatGPT Project actual</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p1-1-orig').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 1.1 (Original) 📋', 2000);">Copiar Prompt 1.1 (Original) 📋</button>
            </div>
          </div>

          <!-- 1.1 Optimizado -->
          <div class="prompt-block-wrapper pro-version">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">⚡ Prompt 1.1 (Plus) — Reconstrucción Monolítica sin Truncamiento</h4>
              <span class="version-pill optimized">⚡ Versión Optimizada de Máxima Efectividad</span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0;">
              <strong>Por qué es más efectivo:</strong> En hilos largos, ChatGPT suele ejecutar el código en varias celdas separadas (una celda carga el Excel, otra corrige una columna tras tu feedback y la última solo exporta). Si pides solo «el último script», a veces te entrega únicamente las 5 líneas finales de exportación o abrevia diccionarios con <code># ... resto igual</code>. Esta versión le obliga a fusionar todas las celdas en un único script completo y ejecutable.
            </p>
            <pre class="copyable-prompt-pre" id="p1-1-pro">Actúa como un arquitecto de software senior y auditor de datos. Revisa exhaustivamente todo nuestro historial e interacciones en este hilo/proyecto y responde con total precisión a lo siguiente:

1. MÉTODO DE GENERACIÓN:
   ¿Generaste el fichero Excel final ejecutando scripts de Python (mediante Code Interpreter / Análisis de Datos) o mediante instrucciones de texto y fórmulas nativas de Excel?

2. RECONSTRUCCIÓN ÍNTEGRA DEL SCRIPT (SI USASTE PYTHON):
   Si ejecutaste código Python en varias celdas o iteraciones a lo largo de la conversación, CONSOLIDA y RECONSTRUYE en un ÚNICO script de Python monolítico, autocontenido y ejecutable de principio a fin toda la lógica que produjo la última versión válida del archivo descargable.
   - Incluye todas las librerías importadas (pandas, numpy, openpyxl, xlsxwriter, etc.).
   - Incluye todas las limpiezas, cruces, diccionarios de mapeo completos, constantes, reglas condicionales y el código de formateo visual/exportación a Excel.
   - PROHIBIDO usar comentarios abreviados como "# ... resto del código igual ..." o truncar listas/diccionarios. Necesito el código literal completo al 100%.

3. MÉTODO ALTERNATIVO (SI NO USASTE PYTHON):
   Si no usaste Python, detalla exactamente qué mecanismo, estructura de tablas y fórmulas de Excel empleaste para producir el archivo final.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-emerald);">✓ Evita scripts fragmentados o diccionarios truncados con "..."</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p1-1-pro').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 1.1 Optimizado 📋', 2000);">Copiar Prompt 1.1 Optimizado 📋</button>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 2.5rem 0;">

          <!-- PROMPT 1.2 -->
          <h3 style="color: var(--accent-violet); margin-top: 2rem;">Prompt 1.2: Extracción sistemática de la Especificación de Negocio</h3>
          <p>
            Este prompt fuerza al modelo a extraer las reglas explícitas e implícitas surgidas de tus correcciones.
          </p>

          <!-- 1.2 Original -->
          <div class="prompt-block-wrapper">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">Prompt 1.2 — Extracción sistemática de la Especificación de Negocio</h4>
              <span class="version-pill original">📄 Versión Base Original (Íntegra)</span>
            </div>
            <pre class="copyable-prompt-pre" id="p1-2-orig">Necesito documentar este proceso para auditarlo y migrarlo. Actúa como analista funcional senior y genera una "Especificación Técnica de Transformación de Datos" exhaustiva y estructurada basada estrictamente en todo lo aprendido a lo largo de nuestras conversaciones.

La especificación debe organizarse en los siguientes apartados:

1. ESQUEMA DE ENTRADA (INPUT):
   - Nombres de columnas esperadas, tipos de datos y descripción de contenido.
   - Tratamiento de registros vacíos, nulos, ceros o anomalías frecuentes.

2. REGLAS DE LIMPIEZA Y VALIDACIÓN:
   - Filtros previos (filas que se deben excluir o mantener).
   - Normalización de formatos (fechas, separadores decimales, mayúsculas/minúsculas).

3. REGLAS DE NEGOCIO Y CÁLCULO (Paso a paso cronológico):
   - Cada transformación, agrupación, cálculo o asignación condicional explicada de forma algorítmica ("Si [Columna A] = X, entonces [Columna B] = Y; en caso contrario...").
   - Fórmulas exactas aplicadas (especificando si son fórmulas de Excel o cálculos internos).

4. ESQUEMA DE SALIDA (OUTPUT):
   - Estructura exacta del Excel final: pestañas, nombres de columnas, orden de las columnas, tipos de datos y formato visual de las celdas (moneda, porcentaje, fechas, etc.).

5. REGLAS NEGATIVAS (QUÉ NO HACER):
   - Lista explícita de errores que cometiste en versiones anteriores y que te corregí durante el chat (por ejemplo: no redondear prematuramente, no eliminar ciertas filas, no cambiar los encabezados).</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--text-muted);">Ejecutar en: ChatGPT Project actual (tras el Prompt 1.1)</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p1-2-orig').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 1.2 (Original) 📋', 2000);">Copiar Prompt 1.2 (Original) 📋</button>
            </div>
          </div>

          <!-- 1.2 Optimizado -->
          <div class="prompt-block-wrapper pro-version">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">⚡ Prompt 1.2 (Plus) — Especificación Literal + Diccionarios + Autocompilación para Fase 2</h4>
              <span class="version-pill optimized">⚡ Versión Optimizada de Máxima Efectividad</span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0;">
              <strong>Por qué es más efectivo:</strong> Evita que ChatGPT resuma las reglas con frases vagas (<em>«se aplican los mapeos acordados»</em>) obligándole a escribir literalmente cada nombre de columna, cada umbral numérico y cada tabla de equivalencias. Además, incluye el punto 6 para extraer constantes/diccionarios fijos que hayas dictado en el chat.
            </p>
            <pre class="copyable-prompt-pre" id="p1-2-pro">Necesito documentar este proceso con precisión quirúrgica para auditarlo y migrarlo a otro motor de IA sin contexto previo. Actúa como analista funcional senior e ingeniero de datos, y genera una "Especificación Técnica de Transformación de Datos" exhaustiva y 100% literal basada estrictamente en todo lo aprendido y corregido a lo largo de nuestras conversaciones.

REGLA DE ORO: Prohibido resumir o generalizar. Escribe los nombres exactos de las columnas (respetando mayúsculas, tildes y espacios), los valores literales de filtrado y las fórmulas completas.

Organiza la especificación en los siguientes 6 apartados:

1. ESQUEMA DE ENTRADA (INPUT):
   - Nombre exacto de la(s) pestaña(s) de origen y fila donde empieza la cabecera.
   - Lista completa de columnas esperadas, tipo de dato de cada una y descripción.
   - Tratamiento exacto de registros vacíos (NaN/blancos), ceros, duplicados o anomalías frecuentes.

2. REGLAS DE LIMPIEZA Y VALIDACIÓN:
   - Filtros previos de exclusión o inclusión con sus condiciones exactas (ej. "Excluir filas donde [Estado] IN ('Anulado', 'Borrador')").
   - Normalización de formatos (fechas, separadores de miles/decimales, limpieza de espacios strip(), mayúsculas/minúsculas, conversión de tipos).

3. DICCIONARIOS DE MAPEO Y CONSTANTES FIJAS:
   - Lista íntegra de todas las tablas de equivalencia, mapeos de códigos, tipos de cambio, tasas o constantes fijas que hayamos definido durante nuestras conversaciones.

4. REGLAS DE NEGOCIO Y CÁLCULO (Paso a paso cronológico y algorítmico):
   - Cada transformación, cruce, agrupación (GROUP BY / Pivot), columna calculada o asignación condicional explicada de forma algorítmica determinista ("PASO N: Si [Columna A] == 'X' y [Columna B] > 0, entonces [Columna C] = ...; en caso contrario...").
   - Fórmulas exactas aplicadas, especificando claramente si en el Excel final deben quedar como valores estáticos calculados o como fórmulas dinámicas de Excel (ej. =SUMA(...), =BUSCARX(...)).

5. ESQUEMA DE SALIDA (OUTPUT):
   - Estructura exacta del archivo Excel final: número y nombre exacto de las pestañas.
   - Lista ordenada de todas las columnas de cada pestaña final, indicando su nombre exacto de cabecera, tipo de dato, orden de aparición, criterio de ordenación de filas (ORDER BY) y formato visual (moneda, número de decimales, porcentaje, fecha, filas de totales).

6. REGLAS NEGATIVAS (QUÉ NO HACER - HISTORIAL DE CORRECCIONES):
   - Lista explícita y exhaustiva de todos los errores, omisiones o malas interpretaciones que cometiste en versiones anteriores y que te corregí durante el chat (por ejemplo: no redondear antes del cálculo final, no eliminar filas con importe 0, no alterar el orden ni los nombres de las cabeceras originales).</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-emerald);">✓ Extrae nombres exactos de columnas, diccionarios completos y si el output lleva fórmulas o valores</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p1-2-pro').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 1.2 Optimizado 📋', 2000);">Copiar Prompt 1.2 Optimizado 📋</button>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           FASE 2: CONFIGURACIÓN DEL AGENTE EN COPILOT M365
           ======================================================== -->
      <section id="fase-2" class="transcript-section">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2 class="section-title">Fase 2: Configuración del Agente en Copilot M365 (System Prompt)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <span class="phase-banner phase-2">🤖 FASE 2 · CONFIGURAR EN COPILOT STUDIO / AGENT BUILDER</span>
          <p>
            Una vez obtenida la especificación en la Fase 1, crea un <strong>Copilot Agent</strong> en <em>Copilot Studio</em> o en el panel de <em>Agents (Crear agente)</em> de Microsoft 365 Copilot. Pega la plantilla adaptada en el campo <strong>Instructions</strong> (Instrucciones / Configuración del Agente).
          </p>

          <div class="tech-note-box">
            <div class="tech-note-title">🛠️ Nota Técnica M365: Cómo configurar el Agente para que no falle con archivos Excel</div>
            <ul style="margin: 0.5rem 0 0 1.2rem; color: var(--text-secondary); line-height: 1.6;">
              <li><strong>Activa «Code Interpreter» (Intérprete de código):</strong> En la pestaña <em>Configure (Configurar)</em> de tu agente en M365 Copilot o en las capacidades de <em>Copilot Studio</em>, activa el interruptor de <strong>Code Interpreter</strong>. Esto permite que Copilot ejecute un entorno aislado de Python con <code>pandas</code> y <code>openpyxl</code> para leer las miles de filas de tu Excel y generar un archivo <code>.xlsx</code> real descargable.</li>
              <li><strong>Controla el límite de 8.000 caracteres en <em>Instructions</em>:</strong> Si tu especificación de la Fase 1 cabe en menos de 8.000 caracteres, pégala directamente en la plantilla de abajo. Si tienes tablas de mapeo muy extensas o un script de Python de más de 150 líneas, guarda el script/diccionarios en un documento Word o texto en SharePoint/OneDrive, anclalo en <strong>Knowledge (Conocimiento)</strong> de tu agente e indícale en las <em>Instructions</em> que consulte dicho documento antes de ejecutar el código.</li>
            </ul>
          </div>

          <!-- PLANTILLA ORIGINAL -->
          <div class="prompt-block-wrapper">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">Plantilla de System Prompt para Copilot Agent</h4>
              <span class="version-pill original">📄 Versión Base Original (Íntegra)</span>
            </div>
            <pre class="copyable-prompt-pre" id="p2-orig"># ROL Y OBJETIVO
Eres un motor automatizado y determinista de procesamiento de datos mensuales para [Nombre del Proceso/Departamento]. Tu único cometido es transformar el archivo de datos sin procesar que te proporciona el usuario en un informe Excel final perfectamente estructurado, aplicando de forma estricta las reglas de negocio descritas a continuación.

# NORMAS DE COMPORTAMIENTO
- No inventes datos bajo ninguna circunstancia.
- Sigue el orden de operaciones de manera secuencial y exacta.
- Si detectas incoherencias o faltan columnas obligatorias en el archivo de entrada, detente e informa inmediatamente al usuario antes de proceder.

# REQUISITOS DEL FICHERO DE ENTRADA
El archivo mensual proporcionado por el usuario debe contener las siguientes columnas mínimas:
- [Columna 1]: [Tipo / Formato]
- [Columna 2]: [Tipo / Formato]
- [Columna 3]: [Tipo / Formato]

# ALGORITMO DE TRANSFORMACIÓN (PASO A PASO)
1. FASE DE LIMPIEZA:
   - [Detallar regla de filtrado o tratamiento de nulos extraída en la Fase 1]
2. FASE DE CÁLCULO:
   - [Detallar fórmula o lógica condicional 1]
   - [Detallar fórmula o lógica condicional 2]
3. FASE DE AGREGACIÓN:
   - [Detallar agrupaciones, tablas dinámicas o totales requeridos]

# ESTRUCTURA DEL ARCHIVO RESULTANTE (OUTPUT)
El resultado final debe ser entregado [en formato tabla descargable / estructura de Excel]:
- Nombre de la pestaña principal: [Nombre]
- Columnas finales y orden exacto: [Lista de columnas ordenadas]
- Formato de celdas:
  * Importes monetarios: [Formato, ej. 1.234,56 €]
  * Fechas: [Formato, ej. DD/MM/AAAA]

# RESTRICCIONES CRÍTICAS (QUÉ NO HACER)
- NUNCA [Regla negativa extraída en la fase 1, ej. alterar los nombres de las cabeceras originales].
- NO [Regla negativa, ej. redondear cifras antes de la agregación final].
- NO [Regla negativa, ej. omitir registros con saldo 0].

# CHECKLIST DE AUTOCONTROL (OBLIGATORIO ANTES DE ENTREGAR)
Antes de entregar el resultado al usuario, valida internamente los siguientes 3 puntos:
1. El número total de filas procesadas menos las excluidas coincide con el total entregado.
2. La suma de la columna [Total/Monto] en el output coincide con la suma del input.
3. No existen errores de referencia (#¡REF!, #N/A o NaN) en el conjunto resultante.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--text-muted);">Pegar en: Campo "Instructions" de Copilot Studio / Agent Builder</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p2-orig').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Plantilla Fase 2 (Original) 📋', 2000);">Copiar Plantilla Fase 2 (Original) 📋</button>
            </div>
          </div>

          <!-- PLANTILLA OPTIMIZADA -->
          <div class="prompt-block-wrapper pro-version">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">⚡ Plantilla de System Prompt (Plus) — Con Directiva de Ejecución Python en M365</h4>
              <span class="version-pill optimized">⚡ Versión Optimizada de Máxima Efectividad</span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0;">
              <strong>Por qué es más efectivo en M365 Copilot:</strong> En Microsoft 365 Copilot, si no le obligas explícitamente en el System Prompt a usar su entorno de ejecución de Python (<em>Code Interpreter</em>), a menudo intenta hacer la tabla «en texto» dentro del chat y trunca el archivo. Esta versión añade la directiva obligatoria de ejecución con <code>pandas</code>/<code>openpyxl</code> y le exige mostrar en el chat el cuadro de conciliación del Checklist de Autocontrol junto con el enlace de descarga del <code>.xlsx</code>.
            </p>
            <pre class="copyable-prompt-pre" id="p2-pro"># ROL Y OBJETIVO
Eres un motor automatizado y determinista de procesamiento de datos mensuales para [Nombre del Proceso/Departamento]. Tu único cometido es transformar el archivo Excel de datos sin procesar que te proporciona el usuario en un informe Excel (.xlsx) final perfectamente estructurado, aplicando de forma estricta las reglas de negocio descritas a continuación.

# DIRECTIVA DE EJECUCIÓN TÉCNICA OBLIGATORIA (PYTHON / CODE INTERPRETER)
- SIEMPRE debes utilizar tu entorno de ejecución de código Python (pandas / openpyxl / xlsxwriter) para leer el archivo completo, validar esquemas, aplicar filtros, ejecutar cálculos y generar el archivo ".xlsx" final descargable.
- PROHIBIDO realizar cálculos matemáticos, agrupaciones o filtrados "mentalmente" mediante texto o truncar el procesamiento a una muestra de filas. Procesa el 100% de los registros del archivo adjunto.
- No inventes ni extrapoles datos bajo ninguna circunstancia.
- Sigue el orden de operaciones de manera secuencial y exacta.
- Si detectas incoherencias o faltan columnas obligatorias en el archivo de entrada, detén la ejecución e informa inmediatamente al usuario listando qué columnas faltan antes de proceder.

# REQUISITOS DEL FICHERO DE ENTRADA (INPUT)
El archivo mensual proporcionado por el usuario debe contener las siguientes columnas mínimas exactas:
- [Columna 1]: [Tipo / Formato esperado]
- [Columna 2]: [Tipo / Formato esperado]
- [Columna 3]: [Tipo / Formato esperado]

# ALGORITMO DE TRANSFORMACIÓN (PASO A PASO EN PYTHON)
1. FASE DE LIMPIEZA Y NORMALIZACIÓN:
   - [Detallar regla de filtrado, limpieza de espacios o tratamiento de nulos extraída en la Fase 1]
2. DICCIONARIOS Y MAPEOS:
   - [Detallar mapeos o constantes extraídas en la Fase 1]
3. FASE DE CÁLCULO:
   - [Detallar fórmula o lógica condicional 1]
   - [Detallar fórmula o lógica condicional 2]
4. FASE DE AGREGACIÓN Y ORDENACIÓN:
   - [Detallar agrupaciones, tablas dinámicas, ordenación de filas o filas de totales requeridas]

# ESTRUCTURA DEL ARCHIVO RESULTANTE (OUTPUT EXCEL DESCARGABLE)
Genera y entrega un archivo Excel (.xlsx) descargable con la siguiente especificación exacta:
- Nombre del archivo de salida: [Ej. Informe_Procesado_Mes.xlsx]
- Nombre exacto de la pestaña principal: [Nombre]
- Columnas finales y orden exacto: [Lista de columnas ordenadas]
- Formato de celdas (vía openpyxl/xlsxwriter):
  * Importes monetarios: [Formato, ej. #.##0,00 €]
  * Porcentajes: [Formato, ej. 0,00%]
  * Fechas: [Formato, ej. DD/MM/AAAA]

# RESTRICCIONES CRÍTICAS (QUÉ NO HACER)
- NUNCA [Regla negativa extraída en la fase 1, ej. alterar los nombres de las cabeceras originales].
- NO [Regla negativa, ej. redondear cifras intermedias antes de la agregación final].
- NO [Regla negativa, ej. omitir registros con saldo 0].

# CHECKLIST DE AUTOCONTROL (OBLIGATORIO ANTES DE ENTREGAR)
Antes de entregar el enlace de descarga del archivo al usuario, ejecuta una verificación en Python y muestra en tu respuesta una tabla resumen con estos 3 puntos de control:
1. Cuadre de Filas: Total filas Input - Filas excluidas (indicando motivo) = Total filas Output.
2. Cuadre de Importes: Suma total de la columna [Total/Monto] en el Input (tras filtros válidos) vs. Suma total en el Output (Diferencia = 0,00).
3. Integridad de Celdas: Confirmación de que existen 0 valores nulos no permitidos y 0 errores de referencia (#¡REF!, #N/A, #¡DIV/0!, NaN o Inf) en el archivo generado.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-emerald);">✓ Fuerza el uso de Python/pandas en M365 y entrega tabla de cuadre + archivo .xlsx</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p2-pro').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Plantilla Fase 2 Optimizada 📋', 2000);">Copiar Plantilla Fase 2 Optimizada 📋</button>
            </div>
          </div>

          <!-- BONUS PROMPT PUENTE: AUTOCOMPILADOR -->
          <div class="prompt-block-wrapper pro-version" style="border-color: rgba(139, 92, 246, 0.5);">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">🪄 Prompt Puente (Opcional): Que ChatGPT rellene tu Plantilla de Fase 2 automáticamente</h4>
              <span class="version-pill optimized" style="background: rgba(139, 92, 246, 0.18); color: var(--accent-violet); border-color: rgba(139, 92, 246, 0.4);">⚡ Ahorro de Tiempo</span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0;">
              Después de ejecutar los Prompts 1.1 y 1.2 en ChatGPT, en lugar de rellenar los corchetes <code>[...]</code> a mano, puedes lanzar este tercer prompt en el mismo hilo de ChatGPT para que te devuelva la plantilla de la Fase 2 ya rellena al 100% y lista para pegar en Copilot M365:
            </p>
            <pre class="copyable-prompt-pre" id="p2-bridge" style="border-left-color: var(--accent-violet);">Ahora toma toda la Especificación Técnica y el código que acabas de extraer en los dos mensajes anteriores y rellena de forma completa, literal y sin dejar ningún corchete pendiente la siguiente plantilla de System Prompt para mi nuevo Agente en Microsoft 365 Copilot (asegúrate de que el resultado completo no supere los 7.500 caracteres pero conserve todas las reglas, fórmulas, nombres exactos de columnas y restricciones negativas):

[PEGA AQUÍ LA PLANTILLA DE SYSTEM PROMPT DE LA FASE 2]</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-violet);">💡 Ejecútalo en ChatGPT tras el Prompt 1.2 para obtener tus Instructions listas para copiar y pegar</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p2-bridge').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt Puente 📋', 2000);">Copiar Prompt Puente 📋</button>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           FASE 3: VALIDACIÓN Y PRUEBAS EN PARALELO (SHADOW TESTING)
           ======================================================== -->
      <section id="fase-3" class="transcript-section">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2 class="section-title">Fase 3: Validación y Pruebas en Paralelo (Shadow Testing)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <span class="phase-banner phase-3">⚖️ FASE 3 · EJECUTAR EN EL NUEVO AGENTE DE COPILOT M365</span>
          <p>
            Utiliza estos prompts en el nuevo agente de Copilot para validar que el resultado coincide exactamente con lo obtenido anteriormente en ChatGPT.
          </p>

          <!-- PROMPT 3.1 -->
          <h3 style="color: var(--accent-violet); margin-top: 2rem;">Prompt 3.1: Ejecución de prueba con datos del mes anterior</h3>

          <!-- 3.1 Original -->
          <div class="prompt-block-wrapper">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">Prompt 3.1 — Ejecución de prueba con datos del mes anterior</h4>
              <span class="version-pill original">📄 Versión Base Original (Íntegra)</span>
            </div>
            <pre class="copyable-prompt-pre" id="p3-1-orig">Adjunto el archivo de datos en bruto correspondiente a [Mes anterior]. Por favor, procesa la información aplicando todas tus instrucciones configuradas y entrégame el archivo de salida final según las directrices establecidas.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--text-muted);">Ejecutar en: Nuevo Agente de Copilot M365 adjuntando el Excel bruto del mes anterior</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p3-1-orig').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 3.1 (Original) 📋', 2000);">Copiar Prompt 3.1 (Original) 📋</button>
            </div>
          </div>

          <!-- 3.1 Optimizado -->
          <div class="prompt-block-wrapper pro-version">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">⚡ Prompt 3.1 (Plus) — Ejecución Determinista con Reporte de Cuadre en Pantalla</h4>
              <span class="version-pill optimized">⚡ Versión Optimizada de Máxima Efectividad</span>
            </div>
            <pre class="copyable-prompt-pre" id="p3-1-pro">Adjunto el archivo Excel de datos en bruto correspondiente a [Mes anterior].

Por favor, procesa el 100% de las filas ejecutando tu intérprete de código Python según todas tus instrucciones configuradas y:
1. Genera y entrégame el enlace de descarga del archivo Excel (.xlsx) final con todas las pestañas, columnas y formatos definidos.
2. Muestra aquí en el chat el resultado detallado de tu Checklist de Autocontrol (conteo de filas de entrada vs. excluidas vs. salida, cuadre de sumas de las columnas de importe y verificación de cero errores #¡REF!/NaN).</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-emerald);">✓ Asegura que Copilot invoque Python en el primer turno y muestre el cuadre contable</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p3-1-pro').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 3.1 Optimizado 📋', 2000);">Copiar Prompt 3.1 Optimizado 📋</button>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 2.5rem 0;">

          <!-- PROMPT 3.2 -->
          <h3 style="color: var(--accent-violet); margin-top: 2rem;">Prompt 3.2: Comparación y auditoría de discrepancias</h3>
          <p>
            Si notas diferencias entre el Excel que te daba ChatGPT y el que te entrega Copilot, sube ambos archivos a Copilot con este prompt:
          </p>

          <!-- 3.2 Original -->
          <div class="prompt-block-wrapper">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">Prompt 3.2 — Comparación y auditoría de discrepancias</h4>
              <span class="version-pill original">📄 Versión Base Original (Íntegra)</span>
            </div>
            <pre class="copyable-prompt-pre" id="p3-2-orig">Adjunto dos versiones del informe procesado correspondientes al mismo mes:
- Archivo A: Versión histórica validada (ChatGPT).
- Archivo B: Versión procesada por ti (Copilot).

Realiza una auditoría comparativa exhaustiva celda a celda o columna a columna y detalla:
1. Cualquier discrepancia numérica o de totales entre ambos archivos.
2. Filas que aparezcan en uno pero no en el otro.
3. Diferencias en la aplicación de fórmulas, redondeos o formatos de texto.
4. Identifica cuál de tus reglas actuales causó la discrepancia para que podamos ajustar tus instrucciones.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--text-muted);">Ejecutar en: Nuevo Agente de Copilot M365 adjuntando Archivo A y Archivo B</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p3-2-orig').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 3.2 (Original) 📋', 2000);">Copiar Prompt 3.2 (Original) 📋</button>
            </div>
          </div>

          <!-- 3.2 Optimizado -->
          <div class="prompt-block-wrapper pro-version">
            <div class="prompt-block-header">
              <h4 class="prompt-block-title">⚡ Prompt 3.2 (Plus) — Auditoría con Pandas + Autogeneración del Parche de Instructions</h4>
              <span class="version-pill optimized">⚡ Versión Optimizada de Máxima Efectividad</span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0;">
              <strong>Por qué es más efectivo:</strong> Obliga a Copilot a cargar ambos ficheros en memoria con <code>pandas</code> para hacer un <em>diff</em> matemático real sobre el 100% de las celdas, y añade un paso 5 que <strong>redacta automáticamente el fragmento corregido de tus Instructions</strong> para que solo tengas que copiarlo y pegarlo en la configuración del agente.
            </p>
            <pre class="copyable-prompt-pre" id="p3-2-pro">Adjunto dos versiones del informe Excel procesado correspondientes al mismo mes:
- Archivo A ([Nombre_Archivo_ChatGPT.xlsx]): Versión histórica validada (Ground Truth de ChatGPT).
- Archivo B ([Nombre_Archivo_Copilot.xlsx]): Versión recién procesada por ti (Copilot).

Utiliza obligatoriamente Python (pandas / openpyxl) para cargar íntegramente ambos archivos y realizar una auditoría comparativa determinista celda a celda y columna a columna. Detalla en tu informe:

1. DISCREPANCIAS NUMÉRICAS Y DE TOTALES:
   - Compara la suma total, media y conteo de todas las columnas numéricas entre el Archivo A y el Archivo B. Muestra una tabla con [Columna | Suma A | Suma B | Diferencia Exacta].
   - Identifica filas donde los importes difieran en más de 0,01 (distinguiendo entre errores de lógica y simples diferencias de redondeo de decimales).

2. DIFERENCIAS DE FILAS Y ESQUEMA:
   - Nombres u orden de columnas que no coincidan exactamente.
   - Filas o claves presentes en el Archivo A que falten en el Archivo B (y viceversa), mostrando hasta 10 ejemplos concretos para diagnosticar la causa del filtro.

3. DIFERENCIAS DE FÓRMULAS, TIPOS Y FORMATOS:
   - Diferencias en redondeos intermedios, formatos de fecha, mayúsculas/minúsculas, espacios en blanco o si una celda contiene fórmula frente a valor fijo.

4. DIAGNÓSTICO DE CAUSA RAÍZ:
   - Identifica exactamente cuál de tus reglas actuales de transformación causó cada discrepancia detectada.

5. PARCHE DE INSTRUCCIONES LISTO PARA COPIAR:
   - Redacta el bloque de texto corregido y exacto que debo copiar y pegar en tu configuración ("Instructions") para corregir estas discrepancias de forma definitiva en la siguiente ejecución.</pre>
            <div class="prompt-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="font-size:0.78rem; color:var(--accent-emerald);">✓ Compara el 100% del Excel vía Python y te redacta el parche exacto para tus Instructions</span>
              <button class="tool-btn" onclick="navigator.clipboard.writeText(document.getElementById('p3-2-pro').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 3.2 Optimizado 📋', 2000);">Copiar Prompt 3.2 Optimizado 📋</button>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           SECCIÓN 04: CHECKLIST DE PRODUCCIÓN Y RESOLUCIÓN DE PROBLEMAS
           ======================================================== -->
      <section id="resumen-operativo" class="transcript-section">
        <div class="section-header">
          <span class="section-number">04</span>
          <h2 class="section-title">Guía Rápida de Diagnóstico en M365 Copilot (Troubleshooting)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p>
            Si durante la Fase 2 o la Fase 3 observas alguno de los siguientes comportamientos en Microsoft 365 Copilot, aplica la solución técnica correspondiente:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin: 1.5rem 0;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-top: 3px solid var(--accent-amber); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="margin-top: 0; color: var(--text-primary); font-size: 1rem;">1. Copilot muestra una tabla en el chat pero no me da el archivo Excel descargable</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 0;">
                <strong>Causa:</strong> El agente no tiene activado <em>Code Interpreter</em> o no invocó el sandbox de Python.<br>
                <strong>Solución:</strong> Ve a <em>Editar Agente → Capacidades → Activar Code Interpreter</em> y usa el <strong>Prompt 3.1 Optimizado</strong> que pide explícitamente generar el fichero <code>.xlsx</code> mediante Python.
              </p>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-top: 3px solid var(--accent-blue); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="margin-top: 0; color: var(--text-primary); font-size: 1rem;">2. El Excel generado solo tiene las primeras 20 o 50 filas</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 0;">
                <strong>Causa:</strong> El modelo leyó el archivo como texto (RAG) en lugar de cargarlo con <code>pandas.read_excel()</code>.<br>
                <strong>Solución:</strong> Asegúrate de usar la <strong>Plantilla Optimizada de la Fase 2</strong>, que incluye la sección <code># DIRECTIVA DE EJECUCIÓN TÉCNICA OBLIGATORIA (PYTHON)</code> prohibiendo el procesamiento textual.
              </p>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-top: 3px solid var(--accent-emerald); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="margin-top: 0; color: var(--text-primary); font-size: 1rem;">3. No me caben todas las reglas en el cuadro "Instructions" de Copilot</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 0;">
                <strong>Causa:</strong> El campo <em>Instructions</em> admite hasta ~8.000 caracteres.<br>
                <strong>Solución:</strong> Deja el flujo algorítmico y el Checklist en <em>Instructions</em>, y guarda el código Python completo (obtenido en el Prompt 1.1) o los diccionarios de mapeo en un archivo Word/TXT dentro de la sección <strong>Knowledge (Conocimiento)</strong> del agente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Autoevaluación interactiva -->
      <div class="quiz-target"></div>

    </div><!-- /content-wrapper -->

    <!-- Footer -->
    <footer class="site-footer">
      <p class="footer-text">
        Curso IA Commercial — Cuaderno 07 · Guía Operativa de Prompts: Migración de ChatGPT Projects a Microsoft Copilot M365
      </p>
    </footer>
  </main>

  <!-- Back to Top -->
  <button class="back-to-top" aria-label="Volver arriba">↑</button>

  <script src="../js/main.js"></script>
  <script src="../js/search-data.js"></script>
  <script src="../js/search.js"></script>
  <script src="../js/highlighter.js"></script>
  
  <!-- Custom Scripts -->
  <script src="../js/diagrams.js"></script>
  <script src="../js/edit-mode.js"></script>
  <script src="../js/playground.js"></script>
  <script src="../js/glossary.js"></script>
  <script src="../js/ai-tutor.js"></script>
  <script src="../js/text-zoom.js"></script>
  <script src="../js/simulations.js"></script>
  <script src="../js/quiz.js"></script>
  <script src="../js/annotations.js"></script>
  <script src="../js/achievements.js"></script>
</body>
</html>
`;

const outputPath = path.join(__dirname, '..', 'cuadernos', '07-migracion-chatgpt-copilot-m365.html');
fs.writeFileSync(outputPath, html, 'utf-8');
console.log('✅ Cuaderno 07 generado exitosamente en:', outputPath);
