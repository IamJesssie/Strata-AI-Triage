const fs = require('fs');
let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

code = code.replace(
  /const response = await fetch\('http:\/\/localhost:8080\/api\/triage\/enhance', \{[\s\S]*?body: text\s*\}\)/,
  `const response = await fetch('http://localhost:8080/api/triage/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })`
);

code = code.replace(
  'const enhanced = await response.text()',
  `const data = await response.json()
        const enhanced = data.text`
);

fs.writeFileSync('Frontend/src/App.jsx', code);
console.log('App updated to use JSON for enhancement.');
