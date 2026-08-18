# Curso IA Commercial — Cuadernos de Inteligencia Artificial

<div align="center">

![Version](https://img.shields.io/badge/Versi%C3%B3n-2026%20Edition-8b5cf6?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Vanilla%20HTML%2FCSS%2FJS-3b82f6?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

**Plataforma de divulgación y profundización técnica sobre Inteligencia Artificial construida a partir de transcripciones íntegras con líderes de la industria, investigadores y expertos.**

[🚀 Ver Despliegue en Vivo](#despliegue-y-acceso) • [📚 Cuadernos](#-cuadernos-disponibles) • [🧠 Simuladores](#-simuladores-y-herramientas) • [🗺️ Lienzo](#%EF%B8%8F-lienzo-de-conocimiento)

</div>

---

## 🌟 Características Principales

* 📖 **Cuadernos Íntegros**: Conversaciones completas sin cortes ni resúmenes superficiales, enriquecidas con esquemas conceptuales y glosario interactivo.
* 🌓 **Doble Tema (Claro / Oscuro)**: Selector de tema con paleta clara de revista científica y tema oscuro OLED con persistencia local.
* 🧘 **Modo Enfoque (Zen Reader)**: Lectura inmersiva a pantalla limpia activable con la tecla <kbd>Z</kbd>.
* 🔬 **Laboratorio de Simuladores Interactivos**:
  * **Visualizador de Self-Attention**: Proyección interactiva de pesos de atención ($Q \cdot K^T / \sqrt{d_k}$) con mapas de calor en tiempo real.
  * **Calculadora de VRAM & KV Cache**: Estimación exacta de memoria GPU requerida para modelos de 3.8B a 405B en FP16/INT8/INT4.
  * **Espacio Semántico de Embeddings 2D**: Plano vectorial interactivo con cálculo de similitud coseno $\cos(\theta)$ y aritmética $(\text{Rey} - \text{Hombre} + \text{Mujer} \to \text{Reina})$.
  * **Tokenizador Interactivo BPE**: Visualización de segmentación en subwords con coloreado, conteo y cálculo de costes de API.
  * **Simulador de Muestreo (Sampling)**: Gráfica en vivo de alteraciones de probabilidad por Temperatura ($T$), Top-K y Top-P (Nucleus Sampling).
* 💻 **Playground Python Multirreceta**: Entorno de ejecución WebAssembly (Pyodide) con recetas listas para probar (Softmax, RAG vectorial, KV Cache, BPE y Muestreo).
* 📝 **Matriz de Prompt Engineering**: Plantillas copiables de producción (Metaprompting de Javier Ideami, Chain-of-Thought, ReAct y JSON Schema).
* 📖 **Glosario Técnico Filtrable**: Buscador en tiempo real con filtros categóricos y enlaces cruzados a los cuadernos formativos.
* 📚 **Compendio de Papers & Ecosistema 2026**: Fichas directas a ArXiv con conclusiones clave y directorio de herramientas clasificadas (Inferencia local, Vector DBs, Agentes, Observabilidad).
* 📝 **Autoevaluación Pedagógica**: Quizzes interactivos al final de cada cuaderno con retroalimentación técnica inmediata y persistencia en `localStorage`.
* 🗺️ **Lienzo de Conocimiento**: Tablero espacial con notas adhesivas, conexiones dinámicas (flechas SVG) y exportación a **Obsidian Canvas (`.canvas`)**, **Markdown** y **PowerPoint (.pptx)**.
* ⚡ **Zero-Lag & Offline**: Motor de búsqueda con Web Worker, carga diferida (*lazy loading*) de WebAssembly/Pyodide y Service Worker para uso sin conexión.

---

## 📚 Cuadernos Disponibles

| Cuaderno | Título | Invitado / Formato | Temas Clave |
| :--- | :--- | :--- | :--- |
| **01** | **La Naturaleza de la IA y su Impacto en el Sistema Productivo** | Pep Martorell (*Arpa Talks*) | *Transformers, Polisemia, Superinterpolador estadístico, Supercomputación.* |
| **02** | **Pensamiento Crítico, Prompting y el Horizonte 2030** | Javier Ideami (*Tengo un Plan*) | *Correlación vs Causalidad, 7 Mandamientos de Dartmouth, Metaprompting, AGI.* |
| **03** | **Compendio Técnico de IA Generativa** | Compendio Especializado | *Matemáticas, Backprop, Optimización AdamW, KV Cache, RAG, Agentes Autónomos.* |
| **04** | **El Universo del Transformer y Operatividad de LLMs** | Compendio Docente Avanzado | *Attention Is All You Need, Softmax Saturation, MHA, RoPE/ALiBi, GPT Lifecycle, Grounding, PyTorch.* |

---

## 🧠 Simuladores y Herramientas

* **Laboratorio de Simulaciones (5 visualizadores)**: `js/simulations.js`
* **Python Interactive Playground (Pyodide)**: `js/playground.js`
* **Glosario Dinámico Filtrable**: `recursos.html` & `js/glossary.js`
* **Matriz de Prompt Engineering**: `recursos.html`
* **Mermaid Interactive Diagrams**: `js/diagrams.js`
* **Interactive Quizzes**: `js/quiz.js`

---

## 📁 Estructura del Proyecto

```
Curso_IA_Commercial/
├── css/
│   └── styles.css              # Sistema de diseño con temas Claro y Oscuro
├── cuadernos/
│   ├── 01-pep-martorell.html   # Cuaderno 01: Pep Martorell
│   ├── 02-javier-ideami.html   # Cuaderno 02: Javier Ideami
│   ├── 03-compendio-tecnico.html # Cuaderno 03: Compendio Técnico
│   └── _template.html          # Plantilla para nuevos cuadernos
├── js/
│   ├── main.js                 # Control de tema, modo Zen, progreso de lectura
│   ├── simulations.js          # Simuladores de Self-Attention y VRAM/KV Cache
│   ├── quiz.js                 # Motor de autoevaluación interactivo
│   ├── muro.js                 # Lienzo espacial y exportador Obsidian Canvas
│   ├── search.js               # Buscador global con atajo Ctrl+K
│   ├── search-worker.js        # Web Worker para búsqueda instantánea
│   ├── glossary.js             # Detección y tooltips automáticos de términos
│   └── playground.js           # Entorno interactivo de Python (Pyodide)
├── scripts/
│   └── build.js                # Indexador automático de cuadernos y búsqueda
├── index.html                  # Portal principal y catálogo de cuadernos
├── muro.html                   # Lienzo de conocimiento interactivo
├── recursos.html               # Laboratorio de simuladores, glosario y playground
├── manifest.json               # Configuración de Progressive Web App (PWA)
└── sw.js                       # Service Worker para caché offline
```

---

## 🚀 Despliegue y Acceso

El proyecto está diseñado para desplegarse automáticamente en **GitHub Pages**.

Para compilar o regenerar el índice tras añadir nuevos cuadernos:
```bash
node scripts/build.js
```
