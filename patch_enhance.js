const fs = require('fs');

let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

// 1. Update NewEnquiryModal with Enhance logic
code = code.replace(
  'function NewEnquiryModal({ onClose, onSubmit }) {',
  `function NewEnquiryModal({ onClose, onSubmit }) {
  const [isEnhancing, setIsEnhancing] = useState(false)`
);

code = code.replace(
  'const submit = () => {',
  `const handleEnhance = async () => {
    if (!text.trim()) return
    setIsEnhancing(true)
    try {
      const response = await fetch('http://localhost:8080/api/triage/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text
      })
      if (response.ok) {
        const enhanced = await response.text()
        setText(enhanced)
      }
    } catch (err) {
      console.error('Enhance failed', err)
    } finally {
      setIsEnhancing(false)
    }
  }

  const submit = () => {`
);

// 2. Add Enhance button to UI
code = code.replace(
  '<button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>',
  `<button type="button" className="secondary-btn" style={{ marginRight: 'auto' }} onClick={handleEnhance} disabled={isEnhancing || !text.trim()}>
              {isEnhancing ? 'Enhancing...' : '✨ Enhance with AI'}
            </button>
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>`
);

// 3. Update Script
let script = fs.readFileSync('script.md', 'utf8');
script = script.replace(
  '"Notice the top of the inbox. The enquiry appears instantly.',
  `"But wait — let's make this even more interesting. Marcus only gave us a rough message. I'm going to click this **'✨ Enhance with AI'** button. 

Watch the text area — the AI is now taking that informal note and expanding it into a structured, professional strata enquiry automatically. This is perfect for when clients send incomplete information. Now that it looks professional, I'll hit 'Simulate Enquiry'.

Notice the top of the inbox. The enquiry appears instantly.`
);

fs.writeFileSync('Frontend/src/App.jsx', code);
fs.writeFileSync('script.md', script);
console.log('App and Script updated with Enhance feature.');
