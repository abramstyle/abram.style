import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

const EMAIL = 'hi@abram.style'

type Command = { label: string; hint: string; kw: string; run: () => void }

export default function CommandPalette({
  open,
  setOpen,
  reduce,
  showToast,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  reduce: boolean
  showToast: (content: ReactNode) => void
}) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const go = (hash: string) => {
    setOpen(false)
    document.querySelector(hash)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const copyEmail = () => {
    setOpen(false)
    const done = () =>
      showToast(
        <>
          Email copied <span className="ok">✓</span>&nbsp;&nbsp;{EMAIL}
        </>,
      )
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, () => {
        location.href = `mailto:${EMAIL}`
      })
    } else {
      location.href = `mailto:${EMAIL}`
    }
  }

  const COMMANDS: Command[] = [
    { label: 'Email', hint: 'mail', kw: 'email mail contact say hello write', run: () => { location.href = `mailto:${EMAIL}` } },
    { label: 'Copy email', hint: 'copy', kw: 'copy email clipboard address', run: copyEmail },
    { label: 'Contact', hint: '↓', kw: 'contact footer hello say', run: () => go('#contact') },
    { label: 'GitHub', hint: '↗', kw: 'github code repo open source', run: () => window.open('https://github.com/abramstyle', '_blank', 'noopener') },
    { label: 'Home', hint: 'top', kw: 'home top hero start', run: () => go('#top') },
  ]

  const q = query.trim().toLowerCase()
  const filtered = COMMANDS.filter((c) => !q || `${c.label.toLowerCase()} ${c.kw}`.includes(q))
  const selClamped = filtered.length ? Math.max(0, Math.min(sel, filtered.length - 1)) : 0

  // Latest values for the (stable) global key handler, without re-subscribing each render.
  const openRef = useRef(open)
  openRef.current = open
  const filteredRef = useRef(filtered)
  filteredRef.current = filtered
  const selRef = useRef(selClamped)
  selRef.current = selClamped

  // Focus the input on open; restore focus on close.
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null
      setQuery('')
      setSel(0)
      const id = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(id)
    }
    lastFocus.current?.focus?.()
  }, [open])

  // Global ⌘K toggle + keyboard navigation while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (!openRef.current) return
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSel((s) => Math.min(s + 1, filteredRef.current.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((s) => Math.max(s - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        filteredRef.current[selRef.current]?.run()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setOpen])

  return (
    <div
      className={`cmdk-scrim${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div className="cmdk" role="document">
        <div className="cmdk-top">
          <span className="pmt">›</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Jump to…  try 'mail', 'github'"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search commands"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSel(0)
            }}
          />
        </div>
        <div className="cmdk-list" role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <div className="cmdk-empty">No matches — try another keyword</div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.label}
                className="cmd"
                role="option"
                aria-selected={i === selClamped}
                onMouseMove={() => setSel(i)}
                onClick={() => c.run()}
              >
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <span className="lab">{c.label}</span>
                <span className="hint">
                  {c.hint} <span className="arrow">↵</span>
                </span>
              </div>
            ))
          )}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
