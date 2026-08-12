// ============================================
// CURSO IA COMMERCIAL - Search Web Worker
// Handles searching without blocking the UI
// ============================================

const MAX_RESULTS = 20;
const CONTEXT_CHARS = 120;

let searchIndex = [];

// Load the search data
self.importScripts('search-data.js');

if (self.SEARCH_INDEX) {
  searchIndex = self.SEARCH_INDEX;
}

function normalizeText(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

self.onmessage = function(e) {
  const query = e.data;
  
  if (!query || query.trim().length < 2) {
    self.postMessage({ query, results: [] });
    return;
  }

  const queryNormalized = normalizeText(query);
  const terms = queryNormalized.split(/\s+/).filter(t => t.length > 1);
  if (terms.length === 0) {
    self.postMessage({ query, results: [] });
    return;
  }

  const results = [];

  for (const entry of searchIndex) {
    let allMatch = true;
    let firstMatchIndex = Infinity;

    for (const term of terms) {
      const idx = entry.textNormalized.indexOf(term);
      if (idx === -1) {
        allMatch = false;
        break;
      }
      if (idx < firstMatchIndex) firstMatchIndex = idx;
    }

    if (!allMatch) continue;

    const titleLower = normalizeText(entry.sectionTitle);
    let titleMatch = terms.some(t => titleLower.includes(t));

    const start = Math.max(0, firstMatchIndex - 40);
    const end = Math.min(entry.text.length, firstMatchIndex + CONTEXT_CHARS);
    let context = entry.text.substring(start, end);
    if (start > 0) context = '…' + context;
    if (end < entry.text.length) context = context + '…';

    results.push({
      notebook: entry.notebook,
      sectionId: entry.sectionId,
      sectionTitle: entry.sectionTitle,
      sectionNumber: entry.sectionNumber,
      context: context,
      score: (titleMatch ? 100 : 0) + (1000 - firstMatchIndex),
      terms: terms
    });
  }

  results.sort((a, b) => b.score - a.score);

  self.postMessage({
    query: query,
    results: results.slice(0, MAX_RESULTS)
  });
};
