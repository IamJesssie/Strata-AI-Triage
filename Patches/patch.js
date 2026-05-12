const fs = require('fs');

// Patch App.jsx
let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

code = code.replace(
  "return { label: 'Mock', tone: 'neutral' }",
  "return null"
);

code = code.replace(
  "<span className={`pill pill--${statusBadge.tone}`}>{statusBadge.label}</span>",
  "{statusBadge && <span className={`pill pill--${statusBadge.tone}`}>{statusBadge.label}</span>}"
);

fs.writeFileSync('Frontend/src/App.jsx', code);

// Patch data.js
let dataCode = fs.readFileSync('Frontend/src/data.js', 'utf8');
const prepend = `const now = new Date();
const formatTime = (minutesAgo) => {
  const d = new Date(now.getTime() - minutesAgo * 60000);
  return \`Today, \${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}\`;
}

`;
dataCode = prepend + dataCode;
dataCode = dataCode.replace(/receivedAt: 'Today, 9:42 AM'/g, "get receivedAt() { return formatTime(12) }");
dataCode = dataCode.replace(/receivedAt: 'Today, 8:18 AM'/g, "get receivedAt() { return formatTime(60) }");
dataCode = dataCode.replace(/receivedAt: 'Today, 7:55 AM'/g, "get receivedAt() { return formatTime(130) }");

fs.writeFileSync('Frontend/src/data.js', dataCode);

console.log("Patching complete.");
