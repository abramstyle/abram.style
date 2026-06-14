import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import Contact from './components/Contact'
import CommandPalette from './components/CommandPalette'
import Toast from './components/Toast'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useReveal } from './hooks/useReveal'

export default function App() {
  const reduce = useReducedMotion()
  useReveal(reduce)

  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [toast, setToast] = useState<ReactNode>(null)
  const [toastShown, setToastShown] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const showToast = useCallback((content: ReactNode) => {
    setToast(content)
    setToastShown(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToastShown(false), 1900)
  }, [])

  return (
    <>
      <Topbar onOpenPalette={() => setCmdkOpen(true)} />
      <Hero reduce={reduce} />
      <Contact />
      <CommandPalette open={cmdkOpen} setOpen={setCmdkOpen} reduce={reduce} showToast={showToast} />
      <Toast content={toast} show={toastShown} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
