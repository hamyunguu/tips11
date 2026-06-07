import { useEffect, useState } from 'react'
import { cx } from '../../lib/cx.js'

// "DATA CONNECTION [GPTN]" blinking 800ms (original `Ys`).
export default function Blinker({ blinkText, className }) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 800)
    return () => clearInterval(id)
  }, [])
  return (
    <span className={cx('_blinker_nag8h_74', className)}>
      DATA CONNECTION [{on ? blinkText : '    '}]
    </span>
  )
}
