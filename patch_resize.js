const fs = require('fs');
let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

// 1. Add state for widths
code = code.replace(
  'const [selectedId, setSelectedId] = useState(null)',
  `const [selectedId, setSelectedId] = useState(null)
  const [panelWidths, setPanelWidths] = useState({ list: 320, source: 400 })`
);

// 2. Add drag handler
code = code.replace(
  'return (',
  `const startDrag = (panel, e) => {
    const startX = e.clientX
    const startWidth = panelWidths[panel]
    const onMove = (moveEvent) => {
      setPanelWidths(prev => ({ ...prev, [panel]: Math.max(150, startWidth + (moveEvent.clientX - startX)) }))
    }
    const onStop = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onStop)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onStop)
  }

  return (`
);

// 3. Update main app div grid style
code = code.replace(
  '<div className="app">',
  `<div className="app" style={{
        gridTemplateColumns: \`\${panelWidths.list}px \${panelWidths.source}px 1fr\`
      }}>`
);

// 4. Inject Resizer UI (Requires CSS updates in App.css)
code = code.replace(
  '<EnquiryList',
  `<div className="resizer" onMouseDown={(e) => startDrag('list', e)} />
          <EnquiryList`
);

code = code.replace(
  '<SourceView',
  `<div className="resizer" onMouseDown={(e) => startDrag('source', e)} />
            <SourceView`
);

fs.writeFileSync('Frontend/src/App.jsx', code);
console.log('App patched for resizable panels.');
