import { useScrolled } from '../hooks/useScrolled'

/** Fixed top bar: wordmark + the ⌘K menu chip. Gains a glass background on scroll. */
export default function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const scrolled = useScrolled(40)

  return (
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="abram — home">
        abram<span className="dot">.</span>
      </a>
      <button className="kbd-chip" onClick={onOpenPalette} aria-label="Open command palette">
        <span>Menu</span>
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </button>
    </header>
  )
}
