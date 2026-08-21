/**
 * CURSO IA COMMERCIAL - Smoke Tests
 * Verifica que todas las páginas HTML cargan correctamente y que los módulos JS
 * no lanzan errores de inicialización.
 * 
 * Ejecutar con: node tests/smoke-tests.js
 * 
 * Usa Node.js FS para verificar estructura y parseo básico de HTML.
 * Para tests en navegador real, se recomienda Playwright o Puppeteer.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    errors.push(message);
    console.log(`  ❌ ${message}`);
  }
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf-8');
}

// ============================
// 1. Estructura de archivos
// ============================
console.log('\n📁 1. VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS\n');

const requiredFiles = [
  'index.html',
  'recursos.html',
  'examen.html',
  'muro.html',
  'manifest.json',
  'sw.js',
  'css/styles.css',
  'js/main.js',
  'js/simulations.js',
  'js/simulations-advanced.js',
  'js/exam-data.js',
  'js/exam-engine.js',
  'js/quiz.js',
  'js/flashcards.js',
  'js/search.js',
  'js/search-worker.js',
  'js/highlighter.js',
  'js/muro.js',
  'js/tts.js',
  'js/glossary.js',
  'js/playground.js',
  'js/diagrams.js',
  'js/ai-tutor.js',
  'js/text-zoom.js',
  'js/concept-map.js',
  'js/achievements.js',
  'js/annotations.js',
  'js/model-compare.js',
  'cuadernos/01-pep-martorell.html',
  'cuadernos/02-javier-ideami.html',
  'cuadernos/03-compendio-tecnico.html',
  'cuadernos/04-el-universo-del-transformer.html',
  'cuadernos/05-paradigmas-y-computacion.html',
  'cuadernos/_template.html'
];

requiredFiles.forEach(file => {
  assert(fileExists(file), `Archivo existe: ${file}`);
});

// ============================
// 2. HTML válido (basic checks)
// ============================
console.log('\n🔍 2. VERIFICACIÓN DE HTML\n');

const htmlFiles = [
  'index.html', 'recursos.html', 'examen.html', 'muro.html',
  'cuadernos/01-pep-martorell.html', 'cuadernos/02-javier-ideami.html',
  'cuadernos/03-compendio-tecnico.html', 'cuadernos/04-el-universo-del-transformer.html',
  'cuadernos/05-paradigmas-y-computacion.html'
];

htmlFiles.forEach(file => {
  if (!fileExists(file)) return;
  const content = readFile(file);
  
  assert(content.includes('<!DOCTYPE html>'), `${file}: tiene DOCTYPE`);
  assert(content.includes('<html lang="es">'), `${file}: tiene lang="es"`);
  assert(content.includes('<meta charset="UTF-8">'), `${file}: tiene charset UTF-8`);
  assert(content.includes('viewport'), `${file}: tiene meta viewport`);
  assert(content.includes('</html>'), `${file}: cierra tag html`);
  assert(content.includes('manifest.json'), `${file}: enlaza manifest.json`);
});

// ============================
// 3. Script tags completos
// ============================
console.log('\n📜 3. VERIFICACIÓN DE SCRIPT TAGS\n');

// Cuadernos deben tener annotations.js y achievements.js
const cuadernoFiles = [
  'cuadernos/01-pep-martorell.html', 'cuadernos/02-javier-ideami.html',
  'cuadernos/03-compendio-tecnico.html', 'cuadernos/04-el-universo-del-transformer.html',
  'cuadernos/05-paradigmas-y-computacion.html'
];

cuadernoFiles.forEach(file => {
  if (!fileExists(file)) return;
  const content = readFile(file);
  assert(content.includes('annotations.js'), `${file}: incluye annotations.js`);
  assert(content.includes('achievements.js'), `${file}: incluye achievements.js`);
  assert(content.includes('quiz.js'), `${file}: incluye quiz.js`);
  assert(content.includes('main.js'), `${file}: incluye main.js`);
});

// Index debe tener concept-map y achievements
{
  const content = readFile('index.html');
  assert(content.includes('concept-map.js'), 'index.html: incluye concept-map.js');
  assert(content.includes('achievements.js'), 'index.html: incluye achievements.js');
  assert(content.includes('concept-map-target'), 'index.html: tiene concept-map-target div');
}

// Recursos debe tener nuevos simuladores y model-compare
{
  const content = readFile('recursos.html');
  assert(content.includes('simulations-advanced.js'), 'recursos.html: incluye simulations-advanced.js');
  assert(content.includes('model-compare.js'), 'recursos.html: incluye model-compare.js');
  assert(content.includes('backprop-visualizer-target'), 'recursos.html: tiene backprop target div');
  assert(content.includes('gradient-descent-target'), 'recursos.html: tiene gradient-descent target div');
  assert(content.includes('model-compare-target'), 'recursos.html: tiene model-compare target div');
  assert(content.includes('rope-visualizer-target'), 'recursos.html: tiene rope-visualizer target div');
  assert(content.includes('moe-router-target'), 'recursos.html: tiene moe-router target div');
  assert(content.includes('attention-variants-target'), 'recursos.html: tiene attention-variants target div');
  assert(content.includes('lora-visualizer-target'), 'recursos.html: tiene lora-visualizer target div');
  assert(content.includes('13 Simuladores'), 'recursos.html: badge muestra 13 simuladores');
}

// ============================
// 4. JS sintaxis (basic check)
// ============================
console.log('\n⚙️  4. VERIFICACIÓN DE SINTAXIS JS\n');

const jsFiles = [
  'js/simulations-advanced.js',
  'js/concept-map.js',
  'js/achievements.js',
  'js/annotations.js',
  'js/model-compare.js',
  'js/ai-tutor.js',
  'js/exam-engine.js',
  'js/muro.js'
];

jsFiles.forEach(file => {
  if (!fileExists(file)) return;
  const content = readFile(file);
  
  // Basic structural checks
  assert(content.includes("'use strict'"), `${file}: usa strict mode`);
  assert(content.length > 1000, `${file}: tiene contenido sustancial (${content.length} bytes)`);
  
  // Accurate syntax check using Node vm module
  let syntaxOk = true;
  let syntaxErr = '';
  try {
    const vm = require('vm');
    new vm.Script(content, { filename: file });
  } catch (e) {
    syntaxOk = false;
    syntaxErr = e.message;
  }
  assert(syntaxOk, `${file}: sintaxis JS válida (AST parse) ${syntaxErr ? '- ' + syntaxErr : ''}`);
});

// ============================
// 5. PWA Manifest
// ============================
console.log('\n📱 5. VERIFICACIÓN DE PWA\n');

{
  const content = readFile('manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(content);
    assert(true, 'manifest.json: es JSON válido');
  } catch (e) {
    assert(false, `manifest.json: error de parseo JSON: ${e.message}`);
  }

  if (manifest) {
    assert(manifest.name && manifest.name.length > 0, 'manifest.json: tiene name');
    assert(manifest.short_name && manifest.short_name.length > 0, 'manifest.json: tiene short_name');
    assert(manifest.start_url, 'manifest.json: tiene start_url');
    assert(manifest.display === 'standalone', 'manifest.json: display = standalone');
    assert(manifest.icons && manifest.icons.length >= 5, `manifest.json: tiene ${manifest.icons?.length || 0} iconos (mínimo 5)`);
    assert(manifest.lang === 'es', 'manifest.json: lang = es');
    assert(manifest.shortcuts && manifest.shortcuts.length >= 3, `manifest.json: tiene ${manifest.shortcuts?.length || 0} shortcuts`);
  }
}

// Service Worker
{
  const content = readFile('sw.js');
  assert(content.includes('simulations-advanced.js'), 'sw.js: cachea simulations-advanced.js');
  assert(content.includes('concept-map.js'), 'sw.js: cachea concept-map.js');
  assert(content.includes('achievements.js'), 'sw.js: cachea achievements.js');
  assert(content.includes('annotations.js'), 'sw.js: cachea annotations.js');
  assert(content.includes('model-compare.js'), 'sw.js: cachea model-compare.js');
  assert(content.includes('katex'), 'sw.js: cachea KaTeX CDN');
}

// ============================
// 6. CSS Responsive
// ============================
console.log('\n🎨 6. VERIFICACIÓN DE CSS RESPONSIVE\n');

{
  const content = readFile('css/styles.css');
  assert(content.includes('prefers-reduced-motion'), 'styles.css: tiene prefers-reduced-motion');
  assert(content.includes('max-width: 480px'), 'styles.css: tiene breakpoint 480px (extra small)');
  assert(content.includes('max-width: 768px'), 'styles.css: tiene breakpoint 768px (mobile)');
  assert(content.includes('mobile-open'), 'styles.css: tiene clase mobile-open para nav');
  assert(content.includes('skip-to-content'), 'styles.css: tiene skip-to-content accesibilidad');
  assert(content.includes('focus-visible'), 'styles.css: tiene estilos focus-visible');
}

// ============================
// Resumen
// ============================
console.log('\n' + '='.repeat(50));
console.log(`\n📊 RESULTADOS: ${passed} pasaron, ${failed} fallaron de ${passed + failed} tests\n`);

if (errors.length > 0) {
  console.log('❌ Fallos:');
  errors.forEach(e => console.log(`   • ${e}`));
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
