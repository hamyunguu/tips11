import { useEffect, useRef, useState } from 'react'

// measure an element's content box; returns [ref, rect] (original `ui`)
export function useMeasure() {
  const ref = useRef(null)
  const [rect, setRect] = useState(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setRect({ width: r.width, height: r.height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, rect]
}
