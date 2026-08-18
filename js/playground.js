/**
 * Python Playground (Pyodide WebAssembly Engine)
 * Entorno de ejecución interactivo con recetas pedagógicas avanzadas de IA.
 */

(function() {
  'use strict';

  let pyodideInstance = null;
  let pyodideLoading = false;

  const PLAYGROUND_RECIPES = [
    {
      id: "attention",
      title: "1. Softmax & Self-Attention Matrix",
      desc: "Cálculo de atención Q·K^T escalada y normalización softmax paso a paso.",
      code: `# Simulación de Softmax y Mecanismo de Atención
import math

def softmax(scores):
    exp_scores = [math.exp(s) for s in scores]
    total = sum(exp_scores)
    return [round(s / total, 3) for s in exp_scores]

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

# Vectores sintéticos para 3 tokens: [Pep, explica, Transformers]
tokens = ["Pep", "explica", "Transformers"]
d_k = 4 # Dimensión de clave/query

queries = [
    [1.0, 0.2, -0.5, 0.8],
    [0.1, 1.4, 0.9, -0.2],
    [0.8, -0.1, 1.5, 1.2]
]

keys = [
    [0.9, 0.1, -0.4, 0.7],
    [0.2, 1.3, 0.8, -0.1],
    [0.7, -0.2, 1.4, 1.1]
]

print("--- MATRIZ DE ATENCIÓN ESCALADA (Q · K^T / √d_k) ---")
for i, q in enumerate(queries):
    raw_scores = []
    for j, k in enumerate(keys):
        score = dot_product(q, k) / math.sqrt(d_k)
        raw_scores.append(score)
    
    weights = softmax(raw_scores)
    print(f"Token '{tokens[i]:12}': {weights} -> {[tokens[idx] for idx in range(3)]}")
`
    },
    {
      id: "rag",
      title: "2. Pipeline RAG Vectorial (Similitud Coseno)",
      desc: "Indexación de fragmentos en memoria y recuperación semántica del más relevante.",
      code: `# Mini Base de Datos Vectorial RAG desde Cero
import math

# Base de conocimiento (Documentos)
knowledge_base = [
    {"id": 1, "text": "Los Transformers usan autoatención para procesar texto en paralelo.", "vector": [0.85, 0.20, 0.10]},
    {"id": 2, "text": "Pep Martorell dirige el BSC con el supercomputador MareNostrum 5.", "vector": [0.15, 0.90, 0.25]},
    {"id": 3, "text": "Javier Ideami analiza los siete mandamientos de Dartmouth y causalidad.", "vector": [0.10, 0.30, 0.88]},
    {"id": 4, "text": "El optimizador AdamW desacopla el weight decay mejorando la generalización.", "vector": [0.70, 0.15, 0.40]}
]

def cosine_similarity(u, v):
    dot = sum(a * b for a, b in zip(u, v))
    norm_u = math.sqrt(sum(a * a for a in u))
    norm_v = math.sqrt(sum(b * b for b in v))
    return dot / (norm_u * norm_v)

# Consulta del usuario: "¿Qué dijo Pep Martorell sobre supercomputación?"
query_vector = [0.18, 0.88, 0.20]

print("--- RECUPERACIÓN SEMÁNTICA RAG ---")
results = []
for doc in knowledge_base:
    sim = cosine_similarity(query_vector, doc["vector"])
    results.append((sim, doc))

results.sort(key=lambda x: x[0], reverse=True)

for rank, (sim, doc) in enumerate(results, 1):
    print(f"Top {rank} [Score: {sim:.4f}] Doc #{doc['id']}: {doc['text']}")
`
    },
    {
      id: "kvcache",
      title: "3. Calculadora de Memoria KV Cache",
      desc: "Estimación matemática exacta de memoria VRAM requerida para KV Cache en FP16.",
      code: `# Cálculo de Requisitos de Memoria para KV Cache en LLMs
def compute_kv_cache_gb(n_layers, n_kv_heads, head_dim, seq_len, batch_size, bytes_per_element=2):
    """
    bytes_per_token = 2 (K y V) * n_layers * n_kv_heads * head_dim * bytes_per_element
    """
    bytes_per_token = 2 * n_layers * n_kv_heads * head_dim * bytes_per_element
    total_bytes = bytes_per_token * seq_len * batch_size
    return total_bytes / (1024 ** 3)

# Modelos representativos
models = [
    {"name": "Llama-3.1-8B (GQA)", "layers": 32, "kv_heads": 8, "head_dim": 128},
    {"name": "Llama-3.1-70B (GQA)", "layers": 80, "kv_heads": 8, "head_dim": 128},
    {"name": "Llama-3.1-405B (GQA)", "layers": 126, "kv_heads": 8, "head_dim": 128}
]

context_lengths = [4096, 32768, 131072]
batch_size = 4

print(f"--- VRAM PARA KV CACHE (FP16, Batch Size = {batch_size}) ---")
for m in models:
    print(f"\\nModelo: {m['name']}")
    for ctx in context_lengths:
        vram_gb = compute_kv_cache_gb(m['layers'], m['kv_heads'], m['head_dim'], ctx, batch_size)
        print(f"  Contexto: {ctx:6} tokens ({ctx//1024:3}k) -> {vram_gb:6.2f} GB VRAM")
`
    },
    {
      id: "bpe",
      title: "4. Algoritmo BPE (Byte Pair Encoding)",
      desc: "Simulación de fusión iterativa de pares de caracteres más frecuentes.",
      code: `# Algoritmo didáctico de Byte Pair Encoding (BPE)
from collections import Counter

corpus = ["l o w </w>", "l o w e s t </w>", "n e w e r </w>", "w i d e r </w>"]
freqs = {"l o w </w>": 5, "l o w e s t </w>": 2, "n e w e r </w>": 6, "w i d e r </w>": 3}

def get_stats(vocab):
    pairs = Counter()
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols) - 1):
            pairs[symbols[i], symbols[i+1]] += freq
    return pairs

def merge_vocab(pair, v_in):
    v_out = {}
    bigram = ' '.join(pair)
    replacement = ''.join(pair)
    for word in v_in:
        w_out = word.replace(bigram, replacement)
        v_out[w_out] = v_in[word]
    return v_out

print("--- ENTRENAMIENTO DE TOKENIZADOR BPE (3 Fusiones) ---")
vocab = freqs
for step in range(1, 4):
    pairs = get_stats(vocab)
    if not pairs:
        break
    best = max(pairs, key=pairs.get)
    vocab = merge_vocab(best, vocab)
    print(f"Paso {step}: Fusión de '{best[0]}' + '{best[1]}' (Frecuencia: {pairs[best]})")
    print(f"  Vocabulario actual: {list(vocab.keys())}")
`
    },
    {
      id: "sampling",
      title: "5. Muestreo con Temperatura y Top-P",
      desc: "Implementación en Python puro de escalado de logits, temperatura y corte de núcleo.",
      code: `# Muestreo con Temperatura y Top-P (Nucleus Sampling)
import math
import random

candidate_logits = {
    "AdamW": 4.2,
    "Adam": 3.1,
    "SGD": 2.3,
    "RMSprop": 1.8,
    "Adagrad": 0.9,
    "Lion": 0.5,
    "computador": -0.8,
    "azul": -2.5
}

def sample_next_token(logits, temperature=0.7, top_p=0.9):
    # 1. Escalar por Temperatura
    scaled = {k: math.exp(v / temperature) for k, v in logits.items()}
    total = sum(scaled.values())
    probs = {k: v / total for k, v in scaled.items()}
    
    # 2. Ordenar de mayor a menor probabilidad
    sorted_probs = sorted(probs.items(), key=lambda x: x[1], reverse=True)
    
    # 3. Filtrar por Top-P (acumulativo)
    cumulative = 0.0
    filtered = []
    for token, p in sorted_probs:
        cumulative += p
        filtered.append((token, p))
        if cumulative >= top_p:
            break
            
    # 4. Renormalizar probabilidades
    active_sum = sum(p for _, p in filtered)
    renorm = [(token, p / active_sum) for token, p in filtered]
    
    return sorted_probs, renorm

print("--- COMPARATIVA DE MUESTREO (T=0.3 vs T=1.2) ---")
for temp in [0.3, 1.2]:
    all_p, active_p = sample_next_token(candidate_logits, temperature=temp, top_p=0.85)
    print(f"\\nTemperatura = {temp}:")
    for tok, p in active_p:
        bar = "█" * int(p * 25)
        print(f"  {tok:12} {p*100:5.1f}% | {bar}")
`
    }
  ];

  function injectPyodideScript() {
    return new Promise((resolve, reject) => {
      if (typeof loadPyodide !== 'undefined') return resolve();
      const existingScript = document.querySelector('script[src*="pyodide.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  async function loadPyodideEngine() {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoading) {
      while(pyodideLoading) {
        await new Promise(r => setTimeout(r, 100));
      }
      return pyodideInstance;
    }

    pyodideLoading = true;
    try {
      await injectPyodideScript();
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
      });
      return pyodideInstance;
    } finally {
      pyodideLoading = false;
    }
  }

  function initPlaygrounds() {
    const playgrounds = document.querySelectorAll('pre.python-playground');
    if (playgrounds.length === 0) return;
    
    playgrounds.forEach((pre, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'playground-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      
      let currentRecipeIdx = 0;

      // Header with Recipe selector & Action buttons
      const header = document.createElement('div');
      header.className = 'playground-header';
      header.innerHTML = `
        <div class="playground-recipe-selector-wrap">
          <label for="recipe-select-${index}" class="playground-recipe-label">Receta:</label>
          <select id="recipe-select-${index}" class="calc-select playground-select">
            ${PLAYGROUND_RECIPES.map((r, i) => `<option value="${i}">${r.title}</option>`).join('')}
          </select>
        </div>
        <div class="playground-actions">
          <button class="tool-btn playground-copy-btn" id="copy-btn-${index}" title="Copiar código al portapapeles">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copiar</span>
          </button>
          <button class="tool-btn playground-reset-btn" id="reset-btn-${index}" title="Restablecer código original">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            <span>Restablecer</span>
          </button>
          <button class="playground-run-btn" id="run-btn-${index}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Ejecutar</span>
          </button>
        </div>
      `;

      const outputContainer = document.createElement('div');
      outputContainer.className = 'playground-output-container hidden';
      outputContainer.innerHTML = `
        <div class="playground-output-header">
          <span>Consola de Salida WebAssembly:</span>
          <button class="tool-btn" id="clear-out-${index}" style="padding: 2px 8px; font-size: 0.75rem;">Limpiar</button>
        </div>
        <pre class="playground-output" id="output-${index}"></pre>
      `;

      wrapper.appendChild(header);
      wrapper.appendChild(pre);
      wrapper.appendChild(outputContainer);

      const codeElement = pre.querySelector('code') || pre;
      codeElement.contentEditable = "true";
      codeElement.spellcheck = false;
      codeElement.classList.add('editable-code');

      // Initialize with first recipe
      codeElement.innerText = PLAYGROUND_RECIPES[0].code;

      const recipeSelect = header.querySelector(`#recipe-select-${index}`);
      const copyBtn = header.querySelector(`#copy-btn-${index}`);
      const resetBtn = header.querySelector(`#reset-btn-${index}`);
      const runBtn = header.querySelector(`#run-btn-${index}`);
      const clearBtn = outputContainer.querySelector(`#clear-out-${index}`);
      const outputPre = outputContainer.querySelector(`#output-${index}`);

      recipeSelect.addEventListener('change', () => {
        currentRecipeIdx = parseInt(recipeSelect.value);
        codeElement.innerText = PLAYGROUND_RECIPES[currentRecipeIdx].code;
      });

      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeElement.innerText);
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>¡Copiado!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copiar</span>`;
        }, 1800);
      });

      resetBtn.addEventListener('click', () => {
        codeElement.innerText = PLAYGROUND_RECIPES[currentRecipeIdx].code;
      });

      clearBtn.addEventListener('click', () => {
        outputPre.innerText = "";
        outputContainer.classList.add('hidden');
      });

      runBtn.addEventListener('click', async () => {
        runBtn.innerHTML = '<span>Cargando...</span>';
        runBtn.disabled = true;
        outputContainer.classList.remove('hidden');
        outputPre.innerText = "Inicializando runtime Pyodide (WebAssembly)...";

        try {
          const py = await loadPyodideEngine();
          runBtn.innerHTML = '<span>Ejecutando...</span>';
          outputPre.innerText = "";

          py.setStdout({ batched: (msg) => {
            outputPre.innerText += msg + "\n";
          }});
          py.setStderr({ batched: (msg) => {
            outputPre.innerText += "Error: " + msg + "\n";
          }});

          const pythonCode = codeElement.innerText;
          await py.runPythonAsync(pythonCode);
          
          if (outputPre.innerText.trim() === "") {
             outputPre.innerText = "[Ejecución completada exitosamente sin salidas por consola]";
          }
        } catch (error) {
          outputPre.innerText = error.toString();
        } finally {
          runBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>Ejecutar</span>`;
          runBtn.disabled = false;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlaygrounds);
  } else {
    initPlaygrounds();
  }
})();
