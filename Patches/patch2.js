const fs = require('fs');

let code = fs.readFileSync('Frontend/src/App.jsx', 'utf8');

const regex = /function AIInsights\(\{ enquiry, override, onOverride, onClearOverride, onSend, onRegenerate, status \}\) \{([\s\S]*?)(?=\nfunction Section)/;

const newComponent = `function AIInsights({ enquiry, override, onOverride, onClearOverride, onSend, onRegenerate, status }) {
  const ai = enquiry?.ai || {}
  const [actions, setActions] = useState(ai.actions || [])
  const [draft, setDraft] = useState(ai.draft || '')
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [pendingCategory, setPendingCategory] = useState(null)
  const [showAllActions, setShowAllActions] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!overrideOpen) return
    const onDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOverrideOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [overrideOpen])

  useEffect(() => {
    const currentAi = enquiry?.ai || {}
    setActions(currentAi.actions || [])
    setDraft(currentAi.draft || '')
    setShowAllActions(false)
  }, [enquiry])

  const toggle = (id) =>
    setActions((prev) => prev.map((action) => (action.id === id ? { ...action, checked: !action.checked } : action)))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
    } catch (error) {
      console.warn('Clipboard copy failed', error)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const send = () => {
    setSent(true)
    setTimeout(() => {
      onSend?.(enquiry.id)
      setSent(false)
    }, 700)
  }

  const effectiveClassification = override ?? ai.classification ?? 'General'
  const isOverridden = override !== null && override !== ai.classification
  const lowConfidence = (ai.confidence ?? 0) < 70 && !isOverridden
  const modelLabel = ai.model ?? 'inclusionai/ring-2.6-1t:free'
  const sourceLabel = ai.source ? \`via \${ai.source}\` : null
  const isLoading = status?.state === 'loading'
  const errorMessage = status?.state === 'error' ? status.message : null
  const confidenceValue = ai.confidence ?? 0
  const statusBadge = (() => {
    if (isLoading) return { label: 'Calling API', tone: 'neutral' }
    if (errorMessage) return { label: 'API error', tone: 'neutral' }
    if (ai.source === 'openrouter') return { label: 'API live', tone: 'accent' }
    if (ai.source === 'fallback') return { label: 'Fallback', tone: 'neutral' }
    return null
  })()

  const confirmOverride = () => {
    if (!pendingCategory) return
    onOverride(enquiry.id, pendingCategory, overrideReason.trim() || undefined)
    setOverrideOpen(false)
    setPendingCategory(null)
    setOverrideReason('')
  }

  return (
    <aside className="ai-insights">
      <div className="panel-header">
        <div className="ai-header">
          <div className="header-title__main">AI Insights</div>
          <span className="pill pill--accent">{modelLabel}</span>
          {sourceLabel && <span className="pill pill--neutral">{sourceLabel}</span>}
          {statusBadge && <span className={\`pill pill--\${statusBadge.tone}\`}>{statusBadge.label}</span>}
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Re-run analysis"
          onClick={() => onRegenerate?.(enquiry.id)}
          disabled={isLoading}
        >
          <RotateCw size={12} strokeWidth={1.75} />
        </button>
      </div>

      <div className="ai-scroll">
        <Section
          title="Classification"
          trailing={
            <div className="override" ref={menuRef}>
              <button type="button" className="ghost-btn" onClick={() => setOverrideOpen((value) => !value)}>
                <Pencil size={10} strokeWidth={1.75} />
                Manual override
              </button>
              {overrideOpen && (
                <div className="override-menu">
                  <div className="override-menu__header">
                    <div className="override-title">Override classification</div>
                    <div className="override-desc">
                      Your choice retrains the model and overrides routing for this enquiry.
                    </div>
                  </div>
                  <div className="override-menu__list">
                    {categories.map((category) => {
                      const isCurrent = category.label === effectiveClassification
                      const isAi = category.label === ai.classification
                      const isPending = pendingCategory === category.label
                      return (
                        <button
                          key={category.label}
                          type="button"
                          className={\`override-item \${isPending ? 'override-item--active' : ''}\`}
                          onClick={() => setPendingCategory(category.label)}
                        >
                          <span>{category.label}</span>
                          <span className="override-tags">
                            {isAi && <span className="override-tag">AI</span>}
                            {isCurrent && <Check size={11} strokeWidth={2.25} className="override-check" />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="override-menu__input">
                    <input
                      value={overrideReason}
                      onChange={(event) => setOverrideReason(event.target.value)}
                      placeholder="Reason (optional, feeds training data)"
                    />
                  </div>
                  <div className="override-menu__actions">
                    {isOverridden ? (
                      <button type="button" className="secondary-btn" onClick={() => onClearOverride(enquiry.id)}>
                        <Undo2 size={11} strokeWidth={1.75} />
                        Revert to AI
                      </button>
                    ) : (
                      <span />
                    )}
                    <div className="override-buttons">
                      <button type="button" className="secondary-btn" onClick={() => setOverrideOpen(false)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={confirmOverride}
                        disabled={!pendingCategory}
                      >
                        Apply override
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        >
          {isLoading && (
            <div className="warning">
              <Clock size={12} strokeWidth={1.75} />
              <div>
                <div className="warning-title">Generating new AI analysis</div>
                <div className="warning-desc">Calling the backend model. This will update classification and draft.</div>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="warning">
              <AlertTriangle size={12} strokeWidth={1.75} />
              <div>
                <div className="warning-title">AI call failed</div>
                <div className="warning-desc">{errorMessage}</div>
              </div>
            </div>
          )}
          <div className="pill-row">
            <span className={\`pill pill--\${effectiveClassification.replace(' ', '').toLowerCase()}\`}>
              {effectiveClassification}
            </span>
            <span className={\`pill pill--priority-\${(ai.priority || 'low').toLowerCase()}\`}>
              {ai.priority || 'Low'} priority
            </span>
            {isOverridden && (
              <span className="pill pill--override">
                <Pencil size={9} strokeWidth={2} />
                Operator override
              </span>
            )}
          </div>
          <div className="confidence-row">
            <span>{isOverridden ? 'AI confidence (overridden)' : 'Confidence'}</span>
            <span className={\`confidence-value \${isOverridden ? 'confidence-value--muted' : ''}\`}>
              {confidenceValue}% Certain
            </span>
          </div>
          <div className="confidence-bar">
            <span
              className={\`confidence-fill \${isOverridden ? 'confidence-fill--muted' : ''}\`}
              style={{ width: \`\${confidenceValue}%\` }}
            />
          </div>
          {lowConfidence && (
            <div className="warning">
              <AlertTriangle size={12} strokeWidth={1.75} />
              <div>
                <div className="warning-title">Low confidence -- review recommended</div>
                <div className="warning-desc">
                  The model is unsure about this classification. Verify against the source email before sending, or override the category above.
                </div>
              </div>
            </div>
          )}
          <div className="intent-box">
            <span className="intent-label">Intent summary</span>
            <p>{ai.intent || '...'}</p>
          </div>
        </Section>

        <Section title="Suggested Action">
          <div className="action-list">
            {(showAllActions ? actions : actions.slice(0, 2)).map((action) => (
              <label key={action.id} className="action-item">
                <button type="button" className={\`checkbox \${action.checked ? 'checkbox--checked' : ''}\`} onClick={() => toggle(action.id)}>
                  {action.checked && <Check size={10} strokeWidth={3} />}
                </button>
                <span className={action.checked ? 'action-text' : 'action-text action-text--muted'}>{action.label}</span>
              </label>
            ))}
          </div>
          {actions.length > 2 && !showAllActions && (
            <button type="button" className="ghost-link" onClick={() => setShowAllActions(true)}>
              <ChevronDown size={12} strokeWidth={2} />
              Show {actions.length - 2} lower-confidence suggestions
            </button>
          )}
        </Section>

        <Section
          title="Response Draft"
          trailing={
            <span className="meta-inline">
              <Clock size={10} strokeWidth={1.75} />
              Generated just now
            </span>
          }
        >
          <div className="draft-card">
            <div className="draft-header">
              <div className="draft-to">
                <span className="draft-label">To</span>
                <span className="draft-recipient">{enquiry.email}</span>
              </div>
              <div className="draft-tone">Tone: Professional</div>
            </div>
            <textarea
              className="draft-textarea"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              spellCheck={false}
              aria-label="Draft response"
            />
            <div className="draft-footer">
              <span className="draft-meta">
                {draft.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <div className="draft-actions">
                <button type="button" className="secondary-btn" onClick={() => onRegenerate?.(enquiry.id)} disabled={isLoading}>
                  <RotateCw size={12} strokeWidth={1.75} />
                  {isLoading ? 'Generating' : 'Generate draft'}
                </button>
                <button type="button" className="secondary-btn" onClick={copy}>
                  {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.75} />}
                  {copied ? 'Copied' : 'Copy to Clipboard'}
                </button>
                <button type="button" className="primary-btn" onClick={send}>
                  {sent ? <Check size={12} strokeWidth={2.25} /> : <Send size={12} strokeWidth={1.75} />}
                  {sent ? 'Sent' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Audit Trail">
          <ol className="audit-list">
            {[
              { title: 'Received', meta: enquiry.receivedAt },
              { title: 'Parsed and embedded', meta: 'auto - 0.8s' },
              { title: 'Classified by model', meta: \`\${ai.classification || 'General'} - \${confidenceValue}%\` },
              ...(isOverridden
                ? [{ title: 'Operator override', meta: \`\${ai.classification} -> \${override} - Jessie Noel D. Lapure\` }]
                : []),
              { title: isOverridden ? 'Routing updated' : 'Awaiting operator review', meta: '-' },
            ].map((item, index, array) => (
              <li key={item.title} className="audit-item">
                <div className="audit-marker">
                  <span className={\`audit-dot \${index === array.length - 1 ? 'audit-dot--end' : ''}\`} />
                  {index < array.length - 1 && <span className="audit-line" />}
                </div>
                <div>
                  <div className="audit-title">{item.title}</div>
                  <div className="audit-meta">{item.meta}</div>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </aside>
  )
}`;

code = code.replace(regex, newComponent);
fs.writeFileSync('Frontend/src/App.jsx', code);
console.log('Patched App.jsx successfully.');
