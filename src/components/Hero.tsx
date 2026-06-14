import { type CSSProperties } from 'react'
import Aurora from './Aurora'
import Telemetry from './Telemetry'

/** Full-screen hero: aurora canvas + the domain headline and telemetry. */
export default function Hero({ reduce }: { reduce: boolean }) {
  return (
    <main id="top">
      <section className="hero" id="hero">
        <Aurora reduce={reduce} />
        <div className="grid-sky" aria-hidden="true" />
        <div className="veil" aria-hidden="true" />

        <div className="wrap hero-inner">
          <div className="hero-grid">
            <div>
              <p className="eyebrow enter" style={{ '--d': '.05s' } as CSSProperties}>
                <span className="tick" />sydney · -33.79°, 151.29°
              </p>
              <h1 className="head">
                <span className="enter" style={{ '--d': '.18s', display: 'block' } as CSSProperties}>abram</span>
                <span className="enter grad-ink" style={{ '--d': '.34s', display: 'block' } as CSSProperties}>.style</span>
              </h1>
              <p className="sub enter" style={{ '--d': '.52s' } as CSSProperties}>
                Senior software engineer —<br />connecting <b>AI</b> to real-world needs.
              </p>
            </div>

            <Telemetry />
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span className="bar" />scroll
        </div>
      </section>
    </main>
  )
}
