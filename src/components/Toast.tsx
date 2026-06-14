import { type ReactNode } from 'react'

/** A small transient toast pinned to the bottom-centre. */
export default function Toast({ content, show }: { content: ReactNode; show: boolean }) {
  return (
    <div className={`toast${show ? ' show' : ''}`} role="status" aria-live="polite">
      {content}
    </div>
  )
}
