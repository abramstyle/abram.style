import { type CSSProperties } from 'react'

const EMAIL = 'hi@abram.style'

/** Second screen: the contact / "say hello" footer. */
export default function Contact() {
  return (
    <footer id="contact">
      <div className="wrap" style={{ width: '100%' } as CSSProperties}>
        <div className="foot-rule rise" aria-hidden="true" />
        <p className="foot-eyebrow rise">// say hello</p>
        <p className="cta rise">
          <a href={`mailto:${EMAIL}`}>
            Let&rsquo;s talk <span className="arrow">→</span>
          </a>
        </p>
        <p className="mail rise">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <div className="foot-meta">
          <div className="foot-links rise">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href="https://github.com/abramstyle" target="_blank" rel="noopener">GitHub</a>
            <a href="#top">Top</a>
          </div>
          <div className="colophon rise">
            ABRAM.STYLE — built under the southern lights<br />
            −33.79°, 151.29° · UTC+11 · sydney<br />
            type-set in Fraunces &amp; JetBrains Mono
          </div>
        </div>
      </div>
    </footer>
  )
}
