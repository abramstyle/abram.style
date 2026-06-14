import { useEffect } from 'react'

/**
 * Reveals every `.rise` element as it scrolls into view (adds the `.in` class).
 * Runs once after mount, observing the static markup. Includes a bottom-of-page
 * fallback so elements that sit below the trigger margin still appear.
 */
export function useReveal(reduce: boolean): void {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.rise'))
    const revealAll = () => items.forEach((el) => el.classList.add('in'))

    if (!('IntersectionObserver' in window) || reduce) {
      revealAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 },
    )
    items.forEach((el) => io.observe(el))

    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        revealAll()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduce])
}
