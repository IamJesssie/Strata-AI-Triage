const fs = require('fs');
let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

// 1. Fix Word Count calculation
code = code.replace(
  '{draft.trim().split(/s+/).filter(Boolean).length}',
  '{draft.trim().split(/\\s+/).filter(Boolean).length}'
);

// 2. Button icon cleanup
code = code.replace(
  '<button type="button" className="secondary-btn" onClick={() => onRegenerate?.(enquiry.id)} disabled={isLoading}>\n                  <RotateCw size={12} strokeWidth={1.75} />\n                  {isLoading ? \'Generating\' : \'Generate draft\'}\n                </button>',
  '<button type="button" className="icon-btn" aria-label="Regenerate draft" onClick={() => onRegenerate?.(enquiry.id)} disabled={isLoading}>\n                  <RotateCw size={12} strokeWidth={1.75} />\n                </button>'
);

code = code.replace(
  '<button type="button" className="secondary-btn" onClick={copy}>\n                  {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.75} />}\n                  {copied ? \'Copied\' : \'Copy to Clipboard\'}\n                </button>',
  '<button type="button" className="icon-btn" aria-label="Copy to clipboard" onClick={copy}>\n                  {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.75} />}\n                </button>'
);

fs.writeFileSync('Frontend/src/App.jsx', code);
console.log('Frontend patched.');
