const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

const searchStr = "document.addEventListener('DOMContentLoaded',";
const replaceStr = "(function(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } })(";

let changedFiles = 0;

for (const file of files) {
  const filePath = path.join(jsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(searchStr)) {
    content = content.replaceAll(searchStr, replaceStr);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
    changedFiles++;
  }
}

console.log(`Done. Changed ${changedFiles} files.`);
