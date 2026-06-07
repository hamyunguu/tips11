import { useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { clamp } from '../../lib/math.js'
import { useMeasure } from '../../lib/useMeasure.js'
import BfcmLogo from './BfcmLogo.jsx'

// DVD-bounce screensaver (original `Ud`).
export default function Bouncer() {
  const [containerRef, container] = useMeasure()
  const [bouncerRef, bouncer] = useMeasure()
  const last = useRef(0)
  const x = useMotionValue(10)
  const y = useMotionValue(10)
  const vx = useMotionValue(100)
  const vy = useMotionValue(100)

  useAnimationFrame((t) => {
    if (container && bouncer) {
      const dt = clamp((t - last.current) / 1000, 0, 0.1)
      const nx = x.get() + vx.get() * dt
      const ny = y.get() + vy.get() * dt
      if (ny + bouncer.height >= container.height || ny <= 0) vy.set(-vy.get())
      if (nx + bouncer.width >= container.width || nx <= 0) vx.set(-vx.get())
      x.set(clamp(nx, 0, container.width - bouncer.width))
      y.set(clamp(ny, 0, container.height - bouncer.height))
    }
    last.current = t
  })

  return (
    <div ref={containerRef} className="_bouncerContainer_nag8h_313">
      <motion.div className="_bouncer_nag8h_313" ref={bouncerRef} style={{ x, y }}>
        <BfcmLogo className="_bouncerSvg_nag8h_335" />
      </motion.div>
    </div>
  )
}
