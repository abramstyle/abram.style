import { useEffect, useState } from 'react'

/** True when the user prefers reduced motion, or `?still` is in the URL. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      /still/.test(window.location.search)
    )
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches || /still/.test(window.location.search))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}
