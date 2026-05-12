import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Archive,
  AlertTriangle,
  ArrowUpDown,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  Copy,
  Filter,
  Inbox,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Reply,
  RotateCw,
  Search,
  Send,
  Settings,
  Star,
  Undo2,
  X,
  Plus
} from 'lucide-react'
import { enquiries as seed } from './data'
import './App.css'

function App() {
  const [view, setView] = useState('inbox')
  const [liveEnquiries, setLiveEnquiries] = useState([])
  const [archivedIds, setArchivedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [regenKey, setRegenKey] = useState(0)
  const [aiResults, setAiResults] = useState({})
  const [aiStatus, setAiStatus] = useState({})
  const [showNewEnquiry, setShowNewEnquiry] = useState(false)
  const [tone, setTone] = useState('Professional')
  const [signature, setSignature] = useState('Jessie Noel D. Lapure\nStrata Management Consultants')
  const [autoClassify, setAutoClassify] = useState(true)
  const [requireReview, setRequireReview] = useState(true)
  const [model, setModel] = useState('inclusionai/ring-2.6-1t:free')

  // Initialize with seed data on mount if empty
  useEffect(() => {
    if (liveEnquiries.length === 0 && seed.length > 0) {
      setLiveEnquiries(seed)
      setSelectedId(seed[0].id)
    }
  }, [liveEnquiries.length])

  const effectiveCategory = (enquiry) => overrides[enquiry.id]?.category ?? enquiry.ai.classification

  const normalizeTriage = (result, fallbackModel) => {
    const normalizeLabel = (value, fallback) => {
      if (!value) return fallback
      return String(value)
        .toLowerCase()
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    }

    const actions = Array.isArray(result.actions)
      ? result.actions.map((action, index) => ({
          id: `ai-${index + 1}`,
          label: action.label ?? 'Follow up',
          checked: Boolean(action.checked),
        }))
      : []

    return {
      classification: normalizeLabel(result.classification, 'General'),
      priority: normalizeLabel(result.priority, 'Low'),
      confidence: Number.isFinite(result.confidence) ? result.confidence : 70,
      intent: result.intent ?? '',
      actions,
      draft: result.draft ?? '',
      model: result.model ?? fallbackModel,
      source: result.source ?? 'openrouter',
      generatedAt: new Date().toISOString(),
    }
  }

  const requestTriage = async (enquiry) => {
    if (!enquiry) return
    setAiStatus((prev) => ({ ...prev, [enquiry.id]: { state: 'loading' } }))
    try {
      const response = await fetch('http://localhost:8080/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone,
          signature,
          sender: enquiry.sender,
          email: enquiry.email,
          subject: enquiry.subject,
          body: enquiry.body,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error ${response.status}`)
      }

      const result = await response.json()
      const normalized = normalizeTriage(result, enquiry.ai.model ?? 'inclusionai/ring-2.6-1t:free')
      setAiResults((prev) => ({ ...prev, [enquiry.id]: normalized }))
      setAiStatus((prev) => ({ ...prev, [enquiry.id]: { state: 'ready' } }))
      setRegenKey((value) => value + 1)
    } catch (error) {
      setAiStatus((prev) => ({
        ...prev,
        [enquiry.id]: { state: 'error', message: error?.message ?? 'Failed to reach API' },
      }))
    }
  }

  const handleNewEnquirySubmit = (data) => {
    const id = `ENQ-${Math.floor(Math.random() * 10000)}`
    const newEnq = {
      id,
      sender: data.sender,
      email: data.email,
      subject: data.subject,
      preview: data.body.substring(0, 80) + '...',
      body: data.body,
      receivedAt: 'Just now',
      timeAgo: '0m',
      unread: true,
      ai: {
        classification: 'General',
        confidence: 0,
        priority: 'Low',
        intent: 'Processing...',
        actions: [],
        draft: ''
      }
    }
    setLiveEnquiries((prev) => [newEnq, ...prev])
    setSelectedId(id)
    setShowNewEnquiry(false)
    requestTriage(newEnq)
  }

  const inboxEnquiries = useMemo(
    () => liveEnquiries.filter((enquiry) => !archivedIds.has(enquiry.id)),
    [liveEnquiries, archivedIds],
  )
  const archivedEnquiries = useMemo(
    () => liveEnquiries.filter((enquiry) => archivedIds.has(enquiry.id)),
    [liveEnquiries, archivedIds],
  )

  const baseList = view === 'archive' ? archivedEnquiries : inboxEnquiries

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return baseList.filter((enquiry) => {
      if (categoryFilter && effectiveCategory(enquiry) !== categoryFilter) return false
      if (!query) return true
      return (
        enquiry.sender.toLowerCase().includes(query) ||
        enquiry.subject.toLowerCase().includes(query) ||
        enquiry.preview.toLowerCase().includes(query) ||
        enquiry.body.toLowerCase().includes(query) ||
        enquiry.id.toLowerCase().includes(query)
      )
    })
  }, [baseList, categoryFilter, search, overrides])

  useEffect(() => {
    if (view === 'settings') return
    if (filtered.length === 0) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filtered.find((enquiry) => enquiry.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId, view])

  const categoryCounts = useMemo(() => {
    const counts = { Support: 0, 'New Client': 0, Complaint: 0, General: 0 }
    inboxEnquiries.forEach((enquiry) => {
      counts[effectiveCategory(enquiry)] += 1
    })
    return counts
  }, [inboxEnquiries, overrides])

  const inboxUnread = inboxEnquiries.filter((enquiry) => enquiry.unread).length

  const handleSend = (id) => {
    setArchivedIds((prev) => new Set(prev).add(id))
  }

  const handleArchive = (id) => {
    setArchivedIds((prev) => new Set(prev).add(id))
  }

  const handleRegenerate = (id) => {
    const target = liveEnquiries.find((enquiry) => enquiry.id === id)
    if (target) requestTriage(target)
  }

  const handleOverride = (id, category, reason) =>
    setOverrides((prev) => ({ ...prev, [id]: { category, reason, at: new Date().toISOString() } }))

  const handleClearOverride = (id) =>
    setOverrides((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const displayItems = useMemo(
    () =>
      filtered.map((enquiry) => {
        const ai = aiResults[enquiry.id] ?? enquiry.ai
        return { ...enquiry, ai: { ...ai, classification: effectiveCategory({ ...enquiry, ai }) } }
      }),
    [filtered, overrides, aiResults],
  )

  const selected = selectedId ? displayItems.find((enquiry) => enquiry.id === selectedId) ?? null : null

  return (
    <div className="app">
      {showNewEnquiry && (
        <NewEnquiryModal onClose={() => setShowNewEnquiry(false)} onSubmit={handleNewEnquirySubmit} />
      )}
      <NavRail
        active={view}
        onChange={(next) => {
          setView(next)
          setSearch('')
        }}
        onNewEnquiry={() => setShowNewEnquiry(true)}
        inboxCount={inboxEnquiries.length}
        archiveCount={archivedEnquiries.length}
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categoryCounts={categoryCounts}
      />

      {view === 'settings' ? (
        <SettingsView 
          onCancel={() => setView('inbox')} 
          tone={tone} setTone={setTone}
          signature={signature} setSignature={setSignature}
          autoClassify={autoClassify} setAutoClassify={setAutoClassify}
          requireReview={requireReview} setRequireReview={setRequireReview}
          model={model} setModel={setModel}
        />
      ) : (
        <>
          <EnquiryList
            view={view}
            items={displayItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onArchive={handleArchive}
            totalCount={displayItems.length}
            unreadCount={inboxUnread}
            filterChip={categoryFilter}
            onClearFilter={() => setCategoryFilter(null)}
          />

          {selected ? (
            <>
              <SourceView enquiry={selected} />
              <AIInsights tone={tone} signature={signature}
                key={`${selected.id}-${regenKey}`}
                enquiry={selected}
                override={overrides[selected.id]?.category ?? null}
                onOverride={handleOverride}
                onClearOverride={handleClearOverride}
                onSend={handleSend}
                onRegenerate={handleRegenerate}
                status={aiStatus[selected.id]}
              />
            </>
          ) : (
            <EmptyState
              icon={view === 'archive' ? Archive : Inbox}
              title={view === 'archive' ? 'Nothing archived yet' : 'Inbox zero'}
              desc={
                view === 'archive'
                  ? 'Sent and resolved enquiries will appear here.'
                  : search || categoryFilter
                    ? 'No enquiries match the current search or category filter.'
                    : 'All enquiries have been triaged. Take a breath.'
              }
              action={
                search || categoryFilter
                  ? {
                      label: 'Clear filters',
                      onClick: () => {
                        setSearch('')
                        setCategoryFilter(null)
                      },
                    }
                  : undefined
              }
            />
          )}
        </>
      )}
    </div>
  )
}

export default App

const categories = [
  { label: 'Support', dot: 'status-dot--support' },
  { label: 'New Client', dot: 'status-dot--new' },
  { label: 'Complaint', dot: 'status-dot--complaint' },
  { label: 'General', dot: 'status-dot--general' },
]

function NavRail({
  active,
  onChange,
  onNewEnquiry,
  inboxCount,
  archiveCount,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryCounts,
}) {
  const searchRef = useRef(null)
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: inboxCount },
    { id: 'archive', label: 'Archive', icon: Archive, count: archiveCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="nav-rail">
      <div className="nav-rail__header">
        <div className="brand-mark" aria-hidden="true">
          <CircleDot size={14} strokeWidth={2.25} />
        </div>
        <div className="brand-text">
          <div className="brand-title">Strata Triage</div>
          <div className="brand-subtitle">Management Consultants</div>
        </div>
      </div>

      <div className="nav-rail__search" style={{ marginBottom: '16px' }}>
        <button type="button" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={onNewEnquiry}>
          <Plus size={14} strokeWidth={2} style={{ marginRight: '6px' }} />
          New Enquiry
        </button>
      </div>

      <div className="nav-rail__search">
        <div className="search-input" role="search">
          <Search size={13} />
          <input
            ref={searchRef}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search enquiries"
          />
          {search ? (
            <button type="button" className="icon-btn icon-btn--sm" onClick={() => onSearchChange('')}>
              <X size={12} />
            </button>
          ) : (
            <span className="search-kbd">Ctrl+K</span>
          )}
        </div>
      </div>

      <div className="nav-section">
        <div className="section-label">Workspace</div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              <Icon size={15} strokeWidth={1.75} />
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="nav-count">{item.count}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="nav-section nav-section--categories">
        <div className="section-row">
          <span className="section-label">Categories</span>
          {categoryFilter && (
            <button type="button" className="clear-btn" onClick={() => onCategoryFilterChange(null)}>
              Clear
            </button>
          )}
        </div>
        {categories.map((category) => (
          <button
            key={category.label}
            type="button"
            className={`category-item ${categoryFilter === category.label ? 'category-item--active' : ''}`}
            onClick={() =>
              onCategoryFilterChange(categoryFilter === category.label ? null : category.label)
            }
          >
            <span className={`status-dot ${category.dot}`} />
            <span>{category.label}</span>
            <span className="category-count">{categoryCounts[category.label] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="nav-rail__footer">
        <div className="avatar">JL</div>
        <div className="profile">
          <div className="profile-name">Jessie Noel D. Lapure</div>
          <div className="profile-role">Triage Operator</div>
        </div>
        <span className="status-dot status-dot--online" />
      </div>
    </aside>
  )
}

function EnquiryList({
  view,
  items,
  selectedId,
  onSelect,
  onArchive,
  totalCount,
  unreadCount,
  filterChip,
  onClearFilter,
}) {
  const Icon = view === 'inbox' ? Inbox : Archive
  const title = view === 'inbox' ? 'Inbox' : 'Archive'

  return (
    <section className="enquiry-list">
      <div className="panel-header">
        <div className="header-title">
          <Icon size={14} strokeWidth={1.75} />
          <div>
            <div className="header-title__main">{title}</div>
            <div className="header-title__sub">
              {totalCount} {totalCount === 1 ? 'enquiry' : 'enquiries'}
              {view === 'inbox' && unreadCount > 0 ? ` - ${unreadCount} unread` : ''}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" className="icon-btn icon-btn--sm" aria-label="Filter">
            <Filter size={12} strokeWidth={1.75} />
          </button>
          <button type="button" className="icon-btn icon-btn--sm" aria-label="Sort">
            <ArrowUpDown size={12} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {filterChip && (
        <div className="filter-row">
          <span className="pill pill--accent">{filterChip}</span>
          <button type="button" className="clear-btn" onClick={onClearFilter}>
            Clear
          </button>
        </div>
      )}

      <div className="enquiry-items">
        {items.length === 0 ? (
          <div className="empty-list">No enquiries match the current filter.</div>
        ) : (
          items.map((enquiry) => (
            <div
              key={enquiry.id}
              role="button"
              tabIndex={0}
              className={`enquiry-item ${enquiry.id === selectedId ? 'enquiry-item--active' : ''}`}
              onClick={() => onSelect(enquiry.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(enquiry.id)
                }
              }}
            >
              {enquiry.id === selectedId && <span className="selection-bar" aria-hidden="true" />}
              <div className="enquiry-row">
                <span className={`status-dot status-dot--${enquiry.ai.classification.replace(' ', '').toLowerCase()}`} />
                <span className="enquiry-sender">{enquiry.sender}</span>
                <div className="enquiry-actions">
                  <span className="enquiry-time">{enquiry.timeAgo}</span>
                  {view === 'inbox' && (
                    <button
                      type="button"
                      className="archive-btn"
                      onClick={(event) => {
                        event.stopPropagation()
                        onArchive?.(enquiry.id)
                      }}
                      aria-label="Archive enquiry"
                    >
                      <Archive size={12} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </div>
              <div className="enquiry-subject clamp-1">{enquiry.subject}</div>
              <div className="enquiry-snippet clamp-2">{enquiry.preview}</div>
              <div className="enquiry-meta">
                <span className="pill pill--neutral">{enquiry.ai.classification}</span>
                <span className="meta-sep">-</span>
                <span className="meta-id">{enquiry.id}</span>
                {enquiry.unread && view === 'inbox' && <span className="unread-dot" />}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

function SourceView({ enquiry }) {
  const [starred, setStarred] = useState(false)

  const handlePlaceholderClick = (action) => {
    alert(`${action} functionality would open here.`)
  }

  return (
    <section className="source-view">
      <div className="panel-header panel-header--source">
        <div className="source-title">
          <span className="source-id">{enquiry.id}</span>
          <span className="source-sep">/</span>
          <span className="source-subject clamp-1">{enquiry.subject}</span>
        </div>
        <div className="source-actions">
          <button type="button" className="icon-btn" aria-label="Star" onClick={() => setStarred(!starred)}>
            <Star size={13} strokeWidth={1.75} fill={starred ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="icon-btn" aria-label="Reply" onClick={() => handlePlaceholderClick('Reply')}>
            <Reply size={13} strokeWidth={1.75} />
          </button>
          <button type="button" className="icon-btn" aria-label="More Options" onClick={() => handlePlaceholderClick('More Options')}>
            <MoreHorizontal size={13} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="source-body">
        <div className="source-card">
          <div className="source-card__header">
            <div className="sender">
              <div className="sender-avatar">
                {enquiry.sender
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="sender-name">{enquiry.sender}</div>
                <div className="sender-meta">
                  to <span>triage@stratamc.com</span> - {enquiry.receivedAt}
                </div>
              </div>
            </div>
            <button type="button" className="attachment-btn" onClick={() => handlePlaceholderClick('View Attachments')}>
              <Paperclip size={12} strokeWidth={1.75} />
              <span>2 attachments</span>
            </button>
          </div>
          <div className="source-card__content">{enquiry.body}</div>
          <div className="source-card__footer">
            <span>Received via support@stratamc.com - SPF/DKIM verified</span>
            <span className="parse-status">
              <span className="status-dot status-dot--online" />
              Parsed cleanly
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function AIInsights({ enquiry, override, onOverride, onClearOverride, onSend, onRegenerate, status, tone, signature }) {
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
  const sourceLabel = ai.source ? `via ${ai.source}` : null
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
          {statusBadge && <span className={`pill pill--${statusBadge.tone}`}>{statusBadge.label}</span>}
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
                          className={`override-item ${isPending ? 'override-item--active' : ''}`}
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
            <span className={`pill pill--${effectiveClassification.replace(' ', '').toLowerCase()}`}>
              {effectiveClassification}
            </span>
            <span className={`pill pill--priority-${(ai.priority || 'low').toLowerCase()}`}>
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
            <span className={`confidence-value ${isOverridden ? 'confidence-value--muted' : ''}`}>
              {confidenceValue}% Certain
            </span>
          </div>
          <div className="confidence-bar">
            <span
              className={`confidence-fill ${isOverridden ? 'confidence-fill--muted' : ''}`}
              style={{ width: `${confidenceValue}%` }}
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
                <button type="button" className={`checkbox ${action.checked ? 'checkbox--checked' : ''}`} onClick={() => toggle(action.id)}>
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
              <div className="draft-tone">Tone: {tone || "Professional"}</div>
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
                {draft.trim().split(/s+/).filter(Boolean).length} words
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
              { title: 'Classified by model', meta: `${ai.classification || 'General'} - ${confidenceValue}%` },
              ...(isOverridden
                ? [{ title: 'Operator override', meta: `${ai.classification} -> ${override} - Jessie Noel D. Lapure` }]
                : []),
              { title: isOverridden ? 'Routing updated' : 'Awaiting operator review', meta: '-' },
            ].map((item, index, array) => (
              <li key={item.title} className="audit-item">
                <div className="audit-marker">
                  <span className={`audit-dot ${index === array.length - 1 ? 'audit-dot--end' : ''}`} />
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
}
function Section({ title, children, trailing }) {
  return (
    <section className="ai-section">
      <div className="section-header">
        <span className="section-label">{title}</span>
        {trailing}
      </div>
      {children}
    </section>
  )
}

function SettingsView({ onCancel, tone, setTone, signature, setSignature, autoClassify, setAutoClassify, requireReview, setRequireReview, model, setModel }) {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="settings-view">
      <div className="panel-header panel-header--settings">
        <div className="header-title__main">Settings</div>
      </div>
      <div className="settings-content">
        <SettingsSection title="Operator" desc="Identity used to sign outbound responses.">
          <SettingsField label="Display name">
            <input defaultValue="Jessie Noel D. Lapure" />
          </SettingsField>
          <SettingsField label="Email signature">
            <textarea value={signature} onChange={(event) => setSignature(event.target.value)} />
          </SettingsField>
        </SettingsSection>

        <SettingsSection title="Response defaults" desc="Tone preset and behaviour applied to new drafts.">
          <SettingsField label="Default tone">
            <div className="tone-grid">
              {['Professional', 'Empathetic', 'Firm', 'Brief'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`tone-btn ${tone === option ? 'tone-btn--active' : ''}`}
                  onClick={() => setTone(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </SettingsField>

          <Toggle
            label="Auto-classify on arrival"
            desc="Run the classifier the moment an enquiry lands."
            value={autoClassify}
            onChange={setAutoClassify}
          />
          <Toggle
            label="Require human review before send"
            desc="Block Send until the operator has reviewed the draft."
            value={requireReview}
            onChange={setRequireReview}
          />
        </SettingsSection>

        <SettingsSection title="Model" desc="Which model powers classification and drafting.">
          <SettingsField label="Active model">
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              <option>inclusionai/ring-2.6-1t:free</option>
            </select>
          </SettingsField>
          <div className="settings-note">
            Drafts and classifications are generated by the backend when available. If the API is offline, the UI falls back to the mock dataset.
          </div>
        </SettingsSection>

        <div className="settings-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="primary-btn" onClick={save}>
            {saved ? <Check size={12} strokeWidth={2.25} /> : null}
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, desc, children }) {
  return (
    <section className="settings-section">
      <header>
        <h3>{title}</h3>
        <p>{desc}</p>
      </header>
      <div className="settings-fields">{children}</div>
    </section>
  )
}

function SettingsField({ label, children }) {
  return (
    <div className="settings-field">
      <span>{label}</span>
      {children}
    </div>
  )
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <button type="button" className="toggle" onClick={() => onChange(!value)}>
      <div>
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{desc}</span>
      </div>
      <span className={`toggle-track ${value ? 'toggle-track--on' : ''}`}>
        <span className="toggle-thumb" />
      </span>
    </button>
  )
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="empty-state">
      <div className="empty-card">
        <div className="empty-icon">
          <Icon size={16} strokeWidth={1.75} />
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
        {action && (
          <button type="button" className="primary-btn" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

function NewEnquiryModal({ onClose, onSubmit }) {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <div className="header-title__main">New Enquiry</div>
          <button type="button" className="icon-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--fg-muted)' }}>Paste the body of a client email below to simulate a live AI triage workflow.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input placeholder="Sender Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
            <input placeholder="Sender Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
          </div>
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px' }} />
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%', height: '200px', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--fg)', fontSize: '13px', resize: 'none' }}
            placeholder="Dear Strata Manager..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="primary-btn" onClick={submit} disabled={!text.trim()}>
              Simulate Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
