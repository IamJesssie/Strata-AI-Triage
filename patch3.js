const fs = require('fs');

let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

// 1. Lift Settings State to App
code = code.replace(
  'const [showNewEnquiry, setShowNewEnquiry] = useState(false)',
  `const [showNewEnquiry, setShowNewEnquiry] = useState(false)
  const [tone, setTone] = useState('Professional')
  const [signature, setSignature] = useState('Jessie Noel D. Lapure\\nStrata Management Consultants')
  const [autoClassify, setAutoClassify] = useState(true)
  const [requireReview, setRequireReview] = useState(true)
  const [model, setModel] = useState('inclusionai/ring-2.6-1t:free')`
);

// 2. Pass to requestTriage
code = code.replace(
  'body: JSON.stringify({',
  `body: JSON.stringify({\n          tone,\n          signature,`
);

// 3. Update SettingsView signature
code = code.replace(
  /function SettingsView\(\{ onCancel \}\) \{([\s\S]*?)return \(/,
  `function SettingsView({ onCancel, tone, setTone, signature, setSignature, autoClassify, setAutoClassify, requireReview, setRequireReview, model, setModel }) {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (`
);

// 4. Update SettingsView invocation
code = code.replace(
  '<SettingsView onCancel={() => setView(\'inbox\')} />',
  `<SettingsView 
          onCancel={() => setView('inbox')} 
          tone={tone} setTone={setTone}
          signature={signature} setSignature={setSignature}
          autoClassify={autoClassify} setAutoClassify={setAutoClassify}
          requireReview={requireReview} setRequireReview={setRequireReview}
          model={model} setModel={setModel}
        />`
);

// 5. Update AIInsights invocation to pass tone
code = code.replace(
  '<AIInsights',
  '<AIInsights tone={tone} signature={signature}'
);

// 6. Update AIInsights Tone prop
code = code.replace(
  /function AIInsights\(\{ enquiry, override, onOverride, onClearOverride, onSend, onRegenerate, status \}\) \{/,
  `function AIInsights({ enquiry, override, onOverride, onClearOverride, onSend, onRegenerate, status, tone, signature }) {`
);
code = code.replace(
  '<div className="draft-tone">Tone: Professional</div>',
  '<div className="draft-tone">Tone: {tone || "Professional"}</div>'
);

// 7. Update NewEnquiryModal
code = code.replace(
  /function NewEnquiryModal\(\{ onClose, onSubmit \}\) \{([\s\S]*?)return \(/,
  `function NewEnquiryModal({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')

  const submit = () => {
    onSubmit({
      sender: name.trim() || 'Live Input User',
      email: email.trim() || 'live@stratamc.com',
      subject: subject.trim() || 'New Live Enquiry',
      body: text
    })
  }

  return (`
);

code = code.replace(
  /const handleNewEnquirySubmit = \(text\) => \{\s*const id = \`ENQ-\$\{Math\.floor\(Math\.random\(\) \* 10000\)\}\`\s*const newEnq = \{[\s\S]*?preview: text\.substring\(0, 80\) \+ '\.\.\.',\s*body: text,/,
  `const handleNewEnquirySubmit = (data) => {
    const id = \`ENQ-\${Math.floor(Math.random() * 10000)}\`
    const newEnq = {
      id,
      sender: data.sender,
      email: data.email,
      subject: data.subject,
      preview: data.body.substring(0, 80) + '...',
      body: data.body,`
);

code = code.replace(
  /onClick=\{\(\) => onSubmit\(text\)\} disabled=\{!text\.trim\(\)\}/,
  'onClick={submit} disabled={!text.trim()}'
);

code = code.replace(
  '<textarea\n            autoFocus',
  `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input placeholder="Sender Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
            <input placeholder="Sender Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
          </div>
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
          <textarea
            autoFocus`
);

fs.writeFileSync('Frontend/src/App.jsx', code);
console.log('App patched successfully.');
