#!/usr/bin/env node
/**
 * GUÍA DE ACTUALIZACIÓN — Comparador de Arquitecturas LLM
 * ========================================================
 * 
 * Este script documenta el proceso para actualizar los datos del
 * Comparador de Arquitecturas LLM (js/model-compare.js) con datos
 * frescos de Artificial Analysis (artificialanalysis.ai).
 * 
 * FUENTE DE DATOS:
 *   https://artificialanalysis.ai/leaderboards/models
 * 
 * FRECUENCIA RECOMENDADA:
 *   - Cada vez que un nuevo modelo frontera sea lanzado
 *   - Mínimo cada 2-3 meses
 *   - Tras cambios de versión del Intelligence Index
 * 
 * PASOS PARA ACTUALIZAR:
 * 
 *   1. Ir a https://artificialanalysis.ai/leaderboards/models
 *   2. Anotar los top 10-12 modelos del Intelligence Index
 *   3. Para cada modelo, recoger:
 *      - Intelligence Index score
 *      - Output Speed (tokens/s) — mediana
 *      - Latency TTFT (seg) — mediana
 *      - Pricing (input/output per 1M tokens)
 *      - Benchmark scores (GPQA, MATH, MMLU-Pro, SWE-bench)
 *   4. Editar el array `models` en js/model-compare.js
 *   5. Actualizar `DATA_LAST_UPDATED` y `AA_INDEX_VERSION`
 *   6. Si la escala del Index cambió, actualizar yMin/yMax en el scatter plot
 *   7. Actualizar el badge en recursos.html si cambia el # de modelos
 *   8. Ejecutar: node tests/smoke-tests.js
 * 
 * CUADERNOS DEL CURSO (para vincular conceptos):
 *   - Cuaderno 01: Pep Martorell (Definición IA, impacto, adopción)
 *   - Cuaderno 02: Javier Ideami (Prompting, creatividad, alineamiento)
 *   - Cuaderno 03: Compendio Técnico (Agentes, inferencia, optimización)
 *   - Cuaderno 04: El Universo del Transformer (Arquitecturas, MHA, MoE, RoPE)
 *   - Cuaderno 05: Paradigmas y Computación (Entrenamiento, SFT, evaluación)
 * 
 * O SIMPLEMENTE PIDE A ANTIGRAVITY:
 *   "Actualiza el comparador LLM con datos actuales de Artificial Analysis"
 */

const fs = require('fs');
const path = require('path');

const modelComparePath = path.join(__dirname, '..', 'js', 'model-compare.js');

if (!fs.existsSync(modelComparePath)) {
    console.error('❌ No se encontró js/model-compare.js');
    process.exit(1);
}

const content = fs.readFileSync(modelComparePath, 'utf-8');

const dateMatch = content.match(/DATA_LAST_UPDATED\s*=\s*'([^']+)'/);
const versionMatch = content.match(/AA_INDEX_VERSION\s*=\s*'([^']+)'/);
const modelCount = (content.match(/id:\s*'/g) || []).length;

console.log('');
console.log('📊 COMPARADOR DE ARQUITECTURAS LLM — Estado Actual');
console.log('==================================================');
console.log(`  📅 Última actualización:  ${dateMatch ? dateMatch[1] : 'No encontrada'}`);
console.log(`  📐 Versión del índice:    ${versionMatch ? versionMatch[1] : 'No encontrada'}`);
console.log(`  🤖 Modelos registrados:   ${modelCount}`);
console.log('');

if (dateMatch) {
    const lastUpdate = new Date(dateMatch[1]);
    const today = new Date();
    const daysSince = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));
    
    if (daysSince > 90) {
        console.log(`  ⚠️  ¡ATENCIÓN! Los datos tienen ${daysSince} días de antigüedad.`);
        console.log('     Se recomienda actualizar consultando:');
        console.log('     https://artificialanalysis.ai/leaderboards/models');
    } else if (daysSince > 30) {
        console.log(`  ℹ️  Los datos tienen ${daysSince} días. Considerar actualizar pronto.`);
    } else {
        console.log(`  ✅ Los datos están al día (${daysSince} días de antigüedad).`);
    }
}

console.log('');
console.log('  💡 Para actualizar, pide a Antigravity:');
console.log('     "actualiza el comparador LLM con datos de Artificial Analysis"');
console.log('');
