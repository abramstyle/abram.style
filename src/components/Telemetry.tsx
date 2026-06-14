import { useEffect, useState, type CSSProperties } from 'react'

function sydneyTime(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())
  } catch {
    return '--:--:--'
  }
}

/** The hero's "system readout" — with a live Sydney clock. */
export default function Telemetry() {
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const tick = () => setClock(sydneyTime())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="telemetry enter" style={{ '--d': '.66s' } as CSSProperties} aria-hidden="true">
      <div className="row"><span className="k">location</span><span className="v">-33.79, 151.29</span></div>
      <div className="row"><span className="k">timezone</span><span className="v">UTC+11</span></div>
      <div className="row"><span className="k">local</span><span className="v warm">{clock}</span></div>
      <div className="row"><span className="k">stack</span><span className="v">react · ts · vite</span></div>
      <div className="row"><span className="k">status</span><span className="v warm">chasing aurora<span className="blink">_</span></span></div>
    </div>
  )
}
