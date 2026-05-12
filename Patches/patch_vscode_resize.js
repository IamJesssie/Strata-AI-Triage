const fs = require('fs');
let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

// Update Grid Template to support split handles
code = code.replace(
  'gridTemplateColumns: `${panelWidths.list}px ${panelWidths.source}px 1fr`',
  'gridTemplateColumns: `${panelWidths.list}px 4px ${panelWidths.source}px 4px 1fr`'
);

fs.writeFileSync('Frontend/src/App.jsx', code);

// Update CSS for VS Code look
let css = fs.readFileSync('Frontend/src/App.css', 'utf8');
css = css.replace(
  '.resizer {',
  '.resizer {\n  background: var(--bg-elevated);\n  height: 100%;\n  cursor: col-resize;\n  transition: background 0.2s;'
);
// Remove existing width/hover if any to avoid conflict
css = css.replace(
  /.resizer \{[\s\S]*?\}/,
  '.resizer {\n  background: var(--bg-elevated);\n  width: 4px;\n  cursor: col-resize;\n  transition: background 0.2s;\n  z-index: 10;\n}'
);

fs.writeFileSync('Frontend/src/App.css', css);

console.log('App and CSS patched for VS Code style resizers.');
