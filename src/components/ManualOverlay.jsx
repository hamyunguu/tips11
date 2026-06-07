import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePage } from '../state/PageContext.jsx'
import { clamp } from '../lib/math.js'

// Drag area shown when the booklet is open (original `Ih`).
// Click (no drag) advances a page; drag turns pages via Framer pan.
export default function ManualOverlay({ handlePan, handlePanStart, handlePanEnd, handleMouseEnter, handleMouseLeave }) {
  const { pageIndex, setPageIndex, pageMeta } = usePage()
  const [moving, setMoving] = useState(false)
  const dragRef = useRef(null)

  const onMouseUp = () => {
    if (!moving) {
      if (pageIndex === pageMeta.length - 1) setPageIndex((d) => d - 1)
      else setPageIndex((d) => clamp(d + 1, 0, pageMeta.length - 1))
    }
    setMoving(false)
  }
  const onMouseMove = () => setMoving(true)
  const onMouseDown = () => setMoving(false)

  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.style.cursor = pageIndex === pageMeta.length - 1 ? 'w-resize' : ''
    }
  }, [pageIndex, pageMeta])

  return (
    <div
      className="_manualOverlay_895i9_1"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={dragRef}
        className="_dragArea_895i9_19"
        onPan={handlePan}
        onPanStart={handlePanStart}
        onPanEnd={handlePanEnd}
      />
    </div>
  )
}
