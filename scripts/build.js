const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..');
const cuadernosPath = path.join(basePath, 'cuadernos');
const indexHtmlPath = path.join(basePath, 'index.html');
const outSearchPath = path.join(basePath, 'js', 'search-data.js');

// Simple function to remove accents for better searching
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// 1. Scan and Parse Notebooks
const notebooks = [];
const searchIndex = [];

const files = fs.readdirSync(cuadernosPath).filter(f => f.endsWith('.html') && !f.startsWith('_'));

for (const file of files) {
  const filePath = path.join(cuadernosPath, file);
  const html = fs.readFileSync(filePath, 'utf-8');

  // Extract Metadata
  const idMatch = file.match(/^([^.]+)\.html$/);
  if (!idMatch) continue;
  const id = idMatch[1];

  // Try to parse number from page-meta badge
  const metaBadgeMatch = html.match(/<span class="meta-badge">([^<]+)<\/span>/);
  const number = metaBadgeMatch ? metaBadgeMatch[1].toUpperCase() : `CUADERNO ${id.split('-')[0]}`;

  // Title
  const titleMatch = html.match(/<h1 class="page-title">([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : id;

  // Guest
  const guestMatch = html.match(/<div class="guest-info">\s*<h3>([^<]+)<\/h3>/);
  const guestBadgeMatch = html.match(/<span class="meta-badge blue">([^<]+)<\/span>/);
  let guest = guestMatch ? guestMatch[1].trim() : 'Pendiente';
  if (guestBadgeMatch) guest += ` — ${guestBadgeMatch[1].trim()}`;

  // Description
  const descMatch = html.match(/<meta name="description" content="([^"]+)">/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Tags
  const keywordsMatch = html.match(/<meta name="keywords" content="([^"]+)">/);
  const tags = keywordsMatch ? keywordsMatch[1].split(',').map(s => s.trim()) : [];

  const nb = {
    id: id,
    file: `cuadernos/${file}`,
    number: number,
    title: title,
    guest: guest,
    description: description,
    tags: tags
  };
  notebooks.push(nb);

  // Parse Sections for Search
  const sectionRegex = /<section\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  let match;
  
  while ((match = sectionRegex.exec(html)) !== null) {
    const sectionId = match[1];
    const sectionContent = match[2];
    
    const secTitleMatch = sectionContent.match(/<h2[^>]*>(.*?)<\/h2>/);
    const secNumberMatch = sectionContent.match(/<span[^>]*section-number[^>]*>(.*?)<\/span>/);
    
    const sectionTitle = secTitleMatch ? secTitleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    const sectionNumber = secNumberMatch ? secNumberMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    const transcriptMatch = sectionContent.match(/<div[^>]*transcript-text[^>]*>([\s\S]*?)<\/div>\s*$/i) || sectionContent.match(/<div[^>]*transcript-text[^>]*>([\s\S]*?)<\/section>/i) || [null, sectionContent];
    let text = transcriptMatch[1] || sectionContent;
    
    text = text.replace(/<[^>]*>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    text = text.replace(/\s+/g, ' ').trim();
    
    if (text.length > 0) {
      const textLower = text.toLowerCase();
      const textNormalized = removeAccents(textLower);
      
      searchIndex.push({
        notebook: {
          id: nb.id,
          file: nb.file,
          number: nb.number,
          title: nb.title,
          guest: nb.guest
        },
        sectionId,
        sectionTitle,
        sectionNumber,
        text,
        textLower,
        textNormalized
      });
    }
  }
}

// Sort notebooks by ID
notebooks.sort((a, b) => a.id.localeCompare(b.id));

// 2. Generate HTML Cards and inject into index.html
let cardsHtml = '\n';
for (const nb of notebooks) {
  cardsHtml += `      <!-- Episode ${nb.id} -->\n`;
  cardsHtml += `      <a href="${nb.file}" class="episode-card">\n`;
  cardsHtml += `        <div class="ep-number">${nb.number}</div>\n`;
  cardsHtml += `        <h3>${nb.title}</h3>\n`;
  cardsHtml += `        <div class="ep-guest">${nb.guest}</div>\n`;
  if (nb.description) {
    cardsHtml += `        <p class="ep-desc">${nb.description}</p>\n`;
  }
  if (nb.tags && nb.tags.length > 0) {
    cardsHtml += `        <div class="ep-tags">\n`;
    for (const tag of nb.tags) {
      cardsHtml += `          <span class="ep-tag">${tag}</span>\n`;
    }
    cardsHtml += `        </div>\n`;
  }
  cardsHtml += `      </a>\n\n`;
}

// Add Placeholder
cardsHtml += `      <!-- Placeholder for future episodes -->
      <div class="episode-card" style="opacity: 0.4; cursor: default; border-style: dashed;">
        <div class="ep-number">CUADERNO PRÓXIMO</div>
        <h3>Próximamente</h3>
        <div class="ep-guest">Pendiente de transcripción</div>
        <p class="ep-desc">
          El siguiente cuaderno se añadirá a medida que se proporcionen nuevas transcripciones de entrevistas.
        </p>
      </div>\n`;

// Inject into index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const replaceRegex = /(<!-- EPISODES_START -->)[\s\S]*?(<!-- EPISODES_END -->)/;
if (replaceRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(replaceRegex, `$1\n${cardsHtml}      $2`);
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log(`Updated index.html with ${notebooks.length} notebooks.`);
} else {
  console.warn("Could not find <!-- EPISODES_START --> markers in index.html");
}

// 3. Update search-data.js
const fileContent = `// AUTO-GENERATED SEARCH INDEX
// Run \`node scripts/build.js\` to update this file when you add new notebooks.
(typeof self !== 'undefined' ? self : window).SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 2)};
`;
fs.writeFileSync(outSearchPath, fileContent);
console.log(`Search index built with ${searchIndex.length} sections.`);
